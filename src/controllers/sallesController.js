const Salle = require("../models/salle.js");


exports.getAllSalles = async (req, res) => {
  try {
    const salles = await Salle.getAll();
    res.status(200).json(salles);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};


exports.createSalle = async (req, res) => {
  const { nom_cinema, adresse, telephone, horaires, nombre_places, qualite } = req.body;

  if (!nom_cinema || !adresse || !telephone || !horaires || !nombre_places || !qualite) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const newSalle = await Salle.create({
      nom_cinema,
      adresse,
      telephone,
      horaires,
      nombre_places,
      qualite,
    });

    res.status(201).json({ message: "Salle ajoutée avec succès", salle: newSalle });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteSalle = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "ID salle requis" });

  try {
    const deletedSalle = await Salle.deleteById(id);
    if (!deletedSalle) {
      return res.status(404).json({ error: "Salle non trouvée" });
    }

    res.status(200).json({ message: "Salle supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
