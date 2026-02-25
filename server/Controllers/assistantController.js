const Assistant = require("../models/assistantModel");

const AddAssistant = async (req, res) => {
  try {
    await new Assistant(req.body).save();
    res.send({ success: true, message: "Assistant created successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllAssistants = async (req, res) => {
  try {
    const data = await Assistant.find()
      .populate("departmentId")
      .sort({ createdAt: -1 });
    res.send({ success: true, message: "Assistants fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAssistantsByDepartment = async (req, res) => {
  try {
    const data = await Assistant.find({ departmentId: req.params.id })
      .populate("departmentId")
      .sort({ createdAt: -1 });
    res.send({ success: true, message: "Assistants fetched", data });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { AddAssistant, GetAllAssistants, GetAssistantsByDepartment };