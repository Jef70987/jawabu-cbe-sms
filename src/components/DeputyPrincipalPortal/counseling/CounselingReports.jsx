import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Mail, Share2, Plus,
  BarChart3, PieChart, TrendingUp, Users,
  Award, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const CounselingReports = () => {
  const [activeTab, setActiveTab] = useState('generated');

  const reports = [
    {
      id: 'CR001',
      name: 'Monthly Counseling Summary - March 2024',
      type: 'Monthly',
      generated: '2024-04-01',
      format: 'PDF',
      size: '1.8 MB',
      status: 'Final',
      downloads: 45,
      summary: {
        sessions: 86,
        students: 52,
        referrals: 24,
        success: 87
      }
    },
    {
      id: 'CR002',
      name: 'Counselor Performance Report',
      type: 'Performance',
      generated: '2024-03-28',
      format: 'Excel',
      size: '2.1 MB',
      status: 'Final',
      downloads: 32,
      summary: {
        sessions: 145,
        students: 78,
        referrals: 32,
        success: 89
      }
    },
    {
      id: 'CR003',
      name: 'Student Progress Analysis',
      type: 'Progress',
      generated: '2024-03-25',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Draft',
      downloads: 18,
      summary: {
        sessions: 62,
        students: 45,
        referrals: 18,
        success: 92
      }
    }
  ];

  const templates = [
    { id: 1, name: 'Weekly Counseling Summary', lastUsed: '2024-03-28' },
    { id: 2, name: 'Student Progress Report', lastUsed: '2024-03-25' },
    { id: 3, name: 'Counselor Activity Report', lastUsed: '2024-03-20' }
  ];

  const tabs = [
    { id: 'generated', name: 'Generated Reports', icon: <FileText size={16} /> },
    { id: 'templates', name: 'Templates', icon: <FileText size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Reports</h1>
          <p className="text-gray-600 mt-1">Generate and analyze counseling activity reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-gray-800">48</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-blue-600">356</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Satisfaction</p>
          <p className="text-2xl font-bold text-purple-600">92%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                  <option>All Types</option>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Performance</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          <FileText size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{report.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Generated: {report.generated} • Format: {report.format} • Size: {report.size}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          
                          {/* Summary Stats */}
                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Sessions</p>
                              <p className="text-sm font-semibold text-gray-800">{report.summary.sessions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Students</p>
                              <p className="text-sm font-semibold text-gray-800">{report.summary.students}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Referrals</p>
                              <p className="text-sm font-semibold text-gray-800">{report.summary.referrals}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Success Rate</p>
                              <p className="text-sm font-semibold text-green-600">{report.summary.success}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white rounded-lg">
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg">
                          <Download size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg">
                          <Printer size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText size={20} className="text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">Last used: {template.lastUsed}</p>
                  <div className="mt-3 flex space-x-2">
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
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Most Common Referral Reasons</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Academic Stress</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Behavioral Issues</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Personal/Social</span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Session Outcomes</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Positive Outcome</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Needs Follow-up</span>
                        <span>13%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '13%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-2">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <TrendingUp size={16} className="mt-0.5" />
                    <span>15% increase in counseling engagement this quarter</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle size={16} className="mt-0.5" />
                    <span>92% of students report positive impact</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users size={16} className="mt-0.5" />
                    <span>Average 8 sessions per student</span>
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

export default CounselingReports;