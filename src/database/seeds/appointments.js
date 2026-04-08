import Appointment from "../models/appointments.js";
import User from "../models/users.js";

export const seedAppointments = async () => {
  try {
    const existingAppointments = await Appointment.count();
    if (existingAppointments > 0) {
      console.log("Appointments already seeded. Skipping...");
      return;
    }

    const doctor = await User.findOne({ where: { role: "doctor" } });
    const patient = await User.findOne({ where: { role: "patient" } });

    if (!doctor || !patient) {
      console.log("Skipping appointment seeding because doctor or patient user is missing.");
      return;
    }

    const appointments = [
      {
        doctorId: doctor.id,
        patientId: patient.id,
        appointmentDate: "2026-05-12",
        appointmentTime: "09:00",
        status: "scheduled",
      },
      {
        doctorId: doctor.id,
        patientId: patient.id,
        appointmentDate: "2026-05-14",
        appointmentTime: "14:30",
        status: "scheduled",
      },
    ];

    await Appointment.bulkCreate(appointments);
    console.log("Appointments seeded successfully");
  } catch (error) {
    console.error("Error seeding appointments:", error.message);
    throw error;
  }
};
