const Departmenti = require("../models/Departmenti");
const Asistenti = require("../models/Asistenti");

const AddDepartmenti = async (req, res) => {
  try {
    const newDepartmenti = new Departmenti(req.body);
    await newDepartmenti.save();
    res.status(200).send({
      message: "Departmenti u shtua me sukses",
      success: true,
      data: newDepartmenti,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllDepartmentet = async (req, res) => {
  try {
    const departmentet = await Departmenti.find();
    res.status(200).send({
      message: "Departmentet u morën me sukses",
      success: true,
      data: departmentet,
    });
  } catch (error) {
    res.status(500).send({
      message: "Nuk u gjetën departmente",
      success: false,
      data: error,
    });
  }
};

const GetDepartmentiById = async (req, res) => {
  try {
    const departmenti = await Departmenti.findById(req.params.id);
    res.status(200).send({
      message: "Departmenti u mor me sukses",
      success: true,
      data: departmenti,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const UpdateDepartmenti = async (req, res) => {
  try {
    await Departmenti.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send({
      message: "Departmenti u perditesua me sukses",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Departmenti nuk u gjet",
      success: false,
      data: error,
    });
  }
};

const DeleteDepartmenti = async (req, res) => {
  try {
    const asistente = await Asistenti.find({ ID_Departmenti: req.params.id });
    if (asistente.length > 0) {
      return res.status(400).send({
        message:
          "Nuk mund te fshihet departmenti sepse ka asistente te regjistruar",
        success: false,
      });
    }

    await Departmenti.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Departmenti u fshi me sukses",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddDepartmenti,
  GetAllDepartmentet,
  UpdateDepartmenti,
  DeleteDepartmenti,
  GetDepartmentiById,
};
