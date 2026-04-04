import React, { useState } from 'react';
import {
  Calendar, Download, Printer, Mail, FileText,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, BarChart3, PieChart,
  Award, Target, Users
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const CaseReportsQuarterly = () => {
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);

  const quarterlyData = {
    totalCases: 458,
    resolved: 389,
    pending: 69,
    resolutionRate: '85%',
    highSeverity: 42,
    avgResolutionTime: '4.8 days',
    studentInvolvement: 312,
    staffReports: 146
  };

  const monthlyTrends = [
    { month: 'Jan', cases: 142, resolved: 118, suspensions: 12 },
    { month: 'Feb', cases: 156, resolved: 132, suspensions: 14 },
    { month: 'Mar', cases: 160, resolved: 139, suspensions: 16 }
  ];

  const comparativeData = [
    { metric: 'Total Cases', current: 458, previous: 412, change: '+11%' },
    { metric: 'Resolution Rate', current: 85, previous: 79, change: '+6%' },
    { metric: 'High Severity', current: 42, previous: 38, change: '+4%' },
    { metric: 'Avg Resolution Time', current: 4.8, previous: 5.4, change: '-11%' }
  ];

  const departmentRadar = [
    { subject: 'Grade 9', A: 85, B: 82, fullMark: 100 },
    { subject: 'Grade 10', A: 88, B: 84, fullMark: 100 },
    { subject: 'Grade 11', A: 82, B: 86, fullMark: 100 },
    { subject: 'Grade 12', A: 79, B: 81, fullMark: 100 }
  ];

  const quarters = [
    { id: 1, name: 'Q1', months: 'Jan - Mar' },
    { id: 2, name: 'Q2', months: 'Apr - Jun' },
    { id: 3, name: 'Q3', months: 'Jul - Sep' },
    { id: 4, name: 'Q4', months: 'Oct - Dec' }
  ];

  const changeQuarter = (direction) => {
    let newQuarter = selectedQuarter + direction;
    if (newQuarter > 4) {
      newQuarter = 1;
      setSelectedYear(selectedYear + 1);
    } else if (newQuarter < 1) {
      newQuarter = 4;
      setSelectedYear(selectedYear - 1);
    }
    setSelectedQuarter(newQuarter);
  };

  const currentQuarter = quarters.find(q => q.id === selectedQuarter);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header .*/}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quarterly Review Report</h1>
          <p className="text-gray-600 mt-1">Strategic analysis of disciplinary trends</p>
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

      {/* Quarter Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => changeQuarter(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">
                {currentQuarter?.name} {selectedYear} ({currentQuarter?.months})
              </span>
            </div>
            <button onClick={() => changeQuarter(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="text-sm text-green-600">
            <TrendingUp size={16} className="inline mr-1" />
            +8% improvement from last quarter
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{quarterlyData.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">↑ 11% from last quarter</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{quarterlyData.resolutionRate}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 6% improvement</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Students Involved</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{quarterlyData.studentInvolvement}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Unique students</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{quarterlyData.avgResolutionTime}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 0.6 days</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Comparison Radar */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Level Comparison</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={departmentRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="This Quarter" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Radar name="Last Quarter" dataKey="B" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Analysis Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Comparative Analysis</h2>
          <p className="text-sm text-gray-500">Q{selectedQuarter} {selectedYear} vs Q{selectedQuarter === 1 ? 4 : selectedQuarter - 1} {selectedQuarter === 1 ? selectedYear - 1 : selectedYear}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Quarter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous Quarter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparativeData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.metric}</td>
                  <td className="px-6 py-4 text-gray-600">{item.current}{item.metric.includes('Rate') ? '%' : ''}</td>
                  <td className="px-6 py-4 text-gray-600">{item.previous}{item.metric.includes('Rate') ? '%' : ''}</td>
                  <td className="px-6 py-4">
                    <span className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {item.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Award size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Strengthen Prevention</p>
              <p className="text-sm text-purple-100">Implement early intervention programs for Grade 11-12</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Target High-Risk Areas</p>
              <p className="text-sm text-purple-100">Focus on bullying prevention in Grade 10-11</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Enhance Resolution</p>
              <p className="text-sm text-purple-100">Goal: Reduce resolution time to 4 days by Q2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReportsQuarterly;