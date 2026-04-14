import React, { useState } from 'react';
import {
  Scale, Handshake, Users, Calendar,
  Eye, Edit2, Plus, Search, Filter,
  Download, CheckCircle, MessageSquare,
  Heart, Shield, Target
} from 'lucide-react';

const InterventionsRestorativeJustice = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const restorativeCases = [
    {
      id: 'RJ001',
      title: 'Classroom Conflict Resolution',
      participants: ['James Wilson', 'Michael Brown'],
      facilitator: 'Dr. Sarah Wilson',
      date: '2024-04-03',
      time: '1:00 PM',
      location: 'Restorative Justice Room',
      status: 'Scheduled',
      type: 'Peer Conflict',
      circleType: 'Healing Circle'
    },
    {
      id: 'RJ002',
      title: 'Bullying Incident - Community Building',
      participants: ['Sarah Chen', 'Emily Davis', 'Witnesses'],
      facilitator: 'Dr. Sarah Wilson',
      date: '2024-04-01',
      time: '10:00 AM',
      location: 'Restorative Justice Room',
      status: 'Completed',
      type: 'Bullying',
      circleType: 'Community Building Circle',
      outcome: 'Agreement reached, action plan implemented'
    },
    {
      id: 'RJ003',
      title: 'Theft of Property - Restitution Circle',
      participants: ['David Lee', 'Robert Johnson'],
      facilitator: 'Mr. Robert Brown',
      date: '2024-03-28',
      time: '2:00 PM',
      location: 'Restorative Justice Room',
      status: 'Completed',
      type: 'Theft',
      circleType: 'Restitution Circle',
      outcome: 'Apology issued, community service assigned'
    }
  ];

  const circleTypes = [
    { name: 'Healing Circle', count: 12, successRate: 88 },
    { name: 'Community Building Circle', count: 18, successRate: 92 },
    { name: 'Restitution Circle', count: 8, successRate: 85 },
    { name: 'Conflict Resolution Circle', count: 15, successRate: 90 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = restorativeCases.filter(c =>
    (activeTab === 'all' || c.status === activeTab) &&
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Restorative Justice</h1>
          <p className="text-gray-600 mt-1">Facilitate restorative circles and conflict resolution</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Circle</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Circles</p>
          <p className="text-2xl font-bold text-gray-800">53</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Cases</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">89%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Participants</p>
          <p className="text-2xl font-bold text-purple-600">142</p>
        </div>
      </div>

      {/* Circle Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {circleTypes.map((circle, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <Scale size={24} className="mx-auto text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-800">{circle.name}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{circle.count}</p>
            <p className="text-sm text-green-600">{circle.successRate}% Success Rate</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Circles
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed Circles
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
                  placeholder="Search circles..."
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

          <div className="space-y-4">
            {filteredCases.map((case_) => (
              <div key={case_.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Scale size={20} className="text-purple-600" />
                      <h3 className="font-semibold text-gray-800">{case_.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Circle Type: {case_.circleType} • Type: {case_.type}</p>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Participants:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {case_.participants.map((p, idx) => (
                          <span key={idx} className="text-sm bg-white px-2 py-1 rounded-lg">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Facilitator: {case_.facilitator}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{case_.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{case_.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{case_.location}</span>
                      </div>
                    </div>

                    {case_.outcome && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">Outcome: {case_.outcome}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restorative Justice Principles */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Restorative Justice Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start space-x-2">
            <Heart size={16} className="text-purple-600 mt-0.5" />
            <span className="text-sm text-gray-600">Accountability for harm caused</span>
          </div>
          <div className="flex items-start space-x-2">
            <Shield size={16} className="text-purple-600 mt-0.5" />
            <span className="text-sm text-gray-600">Community involvement in resolution</span>
          </div>
          <div className="flex items-start space-x-2">
            <Target size={16} className="text-purple-600 mt-0.5" />
            <span className="text-sm text-gray-600">Focus on repairing relationships</span>
          </div>
          <div className="flex items-start space-x-2">
            <Handshake size={16} className="text-purple-600 mt-0.5" />
            <span className="text-sm text-gray-600">Collaborative problem solving</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionsRestorativeJustice;