const express = require("express");
const router = express.Router();
const sallesController = require("../controllers/sallesController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", sallesController.getAllSalles);
router.get("/cinemas",sallesController.getCinema);
router.post("/creer",verifyToken,isAdmin, sallesController.createSalle);
router.delete("/:id",verifyToken,isAdmin, sallesController.deleteSalle);

module.exports = router;
