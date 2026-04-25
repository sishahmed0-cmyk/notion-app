import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFile, FiCheckSquare, FiStar, FiMenu, FiClock } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const { pages, tasks, fetchPages, fetchTasks, createPage, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
    fetchTasks();
  }, [fetchPages, fetchTasks]);

  const handleNewPage = async () => {
    const page = await createPage();
    if (page) navigate(`/page/${page._id}`);
  };

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const favoritePages = pages.filter(p => p.isFavorite).slice(0, 4);
  const pendingTasks = tasks.filter(t => t.status !== 'done').slice(0, 5);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      <div className="home-topbar">
        <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <FiMenu size={18} />
        </button>
      </div>

      <div className="home-content">
        {/* Greeting */}
        <div className="home-greeting">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's what's happening in your workspace</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pages-icon"><FiFile size={20} /></div>
            <div>
              <div className="stat-number">{pages.length}</div>
              <div className="stat-label">Total Pages</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon tasks-icon"><FiCheckSquare size={20} /></div>
            <div>
              <div className="stat-number">{pendingTasks.length}</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon favorites-icon"><FiStar size={20} /></div>
            <div>
              <div className="stat-number">{favoritePages.length}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>
          <div className="stat-card clickable" onClick={handleNewPage}>
            <div className="stat-icon new-icon"><FiPlus size={20} /></div>
            <div>
              <div className="stat-number">New</div>
              <div className="stat-label">Create Page</div>
            </div>
          </div>
        </div>

        <div className="home-grid">
          {/* Recent pages */}
          <div className="home-section">
            <div className="section-title">
              <FiClock size={14} />
              <span>Recently Edited</span>
            </div>
            {recentPages.length === 0 ? (
              <div className="empty-state">
                <p>No pages yet.</p>
                <button className="btn btn-primary" onClick={handleNewPage}>
                  <FiPlus size={14} /> Create your first page
                </button>
              </div>
            ) : (
              <div className="pages-grid">
                {recentPages.map(page => (
                  <div
                    key={page._id}
                    className="page-card"
                    onClick={() => navigate(`/page/${page._id}`)}
                  >
                    <div className="page-card-icon">{page.icon || '📄'}</div>
                    <div className="page-card-info">
                      <div className="page-card-title">{page.title || 'Untitled'}</div>
                      <div className="page-card-time">
                        {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="page-card new-page-card" onClick={handleNewPage}>
                  <div className="page-card-icon new"><FiPlus size={20} /></div>
                  <div className="page-card-info">
                    <div className="page-card-title">New Page</div>
                    <div className="page-card-time">Create new</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pending tasks */}
          <div className="home-section">
            <div className="section-title">
              <FiCheckSquare size={14} />
              <span>Pending Tasks</span>
              <button className="btn btn-ghost small" onClick={() => navigate('/tasks')}>
                View all
              </button>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="empty-state">
                <p>No pending tasks. 🎉</p>
              </div>
            ) : (
              <div className="tasks-list">
                {pendingTasks.map(task => (
                  <div key={task._id} className="task-item" onClick={() => navigate('/tasks')}>
                    <div className={`task-status-dot status-${task.status}`} />
                    <div className="task-item-info">
                      <span className="task-item-title">{task.title}</span>
                      <span className={`task-item-priority priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.dueDate && (
                      <span className="task-item-due">
                        {format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
