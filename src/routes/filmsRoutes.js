const express = require("express");
const router = express.Router();
const filmsController = require("../controllers/filmsController");
const { isAdmin, verifyToken } = require("../middlewares/authMiddleware");

router.get("/",filmsController.getAllFilms);
router.get("/:id_film", filmsController.getFilmById);
router.post("/creer",verifyToken,isAdmin, filmsController.createFilm);
router.delete("/:id_film",verifyToken,isAdmin, filmsController.deleteFilm);

module.exports = router;
