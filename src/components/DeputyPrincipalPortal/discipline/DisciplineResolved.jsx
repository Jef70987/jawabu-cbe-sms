import React, { useState } from 'react';
import {
  CheckCircle, Eye, Download, Search,
  Filter, Calendar, Award, FileText,
  TrendingUp, MessageSquare, Star
} from 'lucide-react';

const DisciplineResolved = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const resolvedCases = [
    {
      id: 'DC004',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Uniform Violation',
      resolutionDate: '2024-03-27',
      outcome: 'Warning Issued',
      action: 'Verbal warning, parent notified',
      followUp: 'Monthly check-in',
      satisfaction: 'Positive'
    },
    {
      id: 'DC006',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      resolutionDate: '2024-03-25',
      outcome: 'Restitution & Community Service',
      action: '20 hours community service, restitution paid',
      followUp: 'Weekly progress review',
      satisfaction: 'Positive'
    },
    {
      id: 'DC009',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      resolutionDate: '2024-03-22',
      outcome: 'Attendance Contract',
      action: 'Attendance improvement plan implemented',
      followUp: 'Bi-weekly monitoring',
      satisfaction: 'Neutral'
    }
  ];

  const getOutcomeColor = (outcome) => {
    if (outcome.includes('Warning')) return 'bg-yellow-100 text-yellow-800';
    if (outcome.includes('Community')) return 'bg-green-100 text-green-800';
    if (outcome.includes('Suspension')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const filteredCases = resolvedCases.filter(c =>
    c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Resolved Cases</h1>
          <p className="text-gray-600 mt-1">Successfully resolved disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Resolution Report</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <TrendingUp size={18} />
            <span>Success Analytics</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Resolved</p>
          <p className="text-2xl font-bold text-green-600">98</p>
          <p className="text-xs text-gray-500">This academic year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Resolution Rate</p>
          <p className="text-2xl font-bold text-blue-600">63%</p>
          <p className="text-xs text-green-500">↑ 8% from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Resolution Time</p>
          <p className="text-2xl font-bold text-purple-600">5.2</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Positive Outcomes</p>
          <p className="text-2xl font-bold text-green-600">87%</p>
          <p className="text-xs text-green-500">Satisfactory resolution</p>
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
                placeholder="Search resolved cases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Grades</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
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
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-mono text-sm font-medium text-gray-500">{case_.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{case_.student}</h3>
                  <p className="text-sm text-gray-600">Grade {case_.grade}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeColor(case_.outcome)}`}>
                  {case_.outcome}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Offense</p>
                <p className="text-gray-800">{case_.offense}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Action Taken</p>
                <p className="text-gray-800">{case_.action}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Resolution Date</p>
                  <p className="text-sm font-medium text-gray-800">{case_.resolutionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Follow-up Required</p>
                  <p className="text-sm font-medium text-blue-600">{case_.followUp}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">Outcome: {case_.satisfaction}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageSquare size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Metrics */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Resolution Success Rate</h3>
            <p className="text-purple-100 mt-1">Overall effectiveness of disciplinary actions</p>
          </div>
          <Award size={48} className="text-white opacity-80" />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-sm text-purple-100">Positive Outcomes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-purple-100">Parent Satisfaction</p>
          </div>
          <div>
            <p className="text-2xl font-bold">78%</p>
            <p className="text-sm text-purple-100">No Repeat Offenses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplineResolved;