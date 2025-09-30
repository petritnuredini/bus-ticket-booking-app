const express = require("express");
const router = express.Router();
const {
  AddDepartmenti,
  GetAllDepartmentet,
  UpdateDepartmenti,
  DeleteDepartmenti,
  GetDepartmentiById,
} = require("../Controllers/departmentiController");

router.post("/add-departmenti", AddDepartmenti);
router.get("/get-all-departmentet", GetAllDepartmentet);
router.get("/:id", GetDepartmentiById);
router.put("/:id", UpdateDepartmenti);
router.delete("/:id", DeleteDepartmenti);

module.exports = router;
