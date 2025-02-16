## Cinephoria Backend

Cinephoria est un projet pour l'ECF de STUDI, et ce dépôt concerne la partie backend.  
Ce dépôt couvre tout ce qui est lié à la création de la base de données et à la mise en place de plusieurs endpoints HTTP.  

Voici comment l'exécuter :  

```
npm install
```
Pour installer toutes les dépendances nécessaires.  

Puis :  

```
node src/server.js
```
Pour démarrer le backend.  

Veuillez insérer les informations de connexion PostgreSQL dans le code pour se connecter à la base de données.

### Avec docker
Si vous voulez utiliser docker vous pouvez utiliser cette commande:
```
docker build -t cinephoria-backend .
docker run -p 3033:3033 cinephoria-backend
```

> L'application utilise le port 3033.