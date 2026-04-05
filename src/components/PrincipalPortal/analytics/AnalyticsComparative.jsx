import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Download,
  Calendar, Users, GraduationCap, DollarSign,
  ArrowUp, ArrowDown, Eye, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const AnalyticsComparative = () => {
  const [compareWith, setCompareWith] = useState('lastYear');
  const [dataType, setDataType] = useState('academic');

  const academicComparison = {
    thisYear: {
      avgGrade: 87.5,
      passRate: 94.2,
      attendance: 95.1,
      satisfaction: 88.7,
      graduationRate: 96.5
    },
    lastYear: {
      avgGrade: 85.2,
      passRate: 92.5,
      attendance: 93.8,
      satisfaction: 86.2,
      graduationRate: 95.8
    }
  };

  const enrollmentComparison = {
    thisYear: { students: 2450, newEnrollments: 510, transfers: 85, retention: 97.2 },
    lastYear: { students: 2420, newEnrollments: 490, transfers: 95, retention: 96.8 }
  };

  const financialComparison = {
    thisYear: { revenue: 4850, expenses: 3920, profit: 930, budgetUtilization: 78.5 },
    lastYear: { revenue: 4650, expenses: 3780, profit: 870, budgetUtilization: 76.2 }
  };

  const gradeComparison = [
    { grade: 'Grade 9', thisYear: 4.5, lastYear: 4.2, change: '+0.3' },
    { grade: 'Grade 10', thisYear: 5.9, lastYear: 5.5, change: '+0.4' },
    { grade: 'Grade 11', thisYear: 7.2, lastYear: 6.8, change: '+0.4' },
    { grade: 'Grade 12', thisYear: 7.7, lastYear: 7.5, change: '+0.2' }
  ];

  const subjectComparison = [
    { subject: 'Mathematics', thisYear: 87, lastYear: 84, change: '+3' },
    { subject: 'English', thisYear: 91, lastYear: 88, change: '+3' },
    { subject: 'Science', thisYear: 89, lastYear: 86, change: '+3' },
    { subject: 'History', thisYear: 86, lastYear: 84, change: '+2' },
    { subject: 'Arts', thisYear: 94, lastYear: 91, change: '+3' }
  ];

  const getCurrentData = () => {
    switch(dataType) {
      case 'academic': return academicComparison;
      case 'enrollment': return enrollmentComparison;
      case 'financial': return financialComparison;
      default: return academicComparison;
    }
  };

  const currentData = getCurrentData();
  const thisYearData = currentData.thisYear;
  const lastYearData = currentData.lastYear;
  const metrics = Object.keys(thisYearData);

  const getChangeColor = (current, previous) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (current, previous) => {
    if (current > previous) return <ArrowUp size={14} className="text-green-600" />;
    if (current < previous) return <ArrowDown size={14} className="text-red-600" />;
    return null;
  };

  const radarData = metrics.map(metric => ({
    metric: metric.replace(/([A-Z])/g, ' $1').trim(),
    thisYear: thisYearData[metric],
    lastYear: lastYearData[metric],
    fullMark: 100
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Comparative Analytics</h1>
          <p className="text-gray-600 mt-1">Compare current performance with historical data</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lastYear">Compare with Last Year</option>
            <option value="twoYears">Compare with Two Years Ago</option>
            <option value="target">Compare with Target</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Comparison</span>
          </button>
        </div>
      </div>

      {/* Data Type Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setDataType('academic')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
              dataType === 'academic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <GraduationCap size={18} />
            <span>Academic Metrics</span>
          </button>
          <button
            onClick={() => setDataType('enrollment')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
              dataType === 'enrollment' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={18} />
            <span>Enrollment Metrics</span>
          </button>
          <button
            onClick={() => setDataType('financial')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
              dataType === 'financial' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign size={18} />
            <span>Financial Metrics</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              {metric.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800">
                {typeof thisYearData[metric] === 'number' && metric.includes('Rate') 
                  ? `${thisYearData[metric]}%` 
                  : metric === 'revenue' || metric === 'expenses' || metric === 'profit'
                    ? `$${thisYearData[metric]}K`
                    : thisYearData[metric]}
              </span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(thisYearData[metric], lastYearData[metric])}
                <span className={`text-sm ${getChangeColor(thisYearData[metric], lastYearData[metric])}`}>
                  {((thisYearData[metric] - lastYearData[metric]) / lastYearData[metric] * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              vs Last Year: {typeof lastYearData[metric] === 'number' && metric.includes('Rate') 
                ? `${lastYearData[metric]}%` 
                : metric === 'revenue' || metric === 'expenses' || metric === 'profit'
                  ? `$${lastYearData[metric]}K`
                  : lastYearData[metric]}
            </p>
          </div>
        ))}
      </div>

      {/* Radar Chart Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Radar Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="This Year" dataKey="thisYear" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Radar name="Last Year" dataKey="lastYear" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Level Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Level Comparison (Case Rate %)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gradeComparison.map((grade, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{grade.grade}</td>
                  <td className="px-4 py-3 text-gray-600">{grade.thisYear}%</td>
                  <td className="px-4 py-3 text-gray-600">{grade.lastYear}%</td>
                  <td className="px-4 py-3">
                    <span className="text-green-600">{grade.change}%</span>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Subject Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="thisYear" fill="#3B82F6" name="This Year" />
            <Bar dataKey="lastYear" fill="#10B981" name="Last Year" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Comparative Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-2">
            <TrendingUp size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-600">Overall improvement of 5.2% across all metrics</p>
          </div>
          <div className="flex items-start space-x-2">
            <TrendingUp size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-600">Arts department shows highest growth (+3.3%)</p>
          </div>
          <div className="flex items-start space-x-2">
            <TrendingDown size={16} className="text-red-600 mt-0.5" />
            <p className="text-sm text-gray-600">Discipline cases increased in Grade 11-12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComparative;