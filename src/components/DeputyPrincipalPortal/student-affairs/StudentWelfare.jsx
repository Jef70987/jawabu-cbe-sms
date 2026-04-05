import React, { useState } from 'react';
import {
  Heart, Users, Calendar, Clock, Phone,
  Mail, Eye, Edit2, MoreVertical, Plus,
  CheckCircle, AlertCircle, FileText
} from 'lucide-react';

const StudentWelfare = () => {
  const [activeTab, setActiveTab] = useState('active');

  const welfareCases = [
    {
      id: 'WC001',
      student: 'Emily Davis',
      grade: '9D',
      type: 'Counseling',
      status: 'Active',
      startDate: '2024-03-01',
      assignedTo: 'Dr. Wilson',
      nextSession: '2024-04-05',
      progress: 65
    },
    {
      id: 'WC002',
      student: 'David Lee',
      grade: '11B',
      type: 'Academic Support',
      status: 'Active',
      startDate: '2024-03-10',
      assignedTo: 'Ms. Thompson',
      nextSession: '2024-04-03',
      progress: 40
    },
    {
      id: 'WC003',
      student: 'Sarah Chen',
      grade: '10B',
      type: 'Health & Wellness',
      status: 'Resolved',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      assignedTo: 'Dr. Wilson',
      progress: 100
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Heart size={24} className="text-red-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">18</p>
          <p className="text-sm text-gray-600">Active Cases</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <CheckCircle size={24} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">42</p>
          <p className="text-sm text-gray-600">Resolved Cases</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Users size={24} className="text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">6</p>
          <p className="text-sm text-gray-600">Counselors Available</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Calendar size={24} className="text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">24</p>
          <p className="text-sm text-gray-600">Sessions This Month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}
          >
            Active Cases
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'resolved' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}
          >
            Resolved Cases
          </button>
        </nav>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {welfareCases.filter(c => activeTab === 'active' ? c.status === 'Active' : c.status === 'Resolved').map((case_) => (
          <div key={case_.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart size={20} className="text-red-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-800">{case_.student}</h3>
                    <span className="text-xs text-gray-500">Grade {case_.grade}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${case_.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {case_.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Type: {case_.type}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">Started: {case_.startDate}</span>
                    <span className="text-xs text-gray-500">Assigned to: {case_.assignedTo}</span>
                    {case_.nextSession && (
                      <span className="text-xs text-blue-600">Next: {case_.nextSession}</span>
                    )}
                  </div>
                  {case_.status === 'Active' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{case_.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${case_.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Mail size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex items-center space-x-2">
          <Plus size={18} className="text-purple-600" />
          <span className="text-sm font-medium">New Welfare Case</span>
        </button>
        <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center space-x-2">
          <Calendar size={18} className="text-blue-600" />
          <span className="text-sm font-medium">Schedule Session</span>
        </button>
        <button className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition flex items-center space-x-2">
          <FileText size={18} className="text-green-600" />
          <span className="text-sm font-medium">Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default StudentWelfare;