import bcrypt from "bcrypt";
import User from "../database/models/users.js";

const sanitizeUser = (user) => {
  const data = user.toJSON ? user.toJSON() : user;
  delete data.password;
  return data;
};

// GET all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({ where: { role: "doctor" } });
    res.json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

// GET doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: { id: req.params.id, role: "doctor" },
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.json({
      success: true,
      message: "Doctor fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error.message,
    });
  }
};

// CREATE new doctor
export const createDoctor = async (req, res) => {
  try {
    const payload = { ...req.body, role: "doctor" };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const doctor = await User.create(payload);
    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: sanitizeUser(doctor),
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(400).json({
      success: false,
      message: "Error creating doctor",
      error: error.errors ? error.errors.map((err) => err.message) : error.message,
      details: error.errors || error.original || null,
    });
  }
};

// UPDATE doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: { id: req.params.id, role: "doctor" },
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    const payload = { ...req.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    await doctor.update(payload);
    res.json({
      success: true,
      message: "Doctor updated successfully",
      data: sanitizeUser(doctor),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating doctor",
      error: error.message,
    });
  }
};

// DELETE doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: { id: req.params.id, role: "doctor" },
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    await doctor.destroy();
    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: error.message,
    });
  }
};
