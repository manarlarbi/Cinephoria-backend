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

CREATE TABLE IF NOT EXISTS Films (
    id_film     SERIAL PRIMARY KEY,
    titre       VARCHAR(255) NOT NULL,
    description TEXT,
    duree       INT, 
    genre       VARCHAR(255), 
    age_minimum INT,
    affiche_url TEXT,
    note        REAL
);

CREATE TABLE IF NOT EXISTS Salles (
    id_salle     SERIAL PRIMARY KEY,
    nom_cinema   VARCHAR(255) NOT NULL,  
    adresse      TEXT,                  
    telephone    VARCHAR(20),          
    horaires     TEXT,                   
    nombre_places INT NOT NULL,          
    qualite      VARCHAR(50)            
);


CREATE TABLE IF NOT EXISTS Seances (
    id_seance   SERIAL PRIMARY KEY,
    id_film     INT NOT NULL REFERENCES Films(id_film) ON DELETE CASCADE,
    id_salle    INT NOT NULL REFERENCES Salles(id_salle) ON DELETE CASCADE,
    heure_debut TIMESTAMP NOT NULL,
    heure_fin   TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS Reservations (
    id_reservation   SERIAL PRIMARY KEY,
    id_utilisateur   INT NOT NULL REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    id_seance        INT NOT NULL REFERENCES Seances(id_seance) ON DELETE CASCADE,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prix_total       REAL,
    places_reservees TEXT, 
    CONSTRAINT unique_seat_per_session UNIQUE (id_seance, places_reservees)
);


CREATE TABLE IF NOT EXISTS Incidents (
    id_incident  SERIAL PRIMARY KEY,
    id_salle     INT NOT NULL REFERENCES Salles(id_salle) ON DELETE CASCADE,
    description  TEXT NOT NULL,
    date_signalement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolu       BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Contact (
    id_contact  SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(255), 
    sujet       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    date_envoi  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
