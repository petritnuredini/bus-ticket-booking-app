const express = require("express");
const router = express.Router();

//const authMiddleware = require("../middlewares/authMiddleware");
const {
  AddDepartment,
  GetAllDepartments,
  GetDepartmentById,
  UpdateDepartment,
  DeleteDepartment,
} = require("../Controllers/departmentController");

router.post("/add", AddDepartment);
router.get("/",  GetAllDepartments);
router.get("/:id",  GetDepartmentById);
router.put("/:id",  UpdateDepartment);
router.delete("/:id", DeleteDepartment);

module.exports = router;