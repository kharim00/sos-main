import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controller/notification.js";

const router = express.Router();

// GET all notifications
router.get("/", getAllNotifications);

// GET notification by ID
router.get("/:id", getNotificationById);

// CREATE new notification
router.post("/", createNotification);

// UPDATE notification
router.put("/:id", updateNotification);

// DELETE notification
router.delete("/:id", deleteNotification);

export default router;
