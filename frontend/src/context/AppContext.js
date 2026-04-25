import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/pages');
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPage = useCallback(async (id) => {
    try {
      const data = await api.get(`/pages/${id}`);
      setCurrentPage(data.page);
      return data.page;
    } catch {
      toast.error('Failed to load page');
      return null;
    }
  }, []);

  const createPage = useCallback(async (pageData = {}) => {
    try {
      const data = await api.post('/pages', pageData);
      setPages(prev => [data.page, ...prev]);
      toast.success('Page created!');
      return data.page;
    } catch {
      toast.error('Failed to create page');
      return null;
    }
  }, []);

  const updatePage = useCallback(async (id, updates) => {
    try {
      const data = await api.put(`/pages/${id}`, updates);
      setPages(prev => prev.map(p => p._id === id ? { ...p, ...updates } : p));
      if (currentPage?._id === id) {
        setCurrentPage(prev => ({ ...prev, ...updates }));
      }
      return data.page;
    } catch {
      toast.error('Failed to update page');
    }
  }, [currentPage]);

  const deletePage = useCallback(async (id) => {
    try {
      await api.delete(`/pages/${id}`);
      setPages(prev => prev.filter(p => p._id !== id));
      if (currentPage?._id === id) setCurrentPage(null);
      toast.success('Page moved to trash');
    } catch {
      toast.error('Failed to delete page');
    }
  }, [currentPage]);

  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await api.get(`/tasks?${params}`);
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const data = await api.post('/tasks', taskData);
      setTasks(prev => [data.task, ...prev]);
      toast.success('Task created!');
      return data.task;
    } catch {
      toast.error('Failed to create task');
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const data = await api.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => t._id === id ? data.task : t));
      return data.task;
    } catch {
      toast.error('Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  }, []);

  return (
    <AppContext.Provider value={{
      pages, tasks, currentPage, sidebarOpen, loading,
      setCurrentPage, setSidebarOpen,
      fetchPages, fetchPage, createPage, updatePage, deletePage,
      fetchTasks, createTask, updateTask, deleteTask,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
