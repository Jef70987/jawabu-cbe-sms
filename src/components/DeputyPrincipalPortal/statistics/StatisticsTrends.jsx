import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, Download,
  BarChart3, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown, Filter
} from 'lucide-react';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer, ComposedChart, Bar
} from 'recharts';

const StatisticsTrends = () => {
  const [trendType, setTrendType] = useState('cases');
  const [timeRange, setTimeRange] = useState('6months');

  const caseTrends = [
    { month: 'Jan', cases: 142, resolved: 118, pending: 24, high: 12 },
    { month: 'Feb', cases: 156, resolved: 132, pending: 24, high: 14 },
    { month: 'Mar', cases: 160, resolved: 139, pending: 21, high: 16 },
    { month: 'Apr', cases: 148, resolved: 132, pending: 16, high: 13 },
    { month: 'May', cases: 172, resolved: 155, pending: 17, high: 18 },
    { month: 'Jun', cases: 168, resolved: 152, pending: 16, high: 15 }
  ];

  const offenseTrends = [
    { month: 'Jan', bullying: 32, truancy: 28, disruption: 22, academic: 18 },
    { month: 'Feb', bullying: 35, truancy: 26, disruption: 24, academic: 19 },
    { month: 'Mar', bullying: 38, truancy: 25, disruption: 25, academic: 17 },
    { month: 'Apr', bullying: 36, truancy: 24, disruption: 23, academic: 18 },
    { month: 'May', bullying: 42, truancy: 22, disruption: 28, academic: 20 },
    { month: 'Jun', bullying: 45, truancy: 21, disruption: 30, academic: 19 }
  ];

  const severityTrends = [
    { month: 'Jan', high: 12, medium: 45, low: 85 },
    { month: 'Feb', high: 14, medium: 48, low: 94 },
    { month: 'Mar', high: 16, medium: 50, low: 94 },
    { month: 'Apr', high: 13, medium: 47, low: 88 },
    { month: 'May', high: 18, medium: 52, low: 102 },
    { month: 'Jun', high: 15, medium: 49, low: 104 }
  ];

  const resolutionTrends = [
    { month: 'Jan', avgDays: 5.2, resolved: 118, satisfaction: 86 },
    { month: 'Feb', avgDays: 5.0, resolved: 132, satisfaction: 87 },
    { month: 'Mar', avgDays: 4.8, resolved: 139, satisfaction: 88 },
    { month: 'Apr', avgDays: 4.9, resolved: 132, satisfaction: 88 },
    { month: 'May', avgDays: 4.7, resolved: 155, satisfaction: 89 },
    { month: 'Jun', avgDays: 4.6, resolved: 152, satisfaction: 90 }
  ];

  const getTrendDirection = (data, key) => {
    if (data.length < 2) return 'stable';
    const first = data[0][key];
    const last = data[data.length - 1][key];
    if (last > first) return 'up';
    if (last < first) return 'down';
    return 'stable';
  };

  const caseTrend = getTrendDirection(caseTrends, 'cases');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Trend Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze patterns and trends over time</p>
        </div>

        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>

          <button className="px-4 py-2 bg-white border rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Indicator Card */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600">Case Trend</p>
        <div className="flex items-center mt-2">
          <span className="text-2xl font-bold">
            {caseTrend === 'up' ? 'Increasing' : 'Decreasing'}
          </span>
          {caseTrend === 'up' && <TrendingUp className="ml-2 text-red-500" />}
          {caseTrend === 'down' && <TrendingDown className="ml-2 text-green-500" />}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caseTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="cases" stroke="#EF4444" />
            <Line dataKey="resolved" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default StatisticsTrends;