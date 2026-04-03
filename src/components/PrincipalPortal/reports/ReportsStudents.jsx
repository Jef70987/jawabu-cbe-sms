import React from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, GraduationCap, Users,
  TrendingUp, Award, BarChart3, PieChart, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';

const ReportsStudents = () => {
  const studentReports = [
    {
      id: 'STU001',
      name: 'Student Performance Report - Q1 2024',
      type: 'Performance',
      generated: '2024-04-01',
      format: 'PDF',
      size: '2.8 MB',
      status: 'Final',
      downloads: 156,
      description: 'Comprehensive student academic performance analysis'
    },
    {
      id: 'STU002',
      name: 'Student Attendance Summary',
      type: 'Attendance',
      generated: '2024-03-28',
      format: 'Excel',
      size: '1.9 MB',
      status: 'Final',
      downloads: 98,
      description: 'Monthly student attendance and absenteeism report'
    },
    {
      id: 'STU003',
      name: 'Grade Distribution Report',
      type: 'Grades',
      generated: '2024-03-25',
      format: 'PDF',
      size: '2.1 MB',
      status: 'Final',
      downloads: 87,
      description: 'Grade distribution and GPA analysis by grade level'
    },
    {
      id: 'STU004',
      name: 'Student Demographics Report',
      type: 'Demographics',
      generated: '2024-03-20',
      format: 'PDF',
      size: '1.6 MB',
      status: 'Final',
      downloads: 67,
      description: 'Student population demographic analysis'
    }
  ];

  const studentStats = {
    totalStudents: 2450,
    activeStudents: 2380,
    honorRoll: 520,
    avgGPA: 3.42,
    attendanceRate: 94.2,
    graduationRate: 96.5
  };

  const gradeDistribution = [
    { grade: 'Grade 9', students: 620, percentage: 25.3 },
    { grade: 'Grade 10', students: 590, percentage: 24.1 },
    { grade: 'Grade 11', students: 580, percentage: 23.7 },
    { grade: 'Grade 12', students: 660, percentage: 26.9 }
  ];

  const gpaDistribution = [
    { range: '3.5-4.0', count: 520, percentage: 21.2 },
    { range: '3.0-3.49', count: 680, percentage: 27.8 },
    { range: '2.5-2.99', count: 590, percentage: 24.1 },
    { range: '2.0-2.49', count: 420, percentage: 17.1 },
    { range: 'Below 2.0', count: 240, percentage: 9.8 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage student performance reports</p>
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
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{studentStats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <GraduationCap className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average GPA</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{studentStats.avgGPA}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{studentStats.attendanceRate}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Honor Roll</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{studentStats.honorRoll}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <div className="space-y-4">
            {gradeDistribution.map((grade, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{grade.grade}</span>
                  <span className="font-medium text-gray-800">{grade.students} students ({grade.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${grade.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">GPA Distribution</h2>
          <div className="space-y-4">
            {gpaDistribution.map((gpa, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{gpa.range}</span>
                  <span className="font-medium text-gray-800">{gpa.count} students ({gpa.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${gpa.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {studentReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FileText size={20} className="text-yellow-600" />
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

export default ReportsStudents;