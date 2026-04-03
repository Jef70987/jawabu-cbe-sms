import React, { useState } from 'react';
import {
  Calendar, Clock, Flag, Umbrella,
  Plus, Edit2, Trash2, Eye, Search,
  Filter, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

const CalendarHolidays = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const holidays = [
    {
      id: 1,
      name: 'Independence Day',
      type: 'National Holiday',
      date: '2024-07-04',
      duration: '1 day',
      description: 'National Independence Day celebration',
      schoolClosed: true
    },
    {
      id: 2,
      name: 'Thanksgiving Break',
      type: 'School Holiday',
      date: '2024-11-25',
      endDate: '2024-11-29',
      duration: '5 days',
      description: 'Thanksgiving holiday break',
      schoolClosed: true
    },
    {
      id: 3,
      name: 'Winter Break',
      type: 'School Holiday',
      date: '2024-12-23',
      endDate: '2025-01-05',
      duration: '14 days',
      description: 'Winter holiday break',
      schoolClosed: true
    },
    {
      id: 4,
      name: 'Spring Break',
      type: 'School Holiday',
      date: '2025-03-17',
      endDate: '2025-03-21',
      duration: '5 days',
      description: 'Spring holiday break',
      schoolClosed: true
    },
    {
      id: 5,
      name: 'Memorial Day',
      type: 'National Holiday',
      date: '2024-05-27',
      duration: '1 day',
      description: 'Memorial Day observance',
      schoolClosed: true
    },
    {
      id: 6,
      name: 'Professional Development Day',
      type: 'Staff Development',
      date: '2024-04-26',
      duration: '1 day',
      description: 'Staff training - No classes for students',
      schoolClosed: false
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'National Holiday': return 'bg-red-100 text-red-800';
      case 'School Holiday': return 'bg-green-100 text-green-800';
      case 'Staff Development': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHolidays = holidays.filter(holiday =>
    (filterType === 'all' || holiday.type === filterType) &&
    holiday.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingHolidays = holidays.filter(h => new Date(h.date) > new Date()).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Holidays & Breaks</h1>
          <p className="text-gray-600 mt-1">Manage school holidays and vacation periods</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Calendar</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Holidays</p>
          <p className="text-2xl font-bold text-gray-800">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">{upcomingHolidays}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">School Closed Days</p>
          <p className="text-2xl font-bold text-blue-600">15</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Staff Development</p>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search holidays..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="National Holiday">National Holidays</option>
            <option value="School Holiday">School Holidays</option>
            <option value="Staff Development">Staff Development</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Holidays List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holiday Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date(s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School Closed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHolidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{holiday.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(holiday.type)}`}>
                      {holiday.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {holiday.date} {holiday.endDate && `- ${holiday.endDate}`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{holiday.duration}</td>
                  <td className="px-6 py-4">
                    {holiday.schoolClosed ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Staff Only</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holiday Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Upcoming Holidays</h3>
          <div className="space-y-2">
            {holidays.filter(h => new Date(h.date) > new Date()).slice(0, 3).map(holiday => (
              <div key={holiday.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{holiday.name}</span>
                <span className="text-sm font-medium text-blue-600">{holiday.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Total Days Off</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-xs text-gray-500">School Closed Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-xs text-gray-500">Staff Development Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Holidays are subject to change. Please check the calendar regularly for updates.
        </p>
      </div>
    </div>
  );
};

export default CalendarHolidays;