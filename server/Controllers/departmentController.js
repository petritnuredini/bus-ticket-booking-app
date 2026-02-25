const Department = require("../models/departmentModel");

const AddDepartment = async (req, res) => {
  try {
    const exists = await Department.findOne({
      emriDepartamentit: req.body.emriDepartamentit,
    });
    if (exists) {
      return res.send({ success: false, message: "Department already exists" });
    }
    await new Department(req.body).save();
    res.send({ success: true, message: "Department created successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllDepartments = async (req, res) => {
  try {
    const data = await Department.find().sort({ createdAt: -1 });
    res.send({ success: true, message: "Departments fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetDepartmentById = async (req, res) => {
  try {
    const data = await Department.findById(req.params.id);
    res.send({ success: true, message: "Department fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const UpdateDepartment = async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, req.body);
    res.send({ success: true, message: "Department updated successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
 const DeleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id, req.body);
    res.send({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddDepartment,
  GetAllDepartments,
  GetDepartmentById,
  UpdateDepartment,
  DeleteDepartment,
};