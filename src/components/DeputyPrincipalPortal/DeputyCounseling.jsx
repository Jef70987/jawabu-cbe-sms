import React, { useState } from 'react';
import {
  Calendar, Clock, Users, UserPlus, MessageSquare,
  CheckCircle, AlertCircle, Search, Filter, Download,
  MoreVertical, Edit2, Trash2, Eye, Phone, Mail
} from 'lucide-react';

const DeputyCounseling = () => {
  const [sessions, setSessions] = useState([
    {
      id: 'CS001',
      student: 'Emma Thompson',
      grade: '10B',
      counselor: 'Dr. Sarah Wilson',
      type: 'Academic Guidance',
      date: '2024-03-15',
      time: '10:00 AM',
      status: 'Scheduled',
      notes: 'Discussing career options'
    },
    {
      id: 'CS002',
      student: 'Alex Johnson',
      grade: '11A',
      counselor: 'Mr. Robert Brown',
      type: 'Personal Counseling',
      date: '2024-03-15',
      time: '11:30 AM',
      status: 'In Progress',
      notes: 'Anxiety management'
    },
    {
      id: 'CS003',
      student: 'Sophia Lee',
      grade: '9C',
      counselor: 'Dr. Sarah Wilson',
      type: 'Behavioral',
      date: '2024-03-14',
      time: '2:00 PM',
      status: 'Completed',
      notes: 'Follow-up session'
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Services</h1>
          <p className="text-gray-600 mt-1">Manage counseling sessions and student support</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <UserPlus size={18} />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-800">142</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">18</p>
          <p className="text-xs text-gray-500">Upcoming sessions</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">124</p>
          <p className="text-xs text-gray-500">87% success rate</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Students</p>
          <p className="text-2xl font-bold text-purple-600">45</p>
          <p className="text-xs text-gray-500">In counseling</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          {sessions.filter(s => s.date === '2024-03-15').map(session => (
            <div key={session.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="w-24 text-center">
                <p className="text-sm font-medium text-gray-600">{session.time}</p>
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{session.student} • Grade {session.grade}</p>
                    <p className="text-sm text-gray-600">{session.type} with {session.counselor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    session.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
              <button className="ml-4 p-2 hover:bg-white rounded-lg">
                <Eye size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Counseling Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Common Issues</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Academic Stress</span>
              <span className="text-sm font-medium text-blue-600">32 cases</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Anxiety/Depression</span>
              <span className="text-sm font-medium text-blue-600">28 cases</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Peer Relationships</span>
              <span className="text-sm font-medium text-blue-600">21 cases</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Family Issues</span>
              <span className="text-sm font-medium text-blue-600">15 cases</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex flex-col items-center">
              <MessageSquare size={20} className="mb-1" />
              <span className="text-sm">Schedule Session</span>
            </button>
            <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex flex-col items-center">
              <FileText size={20} className="mb-1" />
              <span className="text-sm">Generate Report</span>
            </button>
            <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex flex-col items-center">
              <Users size={20} className="mb-1" />
              <span className="text-sm">Group Session</span>
            </button>
            <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 flex flex-col items-center">
              <Phone size={20} className="mb-1" />
              <span className="text-sm">Parent Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeputyCounseling;