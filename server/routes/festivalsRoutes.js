const router = require("express").Router();
const Festival = require("../models/festivalModel");
const Event = require("../models/eventModel");

// Create a new festival
router.post("/", async (req, res) => {
  try {
    const { EmriFestivalit, LlojiiFestivalit } = req.body;

    // Validation
    if (!EmriFestivalit || EmriFestivalit.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Festival name is required (min 2 characters)",
      });
    }

    // Check if festival already exists
    const existing = await Festival.findOne({
      where: { EmriFestivalit: EmriFestivalit.trim(), IsDeleted: false },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Festival with this name already exists",
      });
    }

    const festival = await Festival.create({
      EmriFestivalit: EmriFestivalit.trim(),
      LlojiiFestivalit: LlojiiFestivalit ? LlojiiFestivalit.trim() : null,
    });

    res.status(201).json({
      success: true,
      message: "Festival created successfully",
      data: festival,
    });
  } catch (error) {
    console.error("Error creating festival:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create festival",
      error: error.message,
    });
  }
});

// Get all festivals with event count
router.get("/", async (req, res) => {
  try {
    const festivals = await Festival.findAll({
      where: { IsDeleted: false },
      include: [
        {
          model: Event,
          as: "events",
          where: { IsDeleted: false },
          required: false,
        },
      ],
      order: [["CreatedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: festivals,
    });
  } catch (error) {
    console.error("Error fetching festivals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch festivals",
      error: error.message,
    });
  }
});

// Get single festival by ID
router.get("/:id", async (req, res) => {
  try {
    const festival = await Festival.findOne({
      where: { FestivalID: req.params.id, IsDeleted: false },
      include: [
        {
          model: Event,
          as: "events",
          where: { IsDeleted: false },
          required: false,
        },
      ],
    });

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: "Festival not found",
      });
    }

    res.status(200).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    console.error("Error fetching festival:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch festival",
      error: error.message,
    });
  }
});

// Get events for a specific festival
router.get("/:id/events", async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { ID_Festivalit: req.params.id, IsDeleted: false },
      order: [["DataEventit", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

// Update festival
router.put("/:id", async (req, res) => {
  try {
    const { EmriFestivalit, LlojiiFestivalit } = req.body;

    const festival = await Festival.findOne({
      where: { FestivalID: req.params.id, IsDeleted: false },
    });

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: "Festival not found",
      });
    }

    // Check if new name conflicts with existing festival
    if (EmriFestivalit && EmriFestivalit.trim() !== festival.EmriFestivalit) {
      const existing = await Festival.findOne({
        where: { EmriFestivalit: EmriFestivalit.trim(), IsDeleted: false },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Festival with this name already exists",
        });
      }
    }

    await festival.update({
      EmriFestivalit: EmriFestivalit ? EmriFestivalit.trim() : festival.EmriFestivalit,
      LlojiiFestivalit: LlojiiFestivalit !== undefined ? (LlojiiFestivalit ? LlojiiFestivalit.trim() : null) : festival.LlojiiFestivalit,
    });

    res.status(200).json({
      success: true,
      message: "Festival updated successfully",
      data: festival,
    });
  } catch (error) {
    console.error("Error updating festival:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update festival",
      error: error.message,
    });
  }
});

// Delete festival (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const festival = await Festival.findOne({
      where: { FestivalID: req.params.id, IsDeleted: false },
    });

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: "Festival not found",
      });
    }

    // Soft delete festival
    await festival.update({ IsDeleted: true });

    // Soft delete all associated events
    await Event.update(
      { IsDeleted: true },
      { where: { ID_Festivalit: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: "Festival and its events deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting festival:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete festival",
      error: error.message,
    });
  }
});

module.exports = router;

