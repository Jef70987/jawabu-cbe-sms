import React, { useState } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Clock,
  MessageSquare, Calendar, Gavel, Heart,
  Users, FileText, Eye, Trash2, CheckCheck,
  Filter, Search, Settings, Star, XCircle
} from 'lucide-react';

const DeputyNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Notifications Data
  const notifications = [
    {
      id: 1,
      type: 'case',
      title: 'New Disciplinary Case Filed',
      message: 'James Wilson - Physical altercation reported by Ms. Thompson',
      time: '5 minutes ago',
      date: '2024-03-15',
      read: false,
      priority: 'High',
      actionable: true,
      link: '/deputy/discipline/cases/DC001'
    },
    {
      id: 2,
      type: 'hearing',
      title: 'Hearing Scheduled',
      message: 'Sarah Chen - Truancy case hearing scheduled for tomorrow at 10:00 AM',
      time: '15 minutes ago',
      date: '2024-03-15',
      read: false,
      priority: 'High',
      actionable: true,
      link: '/deputy/calendar/hearings'
    },
    {
      id: 3,
      type: 'appeal',
      title: 'Appeal Submitted',
      message: 'Michael Brown has submitted an appeal for suspension decision',
      time: '1 hour ago',
      date: '2024-03-15',
      read: false,
      priority: 'High',
      actionable: true,
      link: '/deputy/discipline/appeals'
    },
    {
      id: 4,
      type: 'counseling',
      title: 'Counseling Session Reminder',
      message: 'Group counseling session starts in 30 minutes',
      time: '2 hours ago',
      date: '2024-03-15',
      read: true,
      priority: 'Medium',
      actionable: false,
      link: '/deputy/counseling/schedule'
    },
    {
      id: 5,
      type: 'system',
      title: 'Report Ready for Review',
      message: 'Weekly discipline summary report has been generated',
      time: '3 hours ago',
      date: '2024-03-15',
      read: true,
      priority: 'Low',
      actionable: true,
      link: '/deputy/case-reports/weekly'
    },
    {
      id: 6,
      type: 'deadline',
      title: 'Appeal Deadline Tomorrow',
      message: '3 pending appeals need review by tomorrow 5:00 PM',
      time: '5 hours ago',
      date: '2024-03-14',
      read: true,
      priority: 'High',
      actionable: true,
      link: '/deputy/discipline/appeals'
    },
    {
      id: 7,
      type: 'meeting',
      title: 'Staff Meeting Reminder',
      message: 'Discipline review meeting tomorrow at 9:00 AM in Conference Room A',
      time: '1 day ago',
      date: '2024-03-14',
      read: true,
      priority: 'Medium',
      actionable: true,
      link: '/deputy/calendar/meetings'
    },
    {
      id: 8,
      type: 'success',
      title: 'Case Resolved',
      message: 'David Lee - Vandalism case has been resolved with community service',
      time: '1 day ago',
      date: '2024-03-14',
      read: true,
      priority: 'Low',
      actionable: false,
      link: '/deputy/discipline/resolved'
    },
  ];

  const tabs = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'unread', name: 'Unread', count: 3 },
    { id: 'high', name: 'High Priority', count: 4 },
    { id: 'action', name: 'Action Required', count: 5 },
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'case': return <Gavel size={20} className="text-red-500" />;
      case 'hearing': return <Calendar size={20} className="text-purple-500" />;
      case 'appeal': return <FileText size={20} className="text-orange-500" />;
      case 'counseling': return <Heart size={20} className="text-green-500" />;
      case 'system': return <Bell size={20} className="text-blue-500" />;
      case 'deadline': return <Clock size={20} className="text-yellow-500" />;
      case 'meeting': return <Users size={20} className="text-indigo-500" />;
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = activeTab === 'all' ? notifications :
    activeTab === 'unread' ? notifications.filter(n => !n.read) :
    activeTab === 'high' ? notifications.filter(n => n.priority === 'High') :
    notifications.filter(n => n.actionable);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with case alerts and system notifications</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <CheckCheck size={18} className="text-gray-600" />
            <span>Mark all as read</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bell size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">4</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Star size={20} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-purple-600">5</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All Types</option>
              <option>Cases</option>
              <option>Hearings</option>
              <option>Appeals</option>
              <option>Counseling</option>
              <option>Meetings</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 hover:bg-gray-50 transition ${
                !notification.read ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${
                    !notification.read ? 'bg-white' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {notification.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {notification.actionable && (
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Take Action
                    </button>
                  )}
                  <button className="p-1 hover:bg-gray-200 rounded-lg" title="View">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded-lg" title="Delete">
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Load More Notifications
          </button>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Email Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">New case filings</span>
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Hearing reminders</span>
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Appeal submissions</span>
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" defaultChecked />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Push Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Urgent alerts</span>
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily summary</span>
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Quiet Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg" defaultValue="22:00" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg" defaultValue="07:00" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyNotifications;