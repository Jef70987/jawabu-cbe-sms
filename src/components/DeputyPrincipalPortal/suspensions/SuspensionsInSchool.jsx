import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MoreVertical,
  Calendar, Clock, UserX, Download,
  CheckCircle, BookOpen, Users
} from 'lucide-react';

const SuspensionsInSchool = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const inSchoolSuspensions = [
    {
      id: 'SUS002',
      student: 'Sarah Chen',
      grade: '10B',
      reason: 'Repeated truancy',
      startDate: '2024-04-02',
      endDate: '2024-04-05',
      days: 4,
      location: 'Room 101',
      supervisor: 'Ms. Thompson',
      assignments: ['Reflection essay', 'Behavior contract'],
      progress: 75,
      behavior: 'Satisfactory'
    },
    {
      id: 'SUS005',
      student: 'Emily Davis',
      grade: '9D',
      reason: 'Disruptive behavior',
      startDate: '2024-04-03',
      endDate: '2024-04-04',
      days: 2,
      location: 'Room 102',
      supervisor: 'Mr. Davis',
      assignments: ['Classroom rules review', 'Counseling session'],
      progress: 50,
      behavior: 'Improving'
    },
    {
      id: 'SUS008',
      student: 'David Lee',
      grade: '11B',
      reason: 'Uniform violations',
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      days: 3,
      location: 'Room 103',
      supervisor: 'Ms. Johnson',
      assignments: ['Uniform policy study', 'Written reflection'],
      progress: 90,
      behavior: 'Excellent'
    }
  ];

  const filteredSuspensions = inSchoolSuspensions.filter(s =>
    s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBehaviorColor = (behavior) => {
    switch(behavior) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Satisfactory': return 'bg-blue-100 text-blue-800';
      case 'Improving': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">In-School Suspensions</h1>
          <p className="text-gray-600 mt-1">Manage internal suspension placements</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <BookOpen size={18} />
            <span>Assignment Library</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active In-School</p>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Duration</p>
          <p className="text-2xl font-bold text-gray-800">3.2</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">89%</p>
          <p className="text-xs text-gray-500">Positive outcome</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Available Rooms</p>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Rooms</option>
            <option>Room 101</option>
            <option>Room 102</option>
            <option>Room 103</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Suspensions Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuspensions.map((suspension) => (
          <div key={suspension.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <UserX size={20} className="text-yellow-600" />
                    <span className="font-mono text-sm font-medium text-gray-500">{suspension.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{suspension.student}</h3>
                  <p className="text-sm text-gray-600">Grade {suspension.grade}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getBehaviorColor(suspension.behavior)}`}>
                  {suspension.behavior}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Reason</p>
                <p className="text-gray-800">{suspension.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Supervisor</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.supervisor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-800">{suspension.startDate} - {suspension.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Days</p>
                  <p className="text-sm font-medium text-yellow-600">{suspension.days} days</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Assignments</p>
                <div className="flex flex-wrap gap-2">
                  {suspension.assignments.map((assignment, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {assignment}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-800">{suspension.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${suspension.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                  Update Progress
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Eye size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspensionsInSchool;