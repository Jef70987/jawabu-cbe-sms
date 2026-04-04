import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Plus, Trash2, Settings,
  CheckCircle, XCircle, Clock, Users
} from 'lucide-react';

const ReportsCustom = () => {
  const [reportName, setReportName] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const availableMetrics = [
    { id: 'enrollment', name: 'Enrollment Statistics', icon: <Users size={16} /> },
    { id: 'academic', name: 'Academic Performance', icon: <FileText size={16} /> },
    { id: 'attendance', name: 'Attendance Data', icon: <Calendar size={16} /> },
    { id: 'financial', name: 'Financial Metrics', icon: <Download size={16} /> },
    { id: 'staff', name: 'Staff Performance', icon: <Users size={16} /> },
    { id: 'discipline', name: 'Discipline Cases', icon: <FileText size={16} /> }
  ];

  const availableFilters = [
    { id: 'grade', name: 'Grade Level', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
    { id: 'department', name: 'Department', options: ['Mathematics', 'Science', 'English', 'Arts'] },
    { id: 'date', name: 'Date Range', options: ['Last Month', 'Last Quarter', 'This Year'] }
  ];

  const customReports = [
    {
      id: 'CUS001',
      name: 'Q1 Performance Dashboard',
      created: '2024-03-15',
      metrics: ['Enrollment', 'Academic', 'Attendance'],
      lastRun: '2024-03-20',
      runs: 12
    },
    {
      id: 'CUS002',
      name: 'Student Progress Tracker',
      created: '2024-03-10',
      metrics: ['Academic', 'Attendance'],
      lastRun: '2024-03-18',
      runs: 8
    }
  ];

  const toggleMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const generateReport = () => {
    alert('Report generated successfully!');
  };

  const saveTemplate = () => {
    alert('Template saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Custom Reports</h1>
          <p className="text-gray-600 mt-1">Create and manage custom report templates</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Templates</span>
          </button>
          <button 
            onClick={generateReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <FileText size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input
                  type="text"
                  placeholder="Enter report name..."
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition ${
                    selectedMetrics.includes(metric.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                  {selectedMetrics.includes(metric.id) && (
                    <CheckCircle size={14} className="ml-auto text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Apply Filters</h2>
            <div className="space-y-4">
              {availableFilters.map((filter) => (
                <div key={filter.id} className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2">{filter.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <button
                        key={option}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={generateReport}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
            <button 
              onClick={saveTemplate}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Save as Template
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              Clear All
            </button>
          </div>
        </div>

        {/* Preview and Templates Panel */}
        <div className="space-y-6">
          {/* Report Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Preview</h2>
            
            {reportName && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Report Name</p>
                <p className="font-medium text-gray-800">{reportName}</p>
              </div>
            )}

            {(dateRange.start || dateRange.end) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Date Range</p>
                <p className="font-medium text-gray-800">
                  {dateRange.start || 'Start'} to {dateRange.end || 'End'}
                </p>
              </div>
            )}

            {selectedMetrics.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Selected Metrics ({selectedMetrics.length})</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMetrics.map(metricId => {
                    const metric = availableMetrics.find(m => m.id === metricId);
                    return metric ? (
                      <span key={metricId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {metric.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {!reportName && !dateRange.start && selectedMetrics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Configure your report to see preview</p>
              </div>
            )}
          </div>

          {/* Saved. Templates */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Templates</h2>
            <div className="space-y-3">
              {customReports.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{template.name}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Created: {template.created}</p>
                  <p className="text-xs text-gray-500">Last run: {template.lastRun}</p>
                  <p className="text-xs text-gray-500">{template.runs} runs</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                      Use Template
                    </button>
                    <button className="px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsCustom;