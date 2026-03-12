import React, { useState } from 'react';
import {
  Calendar, Clock, ChevronLeft, ChevronRight,
  Plus, Eye, Edit2, MoreVertical, Users,
  Gavel, Heart, MessageSquare, AlertTriangle,
  CheckCircle, XCircle, Filter, Search
} from 'lucide-react';

const DeputyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Calendar Events Data
  const events = [
    {
      id: 1,
      title: 'Disciplinary Hearing - James Wilson',
      type: 'hearing',
      date: '2024-03-18',
      time: '10:00 AM',
      duration: '1 hour',
      location: 'Room 204',
      participants: ['James Wilson', 'Dr. Martinez', 'Ms. Thompson'],
      status: 'Scheduled',
      priority: 'High',
      description: 'Review of bullying case #DC001'
    },
    {
      id: 2,
      title: 'Counseling Session - Sarah Chen',
      type: 'counseling',
      date: '2024-03-18',
      time: '2:00 PM',
      duration: '45 mins',
      location: 'Counseling Office',
      participants: ['Sarah Chen', 'Dr. Wilson'],
      status: 'Scheduled',
      priority: 'Medium',
      description: 'Follow-up on anxiety management'
    },
    {
      id: 3,
      title: 'Staff Meeting - Discipline Review',
      type: 'meeting',
      date: '2024-03-19',
      time: '9:00 AM',
      duration: '1.5 hours',
      location: 'Conference Room A',
      participants: ['Dr. Martinez', 'Ms. Thompson', 'Dr. Wilson', 'Mr. Davis'],
      status: 'Scheduled',
      priority: 'High',
      description: 'Monthly discipline case review'
    },
    {
      id: 4,
      title: 'Parent-Teacher Conference',
      type: 'meeting',
      date: '2024-03-19',
      time: '3:30 PM',
      duration: '30 mins',
      location: 'Room 108',
      participants: ['Michael Brown', 'Mrs. Brown', 'Mr. Davis'],
      status: 'Scheduled',
      priority: 'Medium',
      description: 'Discuss behavioral issues'
    },
    {
      id: 5,
      title: 'Suspension Review Board',
      type: 'hearing',
      date: '2024-03-20',
      time: '11:00 AM',
      duration: '2 hours',
      location: 'Board Room',
      participants: ['Board Members', 'Dr. Martinez', 'Student Representatives'],
      status: 'Scheduled',
      priority: 'High',
      description: 'Review of suspension policies'
    },
    {
      id: 6,
      title: 'Group Counseling Session',
      type: 'counseling',
      date: '2024-03-20',
      time: '1:00 PM',
      duration: '1 hour',
      location: 'Group Room',
      participants: ['8 students', 'Dr. Wilson'],
      status: 'Scheduled',
      priority: 'Medium',
      description: 'Anger management group'
    },
    {
      id: 7,
      title: 'Deadline - Appeal Submissions',
      type: 'deadline',
      date: '2024-03-21',
      time: '5:00 PM',
      duration: 'All day',
      location: 'Online',
      participants: ['All pending appeals'],
      status: 'Upcoming',
      priority: 'High',
      description: 'Last day for appeal submissions'
    },
  ];

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  // Calendar navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'hearing': return 'bg-red-100 text-red-800 border-red-200';
      case 'counseling': return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'hearing': return <Gavel size={14} className="text-red-600" />;
      case 'counseling': return <Heart size={14} className="text-green-600" />;
      case 'meeting': return <Users size={14} className="text-blue-600" />;
      case 'deadline': return <AlertTriangle size={14} className="text-yellow-600" />;
      default: return <Calendar size={14} className="text-gray-600" />;
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const days = generateCalendarDays();

  // Today's events
  const todayEvents = events.filter(e => e.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule hearings, meetings, and counseling sessions</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'month' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'week' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'day' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Plus size={18} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Schedule</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-sm text-gray-600">{todayEvents.filter(e => e.type === 'hearing').length} Hearings</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-600">{todayEvents.filter(e => e.type === 'counseling').length} Counseling</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-sm text-gray-600">{todayEvents.filter(e => e.type === 'meeting').length} Meetings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">{monthName} {year}</h2>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const dateEvents = date ? getEventsForDate(date) : [];
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg transition ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'border-purple-500 border-2' : 'border-gray-200'}`}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${
                          isToday ? 'text-purple-600' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {date.getDate()}
                        </span>
                        {dateEvents.length > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-1.5 rounded-full">
                            {dateEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dateEvents.slice(0, 2).map((event, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className={`w-full text-left text-xs p-1 rounded ${getEventTypeColor(event.type)} truncate`}
                          >
                            {event.time} - {event.title}
                          </button>
                        ))}
                        {dateEvents.length > 2 && (
                          <p className="text-xs text-gray-500 pl-1">+{dateEvents.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search events..."
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="p-1.5 hover:bg-gray-200 rounded-lg">
              <Filter size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600 flex items-center">
                        <Calendar size={12} className="mr-1" /> {event.date}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center">
                        <Clock size={12} className="mr-1" /> {event.time} ({event.duration})
                      </span>
                      <span className="text-xs text-gray-600">{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.priority}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getEventTypeColor(selectedEvent.type)}`}>
                  {getEventTypeIcon(selectedEvent.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600">{selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEvent.date}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEvent.time}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEvent.duration}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-800">{selectedEvent.description}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Participants</p>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.participants.map((p, i) => (
                    <span key={i} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Edit Event
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyCalendar;