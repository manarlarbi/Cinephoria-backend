const { pool } = require('../db/database');
const SECRET_KEY = "manar_clef";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class Employe {
    constructor({ id_utilisateur, nom, prenom, role, email, mot_de_passe, date_naissance, nom_utilisateur }) {
        this.id = id_utilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.date_naissance = date_naissance;
        this.nom_utilisateur = nom_utilisateur;
    }
    static async getAllEmployes() {
        console.log("Fetching all employees");
        const query = "Select * from utilisateurs where role='Employé'";
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            return [];
        }
        return rows;
    }
    static async createEmploye(data) {
        console.table(data);
        try{
        const {nom,prenom,role,email,mot_de_passe,date_naissance,nom_utilisateur}=data;
        if(!nom||!prenom||!role||!email||!mot_de_passe,!date_naissance,!nom_utilisateur){
            return {error:"Tous les champs sont requis"};
        }
        const hashedPassword=await bcrypt.hash(mot_de_passe,10);
        const checkUser=`select * from utilisateurs where email=$1 or nom_utilisateur=$2`;
        const {rows}=await pool.query(checkUser,[email,nom_utilisateur]);
        if(rows.length>0){
            return {error:"Utilisateur existe déjà"};
        }
        const query=`insert into utilisateurs (nom,prenom,role,email,mot_de_passe,date_naissance,nom_utilisateur) values($1,$2,$3,$4,$5,$6,$7) returning *`;
        const values=[nom,prenom,role,email,hashedPassword,date_naissance,nom_utilisateur];
        const result=await pool.query(query,values);
        const user=result.rows[0];
        const token=jwt.sign({id_utilisateur:user.id_utilisateur,role:user.role},SECRET_KEY);
        return {token};
        }
        catch(err){
            console.error("Error creating employee:", err);
            return {error:err.message};
        }
        
     /**    const { nom, prenom, role, nom_utilisateur, date_naissance, email, mot_de_passe } = data;
        const query = `insert into utilisateurs (nom,prenom,role,nom_utilisateur,  date_naissance,email,mot_de_passe) values($1,$2,$3,$4,$5,$6,$7) returning *`;
        const values = [nom, prenom, role, nom_utilisateur, date_naissance, email, mot_de_passe];
        const { rows } = await pool.query(query, values);
        return new Employe(rows[0]);*/
    }

    static async deleteEmploye(id) {
        const query = `delete from utilisateurs where id_utilisateur=$1 returning *`;
        const { rows } = await pool.query(query, [id]);
        if (rows[0]) {
            return new Employe(rows[0]);
        } else {
            return null;
        }
    }

}
module.exports = Employe;
