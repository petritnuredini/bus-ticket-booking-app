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

// Admin routes (require authentication)
router.post("/add-daily-bus", authMiddleware, AddDailyBus);
router.post("/get-all-daily-buses", authMiddleware, GetAllDailyBuses);
router.put("/:id", authMiddleware, UpdateDailyBus);
router.delete("/:id", authMiddleware, DeleteDailyBus);
router.get("/:id", authMiddleware, GetDailyBusById);
router.post("/generate-buses", authMiddleware, GenerateBusesFromDaily);

// Public routes (no authentication required for viewing)
router.get("/active", GetActiveDailyBuses);
router.get("/route", GetDailyBusesByRoute);

module.exports = router;
