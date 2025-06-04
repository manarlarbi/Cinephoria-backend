#  Cinephoria Backend

Cinéphoria Backend est l’API centrale de l'écosystème Cinephoria. Elle permet :

- La gestion de l’authentification (JWT)
- L’enregistrement et la connexion des utilisateurs
- La gestion des films, séances, réservations, utilisateurs, employés, avis, salles...
- La connexion à des bases de données PostgreSQL et MongoDB

---

## Technologies utilisées

- **Node.js + Express**
- **PostgreSQL** via `pg`
- **MongoDB** via `mongoose`
- **JWT** pour l’authentification
- **dotenv**, **cors**, **bcrypt** pour la sécurité et la configuration
- **Jest** pour les tests
- **Docker + docker-compose** pour l’orchestration

---

##  Structure du projet

```plaintext
├── Cinephoria-backend-main/
│   ├── Dockerfile
│   ├── README.md
│   ├── docker-compose.yaml
│   ├── package.json
│   ├── yarn.lock
├── src/
│   ├── server.js
│   ├── controllers/
│   │   ├── EmployeController.js
│   │   ├── ReservationController.js
│   │   ├── authController.js
│   │   ├── filmsController.js
│   │   ├── sallesController.js
│   │   ├── seancesController.js
│   ├── db/
│   │   ├── database.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   ├── models/
│   │   ├── avis.js
│   │   ├── employe.js
│   │   ├── film.js
│   │   ├── reservation.js
│   │   ├── salle.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── avisRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── employeRoutes.js
│   │   ├── filmsRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── sallesRoutes.js
│   │   ├── seancesRoutes.js
│   ├── tests/
│   │   ├── authController.test.js
│   │   ├── filmsController.test.js
```

---

##  Installation locale

### Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/cinephoria-backend.git
cd cinephoria-backend
```

### Installer les dépendances

```bash
npm install
```

### Lancer le serveur

```bash
node src/server.js
```

---

##  Scripts disponibles

```json
{
  "test": "jest"
}
```

---

##  Lancer les tests

Ce backend utilise [Jest](https://jestjs.io/) pour les tests unitaires.

```bash
npm test
```

---

##  Déploiement avec Docker

Ce projet peut être lancé avec `docker-compose` :

```bash
docker-compose up --build
```

---

##  Variables d’environnement

Créer un fichier `.env` contenant :

```env
MONGODB_URI=
DB_HOST=
DB_USER=
DB_PASSWORD=
```

---


## Auteur

Développé dans le cadre du **Titre Professionnel CDA** – par _[Manar LARBI]_.

---
