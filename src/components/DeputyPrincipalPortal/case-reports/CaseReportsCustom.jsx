import React, { useState } from 'react';
import {
  Calendar, Download, Printer, Mail, FileText,
  Plus, Trash2, Eye, Settings, Filter,
  BarChart3, PieChart, TrendingUp, Users,
  AlertTriangle, CheckCircle, Clock, XCircle
} from 'lucide-react';

const CaseReportsCustom = () => {
  const [reportName, setReportName] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const availableMetrics = [
    { id: 'totalCases', name: 'Total Cases', icon: <FileText size={16} /> },
    { id: 'resolutionRate', name: 'Resolution Rate', icon: <CheckCircle size={16} /> },
    { id: 'avgResolutionTime', name: 'Avg Resolution Time', icon: <Clock size={16} /> },
    { id: 'highSeverity', name: 'High Severity Cases', icon: <AlertTriangle size={16} /> },
    { id: 'repeatOffenders', name: 'Repeat Offenders', icon: <Users size={16} /> },
    { id: 'offenseBreakdown', name: 'Offense Breakdown', icon: <PieChart size={16} /> }
  ];

  const availableFilters = [
    { id: 'grade', name: 'Grade Level', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
    { id: 'severity', name: 'Severity', options: ['High', 'Medium', 'Low'] },
    { id: 'status', name: 'Status', options: ['Active', 'Resolved', 'Pending'] },
    { id: 'offenseType', name: 'Offense Type', options: ['Bullying', 'Truancy', 'Disruption', 'Academic Dishonesty'] }
  ];

  const toggleMetric = (metric) => {
    if (selectedMetrics.includes(metric.id)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
    } else {
      setSelectedMetrics([...selectedMetrics, metric.id]);
    }
  };

  const toggleFilter = (filterId, option) => {
    const existingFilter = selectedFilters.find(f => f.id === filterId);
    if (existingFilter) {
      if (existingFilter.options.includes(option)) {
        const updatedOptions = existingFilter.options.filter(o => o !== option);
        if (updatedOptions.length === 0) {
          setSelectedFilters(selectedFilters.filter(f => f.id !== filterId));
        } else {
          setSelectedFilters(selectedFilters.map(f => 
            f.id === filterId ? { ...f, options: updatedOptions } : f
          ));
        }
      } else {
        setSelectedFilters(selectedFilters.map(f =>
          f.id === filterId ? { ...f, options: [...f.options, option] } : f
        ));
      }
    } else {
      setSelectedFilters([...selectedFilters, { id: filterId, options: [option] }]);
    }
  };

  const generateReport = () => {
    console.log('Generating report:', {
      name: reportName,
      dateRange,
      metrics: selectedMetrics,
      filters: selectedFilters
    });
    alert('Report generated successfully!');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Custom Report Builder</h1>
          <p className="text-gray-600 mt-1">Create personalized reports with your preferred metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Settings size={18} className="text-gray-600" />
            <span>Load Template</span>
          </button>
          <button 
            onClick={generateReport}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <FileText size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input
                  type="text"
                  placeholder="Enter report name..."
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  onClick={() => toggleMetric(metric)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition ${
                    selectedMetrics.includes(metric.id)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                  }`}
                >
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                  {selectedMetrics.includes(metric.id) && (
                    <CheckCircle size={14} className="ml-auto text-purple-600" />
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
                    {filter.options.map((option) => {
                      const isSelected = selectedFilters.find(f => 
                        f.id === filter.id && f.options.includes(option)
                      );
                      return (
                        <button
                          key={option}
                          onClick={() => toggleFilter(filter.id, option)}
                          className={`px-3 py-1 rounded-full text-sm transition ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
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
                      <span key={metricId} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {metric.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {selectedFilters.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Active Filters ({selectedFilters.length})</p>
                <div className="space-y-2 mt-2">
                  {selectedFilters.map(filter => (
                    <div key={filter.id} className="text-sm">
                      <span className="font-medium text-gray-700">{filter.id}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {filter.options.map(opt => (
                          <span key={opt} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!reportName && !dateRange.start && selectedMetrics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Configure your report to see preview</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Save Template
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Monthly Overview</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Total Cases, Resolution Rate, Offense Breakdown</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">High Severity Report</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500">High Severity Cases, Trends, Demographics</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Student Performance</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Repeat Offenders, Intervention Outcomes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReportsCustom;