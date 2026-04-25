import React, { useEffect, useState } from 'react';
import { FiPlus, FiMenu, FiCalendar, FiFlag, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './TasksPage.css';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'var(--status-todo)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--status-progress)' },
  { id: 'in-review', label: 'In Review', color: 'var(--status-review)' },
  { id: 'done', label: 'Done', color: 'var(--status-done)' },
];

const PRIORITY_COLORS = {
  low: 'var(--priority-low)',
  medium: 'var(--priority-medium)',
  high: 'var(--priority-high)',
  urgent: 'var(--priority-urgent)',
};

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`task-card ${dragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task._id);
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
    >
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <button className="task-delete-btn" onClick={() => onDelete(task._id)}>
          <FiX size={12} />
        </button>
      </div>
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}
      <div className="task-card-footer">
        <span
          className="task-priority"
          style={{ color: PRIORITY_COLORS[task.priority] }}
        >
          <FiFlag size={11} />
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="task-due">
            <FiCalendar size={11} />
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>
      {task.tags?.length > 0 && (
        <div className="task-tags">
          {task.tags.map(tag => (
            <span key={tag} className="task-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const Column = ({ column, tasks, onDrop, onUpdate, onDelete, onAdd }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, column.id);
    setDragOver(false);
  };

  return (
    <div
      className={`kanban-column ${dragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" style={{ background: column.color }} />
          <span>{column.label}</span>
          <span className="column-count">{tasks.length}</span>
        </div>
        <button className="column-add-btn" onClick={() => onAdd(column.id)}>
          <FiPlus size={14} />
        </button>
      </div>
      <div className="column-tasks">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

const NewTaskModal = ({ defaultStatus, onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'todo',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    await onCreate({
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      dueDate: form.dueDate || null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Task</h3>
          <button className="icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              placeholder="Task title..."
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              className="form-input"
              placeholder="design, frontend, bug..."
              value={form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Create Task</button>
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, setSidebarOpen } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('todo');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDrop = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleAdd = (status) => {
    setModalStatus(status);
    setShowModal(true);
  };

  return (
    <div className="tasks-page">
      <div className="page-topbar">
        <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <FiMenu size={18} />
        </button>
        <h1 className="page-heading">My Tasks</h1>
        <button className="btn btn-primary" onClick={() => handleAdd('todo')}>
          <FiPlus size={16} /> New Task
        </button>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter(t => t.status === column.id)}
            onDrop={handleDrop}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onAdd={handleAdd}
          />
        ))}
      </div>

      {showModal && (
        <NewTaskModal
          defaultStatus={modalStatus}
          onClose={() => setShowModal(false)}
          onCreate={createTask}
        />
      )}
    </div>
  );
};

export default TasksPage;
