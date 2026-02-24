const Planet = require("../models/PlanetModel");

const AddPlanet = async (req, res) => {
  try {
    console.log("ADD Planet BODY:", req.body);

    const exists = await Planet.findOne({
      emriPlanetit: req.body.emriPlanetit,
      PlanetId: req.body.PlanetId,
    });

    if (exists) {
      return res.send({ success: false, message: "Planet already exists" });
    }

    await new Planet(req.body).save();
    res.send({ success: true, message: "Planet created successfully" });
  } catch (error) {
    console.log("ADD Planet ERROR:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllPlanets = async (req, res) => {
  try {
    const data = await Planet.find()
      .populate("PlanetId")
      .sort({ createdAt: -1 });
    res.send({ success: true, message: "Planets fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetPlanetsByPlanet = async (req, res) => {
  try {
    const data = await Planet.find({ PlanetId: req.params.id })
      .populate("PlanetId")
      .sort({ createdAt: -1 });
    res.send({ success: true, message: "Planets fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { AddPlanet, GetAllPlanets, GetPlanetsByPlanet};