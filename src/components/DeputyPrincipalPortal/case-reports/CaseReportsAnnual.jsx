import React, { useState } from 'react';
import {
  Calendar, Download, Printer, Mail, FileText,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Award, Users,
  BarChart3, PieChart, Target, Trophy
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';

const CaseReportsAnnual = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const annualData = {
    totalCases: 1456,
    resolved: 1289,
    resolutionRate: '88.5%',
    highSeverity: 128,
    avgResolutionTime: '5.1 days',
    studentsInvolved: 892,
    repeatOffenders: 156,
    mostCommonOffense: 'Bullying'
  };

  const monthlyTrends = [
    { month: 'Jan', cases: 142, resolved: 118, suspensions: 12 },
    { month: 'Feb', cases: 156, resolved: 132, suspensions: 14 },
    { month: 'Mar', cases: 160, resolved: 139, suspensions: 16 },
    { month: 'Apr', cases: 148, resolved: 132, suspensions: 13 },
    { month: 'May', cases: 172, resolved: 155, suspensions: 17 },
    { month: 'Jun', cases: 168, resolved: 152, suspensions: 15 },
    { month: 'Jul', cases: 98, resolved: 91, suspensions: 7 },
    { month: 'Aug', cases: 85, resolved: 79, suspensions: 6 },
    { month: 'Sep', cases: 145, resolved: 128, suspensions: 13 },
    { month: 'Oct', cases: 152, resolved: 135, suspensions: 14 },
    { month: 'Nov', vs: 158, resolved: 141, suspensions: 15 },
    { month: 'Dec', cases: 172, resolved: 155, suspensions: 16 }
  ];

  const yearOverYear = [
    { year: 2020, cases: 1250, resolved: 1050, rate: 84 },
    { year: 2021, cases: 1320, resolved: 1120, rate: 85 },
    { year: 2022, cases: 1380, resolved: 1185, rate: 86 },
    { year: 2023, cases: 1410, resolved: 1225, rate: 87 },
    { year: 2024, cases: 1456, resolved: 1289, rate: 88.5 }
  ];

  const topOffenses = [
    { name: 'Bullying', count: 385, trend: '+8%' },
    { name: 'Truancy', count: 312, trend: '-3%' },
    { name: 'Disruption', count: 278, trend: '+5%' },
    { name: 'Academic Dishonesty', count: 245, trend: '-2%' },
    { name: 'Uniform Violation', count: 236, trend: '-12%' }
  ];

  const changeYear = (direction) => {
    setSelectedYear(selectedYear + direction);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Annual Report {selectedYear}</h1>
          <p className="text-gray-600 mt-1">Comprehensive yearly disciplinary analysis</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Printer size={18} className="text-gray-600" />
            <span>Print</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Download size={18} />
            <span>Download Full Report</span>
          </button>
        </div>
      </div>

      {/* Year Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => changeYear(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">Academic Year {selectedYear}</span>
            </div>
            <button onClick={() => changeYear(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="text-sm text-green-600">
            <Trophy size={16} className="inline mr-1" />
            Best resolution rate in 5 years
          </div>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{annualData.totalCases}</p>
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
              <p className="text-3xl font-bold text-green-600 mt-2">{annualData.resolutionRate}</p>
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
              <p className="text-sm text-gray-600 font-medium">Students Involved</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{annualData.studentsInvolved}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">61% of total cases</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Repeat Offenders</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{annualData.repeatOffenders}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 8% from last year</p>
        </div>
      </div>

      {/* Year-over-Year Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">5-Year Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={yearOverYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="cases" fill="#EF4444" />
            <Bar yAxisId="left" dataKey="resolved" fill="#10B981" />
            <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Top Offenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Top Offenses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topOffenses.map((offense, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{offense.name}</td>
                  <td className="px-6 py-4 text-gray-600">{offense.count}</td>
                  <td className="px-6 py-4">
                    <span className={offense.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}>
                      {offense.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {((offense.count / annualData.totalCases) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Executive Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold mb-2">Key Achievements</p>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Highest resolution rate in 5 years (88.5%)</li>
              <li>• 8% decrease in repeat offenders</li>
              <li>• Improved resolution time by 0.8 days</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Areas for Improvement</p>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Bullying cases increased by 8%</li>
              <li>• Peak months: May, December</li>
              <li>• Grade 12 shows highest case volume</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-400">
          <p className="text-sm">Recommendation: Implement comprehensive anti-bullying program and increase monitoring during peak months.</p>
        </div>
      </div>
    </div>
  );
};

export default CaseReportsAnnual;