const mongoose = require("mongoose");

const PlanetSchema = new mongoose.Schema(
  {
    emriPlanetit: { type: String, required: true, trim: true },
    llojiPlanetit: { type: String, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planets", PlanetSchema);