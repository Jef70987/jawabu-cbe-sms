// src/services/notificationService.js
import { useAuth } from '../components/Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class NotificationService {
  // Fetch notifications for current user (auto-filtered by role)
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/?${queryString}`,
      { headers: useAuth.getAuthHeaders() }
    );
    const data = await response.json();
    return data;
  }

  // Mark single notification as read
  async markAsRead(notificationId) {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read/`,
      { 
        method: 'POST',
        headers: useAuth.getAuthHeaders()
      }
    );
    return response.json();
  }

  // Mark all as read
  async markAllAsRead() {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/mark-all-read/`,
      { 
        method: 'POST',
        headers: useAuth.getAuthHeaders()
      }
    );
    return response.json();
  }

  // Pin/Unpin notification
  async togglePin(notificationId, pinned) {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/pin/`,
      {
        method: 'POST',
        headers: useAuth.getAuthHeaders(),
        body: JSON.stringify({ pinned })
      }
    );
    return response.json();
  }

  // Archive notification
  async archive(notificationId) {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/archive/`,
      {
        method: 'POST',
        headers: useAuth.getAuthHeaders()
      }
    );
    return response.json();
  }

  // Delete notification
  async delete(notificationId) {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/delete/`,
      {
        method: 'DELETE',
        headers: useAuth.getAuthHeaders()
      }
    );
    return response.json();
  }

  // Send notification (Admin/Teacher only)
  async sendNotification(data) {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/send/`,
      {
        method: 'POST',
        headers: useAuth.getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  // Get unread count
  async getUnreadCount() {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/unread-count/`,
      { headers: useAuth.getAuthHeaders() }
    );
    const data = await response.json();
    return data.count;
  }

  // Setup WebSocket connection
  setupWebSocket(userId, onMessage) {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/notifications/${userId}/`;
    const socket = new WebSocket(wsUrl);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    return socket;
  }
}

export default new NotificationService();