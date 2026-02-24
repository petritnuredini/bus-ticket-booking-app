const Planet = require("../models/PlanetModel");

const AddPlanet = async (req, res) => {
  try {
    console.log("ADD Planet BODY:", req.body);

    const { emriPlanetit, llojiPlanetit } = req.body;

    const exists = await Planet.findOne({ emriPlanetit });
    if (exists) {
      return res.send({ success: false, message: "Planet already exists" });
    }

    const Planet = await new Planet({
      emriPlanetit,
      llojiPlanetit,
    }).save();

    res.send({
      success: true,
      message: "Planet created successfully",
      data: Planet,
    });
  } catch (error) {
    console.log("ADD Planet ERROR:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllPlanets = async (req, res) => {
  try {
    const data = await Planet.find().sort({ createdAt: -1 });
    res.send({ success: true, message: "Planets fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetPlanetById = async (req, res) => {
  try {
    const data = await Planet.findById(req.params.id);
    res.send({ success: true, message: "Planet fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const UpdatePlanet = async (req, res) => {
  try {
    await Planet.findByIdAndUpdate(req.params.id, req.body);
    res.send({ success: true, message: "Planet updated successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const DeletePlanet = async(req,res) =>{
  try{
    await Planet.findByIdAndDelete(req.params.id);
    res.send({ success: true, message:"Planet deleted successfully" });
  } catch(error){
    res.status(500).send({ success: false,message:error.message });
  }
};

module.exports = {
  AddPlanet,
  GetAllPlanets,
  GetPlanetById,
  UpdatePlanet,
  DeletePlanet,
};