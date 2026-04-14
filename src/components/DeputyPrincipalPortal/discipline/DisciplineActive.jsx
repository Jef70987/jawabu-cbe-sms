import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MoreVertical,
  AlertTriangle, Clock, Calendar, MessageSquare,
  TrendingUp, CheckCircle, XCircle
} from 'lucide-react';

const DisciplineActive = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const activeCases = [
    {
      id: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Physical Altercation',
      date: '2024-04-01',
      severity: 'High',
      status: 'Under Investigation',
      assignedTo: 'Dr. Martinez',
      daysActive: 3,
      nextAction: 'Witness interviews',
      deadline: '2024-04-05'
    },
    {
      id: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      date: '2024-03-30',
      severity: 'Medium',
      status: 'Pending Review',
      assignedTo: 'Ms. Thompson',
      daysActive: 5,
      nextAction: 'Parent meeting',
      deadline: '2024-04-04'
    },
    {
      id: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      date: '2024-03-28',
      severity: 'High',
      status: 'Hearing Scheduled',
      assignedTo: 'Dr. Martinez',
      daysActive: 7,
      nextAction: 'Disciplinary hearing',
      deadline: '2024-04-06'
    }
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Under Investigation': return <AlertTriangle size={14} className="text-red-500" />;
      case 'Pending Review': return <Clock size={14} className="text-yellow-500" />;
      case 'Hearing Scheduled': return <Calendar size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  const filteredCases = activeCases.filter(c =>
    c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Active Cases</h1>
          <p className="text-gray-600 mt-1">Currently active disciplinary cases requiring attention</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <TrendingUp size={18} className="text-gray-600" />
            <span>Case Analytics</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <MessageSquare size={18} />
            <span>Bulk Action</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Cases</p>
          <p className="text-2xl font-bold text-orange-600">42</p>
          <p className="text-xs text-gray-500">Need immediate attention</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Under Investigation</p>
          <p className="text-2xl font-bold text-red-600">18</p>
          <p className="text-xs text-gray-500">Evidence gathering</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">12</p>
          <p className="text-xs text-gray-500">Awaiting approval</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Hearings Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
          <p className="text-xs text-gray-500">This week</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search active cases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Severity</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((case_) => (
          <div key={case_.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium text-gray-500">{case_.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(case_.severity)}`}>
                      {case_.severity}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{case_.student}</h3>
                  <p className="text-sm text-gray-600">Grade {case_.grade}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(case_.status)}
                    <span className="text-xs text-gray-600">{case_.status}</span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Offense</p>
                <p className="text-gray-800">{case_.offense}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Days Active</p>
                  <p className="text-sm font-semibold text-orange-600">{case_.daysActive} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium text-gray-800">{case_.assignedTo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Action</p>
                  <p className="text-sm text-gray-800">{case_.nextAction}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="text-sm font-medium text-red-600">{case_.deadline}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Update Case
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageSquare size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisciplineActive;