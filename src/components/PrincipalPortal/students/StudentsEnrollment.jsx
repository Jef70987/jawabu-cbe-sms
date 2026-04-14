import React, { useState } from 'react';
import {
  Users, Calendar, TrendingUp, Download,
  Search, Filter, Eye, Plus, FileText,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const StudentsEnrollment = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const enrollmentData = [
    { year: '2020', students: 2100, newEnrollments: 450, transfers: 120 },
    { year: '2021', students: 2250, newEnrollments: 480, transfers: 110 },
    { year: '2022', students: 2350, newEnrollments: 520, transfers: 105 },
    { year: '2023', students: 2420, newEnrollments: 490, transfers: 95 },
    { year: '2024', students: 2450, newEnrollments: 510, transfers: 85 }
  ];

  const gradeDistribution = [
    { grade: 'Grade 9', students: 620, percentage: 25.3, newEnrollments: 180 },
    { grade: 'Grade 10', students: 590, percentage: 24.1, newEnrollments: 45 },
    { grade: 'Grade 11', students: 580, percentage: 23.7, newEnrollments: 40 },
    { grade: 'Grade 12', students: 660, percentage: 26.9, newEnrollments: 35 }
  ];

  const enrollmentStats = {
    totalStudents: 2450,
    newThisYear: 510,
    transfersIn: 85,
    transfersOut: 65,
    graduationRate: 96.5,
    retentionRate: 97.2
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Enrollment Management</h1>
          <p className="text-gray-600 mt-1">Track student enrollment trends and statistics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>New Enrollment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{enrollmentStats.totalStudents}</p>
          <p className="text-xs text-green-600">↑ 30 from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">New Enrollments</p>
          <p className="text-2xl font-bold text-green-600">{enrollmentStats.newThisYear}</p>
          <p className="text-xs text-green-600">↑ 20 from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Transfer Students</p>
          <p className="text-2xl font-bold text-orange-600">{enrollmentStats.transfersIn}</p>
          <p className="text-xs text-gray-500">In: {enrollmentStats.transfersIn} | Out: {enrollmentStats.transfersOut}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Retention Rate</p>
          <p className="text-2xl font-bold text-purple-600">{enrollmentStats.retentionRate}%</p>
          <p className="text-xs text-green-600">Above national average</p>
        </div>
      </div>

      {/* Enrollment Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trends (5-Year)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Total Students" />
            <Line type="monotone" dataKey="newEnrollments" stroke="#10B981" strokeWidth={2} name="New Enrollments" />
            <Line type="monotone" dataKey="transfers" stroke="#F59E0B" strokeWidth={2} name="Transfers" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <div className="space-y-4">
            {gradeDistribution.map((grade, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{grade.grade}</span>
                  <span className="text-gray-600">{grade.students} students ({grade.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${grade.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">New enrollments: {grade.newEnrollments}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Boys</span>
              <span className="font-semibold text-gray-800">1,350 (55.1%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Girls</span>
              <span className="font-semibold text-gray-800">1,100 (44.9%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Day Scholars</span>
              <span className="font-semibold text-gray-800">2,200 (89.8%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Boarders</span>
              <span className="font-semibold text-gray-800">250 (10.2%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Projections */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Enrollment Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">2025 Projection</p>
            <p className="text-2xl font-bold text-blue-600">2,550</p>
            <p className="text-xs text-green-600">↑ 4.1% growth</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity Utilization</p>
            <p className="text-2xl font-bold text-green-600">92%</p>
            <p className="text-xs text-gray-500">Optimal range</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Waitlist</p>
            <p className="text-2xl font-bold text-orange-600">145</p>
            <p className="text-xs text-gray-500">Applicants pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsEnrollment;