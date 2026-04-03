import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, Download,
  BarChart3, LineChart as LineChartIcon, PieChart, Activity,
  Users, GraduationCap, DollarSign, Award,
  Eye, Filter, ChevronDown
} from 'lucide-react';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, ZAxis
} from 'recharts';

const AnalyticsTrends = () => {
  const [timeframe, setTimeframe] = useState('year');
  const [metricType, setMetricType] = useState('academic');

  const academicTrends = [
    { month: 'Jan', avgGrade: 82, attendance: 92, submissions: 88, satisfaction: 86 },
    { month: 'Feb', avgGrade: 84, attendance: 93, submissions: 90, satisfaction: 87 },
    { month: 'Mar', avgGrade: 86, attendance: 94, submissions: 92, satisfaction: 88 },
    { month: 'Apr', avgGrade: 85, attendance: 93, submissions: 91, satisfaction: 88 },
    { month: 'May', avgGrade: 87, attendance: 95, submissions: 93, satisfaction: 89 },
    { month: 'Jun', avgGrade: 89, attendance: 96, submissions: 95, satisfaction: 90 }
  ];

  const enrollmentTrends = [
    { year: '2020', students: 2100, newEnrollments: 450, transfers: 120 },
    { year: '2021', students: 2250, newEnrollments: 480, transfers: 110 },
    { year: '2022', students: 2350, newEnrollments: 520, transfers: 105 },
    { year: '2023', students: 2420, newEnrollments: 490, transfers: 95 },
    { year: '2024', students: 2450, newEnrollments: 510, transfers: 85 }
  ];

  const financialTrends = [
    { month: 'Jan', revenue: 850, expenses: 720, profit: 130, budget: 900 },
    { month: 'Feb', revenue: 860, expenses: 730, profit: 130, budget: 910 },
    { month: 'Mar', revenue: 855, expenses: 740, profit: 115, budget: 905 },
    { month: 'Apr', revenue: 870, expenses: 750, profit: 120, budget: 920 },
    { month: 'May', revenue: 865, expenses: 760, profit: 105, budget: 915 },
    { month: 'Jun', revenue: 890, expenses: 780, profit: 110, budget: 930 }
  ];

  const disciplineTrends = [
    { month: 'Jan', cases: 28, resolved: 24, suspensions: 4, appeals: 2 },
    { month: 'Feb', cases: 32, resolved: 28, suspensions: 5, appeals: 3 },
    { month: 'Mar', cases: 35, resolved: 30, suspensions: 6, appeals: 4 },
    { month: 'Apr', cases: 30, resolved: 32, suspensions: 4, appeals: 2 },
    { month: 'May', cases: 38, resolved: 35, suspensions: 7, appeals: 5 },
    { month: 'Jun', cases: 42, resolved: 38, suspensions: 8, appeals: 4 }
  ];

  const getMetricData = () => {
    switch(metricType) {
      case 'academic': return academicTrends;
      case 'enrollment': return enrollmentTrends;
      case 'financial': return financialTrends;
      case 'discipline': return disciplineTrends;
      default: return academicTrends;
    }
  };

  const getMetricKeys = () => {
    switch(metricType) {
      case 'academic': return ['avgGrade', 'attendance', 'submissions'];
      case 'enrollment': return ['students', 'newEnrollments', 'transfers'];
      case 'financial': return ['revenue', 'expenses', 'profit'];
      case 'discipline': return ['cases', 'resolved', 'suspensions'];
      default: return ['avgGrade', 'attendance', 'submissions'];
    }
  };

  const getMetricColors = () => {
    switch(metricType) {
      case 'academic': return ['#3B82F6', '#10B981', '#F59E0B'];
      case 'enrollment': return ['#8B5CF6', '#EC4899', '#06B6D4'];
      case 'financial': return ['#10B981', '#EF4444', '#F59E0B'];
      case 'discipline': return ['#EF4444', '#10B981', '#F59E0B'];
      default: return ['#3B82F6', '#10B981', '#F59E0B'];
    }
  };

  const data = getMetricData();
  const keys = getMetricKeys();
  const colors = getMetricColors();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Performance Trends</h1>
          <p className="text-gray-600 mt-1">Analyze historical data and identify patterns</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg"
          >
            <option value="month">Last 30 days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-white border rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={metricType === 'enrollment' ? 'year' : 'month'} />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsTrends;