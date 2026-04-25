const express = require('express');
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @GET /api/pages - Get all pages in workspace
router.get('/', protect, async (req, res) => {
  try {
    const { workspace, archived, search } = req.query;
    const filter = {
      workspace: workspace || req.user.workspace,
      isArchived: archived === 'true',
      parent: null,
    };
    if (search) {
      filter.$text = { $search: search };
    }

    const pages = await Page.find(filter)
      .populate('children', 'title icon pageType')
      .sort({ updatedAt: -1 });

    res.json({ success: true, pages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @GET /api/pages/:id - Get single page
router.get('/:id', protect, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('children', 'title icon pageType updatedAt')
      .populate('owner', 'name email')
      .populate('lastEditedBy', 'name');

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @POST /api/pages - Create new page
router.post('/', protect, async (req, res) => {
  try {
    const { title, parent, pageType, icon } = req.body;

    const page = await Page.create({
      title: title || 'Untitled',
      icon: icon || '',
      pageType: pageType || 'page',
      owner: req.user._id,
      workspace: req.user.workspace,
      parent: parent || null,
      blocks: [{ type: 'text', content: '', order: 0 }],
      lastEditedBy: req.user._id,
    });

    // Update parent's children array
    if (parent) {
      await Page.findByIdAndUpdate(parent, {
        $push: { children: page._id },
      });
    }

    res.status(201).json({ success: true, page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @PUT /api/pages/:id - Update page
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, icon, coverImage, blocks, isFavorite, isPublic, tags } = req.body;

    const page = await Page.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(icon !== undefined && { icon }),
        ...(coverImage !== undefined && { coverImage }),
        ...(blocks !== undefined && { blocks }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isPublic !== undefined && { isPublic }),
        ...(tags !== undefined && { tags }),
        lastEditedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @DELETE /api/pages/:id - Archive page (soft delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, message: 'Page archived successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @PUT /api/pages/:id/restore - Restore archived page
router.put('/:id/restore', protect, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true }
    );

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
