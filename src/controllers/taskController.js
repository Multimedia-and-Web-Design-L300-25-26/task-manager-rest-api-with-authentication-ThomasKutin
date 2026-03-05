import Task from "../models/Task.js";

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id // Attach the authenticated user's ID
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    // Only fetch tasks where the owner matches the logged-in user
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    // We check BOTH the ID and the OWNER to satisfy the "Authorization" requirement
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized access" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};