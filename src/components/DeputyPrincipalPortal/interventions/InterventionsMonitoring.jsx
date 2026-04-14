import React, { useState } from 'react';
import {
  Activity, Eye, Edit2, Search, Filter,
  Download, CheckCircle, AlertCircle,
  Clock, TrendingUp, TrendingDown, UserCheck
} from 'lucide-react';

const InterventionsMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const monitoringData = [
    {
      id: 'MON001',
      student: 'James Wilson',
      grade: '11A',
      plan: 'Behavior Plan BP001',
      lastCheck: '2024-04-01',
      nextCheck: '2024-04-08',
      status: 'On Track',
      improvements: ['Reduced disruptions', 'Better peer interaction'],
      concerns: ['Occasional outbursts'],
      metrics: {
        attendance: 85,
        behaviorScore: 75,
        assignmentCompletion: 70
      }
    },
    {
      id: 'MON002',
      student: 'Michael Brown',
      grade: '12C',
      plan: 'Behavior Plan BP002',
      lastCheck: '2024-04-01',
      nextCheck: '2024-04-05',
      status: 'Needs Attention',
      improvements: ['Attending counseling'],
      concerns: ['Anger management issues persist'],
      metrics: {
        attendance: 78,
        behaviorScore: 55,
        assignmentCompletion: 60
      }
    },
    {
      id: 'MON003',
      student: 'Sarah Chen',
      grade: '10B',
      plan: 'Behavior Plan BP003',
      lastCheck: '2024-03-28',
      nextCheck: '2024-04-04',
      status: 'Excellent',
      improvements: ['Attendance improved', 'Homework completed'],
      concerns: [],
      metrics: {
        attendance: 92,
        behaviorScore: 88,
        assignmentCompletion: 85
      }
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'On Track': return 'bg-blue-100 text-blue-800';
      case 'Needs Attention': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Excellent': return <CheckCircle size={14} className="text-green-600" />;
      case 'On Track': return <TrendingUp size={14} className="text-blue-600" />;
      case 'Needs Attention': return <AlertCircle size={14} className="text-yellow-600" />;
      case 'Critical': return <AlertCircle size={14} className="text-red-600" />;
      default: return <Activity size={14} className="text-gray-600" />;
    }
  };

  const getMetricColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold - 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredData = monitoringData.filter(item =>
    (filterStatus === 'all' || item.status === filterStatus) &&
    (item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Intervention Monitoring</h1>
          <p className="text-gray-600 mt-1">Track and monitor student intervention progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <UserCheck size={18} />
            <span>Add Check-in</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Monitoring</p>
          <p className="text-2xl font-bold text-blue-600">32</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">On Track</p>
          <p className="text-2xl font-bold text-green-600">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Needs Attention</p>
          <p className="text-2xl font-bold text-yellow-600">10</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Critical</p>
          <p className="text-2xl font-bold text-red-600">4</p>
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
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Excellent">Excellent</option>
            <option value="On Track">On Track</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="Critical">Critical</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Monitoring Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{item.student}</h3>
                  <p className="text-sm text-gray-600">Grade {item.grade} • {item.plan}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Progress Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Attendance</p>
                  <p className={`text-lg font-bold ${getMetricColor(item.metrics.attendance, 90)}`}>
                    {item.metrics.attendance}%
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Behavior Score</p>
                  <p className={`text-lg font-bold ${getMetricColor(item.metrics.behaviorScore, 80)}`}>
                    {item.metrics.behaviorScore}%
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Assignments</p>
                  <p className={`text-lg font-bold ${getMetricColor(item.metrics.assignmentCompletion, 85)}`}>
                    {item.metrics.assignmentCompletion}%
                  </p>
                </div>
              </div>

              {/* Improvements */}
              {item.improvements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Improvements:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.improvements.map((imp, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {imp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {item.concerns.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Concerns:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.concerns.map((concern, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Check-in Dates */}
              <div className="flex items-center justify-between pt-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-600">Last Check-in: {item.lastCheck}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-gray-600">Next: {item.nextCheck}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Record Check-in
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Eye size={16} className="text-gray-600" />
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

export default InterventionsMonitoring;