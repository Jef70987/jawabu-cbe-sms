/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import notificationService from '../Services/NotificationService';
import { useAuth } from '../components/Authentication/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pinnedNotifications, setPinnedNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
        setPinnedNotifications(data.pinned || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get unread count
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  }, [isAuthenticated]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, status: 'Read', read_at: new Date().toISOString() } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev =>
      prev.map(n => ({ ...n, status: 'Read', read_at: new Date().toISOString() }))
    );
    setUnreadCount(0);
  }, []);

  // Toggle pin
  const togglePin = useCallback(async (notificationId, isPinned) => {
    await notificationService.togglePin(notificationId, !isPinned);
    if (!isPinned) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        setPinnedNotifications(prev => [notification, ...prev]);
      }
    } else {
      setPinnedNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
    fetchNotifications(); // Refresh to sync
  }, [notifications, fetchNotifications]);

  // Archive
  const archive = useCallback(async (notificationId) => {
    await notificationService.archive(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setPinnedNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Delete
  const deleteNotification = useCallback(async (notificationId) => {
    await notificationService.delete(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setPinnedNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Send notification (for admins/teachers)
  const sendNotification = useCallback(async (data) => {
    const result = await notificationService.sendNotification(data);
    return result;
  }, []);

  // Setup WebSocket for real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const ws = notificationService.setupWebSocket(user.id, (data) => {
      if (data.type === 'new_notification') {
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [isAuthenticated, user?.id]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll for unread count every 30 seconds as fallback
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications, refreshUnreadCount]);

  const value = {
    notifications,
    pinnedNotifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    togglePin,
    archive,
    delete: deleteNotification,
    sendNotification,
    refreshUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};