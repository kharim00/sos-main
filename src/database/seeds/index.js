import { seedUsers } from "./users.js";
import { seedAppointments } from "./appointments.js";
import { seedDoctorAvailabilities } from "./doctorAvailability.js";
import { seedNotifications } from "./notifications.js";

export const seedAll = async () => {
  await seedUsers();
  await seedDoctorAvailabilities();
  await seedAppointments();
  await seedNotifications();
};
