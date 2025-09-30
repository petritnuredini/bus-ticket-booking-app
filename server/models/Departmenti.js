const mongoose = require("mongoose");

const departmentiSchema = new mongoose.Schema({
  emriDepartmentit: {
    type: String,
    required: true,
  },
  numriIZyrave: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("departmenti", departmentiSchema);
