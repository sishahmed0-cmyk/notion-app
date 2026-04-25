import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiStar, FiMoreHorizontal, FiShare2, FiTrash2,
  FiClock, FiUser, FiMenu
} from 'react-icons/fi';
import BlockEditor from '../components/editor/BlockEditor';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './PageEditor.css';

const EMOJI_SUGGESTIONS = ['📄', '📝', '📊', '🚀', '💡', '🎯', '✅', '🔥', '⭐', '📌', '🏠', '🎨', '💻', '📚', '🌟'];

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPage, updatePage, deletePage, setSidebarOpen } = useApp();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const saveTimeout = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPage(id);
      if (data) setPage(data);
      setLoading(false);
    };
    load();
  }, [id, fetchPage]);

  const autoSave = useCallback((updates) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await updatePage(id, updates);
      setSaving(false);
    }, 800);
  }, [id, updatePage]);

  const handleTitleChange = (e) => {
    const title = e.target.innerText;
    setPage(prev => ({ ...prev, title }));
    autoSave({ title });
  };

  const handleBlocksChange = (blocks) => {
    setPage(prev => ({ ...prev, blocks }));
    autoSave({ blocks });
  };

  const handleIconSelect = (icon) => {
    setPage(prev => ({ ...prev, icon }));
    updatePage(id, { icon });
    setShowIconPicker(false);
  };

  const handleToggleFavorite = async () => {
    const isFavorite = !page.isFavorite;
    setPage(prev => ({ ...prev, isFavorite }));
    await updatePage(id, { isFavorite });
    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleDelete = async () => {
    await deletePage(id);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="skeleton" style={{ height: '48px', width: '60%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '24px', width: '70%' }} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-not-found">
        <h2>Page not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="page-editor">
      {/* Top bar */}
      <div className="page-topbar">
        <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <FiMenu size={18} />
        </button>
        <div className="page-breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/')}>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current truncate">{page.title || 'Untitled'}</span>
        </div>
        <div className="page-topbar-actions">
          {saving && <span className="saving-indicator">Saving...</span>}
          {!saving && <span className="saving-indicator saved">✓ Saved</span>}
          <button
            className={`icon-btn tooltip ${page.isFavorite ? 'active' : ''}`}
            data-tooltip={page.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleToggleFavorite}
          >
            <FiStar size={16} fill={page.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button className="icon-btn tooltip" data-tooltip="Share">
            <FiShare2 size={16} />
          </button>
          <div className="relative">
            <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
              <FiMoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="page-menu animate-fade-in">
                <button onClick={() => { setShowMenu(false); handleDelete(); }}>
                  <FiTrash2 size={14} /> Move to trash
                </button>
                <div className="menu-divider" />
                <div className="menu-info">
                  <FiUser size={12} />
                  <span>Created by {page.owner?.name}</span>
                </div>
                {page.lastEditedBy && (
                  <div className="menu-info">
                    <FiClock size={12} />
                    <span>Edited {format(new Date(page.updatedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="page-content">
        {/* Cover */}
        {page.coverImage && (
          <div className="page-cover" style={{ backgroundImage: `url(${page.coverImage})` }} />
        )}

        <div className="page-body">
          {/* Icon */}
          <div className="page-icon-area">
            {page.icon ? (
              <button
                className="page-icon-large"
                onClick={() => setShowIconPicker(!showIconPicker)}
                title="Change icon"
              >
                {page.icon}
              </button>
            ) : (
              <button
                className="add-icon-btn"
                onClick={() => setShowIconPicker(!showIconPicker)}
              >
                + Add icon
              </button>
            )}

            {showIconPicker && (
              <div className="icon-picker animate-fade-in">
                <div className="icon-picker-header">Choose icon</div>
                <div className="icon-grid">
                  {EMOJI_SUGGESTIONS.map(emoji => (
                    <button key={emoji} className="emoji-btn" onClick={() => handleIconSelect(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
                <button className="remove-icon-btn" onClick={() => handleIconSelect('')}>
                  Remove icon
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div
            ref={titleRef}
            className="page-title-input"
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleChange}
            data-placeholder="Untitled"
          >
            {page.title}
          </div>

          {/* Editor */}
          <div className="editor-container">
            <BlockEditor
              blocks={page.blocks || []}
              onChange={handleBlocksChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
