import React, { useState } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Clock,
  Calendar, FileText, Users, Award,
  Eye, Trash2, CheckCheck, Filter,
  Search, Settings, XCircle
} from 'lucide-react';

const AcademicNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'exam',
      title: 'Examination Schedule Published',
      message: 'Mid-term examination schedule for all grades has been published',
      time: '5 minutes ago',
      read: false,
      priority: 'High'
    },
    {
      id: 2,
      type: 'result',
      title: 'Results Processing Complete',
      message: 'Quarterly results have been processed and ready for review',
      time: '30 minutes ago',
      read: false,
      priority: 'High'
    },
    {
      id: 3,
      type: 'curriculum',
      title: 'Curriculum Update',
      message: 'New curriculum changes for Grade 11 Science stream',
      time: '2 hours ago',
      read: true,
      priority: 'Medium'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Academic Committee Meeting',
      message: 'Meeting scheduled for tomorrow at 10:00 AM',
      time: '3 hours ago',
      read: true,
      priority: 'Medium'
    },
    {
      id: 5,
      type: 'deadline',
      title: 'Report Card Deadline',
      message: 'Final report cards due by Friday',
      time: '5 hours ago',
      read: true,
      priority: 'High'
    }
  ];

  const tabs = [
    { id: 'all', name: 'All', count: 12 },
    { id: 'unread', name: 'Unread', count: 2 },
    { id: 'high', name: 'High Priority', count: 3 },
    { id: 'action', name: 'Action Required', count: 4 }
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'exam': return <Calendar size={20} className="text-purple-500" />;
      case 'result': return <Award size={20} className="text-green-500" />;
      case 'curriculum': return <FileText size={20} className="text-blue-500" />;
      case 'meeting': return <Users size={20} className="text-orange-500" />;
      case 'deadline': return <Clock size={20} className="text-red-500" />;
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
    notifications;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with academic events and announcements</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <CheckCheck size={18} className="text-gray-600" />
            <span>Mark all as read</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <Bell size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">5</p>
            </div>
            <AlertTriangle size={20} className="text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <Clock size={20} className="text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-purple-600">4</p>
            </div>
            <CheckCircle size={20} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Examinations</option>
              <option>Results</option>
              <option>Curriculum</option>
              <option>Meetings</option>
            </select>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 hover:bg-gray-50 transition ${!notification.read ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${!notification.read ? 'bg-white' : 'bg-gray-100'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-200 rounded-lg">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded-lg">
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            Load More Notifications
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Email Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Examination updates</span>
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Results published</span>
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Curriculum changes</span>
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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

export default AcademicNotifications;