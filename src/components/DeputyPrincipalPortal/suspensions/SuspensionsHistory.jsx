import React, { useState } from 'react';
import {
  Search, Filter, Eye, Download,
  Calendar, Clock, CheckCircle, XCircle,
  TrendingUp, FileText, UserX
} from 'lucide-react';

const SuspensionsHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('2024');

  const suspensionHistory = [
    {
      id: 'SUS004',
      student: 'Emily Davis',
      grade: '9D',
      reason: 'Uniform violation',
      type: 'In-School',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      days: 2,
      outcome: 'Successful',
      followUp: 'No further incidents',
      completedAt: '2024-02-17'
    },
    {
      id: 'SUS006',
      student: 'David Lee',
      grade: '11B',
      reason: 'Vandalism',
      type: 'Out-of-School',
      startDate: '2024-02-20',
      endDate: '2024-02-27',
      days: 7,
      outcome: 'Successful',
      followUp: 'Community service completed',
      completedAt: '2024-02-28'
    },
    {
      id: 'SUS007',
      student: 'Lisa Wong',
      grade: '12A',
      reason: 'Disruptive behavior',
      type: 'In-School',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      days: 3,
      outcome: 'Partially Successful',
      followUp: 'Behavior improved, minor issues',
      completedAt: '2024-01-13'
    }
  ];

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Successful': return 'bg-green-100 text-green-800';
      case 'Partially Successful': return 'bg-yellow-100 text-yellow-800';
      case 'Unsuccessful': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'In-School' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  };

  const filteredHistory = suspensionHistory.filter(s =>
    s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suspension History</h1>
          <p className="text-gray-600 mt-1">Historical records of all suspensions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export History</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <TrendingUp size={18} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Suspensions</p>
          <p className="text-2xl font-bold text-gray-800">98</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Year</p>
          <p className="text-2xl font-bold text-blue-600">42</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">87%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Repeat Offenders</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
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
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Types</option>
            <option>In-School</option>
            <option>Out-of-School</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outcome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((suspension) => (
                <tr key={suspension.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{suspension.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{suspension.student}</p>
                      <p className="text-xs text-gray-500">Grade {suspension.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{suspension.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(suspension.type)}`}>
                      {suspension.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-800">{suspension.startDate} - {suspension.endDate}</p>
                      <p className="text-xs text-gray-500">{suspension.days} days</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getOutcomeColor(suspension.outcome)}`}>
                      {suspension.outcome}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800">Most Common Reasons</h4>
          <ul className="mt-2 space-y-1">
            <li className="text-sm text-gray-600">• Disruptive Behavior (32%)</li>
            <li className="text-sm text-gray-600">• Truancy (28%)</li>
            <li className="text-sm text-gray-600">• Academic Dishonesty (18%)</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800">Trend Analysis</h4>
          <p className="text-sm text-gray-600 mt-2">Suspensions decreased by 15% compared to last year</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800">Recidivism Rate</h4>
          <p className="text-2xl font-bold text-blue-600 mt-2">12.8%</p>
          <p className="text-xs text-gray-500">Students with multiple suspensions</p>
        </div>
      </div>
    </div>
  );
};

export default SuspensionsHistory;