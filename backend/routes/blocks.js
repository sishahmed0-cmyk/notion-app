const express = require('express');
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @POST /api/blocks/:pageId - Add block to page
router.post('/:pageId', protect, async (req, res) => {
  try {
    const { type, content, order } = req.body;
    const page = await Page.findById(req.params.pageId);

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const block = { type, content, order: order || page.blocks.length };
    page.blocks.push(block);
    page.lastEditedBy = req.user._id;
    await page.save();

    res.status(201).json({ success: true, block: page.blocks[page.blocks.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @PUT /api/blocks/:pageId/:blockId - Update block
router.put('/:pageId/:blockId', protect, async (req, res) => {
  try {
    const page = await Page.findById(req.params.pageId);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    const block = page.blocks.id(req.params.blockId);
    if (!block) return res.status(404).json({ success: false, message: 'Block not found' });

    Object.assign(block, req.body);
    page.lastEditedBy = req.user._id;
    await page.save();

    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @DELETE /api/blocks/:pageId/:blockId - Delete block
router.delete('/:pageId/:blockId', protect, async (req, res) => {
  try {
    const page = await Page.findById(req.params.pageId);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    page.blocks = page.blocks.filter(b => b._id.toString() !== req.params.blockId);
    await page.save();

    res.json({ success: true, message: 'Block deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
