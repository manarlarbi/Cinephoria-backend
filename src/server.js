const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const filmsRoutes = require("./routes/filmsRoutes");
const seancesRoutes = require("./routes/seancesRoutes");
const sallesRoutes = require("./routes/sallesRoutes");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

app.use("/inscription", authRoutes);
app.use("/connexion", authRoutes); 
app.use("/films", filmsRoutes);
app.use("/seances", seancesRoutes);
app.use("/salles", sallesRoutes);

app.listen(3033, () => {
  console.log("Serveur démarré sur http://localhost:3033");
});
