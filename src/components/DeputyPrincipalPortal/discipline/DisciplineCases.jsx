import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MoreVertical,
  AlertTriangle, CheckCircle, Clock, Calendar,
  Download, Plus, MessageSquare, FileText
} from 'lucide-react';

const DisciplineCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const cases = [
    {
      id: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Physical Altercation',
      date: '2024-04-01',
      severity: 'High',
      status: 'Under Investigation',
      reportedBy: 'Ms. Thompson',
      actions: ['Parents notified', 'Witness statements taken']
    },
    {
      id: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      date: '2024-03-30',
      severity: 'Medium',
      status: 'Pending Review',
      reportedBy: 'Mr. Davis',
      actions: ['Attendance record flagged']
    },
    {
      id: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      date: '2024-03-28',
      severity: 'High',
      status: 'Hearing Scheduled',
      reportedBy: 'Prof. Johnson',
      actions: ['Academic committee notified']
    },
    {
      id: 'DC004',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Uniform Violation',
      date: '2024-03-27',
      severity: 'Low',
      status: 'Resolved',
      reportedBy: 'Ms. Thompson',
      actions: ['Warning issued']
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
      case 'Resolved': return <CheckCircle size={14} className="text-green-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  const filteredCases = cases.filter(c => 
    (filterSeverity === 'all' || c.severity === filterSeverity) &&
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.offense.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Discipline Cases</h1>
          <p className="text-gray-600 mt-1">View and manage all disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Cases</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">156</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Cases</p>
          <p className="text-2xl font-bold text-orange-600">42</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">98</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">16</p>
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
                placeholder="Search by student name, case ID, or offense..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Hearing Scheduled">Hearing Scheduled</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Cases Table. */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{case_.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{case_.student}</p>
                      <p className="text-xs text-gray-500">Grade {case_.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{case_.offense}</td>
                  <td className="px-6 py-4 text-gray-600">{case_.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(case_.severity)}`}>
                      {case_.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(case_.status)}
                      <span className="text-sm text-gray-700">{case_.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <MessageSquare size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisciplineCases;