import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  PieChart, BarChart3, TrendingUp, Users,
  GraduationCap, DollarSign, Award, Clock,
  Eye, MoreVertical, Plus, Printer, Mail
} from 'lucide-react';

const PrincipalReports = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 1,
      name: 'Monthly Academic Performance Report',
      type: 'academic',
      generated: '2024-03-15',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Comprehensive analysis of student performance across all grades'
    },
    {
      id: 2,
      name: 'Financial Summary - Q1 2024',
      type: 'financial',
      generated: '2024-03-14',
      format: 'Excel',
      size: '1.8 MB',
      description: 'Revenue, expenses, and budget utilization analysis'
    },
    {
      id: 3,
      name: 'Staff Attendance & Performance',
      type: 'hr',
      generated: '2024-03-13',
      format: 'PDF',
      size: '3.1 MB',
      description: 'Staff attendance records and performance metrics'
    },
    {
      id: 4,
      name: 'Student Enrollment Analysis',
      type: 'enrollment',
      generated: '2024-03-12',
      format: 'PDF',
      size: '1.5 MB',
      description: 'Enrollment trends and demographic analysis'
    },
    {
      id: 5,
      name: 'Discipline Summary Report',
      type: 'discipline',
      generated: '2024-03-11',
      format: 'PDF',
      size: '1.2 MB',
      description: 'Overview of disciplinary cases and resolutions'
    },
    {
      id: 6,
      name: 'Annual Institutional Report 2023',
      type: 'annual',
      generated: '2024-01-15',
      format: 'PDF',
      size: '5.6 MB',
      description: 'Complete annual review of school performance'
    },
  ];

  const reportTemplates = [
    { id: 1, name: 'Academic Report Template', type: 'academic', lastUsed: '2024-03-10' },
    { id: 2, name: 'Financial Report Template', type: 'financial', lastUsed: '2024-03-08' },
    { id: 3, name: 'Staff Report Template', type: 'hr', lastUsed: '2024-03-05' },
    { id: 4, name: 'Student Report Template', type: 'enrollment', lastUsed: '2024-03-01' },
  ];

  const scheduledReports = [
    { id: 1, name: 'Weekly Academic Summary', frequency: 'Every Monday', nextRun: '2024-03-18', recipients: 5 },
    { id: 2, name: 'Monthly Financial Report', frequency: '1st of month', nextRun: '2024-04-01', recipients: 3 },
  ];

  const filteredReports = reportType === 'all' 
    ? reports 
    : reports.filter(r => r.type === reportType);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate, schedule, and analyze institutional reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>Mar 2024</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <button 
          onClick={() => setReportType('all')}
          className={`p-4 rounded-lg border transition ${
            reportType === 'all' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FileText size={20} className="mb-2" />
          <p className="font-medium">All Reports</p>
          <p className={`text-sm ${reportType === 'all' ? 'text-blue-100' : 'text-gray-500'}`}>24 total</p>
        </button>
        <button 
          onClick={() => setReportType('academic')}
          className={`p-4 rounded-lg border transition ${
            reportType === 'academic' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <GraduationCap size={20} className="mb-2" />
          <p className="font-medium">Academic</p>
          <p className={`text-sm ${reportType === 'academic' ? 'text-blue-100' : 'text-gray-500'}`}>8 reports</p>
        </button>
        <button 
          onClick={() => setReportType('financial')}
          className={`p-4 rounded-lg border transition ${
            reportType === 'financial' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <DollarSign size={20} className="mb-2" />
          <p className="font-medium">Financial</p>
          <p className={`text-sm ${reportType === 'financial' ? 'text-blue-100' : 'text-gray-500'}`}>6 reports</p>
        </button>
        <button 
          onClick={() => setReportType('hr')}
          className={`p-4 rounded-lg border transition ${
            reportType === 'hr' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Users size={20} className="mb-2" />
          <p className="font-medium">HR & Staff</p>
          <p className={`text-sm ${reportType === 'hr' ? 'text-blue-100' : 'text-gray-500'}`}>5 reports</p>
        </button>
        <button 
          onClick={() => setReportType('enrollment')}
          className={`p-4 rounded-lg border transition ${
            reportType === 'enrollment' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={20} className="mb-2" />
          <p className="font-medium">Enrollment</p>
          <p className={`text-sm ${reportType === 'enrollment' ? 'text-blue-100' : 'text-gray-500'}`}>5 reports</p>
        </button>
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
          <div className="w-48">
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
              <option>Custom range</option>
            </select>
          </div>
          <div className="w-48">
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All formats</option>
              <option>PDF</option>
              <option>Excel</option>
              <option>Word</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    report.type === 'academic' ? 'bg-blue-100' :
                    report.type === 'financial' ? 'bg-green-100' :
                    report.type === 'hr' ? 'bg-purple-100' :
                    report.type === 'enrollment' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    {report.type === 'academic' && <GraduationCap size={24} className="text-blue-600" />}
                    {report.type === 'financial' && <DollarSign size={24} className="text-green-600" />}
                    {report.type === 'hr' && <Users size={24} className="text-purple-600" />}
                    {report.type === 'enrollment' && <TrendingUp size={24} className="text-orange-600" />}
                    {report.type === 'discipline' && <Award size={24} className="text-red-600" />}
                    {report.type === 'annual' && <FileText size={24} className="text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Generated: {report.generated}</span>
                      <span className="text-xs text-gray-500">Format: {report.format}</span>
                      <span className="text-xs text-gray-500">Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download">
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Share">
                    <Mail size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Print">
                    <Printer size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="More">
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates and Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Templates */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Report Templates</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Create Template</button>
          </div>
          <div className="divide-y divide-gray-200">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{template.name}</p>
                  <p className="text-xs text-gray-500">Last used: {template.lastUsed}</p>
                </div>
                <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Scheduled Reports</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Schedule New</button>
          </div>
          <div className="divide-y divide-gray-200">
            {scheduledReports.map((schedule) => (
              <div key={schedule.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{schedule.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" /> {schedule.frequency}
                      </span>
                      <span className="text-xs text-gray-500">Next: {schedule.nextRun}</span>
                      <span className="text-xs text-gray-500">{schedule.recipients} recipients</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalReports;