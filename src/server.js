const express = require("express");
const bcrypt = require("bcrypt");
const postgres = require("pg");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

// ajout cors pour localhost
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  // logs pour chaque requete http
  console.log(req.method + " " + req.url);
  next();
});

const SECRET_KEY = "manar_clef";
const { Pool } = postgres;

// infos de connexion à la BD postgres
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "cinephoriabd",
  //// a changer !!!
  password: "mdp",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.log("Erreur connexion BD", err);
    return;
  }
  console.log("Connecté à la BD");
  release();
});

// endpoint nodejs psot request pour inscription
app.post("/inscription", async (req, res) => {
  const {
    email,
    mot_de_passe,
    prenom,
    nom,
    nom_utilisateur,
    date_naissance,
    role,
  } = req.body;
  /// verif si tous les champs sont pas vides
  if (!email || !mot_de_passe || !nom_utilisateur) {
    return res
      .status(400)
      .json({ error: "Email ou nom utilisateur et mot de passe sont requis" });
  }
  try {
    // requete sql pour verif si l'utilisateur existe deja
    const checkUser =
      "SELECT * FROM Utilisateurs WHERE email = $1 OR nom_utilisateur = $2";
    const { rows } = await pool.query(checkUser, [email, nom_utilisateur]);
    if (rows.length > 0) {
      // on a un utilisateur
      return res.status(400).json({ error: "Utilisateur existe déja" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    // sql pour inserer nouveau utilisateur
    const insertUser = `
      INSERT INTO Utilisateurs (email, mot_de_passe, prenom, nom, nom_utilisateur, date_naissance, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_utilisateur, role
    `;
    // valeurs pour le nouveau compte
    const values = [
      email,
      hashedPassword,
      prenom,
      nom,
      nom_utilisateur,
      date_naissance,
      role || "Utilisateur",
    ];
    const result = await pool.query(insertUser, values);
    const user = result.rows[0];
    // créer un token pour frontend
    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur, role: user.role },
      SECRET_KEY
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
});

app.post("/connexion", async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  try {
    /// sql pour get l'utilisateur de la bd avec email
    const query = "SELECT * FROM Utilisateurs WHERE lower(email) = lower($1)";

    const { rows } = await pool.query(query, [email.trim()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = rows[0];

    // comparer le mot de passe avec mot de passe haché
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    /// creer un token pour le frontend
    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur, role: user.role },
      SECRET_KEY
    );

    // retourner les infos de l'user
    res.status(200).json({
      token,
      role: user.role,
      email: user.email,
      id_utilisateur: user.id_utilisateur,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
});

app.get("/films", async (req, res) => {
  try {
    // recup tous les films
    const select_film_query = "SELECT * FROM Films";
    const { rows } = await pool.query(select_film_query);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/films/creer", async (req, res) => {
  // recup les infos du film depuis le front
  const { titre, description, duree, genre, age_minimum, affiche_url, note } =
    req.body;

  if (
    !titre ||
    !description ||
    !duree ||
    !genre ||
    age_minimum === undefined ||
    !affiche_url
  ) {
    return res.status(400).json({ error: "Tous les infos sont requis" });
  }

  try {
    const create_film_query = `
      INSERT INTO Films (titre, description, duree, genre, age_minimum, affiche_url, note) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_film`;

    const values = [
      titre,
      description,
      Number(duree),
      genre,
      Number(age_minimum),
      affiche_url,
      Number(note) || 0,
    ];

    await pool.query(create_film_query, values);
    res.status(201).json({ message: "Film créé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/films/:id_film", async (req, res) => {
  // effacer film par id
  const { id_film } = req.params;

  if (!id_film) {
    return res.status(400).json({ error: "ID du film requis" });
  }

  try {
    const query = "DELETE FROM Films WHERE id_film = $1";
    await pool.query(query, [id_film]);

    res.status(200).json({ message: "Film supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/seances/creer", async (req, res) => {
  const { id_film, id_salle, heure_debut, heure_fin } = req.body;
  if (!id_film || !id_salle || !heure_debut || !heure_fin) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  try {
    const query =
      "INSERT INTO Seances (id_film, id_salle, heure_debut, heure_fin) VALUES ($1, $2, $3, $4) RETURNING id_seance";

    const { rows } = await pool.query(query, [
      id_film,
      id_salle,
      heure_debut,
      heure_fin,
    ]);

    res.status(201).json({ id_seance: rows[0].id_seance });
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
});
app.get("/seances", async (req, res) => {
  try {
    const query = "SELECT * FROM Seances ORDER BY heure_debut ASC";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
});

app.post("/seances/creer", async (req, res) => {
  const { id_film, id_salle, heure_debut, heure_fin } = req.body;

  // verif si tous les infos sont la
  if (!id_film || !id_salle || !heure_debut || !heure_fin) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const query =
      "INSERT INTO Seances (id_film, id_salle, heure_debut, heure_fin) VALUES ($1, $2, $3, $4) RETURNING id_seance";
    const values = [id_film, id_salle, heure_debut, heure_fin];

    const { rows } = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "Séance créée", id_seance: rows[0].id_seance });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/seances/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Seances WHERE id_seance = $1", [id]);
    res.status(200).json({ message: "Séance supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.post("/reservations", async (req, res) => {
  const { id_utilisateur, id_seance, prix_total, places_reservees } = req.body;

  if (!id_utilisateur || !id_seance || !prix_total) {
    return res
      .status(400)
      .json({ error: "id_utilisateur, id_seance et prix_total sont requis" });
  }

  try {
    const seatsValue = places_reservees ? places_reservees : null;

    const query = `
      INSERT INTO Reservations (id_utilisateur, id_seance, prix_total, places_reservees)
      VALUES ($1, $2, $3, $4)
      RETURNING id_reservation
    `;
    const { rows } = await pool.query(query, [
      id_utilisateur,
      id_seance,
      prix_total,
      seatsValue,
    ]);
    res.status(201).json({ id_reservation: rows[0].id_reservation });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/contact", async (req, res) => {
  const { nom_utilisateur, sujet, message } = req.body;
  if (!nom_utilisateur || !sujet || !message) {
    return res.status(400).send("Tous les champs sont requis");
  }
  try {
    const query =
      "INSERT INTO Contact (nom_utilisateur, sujet, message) VALUES ($1, $2, $3)";
    await pool.query(query, [nom_utilisateur, sujet, message]);
    res.status(201).json({ message: "Message envoyé" });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

app.get("/full-seances", async (req, res) => {
  try {
    // selectionnner toutes les seances & salles
    const query = `
     SELECT 
  Seances.id_seance, 
  Seances.id_film, 
  Seances.heure_debut, 
  Seances.heure_fin,
  Salles.id_salle,
  Salles.nom_cinema,
  Salles.nombre_places,
  Salles.qualite
FROM Seances
JOIN Salles ON Seances.id_salle = Salles.id_salle
    
`;

    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.get("/cinemas", async (req, res) => {
  /// recuperer les noms des cinemas
  try {
    const query = "SELECT DISTINCT nom_cinema FROM Salles";
    const { rows } = await pool.query(query);
    res.status(200).json(rows.map((r) => r.nom_cinema));
  } catch (err) {
    console.error("Erreur /cinemas:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/available-sessions", async (req, res) => {
  try {
    // parametres de recherche, ils viennent de les listes deroulantes
    const { id_film, nom_cinema, min_seats } = req.query;

    let query = `
    SELECT 
  Seances.id_seance, 
  Seances.id_film, 
  Seances.heure_debut, 
  Seances.heure_fin,
  Salles.id_salle,
  Salles.nom_cinema,
  Salles.nombre_places,
  Salles.qualite
FROM Seances
JOIN Salles ON Seances.id_salle = Salles.id_salle;

    `;

    if (id_film) {
      // si on a un id de film, on filtre avec
      query += ` WHERE Seances.id_film = ${id_film}`;
    }
    if (nom_cinema) {
      query += ` WHERE Salles.nom_cinema = '${nom_cinema}'`;
    }
    if (min_seats) {
      query += ` WHERE Salles.nombre_places >= ${min_seats}`;
    }

    // il faut trier par heure de debut
    query += ` ORDER BY Seances.heure_debut ASC`;

    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/mes-reservations/:id_utilisateur", async (req, res) => {
  const { id_utilisateur } = req.params;

  // verifie si l'id utilisateur est la
  if (!id_utilisateur) {
    return res.status(400).json({ error: "Utilisateur non spécifié" });
  }

  try {
    // recup les reservations de l'utilisateur par id
    const query = `
SELECT 
  Reservations.id_reservation,
  Reservations.date_reservation,
  Reservations.prix_total,
  Reservations.places_reservees,
  Seances.id_seance,
  Seances.heure_debut,
  Films.id_film,
  Films.titre,
  Films.affiche_url,
  Salles.nom_cinema,
  Salles.id_salle,
  Salles.qualite

FROM Reservations
JOIN Seances ON Reservations.id_seance = Seances.id_seance
JOIN Films ON Seances.id_film = Films.id_film
JOIN Salles ON Seances.id_salle = Salles.id_salle
WHERE Reservations.id_utilisateur = $1

ORDER BY Reservations.date_reservation DESC;

    `;

    const { rows } = await pool.query(query, [id_utilisateur]);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/reservations/:id_reservation", async (req, res) => {
  /// on suupprime la reservation par id

  const { id_reservation } = req.params;

  if (!id_reservation) {
    return res.status(400).json({ error: "ID de réservation requis" });
  }
  try {
    const query = "DELETE FROM Reservations WHERE id_reservation = $1";

    const values = [id_reservation];
    await pool.query(query, values);
    res.status(200).json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/salles", async (req, res) => {
  try {
    const query = "SELECT * FROM Salles";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/salles/creer", async (req, res) => {
  const { nom_cinema, adresse, telephone, horaires, nombre_places, qualite } =
    req.body;
  if (
    !nom_cinema ||
    !adresse ||
    !telephone ||
    !horaires ||
    !nombre_places ||
    !qualite
  ) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const query = `
      INSERT INTO Salles (nom_cinema, adresse, telephone, horaires, nombre_places, qualite) 
      VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      nom_cinema,
      adresse,
      telephone,
      horaires,
      Number(nombre_places),
      qualite,
    ];
    await pool.query(query, values);
    res.status(201).json({ message: "Salle ajoutée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/salles/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID salle requis" });

  try {
    const query = "DELETE FROM Salles WHERE id_salle = $1";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Salle supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(3033, () => {
  console.log("Serveur démarré sur http://localhost:3033");
});
