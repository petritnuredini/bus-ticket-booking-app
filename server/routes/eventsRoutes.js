const router = require("express").Router();
const Event = require("../models/eventModel");
const Festival = require("../models/festivalModel");

// Create a new event
router.post("/", async (req, res) => {
  try {
    const { ID_Festivalit, EmriEventit, DataEventit } = req.body;

    // Validation
    if (!ID_Festivalit) {
      return res.status(400).json({
        success: false,
        message: "Festival ID is required",
      });
    }

    if (!EmriEventit || EmriEventit.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Event name is required (min 2 characters)",
      });
    }

    if (!DataEventit) {
      return res.status(400).json({
        success: false,
        message: "Event date is required",
      });
    }

    // Check if festival exists
    const festival = await Festival.findOne({
      where: { FestivalID: ID_Festivalit, IsDeleted: false },
    });

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: "Festival not found",
      });
    }

    const event = await Event.create({
      ID_Festivalit,
      EmriEventit: EmriEventit.trim(),
      DataEventit,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { IsDeleted: false },
      include: [
        {
          model: Festival,
          as: "festival",
          where: { IsDeleted: false },
          required: false,
        },
      ],
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

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { EmriEventit, DataEventit } = req.body;

    const event = await Event.findOne({
      where: { EventID: req.params.id, IsDeleted: false },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.update({
      EmriEventit: EmriEventit ? EmriEventit.trim() : event.EmriEventit,
      DataEventit: DataEventit || event.DataEventit,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
});

// Delete event (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { EventID: req.params.id, IsDeleted: false },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.update({ IsDeleted: true });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
});

module.exports = router;

