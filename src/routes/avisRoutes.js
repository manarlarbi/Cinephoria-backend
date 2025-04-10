const express=require("express");
const router=express.Router();
const review= require("../models/avis");
router.post("/addReview",async(req,res)=>{
    try{
        const newreview= new review(req.body);
        const savedReview= await newreview.save();
        res.status(201).json(savedReview);}
        catch(err){
            res.status(400).json({error:"erreur lors de l'ajout de l'avis",
                message:err.message});
        }
        
});
router.get("/getReviews/:filmId",async(req,res)=>{
    try{
        const reviews=await review.find({filmId:req.params.filmId});
        res.status(200).json(reviews);
    }catch(err){
        res.status(400).json({error:"erreur lors de la récupération des avis ",err});
    }
});
module.exports =router;