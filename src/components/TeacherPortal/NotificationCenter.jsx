// src/pages/teacher/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Eye, Trash2, CheckCheck, RefreshCw } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced by real API later
    setTimeout(() => {
      setNotifications([
        { id: 1, title: "Student Absent", message: "James Mwangi was marked absent today", type: "attendance", read: false, time: "2 hours ago" },
        { id: 2, title: "Exam Ready", message: "Mathematics CAT is ready for marking", type: "exam", read: false, time: "5 hours ago" },
        { id: 3, title: "Staff Meeting", message: "Meeting scheduled for Friday at 3:00 PM", type: "admin", read: true, time: "Yesterday" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-green-100 mt-1">Stay updated with class activities</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white text-green-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Unread</p>
            <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Read</p>
            <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                  !notif.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                      {!notif.read && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{notif.message}</p>
                    <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;