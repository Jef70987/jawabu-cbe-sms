import React, { useState } from 'react';
import {
  UserX, Calendar, Clock, AlertTriangle, CheckCircle,
  Search, Filter, Download, Eye, MoreVertical,
  FileText, Mail, Phone, TrendingUp, XCircle
} from 'lucide-react';

const DisciplineSuspensions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuspension, setSelectedSuspension] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
      reviewedBy: 'Principal',
      appeal: false,
      parentNotified: true,
      progress: 60
    },
    {
      id: 'SUS002',
      student: 'Sarah Chen',
      grade: '10B',
      reason: 'Repeated truancy',
      type: 'In-School',
      startDate: '2024-04-02',
      endDate: '2024-04-05',
      days: 3,
      status: 'Active',
      assignedBy: 'Ms. Thompson',
      reviewedBy: 'Deputy Principal',
      appeal: false,
      parentNotified: true,
      progress: 70
    },
    {
      id: 'SUS003',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Academic dishonesty',
      type: 'Out-of-School',
      startDate: '2024-04-03',
      endDate: '2024-04-10',
      days: 7,
      status: 'Active',
      assignedBy: 'Prof. Johnson',
      reviewedBy: 'Principal',
      appeal: true,
      parentNotified: true,
      progress: 40
    }
  ];

  const completedSuspensions = [
    {
      id: 'SUS004',
      student: 'Emily Davis',
      grade: '9D',
      reason: 'Uniform violation',
      type: 'In-School',
      startDate: '2024-03-15',
      endDate: '2024-03-16',
      days: 2,
      outcome: 'Successful',
      followUp: 'Monthly check-ins'
    },
    {
      id: 'SUS005',
      student: 'David Lee',
      grade: '11B',
      reason: 'Vandalism',
      type: 'Out-of-School',
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      days: 5,
      outcome: 'Successful',
      followUp: 'Community service completed'
    }
  ];

  const suspensionStats = {
    total: 45,
    active: 12,
    completed: 28,
    appealed: 4,
    inSchool: 5,
    outOfSchool: 7,
    avgDuration: '4.5 days'
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'In-School': return 'bg-yellow-100 text-yellow-800';
      case 'Out-of-School': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suspensions Management</h1>
          <p className="text-gray-600 mt-1">Oversee all student suspensions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>Generate Summary</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Suspensions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{suspensionStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserX className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This academic year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Suspensions</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{suspensionStats.active}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">Currently active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{suspensionStats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Successfully resolved</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Appeals</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{suspensionStats.appealed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Need review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Suspensions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
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
                  placeholder="Search suspensions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>In-School</option>
              <option>Out-of-School</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {activeTab === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSuspensions.map((suspension) => (
                <div key={suspension.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{suspension.student}</h3>
                      <p className="text-sm text-gray-600">Grade {suspension.grade}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(suspension.type)}`}>
                      {suspension.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{suspension.reason}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-medium text-gray-800">{suspension.startDate} - {suspension.endDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Days</p>
                      <p className="text-sm font-medium text-orange-600">{suspension.days} days</p>
                    </div>
                  </div>
                  <div className="mt-3">
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
                    <div className="mt-2 flex items-center space-x-2 text-xs text-purple-600">
                      <AlertTriangle size={12} />
                      <span>Appeal pending</span>
                    </div>
                  )}
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-white">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedSuspensions.map((suspension) => (
                <div key={suspension.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{suspension.student}</h3>
                      <p className="text-sm text-gray-600">Grade {suspension.grade}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {suspension.outcome}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{suspension.reason}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm text-gray-600">{suspension.startDate} - {suspension.endDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Follow-up</p>
                      <p className="text-sm text-gray-600">{suspension.followUp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisciplineSuspensions;