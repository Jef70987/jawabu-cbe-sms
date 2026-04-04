import React, { useState } from 'react';
import {
  Building, Users, BookOpen, TrendingUp,
  Eye, Edit2, MoreVertical, Plus,
  Search, Filter, Download, Award,
  Calendar, Clock, CheckCircle
} from 'lucide-react';

const StaffDepartments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    {
      id: 'DEPT001',
      name: 'Mathematics',
      head: 'Dr. Robert Chen',
      faculty: 18,
      students: 580,
      performance: 92,
      budget: '$250,000',
      courses: 12,
      achievements: ['Math Olympiad Winners', 'Best Department Award'],
      status: 'Active'
    },
    {
      id: 'DEPT002',
      name: 'Science',
      head: 'Prof. Sarah Johnson',
      faculty: 22,
      students: 540,
      performance: 89,
      budget: '$320,000',
      courses: 15,
      achievements: ['Science Fair Champions', 'Research Grant Recipients'],
      status: 'Active'
    },
    {
      id: 'DEPT003',
      name: 'English',
      head: 'Ms. Jennifer Thompson',
      faculty: 16,
      students: 620,
      performance: 91,
      budget: '$210,000',
      courses: 10,
      achievements: ['Literary Magazine Award', 'Debate Champions'],
      status: 'Active'
    },
    {
      id: 'DEPT004',
      name: 'Technology',
      head: 'Prof. Michael Brown',
      faculty: 14,
      students: 450,
      performance: 94,
      budget: '$280,000',
      courses: 8,
      achievements: ['Robotics Competition Winners', 'Coding Club Success'],
      status: 'Active'
    }
  ];

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-600 mt-1">Manage academic departments and faculty</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Departments</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Faculty</p>
          <p className="text-2xl font-bold text-gray-800">142</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Performance</p>
          <p className="text-2xl font-bold text-green-600">90.5%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Courses</p>
          <p className="text-2xl font-bold text-purple-600">86</p>
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
                placeholder="Search by department name or head..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800 text-lg">{dept.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Head: {dept.head}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {dept.status}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Faculty Members</p>
                  <p className="text-lg font-semibold text-gray-800">{dept.faculty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-lg font-semibold text-gray-800">{dept.students}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Courses</p>
                  <p className="text-lg font-semibold text-gray-800">{dept.courses}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-lg font-semibold text-gray-800">{dept.budget}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Performance Score</span>
                  <span className="font-semibold text-green-600">{dept.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${dept.performance}%` }}
                  ></div>
                </div>
              </div>

              {dept.achievements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Achievements:</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.achievements.map((achievement, idx) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
                        <Award size={12} className="mr-1" /> {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Details
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
    </div>
  );
};

export default StaffDepartments;