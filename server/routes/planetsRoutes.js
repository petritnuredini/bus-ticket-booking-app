const express = require("express");
const router = express.Router();
const Planet = require("../models/planetModel");
const Satellite = require("../models/satelliteModel");

// a) Insert Planet - Create a new planet
router.post("/", async (req, res) => {
  try {
    const { Name, Type } = req.body;
    
    // Validation
    if (!Name || !Type) {
      return res.status(400).json({
        message: "Name and Type are required",
        success: false
      });
    }
    
    // Check if planet with same name already exists
    const existingPlanet = await Planet.findByName(Name);
    if (existingPlanet) {
      return res.status(400).json({
        message: "Planet with this name already exists",
        success: false
      });
    }
    
    const planet = await Planet.create({
      Name,
      Type,
      IsDeleted: false
    });
    
    res.status(201).json({
      message: "Planet created successfully",
      success: true,
      data: planet
    });
    
  } catch (error) {
    console.error("Error creating planet:", error);
    res.status(500).json({
      message: "Error creating planet",
      success: false,
      error: error.message
    });
  }
});

// Get all active planets
router.get("/", async (req, res) => {
  try {
    const planets = await Planet.findActive({
      include: [{
        model: Satellite,
        as: 'satellites',
        where: { IsDeleted: false },
        required: false // LEFT JOIN to include planets without satellites
      }]
    });
    
    res.status(200).json({
      message: "Planets retrieved successfully",
      success: true,
      data: planets
    });
    
  } catch (error) {
    console.error("Error fetching planets:", error);
    res.status(500).json({
      message: "Error fetching planets",
      success: false,
      error: error.message
    });
  }
});

// c) Update Planet Type - Change planet type by name
router.put("/update-type", async (req, res) => {
  try {
    const { emrin, tipin } = req.body; // emrin = old name, tipin = new type
    
    if (!emrin || !tipin) {
      return res.status(400).json({
        message: "emrin (planet name) and tipin (new type) are required",
        success: false
      });
    }
    
    const planet = await Planet.findByName(emrin);
    if (!planet) {
      return res.status(404).json({
        message: `Planet with name "${emrin}" not found`,
        success: false
      });
    }
    
    planet.Type = tipin;
    await planet.save();
    
    res.status(200).json({
      message: "Planet type updated successfully",
      success: true,
      data: planet
    });
    
  } catch (error) {
    console.error("Error updating planet type:", error);
    res.status(500).json({
      message: "Error updating planet type",
      success: false,
      error: error.message
    });
  }
});

// Get planet by name
router.get("/by-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    
    const planet = await Planet.findByName(name, false);
    if (!planet) {
      return res.status(404).json({
        message: "Planet not found",
        success: false
      });
    }
    
    res.status(200).json({
      message: "Planet retrieved successfully",
      success: true,
      data: planet
    });
    
  } catch (error) {
    console.error("Error fetching planet:", error);
    res.status(500).json({
      message: "Error fetching planet",
      success: false,
      error: error.message
    });
  }
});

// Soft delete planet
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const planet = await Planet.findByPk(id);
    if (!planet) {
      return res.status(404).json({
        message: "Planet not found",
        success: false
      });
    }
    
    await planet.softDelete();
    
    res.status(200).json({
      message: "Planet deleted successfully",
      success: true,
      data: planet
    });
    
  } catch (error) {
    console.error("Error deleting planet:", error);
    res.status(500).json({
      message: "Error deleting planet",
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
