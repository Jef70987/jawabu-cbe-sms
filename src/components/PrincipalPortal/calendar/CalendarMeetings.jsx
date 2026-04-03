import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Video, MapPin,
  Plus, Edit2, Eye, Search, Filter,
  Download, Bell, MessageSquare, ChevronLeft, ChevronRight,
  FileText   // ✅ FIXED: Added this
} from 'lucide-react';

const CalendarMeetings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const meetings = [
    {
      id: 1,
      title: 'Board of Governors Meeting',
      type: 'Board',
      date: '2024-04-05',
      time: '10:00 AM',
      duration: '2 hours',
      location: 'Conference Room A',
      mode: 'Hybrid',
      organizer: 'Principal\'s Office',
      attendees: ['Dr. John Smith', 'Board Members', 'Department Heads'],
      agenda: ['Budget approval', 'Strategic planning', 'Policy review'],
      status: 'Scheduled'
    },
    {
      id: 2,
      title: 'Department Heads Meeting',
      type: 'Department',
      date: '2024-04-08',
      time: '2:00 PM',
      duration: '1.5 hours',
      location: 'Conference Room B',
      mode: 'In-Person',
      organizer: 'Academic Office',
      attendees: ['All Department Heads', 'Principal'],
      agenda: ['Academic performance', 'Curriculum updates', 'Staff matters'],
      status: 'Scheduled'
    },
    {
      id: 3,
      title: 'Parent Advisory Committee',
      type: 'Committee',
      date: '2024-04-10',
      time: '6:00 PM',
      duration: '1 hour',
      location: 'Virtual',
      mode: 'Virtual',
      organizer: 'PTA',
      attendees: ['Parent Representatives', 'Principal', 'Vice Principal'],
      agenda: ['School events', 'Parent concerns', 'Fundraising'],
      status: 'Scheduled'
    },
    {
      id: 4,
      title: 'Staff Professional Development',
      type: 'Training',
      date: '2024-04-12',
      time: '8:30 AM',
      duration: 'Full Day',
      location: 'Auditorium',
      mode: 'In-Person',
      organizer: 'HR Department',
      attendees: ['All Teaching Staff'],
      agenda: ['New teaching methodologies', 'Technology integration', 'Workshops'],
      status: 'Scheduled'
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Board': return 'bg-purple-100 text-purple-800';
      case 'Department': return 'bg-blue-100 text-blue-800';
      case 'Committee': return 'bg-green-100 text-green-800';
      case 'Training': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode) => {
    return mode === 'Virtual' ? <Video size={14} /> : <MapPin size={14} />;
  };

  const filteredMeetings = meetings.filter(meeting =>
    (filterType === 'all' || meeting.type === filterType) &&
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage all meetings</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Schedule</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 flex justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{meeting.title}</h3>
                <p className="text-sm text-gray-600">{meeting.date} • {meeting.time}</p>
              </div>
              <div className="flex space-x-2">
                <Eye size={16} />
                <Edit2 size={16} />
                <Bell size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-3 bg-blue-500 text-white rounded-xl">
          <Video size={20} />
          <p>Start Video Call</p>
        </button>
        <button className="p-3 bg-green-500 text-white rounded-xl">
          <FileText size={20} /> {/* ✅ Now works */}
          <p>Meeting Minutes</p>
        </button>
        <button className="p-3 bg-purple-500 text-white rounded-xl">
          <Users size={20} />
          <p>Invite Participants</p>
        </button>
        <button className="p-3 bg-orange-500 text-white rounded-xl">
          <Bell size={20} />
          <p>Send Reminders</p>
        </button>
      </div>
    </div>
  );
};

export default CalendarMeetings;