import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controller/doctor.js";

const router = express.Router();

// GET all doctors
router.get("/", getAllDoctors);

// GET doctor by ID
router.get("/:id", getDoctorById);

// CREATE new doctor
router.post("/", createDoctor);

// UPDATE doctor
router.put("/:id", updateDoctor);

// DELETE doctor
router.delete("/:id", deleteDoctor);

export default router;
