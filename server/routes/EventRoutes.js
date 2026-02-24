const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  AddPlanet,
  GetAllPlanets,
  GetPlanetsByPlanet,
} = require("../Controllers/PlanetController");

router.post("/add",  AddPlanet);
router.get("/",  GetAllPlanets);
router.get("/by-Planet/:id", GetPlanetsByPlanet);

module.exports = router;