import React, { useState } from 'react';
import {
  Users, Handshake, Calendar, Clock,
  Eye, Edit2, Plus, Search, Filter,
  Download, CheckCircle, MessageSquare,
  Star, Award, UserCheck
} from 'lucide-react';

const InterventionsPeerMediation = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const peerMediationCases = [
    {
      id: 'PM001',
      title: 'Classroom Dispute Resolution',
      participants: ['James Wilson', 'Michael Brown'],
      grade: '11A',
      mediator: 'Emma Thompson (Peer Mediator)',
      date: '2024-04-02',
      time: '2:00 PM',
      location: 'Mediation Room 1',
      status: 'Scheduled',
      type: 'Peer Conflict',
      resolution: null
    },
    {
      id: 'PM002',
      title: 'Bullying Incident Mediation',
      participants: ['Sarah Chen', 'Emily Davis'],
      grade: '10B',
      mediator: 'David Lee (Peer Mediator)',
      date: '2024-04-01',
      time: '11:00 AM',
      location: 'Mediation Room 2',
      status: 'Completed',
      type: 'Bullying',
      resolution: 'Agreement reached, apology issued'
    },
    {
      id: 'PM003',
      title: 'Group Project Conflict',
      participants: ['Lisa Wong', 'Robert Johnson', 'Olivia Martinez'],
      grade: '12C',
      mediator: 'Sophia Lee (Peer Mediator)',
      date: '2024-03-30',
      time: '10:00 AM',
      location: 'Mediation Room 1',
      status: 'Completed',
      type: 'Group Conflict',
      resolution: 'Roles reassigned, communication plan established'
    }
  ];

  const peerMediators = [
    { name: 'Emma Thompson', grade: '11B', cases: 12, successRate: 92, rating: 4.8 },
    { name: 'David Lee', grade: '11A', cases: 8, successRate: 88, rating: 4.6 },
    { name: 'Sophia Lee', grade: '10C', cases: 6, successRate: 95, rating: 4.9 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = peerMediationCases.filter(c =>
    (activeTab === 'all' || c.status === activeTab) &&
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Peer Mediation</h1>
          <p className="text-gray-600 mt-1">Manage peer mediation cases and mediators</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Mediation Case</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">48</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Cases</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">86%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Mediators</p>
          <p className="text-2xl font-bold text-purple-600">8</p>
        </div>
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
              Completed Cases
            </button>
            <button
              onClick={() => setActiveTab('mediators')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mediators'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Peer Mediators
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
                  placeholder="Search cases or participants..."
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

          {activeTab !== 'mediators' ? (
            <div className="space-y-4">
              {filteredCases.map((case_) => (
                <div key={case_.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Handshake size={20} className="text-purple-600" />
                        <h3 className="font-semibold text-gray-800">{case_.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Type: {case_.type}</p>
                      
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
                          <span className="text-sm text-gray-600">Mediator: {case_.mediator}</span>
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

                      {case_.resolution && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">Resolution: {case_.resolution}</p>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {peerMediators.map((mediator, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserCheck size={32} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{mediator.name}</h3>
                  <p className="text-sm text-gray-600">Grade {mediator.grade}</p>
                  <div className="mt-3 flex justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{mediator.cases}</p>
                      <p className="text-xs text-gray-500">Cases</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{mediator.successRate}%</p>
                      <p className="text-xs text-gray-500">Success</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold ml-1">{mediator.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionsPeerMediation;