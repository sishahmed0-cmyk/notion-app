const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, workspace } = req.query;
    const filter = {
      workspace: workspace || req.user.workspace,
      isArchived: false,
    };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee, tags } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignee: assignee || null,
      tags: tags || [],
      owner: req.user._id,
      workspace: req.user.workspace,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('assignee', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { isArchived: true });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
