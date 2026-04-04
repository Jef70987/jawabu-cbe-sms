import React, { useState } from 'react';
import {
  Shield, FileText, Eye, CheckCircle, XCircle,
  Clock, Calendar, Search, Filter, Download,
  MessageSquare, Users, AlertTriangle, Gavel, TrendingUp
} from 'lucide-react';

const DisciplineAppeals = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const appeals = [
    {
      id: 'AP001',
      caseId: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      appealDate: '2024-03-28',
      reason: 'Disputing evidence presented',
      status: 'Under Review',
      submittedBy: 'Parent',
      decision: 'Pending',
      hearingDate: '2024-04-05'
    },
    {
      id: 'AP002',
      caseId: 'DC005',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      appealDate: '2024-03-27',
      reason: 'New evidence submitted',
      status: 'Hearing Scheduled',
      submittedBy: 'Student',
      decision: 'Pending',
      hearingDate: '2024-04-08'
    },
    {
      id: 'AP003',
      caseId: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      appealDate: '2024-03-25',
      reason: 'Procedural error',
      status: 'Resolved',
      submittedBy: 'Parent',
      decision: 'Appeal Denied',
      hearingDate: '2024-04-02'
    },
    {
      id: 'AP004',
      caseId: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Physical Altercation',
      appealDate: '2024-03-20',
      reason: 'New witness testimony',
      status: 'Resolved',
      submittedBy: 'Student',
      decision: 'Appeal Approved',
      hearingDate: '2024-03-28'
    }
  ];

  const appealStats = {
    total: 18,
    pending: 8,
    approved: 5,
    denied: 5,
    successRate: 50
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Hearing Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision) => {
    switch(decision) {
      case 'Appeal Approved': return 'bg-green-100 text-green-800';
      case 'Appeal Denied': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppeals = appeals.filter(appeal =>
    (activeTab === 'all' || appeal.status === activeTab || appeal.status === 'Resolved') &&
    (appeal.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     appeal.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appeals Management</h1>
          <p className="text-gray-600 mt-1">Review and manage disciplinary appeals</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Appeals</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Shield size={18} />
            <span>Appeal Guidelines</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Appeals</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{appealStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{appealStats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Appeals Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{appealStats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Success Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{appealStats.successRate}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Appeals
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviewed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviewed Appeals
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
                  placeholder="Search appeals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {activeTab === 'pending' && (
            <div className="space-y-4">
              {filteredAppeals.filter(a => a.status !== 'Resolved').map((appeal) => (
                <div key={appeal.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-blue-600" />
                        <h3 className="font-semibold text-gray-800">{appeal.student}</h3>
                        <span className="text-xs text-gray-500">Grade {appeal.grade}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appeal.status)}`}>
                          {appeal.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Case: {appeal.caseId} - {appeal.offense}</p>
                      <p className="text-sm text-gray-700 mt-2">Reason: {appeal.reason}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Appealed: {appeal.appealDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Submitted by: {appeal.submittedBy}</span>
                        </div>
                        {appeal.hearingDate && (
                          <div className="flex items-center space-x-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Hearing: {appeal.hearingDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviewed' && (
            <div className="space-y-4">
              {filteredAppeals.filter(a => a.status === 'Resolved').map((appeal) => (
                <div key={appeal.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{appeal.student}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDecisionColor(appeal.decision)}`}>
                          {appeal.decision}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Case: {appeal.caseId}</p>
                      <p className="text-sm text-gray-700 mt-2">Reason: {appeal.reason}</p>
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">Decision Date: </span>
                        <span className="text-sm text-gray-600">{appeal.hearingDate}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick .Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <Calendar size={24} className="mb-2" />
          <p className="font-semibold">Schedule Appeal Hearing</p>
          <p className="text-xs text-blue-100 mt-1">Set up appeal review</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <FileText size={24} className="mb-2" />
          <p className="font-semibold">Appeal Templates</p>
          <p className="text-xs text-purple-100 mt-1">Standard response templates</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <MessageSquare size={24} className="mb-2" />
          <p className="font-semibold">Notify Parties</p>
          <p className="text-xs text-green-100 mt-1">Send appeal notifications</p>
        </button>
      </div>
    </div>
  );
};

export default DisciplineAppeals;