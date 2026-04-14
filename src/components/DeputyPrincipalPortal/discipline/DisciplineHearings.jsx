import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Eye, Edit2,
  CheckCircle, XCircle, Search, Filter,
  Plus, Video, MapPin, Mail, Phone
} from 'lucide-react';

const DisciplineHearings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const hearings = [
    {
      id: 'HRG001',
      caseId: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      date: '2024-04-05',
      time: '10:00 AM',
      duration: '1 hour',
      location: 'Room 204',
      mode: 'In-Person',
      panel: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis'],
      status: 'Scheduled'
    },
    {
      id: 'HRG002',
      caseId: 'DC005',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Bullying',
      date: '2024-04-06',
      time: '2:00 PM',
      duration: '1.5 hours',
      location: 'Conference Room A',
      mode: 'In-Person',
      panel: ['Dr. Martinez', 'Ms. Thompson'],
      status: 'Scheduled'
    },
    {
      id: 'HRG003',
      caseId: 'DC007',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      date: '2024-04-07',
      time: '11:00 AM',
      duration: '1 hour',
      location: 'Virtual',
      mode: 'Virtual',
      panel: ['Dr. Martinez', 'Ms. Thompson'],
      status: 'Pending Confirmation'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Pending Confirmation': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Disciplinary Hearings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage disciplinary hearings</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>Calendar View</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Schedule Hearing</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming Hearings</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-purple-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Confirmation</p>
          <p className="text-2xl font-bold text-yellow-600">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed (This Month)</p>
          <p className="text-2xl font-bold text-green-600">12</p>
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
              Upcoming Hearings
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Hearings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {hearings.map((hearing) => (
                <div key={hearing.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{hearing.student}</h3>
                        <span className="text-xs text-gray-500">Grade {hearing.grade}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(hearing.status)}`}>
                          {hearing.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Case: {hearing.caseId} - {hearing.offense}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{hearing.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{hearing.time} ({hearing.duration})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hearing.mode === 'Virtual' ? 
                            <Video size={14} className="text-gray-400" /> : 
                            <MapPin size={14} className="text-gray-400" />
                          }
                          <span className="text-sm text-gray-600">{hearing.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{hearing.panel.length} panel members</span>
                        </div>
                      </div>
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
          )}

          {activeTab === 'past' && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
              <p>No past hearings to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <Calendar size={24} className="mb-2" />
          <p className="font-semibold">Schedule Hearing</p>
          <p className="text-xs text-purple-100 mt-1">Set up new hearing</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <Video size={24} className="mb-2" />
          <p className="font-semibold">Virtual Hearing Room</p>
          <p className="text-xs text-blue-100 mt-1">Join online hearing</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <FileText size={24} className="mb-2" />
          <p className="font-semibold">Hearing Reports</p>
          <p className="text-xs text-green-100 mt-1">Generate summaries</p>
        </button>
      </div>
    </div>
  );
};

export default DisciplineHearings;