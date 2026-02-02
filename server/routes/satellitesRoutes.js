const express = require("express");
const router = express.Router();
const Satellite = require("../models/satelliteModel");
const Planet = require("../models/planetModel");

// b) Insert Satellite - Create a new satellite linked to a planet
router.post("/", async (req, res) => {
  try {
    const { Name, PlanetId } = req.body;

    // Validation
    if (!Name || !PlanetId) {
      return res.status(400).json({
        message: "Name and PlanetId are required",
        success: false,
      });
    }

    // Check if planet exists
    const planet = await Planet.findByPk(PlanetId);
    if (!planet || planet.IsDeleted) {
      return res.status(400).json({
        message: "Planet not found or is deleted",
        success: false,
      });
    }

    const satellite = await Satellite.create({
      Name,
      PlanetId,
      IsDeleted: false,
    });

    // Include planet information in response
    const satelliteWithPlanet = await Satellite.findByPk(
      satellite.SatelliteId,
      {
        include: [
          {
            model: Planet,
            as: "planet",
          },
        ],
      }
    );

    res.status(201).json({
      message: "Satellite created successfully",
      success: true,
      data: satelliteWithPlanet,
    });
  } catch (error) {
    console.error("Error creating satellite:", error);
    res.status(500).json({
      message: "Error creating satellite",
      success: false,
      error: error.message,
    });
  }
});

// e) Get all active satellites (hide deleted ones) with optional ID exclusion
router.get("/", async (req, res) => {
  try {
    const { "ID-ne": excludeId } = req.query; // ID-ne parameter to exclude specific satellite

    let whereClause = { IsDeleted: false };

    // If ID-ne parameter is provided, exclude that satellite
    if (excludeId) {
      whereClause.SatelliteId = {
        [require("sequelize").Op.ne]: parseInt(excludeId),
      };
    }

    const satellites = await Satellite.findAll({
      where: whereClause,
      include: [
        {
          model: Planet,
          as: "planet",
          where: { IsDeleted: false },
          required: true,
        },
      ],
    });

    res.status(200).json({
      message: "Satellites retrieved successfully",
      success: true,
      data: satellites,
    });
  } catch (error) {
    console.error("Error fetching satellites:", error);
    res.status(500).json({
      message: "Error fetching satellites",
      success: false,
      error: error.message,
    });
  }
});

// Get satellites by planet ID
router.get("/by-planet/:planetId", async (req, res) => {
  try {
    const { planetId } = req.params;
    const { includeDeleted = false } = req.query;

    const satellites = await Satellite.findAll({
      where: {
        PlanetId: parseInt(planetId),
        ...(includeDeleted === "true" ? {} : { IsDeleted: false }),
      },
      include: [
        {
          model: Planet,
          as: "planet",
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Satellites retrieved successfully",
      success: true,
      data: satellites,
    });
  } catch (error) {
    console.error("Error fetching satellites:", error);
    res.status(500).json({
      message: "Error fetching satellites",
      success: false,
      error: error.message,
    });
  }
});

// d) Soft delete satellites by planet name
router.delete("/by-planet-name", async (req, res) => {
  try {
    const { emrin } = req.body; // emrin = planet name

    if (!emrin) {
      return res.status(400).json({
        message: "emrin (planet name) is required",
        success: false,
      });
    }

    const result = await Satellite.softDeleteByPlanetName(emrin);

    if (result[0] === 0) {
      return res.status(404).json({
        message: `No active satellites found for planet "${emrin}"`,
        success: false,
      });
    }

    res.status(200).json({
      message: `Successfully deleted ${result[0]} satellites for planet "${emrin}"`,
      success: true,
      data: {
        deletedCount: result[0],
        planetName: emrin,
      },
    });
  } catch (error) {
    console.error("Error deleting satellites:", error);
    res.status(500).json({
      message: "Error deleting satellites",
      success: false,
      error: error.message,
    });
  }
});

// Soft delete individual satellite
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const satellite = await Satellite.findByPk(id);
    if (!satellite) {
      return res.status(404).json({
        message: "Satellite not found",
        success: false,
      });
    }

    if (satellite.IsDeleted) {
      return res.status(400).json({
        message: "Satellite is already deleted",
        success: false,
      });
    }

    await satellite.softDelete();

    res.status(200).json({
      message: "Satellite deleted successfully",
      success: true,
      data: satellite,
    });
  } catch (error) {
    console.error("Error deleting satellite:", error);
    res.status(500).json({
      message: "Error deleting satellite",
      success: false,
      error: error.message,
    });
  }
});

// Restore deleted satellite
router.put("/restore/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const satellite = await Satellite.findByPk(id);
    if (!satellite) {
      return res.status(404).json({
        message: "Satellite not found",
        success: false,
      });
    }

    if (!satellite.IsDeleted) {
      return res.status(400).json({
        message: "Satellite is not deleted",
        success: false,
      });
    }

    await satellite.restore();

    res.status(200).json({
      message: "Satellite restored successfully",
      success: true,
      data: satellite,
    });
  } catch (error) {
    console.error("Error restoring satellite:", error);
    res.status(500).json({
      message: "Error restoring satellite",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
