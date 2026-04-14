import React, { useState } from 'react';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown,
  Download, Calendar, Filter, Users,
  AlertTriangle, CheckCircle, Clock, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

const DisciplineStatistics = () => {
  const [timeframe, setTimeframe] = useState('year');

  const monthlyTrends = [
    { month: 'Jan', cases: 28, resolved: 24, suspensions: 4, appeals: 2 },
    { month: 'Feb', cases: 32, resolved: 28, suspensions: 5, appeals: 3 },
    { month: 'Mar', cases: 35, resolved: 30, suspensions: 6, appeals: 4 },
    { month: 'Apr', cases: 30, resolved: 32, suspensions: 4, appeals: 2 },
    { month: 'May', cases: 38, resolved: 35, suspensions: 7, appeals: 5 },
    { month: 'Jun', cases: 42, resolved: 38, suspensions: 8, appeals: 4 }
  ];

  const offenseDistribution = [
    { name: 'Bullying', value: 45, color: '#EF4444' },
    { name: 'Truancy', value: 38, color: '#F59E0B' },
    { name: 'Disruption', value: 32, color: '#3B82F6' },
    { name: 'Academic Dishonesty', value: 18, color: '#8B5CF6' },
    { name: 'Uniform Violation', value: 15, color: '#10B981' },
    { name: 'Other', value: 8, color: '#6B7280' }
  ];

  const gradeDistribution = [
    { grade: 'Grade 9', cases: 28, rate: 4.5 },
    { grade: 'Grade 10', cases: 35, rate: 5.9 },
    { grade: 'Grade 11', cases: 42, rate: 7.2 },
    { grade: 'Grade 12', cases: 51, rate: 7.7 }
  ];

  const resolutionTimes = [
    { range: '< 2 days', count: 45, percentage: 29 },
    { range: '2-5 days', count: 68, percentage: 44 },
    { range: '5-10 days', count: 28, percentage: 18 },
    { range: '> 10 days', count: 15, percentage: 9 }
  ];

  const stats = {
    totalCases: 156,
    resolutionRate: 88.5,
    avgResolutionTime: '5.2 days',
    repeatOffenders: 23,
    appealsFiled: 18,
    appealsGranted: 12
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Statistics</h1>
          <p className="text-gray-600 mt-1">Comprehensive disciplinary analytics and insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Last 30 days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Statistics</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">↑ 8% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolutionRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 3% improvement</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.avgResolutionTime}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 0.8 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Repeat Offenders</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.repeatOffenders}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">↓ 8% from last year</p>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Case Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} name="New Cases" />
            <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
            <Line type="monotone" dataKey="suspensions" stroke="#F59E0B" strokeWidth={2} name="Suspensions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Offense Distribution & Grade Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Offense Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={offenseDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {offenseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cases by Grade Level</h2>
          <div className="space-y-4">
            {gradeDistribution.map((grade, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{grade.grade}</span>
                  <span className="text-gray-600">{grade.cases} cases ({grade.rate}% rate)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(grade.cases / 156) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resolution Time Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resolution Time Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {resolutionTimes.map((item, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">{item.range}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{item.percentage}%</p>
              <p className="text-xs text-gray-500">{item.count} cases</p>
            </div>
          ))}
        </div>
      </div>

      {/* Appeals Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Appeals Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Appeals Filed</span>
              <span className="font-semibold text-gray-800">{stats.appealsFiled}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appeals Granted</span>
              <span className="font-semibold text-green-600">{stats.appealsGranted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-blue-600">67%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <TrendingUp size={16} className="text-green-500 mt-0.5" />
              <span>Bullying cases increased by 15% in Q2</span>
            </li>
            <li className="flex items-start space-x-2">
              <TrendingDown size={16} className="text-green-500 mt-0.5" />
              <span>Truancy decreased by 12% after intervention</span>
            </li>
            <li className="flex items-start space-x-2">
              <Award size={16} className="text-blue-500 mt-0.5" />
              <span>Grade 12 shows highest case volume</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisciplineStatistics;