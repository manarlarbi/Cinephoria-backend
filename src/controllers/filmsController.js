const Film = require ("../models/film.js");

exports.getAllFilms = async (req, res) => {
  try {
    const films = await Film.getAll();
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.createFilm = async (req, res) => {
  const { titre, description, duree, genre, age_minimum, affiche_url, note } = req.body;

  if (!titre || !description || !duree || !genre || age_minimum === undefined || !affiche_url) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const newFilm = await Film.create({
      titre,
      description,
      duree,
      genre,
      age_minimum,
      affiche_url,
      note,
    });

    res.status(201).json({ message: "Film créé avec succès", film: newFilm });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteFilm = async (req, res) => {
  const { id_film } = req.params;

  if (!id_film) {
    return res.status(400).json({ error: "ID du film requis" });
  }

  try {
    const deletedFilm = await Film.deleteById(id_film);
    if (!deletedFilm) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    res.status(200).json({ message: "Film supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getFilmById = async (req, res) => {
  const {id_film}=req.params;
  try{
    const film= await Film.getById(id_film);
    if(!film){
      return res.status(404).json({error:"Film non trouvé"});
    }
    res.status(200).json(film); 
  }catch(err){
    res.status(500).json({error:"Erreur serveur"});
  }
};
