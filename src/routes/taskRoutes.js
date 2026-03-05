import express from "express";
import { createTask, getTasks, deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes in this file
router.use(authMiddleware);

// Define endpoints and link them to controller functions
router.post("/", createTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask);

export default router;