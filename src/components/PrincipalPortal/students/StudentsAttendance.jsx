import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Search, Filter,
  Download, TrendingUp, TrendingDown,
  CheckCircle, AlertCircle, UserCheck, UserX
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const StudentsAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const attendanceData = [
    { month: 'Jan', present: 95, absent: 5, late: 3 },
    { month: 'Feb', present: 96, absent: 4, late: 2 },
    { month: 'Mar', present: 94, absent: 6, late: 4 },
    { month: 'Apr', present: 97, absent: 3, late: 2 },
    { month: 'May', present: 95, absent: 5, late: 3 },
    { month: 'Jun', present: 96, absent: 4, late: 2 }
  ];

  const gradeAttendance = [
    { grade: 'Grade 9', rate: 95.2, present: 590, absent: 30 },
    { grade: 'Grade 10', rate: 94.8, present: 560, absent: 32 },
    { grade: 'Grade 11', rate: 93.5, present: 540, absent: 38 },
    { grade: 'Grade 12', rate: 92.8, present: 490, absent: 42 }
  ];

  const attendanceStats = {
    overallRate: 94.2,
    presentToday: 2180,
    absentToday: 142,
    lateToday: 28,
    improvedStudents: 245,
    decliningStudents: 98
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Attendance</h1>
          <p className="text-gray-600 mt-1">Monitor student attendance patterns and trends</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Calendar size={18} />
            <span>View Calendar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Overall Attendance</p>
          <p className="text-2xl font-bold text-green-600">{attendanceStats.overallRate}%</p>
          <p className="text-xs text-green-600">↑ 1.2% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Present Today</p>
          <p className="text-2xl font-bold text-blue-600">{attendanceStats.presentToday}</p>
          <p className="text-xs text-gray-500">Out of {attendanceStats.presentToday + attendanceStats.absentToday} students</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Absent Today</p>
          <p className="text-2xl font-bold text-red-600">{attendanceStats.absentToday}</p>
          <p className="text-xs text-orange-600">{attendanceStats.lateToday} late arrivals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Monthly Target</p>
          <p className="text-2xl font-bold text-purple-600">95%</p>
          <p className="text-xs text-gray-500">Currently {attendanceStats.overallRate}%</p>
        </div>
      </div>

      {/* Monthly Trends Chart */}
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

      {/* Grade Level Attendance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Grade Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {gradeAttendance.map((grade, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">{grade.grade}</h4>
              <p className="text-2xl font-bold text-blue-600 mt-2">{grade.rate}%</p>
              <p className="text-sm text-gray-600 mt-1">{grade.present} present / {grade.absent} absent</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${grade.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-600" />
            <h4 className="font-semibold text-gray-800">Improved Attendance</h4>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">{attendanceStats.improvedStudents}</p>
          <p className="text-sm text-gray-600">students showed improvement this month</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown size={20} className="text-red-600" />
            <h4 className="font-semibold text-gray-800">Declining Attendance</h4>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">{attendanceStats.decliningStudents}</p>
          <p className="text-sm text-gray-600">students need attention</p>
        </div>
      </div>

      {/* Students with Low Attendance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Students with Low Attendance</h3>
        <div className="space-y-3">
          {[
            { name: 'Michael Brown', grade: '12C', rate: 72, daysAbsent: 28 },
            { name: 'James Wilson', grade: '11A', rate: 78, daysAbsent: 22 },
            { name: 'Sarah Chen', grade: '10B', rate: 82, daysAbsent: 18 }
          ].map((student, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.grade}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{student.rate}%</p>
                  <p className="text-xs text-gray-500">{student.daysAbsent} days absent</p>
                </div>
                <button className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                  Follow Up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendance;