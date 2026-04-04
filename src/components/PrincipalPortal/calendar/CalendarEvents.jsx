import React, { useState } from 'react';
import {
  Calendar, Clock, MapPin, Users,
  Plus, Edit2, Trash2, Eye, Search,
  Filter, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

const CalendarEvents = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      title: 'Annual Science Fair',
      date: '2024-04-15',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Hall',
      organizer: 'Science Department',
      attendees: 450,
      description: 'Annual science exhibition featuring student projects',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Sports Day',
      date: '2024-04-20',
      time: '8:00 AM - 3:00 PM',
      location: 'Sports Ground',
      organizer: 'Sports Department',
      attendees: 600,
      description: 'Annual sports competition and activities',
      status: 'Upcoming'
    },
    {
      id: 3,
      title: 'Parent-Teacher Conference',
      date: '2024-04-25',
      time: '4:00 PM - 7:00 PM',
      location: 'Various Classrooms',
      organizer: 'Academic Office',
      attendees: 800,
      description: 'Semester progress meetings',
      status: 'Upcoming'
    },
    {
      id: 4,
      title: 'Graduation Ceremony',
      date: '2024-06-15',
      time: '10:00 AM - 1:00 PM',
      location: 'Auditorium',
      organizer: 'Principal\'s Office',
      attendees: 1200,
      description: 'Class of 2024 graduation ceremony',
      status: 'Planned'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'bg-green-100 text-green-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">School Events</h1>
          <p className="text-gray-600 mt-1">Manage all school events and activities</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Events</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">Organized by: {event.organizer}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{event.attendees} attendees</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Manage Event
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats .*/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-gray-800">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Attendees</p>
          <p className="text-2xl font-bold text-purple-600">3,450</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;