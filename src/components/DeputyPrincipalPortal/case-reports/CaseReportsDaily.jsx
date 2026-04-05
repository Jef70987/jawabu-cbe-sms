import React, { useState } from 'react';
import {
  Calendar, Download, Printer, Mail, FileText,
  Eye, ChevronLeft, ChevronRight, Search,
  Filter, BarChart3, PieChart, TrendingUp,
  AlertTriangle, CheckCircle, Clock, Users
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const CaseReportsDaily = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Daily Case Data
  const dailyData = {
    date: '2024-04-02',
    totalCases: 8,
    newCases: 5,
    resolved: 3,
    pending: 5,
    highSeverity: 2,
    mediumSeverity: 3,
    lowSeverity: 3
  };

  // Cases by Type
  const casesByType = [
    { name: 'Bullying', value: 2, color: '#EF4444' },
    { name: 'Truancy', value: 1, color: '#F59E0B' },
    { name: 'Disruption', value: 2, color: '#3B82F6' },
    { name: 'Academic Dishonesty', value: 1, color: '#8B5CF6' },
    { name: 'Uniform Violation', value: 1, color: '#10B981' },
    { name: 'Other', value: 1, color: '#6B7280' }
  ];

  // Hourly Distribution
  const hourlyData = [
    { hour: '8-9', cases: 1 },
    { hour: '9-10', cases: 2 },
    { hour: '10-11', cases: 1 },
    { hour: '11-12', cases: 1 },
    { hour: '12-1', cases: 1 },
    { hour: '1-2', cases: 1 },
    { hour: '2-3', cases: 1 },
    { hour: '3-4', cases: 0 }
  ];

  // Recent Cases
  const recentCases = [
    { id: 'DC001', student: 'James Wilson', grade: '11A', offense: 'Physical Altercation', time: '10:30 AM', status: 'Under Investigation' },
    { id: 'DC002', student: 'Sarah Chen', grade: '10B', offense: 'Truancy', time: '9:15 AM', status: 'Pending Review' },
    { id: 'DC003', student: 'Michael Brown', grade: '12C', offense: 'Academic Dishonesty', time: '11:45 AM', status: 'Hearing Scheduled' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Investigation': return 'bg-red-100 text-red-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Hearing Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daily Case Report</h1>
          <p className="text-gray-600 mt-1">Detailed report of daily disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Printer size={18} className="text-gray-600" />
            <span>Print</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Mail size={18} className="text-gray-600" />
            <span>Email</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-purple-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Report Generated:</span>
            <span className="text-sm font-medium text-gray-800">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{dailyData.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">New: {dailyData.newCases} | Resolved: {dailyData.resolved}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Severity</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dailyData.highSeverity}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Requires immediate attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolved Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {((dailyData.resolved / dailyData.totalCases) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{dailyData.resolved} cases resolved today</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Cases</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{dailyData.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Awaiting resolution</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Type */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cases by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={casesByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {casesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hourly Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cases" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Recent Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{case_.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{case_.student}</p>
                      <p className="text-xs text-gray-500">Grade {case_.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{case_.offense}</td>
                  <td className="px-6 py-4 text-gray-600">{case_.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-2">
            <TrendingUp size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-600">Peak incident time: 9:00 AM - 10:00 AM</p>
          </div>
          <div className="flex items-start space-x-2">
            <AlertTriangle size={16} className="text-red-600 mt-0.5" />
            <p className="text-sm text-gray-600">Most common: Bullying (2 cases)</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-600">Resolution rate: 37.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReportsDaily;