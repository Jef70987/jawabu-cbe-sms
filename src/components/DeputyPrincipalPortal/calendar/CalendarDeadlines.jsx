import React, { useState } from 'react';
import {
  Calendar, Clock, AlertCircle, CheckCircle,
  Eye, Edit2, Plus, Search, Filter,
  Download, Bell, Flag, Clock as Timer,
  TrendingUp, AlertTriangle
} from 'lucide-react';

const CalendarDeadlines = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const deadlines = [
    {
      id: 'DL001',
      title: 'Appeal Submission Deadline',
      description: 'Final day for students to submit appeals for Q1 suspensions',
      type: 'Appeal',
      dueDate: '2024-04-05',
      dueTime: '5:00 PM',
      priority: 'High',
      status: 'Upcoming',
      assignedTo: 'All Students',
      reminder: true,
      daysRemaining: 3
    },
    {
      id: 'DL002',
      title: 'Disciplinary Report Submission',
      description: 'Monthly disciplinary summary report due to Principal',
      type: 'Report',
      dueDate: '2024-04-07',
      dueTime: '9:00 AM',
      priority: 'High',
      status: 'Upcoming',
      assignedTo: 'Dr. Martinez',
      reminder: true,
      daysRemaining: 5
    },
    {
      id: 'DL003',
      title: 'Hearing Decisions Deadline',
      description: 'Final decisions for all March hearings must be submitted',
      type: 'Decision',
      dueDate: '2024-04-10',
      dueTime: '4:00 PM',
      priority: 'Medium',
      status: 'Upcoming',
      assignedTo: 'Discipline Committee',
      reminder: false,
      daysRemaining: 8
    },
    {
      id: 'DL004',
      title: 'Suspension Review Meeting',
      description: 'Quarterly suspension review with board members',
      type: 'Meeting',
      dueDate: '2024-04-12',
      dueTime: '10:00 AM',
      priority: 'Medium',
      status: 'Scheduled',
      assignedTo: 'Dr. Martinez, Board Members',
      reminder: true,
      daysRemaining: 10
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Appeal': return 'bg-purple-100 text-purple-800';
      case 'Report': return 'bg-blue-100 text-blue-800';
      case 'Decision': return 'bg-orange-100 text-orange-800';
      case 'Meeting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemainingColor = (days) => {
    if (days <= 2) return 'text-red-600';
    if (days <= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  const filteredDeadlines = deadlines.filter(deadline =>
    (activeTab === 'all' || deadline.status === activeTab) &&
    (deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     deadline.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Deadlines & Reminders</h1>
          <p className="text-gray-600 mt-1">Track important deadlines and upcoming tasks</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Deadlines</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Deadlines</p>
          <p className="text-2xl font-bold text-gray-800">24</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-xs text-gray-500">Next 7 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-red-600">6</p>
          <p className="text-xs text-gray-500">Require attention</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Deadlines
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Deadlines
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search deadlines..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Appeal</option>
              <option>Report</option>
              <option>Decision</option>
              <option>Meeting</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredDeadlines.map((deadline) => (
              <div key={deadline.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <AlertCircle size={20} className="text-purple-600" />
                      <h3 className="font-semibold text-gray-800">{deadline.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(deadline.type)}`}>
                        {deadline.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Due: {deadline.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">By: {deadline.dueTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Assigned to: {deadline.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer size={14} className="text-gray-400" />
                        <span className={`text-sm font-medium ${getDaysRemainingColor(deadline.daysRemaining)}`}>
                          {deadline.daysRemaining} days remaining
                        </span>
                      </div>
                    </div>

                    {deadline.reminder && (
                      <div className="mt-3 flex items-center space-x-2">
                        <Bell size={14} className="text-blue-500" />
                        <span className="text-xs text-gray-500">Reminder notifications enabled</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Bell size={16} className="text-gray-600" />
                    </button>
                    {deadline.status !== 'Completed' && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Week Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3">This Week's Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Deadlines</span>
              <span className="font-semibold text-gray-800">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">By Tomorrow</span>
              <span className="font-semibold text-orange-600">2</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Overdue Items</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appeal Submissions</p>
              <p className="text-xs text-gray-500">Due: Yesterday</p>
            </div>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              Review Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white hover:shadow-lg transition">
          <AlertTriangle size={20} className="mb-1" />
          <p className="text-sm font-semibold">Urgent Deadlines</p>
          <p className="text-xs text-red-100">View critical items</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <CheckCircle size={20} className="mb-1" />
          <p className="text-sm font-semibold">Completed Tasks</p>
          <p className="text-xs text-green-100">Review history</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <Calendar size={20} className="mb-1" />
          <p className="text-sm font-semibold">Calendar View</p>
          <p className="text-xs text-blue-100">See all deadlines</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <TrendingUp size={20} className="mb-1" />
          <p className="text-sm font-semibold">Performance Report</p>
          <p className="text-xs text-purple-100">Deadline compliance</p>
        </button>
      </div>
    </div>
  );
};

export default CalendarDeadlines;