import React, { useState } from 'react';
import {
  BookOpen, Plus, Search, Filter, Download,
  Eye, Edit2, MoreVertical, Users, Clock,
  Award, CheckCircle, XCircle, Calendar
} from 'lucide-react';

const AcademicCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const courses = [
    {
      id: 'MATH101',
      name: 'Advanced Mathematics',
      department: 'Mathematics',
      credits: 4,
      hours: 5,
      students: 120,
      instructor: 'Dr. Robert Chen',
      status: 'Active',
      schedule: 'Mon, Wed, Fri 10:00 AM',
      prerequisites: 'Algebra II',
      description: 'Advanced mathematical concepts including calculus and linear algebra'
    },
    {
      id: 'SCI201',
      name: 'Physics',
      department: 'Science',
      credits: 4,
      hours: 4,
      students: 95,
      instructor: 'Prof. Sarah Johnson',
      status: 'Active',
      schedule: 'Tue, Thu 1:00 PM',
      prerequisites: 'Basic Physics',
      description: 'Comprehensive physics covering mechanics, thermodynamics, and waves'
    },
    {
      id: 'ENG301',
      name: 'English Literature',
      department: 'English',
      credits: 3,
      hours: 3,
      students: 85,
      instructor: 'Dr. Emily Williams',
      status: 'Active',
      schedule: 'Mon, Wed 2:00 PM',
      prerequisites: 'English II',
      description: 'Study of classic and contemporary literature'
    },
    {
      id: 'CS401',
      name: 'Computer Science',
      department: 'Technology',
      credits: 3,
      hours: 4,
      students: 65,
      instructor: 'Prof. Michael Brown',
      status: 'Full',
      schedule: 'Tue, Thu 9:00 AM',
      prerequisites: 'Programming Basics',
      description: 'Introduction to computer science and programming'
    }
  ];

  const filteredCourses = courses.filter(course =>
    (filterType === 'all' || course.status === filterType) &&
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage all academic courses and offerings</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Courses</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Courses</p>
          <p className="text-2xl font-bold text-gray-800">86</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Courses</p>
          <p className="text-2xl font-bold text-green-600">78</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Enrollments</p>
          <p className="text-2xl font-bold text-blue-600">4,850</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Average Class Size</p>
          <p className="text-2xl font-bold text-purple-600">28</p>
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
                placeholder="Search courses by name or instructor..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Full">Full</option>
            <option value="Closed">Closed</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>All Departments</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>Technology</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.id} • {course.department}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  course.status === 'Active' ? 'bg-green-100 text-green-800' :
                  course.status === 'Full' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{course.hours} hours/week</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{course.credits} credits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{course.students} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{course.schedule}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="text-sm font-medium text-gray-700">{course.instructor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Prerequisites</p>
                  <p className="text-sm text-gray-600">{course.prerequisites}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Manage Course
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

export default AcademicCourses;