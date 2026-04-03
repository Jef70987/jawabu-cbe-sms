import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MoreVertical,
  Calendar, Clock, UserX, Download,
  AlertTriangle, Mail, Phone, FileText
} from 'lucide-react';

const SuspensionsOutSchool = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const outSchoolSuspensions = [
    {
      id: 'SUS001',
      student: 'James Wilson',
      grade: '11A',
      reason: 'Physical altercation',
      startDate: '2024-04-01',
      endDate: '2024-04-08',
      days: 7,
      parentContacted: true,
      returnMeeting: '2024-04-09',
      requirements: ['Parent conference', 'Behavior contract', 'Counseling referral'],
      status: 'Active'
    },
    {
      id: 'SUS003',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Academic dishonesty',
      startDate: '2024-04-03',
      endDate: '2024-04-10',
      days: 7,
      parentContacted: true,
      returnMeeting: '2024-04-11',
      requirements: ['Academic review', 'Makeup assignments', 'Parent conference'],
      status: 'Active'
    }
  ];

  const filteredSuspensions = outSchoolSuspensions.filter(s =>
    s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Out-of-School Suspensions</h1>
          <p className="text-gray-600 mt-1">Manage external suspension cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <FileText size={18} />
            <span>Notification Template</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Out-of-School</p>
          <p className="text-2xl font-bold text-red-600">7</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Duration</p>
          <p className="text-2xl font-bold text-gray-800">6.5</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Parent Contact</p>
          <p className="text-2xl font-bold text-green-600">100%</p>
          <p className="text-xs text-gray-500">Notified</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Return Meetings</p>
          <p className="text-2xl font-bold text-blue-600">4</p>
          <p className="text-xs text-gray-500">Scheduled</p>
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
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Suspensions Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuspensions.map((suspension) => (
          <div key={suspension.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-red-50 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={20} className="text-red-600" />
                    <span className="font-mono text-sm font-medium text-gray-500">{suspension.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{suspension.student}</h3>
                  <p className="text-sm text-gray-600">Grade {suspension.grade}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Out-of-School
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
                  <p className="text-xs text-gray-500">Return Meeting</p>
                  <p className="text-sm font-medium text-blue-600">{suspension.returnMeeting}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Requirements for Return</p>
                <ul className="space-y-1">
                  {suspension.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  Schedule Return Meeting
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Mail size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Phone size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspensionsOutSchool;