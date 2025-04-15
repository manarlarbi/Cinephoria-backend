const Employe =require('../models/employe');
exports.getEmployes=async(req,res)=>{
    try{
        console.log("Fetching all employees controller");
        const employes=await Employe.getAllEmployes();
        console.log("Employes:",employes);
        res.status(200).json(employes);

    }catch(err){
        res.status(500).json({error:err.message});
    }
}
exports.creatNewEmploye=async(req,res)=>{
    try{
     const {
        email,
    mot_de_passe,
    prenom,
    nom,
    nom_utilisateur,
    date_naissance,
    role,
     }=req.body;
     if(!nom || !prenom || !role || !email || !mot_de_passe){
        return res.status(400).json({error:"Tous les champs sont requis"});
     }
        const newEmploye =await Employe.createEmploye({
            email,
            mot_de_passe,
            prenom,
            nom,
            nom_utilisateur,
            date_naissance,
            role,
        });
        return res.status(201).json(newEmploye);
    }catch(err){
        res.status(500).json({error:err.message});
    }   }
exports.deleteNewEmploye=async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteEmploye=await Employe.deleteEmploye(id);
        if(!deleteEmploye){
            return res.status(404).json({error:"Employé non trouvé"});
        }
        res.status(200).json({message:"Employé supprimé avec succès"});
    }catch(err){
        res.status(500).json({error:"erreur serveur lors de la récuperation de l'employé"});
    }}
    