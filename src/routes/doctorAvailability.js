import express from "express";
import DoctorAvailability from "../database/models/doctorAvailability.js";

const router = express.Router();

// GET all doctor availabilities
router.get("/", async (req, res) => {
  try {
    const availabilities = await DoctorAvailability.findAll();
    res.json({
      success: true,
      message: "Doctor availabilities fetched successfully",
      data: availabilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor availabilities",
      error: error.message,
    });
  }
});

// GET doctor availability by ID
router.get("/:id", async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor availability not found",
      });
    }
    res.json({
      success: true,
      message: "Doctor availability fetched successfully",
      data: availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor availability",
      error: error.message,
    });
  }
});

// CREATE new doctor availability
router.post("/", async (req, res) => {
  try {
    const availability = await DoctorAvailability.create(req.body);
    res.status(201).json({
      success: true,
      message: "Doctor availability created successfully",
      data: availability,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating doctor availability",
      error: error.message,
    });
  }
});

// UPDATE doctor availability
router.put("/:id", async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor availability not found",
      });
    }
    await availability.update(req.body);
    res.json({
      success: true,
      message: "Doctor availability updated successfully",
      data: availability,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating doctor availability",
      error: error.message,
    });
  }
});

// DELETE doctor availability
router.delete("/:id", async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor availability not found",
      });
    }
    await availability.destroy();
    res.json({
      success: true,
      message: "Doctor availability deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting doctor availability",
      error: error.message,
    });
  }
});

export default router;
