const mongoose = require("mongoose");

const assistantSchema = new mongoose.Schema(
  {
    emri: { type: String, required: true, trim: true },
    mbiemri: { type: String, required: true, trim: true },
    pozita: { type: String, default: "", trim: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("assistants", assistantSchema);