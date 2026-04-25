import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/sidebar/Sidebar';
import HomePage from './pages/HomePage';
import PageEditor from './pages/PageEditor';
import TasksPage from './pages/TasksPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import './styles/global.css';

// Protected layout with sidebar
const AppLayout = () => {
  const { sidebarOpen } = require('./context/AppContext').useApp
    ? { sidebarOpen: true }
    : { sidebarOpen: true };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};

// Route guard
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

const LoadingScreen = () => (
  <div style={{
    height: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexDirection: 'column', gap: '16px',
    background: 'var(--bg-primary)',
  }}>
    <div style={{
      width: '40px', height: '40px', background: 'var(--accent)',
      borderRadius: '10px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '20px', color: 'white',
      fontWeight: '700',
    }}>✦</div>
    <div style={{
      width: '24px', height: '24px', border: '2px solid var(--border-color)',
      borderTopColor: 'var(--accent)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/page/:id" element={<PageEditor />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/projects" element={<TasksPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

// Simple Trash Page
const TrashPage = () => {
  const { pages, updatePage, setSidebarOpen } = require('./context/AppContext').useApp();
  const { FiMenu, FiTrash2, FiRotateCcw } = require('react-icons/fi');
  const navigate = require('react-router-dom').useNavigate();
  const [archivedPages, setArchivedPages] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      const api = require('./utils/api').default;
      const data = await api.get('/pages?archived=true');
      setArchivedPages(data.pages);
    };
    load();
  }, []);

  const restore = async (id) => {
    await updatePage(id, { isArchived: false });
    setArchivedPages(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 24px', height: '48px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', flexShrink: 0,
      }}>
        <button className="icon-btn" onClick={() => setSidebarOpen(true)}
          style={{ display: 'none' }} id="mobile-menu">
          <FiMenu size={18} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600 }}>
          🗑️ Trash
        </h1>
      </div>
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        {archivedPages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px' }}>
            <FiTrash2 size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p>Trash is empty</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
            {archivedPages.map(page => (
              <div key={page._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)', borderRadius: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>{page.icon || '📄'}</span>
                <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {page.title || 'Untitled'}
                </span>
                <button className="btn btn-ghost" onClick={() => restore(page._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <FiRotateCcw size={14} /> Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Settings Page
const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { setSidebarOpen } = require('./context/AppContext').useApp();
  const [name, setName] = React.useState(user?.name || '');
  const [saving, setSaving] = React.useState(false);
  const toast = require('react-hot-toast').default;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 24px', height: '48px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', flexShrink: 0,
      }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600 }}>
          ⚙️ Settings
        </h1>
      </div>
      <div style={{ padding: '40px 48px', flex: 1, overflowY: 'auto', maxWidth: '600px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Profile</h2>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Display Name</label>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ maxWidth: '320px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ maxWidth: '320px', opacity: 0.6 }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--danger)' }}>
            Danger Zone
          </h2>
          <button className="btn btn-danger" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppProvider>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
    </AppProvider>
  </AuthProvider>
);

export default App;
