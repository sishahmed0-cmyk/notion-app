const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'in-review', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  dueDate: { type: Date, default: null },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null,
  },
  tags: [{ type: String }],
  isArchived: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

taskSchema.index({ workspace: 1, status: 1 });
taskSchema.index({ owner: 1, isArchived: 1 });

module.exports = mongoose.model('Task', taskSchema);
