

// j'ai mpcké ou faire une clone du ma fichier db/pool.js
jest.mock("../db/pool", () => ({
    query: jest.fn(),
  }));
  
  const pool = require("../db/pool");
  const { getAllFilms,createFilm,deleteFilm } = require("../controllers/filmsController");
  
  describe("getAllFilms", () => {
    it("devrait retourner une liste de films", async () => {
      // je  prépare une fausse réponse
      const fakeData = [{ id_film: 1, titre: "Inception" }];
      pool.query.mockResolvedValue({ rows: fakeData });
  
      // je simule req et res
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // j'appelle la fonction
      await getAllFilms(req, res);
  
      // je vérifie que tout s'est bien passé
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });
  });
  describe("createFilm", () => {
    it("devrait créer un film et retourner 201", async () => {
      const req = {
        body: {
          titre: "Inception",
          description: "Film de rêve",
          duree: 120,
          genre: "Action",
          age_minimum: 12,
          affiche_url: "http://image.jpg",
          note: 9,
        },
      };
  
      const fakeFilm = {
        id_film: 1,
        ...req.body,
      };
  
      pool.query.mockResolvedValue({ rows: [fakeFilm] });
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await createFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Film créé avec succès",
        film: expect.objectContaining({ titre: "Inception", note: 9 }),
      });
    });
  });
  describe("deleteFilm", () => {
    it("supprime un film existant", async () => {
      const req = { params: { id_film: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      pool.query.mockResolvedValue({ rows: [{ id_film: 1, titre: "Inception" }] });
  
      await deleteFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Film supprimé avec succès",
      });
    });
  
    it("retourne 404 si le film n'existe pas", async () => {
      const req = { params: { id_film: 99 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      pool.query.mockResolvedValue({ rows: [] });
  
      await deleteFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Film non trouvé",
      });
    });
  });
    
  