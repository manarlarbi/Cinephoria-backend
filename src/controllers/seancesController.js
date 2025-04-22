const { pool } = require("../db/database");

exports.createSeance = async (req, res) => {
  const { id_film, id_salle, heure_debut, heure_fin } = req.body;

  if (!id_film || !id_salle || !heure_debut || !heure_fin) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const query = `
      INSERT INTO Seances (id_film, id_salle, heure_debut, heure_fin)
      VALUES ($1, $2, $3, $4)
      RETURNING id_seance`;
    const values = [id_film, id_salle, heure_debut, heure_fin];
    const { rows } = await pool.query(query, values);
    res.status(201).json({ message: "Séance créée", id_seance: rows[0].id_seance });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getAllSeances = async (req, res) => {
  try {
    const query = "SELECT * FROM Seances ORDER BY heure_debut ASC";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getAvailablesessions = async (req, res) => {
  const { id_film, nom_cinema, min_seats } = req.query;
  if (!id_film || !nom_cinema || !min_seats) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  try {
    const query = `
      SELECT 
  seance.id_seance, 
  seance.heure_debut, 
  seance.heure_fin, 
  salle.id_salle, 
  salle.nombre_places, 
  salle.qualite
FROM Seances AS seance
JOIN Salles AS salle ON seance.id_salle = salle.id_salle
WHERE seance.id_film = $1 
  AND salle.nom_cinema = $2 
  AND salle.nombre_places >= $3
ORDER BY seance.heure_debut ASC;
    `;
    const values = [id_film, nom_cinema, min_seats];
    console.log("Query:", query);
    const { rows } = await pool.query(query, values);
    console.log("Rows:", rows);
    console.table(rows);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSeance = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Seances WHERE id_seance = $1", [id]);
    res.status(200).json({ message: "Séance supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

