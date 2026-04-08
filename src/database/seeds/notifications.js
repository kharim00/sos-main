import Notification from "../models/notifications.js";
import User from "../models/users.js";

export const seedNotifications = async () => {
  try {
    const existingNotifications = await Notification.count();
    if (existingNotifications > 0) {
      console.log("Notifications already seeded. Skipping...");
      return;
    }

    const patient = await User.findOne({ where: { role: "patient" } });
    const doctor = await User.findOne({ where: { role: "doctor" } });

    if (!patient || !doctor) {
      console.log("Skipping notification seeding because required users are missing.");
      return;
    }

    const notifications = [
      {
        userId: patient.id,
        message: "Your appointment request has been received and is pending confirmation.",
        isRead: false,
      },
      {
        userId: doctor.id,
        message: "A new patient appointment has been scheduled for you.",
        isRead: false,
      },
    ];

    await Notification.bulkCreate(notifications);
    console.log("Notifications seeded successfully");
  } catch (error) {
    console.error("Error seeding notifications:", error.message);
    throw error;
  }
};
