import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controller/appointment.js";

const router = express.Router();

// GET all appointments
router.get("/", getAllAppointments);

// GET appointment by ID
router.get("/:id", getAppointmentById);

// CREATE new appointment
router.post("/", createAppointment);

// UPDATE appointment
router.put("/:id", updateAppointment);

// DELETE appointment
router.delete("/:id", deleteAppointment);

export default router;
