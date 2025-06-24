const express = require("express");
const taskSchema = require("../schema/taskSchema");
const taskRouter = express.Router();

taskRouter.get("/all-tasks", async (req, res) => {
  try {
    const allTasks = await taskSchema.find();
    if (allTasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found"
      });
    }
    return res.status(200).json({
      message: "All tasks",
      tasks: allTasks
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});


taskRouter.post("/create-task", async (req, res) => {
  try {
    const { taskName, user } = req.body;
    if (!taskName || !user) {
      return res.status(400).json({ message: "Task name and user ID are required" });
    }

    const newTask = new taskSchema({ taskName, user });
    await newTask.save();

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating task",
      error: err.message
    });
  }
});


taskRouter.put("/update-task/:id", async (req, res) => {
  try {
    const { taskName, status } = req.body;
    const { id } = req.params;

    const updateFields = {
      updatedAt: new Date()
    };

    if (taskName !== undefined) updateFields.taskName = taskName;
    if (status !== undefined) updateFields.status = status;

    const updatedTask = await taskSchema.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating task",
      error: err.message
    });
  }
});
;


taskRouter.delete("/delete-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await taskSchema.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting task",
      error: err.message
    });
  }
});

module.exports = taskRouter;
