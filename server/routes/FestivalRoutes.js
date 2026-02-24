const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  AddPlanet,
  GetAllPlanets,
  GetPlanetById,
  UpdatePlanet,
  DeletePlanet,
} = require("../Controllers/PlanetController");

router.post("/add", AddPlanet);
router.get("/", GetAllPlanets);
router.get("/:id",  GetPlanetById);
router.put("/:id", UpdatePlanet);
router.delete("/:id", DeletePlanet);

module.exports = router;