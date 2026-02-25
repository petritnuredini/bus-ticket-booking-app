const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    emriDepartamentit: { type: String, required: true, trim: true },
    numriZyrave: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("departments", departmentSchema);