jest.mock("../db/pool", () => ({
    query: jest.fn(),
  }));
  
  jest.mock("bcrypt", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
  }));
  
  jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
  }));
  const pool = require("../db/pool");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const { inscription, connexion } = require("../controllers/authController"); 
  describe("inscription", () => {
    it("devrait inscrire un utilisateur et retourner un token", async () => {
      const req = {
        body: {
          email: "test@example.com",
          mot_de_passe: "secret",
          prenom: "Alex",
          nom: "mui",
          nom_utilisateur: "alexmui",
          date_naissance: "2000-01-01",
          role: "Utilisateur",
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      bcrypt.hash.mockResolvedValue("hashed_password");
  
      pool.query.mockResolvedValueOnce({
        rows: [{ id_utilisateur: 1, role: "Utilisateur" }],
      });
  
      jwt.sign.mockReturnValue("faketoken123");
  
      await inscription(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: "faketoken123" });
    });
  });
  it("retourne 400 si l'utilisateur existe déjà", async () => {
    const req = {
      body: {
        email: "exist@example.com",
        mot_de_passe: "secret",
        nom_utilisateur: "exist",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    pool.query.mockResolvedValueOnce({
      rows: [{ id_utilisateur: 1 }],
    });
  
    await inscription(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur existe déjà" });
  });
       