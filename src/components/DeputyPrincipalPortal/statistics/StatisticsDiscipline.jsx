import React, { useState } from 'react';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Download,
  Calendar, Filter, Eye, FileText, Users
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const StatisticsDiscipline = () => {
  const [timeframe, setTimeframe] = useState('year');

  const disciplineStats = {
    totalCases: 1456,
    activeCases: 89,
    resolvedCases: 1289,
    highSeverity: 128,
    mediumSeverity: 456,
    lowSeverity: 872,
    resolutionRate: 88.5,
    avgResolutionTime: 5.2,
    repeatOffenders: 156
  };

  const monthlyCases = [
    { month: 'Jan', cases: 142, resolved: 118, high: 12 },
    { month: 'Feb', cases: 156, resolved: 132, high: 14 },
    { month: 'Mar', cases: 160, resolved: 139, high: 16 },
    { month: 'Apr', cases: 148, resolved: 132, high: 13 },
    { month: 'May', cases: 172, resolved: 155, high: 18 },
    { month: 'Jun', cases: 168, resolved: 152, high: 15 },
    { month: 'Jul', cases: 98, resolved: 91, high: 8 },
    { month: 'Aug', cases: 85, resolved: 79, high: 6 },
    { month: 'Sep', cases: 145, resolved: 128, high: 12 },
    { month: 'Oct', cases: 152, resolved: 135, high: 14 },
    { month: 'Nov', cases: 158, resolved: 141, high: 15 },
    { month: 'Dec', cases: 172, resolved: 155, high: 17 }
  ];

  const offenseDistribution = [
    { name: 'Bullying', value: 385, percentage: 26.4, trend: '+8%', color: '#EF4444' },
    { name: 'Truancy', value: 312, percentage: 21.4, trend: '-3%', color: '#F59E0B' },
    { name: 'Disruption', value: 278, percentage: 19.1, trend: '+5%', color: '#3B82F6' },
    { name: 'Academic Dishonesty', value: 245, percentage: 16.8, trend: '-2%', color: '#8B5CF6' },
    { name: 'Uniform Violation', value: 236, percentage: 16.2, trend: '-12%', color: '#10B981' }
  ];

  const severityDistribution = [
    { name: 'High', value: 128, color: '#EF4444' },
    { name: 'Medium', value: 456, color: '#F59E0B' },
    { name: 'Low', value: 872, color: '#10B981' }
  ];

  const resolutionTimeData = [
    { range: '< 2 days', count: 245, percentage: 19 },
    { range: '2-5 days', count: 586, percentage: 45.5 },
    { range: '5-10 days', count: 312, percentage: 24.2 },
    { range: '> 10 days', count: 146, percentage: 11.3 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Statistics</h1>
          <p className="text-gray-600 mt-1">Comprehensive disciplinary metrics and analytics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">↑ 3.3% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{disciplineStats.resolutionRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 1.5% improvement</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Severity</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{disciplineStats.highSeverity}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">8.8% of total cases</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Repeat Offenders</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{disciplineStats.repeatOffenders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 8% from last year</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Case Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Case Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyCases}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="cases" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Offense Distribution Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Offense Distribution</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offenseDistribution.map((offense, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: offense.color }}></div>
                      <span className="font-medium text-gray-800">{offense.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{offense.value}</td>
                  <td className="px-6 py-4 text-gray-600">{offense.percentage}%</td>
                  <td className="px-6 py-4">
                    <span className={offense.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}>
                      {offense.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Time Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resolution Time Analysis</h2>
          <div className="space-y-4">
            {resolutionTimeData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.range}</span>
                  <span className="font-medium text-gray-800">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Average Resolution Time: <span className="font-semibold text-purple-600">{disciplineStats.avgResolutionTime} days</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <TrendingUp size={16} className="text-green-600 mt-0.5" />
              <p className="text-sm text-gray-600">Resolution rate improved by 1.5% compared to last year</p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle size={16} className="text-red-600 mt-0.5" />
              <p className="text-sm text-gray-600">Bullying cases increased by 8% - requires attention</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5" />
              <p className="text-sm text-gray-600">Uniform violations decreased by 12% - positive trend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDiscipline;