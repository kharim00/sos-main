import DoctorAvailability from "../models/doctorAvailability.js";
import User from "../models/users.js";

export const seedDoctorAvailabilities = async () => {
  try {
    const existingAvailabilities = await DoctorAvailability.count();
    if (existingAvailabilities > 0) {
      console.log("Doctor availability already seeded. Skipping...");
      return;
    }

    const doctor = await User.findOne({ where: { role: "doctor" } });
    if (!doctor) {
      console.log("Skipping doctor availability seeding because a doctor user is missing.");
      return;
    }

    const availabilities = [
      {
        doctorId: doctor.id,
        availableDate: "2026-05-12",
        availableTimeSlots: ["09:00", "10:00", "11:00"],
      },
      {
        doctorId: doctor.id,
        availableDate: "2026-05-13",
        availableTimeSlots: ["13:00", "14:00", "15:00"],
      },
    ];

    await DoctorAvailability.bulkCreate(availabilities);
    console.log("Doctor availability seeded successfully");
  } catch (error) {
    console.error("Error seeding doctor availability:", error.message);
    throw error;
  }
};
