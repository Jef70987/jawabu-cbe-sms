import React, { useState } from 'react';
import {
  Calendar, Clock, Users, BookOpen,
  Plus, Edit2, Eye, Search,
  Filter, Download, Printer, ChevronLeft,
  ChevronRight, Grid, List, Settings
} from 'lucide-react';

const AcademicTimetable = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedGrade, setSelectedGrade] = useState('10A');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const timetableData = {
    '10A': {
      Monday: [
        { period: 1, time: '8:00-9:00', subject: 'Mathematics', teacher: 'Dr. Chen', room: '101' },
        { period: 2, time: '9:00-10:00', subject: 'English', teacher: 'Ms. Williams', room: '102' },
        { period: 3, time: '10:15-11:15', subject: 'Physics', teacher: 'Prof. Johnson', room: '201' },
        { period: 4, time: '11:15-12:15', subject: 'Chemistry', teacher: 'Dr. Martinez', room: '202' },
        { period: 5, time: '1:00-2:00', subject: 'History', teacher: 'Mr. Davis', room: '103' }
      ],
      Tuesday: [
        { period: 1, time: '8:00-9:00', subject: 'Mathematics', teacher: 'Dr. Chen', room: '101' },
        { period: 2, time: '9:00-10:00', subject: 'Computer Science', teacher: 'Prof. Brown', room: 'Lab 1' },
        { period: 3, time: '10:15-11:15', subject: 'English', teacher: 'Ms. Williams', room: '102' },
        { period: 4, time: '11:15-12:15', subject: 'Physics', teacher: 'Prof. Johnson', room: '201' },
        { period: 5, time: '1:00-2:00', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gym' }
      ],
      Wednesday: [
        { period: 1, time: '8:00-9:00', subject: 'Chemistry', teacher: 'Dr. Martinez', room: '202' },
        { period: 2, time: '9:00-10:00', subject: 'Mathematics', teacher: 'Dr. Chen', room: '101' },
        { period: 3, time: '10:15-11:15', subject: 'History', teacher: 'Mr. Davis', room: '103' },
        { period: 4, time: '11:15-12:15', subject: 'English', teacher: 'Ms. Williams', room: '102' },
        { period: 5, time: '1:00-2:00', subject: 'Art', teacher: 'Ms. Taylor', room: 'Art Room' }
      ],
      Thursday: [
        { period: 1, time: '8:00-9:00', subject: 'Physics', teacher: 'Prof. Johnson', room: '201' },
        { period: 2, time: '9:00-10:00', subject: 'Chemistry', teacher: 'Dr. Martinez', room: '202' },
        { period: 3, time: '10:15-11:15', subject: 'Mathematics', teacher: 'Dr. Chen', room: '101' },
        { period: 4, time: '11:15-12:15', subject: 'Computer Science', teacher: 'Prof. Brown', room: 'Lab 1' },
        { period: 5, time: '1:00-2:00', subject: 'English', teacher: 'Ms. Williams', room: '102' }
      ],
      Friday: [
        { period: 1, time: '8:00-9:00', subject: 'History', teacher: 'Mr. Davis', room: '103' },
        { period: 2, time: '9:00-10:00', subject: 'Mathematics', teacher: 'Dr. Chen', room: '101' },
        { period: 3, time: '10:15-11:15', subject: 'Science', teacher: 'Prof. Johnson', room: '201' },
        { period: 4, time: '11:15-12:15', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gym' },
        { period: 5, time: '1:00-2:00', subject: 'Club Activities', teacher: 'Various', room: 'Various' }
      ]
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5];
  const periodTimes = ['8:00-9:00', '9:00-10:00', '10:15-11:15', '11:15-12:15', '1:00-2:00'];

  const currentTimetable = timetableData[selectedGrade] || timetableData['10A'];

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: 'bg-blue-100 text-blue-800',
      English: 'bg-green-100 text-green-800',
      Physics: 'bg-purple-100 text-purple-800',
      Chemistry: 'bg-orange-100 text-orange-800',
      History: 'bg-red-100 text-red-800',
      'Computer Science': 'bg-indigo-100 text-indigo-800',
      'Physical Education': 'bg-yellow-100 text-yellow-800',
      Art: 'bg-pink-100 text-pink-800',
      Science: 'bg-teal-100 text-teal-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Timetable Management</h1>
          <p className="text-gray-600 mt-1">Manage class schedules and teacher assignments</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Timetable</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Generate Timetable</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Select Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>9A</option>
              <option>9B</option>
              <option>9C</option>
              <option>10A</option>
              <option>10B</option>
              <option>10C</option>
              <option>11A</option>
              <option>11B</option>
              <option>11C</option>
              <option>12A</option>
              <option>12B</option>
              <option>12C</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700">Week of {getWeekRange()}</span>
            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <List size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Printer size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {periods.map((period) => (
                <tr key={period} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{period}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{periodTimes[period - 1]}</td>
                  {days.map((day) => {
                    const lesson = currentTimetable[day]?.find(p => p.period === period);
                    return (
                      <td key={day} className="px-4 py-3">
                        {lesson ? (
                          <div className={`p-2 rounded-lg ${getSubjectColor(lesson.subject)}`}>
                            <p className="font-medium text-sm">{lesson.subject}</p>
                            <p className="text-xs mt-1">{lesson.teacher}</p>
                            <p className="text-xs text-gray-500">Room {lesson.room}</p>
                          </div>
                        ) : (
                          <div className="p-2 text-gray-400 text-sm">Free Period</div>
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
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Subject Color Legend</h4>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Mathematics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">English</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs text-gray-600">Physics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">Chemistry</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">History</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded"></div>
            <span className="text-xs text-gray-600">Computer Science</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600">Physical Education</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition">
          <Users size={20} className="mb-1" />
          <p className="text-sm font-medium">Teacher Schedule</p>
        </button>
        <button className="p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition">
          <BookOpen size={20} className="mb-1" />
          <p className="text-sm font-medium">Room Allocation</p>
        </button>
        <button className="p-3 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition">
          <Clock size={20} className="mb-1" />
          <p className="text-sm font-medium">Period Management</p>
        </button>
        <button className="p-3 bg-orange-50 rounded-lg text-orange-700 hover:bg-orange-100 transition">
          <Calendar size={20} className="mb-1" />
          <p className="text-sm font-medium">Holiday Schedule</p>
        </button>
      </div>
    </div>
  );
};

export default AcademicTimetable;