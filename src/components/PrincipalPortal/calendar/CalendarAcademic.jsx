import React, { useState } from 'react';
import {
  Calendar, Clock, BookOpen, GraduationCap,
  ChevronLeft, ChevronRight, Download, Printer,
  Eye, Plus, Edit2, Trash2, Search, Filter
} from 'lucide-react';

const CalendarAcademic = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const academicEvents = [
    {
      id: 1,
      title: 'First Day of School',
      type: 'Academic',
      date: '2024-08-15',
      description: 'Start of Fall Semester'
    },
    {
      id: 2,
      title: 'Mid-Term Examinations',
      type: 'Examination',
      date: '2024-10-15',
      endDate: '2024-10-20',
      description: 'Mid-term exams for all grades'
    },
    {
      id: 3,
      title: 'Parent-Teacher Conferences',
      type: 'Event',
      date: '2024-10-25',
      description: 'Progress review meetings'
    },
    {
      id: 4,
      title: 'Thanksgiving Break',
      type: 'Holiday',
      date: '2024-11-25',
      endDate: '2024-11-29',
      description: 'School closed'
    },
    {
      id: 5,
      title: 'Final Examinations',
      type: 'Examination',
      date: '2024-12-10',
      endDate: '2024-12-20',
      description: 'End of semester exams'
    },
    {
      id: 6,
      title: 'Winter Break',
      type: 'Holiday',
      date: '2024-12-23',
      endDate: '2025-01-05',
      description: 'School closed for holidays'
    },
    {
      id: 7,
      title: 'Spring Semester Begins',
      type: 'Academic',
      date: '2025-01-06',
      description: 'Start of Spring Semester'
    },
    {
      id: 8,
      title: 'Spring Break',
      type: 'Holiday',
      date: '2025-03-17',
      endDate: '2025-03-21',
      description: 'School closed'
    }
  ];

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Examination': return 'bg-red-100 text-red-800';
      case 'Event': return 'bg-green-100 text-green-800';
      case 'Holiday': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getYear = (date) => {
    return date.getFullYear();
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForMonth = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return academicEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const monthEvents = getEventsForMonth();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Calendar</h1>
          <p className="text-gray-600 mt-1">Manage school academic schedule and important dates</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              List
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Calendar</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Event</span>
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
              {getMonthName(currentDate)} {getYear(currentDate)}
            </h2>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
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
      </div>

      {viewMode === 'month' ? (
        // Month View
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 35 }).map((_, index) => {
              const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const startingDay = firstDayOfMonth.getDay();
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - startingDay + 1);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              const dayEvents = academicEvents.filter(event => event.date === date.toISOString().split('T')[0]);

              return (
                <div
                  key={index}
                  className={`bg-white p-2 min-h-[100px] ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                >
                  <div className={`text-right text-sm ${
                    isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto' :
                    isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded ${getEventTypeColor(event.type)} truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Academic Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {academicEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Date: {event.date} {event.endDate && `- ${event.endDate}`}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events .Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Upcoming This Month</h3>
          <p className="text-2xl font-bold text-blue-600">{monthEvents.length}</p>
          <p className="text-sm text-gray-600">events scheduled</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Next Event</h3>
          <p className="text-sm font-medium text-gray-800">
            {academicEvents.find(e => new Date(e.date) > new Date())?.title || 'No upcoming events'}
          </p>
          <p className="text-xs text-gray-500">
            {academicEvents.find(e => new Date(e.date) > new Date())?.date || 'N/A'}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Academic Year</h3>
          <p className="text-sm font-medium text-gray-800">2024-2025</p>
          <p className="text-xs text-gray-500">180 instructional days</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarAcademic;