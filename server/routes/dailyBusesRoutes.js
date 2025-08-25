const express = require("express");
const router = express();

const {
  AddDailyBus,
  GetAllDailyBuses,
  GetDailyBusById,
  UpdateDailyBus,
  DeleteDailyBus,
  GetDailyBusesByRoute,
  GetActiveDailyBuses,
  GenerateBusesFromDaily,
} = require("../Controllers/dailyBusController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes (no authentication required for viewing) - MUST BE FIRST
router.get("/active", GetActiveDailyBuses);
router.get("/route", GetDailyBusesByRoute);

// Admin routes (require authentication)
router.post("/add-daily-bus", authMiddleware, AddDailyBus);
router.post("/get-all-daily-buses", authMiddleware, GetAllDailyBuses);
router.post("/generate-buses", authMiddleware, GenerateBusesFromDaily);

// Parameterized routes MUST BE LAST to avoid conflicts
router.get("/:id", authMiddleware, GetDailyBusById);
router.put("/:id", authMiddleware, UpdateDailyBus);
router.delete("/:id", authMiddleware, DeleteDailyBus);

module.exports = router;
