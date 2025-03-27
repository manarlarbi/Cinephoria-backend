const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const SECRET_KEY = "manar_clef";

exports.inscription = async (req, res) => {
  const {
    email,
    mot_de_passe,
    prenom,
    nom,
    nom_utilisateur,
    date_naissance,
    role,
  } = req.body;

  if (!email || !mot_de_passe || !nom_utilisateur) {
    return res
      .status(400)
      .json({ error: "Email, nom utilisateur et mot de passe requis" });
  }

  try {
    const checkUser =
      "SELECT * FROM Utilisateurs WHERE email = $1 OR nom_utilisateur = $2";
    const { rows } = await pool.query(checkUser, [email, nom_utilisateur]);

    if (rows.length > 0) {
      return res.status(400).json({ error: "Utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const insertUser = `
      INSERT INTO Utilisateurs (email, mot_de_passe, prenom, nom, nom_utilisateur, date_naissance, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_utilisateur, role
    `;

    const result = await pool.query(insertUser, [
      email,
      hashedPassword,
      prenom,
      nom,
      nom_utilisateur,
      date_naissance,
      role || "Utilisateur",
    ]);

    const user = result.rows[0];
    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur, role: user.role },
      SECRET_KEY
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
};

exports.connexion = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const query = "SELECT * FROM Utilisateurs WHERE lower(email) = lower($1)";
    const { rows } = await pool.query(query, [email.trim()]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur, role: user.role },
      SECRET_KEY
    );

    res.status(200).json({
      token,
      role: user.role,
      email: user.email,
      id_utilisateur: user.id_utilisateur,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur de serveur" });
  }
};
