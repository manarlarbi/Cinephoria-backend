const { pool } = require("../db/database");

class Film {
  constructor({ id_film, titre, description, duree, genre, age_minimum, affiche_url, note }) {
    this.id_film = id_film;
    this.titre = titre;
    this.description = description;
    this.duree = duree;
    this.genre = genre;
    this.age_minimum = age_minimum;
    this.affiche_url = affiche_url;
    this.note = note;
  }

  static async getAll() {
    try {
      const query = "SELECT * FROM Films";
      const { rows } = await pool.query(query);
      return rows.map(row => new Film(row));
    } catch (err) {
      throw new Error(`Erreur getting films: ${err.message}`);
    }
  }

  static async create(data) {
    try {
      const { titre, description, duree, genre, age_minimum, affiche_url, note } = data;
      const query = `
        INSERT INTO Films (titre, description, duree, genre, age_minimum, affiche_url, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
      const values = [titre, description, Number(duree), genre, Number(age_minimum), affiche_url, Number(note) || 0];
      const { rows } = await pool.query(query, values);
      return new Film(rows[0]);
    } catch (err) {
      throw new Error(`Erreurr creating film: ${err.message}`);
    }
  }

  static async deleteById(id_film) {
    try {
      const query = "DELETE FROM Films WHERE id_film = $1 RETURNING *";
      const { rows } = await pool.query(query, [id_film]);
    if (rows[0]) {
        return new Film(rows[0]);
      }else {
        return null;
      }
    } catch (err) {
      throw new Error(`Error supprimant le film: ${err.message}`);
    }
  }

  static async getById(id_film){
    const query="SELECT * FROM Films WHERE id_film = $1";
    const {rows}=await pool.query(query,[id_film]);
    if (rows[0]){
      return new Film(rows[0]);
    }else{
      return null;
    }
  }
}   

module.exports = Film;
