const {pool}=require("../db/database");
class Reservation{
    constructor({id_reservation,id_utilisateur,id_seance,date_reservation,prix_total,place_reservee}){
        this.id_reservation=id_reservation;
        this.id_utilisateur=id_utilisateur;
        this.id_deance=id_seance;
        this.date_reservation=date_reservation;
        this.prix_total=prix_total;
        this.place_reservee=place_reservee;
    }
    static async getAllReservations(){
        const query="SELECT * FROM resevations";
        const {rows}=await pool.query(query);
        return rows

    }
    static async getReservationById(id_utilisateur){
        const query = `
        SELECT 
          Reservations.id_reservation,
          Reservations.date_reservation,
          Reservations.prix_total,
          Reservations.places_reservees,
          Seances.id_seance,
          Seances.heure_debut,
          Films.id_film,
          Films.titre,
          Films.affiche_url,
          Salles.nom_cinema,
          Salles.id_salle,
          Salles.qualite
        FROM Reservations
        JOIN Seances ON Reservations.id_seance = Seances.id_seance
        JOIN Films ON Seances.id_film = Films.id_film
        JOIN Salles ON Seances.id_salle = Salles.id_salle
        WHERE Reservations.id_utilisateur = $1
        ORDER BY Reservations.date_reservation DESC
      `;
    
        const {rows}=await pool.query(query,[id_utilisateur]);
        console.table(rows);
        if(rows.length===0){
            return null;
        }
        return rows
    }
    static async createReservation(data){
        const {id_utilisateur,id_seance,date_reservation,prix_total,places_reservees}=data;
        const query= `
        INSERT INTO Reservations (id_utilisateur,id_seance,date_reservation,prix_total,places_reservees)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *`;
        const values=[id_utilisateur,id_seance,date_reservation,prix_total,places_reservees];
        const {rows}=await pool.query(query,values);
        return new Reservation(rows[0]);
    }
    static async deleteReservationById(id_reservation){
        const query="DELETE FROM Reservations WHERE id_reservation=$1 RETURNING *";
        const {rows}=await pool.query(query,[id_reservation]);
        if(rows[0]){
            return new Reservation(rows[0]);
        }else{
            return null;
        }
    }
}
module.exports=Reservation;