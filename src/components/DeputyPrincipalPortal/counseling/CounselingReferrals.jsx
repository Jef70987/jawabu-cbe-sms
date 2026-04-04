import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Search, Filter,
  Eye, Edit2, MoreVertical, Download,
  Plus, CheckCircle, AlertCircle, MessageSquare,
  UserPlus, FileText, Heart
} from 'lucide-react';

const CounselingReferrals = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const referrals = [
    {
      id: 'REF001',
      student: 'James Wilson',
      grade: '11A',
      reason: 'Anger management issues',
      referredBy: 'Ms. Thompson',
      date: '2024-04-01',
      counselor: 'Mr. Robert Brown',
      status: 'Pending',
      priority: 'High',
      notes: 'Multiple behavioral incidents reported'
    },
    {
      id: 'REF002',
      student: 'Sophia Lee',
      grade: '9C',
      reason: 'Academic stress and anxiety',
      referredBy: 'Dr. Chen',
      date: '2024-03-30',
      counselor: 'Dr. Sarah Wilson',
      status: 'In Progress',
      priority: 'Medium',
      notes: 'Student requested counseling'
    },
    {
      id: 'REF003',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Career guidance needed',
      referredBy: 'Prof. Johnson',
      date: '2024-03-28',
      counselor: 'Dr. Sarah Wilson',
      status: 'Completed',
      priority: 'Low',
      notes: 'College application assistance provided'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReferrals = referrals.filter(r =>
    r.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referredBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Referrals</h1>
          <p className="text-gray-600 mt-1">Manage student referrals to counseling services</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Referrals</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Referral</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Referrals</p>
          <p className="text-2xl font-bold text-blue-600">86</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">32</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">30</p>
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
              Pending Referrals
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Cases
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-purple-500 text-purple-600'
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
                  placeholder="Search by student or referring teacher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Counselors</option>
              <option>Dr. Sarah Wilson</option>
              <option>Mr. Robert Brown</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {activeTab === 'pending' && (
            <div className="space-y-4">
              {filteredReferrals.filter(r => r.status === 'Pending').map((referral) => (
                <div key={referral.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{referral.student}</h3>
                        <span className="text-xs text-gray-500">Grade {referral.grade}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(referral.priority)}`}>
                          {referral.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Referred by: {referral.referredBy}</p>
                      <p className="text-sm text-gray-700 mt-2">Reason: {referral.reason}</p>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{referral.date}</span>
                        </div>
                        <div className="flex items-space-x-2">
                          <Heart size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Assigned to: {referral.counselor}</span>
                        </div>
                      </div>

                      <div className="mt-2 p-2 bg-white rounded-lg">
                        <p className="text-sm text-gray-700">Notes: {referral.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        Assign Counselor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {filteredReferrals.filter(r => r.status === 'In Progress').map((referral) => (
                <div key={referral.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{referral.student}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Counselor: {referral.counselor}</p>
                      <p className="text-sm text-gray-700 mt-2">{referral.reason}</p>
                      
                      <div className="mt-3">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">Started: {referral.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <MessageSquare size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {filteredReferrals.filter(r => r.status === 'Completed').map((referral) => (
                <div key={referral.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{referral.student}</h3>
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Counselor: {referral.counselor}</p>
                      <p className="text-sm text-gray-700 mt-2">{referral.reason}</p>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">Completed: {referral.date}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <FileText size={16} className="text-gray-600" />
                    </button>
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

export default CounselingReferrals;