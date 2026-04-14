import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Award, Star,
  Search, Filter, Download, Eye,
  Calendar, Clock, CheckCircle, AlertCircle,
  BarChart3, Users, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const StaffPerformance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const performanceData = [
    { name: 'Dr. Robert Chen', department: 'Mathematics', rating: 4.9, students: 120, satisfaction: 96, attendance: 98 },
    { name: 'Prof. Sarah Johnson', department: 'Science', rating: 4.8, students: 95, satisfaction: 94, attendance: 96 },
    { name: 'Ms. Jennifer Thompson', department: 'English', rating: 4.7, students: 85, satisfaction: 92, attendance: 94 },
    { name: 'Mr. Michael Davis', department: 'Administration', rating: 4.6, students: 0, satisfaction: 90, attendance: 92 }
  ];

  const departmentAverages = [
    { department: 'Mathematics', score: 92, target: 90 },
    { department: 'Science', score: 89, target: 90 },
    { department: 'English', score: 91, target: 90 },
    { department: 'Technology', score: 94, target: 90 },
    { department: 'Arts', score: 88, target: 90 }
  ];

  const filteredPerformance = performanceData.filter(p =>
    (filterDepartment === 'all' || p.department === filterDepartment) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Performance</h1>
          <p className="text-gray-600 mt-1">Monitor and evaluate staff performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>Generate Review</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Performance Rating</p>
          <p className="text-2xl font-bold text-blue-600">4.7</p>
          <p className="text-xs text-green-600">↑ 0.2 from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Staff Satisfaction</p>
          <p className="text-2xl font-bold text-green-600">93%</p>
          <p className="text-xs text-green-600">Above target</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">High Performers</p>
          <p className="text-2xl font-bold text-purple-600">45</p>
          <p className="text-xs text-gray-500">Rating 4.8+</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Needs Improvement</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
          <p className="text-xs text-orange-500">Rating below 4.0</p>
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
                placeholder="Search by staff name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
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
            <option>Administration</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Department Averages Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Performance Averages</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentAverages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#3B82F6" name="Current Score" />
            <Bar dataKey="target" fill="#10B981" name="Target Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Staff Performance Metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPerformance.map((staff, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{staff.name}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-800">{staff.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{staff.students}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{staff.satisfaction}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${staff.satisfaction}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{staff.attendance}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      staff.rating >= 4.7 ? 'bg-green-100 text-green-800' : 
                      staff.rating >= 4.0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {staff.rating >= 4.7 ? 'Excellent' : staff.rating >= 4.0 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Dr. Robert Chen</p>
            <p className="text-sm text-blue-100">Mathematics Department</p>
            <div className="flex items-center mt-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1">4.9 Rating</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Prof. Sarah Johnson</p>
            <p className="text-sm text-blue-100">Science Department</p>
            <div className="flex items-center mt-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1">4.8 Rating</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Ms. Jennifer Thompson</p>
            <p className="text-sm text-blue-100">English Department</p>
            <div className="flex items-center mt-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1">4.7 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;