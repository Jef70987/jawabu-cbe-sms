import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Eye, Edit2,
  Plus, Search, Filter, Download,
  Heart, MessageSquare, Video, MapPin,
  CheckCircle, UserCheck, AlertCircle,
  FileText, Bell // ✅ FIXED: added missing icons
} from 'lucide-react';

const CalendarCounseling = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const counselingSessions = [
    {
      id: 'CS001',
      student: 'Emma Thompson',
      grade: '10B',
      counselor: 'Dr. Sarah Wilson',
      type: 'Academic Guidance',
      date: '2024-04-05',
      time: '10:00 AM',
      duration: '45 mins',
      location: 'Counseling Room 101',
      mode: 'In-Person',
      status: 'Scheduled',
      notes: 'Discuss career options and subject selection'
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
      location: 'Counseling Room 102',
      mode: 'In-Person',
      status: 'Scheduled',
      notes: 'Follow-up on anger management progress'
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
      location: 'Virtual',
      mode: 'Virtual',
      status: 'Scheduled',
      notes: 'Initial assessment session'
    },
    {
      id: 'CS004',
      student: 'Group Session',
      participants: ['Michael Brown', 'Emily Davis', 'David Lee'],
      counselor: 'Mr. Robert Brown',
      type: 'Group Therapy',
      date: '2024-04-07',
      time: '3:00 PM',
      duration: '1.5 hours',
      location: 'Group Room A',
      mode: 'In-Person',
      status: 'Scheduled',
      notes: 'Anger management group session'
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Academic Guidance': return 'bg-blue-100 text-blue-800';
      case 'Behavioral Counseling': return 'bg-orange-100 text-orange-800';
      case 'Personal Counseling': return 'bg-green-100 text-green-800';
      case 'Group Therapy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = counselingSessions.filter(session =>
    (activeTab === 'all' || session.status === activeTab) &&
    (session.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     session.counselor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and manage counseling sessions</p>
        </div>

        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'list' ? 'bg-purple-600 text-white' : ''}`}>
              List View
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'calendar' ? 'bg-purple-600 text-white' : ''}`}>
              Calendar View
            </button>
          </div>

          <button className="px-4 py-2 bg-white border rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export Schedule</span>
          </button>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2">
            <Plus size={18} />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{session.student}</h3>
            <p>{session.type} | {session.counselor}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-3 bg-purple-600 text-white rounded-xl">
          <Video size={20} />
          Virtual Session
        </button>

        <button className="p-3 bg-green-600 text-white rounded-xl">
          <FileText size={20} />
          Session Notes
        </button>

        <button className="p-3 bg-blue-600 text-white rounded-xl">
          <Users size={20} />
          Group Session
        </button>

        <button className="p-3 bg-orange-600 text-white rounded-xl">
          <Bell size={20} />
          Send Reminders
        </button>
      </div>
    </div>
  );
};

export default CalendarCounseling;