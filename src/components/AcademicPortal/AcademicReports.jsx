import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Mail, Share2, Plus,
  BarChart3, PieChart, TrendingUp, Users,
  Award, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const AcademicReports = () => {
  const [activeTab, setActiveTab] = useState('generated');
  const [reportType, setReportType] = useState('all');

  const reports = [
    {
      id: 'RPT001',
      name: 'Monthly Academic Performance Report',
      type: 'performance',
      generated: '2024-03-15',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Final',
      downloads: 45,
      description: 'Comprehensive analysis of student performance across all grades'
    },
    {
      id: 'RPT002',
      name: 'Subject-Wise Analysis - March 2024',
      type: 'subject',
      generated: '2024-03-14',
      format: 'Excel',
      size: '1.8 MB',
      status: 'Final',
      downloads: 32,
      description: 'Detailed subject-wise performance metrics'
    },
    {
      id: 'RPT003',
      name: 'Grade Comparison Report',
      type: 'comparative',
      generated: '2024-03-13',
      format: 'PDF',
      size: '3.1 MB',
      status: 'Draft',
      downloads: 12,
      description: 'Comparative analysis across different grades'
    },
    {
      id: 'RPT004',
      name: 'Attendance Summary Report',
      type: 'attendance',
      generated: '2024-03-12',
      format: 'Excel',
      size: '1.5 MB',
      status: 'Final',
      downloads: 28,
      description: 'Monthly attendance statistics and trends'
    }
  ];

  const reportTemplates = [
    { id: 1, name: 'Semester Report Card Template', type: 'academic', lastUsed: '2024-03-10' },
    { id: 2, name: 'Subject Analysis Template', type: 'subject', lastUsed: '2024-03-08' },
    { id: 3, name: 'Student Performance Template', type: 'performance', lastUsed: '2024-03-05' }
  ];

  const tabs = [
    { id: 'generated', name: 'Generated Reports', icon: <FileText size={16} /> },
    { id: 'templates', name: 'Templates', icon: <FileText size={16} /> },
    { id: 'scheduled', name: 'Scheduled', icon: <Clock size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage academic reports and analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-gray-800">156</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-purple-600">1,245</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
          {activeTab === 'generated' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="all">All Reports</option>
                  <option value="performance">Performance Reports</option>
                  <option value="subject">Subject Analysis</option>
                  <option value="attendance">Attendance Reports</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          <FileText size={20} className="text-green-600" />
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
                        <button className="p-1 hover:bg-white rounded-lg">
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-white rounded-lg">
                          <Download size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-white rounded-lg">
                          <Printer size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-white rounded-lg">
                          <Mail size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-white rounded-lg">
                        <FileText size={20} className="text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">Last used: {template.lastUsed}</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
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

          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Clock size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Weekly Performance Report</h4>
                      <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">Next run: 2024-03-18</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Calendar size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Monthly Summary Report</h4>
                      <p className="text-sm text-gray-600">1st of every month at 8:00 AM</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">Next run: 2024-04-01</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Most Downloaded Reports</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Performance Report</span>
                      <span className="text-sm font-medium">124 downloads</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Subject Analysis</span>
                      <span className="text-sm font-medium">98 downloads</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Grade Comparison</span>
                      <span className="text-sm font-medium">76 downloads</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Report Type Distribution</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Reports</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Subject Analysis</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance Reports</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicReports;