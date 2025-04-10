const { default: mongoose } = require("mongoose");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres.wskitqeondoqqwdxmyhv",
  host: "aws-0-eu-west-3.pooler.supabase.com",
  database: "postgres",
  password: "cinephoria-studi",
  port: 6543,
});

pool.connect((err, client, release) => {
  if (err) {
    console.log("Erreur connexion BD", err);
    return;
  }
  console.log("Connecté à la BD");
  release();
});
const connectMongoose=async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connexion mongoDB reussie");
   

  }catch(err){
    console.error("erreur connexion mongoDB",err);
    process.exit(1);
  }
};

module.exports = {
  pool,
  mongoose,
  connectMongoose};

