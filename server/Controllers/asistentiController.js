const Asistenti = require("../models/Asistenti");
const Departmenti = require("../models/Departmenti");

const AddAsistenti = async (req, res) => {
  try {
    const departmenti = await Departmenti.findById(req.body.ID_Departmenti);
    if (!departmenti) {
      return res.status(404).send({
        message: "Departmenti nuk u gjet",
        success: false,
      });
    }

    const newAsistenti = new Asistenti(req.body);
    await newAsistenti.save();
    res.status(200).send({
      message: "Asistenti u shtua me sukses",
      success: true,
      data: newAsistenti,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const GetAllAsistentet = async (req, res) => {
  try {
    const asistentet = await Asistenti.find().populate("ID_Departmenti");
    res.status(200).send({
      message: "Asistentet u morën me sukses",
      success: true,
      data: asistentet,
    });
  } catch (error) {
    res.status(500).send({
      message: "Nuk u gjetën asistente",
      success: false,
      data: error,
    });
  }
};

const GetAsistentetByDepartmenti = async (req, res) => {
  try {
    const asistentet = await Asistenti.find({
      ID_Departmenti: req.params.departmentiId,
    }).populate("ID_Departmenti");
    res.status(200).send({
      message: "Asistentet u morën me sukses",
      success: true,
      data: asistentet,
    });
  } catch (error) {
    res.status(500).send({
      message: "Nuk u gjetën asistente",
      success: false,
      data: error,
    });
  }
};

const GetAsistentiById = async (req, res) => {
  try {
    const asistenti = await Asistenti.findById(req.params.id).populate(
      "ID_Departmenti"
    );
    res.status(200).send({
      message: "Asistenti u mor me sukses",
      success: true,
      data: asistenti,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const UpdateAsistenti = async (req, res) => {
  try {
    if (req.body.ID_Departmenti) {
      const departmenti = await Departmenti.findById(req.body.ID_Departmenti);
      if (!departmenti) {
        return res.status(404).send({
          message: "Departmenti nuk u gjet",
          success: false,
        });
      }
    }

    await Asistenti.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send({
      message: "Asistenti u perditesua me sukses",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Asistenti nuk u gjet",
      success: false,
      data: error,
    });
  }
};

const DeleteAsistenti = async (req, res) => {
  try {
    await Asistenti.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Asistenti u fshi me sukses",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddAsistenti,
  GetAllAsistentet,
  GetAsistentetByDepartmenti,
  UpdateAsistenti,
  DeleteAsistenti,
  GetAsistentiById,
};
