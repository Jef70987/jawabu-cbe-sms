import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Mail, Share2, Plus,
  BarChart3, PieChart, TrendingUp, GraduationCap,
  BookOpen, Award, Clock, CheckCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const ReportsAcademic = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('semester');

  const academicReports = [
    {
      id: 'ACR001',
      name: 'Semester Academic Performance Report',
      type: 'Performance',
      generated: '2024-03-15',
      format: 'PDF',
      size: '2.8 MB',
      status: 'Final',
      downloads: 156,
      description: 'Comprehensive analysis of student academic performance across all grades'
    },
    {
      id: 'ACR002',
      name: 'Subject-Wise Analysis Report',
      type: 'Subject Analysis',
      generated: '2024-03-10',
      format: 'Excel',
      size: '1.9 MB',
      status: 'Final',
      downloads: 98,
      description: 'Detailed performance breakdown by subject department'
    },
    {
      id: 'ACR003',
      name: 'Grade Comparison Report',
      type: 'Comparative',
      generated: '2024-03-05',
      format: 'PDF',
      size: '2.1 MB',
      status: 'Final',
      downloads: 87,
      description: 'Comparative analysis across different grade levels'
    },
    {
      id: 'ACR004',
      name: 'Exam Results Summary - Mid Terms',
      type: 'Examination',
      generated: '2024-02-28',
      format: 'PDF',
      size: '1.5 MB',
      status: 'Final',
      downloads: 234,
      description: 'Mid-term examination results and analysis'
    }
  ];

  const performanceData = [
    { month: 'Jan', avgGrade: 82, passRate: 88, attendance: 92 },
    { month: 'Feb', avgGrade: 84, passRate: 90, attendance: 93 },
    { month: 'Mar', avgGrade: 86, passRate: 92, attendance: 94 },
    { month: 'Apr', avgGrade: 85, passRate: 91, attendance: 93 },
    { month: 'May', avgGrade: 87, passRate: 93, attendance: 95 },
    { month: 'Jun', avgGrade: 89, passRate: 95, attendance: 96 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', score: 87, improvement: '+5%', students: 580 },
    { subject: 'English', score: 91, improvement: '+3%', students: 620 },
    { subject: 'Science', score: 89, improvement: '+4%', students: 540 },
    { subject: 'History', score: 86, improvement: '+2%', students: 480 },
    { subject: 'Arts', score: 94, improvement: '+6%', students: 320 }
  ];

  const reportStats = {
    totalReports: 48,
    generatedThisMonth: 12,
    totalDownloads: 1245,
    averageRating: 4.8
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage academic performance reports</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-gray-800">{reportStats.totalReports}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Generated This Month</p>
          <p className="text-2xl font-bold text-green-600">{reportStats.generatedThisMonth}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-blue-600">{reportStats.totalDownloads}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">User Rating</p>
          <p className="text-2xl font-bold text-purple-600">{reportStats.averageRating}/5.0</p>
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
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Types</option>
            <option>Performance</option>
            <option>Subject Analysis</option>
            <option>Comparative</option>
            <option>Examination</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Performance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgGrade" stroke="#3B82F6" strokeWidth={2} name="Avg Grade" />
            <Line type="monotone" dataKey="passRate" stroke="#10B981" strokeWidth={2} name="Pass Rate" />
            <Line type="monotone" dataKey="attendance" stroke="#F59E0B" strokeWidth={2} name="Attendance" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Subject Performance Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Improvement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjectPerformance.map((subject, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{subject.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{subject.score}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${subject.score}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-green-600">{subject.improvement}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.students}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subject.score >= 90 ? 'bg-green-100 text-green-800' :
                      subject.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subject.score >= 90 ? 'Excellent' : subject.score >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports .List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {academicReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText size={20} className="text-blue-600" />
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

export default ReportsAcademic;