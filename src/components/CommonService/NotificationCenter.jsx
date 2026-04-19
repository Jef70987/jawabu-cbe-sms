/* eslint-disable no-unused-vars */
// src/components/common/NotificationCenter.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../Authentication/AuthContext';
import { 
  Bell, CheckCircle, AlertCircle, Info, X, Loader2,
  Pin, PinOff, Archive, Trash2, Eye, CheckCheck,
  Search, Filter, ChevronDown, ChevronUp, Calendar,
  BookOpen, UserCheck, DollarSign, Target, Shield
} from 'lucide-react';

// Portal-specific configurations
const PORTAL_CONFIG = {
  teacher: {
    title: 'Teacher Notifications',
    subtitle: 'Class updates, exam alerts, student attendance',
    allowedTypes: ['academic', 'exam', 'attendance', 'competency', 'admin'],
    canCompose: true,
    canBroadcast: false,
    actions: ['read', 'pin', 'archive', 'delete']
  },
  parent: {
    title: 'Parent Notifications',
    subtitle: 'Your child\'s progress, attendance, and school updates',
    allowedTypes: ['attendance', 'academic', 'finance', 'competency'],
    canCompose: false,
    canBroadcast: false,
    actions: ['read', 'archive']
  },
  student: {
    title: 'My Notifications',
    subtitle: 'Your grades, competency progress, and portfolio feedback',
    allowedTypes: ['academic', 'competency', 'portfolio'],
    canCompose: false,
    canBroadcast: false,
    actions: ['read']
  },
  admin: {
    title: 'Admin Notifications',
    subtitle: 'System alerts, broadcasts, and approval requests',
    allowedTypes: ['all'],
    canCompose: true,
    canBroadcast: true,
    actions: ['read', 'pin', 'archive', 'delete', 'broadcast']
  }
};

const NotificationCenter = ({ portal = 'teacher' }) => {
  const { user } = useAuth();
  const {
    notifications,
    pinnedNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    togglePin,
    archive,
    delete: deleteNotification
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const config = PORTAL_CONFIG[portal];

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => n.status === 'Unread');
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.status === 'Read');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [notifications, filter, searchTerm]);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{config.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{notifications.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Unread</p>
          <p className="text-xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Pinned</p>
          <p className="text-xl font-bold text-yellow-600">{pinnedNotifications.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'read' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Read
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1 text-sm border border-gray-300 rounded-md w-48"
          />
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedNotifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Pin className="h-3 w-3" /> Pinned
          </h2>
          <div className="space-y-3">
            {pinnedNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                portal={portal}
                config={config}
                onRead={markAsRead}
                onPin={togglePin}
                onArchive={archive}
                onDelete={deleteNotification}
                isExpanded={expandedId === notification.id}
                onToggleExpand={() => setExpandedId(expandedId === notification.id ? null : notification.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No notifications</h3>
            <p className="text-gray-500 text-sm">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              portal={portal}
              config={config}
              onRead={markAsRead}
              onPin={togglePin}
              onArchive={archive}
              onDelete={deleteNotification}
              isExpanded={expandedId === notification.id}
              onToggleExpand={() => setExpandedId(expandedId === notification.id ? null : notification.id)}
            />
          ))
        )}
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <CheckCheck className="h-4 w-4 inline mr-1" />
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({ 
  notification, portal, config, 
  onRead, onPin, onArchive, onDelete,
  isExpanded, onToggleExpand 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'normal': return 'border-l-4 border-l-blue-500';
      default: return '';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleRead = () => {
    if (notification.status === 'Unread') {
      onRead(notification.id);
    }
  };

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(notification.priority)} ${notification.status === 'Unread' ? 'bg-blue-50' : ''}`}
    >
      <div className="p-4" onClick={handleRead}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {notification.priority?.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{getTimeAgo(notification.sent_at)}</span>
              {notification.status === 'Unread' && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">New</span>
              )}
            </div>
            
            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
            <p className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {notification.message}
            </p>
            
            {notification.action_url && (
              <a 
                href={notification.action_url}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                View Details →
              </a>
            )}
          </div>
          
          <div className="flex gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
            {config.actions.includes('pin') && (
              <button onClick={() => onPin(notification.id, notification.pinned)} className="p-1 text-gray-400 hover:text-yellow-600">
                {notification.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </button>
            )}
            {config.actions.includes('archive') && (
              <button onClick={() => onArchive(notification.id)} className="p-1 text-gray-400 hover:text-gray-600">
                <Archive className="h-4 w-4" />
              </button>
            )}
            {config.actions.includes('delete') && (
              <button onClick={() => onDelete(notification.id)} className="p-1 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onToggleExpand} className="p-1 text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;