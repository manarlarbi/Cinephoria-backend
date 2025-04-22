const jwt=require("jsonwebtoken");
const SECRET_KEY="manar_clef";
function verifyToken(req,res, next){
    const authHeader =req.headers.authorization;
    if(!authHeader||!authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "token manquant invalide"});
    }
    const token =authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next(); 
      } catch (err) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
      }
} 
function isAdmin(req,res,next){
  if(req.user && req.user.role==="Administrateur"){
    next();
  }else{
    return res.status(403).json({ error: "Accès refusé : réservé à l'administrateur" });
  }
}
function isEmploye(req,res,next){
  if(req.user && req.user.role==="Employé"){
    next();
  }else{
    return res.status(403).json({error:"Accès refusé : réservé a l'employé"});
  }
}
module.exports={verifyToken,isAdmin, isEmploye};