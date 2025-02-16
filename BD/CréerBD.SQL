CREATE TABLE IF NOT EXISTS Utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    email          VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe   VARCHAR(255) NOT NULL,
    prenom         VARCHAR(100),
    nom            VARCHAR(100),
    nom_utilisateur VARCHAR(100) UNIQUE,
    date_naissance DATE,
    role           VARCHAR(50) CHECK (role IN ('Utilisateur', 'Employé', 'Administrateur')) DEFAULT 'Utilisateur',
    date_creation  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);