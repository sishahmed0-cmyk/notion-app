const express = require('express');
const Workspace = require('../models/Workspace');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @GET /api/workspaces/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    res.json({ success: true, workspace });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @PUT /api/workspaces/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, icon, description },
      { new: true }
    );

    res.json({ success: true, workspace });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
