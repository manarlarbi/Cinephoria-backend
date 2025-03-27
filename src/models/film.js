const pool = require("../db/pool");

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
    const query = "SELECT * FROM Films";
    const { rows } = await pool.query(query);
    return rows.map(row => new Film(row));
  }

  static async create(data) {
    const { titre, description, duree, genre, age_minimum, affiche_url, note } = data;

    const query = `
      INSERT INTO Films (titre, description, duree, genre, age_minimum, affiche_url, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [
      titre,
      description,
      Number(duree),
      genre,
      Number(age_minimum),
      affiche_url,
      Number(note) || 0,
    ];

    const { rows } = await pool.query(query, values);
    return new Film(rows[0]);
  }

  static async deleteById(id_film) {
    const query = "DELETE FROM Films WHERE id_film = $1 RETURNING *";
    const { rows } = await pool.query(query, [id_film]);
    if (rows[0]) {
      return new Film(rows[0]);
    } else {
      return null;
    }
  }
}

module.exports = Film;
