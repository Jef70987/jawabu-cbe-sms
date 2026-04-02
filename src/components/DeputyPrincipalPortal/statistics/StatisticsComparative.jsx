import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Download, Calendar,
  BarChart3, PieChart, Users, AlertTriangle,
  CheckCircle, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const StatisticsComparative = () => {
  const [compareWith, setCompareWith] = useState('lastYear');

  const comparativeData = {
    thisYear: {
      totalCases: 1456,
      resolutionRate: 88.5,
      highSeverity: 128,
      avgResolutionTime: 5.2,
      repeatOffenders: 156,
      studentInvolvement: 892
    },
    lastYear: {
      totalCases: 1410,
      resolutionRate: 87.0,
      highSeverity: 132,
      avgResolutionTime: 5.8,
      repeatOffenders: 169,
      studentInvolvement: 867
    },
    twoYearsAgo: {
      totalCases: 1380,
      resolutionRate: 86.0,
      highSeverity: 135,
      avgResolutionTime: 6.1,
      repeatOffenders: 178,
      studentInvolvement: 845
    }
  };

  const gradeComparison = [
    { grade: 'Grade 9', thisYear: 28, lastYear: 32, change: -4 },
    { grade: 'Grade 10', thisYear: 35, lastYear: 38, change: -3 },
    { grade: 'Grade 11', thisYear: 42, lastYear: 45, change: -3 },
    { grade: 'Grade 12', thisYear: 51, lastYear: 48, change: +3 }
  ];

  const monthlyComparison = [
    { month: 'Jan', thisYear: 142, lastYear: 138, change: '+4' },
    { month: 'Feb', thisYear: 156, lastYear: 145, change: '+11' },
    { month: 'Mar', thisYear: 160, lastYear: 152, change: '+8' },
    { month: 'Apr', thisYear: 148, lastYear: 149, change: '-1' },
    { month: 'May', thisYear: 172, lastYear: 165, change: '+7' },
    { month: 'Jun', thisYear: 168, lastYear: 158, change: '+10' }
  ];

  const offenseComparison = [
    { name: 'Bullying', thisYear: 385, lastYear: 356, change: '+8%' },
    { name: 'Truancy', thisYear: 312, lastYear: 322, change: '-3%' },
    { name: 'Disruption', thisYear: 278, lastYear: 265, change: '+5%' },
    { name: 'Academic Dishonesty', thisYear: 245, lastYear: 250, change: '-2%' },
    { name: 'Uniform Violation', thisYear: 236, lastYear: 268, change: '-12%' }
  ];

  const departmentRadar = [
    { subject: 'Grade 9', thisYear: 85, lastYear: 82, fullMark: 100 },
    { subject: 'Grade 10', thisYear: 88, lastYear: 84, fullMark: 100 },
    { subject: 'Grade 11', thisYear: 82, lastYear: 86, fullMark: 100 },
    { subject: 'Grade 12', thisYear: 79, lastYear: 81, fullMark: 100 }
  ];

  const getChangeColor = (change) => {
    if (typeof change === 'string') {
      return change.startsWith('+') ? 'text-red-600' : change.startsWith('-') ? 'text-green-600' : 'text-gray-600';
    }
    return change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (typeof change === 'string') {
      return change.startsWith('+') ? <ArrowUp size={14} /> : change.startsWith('-') ? <ArrowDown size={14} /> : null;
    }
    return change > 0 ? <ArrowUp size={14} /> : change < 0 ? <ArrowDown size={14} /> : null;
  };

  const currentData = compareWith === 'lastYear' ? comparativeData.lastYear : comparativeData.twoYearsAgo;
  const periodName = compareWith === 'lastYear' ? 'Last Year' : 'Two Years Ago';

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Comparative Analysis</h1>
          <p className="text-gray-600 mt-1">Compare current metrics with historical data</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="lastYear">Compare with Last Year</option>
            <option value="twoYearsAgo">Compare with Two Years Ago</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Comparison</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Cases</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-gray-800">{comparativeData.thisYear.totalCases}</span>
            <span className="text-sm text-gray-500">vs {periodName}: {currentData.totalCases}</span>
          </div>
          <div className={`flex items-center mt-2 ${getChangeColor(comparativeData.thisYear.totalCases - currentData.totalCases)}`}>
            {getChangeIcon(comparativeData.thisYear.totalCases - currentData.totalCases)}
            <span className="ml-1 text-sm font-medium">
              {((comparativeData.thisYear.totalCases - currentData.totalCases) / currentData.totalCases * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Resolution Rate</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-green-600">{comparativeData.thisYear.resolutionRate}%</span>
            <span className="text-sm text-gray-500">vs {periodName}: {currentData.resolutionRate}%</span>
          </div>
          <div className="flex items-center mt-2 text-green-600">
            <ArrowUp size={14} />
            <span className="ml-1 text-sm font-medium">
              +{(comparativeData.thisYear.resolutionRate - currentData.resolutionRate).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Resolution Time</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-purple-600">{comparativeData.thisYear.avgResolutionTime} days</span>
            <span className="text-sm text-gray-500">vs {periodName}: {currentData.avgResolutionTime} days</span>
          </div>
          <div className="flex items-center mt-2 text-green-600">
            <ArrowDown size={14} />
            <span className="ml-1 text-sm font-medium">
              -{(currentData.avgResolutionTime - comparativeData.thisYear.avgResolutionTime).toFixed(1)} days
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Case Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="thisYear" stroke="#EF4444" strokeWidth={2} name="This Year" />
            <Line type="monotone" dataKey="lastYear" stroke="#3B82F6" strokeWidth={2} name="Last Year" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Level Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Grade Level Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gradeComparison.map((grade, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{grade.grade}</td>
                  <td className="px-6 py-4 text-gray-600">{grade.thisYear}</td>
                  <td className="px-6 py-4 text-gray-600">{grade.lastYear}</td>
                  <td className="px-6 py-4">
                    <span className={getChangeColor(grade.change)}>
                      {grade.change > 0 ? `+${grade.change}` : grade.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offense Comparison & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Offense Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {offenseComparison.map((offense, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{offense.name}</td>
                    <td className="px-6 py-4 text-gray-600">{offense.thisYear}</td>
                    <td className="px-6 py-4 text-gray-600">{offense.lastYear}</td>
                    <td className="px-6 py-4">
                      <span className={getChangeColor(offense.change)}>
                        {offense.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Radar Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={departmentRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="This Year" dataKey="thisYear" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              <Radar name="Last Year" dataKey="lastYear" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Comparative Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-purple-100 text-sm">Overall Improvement</p>
            <p className="text-lg font-semibold">+1.5% resolution rate</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Areas of Concern</p>
            <p className="text-lg font-semibold">Bullying cases up 8%</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Positive Trends</p>
            <p className="text-lg font-semibold">Uniform violations down 12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsComparative;