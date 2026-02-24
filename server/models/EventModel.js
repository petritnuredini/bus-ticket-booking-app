const mongoose = require("mongoose");

const Planetschema = new mongoose.Schema(
  {
    emriPlanetit: { type: String, required: true, trim: true },
    orari: { type: String, required: true, trim: true },
    PlanetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planets",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planets", Planetschema);