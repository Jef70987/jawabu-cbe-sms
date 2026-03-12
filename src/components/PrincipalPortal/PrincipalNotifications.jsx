import React, { useState } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Clock,
  MessageSquare, Calendar, Users, DollarSign,
  FileText, Eye, Trash2, CheckCheck, Filter,
  Search, Settings, Star, XCircle, Award,
  TrendingUp, GraduationCap
} from 'lucide-react';

const PrincipalNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Notifications Data
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Emergency Staff Meeting',
      message: 'Urgent meeting scheduled for today at 3:00 PM regarding safety protocols',
      time: '10 minutes ago',
      date: '2024-03-15',
      read: false,
      priority: 'High',
      actionable: true,
      link: '/principal/calendar/meetings'
    },
    {
      id: 2,
      type: 'financial',
      title: 'Budget Review Required',
      message: 'Q2 budget variance report needs your approval by Friday',
      time: '30 minutes ago',
      date: '2024-03-15',
      read: false,
      priority: 'High',
      actionable: true,
      link: '/principal/finance/budget'
    },
    {
      id: 3,
      type: 'academic',
      title: 'Academic Performance Alert',
      message: 'Grade 11 mathematics scores show significant improvement',
      time: '2 hours ago',
      date: '2024-03-15',
      read: false,
      priority: 'Medium',
      actionable: false,
      link: '/principal/academic/performance'
    },
    {
      id: 4,
      type: 'discipline',
      title: 'High Severity Case Filed',
      message: 'New disciplinary case requiring principal attention',
      time: '3 hours ago',
      date: '2024-03-15',
      read: true,
      priority: 'High',
      actionable: true,
      link: '/principal/discipline/cases'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance this weekend from 2 AM to 4 AM',
      time: '5 hours ago',
      date: '2024-03-15',
      read: true,
      priority: 'Low',
      actionable: false,
      link: '/principal/settings'
    },
    {
      id: 6,
      type: 'staff',
      title: 'Staff Leave Requests',
      message: '3 new leave requests pending approval',
      time: '1 day ago',
      date: '2024-03-14',
      read: true,
      priority: 'Medium',
      actionable: true,
      link: '/principal/staff/leave'
    },
    {
      id: 7,
      type: 'event',
      title: 'Graduation Planning Meeting',
      message: 'Final graduation ceremony planning meeting tomorrow at 10 AM',
      time: '1 day ago',
      date: '2024-03-14',
      read: true,
      priority: 'Medium',
      actionable: true,
      link: '/principal/calendar/events'
    },
    {
      id: 8,
      type: 'success',
      title: 'Accreditation Update',
      message: 'Preliminary accreditation report received - positive feedback',
      time: '2 days ago',
      date: '2024-03-13',
      read: true,
      priority: 'Low',
      actionable: false,
      link: '/principal/reports/accreditation'
    },
  ];

  const tabs = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'unread', name: 'Unread', count: 3 },
    { id: 'urgent', name: 'Urgent', count: 2 },
    { id: 'action', name: 'Action Required', count: 4 },
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'urgent': return <AlertTriangle size={20} className="text-red-500" />;
      case 'financial': return <DollarSign size={20} className="text-green-500" />;
      case 'academic': return <GraduationCap size={20} className="text-blue-500" />;
      case 'discipline': return <AlertTriangle size={20} className="text-orange-500" />;
      case 'system': return <Bell size={20} className="text-purple-500" />;
      case 'staff': return <Users size={20} className="text-indigo-500" />;
      case 'event': return <Calendar size={20} className="text-yellow-500" />;
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

  const getNotificationTypeColor = (type) => {
    switch(type) {
      case 'urgent': return 'border-l-4 border-l-red-500';
      case 'financial': return 'border-l-4 border-l-green-500';
      case 'academic': return 'border-l-4 border-l-blue-500';
      case 'discipline': return 'border-l-4 border-l-orange-500';
      default: return '';
    }
  };

  const filteredNotifications = activeTab === 'all' ? notifications :
    activeTab === 'unread' ? notifications.filter(n => !n.read) :
    activeTab === 'urgent' ? notifications.filter(n => n.priority === 'High') :
    notifications.filter(n => n.actionable);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'High').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay informed about important updates and actions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <CheckCheck size={18} className="text-gray-600" />
            <span>Mark all as read</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
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
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-orange-600">{urgentCount}</p>
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
              <p className="text-2xl font-bold text-purple-600">4</p>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
              <option>Urgent</option>
              <option>Financial</option>
              <option>Academic</option>
              <option>Discipline</option>
              <option>Staff</option>
              <option>Events</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
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
                !notification.read ? 'bg-blue-50' : ''
              } ${getNotificationTypeColor(notification.type)}`}
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
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
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
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
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
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
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
                    <span className="text-sm text-gray-700">Urgent alerts</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Financial updates</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Academic reports</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Staff matters</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Push Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Critical updates</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily summary</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Meeting reminders</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
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
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

export default PrincipalNotifications;