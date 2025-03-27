const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres.wskitqeondoqqwdxmyhv",
  host: "aws-0-eu-west-3.pooler.supabase.com",
  database: "postgres",
  password: "...",
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

module.exports = pool;

