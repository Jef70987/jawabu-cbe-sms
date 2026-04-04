import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Eye, Edit2,
  Plus, Search, Filter, Download,
  CheckCircle, Video, MapPin, MessageSquare,
  UserPlus, FileText, Bell, MoreVertical
} from 'lucide-react';

const CalendarMeetings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const meetings = [
    {
      id: 'MTG001',
      title: 'Staff Discipline Review Meeting',
      type: 'Department',
      date: '2024-04-05',
      time: '9:00 AM',
      duration: '1.5 hours',
      location: 'Conference Room A',
      mode: 'In-Person',
      organizer: 'Dr. Martinez',
      attendees: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis', 'Dr. Wilson'],
      agenda: [
        'Review of Q1 discipline cases',
        'New policy implementation',
        'Staff training schedule'
      ],
      status: 'Scheduled'
    },
    {
      id: 'MTG002',
      title: 'Parent-Teacher Conference',
      type: 'Parent Meeting',
      date: '2024-04-06',
      time: '3:00 PM',
      duration: '30 mins',
      location: 'Room 101',
      mode: 'In-Person',
      organizer: 'Ms. Thompson',
      attendees: ['Ms. Thompson', 'Mr. and Mrs. Wilson'],
      agenda: [
        'Student progress review',
        'Behavioral concerns',
        'Support strategies'
      ],
      status: 'Scheduled'
    },
    {
      id: 'MTG003',
      title: 'Discipline Committee Meeting',
      type: 'Committee',
      date: '2024-04-08',
      time: '2:00 PM',
      duration: '2 hours',
      location: 'Virtual',
      mode: 'Virtual',
      organizer: 'Dr. Martinez',
      attendees: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis', 'Dr. Wilson', 'Prof. Chen'],
      agenda: [
        'Policy review',
        'Case load analysis',
        'Upcoming initiatives'
      ],
      status: 'Scheduled'
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Department': return 'bg-blue-100 text-blue-800';
      case 'Committee': return 'bg-purple-100 text-purple-800';
      case 'Parent Meeting': return 'bg-green-100 text-green-800';
      case 'Staff Meeting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    (activeTab === 'all' || meeting.status === activeTab) &&
    (meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     meeting.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meetings Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and manage all meetings</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Calendar</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Meetings</p>
          <p className="text-2xl font-bold text-gray-800">18</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">12</p>
          <p className="text-xs text-gray-500">Next 7 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Virtual Meetings</p>
          <p className="text-2xl font-bold text-purple-600">6</p>
          <p className="text-xs text-gray-500">Online sessions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">In-Person</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-xs text-gray-500">On campus</p>
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
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scheduled
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
                  placeholder="Search meetings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Department Meeting</option>
              <option>Committee Meeting</option>
              <option>Parent Meeting</option>
              <option>Staff Meeting</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Users size={20} className="text-purple-600" />
                      <h3 className="font-semibold text-gray-800">{meeting.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(meeting.type)}`}>
                        {meeting.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Organized by: {meeting.organizer}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{meeting.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{meeting.time} ({meeting.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {meeting.mode === 'Virtual' ? 
                          <Video size={14} className="text-gray-400" /> : 
                          <MapPin size={14} className="text-gray-400" />
                        }
                        <span className="text-sm text-gray-600">{meeting.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{meeting.attendees.length} attendees</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Agenda:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {meeting.agenda.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Attendees:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meeting.attendees.map((attendee, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full">
                            {attendee}
                          </span>
                        ))}
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
                    <button className="p-2 hover:bg-white rounded-lg">
                      <Bell size={16} className="text-gray-600" />
                    </button>
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <Video size={20} className="mb-1" />
          <p className="text-sm font-semibold">Start Video Call</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <FileText size={20} className="mb-1" />
          <p className="text-sm font-semibold">Meeting Minutes</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <UserPlus size={20} className="mb-1" />
          <p className="text-sm font-semibold">Invite Participants</p>
        </button>
        <button className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white hover:shadow-lg transition">
          <MessageSquare size={20} className="mb-1" />
          <p className="text-sm font-semibold">Send Reminder</p>
        </button>
      </div>
    </div>
  );
};

export default CalendarMeetings;