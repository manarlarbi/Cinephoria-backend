
const Reservation=require("../models/reservation");
exports.getAllReservations=async(req,res)=>{
    try{
        const reservations=await Reservation.getAllReservations();
        res.status(200).json(reservations);

    }catch(err){
        res.status(500).json({error:err.message});
    }
};
exports.getReservationById=async(req,res)=>{
    const {id_utilisateur}=req.params;
    if(!id_utilisateur){
        return res.status(400).json({error:'id_utilisateur requis'});
    }
    try{
        const reservation=await Reservation.getReservationById(id_utilisateur);
        if(!reservation){
            return res.status(404).json({error:'Reservation non trouvée'});
        }
        res.status(200).json(reservation);
        

    }catch(err){
       res.status(500).json({error:err.message}); 

    }
    
};
exports.createReservation=async(req,res)=>{
    const {id_utilisateur,id_seance,prix_total,places_reservees}=req.body;
    if(!id_utilisateur || !id_seance || !prix_total || !places_reservees){
        return res.status(400).json ({error:'Tous les champs sont requis'});
    }
    try{
         const date_reservation = new Date();
        const newReservation = await Reservation.createReservation({
            id_utilisateur,
            id_seance,
            date_reservation,
            prix_total,
            places_reservees,
        })
        res.status(201).json({message:"Reservation creé avec succés", reservation:newReservation});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
exports.deleteReservationById=async(req,res)=>{
    const {id_reservation}=req.params;
    if(!id_reservation){
        return res.status(400).json({error:'id_reservation requis'});
    }
    try{
        const deleteReservation=await Reservation.deleteReservationById(id_reservation);
        if(!deleteReservation){
            return res.status(404).json({error:"Reservation non trouvée"});
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
};