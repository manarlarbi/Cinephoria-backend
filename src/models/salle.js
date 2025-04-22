const{pool} = require("../db/database");

class Salle {
  constructor({ id_salle, nom_cinema, adresse, telephone, horaires, nombre_places, qualite }) {
    this.id_salle = id_salle;
    this.nom_cinema = nom_cinema;
    this.adresse = adresse;
    this.telephone = telephone;
    this.horaires = horaires;
    this.nombre_places = nombre_places;
    this.qualite = qualite;
  }

  static async getAll() {
    const query = "SELECT * FROM Salles";
    const { rows } = await pool.query(query);
    return rows.map(row => new Salle(row));
  }
  static async getCinema(){
    const query = "SELECT DISTINCT nom_cinema FROM Salles";
    const {rows} = await pool.query(query);
    return rows.map(row => row.nom_cinema);
  }

  static async create(data) {
    const { nom_cinema, adresse, telephone, horaires, nombre_places, qualite } = data;

    const query = `
      INSERT INTO Salles (nom_cinema, adresse, telephone, horaires, nombre_places, qualite)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const values = [
      nom_cinema,
      adresse,
      telephone,
      horaires,
      Number(nombre_places),
      qualite,
    ];

    const { rows } = await pool.query(query, values);
    return new Salle(rows[0]);
  }

  static async deleteById(id_salle) {
    const query = "DELETE FROM Salles WHERE id_salle = $1 RETURNING *";
    const { rows } = await pool.query(query, [id_salle]);
    if (rows[0]) {
      return new Salle(rows[0]);
    }
    return null;
  }
}

module.exports = Salle;
