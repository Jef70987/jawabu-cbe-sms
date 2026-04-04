import React, { useState } from 'react';
import {
  Plus, FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Users, UserCheck, UserX,
  TrendingUp, Award, Clock, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

const ReportsStaff = () => {
  const staffReports = [
    {
      id: 'STF001',
      name: 'Staff Performance Report - Q1 2024',
      type: 'Performance',
      generated: '2024-04-01',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Final',
      downloads: 78,
      description: 'Comprehensive staff performance evaluation report'
    },
    {
      id: 'STF002',
      name: 'Staff Attendance Summary',
      type: 'Attendance',
      generated: '2024-03-28',
      format: 'Excel',
      size: '1.6 MB',
      status: 'Final',
      downloads: 56,
      description: 'Monthly staff attendance and leave analysis'
    },
    {
      id: 'STF003',
      name: 'Department Staffing Report',
      type: 'Staffing',
      generated: '2024-03-25',
      format: 'PDF',
      size: '1.9 MB',
      status: 'Final',
      downloads: 45,
      description: 'Staff distribution and allocation by department'
    },
    {
      id: 'STF004',
      name: 'Teacher Evaluation Summary',
      type: 'Evaluation',
      generated: '2024-03-20',
      format: 'PDF',
      size: '2.1 MB',
      status: 'Final',
      downloads: 89,
      description: 'Teacher performance evaluation results'
    }
  ];

  const staffStats = {
    totalStaff: 186,
    teachingStaff: 142,
    adminStaff: 44,
    attendanceRate: 95.2,
    avgPerformance: 4.7,
    turnoverRate: 8.5
  };

  const departmentStaffing = [
    { department: 'Teaching Faculty', count: 142, percentage: 76.3 },
    { department: 'Administration', count: 28, percentage: 15.1 },
    { department: 'Support Staff', count: 16, percentage: 8.6 }
  ];

  const performanceRatings = [
    { rating: 'Excellent', count: 45, percentage: 24.2 },
    { rating: 'Good', count: 98, percentage: 52.7 },
    { rating: 'Satisfactory', count: 32, percentage: 17.2 },
    { rating: 'Needs Improvement', count: 11, percentage: 5.9 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage staff performance reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Staff</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{staffStats.totalStaff}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{staffStats.attendanceRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Performance</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{staffStats.avgPerformance}/5.0</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Turnover Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{staffStats.turnoverRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <UserX className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Department Staffing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Staffing</h2>
          <div className="space-y-4">
            {departmentStaffing.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{dept.department}</span>
                  <span className="font-medium text-gray-800">{dept.count} staff ({dept.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Ratings</h2>
          <div className="space-y-4">
            {performanceRatings.map((rating, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{rating.rating}</span>
                  <span className="font-medium text-gray-800">{rating.count} ({rating.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports .List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {staffReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Generated: {report.generated}</span>
                      <span className="text-xs text-gray-500">Format: {report.format}</span>
                      <span className="text-xs text-gray-500">Size: {report.size}</span>
                      <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Printer size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsStaff;