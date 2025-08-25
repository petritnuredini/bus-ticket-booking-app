const express = require("express");
const router = express.Router();

const {
  GetAllInternationalCities,
  GetCitiesByCountry,
  SearchInternationalCities,
} = require("../Controllers/internationalCitiesController");

// Public routes (no authentication required)
router.get("/get-all-cities", GetAllInternationalCities);
router.get("/country/:country", GetCitiesByCountry);
router.get("/search", SearchInternationalCities);

module.exports = router;
