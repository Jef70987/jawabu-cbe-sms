import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle, AlertCircle,
  Eye, Edit2, Plus, Search, Filter,
  Download, MessageSquare, Phone, Mail,
  TrendingUp, UserCheck, Bell
} from 'lucide-react';

const InterventionsFollowUp = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const followUps = [
    {
      id: 'FU001',
      student: 'James Wilson',
      grade: '11A',
      intervention: 'Behavior Plan BP001',
      type: 'Progress Check',
      scheduledDate: '2024-04-05',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Dr. Martinez',
      notes: 'Review behavior progress and adjust strategies',
      lastContact: '2024-03-29'
    },
    {
      id: 'FU002',
      student: 'Michael Brown',
      grade: '12C',
      intervention: 'Peer Mediation PM001',
      type: 'Resolution Follow-up',
      scheduledDate: '2024-04-04',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Mr. Brown',
      notes: 'Check if agreement terms are being followed',
      lastContact: '2024-04-01'
    },
    {
      id: 'FU003',
      student: 'Sarah Chen',
      grade: '10B',
      intervention: 'Restorative Circle RJ002',
      type: 'Post-Circle Check',
      scheduledDate: '2024-04-02',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Ms. Thompson',
      notes: 'All parties satisfied with resolution',
      lastContact: '2024-04-02'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFollowUps = followUps.filter(f =>
    (activeTab === 'all' || f.status === activeTab) &&
    (f.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     f.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Follow-Up Management</h1>
          <p className="text-gray-600 mt-1">Track and manage intervention follow-ups</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Follow-ups</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Follow-ups</p>
          <p className="text-2xl font-bold text-gray-800">86</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">58</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-red-600">8</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending
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
              All Follow-ups
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
                  placeholder="Search by student name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Progress Check</option>
              <option>Resolution Follow-up</option>
              <option>Post-Circle Check</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {/* Follow-ups List */}
          <div className="space-y-4">
            {filteredFollowUps.map((followUp) => (
              <div key={followUp.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Bell size={20} className="text-purple-600" />
                      <h3 className="font-semibold text-gray-800">{followUp.student}</h3>
                      <span className="text-xs text-gray-500">Grade {followUp.grade}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(followUp.priority)}`}>
                        {followUp.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Intervention: {followUp.intervention}</p>
                    <p className="text-sm text-gray-700 mt-2">Type: {followUp.type}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Scheduled: {followUp.scheduledDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserCheck size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Assigned to: {followUp.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Last Contact: {followUp.lastContact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(followUp.status)}`}>
                          {followUp.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-white rounded-lg">
                      <p className="text-sm text-gray-700">Notes: {followUp.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Phone size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Mail size={16} className="text-gray-600" />
                    </button>
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Reminders */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Today</p>
              <p className="text-xs text-gray-600">3 follow-ups due</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Tomorrow</p>
              <p className="text-xs text-gray-600">5 follow-ups due</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bell size={20} className="text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Overdue</p>
              <p className="text-xs text-gray-600">2 follow-ups overdue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionsFollowUp;