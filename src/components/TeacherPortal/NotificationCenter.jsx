/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {
  Bell, MessageSquare, Megaphone, Calendar, FileText, Users,
  AlertCircle, CheckCircle, X, Loader2, RefreshCw, Eye,
  Trash2, Check, Clock, Award, BookOpen, Target, Star,
  Filter, ChevronDown, ChevronUp, Mail, Send, Paperclip,
  UserPlus, Settings, Download, Archive, Flag
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Notification Types
const NOTIFICATION_TYPES = {
  announcement: { icon: Megaphone, color: 'bg-blue-100 text-blue-700', label: 'Announcement' },
  message: { icon: MessageSquare, color: 'bg-green-100 text-green-700', label: 'Message' },
  task: { icon: CheckCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Task' },
  reminder: { icon: Bell, color: 'bg-purple-100 text-purple-700', label: 'Reminder' },
  deadline: { icon: Clock, color: 'bg-red-100 text-red-700', label: 'Deadline' },
  approval: { icon: Users, color: 'bg-orange-100 text-orange-700', label: 'Approval' },
  achievement: { icon: Award, color: 'bg-green-100 text-green-700', label: 'Achievement' },
  meeting: { icon: Calendar, color: 'bg-indigo-100 text-indigo-700', label: 'Meeting' }
};

// Priority Levels
const PRIORITY = {
  high: { color: 'bg-red-100 text-red-800', label: 'High' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  low: { color: 'bg-green-100 text-green-800', label: 'Low' }
};

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles[type]} border p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Compose Message Modal
const ComposeMessageModal = ({ isOpen, onClose, onSend, recipients }) => {
  const [message, setMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium',
    type: 'message',
    attachment: null
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.to || !message.subject || !message.content) {
      alert('Please fill in all required fields');
      return;
    }
    setSending(true);
    await onSend(message);
    setSending(false);
    setMessage({ to: '', subject: '', content: '', priority: 'medium', type: 'message', attachment: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">Compose New Message</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">To *</label>
            <select 
              value={message.to}
              onChange={(e) => setMessage({...message, to: e.target.value})}
              className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
            >
              <option value="">Select Recipient</option>
              {recipients.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject *</label>
            <input 
              type="text" 
              value={message.subject}
              onChange={(e) => setMessage({...message, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              placeholder="Enter subject"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
            <select 
              value={message.priority}
              onChange={(e) => setMessage({...message, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Message *</label>
            <textarea 
              value={message.content}
              onChange={(e) => setMessage({...message, content: e.target.value})}
              rows="6"
              className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              placeholder="Type your message here..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Attachment (Optional)</label>
            <input 
              type="file" 
              onChange={(e) => setMessage({...message, attachment: e.target.files[0]})}
              className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold border border-blue-700 hover:bg-blue-700 disabled:opacity-50">
            {sending ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Send className="h-4 w-4 inline mr-2" />}
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Detail Modal
const NotificationDetailModal = ({ notification, onClose, onMarkAsRead }) => {
  if (!notification) return null;

  const TypeIcon = NOTIFICATION_TYPES[notification.type]?.icon || Bell;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded ${NOTIFICATION_TYPES[notification.type]?.color}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold text-gray-900">{notification.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">From: {notification.sender}</p>
              <p className="text-sm text-gray-500">Date: {notification.date}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium ${PRIORITY[notification.priority]?.color}`}>
              {PRIORITY[notification.priority]?.label} Priority
            </span>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{notification.content}</p>
          </div>
          {notification.attachment && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-300">
              <p className="text-sm font-bold text-gray-700">Attachment:</p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
                <Paperclip className="h-3 w-3" />
                {notification.attachment}
              </a>
            </div>
          )}
          {notification.actionRequired && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300">
              <p className="text-sm text-yellow-800">⚠️ Action Required: {notification.actionRequired}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          {!notification.read && (
            <button onClick={() => { onMarkAsRead(notification.id); onClose(); }} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
              <Check className="h-4 w-4 inline mr-2" />
              Mark as Read
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function NotificationCenter() {
  const { getAuthHeaders, isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifNotifications, setNotifNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access notifications');
      return;
    }
    fetchNotifications();
    fetchRecipients();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab, filterType, filterPriority, searchTerm]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/notifications/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
        setFilteredNotifications(data.data);
        updateStats(data.data);
      } else {
        // Mock notifications
        const mockNotifications = [
          {
            id: 1,
            title: 'Staff Meeting Tomorrow',
            content: 'There will be a staff meeting tomorrow at 8:00 AM in the staff room. Attendance is mandatory.',
            type: 'meeting',
            priority: 'high',
            sender: 'Principal Office',
            sender_id: 101,
            sender_role: 'Administrator',
            date: '2024-03-18T08:00:00',
            read: false,
            actionRequired: 'Confirm attendance',
            attachment: null
          },
          {
            id: 2,
            title: 'Marking Deadline Extended',
            content: 'The deadline for submitting end of term marks has been extended to Friday, March 22nd.',
            type: 'deadline',
            priority: 'high',
            sender: 'Academic Registrar',
            sender_id: 102,
            sender_role: 'Registrar',
            date: '2024-03-17T14:30:00',
            read: false,
            actionRequired: 'Submit marks by deadline',
            attachment: 'marking_guidelines.pdf'
          },
          {
            id: 3,
            title: 'New Curriculum Workshop',
            content: 'There will be a workshop on the new CBC curriculum implementation next Monday.',
            type: 'announcement',
            priority: 'medium',
            sender: 'HOD Academics',
            sender_id: 103,
            sender_role: 'HOD',
            date: '2024-03-16T10:15:00',
            read: true,
            actionRequired: null,
            attachment: null
          },
          {
            id: 4,
            title: 'Message from HOD Science',
            content: 'Please ensure all science practical records are updated in the system by end of week.',
            type: 'message',
            priority: 'medium',
            sender: 'HOD Science Department',
            sender_id: 104,
            sender_role: 'HOD',
            date: '2024-03-15T09:45:00',
            read: false,
            actionRequired: 'Update records',
            attachment: null
          },
          {
            id: 5,
            title: 'Teacher of the Month Nomination',
            content: 'You have been nominated for Teacher of the Month award. Congratulations!',
            type: 'achievement',
            priority: 'low',
            sender: 'Staff Welfare Committee',
            sender_id: 105,
            sender_role: 'Committee',
            date: '2024-03-14T16:20:00',
            read: false,
            actionRequired: 'Accept nomination',
            attachment: null
          },
          {
            id: 6,
            title: 'Parent-Teacher Conference Schedule',
            content: 'Parent-Teacher conference has been scheduled for March 25th. Please prepare student reports.',
            type: 'reminder',
            priority: 'high',
            sender: 'Principal Office',
            sender_id: 101,
            sender_role: 'Administrator',
            date: '2024-03-13T11:00:00',
            read: true,
            actionRequired: 'Prepare reports',
            attachment: 'schedule.pdf'
          },
          {
            id: 7,
            title: 'Approval Required: Leave Request',
            content: 'Your leave request for April 10-15 needs approval from the Principal.',
            type: 'approval',
            priority: 'high',
            sender: 'HR Department',
            sender_id: 106,
            sender_role: 'HR',
            date: '2024-03-12T08:30:00',
            read: false,
            actionRequired: 'Awaiting approval',
            attachment: null
          },
          {
            id: 8,
            title: 'New Assignment: Marking Scheme',
            content: 'You have been assigned to review the Grade 7 Mathematics marking scheme.',
            type: 'task',
            priority: 'medium',
            sender: 'Examination Office',
            sender_id: 107,
            sender_role: 'Examinations',
            date: '2024-03-11T13:45:00',
            read: false,
            actionRequired: 'Review and submit feedback',
            attachment: 'marking_scheme_draft.docx'
          }
        ];
        setNotifications(mockNotifications);
        setFilteredNotifications(mockNotifications);
        updateStats(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      addNotification('error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/recipients/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setRecipients(data.data);
      } else {
        setRecipients([
          { id: 101, name: 'Principal Office', role: 'Administrator' },
          { id: 102, name: 'Academic Registrar', role: 'Registrar' },
          { id: 103, name: 'HOD Academics', role: 'HOD' },
          { id: 104, name: 'HOD Science', role: 'HOD' },
          { id: 105, name: 'HR Department', role: 'HR' },
          { id: 106, name: 'Examination Office', role: 'Examinations' },
          { id: 201, name: 'John Mwangi', role: 'Teacher' },
          { id: 202, name: 'Mary Wanjiku', role: 'Teacher' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const updateStats = (data) => {
    setStats({
      total: data.length,
      unread: data.filter(n => !n.read).length,
      high: data.filter(n => n.priority === 'high').length,
      medium: data.filter(n => n.priority === 'medium').length,
      low: data.filter(n => n.priority === 'low').length
    });
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (filterType) {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Filter by priority
    if (filterPriority) {
      filtered = filtered.filter(n => n.priority === filterPriority);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term) ||
        n.sender.toLowerCase().includes(term)
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/notifications/${id}/read/`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
        addNotification('success', 'Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/notifications/mark-all-read/`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        addNotification('success', 'All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/notifications/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        addNotification('success', 'Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/notifications/send/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(messageData)
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Message sent successfully');
        await fetchNotifications();
      } else {
        addNotification('error', data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification('error', 'Failed to send message');
    }
  };

  const viewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access notifications</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notifNotifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Compose Message Modal */}
      <ComposeMessageModal 
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSend={sendMessage}
        recipients={recipients}
      />

      {/* Notification Detail Modal */}
      <NotificationDetailModal 
        notification={selectedNotification}
        onClose={() => { setShowDetailModal(false); setSelectedNotification(null); }}
        onMarkAsRead={markAsRead}
      />

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Notification Center</h1>
              <p className="text-blue-100 mt-1">Stay updated with announcements, messages, and tasks</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowComposeModal(true)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                <Send className="h-4 w-4 inline mr-2" />
                Compose
              </button>
              <button onClick={markAllAsRead} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
                <Check className="h-4 w-4 inline mr-2" />
                Mark All Read
              </button>
              <button onClick={fetchNotifications} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Unread</p>
            <p className="text-2xl font-bold text-blue-700">{stats.unread}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-red-700">{stats.high}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Medium Priority</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.medium}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Low Priority</p>
            <p className="text-2xl font-bold text-green-700">{stats.low}</p>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white border border-gray-300 mb-6">
          <div className="border-b border-gray-300 px-4 py-2 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white border border-blue-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              All Notifications
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'unread' ? 'bg-blue-600 text-white border border-blue-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Unread ({stats.unread})
            </button>
            <button 
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'read' ? 'bg-blue-600 text-white border border-blue-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Read
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Type</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white"
                >
                  <option value="">All Types</option>
                  {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Priority</label>
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Search</label>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notifications..." 
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => {
                const TypeIcon = NOTIFICATION_TYPES[notification.type]?.icon || Bell;
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => viewNotification(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${NOTIFICATION_TYPES[notification.type]?.color}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium ${PRIORITY[notification.priority]?.color}`}>
                              {PRIORITY[notification.priority]?.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {NOTIFICATION_TYPES[notification.type]?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatDate(notification.date)}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{notification.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>From: {notification.sender}</span>
                          {notification.actionRequired && (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <Flag className="h-3 w-3" />
                              Action Required
                            </span>
                          )}
                          {!notification.read && (
                            <span className="text-blue-600">● New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-300 p-4 text-center">
            <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Send Message</p>
            <p className="text-xs text-gray-500 mt-1">To HOD or Admin</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <Bell className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Set Reminder</p>
            <p className="text-xs text-gray-500 mt-1">For tasks and deadlines</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Group Message</p>
            <p className="text-xs text-gray-500 mt-1">To multiple recipients</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <Settings className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Preferences</p>
            <p className="text-xs text-gray-500 mt-1">Notification settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;