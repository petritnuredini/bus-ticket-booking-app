const mongoose = require("mongoose");

const asistentiSchema = new mongoose.Schema({
  emri: {
    type: String,
    required: true,
  },
  mbiemri: {
    type: String,
    required: true,
  },
  pozita: {
    type: String,
    required: true,
  },
  ID_Departmenti: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departmenti",
    required: true,
  },
});

module.exports = mongoose.model("asistenti", asistentiSchema);
