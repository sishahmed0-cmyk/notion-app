import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiSearch, FiStar, FiTrash2, FiSettings,
  FiPlus, FiChevronDown, FiChevronRight, FiFile,
  FiGrid, FiCheckSquare, FiMenu, FiLogOut, FiMoon, FiSun
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const NavItem = ({ icon, label, onClick, active, badge }) => (
  <button className={`sidebar-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
    {badge && <span className="nav-badge">{badge}</span>}
  </button>
);

const PageItem = ({ page, depth = 0, activePage, onSelect, onNew }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = page.children?.length > 0;

  return (
    <div className="page-tree-item">
      <div
        className={`page-item ${activePage === page._id ? 'active' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <button
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          {expanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
        </button>
        <button className="page-icon-btn" onClick={() => onSelect(page._id)}>
          <span>{page.icon || '📄'}</span>
        </button>
        <button className="page-title-btn truncate" onClick={() => onSelect(page._id)}>
          {page.title || 'Untitled'}
        </button>
        <button
          className="page-add-btn"
          onClick={(e) => { e.stopPropagation(); onNew(page._id); }}
          title="Add sub-page"
        >
          <FiPlus size={12} />
        </button>
      </div>
      {expanded && hasChildren && page.children.map(child => (
        <PageItem
          key={child._id}
          page={child}
          depth={depth + 1}
          activePage={activePage}
          onSelect={onSelect}
          onNew={onNew}
        />
      ))}
    </div>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { pages, fetchPages, createPage, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [searchOpen, setSearchOpen] = useState(false);

  const currentPageId = location.pathname.startsWith('/page/')
    ? location.pathname.split('/')[2]
    : null;

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNewPage = async (parentId = null) => {
    const page = await createPage({ parent: parentId });
    if (page) navigate(`/page/${page._id}`);
  };

  const handleSelectPage = (id) => navigate(`/page/${id}`);

  const favoritePages = pages.filter(p => p.isFavorite);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* Workspace header */}
        <div className="sidebar-workspace">
          <div className="workspace-info">
            <div className="workspace-icon">
              {user?.workspace?.icon || '🏠'}
            </div>
            <div className="workspace-details">
              <span className="workspace-name truncate">
                {user?.workspace?.name || 'My Workspace'}
              </span>
              <span className="workspace-user truncate">{user?.name}</span>
            </div>
          </div>
          <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
            <FiMenu size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-section">
          <NavItem
            icon={<FiSearch size={15} />}
            label="Quick Search"
            onClick={() => setSearchOpen(true)}
          />
          <NavItem
            icon={<FiHome size={15} />}
            label="Home"
            onClick={() => navigate('/')}
            active={location.pathname === '/'}
          />
          <NavItem
            icon={<FiCheckSquare size={15} />}
            label="My Tasks"
            onClick={() => navigate('/tasks')}
            active={location.pathname === '/tasks'}
          />
          <NavItem
            icon={<FiGrid size={15} />}
            label="Projects"
            onClick={() => navigate('/projects')}
            active={location.pathname === '/projects'}
          />
        </div>

        {/* Favorites */}
        {favoritePages.length > 0 && (
          <div className="sidebar-section">
            <div className="section-header">
              <FiStar size={12} />
              <span>Favorites</span>
            </div>
            {favoritePages.map(page => (
              <PageItem
                key={page._id}
                page={page}
                activePage={currentPageId}
                onSelect={handleSelectPage}
                onNew={handleNewPage}
              />
            ))}
          </div>
        )}

        {/* Pages */}
        <div className="sidebar-section flex-grow">
          <div className="section-header">
            <FiFile size={12} />
            <span>Pages</span>
            <button className="section-add-btn" onClick={() => handleNewPage()}>
              <FiPlus size={12} />
            </button>
          </div>
          <div className="pages-list">
            {pages.length === 0 ? (
              <div className="empty-pages">
                <p>No pages yet</p>
                <button className="btn btn-ghost" onClick={() => handleNewPage()}>
                  <FiPlus size={14} /> New page
                </button>
              </div>
            ) : (
              pages.map(page => (
                <PageItem
                  key={page._id}
                  page={page}
                  activePage={currentPageId}
                  onSelect={handleSelectPage}
                  onNew={handleNewPage}
                />
              ))
            )}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          <NavItem
            icon={<FiTrash2 size={15} />}
            label="Trash"
            onClick={() => navigate('/trash')}
          />
          <NavItem
            icon={<FiSettings size={15} />}
            label="Settings"
            onClick={() => navigate('/settings')}
          />
          <div className="sidebar-user-row">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="user-name truncate">{user?.name}</span>
            <div className="user-actions">
              <button className="icon-btn tooltip" data-tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'} onClick={toggleTheme}>
                {theme === 'light' ? <FiMoon size={14} /> : <FiSun size={14} />}
              </button>
              <button className="icon-btn tooltip" data-tooltip="Logout" onClick={logout}>
                <FiLogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
