import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, MoreVertical, Printer, Mail, Share2,
  BarChart3, PieChart, TrendingUp, Users,
  Clock, CheckCircle, AlertTriangle, XCircle,
  FileSpreadsheet, FileJson, FileBarChart,
  Plus, Trash2, Edit2, Copy, Star, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const DeputyCaseReports = () => {
  const [activeTab, setActiveTab] = useState('generated');
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Report Templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Daily Discipline Summary',
      type: 'daily',
      description: 'Summary of all disciplinary cases for the current day',
      format: 'PDF',
      lastGenerated: '2024-03-15',
      includes: ['Case counts', 'Severity breakdown', 'Immediate actions']
    },
    {
      id: 2,
      name: 'Weekly Case Analysis',
      type: 'weekly',
      description: 'Comprehensive analysis of weekly disciplinary trends',
      format: 'Excel',
      lastGenerated: '2024-03-14',
      includes: ['Trend analysis', 'Department breakdown', 'Resolution rates']
    },
    {
      id: 3,
      name: 'Monthly Discipline Report',
      type: 'monthly',
      description: 'Monthly overview with statistics and recommendations',
      format: 'PDF',
      lastGenerated: '2024-03-01',
      includes: ['Monthly statistics', 'Comparative analysis', 'Action items']
    },
    {
      id: 4,
      name: 'Quarterly Review',
      type: 'quarterly',
      description: 'Quarterly performance and trend analysis',
      format: 'PDF',
      lastGenerated: '2024-01-01',
      includes: ['Quarterly trends', 'Success metrics', 'Strategic recommendations']
    },
    {
      id: 5,
      name: 'Suspension Report',
      type: 'suspension',
      description: 'Detailed report on all suspensions',
      format: 'Excel',
      lastGenerated: '2024-03-10',
      includes: ['Suspension counts', 'Duration analysis', 'Follow-up status']
    },
    {
      id: 6,
      name: 'Counseling Referral Summary',
      type: 'counseling',
      description: 'Overview of counseling referrals and outcomes',
      format: 'PDF',
      lastGenerated: '2024-03-12',
      includes: ['Referral types', 'Session outcomes', 'Follow-up schedule']
    },
  ];

  // Generated Reports
  const generatedReports = [
    {
      id: 'RPT001',
      name: 'Daily Discipline Summary - Mar 15, 2024',
      type: 'daily',
      generated: '2024-03-15',
      generatedBy: 'Dr. Sarah Martinez',
      format: 'PDF',
      size: '1.2 MB',
      status: 'Final',
      downloads: 5,
      summary: {
        totalCases: 8,
        resolved: 4,
        pending: 3,
        highSeverity: 2
      }
    },
    {
      id: 'RPT002',
      name: 'Weekly Case Analysis - Week 11',
      type: 'weekly',
      generated: '2024-03-14',
      generatedBy: 'Dr. Sarah Martinez',
      format: 'Excel',
      size: '2.8 MB',
      status: 'Final',
      downloads: 12,
      summary: {
        totalCases: 42,
        resolved: 35,
        pending: 7,
        highSeverity: 8
      }
    },
    {
      id: 'RPT003',
      name: 'Monthly Discipline Report - February 2024',
      type: 'monthly',
      generated: '2024-03-01',
      generatedBy: 'Dr. Sarah Martinez',
      format: 'PDF',
      size: '3.4 MB',
      status: 'Final',
      downloads: 25,
      summary: {
        totalCases: 156,
        resolved: 128,
        pending: 28,
        highSeverity: 15
      }
    },
    {
      id: 'RPT004',
      name: 'Suspension Report - Q1 2024',
      type: 'suspension',
      generated: '2024-03-10',
      generatedBy: 'Dr. Sarah Martinez',
      format: 'Excel',
      size: '1.5 MB',
      status: 'Draft',
      downloads: 3,
      summary: {
        totalCases: 18,
        inSchool: 8,
        outOfSchool: 10,
        appeals: 3
      }
    },
    {
      id: 'RPT005',
      name: 'Counseling Referral Summary - March',
      type: 'counseling',
      generated: '2024-03-12',
      generatedBy: 'Ms. Thompson',
      format: 'PDF',
      size: '1.1 MB',
      status: 'Final',
      downloads: 8,
      summary: {
        totalReferrals: 24,
        completed: 18,
        scheduled: 6,
        urgent: 4
      }
    },
  ];

  // Scheduled Reports
  const scheduledReports = [
    {
      id: 'SCH001',
      name: 'Daily Discipline Summary',
      frequency: 'Daily',
      time: '5:00 PM',
      recipients: ['principal@school.edu', 'discipline@school.edu'],
      format: 'PDF',
      nextRun: '2024-03-16',
      status: 'Active'
    },
    {
      id: 'SCH002',
      name: 'Weekly Case Analysis',
      frequency: 'Every Monday',
      time: '8:00 AM',
      recipients: ['principal@school.edu', 'counselors@school.edu'],
      format: 'Excel',
      nextRun: '2024-03-18',
      status: 'Active'
    },
    {
      id: 'SCH003',
      name: 'Monthly Discipline Report',
      frequency: '1st of Month',
      time: '9:00 AM',
      recipients: ['principal@school.edu', 'board@school.edu'],
      format: 'PDF',
      nextRun: '2024-04-01',
      status: 'Active'
    },
  ];

  // Report Statistics
  const reportStats = {
    totalReports: 156,
    reportsThisMonth: 24,
    scheduledReports: 8,
    averageDownloads: 15,
    mostDownloaded: 'Monthly Discipline Report',
    lastGenerated: '2024-03-15'
  };

  const tabs = [
    { id: 'generated', name: 'Generated Reports', icon: <FileText size={16} /> },
    { id: 'templates', name: 'Templates', icon: <Copy size={16} /> },
    { id: 'scheduled', name: 'Scheduled', icon: <Clock size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> },
  ];

  const reportTypes = [
    { id: 'all', name: 'All Reports' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'quarterly', name: 'Quarterly' },
    { id: 'suspension', name: 'Suspension' },
    { id: 'counseling', name: 'Counseling' },
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'daily': return <Clock size={16} className="text-blue-500" />;
      case 'weekly': return <Calendar size={16} className="text-green-500" />;
      case 'monthly': return <FileText size={16} className="text-purple-500" />;
      case 'quarterly': return <BarChart3 size={16} className="text-orange-500" />;
      case 'suspension': return <AlertTriangle size={16} className="text-red-500" />;
      case 'counseling': return <Users size={16} className="text-indigo-500" />;
      default: return <FileText size={16} className="text-gray-500" />;
    }
  };

  const filteredReports = generatedReports.filter(report => 
    (reportType === 'all' || report.type === reportType) &&
    (report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Case Reports</h1>
          <p className="text-gray-600 mt-1">Generate, manage, and analyze disciplinary case reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reportStats.totalReports}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-green-600">{reportStats.reportsThisMonth}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-purple-600">{reportStats.scheduledReports}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Downloads</p>
              <p className="text-2xl font-bold text-orange-600">{reportStats.averageDownloads}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Download size={20} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Generated</p>
              <p className="text-lg font-bold text-gray-800">{reportStats.lastGenerated}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <Calendar size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Generated Reports Tab */}
          {activeTab === 'generated' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search reports by name or ID..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    {reportTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-48">
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 90 days</option>
                    <option value="year">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                  <Filter size={18} className="text-gray-600" />
                  <span>More Filters</span>
                </button>
              </div>

              {/* Reports Grid */}
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-800">{report.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Generated by {report.generatedBy} on {report.generated}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">Format: {report.format}</span>
                            <span className="text-xs text-gray-500">Size: {report.size}</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Download size={12} className="mr-1" /> {report.downloads} downloads
                            </span>
                          </div>
                          
                          {/* Report Summary */}
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {Object.entries(report.summary).map(([key, value]) => (
                              <div key={key} className="bg-white p-2 rounded-lg">
                                <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-sm font-semibold text-gray-800">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="p-2 hover:bg-white rounded-lg transition"
                          title="View Report"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition" title="Download">
                          <Download size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition" title="Print">
                          <Printer size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition" title="Share">
                          <Share2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition" title="More">
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Report Templates</h3>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  Create Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-white rounded-lg">
                        {getTypeIcon(template.type)}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-800 mt-3">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <FileText size={12} className="mr-1" /> Format: {template.format}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" /> Last used: {template.lastGenerated}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Includes:</p>
                      <ul className="space-y-1">
                        {template.includes.map((item, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <CheckCircle size={10} className="text-green-500 mr-1" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        Use Template
                      </button>
                      <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-100">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Scheduled Reports</h3>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  Schedule New
                </button>
              </div>

              <div className="space-y-4">
                {scheduledReports.map((schedule) => (
                  <div key={schedule.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          <Clock size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{schedule.name}</h4>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {schedule.frequency}
                            </span>
                            <span className="text-xs text-gray-600">{schedule.time}</span>
                            <span className="text-xs text-gray-600">Format: {schedule.format}</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {schedule.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">Recipients:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {schedule.recipients.map((email, index) => (
                                <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                  {email}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Next run: {schedule.nextRun}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white rounded-lg">
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg">
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg">
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Generation Trends */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Report Generation Trends</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[
                      { month: 'Jan', count: 12 },
                      { month: 'Feb', count: 15 },
                      { month: 'Mar', count: 18 },
                      { month: 'Apr', count: 14 },
                      { month: 'May', count: 20 },
                      { month: 'Jun', count: 24 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Report Type Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Reports by Type</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={[
                          { name: 'Daily', value: 45, color: '#3B82F6' },
                          { name: 'Weekly', value: 32, color: '#10B981' },
                          { name: 'Monthly', value: 28, color: '#8B5CF6' },
                          { name: 'Quarterly', value: 15, color: '#F59E0B' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportTemplates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                {/* Most Downloaded */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Most Downloaded Reports</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Monthly Discipline Report</span>
                      <span className="text-sm font-medium text-gray-900">124 downloads</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Weekly Case Analysis</span>
                      <span className="text-sm font-medium text-gray-900">98 downloads</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Suspension Report</span>
                      <span className="text-sm font-medium text-gray-900">76 downloads</span>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Usage Statistics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">PDF Format</span>
                        <span className="font-medium text-gray-800">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Excel Format</span>
                        <span className="font-medium text-gray-800">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Report Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedReport.name}</h3>
                    <p className="text-sm text-gray-600">Report ID: {selectedReport.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedReport.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              {/* Report Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Generated By</p>
                  <p className="font-medium text-gray-800">{selectedReport.generatedBy}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Generated On</p>
                  <p className="font-medium text-gray-800">{selectedReport.generated}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="font-medium text-gray-800">{selectedReport.format}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="font-medium text-gray-800">{selectedReport.size}</p>
                </div>
              </div>

              {/* Report Summary */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Report Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedReport.summary).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{value}</p>
                      <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Placeholder */}
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Report preview would be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">Click download to view full report</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Printer size={16} />
                  <span>Print</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generate New Report</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Daily Discipline Summary</option>
                  <option>Weekly Case Analysis</option>
                  <option>Monthly Discipline Report</option>
                  <option>Suspension Report</option>
                  <option>Counseling Referral Summary</option>
                  <option>Custom Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This month</option>
                  <option>Last month</option>
                  <option>Custom range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" defaultChecked /> PDF
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" /> Excel
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-2" /> CSV
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Include Sections</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked /> Case Summary
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked /> Severity Breakdown
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked /> Resolution Rates
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Trend Analysis
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Recommendations
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>None - Generate once</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Generate Report
                </button>
                <button 
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyCaseReports;
