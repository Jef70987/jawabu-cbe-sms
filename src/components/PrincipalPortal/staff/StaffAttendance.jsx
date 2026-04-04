import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Search, Filter,
  Download, Eye, TrendingUp, TrendingDown,
  CheckCircle, AlertCircle, UserCheck, UserX,
  BarChart3, LineChart as LineChartIcon
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const StaffAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const attendanceData = [
    { month: 'Jan', present: 95, absent: 5, late: 3 },
    { month: 'Feb', present: 96, absent: 4, late: 2 },
    { month: 'Mar', present: 94, absent: 6, late: 4 },
    { month: 'Apr', present: 97, absent: 3, late: 2 },
    { month: 'May', present: 95, absent: 5, late: 3 },
    { month: 'Jun', present: 96, absent: 4, late: 2 }
  ];

  const staffAttendanceList = [
    { name: 'Dr. Robert Chen', department: 'Mathematics', present: 98, absent: 2, late: 1, leaves: 0 },
    { name: 'Prof. Sarah Johnson', department: 'Science', present: 96, absent: 4, late: 2, leaves: 1 },
    { name: 'Ms. Jennifer Thompson', department: 'English', present: 94, absent: 6, late: 3, leaves: 2 },
    { name: 'Mr. Michael Davis', department: 'Administration', present: 92, absent: 8, late: 2, leaves: 3 },
    { name: 'Dr. Emily Wilson', department: 'Science', present: 97, absent: 3, late: 1, leaves: 1 },
    { name: 'Prof. James Anderson', department: 'Mathematics', present: 95, absent: 5, late: 2, leaves: 1 }
  ];

  const departmentAttendance = [
    { department: 'Mathematics', rate: 97 },
    { department: 'Science', rate: 95 },
    { department: 'English', rate: 93 },
    { department: 'Technology', rate: 96 },
    { department: 'Arts', rate: 94 },
    { department: 'Administration', rate: 91 }
  ];

  const filteredStaff = staffAttendanceList.filter(staff =>
    (filterDepartment === 'all' || staff.department === filterDepartment) &&
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (present) => {
    if (present >= 95) return 'bg-green-100 text-green-800';
    if (present >= 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (present) => {
    if (present >= 95) return 'Excellent';
    if (present >= 90) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Attendance</h1>
          <p className="text-gray-600 mt-1">Monitor staff attendance and leave records</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Attendance</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Calendar size={18} />
            <span>View Calendar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Overall Attendance</p>
          <p className="text-2xl font-bold text-green-600">95.2%</p>
          <p className="text-xs text-green-600">↑ 0.8% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Present Today</p>
          <p className="text-2xl font-bold text-blue-600">178</p>
          <p className="text-xs text-gray-500">Out of 186 staff</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold text-orange-600">8</p>
          <p className="text-xs text-gray-500">Various leave types</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Late Arrivals</p>
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-xs text-gray-500">Today</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
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
            <option>Administration</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Attendance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} name="Present %" />
            <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Absent %" />
            <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} name="Late %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Staff Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Staff Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leaves</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{staff.name}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{staff.present}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${staff.present}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{staff.absent} days</td>
                  <td className="px-6 py-4 text-gray-600">{staff.late} days</td>
                  <td className="px-6 py-4 text-gray-600">{staff.leaves} days</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(staff.present)}`}>
                      {getStatusText(staff.present)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Attendance Rates</h2>
          <div className="space-y-4">
            {departmentAttendance.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{dept.department}</span>
                  <span className="font-medium text-gray-800">{dept.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${dept.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Attendance Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <TrendingUp size={16} className="text-green-600 mt-0.5" />
              <p className="text-sm text-gray-600">Best attendance: Mathematics Department (97%)</p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
              <p className="text-sm text-gray-600">Peak leave period: December (12 staff on leave)</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5" />
              <p className="text-sm text-gray-600">Overall attendance improved by 0.8% this month</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Generate Attendance Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;