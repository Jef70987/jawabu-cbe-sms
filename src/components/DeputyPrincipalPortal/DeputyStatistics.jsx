import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, PieChart,
  Calendar, Download, Filter, Search, Users,
  AlertTriangle, CheckCircle, Clock, UserX,
  Award, Target, Activity, Eye, MoreVertical
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const DeputyStatistics = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [statType, setStatType] = useState('overview');

  // Main Statistics Data
  const stats = {
    totalCases: 156,
    activeCases: 42,
    resolvedCases: 98,
    pendingReview: 16,
    avgResolutionTime: '5.2 days',
    repeatOffenders: 23,
    suspensionRate: '12%',
    counselingReferrals: 45
  };

  // Monthly Trends Data
  const monthlyTrends = [
    { month: 'Jan', cases: 28, resolved: 24, suspensions: 4, referrals: 12 },
    { month: 'Feb', cases: 32, resolved: 28, suspensions: 5, referrals: 15 },
    { month: 'Mar', cases: 35, resolved: 30, suspensions: 6, referrals: 18 },
    { month: 'Apr', cases: 30, resolved: 32, suspensions: 4, referrals: 14 },
    { month: 'May', cases: 38, resolved: 35, suspensions: 7, referrals: 20 },
    { month: 'Jun', cases: 42, resolved: 38, suspensions: 8, referrals: 22 },
  ];

  // Grade Level Distribution
  const gradeDistribution = [
    { grade: 'Grade 9', cases: 28, population: 450, rate: '6.2%' },
    { grade: 'Grade 10', cases: 35, population: 420, rate: '8.3%' },
    { grade: 'Grade 11', cases: 42, population: 400, rate: '10.5%' },
    { grade: 'Grade 12', cases: 51, population: 380, rate: '13.4%' },
  ];

  // Offense Categories with detailed stats
  const offenseStats = [
    { category: 'Bullying', count: 45, percentage: 28.8, trend: '+5%', severity: 'High', color: '#EF4444' },
    { category: 'Truancy', count: 38, percentage: 24.4, trend: '-2%', severity: 'Medium', color: '#F59E0B' },
    { category: 'Disruption', count: 32, percentage: 20.5, trend: '+3%', severity: 'Medium', color: '#3B82F6' },
    { category: 'Academic Dishonesty', count: 18, percentage: 11.5, trend: '-1%', severity: 'High', color: '#8B5CF6' },
    { category: 'Uniform Violation', count: 15, percentage: 9.6, trend: '-5%', severity: 'Low', color: '#10B981' },
    { category: 'Other', count: 8, percentage: 5.2, trend: '0%', severity: 'Low', color: '#6B7280' },
  ];

  // Severity Distribution
  const severityDistribution = [
    { name: 'High', value: 28, color: '#EF4444' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Low', value: 83, color: '#10B981' },
  ];

  // Resolution Time Analysis
  const resolutionTimeData = [
    { name: '< 2 days', value: 25 },
    { name: '2-5 days', value: 45 },
    { name: '5-10 days', value: 20 },
    { name: '> 10 days', value: 10 },
  ];

  // Day of Week Analysis
  const dayOfWeekData = [
    { day: 'Monday', incidents: 28 },
    { day: 'Tuesday', incidents: 32 },
    { day: 'Wednesday', incidents: 35 },
    { day: 'Thursday', incidents: 30 },
    { day: 'Friday', incidents: 42 },
  ];

  // Time of Day Analysis
  const timeOfDayData = [
    { time: 'Morning (8-12)', incidents: 45 },
    { time: 'Lunch (12-1)', incidents: 38 },
    { time: 'Afternoon (1-3)', incidents: 42 },
    { time: 'Late (3-5)', incidents: 31 },
  ];

  // Gender Distribution
  const genderDistribution = [
    { name: 'Male', value: 98, color: '#3B82F6' },
    { name: 'Female', value: 58, color: '#EC4899' },
  ];

  // Recidivism Rates
  const recidivismData = [
    { name: 'First Offense', value: 68 },
    { name: 'Second Offense', value: 22 },
    { name: 'Multiple Offenses', value: 10 },
  ];

  // Comparative Analysis with Previous Period
  const comparativeData = [
    { metric: 'Total Cases', current: 156, previous: 142, change: '+9.9%' },
    { metric: 'Resolution Rate', current: '78%', previous: '72%', change: '+6%' },
    { metric: 'Avg Resolution Time', current: '5.2 days', previous: '6.1 days', change: '-15%' },
    { metric: 'Suspension Rate', current: '12%', previous: '14%', change: '-14%' },
    { metric: 'Repeat Offenders', current: 23, previous: 28, change: '-18%' },
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#6B7280'];

  const statTabs = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={16} /> },
    { id: 'trends', name: 'Trends', icon: <TrendingUp size={16} /> },
    { id: 'distribution', name: 'Distribution', icon: <BarChart3 size={16} /> },
    { id: 'comparative', name: 'Comparative', icon: <Activity size={16} /> },
    { id: 'predictive', name: 'Predictive', icon: <Target size={16} /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Statistics & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of discipline and student affairs data</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">This year</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last period</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-orange-600">{stats.activeCases}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">27% of total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">78%</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 6% improvement</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↓ 0.9 days improvement</p>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Repeat Offenders</p>
          <p className="text-lg font-semibold text-gray-800">{stats.repeatOffenders}</p>
          <p className="text-xs text-red-500">↑ 2 from last month</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Suspension Rate</p>
          <p className="text-lg font-semibold text-gray-800">{stats.suspensionRate}</p>
          <p className="text-xs text-green-500">↓ 2% decrease</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Counseling Referrals</p>
          <p className="text-lg font-semibold text-gray-800">{stats.counselingReferrals}</p>
          <p className="text-xs text-green-500">↑ 15% increase</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Pending Review</p>
          <p className="text-lg font-semibold text-gray-800">{stats.pendingReview}</p>
          <p className="text-xs text-orange-500">Needs attention</p>
        </div>
      </div>

      {/* Statistics Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {statTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatType(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  statType === tab.id
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
          {/* Overview Tab */}
          {statType === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Severity Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Cases by Severity</h3>
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

                {/* Resolution Time Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Resolution Time Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={resolutionTimeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resolutionTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gender Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Gender Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={genderDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                {/* Recidivism */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Recidivism Rates</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={recidivismData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {statType === 'trends' && (
            <div className="space-y-6">
              {/* Monthly Trends Line Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">6-Month Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="suspensions" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Day and Time Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Incidents by Day of Week</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dayOfWeekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="incidents" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Incidents by Time of Day</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={timeOfDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="incidents" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {statType === 'distribution' && (
            <div className="space-y-6">
              {/* Offense Categories */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Offense Categories Distribution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {offenseStats.map((stat, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                              <span className="text-sm font-medium text-gray-800">{stat.category}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{stat.count}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{stat.percentage}%</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${stat.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                              {stat.trend}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              stat.severity === 'High' ? 'bg-red-100 text-red-800' :
                              stat.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {stat.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grade Level Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Grade Level Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {gradeDistribution.map((grade, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{grade.grade}</p>
                      <p className="text-2xl font-bold text-gray-800">{grade.cases}</p>
                      <p className="text-xs text-gray-500">Population: {grade.population}</p>
                      <p className="text-xs text-purple-600">Rate: {grade.rate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comparative Tab */}
          {statType === 'comparative' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Period-over-Period Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Period</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous Period</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {comparativeData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.metric}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.current}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.previous}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {item.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Improvement Areas</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-green-600">• Resolution rate up 6%</li>
                    <li className="text-xs text-green-600">• Suspension rate down 14%</li>
                    <li className="text-xs text-green-600">• Repeat offenders down 18%</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-700">Watch Areas</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-yellow-600">• Grade 12 cases increasing</li>
                    <li className="text-xs text-yellow-600">• Friday incidents up 15%</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">Needs Attention</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-red-600">• Bullying cases +5%</li>
                    <li className="text-xs text-red-600">• High severity cases</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Predictive Tab */}
          {statType === 'predictive' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forecast Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">30-Day Forecast</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={[
                      { day: 'Week 1', predicted: 38, upper: 45, lower: 31 },
                      { day: 'Week 2', predicted: 42, upper: 50, lower: 34 },
                      { day: 'Week 3', predicted: 40, upper: 48, lower: 32 },
                      { day: 'Week 4', predicted: 45, upper: 53, lower: 37 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="upper" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} />
                      <Area type="monotone" dataKey="lower" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Indicators */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Risk Indicators</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">High Risk Students</span>
                        <span className="font-medium text-gray-800">24</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Medium Risk Students</span>
                        <span className="font-medium text-gray-800">45</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Low Risk Students</span>
                        <span className="font-medium text-gray-800">92</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Predicted Outcomes</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <TrendingUp size={14} className="text-red-500 mr-2" />
                        Expected 15% increase in cases next month
                      </li>
                      <li className="flex items-center">
                        <TrendingDown size={14} className="text-green-500 mr-2" />
                        Suspension rate predicted to decrease by 5%
                      </li>
                      <li className="flex items-center">
                        <Target size={14} className="text-blue-500 mr-2" />
                        High probability of repeat offenses in Grade 11
                      </li>
                    </ul>
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

export default DeputyStatistics;