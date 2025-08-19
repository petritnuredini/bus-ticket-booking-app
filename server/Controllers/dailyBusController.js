const DailyBus = require("../models/dailyBusModel");
const Bus = require("../models/busModel");
const { Op } = require("sequelize");

// Add a new daily bus
const AddDailyBus = async (req, res) => {
  try {
    // Check if bus number already exists
    const existingBus = await DailyBus.findOne({
      where: { busNumber: req.body.busNumber },
    });

    if (existingBus) {
      return res.status(400).send({
        message: "Daily bus with this number already exists",
        success: false,
        data: null,
      });
    }

    // Validate active days
    if (!req.body.activeDays || req.body.activeDays.length === 0) {
      return res.status(400).send({
        message: "At least one active day must be selected",
        success: false,
        data: null,
      });
    }

    // Create new daily bus
    const newDailyBus = await DailyBus.create(req.body);

    res.status(201).send({
      message: "Daily bus created successfully",
      success: true,
      data: newDailyBus,
    });
  } catch (error) {
    console.error("Error creating daily bus:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to create daily bus",
    });
  }
};

// Get all daily buses
const GetAllDailyBuses = async (req, res) => {
  try {
    const dailyBuses = await DailyBus.findAll({
      order: [
        ["status", "ASC"], // Active buses first
        ["name", "ASC"], // Then alphabetically by name
      ],
    });

    res.status(200).send({
      message: "Daily buses fetched successfully",
      success: true,
      data: dailyBuses,
    });
  } catch (error) {
    console.error("Error fetching daily buses:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch daily buses",
    });
  }
};

// Get daily bus by ID
const GetDailyBusById = async (req, res) => {
  try {
    const dailyBus = await DailyBus.findByPk(req.params.id);

    if (!dailyBus) {
      return res.status(404).send({
        message: "Daily bus not found",
        success: false,
        data: null,
      });
    }

    res.status(200).send({
      message: "Daily bus fetched successfully",
      success: true,
      data: dailyBus,
    });
  } catch (error) {
    console.error("Error fetching daily bus:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch daily bus",
    });
  }
};

// Update daily bus
const UpdateDailyBus = async (req, res) => {
  try {
    const dailyBus = await DailyBus.findByPk(req.params.id);

    if (!dailyBus) {
      return res.status(404).send({
        message: "Daily bus not found",
        success: false,
        data: null,
      });
    }

    // Check if bus number is being changed and if it conflicts
    if (req.body.busNumber && req.body.busNumber !== dailyBus.busNumber) {
      const existingBus = await DailyBus.findOne({
        where: {
          busNumber: req.body.busNumber,
          id: { [Op.ne]: req.params.id },
        },
      });

      if (existingBus) {
        return res.status(400).send({
          message: "Another daily bus with this number already exists",
          success: false,
          data: null,
        });
      }
    }

    // Validate active days if provided
    if (req.body.activeDays && req.body.activeDays.length === 0) {
      return res.status(400).send({
        message: "At least one active day must be selected",
        success: false,
        data: null,
      });
    }

    // Update the daily bus
    await dailyBus.update(req.body);

    res.status(200).send({
      message: "Daily bus updated successfully",
      success: true,
      data: dailyBus,
    });
  } catch (error) {
    console.error("Error updating daily bus:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to update daily bus",
    });
  }
};

// Delete daily bus
const DeleteDailyBus = async (req, res) => {
  try {
    const dailyBus = await DailyBus.findByPk(req.params.id);

    if (!dailyBus) {
      return res.status(404).send({
        message: "Daily bus not found",
        success: false,
        data: null,
      });
    }

    await dailyBus.destroy();

    res.status(200).send({
      message: "Daily bus deleted successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Error deleting daily bus:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to delete daily bus",
    });
  }
};

// Get daily buses by route (from and to)
const GetDailyBusesByRoute = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).send({
        message: "Both 'from' and 'to' parameters are required",
        success: false,
        data: null,
      });
    }

    const dailyBuses = await DailyBus.findAll({
      where: {
        from: from,
        to: to,
        status: "active",
      },
      order: [["defaultDeparture", "ASC"]],
    });

    res.status(200).send({
      message: "Daily buses fetched successfully",
      success: true,
      data: dailyBuses,
    });
  } catch (error) {
    console.error("Error fetching daily buses by route:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch daily buses",
    });
  }
};

// Get active daily buses (for public viewing)
const GetActiveDailyBuses = async (req, res) => {
  try {
    const dailyBuses = await DailyBus.findAll({
      where: {
        status: "active",
        [Op.or]: [
          { effectiveFrom: null },
          { effectiveFrom: { [Op.lte]: new Date() } },
        ],
        [Op.or]: [
          { effectiveTo: null },
          { effectiveTo: { [Op.gte]: new Date() } },
        ],
      },
      order: [
        ["from", "ASC"],
        ["to", "ASC"],
        ["defaultDeparture", "ASC"],
      ],
    });

    res.status(200).send({
      message: "Active daily buses fetched successfully",
      success: true,
      data: dailyBuses,
    });
  } catch (error) {
    console.error("Error fetching active daily buses:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch active daily buses",
    });
  }
};

// Generate regular buses from daily bus templates for a date range
const GenerateBusesFromDaily = async (req, res) => {
  try {
    const { startDate, endDate, dailyBusId } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Start date and end date are required",
        success: false,
        data: null,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).send({
        message: "Start date must be before end date",
        success: false,
        data: null,
      });
    }

    // Get daily buses to generate from
    let dailyBuses;
    if (dailyBusId) {
      const dailyBus = await DailyBus.findByPk(dailyBusId);
      if (!dailyBus) {
        return res.status(404).send({
          message: "Daily bus not found",
          success: false,
          data: null,
        });
      }
      dailyBuses = [dailyBus];
    } else {
      // Get all active daily buses
      dailyBuses = await DailyBus.findAll({
        where: { status: "active" },
      });
    }

    const generatedBuses = [];
    const errors = [];

    // Generate buses for each day in the range
    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      for (const dailyBus of dailyBuses) {
        // Check if this daily bus operates on this day
        if (!dailyBus.isActiveOnDay(dayOfWeek)) {
          continue;
        }

        // Check effective date range
        if (
          dailyBus.effectiveFrom &&
          new Date(dailyBus.effectiveFrom) > currentDate
        ) {
          continue;
        }
        if (
          dailyBus.effectiveTo &&
          new Date(dailyBus.effectiveTo) < currentDate
        ) {
          continue;
        }

        // Get schedule for this day
        const schedule = dailyBus.getScheduleForDay(dayOfWeek);
        if (!schedule) {
          continue;
        }

        try {
          // Check if bus already exists for this date
          const existingBus = await Bus.findOne({
            busNumber: dailyBus.busNumber,
            journeyDate: dateString,
          });

          if (existingBus) {
            errors.push(
              `Bus ${dailyBus.busNumber} already exists for ${dateString}`
            );
            continue;
          }

          // Create regular bus instance
          const busData = {
            name: dailyBus.name,
            busNumber: dailyBus.busNumber,
            from: dailyBus.from,
            to: dailyBus.to,
            departure: schedule.departure,
            arrival: schedule.arrival,
            journeyDate: dateString,
            capacity: dailyBus.capacity,
            price: dailyBus.price,
            seatsBooked: [],
            status: "Yet to start",
          };

          const newBus = new Bus(busData);
          await newBus.save();
          generatedBuses.push(newBus);
        } catch (error) {
          errors.push(
            `Failed to create bus ${dailyBus.busNumber} for ${dateString}: ${error.message}`
          );
        }
      }
    }

    res.status(200).send({
      message: `Generated ${generatedBuses.length} buses successfully`,
      success: true,
      data: {
        generatedCount: generatedBuses.length,
        generatedBuses: generatedBuses,
        errors: errors,
      },
    });
  } catch (error) {
    console.error("Error generating buses from daily templates:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to generate buses",
    });
  }
};

module.exports = {
  AddDailyBus,
  GetAllDailyBuses,
  GetDailyBusById,
  UpdateDailyBus,
  DeleteDailyBus,
  GetDailyBusesByRoute,
  GetActiveDailyBuses,
  GenerateBusesFromDaily,
};
