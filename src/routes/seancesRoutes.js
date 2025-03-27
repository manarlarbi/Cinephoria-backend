const express = require("express");
const router = express.Router();
const seancesController = require("../controllers/seancesController");
const { isAdmin, verifyToken } = require("../middlewares/authMiddleware");

router.post("/creer",verifyToken,isAdmin, seancesController.createSeance);
router.get("/", seancesController.getAllSeances);
router.delete("/:id",verifyToken,isAdmin, seancesController.deleteSeance);

module.exports = router;
