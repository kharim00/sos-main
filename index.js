import express from "express";
import "dotenv/config";
import sequelize from "./src/config/db.js";
import usersRouter from "./src/routes/users.js";
import appointmentsRouter from "./src/routes/appointments.js";
import doctorAvailabilityRouter from "./src/routes/doctorAvailability.js";
import notificationsRouter from "./src/routes/notifications.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/doctor-availability", doctorAvailabilityRouter);
app.use("/api/notifications", notificationsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

sequelize.authenticate()
.then(() => sequelize.sync())
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Your database is running🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);
        console.log(`\nAPI Endpoints:`);
        console.log(`  GET/POST   http://localhost:${PORT}/api/users`);
        console.log(`  GET/POST   http://localhost:${PORT}/api/appointments`);
        console.log(`  GET/POST   http://localhost:${PORT}/api/doctor-availability`);
        console.log(`  GET/POST   http://localhost:${PORT}/api/notifications`);
    });
})
.catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
});
