import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Plus, Edit2,
  Eye, MoreVertical, Download, Filter,
  ChevronLeft, ChevronRight, Grid, List
} from 'lucide-react';

const CounselingSchedule = () => {
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weeklySchedule = {
    Monday: [
      { time: '9:00 AM', student: 'Emma Thompson', counselor: 'Dr. Wilson', type: 'Academic', room: '101' },
      { time: '10:00 AM', student: 'James Wilson', counselor: 'Mr. Brown', type: 'Behavioral', room: '102' },
      { time: '11:00 AM', student: 'Group Session', counselor: 'Dr. Wilson', type: 'Group', room: '103' },
      { time: '2:00 PM', student: 'Sophia Lee', counselor: 'Dr. Wilson', type: 'Personal', room: '101' }
    ],
    Tuesday: [
      { time: '10:00 AM', student: 'Michael Brown', counselor: 'Mr. Brown', type: 'Academic', room: '102' },
      { time: '11:30 AM', student: 'Emily Davis', counselor: 'Dr. Wilson', type: 'Behavioral', room: '101' },
      { time: '1:00 PM', student: 'David Lee', counselor: 'Mr. Brown', type: 'Personal', room: '103' }
    ],
    Wednesday: [
      { time: '9:30 AM', student: 'Sarah Chen', counselor: 'Dr. Wilson', type: 'Academic', room: '101' },
      { time: '11:00 AM', student: 'Group Session', counselor: 'Mr. Brown', type: 'Group', room: '103' },
      { time: '2:30 PM', student: 'Lisa Wong', counselor: 'Dr. Wilson', type: 'Behavioral', room: '102' }
    ],
    Thursday: [
      { time: '10:00 AM', student: 'Robert Johnson', counselor: 'Mr. Brown', type: 'Academic', room: '103' },
      { time: '1:00 PM', student: 'Olivia Martinez', counselor: 'Dr. Wilson', type: 'Personal', room: '101' },
      { time: '3:00 PM', student: 'Parent Meeting', counselor: 'Dr. Wilson', type: 'Parent', room: '102' }
    ],
    Friday: [
      { time: '9:00 AM', student: 'Emma Thompson', counselor: 'Dr. Wilson', type: 'Follow-up', room: '101' },
      { time: '11:00 AM', student: 'James Wilson', counselor: 'Mr. Brown', type: 'Follow-up', room: '102' },
      { time: '2:00 PM', student: 'Staff Meeting', counselor: 'All', type: 'Meeting', room: '103' }
    ]
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Behavioral': return 'bg-red-100 text-red-800';
      case 'Personal': return 'bg-green-100 text-green-800';
      case 'Group': return 'bg-purple-100 text-purple-800';
      case 'Follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'Parent': return 'bg-orange-100 text-orange-800';
      case 'Meeting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Schedule</h1>
          <p className="text-gray-600 mt-1">Manage weekly counseling appointments</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'week' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'day' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Schedule</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Book Session</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Sessions This Week</p>
          <p className="text-2xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Available Slots</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Group Sessions</p>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Follow-ups Scheduled</p>
          <p className="text-2xl font-bold text-yellow-600">8</p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Week of {currentDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
            </h2>
            <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
              <option>All Counselors</option>
              <option>Dr. Sarah Wilson</option>
              <option>Mr. Robert Brown</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeSlots.map((time) => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{time}</td>
                  {days.map((day) => {
                    const session = weeklySchedule[day]?.find(s => s.time === time);
                    return (
                      <td key={day} className="px-4 py-3">
                        {session ? (
                          <div className={`p-2 rounded-lg ${getTypeColor(session.type)}`}>
                            <p className="font-medium text-sm">{session.student}</p>
                            <p className="text-xs mt-1">{session.counselor}</p>
                            <p className="text-xs">{session.room}</p>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm text-center">Available</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Session Types</h4>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Academic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Behavioral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Personal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs text-gray-600">Group</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600">Follow-up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingSchedule;