const express = require("express");
const router = express.Router();
const review = require("../models/avis");
const { verifyToken, isAdmin, isEmploye } = require("../middlewares/authMiddleware");
router.post("/addReview",verifyToken, async (req, res) => {
    try {
        const newreview = new review(req.body);
        const savedReview = await newreview.save();
        res.status(201).json(savedReview);
    }
    catch (err) {
        res.status(400).json({
            error: "erreur lors de l'ajout de l'avis",
            message: err.message
        });
    }

});
router.get("/getReviews", async (req, res) => {
    try {
        const reviews = await review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: "erreur lors de la récupération des avis ", err });
    }
});
router.get("/getReviews/:id", async (req, res) => {
    try {
        const reviews = await review.find({ filmId: req.params.id });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ error: "Erreur lors de la récupération", err });
    }
});

router.delete("/deleteReview/:id",verifyToken,isAdmin,isEmploye, async (req, res) => {
    try {
        const deleteReview = await review.findByIdAndDelete(req.params.id);
        if (!deleteReview) {
            return res.status(404).json({ error: "avis non trouvé" });
        }
        res.status(200).json();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
);
router.put("/updateReview/:id",verifyToken,isAdmin,isEmploye, async (req, res) => {
    const { id } = req.params;
    const { isValider } = req.body;
    try {
        const updatedReview = await review.findByIdAndUpdate(
            id, { isValider: isValider },
            { new: true }

        );
        if (!updatedReview) {
            return res.status(404).json({ error: "avis non trouvé" });
        }
        res.status(200).json({
            message: "avis mis à jour avec succès",
            updatedReview
        });


    } catch(error) {
       res.status(400).json({error:error.message});
    }


    });
module.exports = router;