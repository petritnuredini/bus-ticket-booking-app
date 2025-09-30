const express = require("express");
const router = express.Router();
const {
  AddAsistenti,
  GetAllAsistentet,
  GetAsistentetByDepartmenti,
  UpdateAsistenti,
  DeleteAsistenti,
  GetAsistentiById,
} = require("../Controllers/asistentiController");

router.post("/add-asistenti", AddAsistenti);
router.get("/get-all-asistentet", GetAllAsistentet);
router.get("/by-departmenti/:departmentiId", GetAsistentetByDepartmenti);
router.get("/:id", GetAsistentiById);
router.put("/:id", UpdateAsistenti);
router.delete("/:id", DeleteAsistenti);

module.exports = router;

