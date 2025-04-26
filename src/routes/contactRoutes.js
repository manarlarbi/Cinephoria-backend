
const express = require("express");
const router = express.Router();
const {pool} = require("../db/database");
router.post("/", async (req, res) => {
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
  module.exports = router;