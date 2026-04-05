import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MoreVertical,
  Calendar, Clock, AlertTriangle, CheckCircle,
  UserX, Download, Plus, MessageSquare, FileText
} from 'lucide-react';

const SuspensionsActive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const activeSuspensions = [
    {
      id: 'SUS001',
      student: 'James Wilson',
      grade: '11A',
      reason: 'Physical altercation with another student',
      type: 'Out-of-School',
      startDate: '2024-04-01',
      endDate: '2024-04-08',
      days: 7,
      status: 'Active',
      assignedBy: 'Dr. Martinez',
      progress: 30,
      appeal: false,
      parentNotified: true
    },
    {
      id: 'SUS002',
      student: 'Sarah Chen',
      grade: '10B',
      reason: 'Repeated truancy and class disruptions',
      type: 'In-School',
      startDate: '2024-04-02',
      endDate: '2024-04-05',
      days: 4,
      status: 'Active',
      assignedBy: 'Ms. Thompson',
      progress: 50,
      appeal: false,
      parentNotified: true
    },
    {
      id: 'SUS003',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Academic dishonesty - plagiarism',
      type: 'Out-of-School',
      startDate: '2024-04-03',
      endDate: '2024-04-10',
      days: 7,
      status: 'Active',
      assignedBy: 'Prof. Johnson',
      progress: 20,
      appeal: true,
      parentNotified: true
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'In-School': return 'bg-yellow-100 text-yellow-800';
      case 'Out-of-School': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredSuspensions = activeSuspensions.filter(s =>
    (filterType === 'all' || s.type === filterType) &&
    (s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Active Suspensions</h1>
          <p className="text-gray-600 mt-1">Currently active student suspensions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Suspension</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Suspensions</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">In-School</p>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Out-of-School</p>
          <p className="text-2xl font-bold text-red-600">7</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">With Appeals</p>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
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
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="In-School">In-School</option>
            <option value="Out-of-School">Out-of-School</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Suspensions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuspensions.map((suspension) => (
          <div key={suspension.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <UserX size={20} className="text-red-500" />
                    <span className="font-mono text-sm font-medium text-gray-500">{suspension.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{suspension.student}</h3>
                  <p className="text-sm text-gray-600">Grade {suspension.grade}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(suspension.type)}`}>
                  {suspension.type}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Reason</p>
                <p className="text-gray-800">{suspension.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-red-600">{suspension.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.days} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned By</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.assignedBy}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-800">{suspension.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(suspension.progress)}`}
                    style={{ width: `${suspension.progress}%` }}
                  ></div>
                </div>
              </div>

              {suspension.appeal && (
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle size={14} className="text-yellow-600" />
                  <span className="text-xs text-yellow-700">Appeal pending review</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageSquare size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspensionsActive;