import React, { useState } from 'react';
import {
  Shield, FileText, Eye, CheckCircle, XCircle,
  Clock, Calendar, Search, Filter, Download,
  MessageSquare, Users, AlertTriangle
} from 'lucide-react';

const DisciplineAppeals = () => {
  const [activeTab, setActiveTab] = useState('pending');

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
      caseId: 'DC008',
      student: 'Robert Johnson',
      grade: '10C',
      offense: 'Disruptive Behavior',
      appealDate: '2024-03-27',
      reason: 'New evidence submitted',
      status: 'Hearing Scheduled',
      submittedBy: 'Student',
      decision: 'Pending',
      hearingDate: '2024-04-08'
    },
    {
      id: 'AP003',
      caseId: 'DC012',
      student: 'Lisa Wong',
      grade: '12A',
      offense: 'Uniform Violation',
      appealDate: '2024-03-25',
      reason: 'Procedural error',
      status: 'Resolved',
      submittedBy: 'Parent',
      decision: 'Appeal Denied',
      hearingDate: '2024-04-02'
    }
  ];

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
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
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Shield size={18} />
            <span>Appeal Guidelines</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Appeals</p>
          <p className="text-2xl font-bold text-gray-800">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Denied</p>
          <p className="text-2xl font-bold text-red-600">4</p>
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
              Pending Appeals
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviewed'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviewed Appeals
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resolved'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resolved
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {appeals.filter(a => a.status !== 'Resolved').map((appeal) => (
                <div key={appeal.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-purple-600" />
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
                      <button className="p-2 hover:bg-white rounded-lg">
                        <MessageSquare size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
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
              {appeals.filter(a => a.status === 'Resolved' && a.decision !== 'Pending').map((appeal) => (
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

          {activeTab === 'resolved' && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-3" />
              <p className="text-gray-600">All resolved appeals are displayed in the Reviewed tab</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisciplineAppeals;