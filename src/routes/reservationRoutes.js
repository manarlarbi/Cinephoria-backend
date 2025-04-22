const express =require("express");
const router=express.Router();
const reservationController=require("../controllers/ReservationController");
const {verifyToken}=require("../middlewares/authMiddleware");
router.get("/",verifyToken,reservationController.getAllReservations);
router.get("/mes-reservations/:id_utilisateur",verifyToken,reservationController.getReservationById)
router.post("/creerReservation",verifyToken,reservationController.createReservation);
router.delete("/:id_reservation",verifyToken,reservationController.deleteReservationById);
module.exports=router;
