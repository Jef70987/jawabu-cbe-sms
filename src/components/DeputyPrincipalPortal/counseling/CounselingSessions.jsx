import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Search, Filter,
  Eye, Edit2, MoreVertical, Download,
  Plus, MessageSquare, FileText, CheckCircle,
  AlertCircle, Heart, UserCheck
} from 'lucide-react';

const CounselingSessions = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const upcomingSessions = [
    {
      id: 'CS001',
      student: 'Emma Thompson',
      grade: '10B',
      counselor: 'Dr. Sarah Wilson',
      type: 'Academic Guidance',
      date: '2024-04-05',
      time: '10:00 AM',
      duration: '45 mins',
      location: 'Room 101',
      status: 'Confirmed',
      notes: 'Discussing career options and subject selection'
    },
    {
      id: 'CS002',
      student: 'James Wilson',
      grade: '11A',
      counselor: 'Mr. Robert Brown',
      type: 'Behavioral Counseling',
      date: '2024-04-05',
      time: '2:00 PM',
      duration: '1 hour',
      location: 'Room 102',
      status: 'Confirmed',
      notes: 'Follow-up on anger management'
    },
    {
      id: 'CS003',
      student: 'Sophia Lee',
      grade: '9C',
      counselor: 'Dr. Sarah Wilson',
      type: 'Personal Counseling',
      date: '2024-04-06',
      time: '11:30 AM',
      duration: '45 mins',
      location: 'Room 101',
      status: 'Pending',
      notes: 'Initial assessment session'
    }
  ];

  const completedSessions = [
    {
      id: 'CS004',
      student: 'Michael Brown',
      grade: '12C',
      counselor: 'Dr. Sarah Wilson',
      type: 'Academic Counseling',
      date: '2024-04-03',
      time: '9:00 AM',
      outcome: 'Positive',
      followUp: 'Schedule follow-up in 2 weeks',
      notes: 'Student showed improvement in attitude'
    },
    {
      id: 'CS005',
      student: 'Emily Davis',
      grade: '9D',
      counselor: 'Mr. Robert Brown',
      type: 'Behavioral Counseling',
      date: '2024-04-02',
      time: '1:00 PM',
      outcome: 'Needs Follow-up',
      followUp: 'Weekly sessions recommended',
      notes: 'Progress noted but requires continued support'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Positive': return 'bg-green-100 text-green-800';
      case 'Needs Follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Academic Guidance': return <BookOpen size={14} className="text-blue-500" />;
      case 'Behavioral Counseling': return <Heart size={14} className="text-red-500" />;
      case 'Personal Counseling': return <Users size={14} className="text-purple-500" />;
      default: return <MessageSquare size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Sessions</h1>
          <p className="text-gray-600 mt-1">Manage individual and group counseling sessions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Sessions</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Sessions (This Month)</p>
          <p className="text-2xl font-bold text-blue-600">86</p>
          <p className="text-xs text-green-600 mt-1">↑ 12 from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming Sessions</p>
          <p className="text-2xl font-bold text-yellow-600">24</p>
          <p className="text-xs text-gray-500">This week: 12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed Sessions</p>
          <p className="text-2xl font-bold text-green-600">62</p>
          <p className="text-xs text-green-600">87% success rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Students</p>
          <p className="text-2xl font-bold text-purple-600">45</p>
          <p className="text-xs text-gray-500">Currently in counseling</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Sessions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed Sessions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by student or counselor..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Academic Guidance</option>
              <option>Behavioral Counseling</option>
              <option>Personal Counseling</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(session.type)}
                        <h3 className="font-semibold text-gray-800">{session.student}</h3>
                        <span className="text-xs text-gray-500">Grade {session.grade}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Counselor: {session.counselor}</p>
                      <p className="text-sm text-gray-600">{session.type}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{session.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{session.time} ({session.duration})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{session.location}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-2 bg-white rounded-lg">
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        Start Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedSessions.map((session) => (
                <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(session.type)}
                        <h3 className="font-semibold text-gray-800">{session.student}</h3>
                        <span className="text-xs text-gray-500">Grade {session.grade}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getOutcomeColor(session.outcome)}`}>
                          {session.outcome}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Counselor: {session.counselor}</p>
                      <p className="text-sm text-gray-600">{session.type}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{session.date} at {session.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-sm text-gray-600">Follow-up: {session.followUp}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-2 bg-white rounded-lg">
                        <p className="text-sm text-gray-700">Notes: {session.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        View Report
                      </button>
                    </div>
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

export default CounselingSessions;