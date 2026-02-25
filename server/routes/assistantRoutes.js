const express = require("express");
const router = express.Router();


//const authMiddleware = require("../middlewares/authMiddleware");
const {
  AddAssistant,
  GetAllAssistants,
  GetAssistantsByDepartment,
} = require("../Controllers/assistantController");

router.post("/add",  AddAssistant);
router.get("/",  GetAllAssistants);
router.get("/by-department/:id",  GetAssistantsByDepartment);


module.exports = router;