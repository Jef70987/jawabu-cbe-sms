import React, { useState } from 'react';
import {
  Shield, FileText, Eye, CheckCircle, XCircle,
  Clock, Calendar, Search, Filter, Download,
  MessageSquare, Users, AlertTriangle, Gavel
} from 'lucide-react';

const SuspensionsAppeals = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const suspensionAppeals = [
    {
      id: 'AP001',
      caseId: 'SUS003',
      student: 'Michael Brown',
      grade: '12C',
      suspensionType: 'Out-of-School',
      appealDate: '2024-03-28',
      reason: 'Disputing evidence presented',
      status: 'Under Review',
      submittedBy: 'Parent',
      decision: 'Pending',
      hearingDate: '2024-04-05',
      supportingDocs: 3
    },
    {
      id: 'AP002',
      caseId: 'SUS008',
      student: 'Robert Johnson',
      grade: '10C',
      suspensionType: 'In-School',
      appealDate: '2024-03-27',
      reason: 'New evidence submitted',
      status: 'Hearing Scheduled',
      submittedBy: 'Student',
      decision: 'Pending',
      hearingDate: '2024-04-08',
      supportingDocs: 2
    },
    {
      id: 'AP003',
      caseId: 'SUS012',
      student: 'Lisa Wong',
      grade: '12A',
      suspensionType: 'Out-of-School',
      appealDate: '2024-03-25',
      reason: 'Procedural error',
      status: 'Resolved',
      submittedBy: 'Parent',
      decision: 'Appeal Denied',
      hearingDate: '2024-04-02',
      supportingDocs: 1
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
      {/* Header .*/}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suspension Appeals</h1>
          <p className="text-gray-600 mt-1">Review and manage suspension appeals</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Appeals</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Gavel size={18} />
            <span>Appeal Guidelines</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Appeals</p>
          <p className="text-2xl font-bold text-gray-800">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Denied</p>
          <p className="text-2xl font-bold text-red-600">5</p>
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {suspensionAppeals.filter(a => a.status !== 'Resolved').map((appeal) => (
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
                      <p className="text-sm text-gray-600 mt-1">Case: {appeal.caseId} - {appeal.suspensionType} Suspension</p>
                      <p className="text-sm text-gray-700 mt-2">Reason: {appeal.reason}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Appealed: {appeal.appealDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Submitted by: {appeal.submittedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{appeal.supportingDocs} documents</span>
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
              {suspensionAppeals.filter(a => a.status === 'Resolved').map((appeal) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <Calendar size={24} className="mb-2" />
          <p className="font-semibold">Schedule Appeal Hearing</p>
          <p className="text-xs text-purple-100 mt-1">Set up appeal review</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <FileText size={24} className="mb-2" />
          <p className="font-semibold">Appeal Templates</p>
          <p className="text-xs text-blue-100 mt-1">Standard response templates</p>
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

export default SuspensionsAppeals;