import React, { useState } from 'react';
import {
  Calendar, Download, Printer, Mail, FileText,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const CaseReportsWeekly = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weeklyData = {
    totalCases: 42,
    resolved: 35,
    pending: 7,
    highSeverity: 8,
    avgResolutionTime: '3.2 days',
    topOffense: 'Bullying',
    improvement: '+5%'
  };

  const dailyTrends = [
    { day: 'Mon', cases: 8, resolved: 6, pending: 2 },
    { day: 'Tue', cases: 7, resolved: 6, pending: 1 },
    { day: 'Wed', cases: 9, resolved: 7, pending: 2 },
    { day: 'Thu', cases: 6, resolved: 5, pending: 1 },
    { day: 'Fri', cases: 12, resolved: 11, pending: 1 }
  ];

  const offenseBreakdown = [
    { name: 'Bullying', count: 12, change: '+2' },
    { name: 'Truancy', count: 8, change: '-1' },
    { name: 'Disruption', count: 7, change: '+1' },
    { name: 'Academic Dishonesty', count: 6, change: '0' },
    { name: 'Uniform Violation', count: 5, change: '-2' },
    { name: 'Other', count: 4, change: '+1' }
  ];

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header .*/}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Weekly Case Summary</h1>
          <p className="text-gray-600 mt-1">Comprehensive weekly analysis of disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Printer size={18} className="text-gray-600" />
            <span>Print</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Download size={18} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Week Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">{getWeekRange()}</span>
            </div>
            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Week {Math.ceil((currentWeek - new Date(currentWeek.getFullYear(), 0, 1)) / 604800000)}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{weeklyData.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">{weeklyData.improvement} from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{weeklyData.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">83% resolution rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Severity</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{weeklyData.highSeverity}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">↓ 2 from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{weeklyData.avgResolutionTime}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 0.8 days improvement</p>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Case Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="cases" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Offense Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Offense Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offenseBreakdown.map((offense, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{offense.name}</td>
                  <td className="px-6 py-4 text-gray-600">{offense.count}</td>
                  <td className="px-6 py-4 text-gray-600">{offense.change}</td>
                  <td className="px-6 py-4">
                    {offense.change.startsWith('+') ? (
                      <TrendingUp size={16} className="text-red-500" />
                    ) : offense.change.startsWith('-') ? (
                      <TrendingDown size={16} className="text-green-500" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Positive Trends</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Friday saw highest resolution rate (92%)</li>
            <li>• Uniform violations decreased by 2 cases</li>
            <li>• Resolution time improved by 0.8 days</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Areas of Concern</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Bullying cases increased by 2</li>
            <li>• Wednesday had highest case volume</li>
            <li>• Afternoon incidents up 15%</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Increase monitoring on Wednesdays</li>
            <li>• Anti-bullying workshop recommended</li>
            <li>• Review afternoon supervision</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaseReportsWeekly;