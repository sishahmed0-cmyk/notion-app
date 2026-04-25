const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'heading1', 'heading2', 'heading3', 'bullet', 'numbered',
           'todo', 'toggle', 'quote', 'code', 'divider', 'image', 'table', 'callout'],
    default: 'text',
  },
  content: { type: String, default: '' },
  checked: { type: Boolean, default: false }, // for todo blocks
  language: { type: String, default: 'javascript' }, // for code blocks
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled',
    trim: true,
  },
  icon: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  blocks: [blockSchema],
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
  }],
  isArchived: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  pageType: {
    type: String,
    enum: ['page', 'database', 'board', 'calendar'],
    default: 'page',
  },
  tags: [{ type: String }],
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Index for faster queries
pageSchema.index({ workspace: 1, isArchived: 1 });
pageSchema.index({ owner: 1 });
pageSchema.index({ title: 'text' });

module.exports = mongoose.model('Page', pageSchema);
