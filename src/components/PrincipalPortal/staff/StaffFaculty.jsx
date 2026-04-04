import React, { useState } from 'react';
import {
  BookOpen, Users, Search, Filter, Download,
  Eye, Edit2, MoreVertical, Mail, Phone,
  Award, Clock, Calendar, GraduationCap,
  MessageSquare   // ✅ FIX ADDED HERE
} from 'lucide-react';

const StaffFaculty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const faculty = [
    {
      id: 'FAC001',
      name: 'Dr. Robert Chen',
      position: 'Head of Mathematics',
      department: 'Mathematics',
      email: 'r.chen@school.edu',
      phone: '+1 234-567-8901',
      qualification: 'PhD in Mathematics',
      experience: '12 years',
      courses: ['Calculus', 'Algebra', 'Statistics'],
      students: 120,
      rating: 4.9,
      status: 'Active'
    },
    {
      id: 'FAC002',
      name: 'Prof. Sarah Johnson',
      position: 'Head of Science',
      department: 'Science',
      email: 's.johnson@school.edu',
      phone: '+1 234-567-8902',
      qualification: 'PhD in Physics',
      experience: '10 years',
      courses: ['Physics', 'Astronomy'],
      students: 95,
      rating: 4.8,
      status: 'Active'
    },
    {
      id: 'FAC003',
      name: 'Ms. Jennifer Thompson',
      position: 'Senior English Teacher',
      department: 'English',
      email: 'j.thompson@school.edu',
      phone: '+1 234-567-8903',
      qualification: 'MA in English Literature',
      experience: '8 years',
      courses: ['English Literature', 'Creative Writing'],
      students: 85,
      rating: 4.7,
      status: 'Active'
    }
  ];

  const filteredFaculty = faculty.filter(f =>
    (filterDepartment === 'all' || f.department === filterDepartment) &&
    (f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     f.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Faculty Management</h1>
          <p className="text-gray-600 mt-1">Manage teaching staff and faculty members</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Faculty List</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Users size={18} />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Faculty</p>
          <p className="text-2xl font-bold text-blue-600">142</p>
          <p className="text-xs text-gray-500">Full-time: 128</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Departments</p>
          <p className="text-2xl font-bold text-gray-800">8</p>
          <p className="text-xs text-gray-500">Academic departments</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Student-Teacher Ratio</p>
          <p className="text-2xl font-bold text-green-600">17:1</p>
          <p className="text-xs text-gray-500">Optimal ratio</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Experience</p>
          <p className="text-2xl font-bold text-purple-600">8.5</p>
          <p className="text-xs text-gray-500">years</p>
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
                placeholder="Search faculty by name or position..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>Arts</option>
            <option>Commerce</option>
            <option>Technology</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Faculty Cards. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFaculty.map((faculty) => (
          <div key={faculty.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {faculty.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{faculty.name}</h3>
                    <p className="text-sm text-blue-600">{faculty.position}</p>
                    <p className="text-xs text-gray-500">{faculty.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Award size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium">{faculty.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Qualification</p>
                  <p className="text-sm font-medium text-gray-800">{faculty.qualification}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm font-medium text-gray-800">{faculty.experience}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-sm font-medium text-gray-800">{faculty.students} students</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Courses</p>
                  <p className="text-sm font-medium text-gray-800">{faculty.courses.length} courses</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Courses Taught:</p>
                <div className="flex flex-wrap gap-2">
                  {faculty.courses.map((course, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{faculty.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{faculty.phone}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Profile
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageSquare size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Calendar size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffFaculty;