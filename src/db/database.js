const { default: mongoose } = require("mongoose");
const { Pool } = require("pg");
require ("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "postgres",
  password: process.env.DB_PASSWORD,
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

