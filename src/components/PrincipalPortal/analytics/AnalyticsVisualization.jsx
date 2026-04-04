import React, { useState } from 'react';
import {
  BarChart3, LineChart, PieChart, Activity,
  Download, Eye, Filter, Maximize2,
  TrendingUp, Users, DollarSign, GraduationCap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart as ReLineChart, Line, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart
} from 'recharts';

const AnalyticsVisualization = () => {
  const [chartType, setChartType] = useState('line');
  const [dataSet, setDataSet] = useState('academic');

  const academicData = [
    { month: 'Jan', score: 82, target: 85, attendance: 92 },
    { month: 'Feb', score: 84, target: 85, attendance: 93 },
    { month: 'Mar', score: 86, target: 86, attendance: 94 },
    { month: 'Apr', score: 85, target: 86, attendance: 93 },
    { month: 'May', score: 87, target: 87, attendance: 95 },
    { month: 'Jun', score: 89, target: 88, attendance: 96 }
  ];

  const enrollmentData = [
    { grade: 'Grade 9', students: 620, percentage: 25.3 },
    { grade: 'Grade 10', students: 590, percentage: 24.1 },
    { grade: 'Grade 11', students: 580, percentage: 23.7 },
    { grade: 'Grade 12', students: 660, percentage: 26.9 }
  ];

  const financialData = [
    { category: 'Salaries', amount: 1200, color: '#3B82F6' },
    { category: 'Facilities', amount: 850, color: '#10B981' },
    { category: 'Equipment', amount: 580, color: '#F59E0B' },
    { category: 'Utilities', amount: 350, color: '#EF4444' },
    { category: 'Activities', amount: 290, color: '#8B5CF6' }
  ];

  const radarData = [
    { subject: 'Mathematics', score: 87, avg: 85, fullMark: 100 },
    { subject: 'Science', score: 89, avg: 86, fullMark: 100 },
    { subject: 'English', score: 91, avg: 87, fullMark: 100 },
    { subject: 'History', score: 86, avg: 84, fullMark: 100 },
    { subject: 'Arts', score: 94, avg: 88, fullMark: 100 }
  ];

  const getChartTitle = () => {
    switch(dataSet) {
      case 'academic': return 'Academic Performance Trends';
      case 'enrollment': return 'Enrollment by Grade';
      case 'financial': return 'Expense Distribution';
      case 'radar': return 'Subject Performance Radar';
      default: return 'Data Visualization';
    }
  };

  const getChartData = () => {
    switch(dataSet) {
      case 'academic': return academicData;
      case 'enrollment': return enrollmentData;
      case 'financial': return financialData;
      case 'radar': return radarData;
      default: return academicData;
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Visualization</h1>
          <p className="text-gray-600 mt-1">Interactive dashboards and visual analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Dashboard</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Maximize2 size={18} className="text-gray-600" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                chartType === 'line' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <LineChart size={16} />
              <span>Line</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                chartType === 'bar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <BarChart3 size={16} />
              <span>Bar</span>
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                chartType === 'pie' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <PieChart size={16} />
              <span>Pie</span>
            </button>
            <button
              onClick={() => setChartType('radar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                chartType === 'radar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Activity size={16} />
              <span>Radar</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={dataSet}
              onChange={(e) => setDataSet(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="academic">Academic Performance</option>
              <option value="enrollment">Enrollment Distribution</option>
              <option value="financial">Financial Breakdown</option>
              <option value="radar">Subject Comparison</option>
            </select>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{getChartTitle()}</h2>
        
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' && dataSet === 'academic' && (
            <ReLineChart data={academicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Score" />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} name="Target" />
              <Line type="monotone" dataKey="attendance" stroke="#F59E0B" strokeWidth={2} name="Attendance" />
            </ReLineChart>
          )}
          
          {chartType === 'line' && dataSet !== 'academic' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Line chart available for Academic Performance data only. Please select a different chart type or dataset.</p>
            </div>
          )}
          
          {chartType === 'bar' && dataSet === 'enrollment' && (
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3B82F6" name="Number of Students" />
            </BarChart>
          )}
          
          {chartType === 'bar' && dataSet !== 'enrollment' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Bar chart available for Enrollment Distribution data only. Please select a different chart type or dataset.</p>
            </div>
          )}
          
          {chartType === 'pie' && dataSet === 'financial' && (
            <RePieChart>
              <Pie
                data={financialData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="amount"
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          )}
          
          {chartType === 'pie' && dataSet !== 'financial' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Pie chart available for Financial Breakdown data only. Please select a different chart type or dataset.</p>
            </div>
          )}
          
          {chartType === 'radar' && dataSet === 'radar' && (
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="School Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Radar name="Average" dataKey="avg" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          )}
          
          {chartType === 'radar' && dataSet !== 'radar' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Radar chart available for Subject Comparison data only. Please select a different chart type or dataset.</p>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">87.5</p>
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-green-600">2,450</p>
            </div>
            <Users size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-purple-600">$5.2M</p>
            </div>
            <DollarSign size={20} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Graduation Rate</p>
              <p className="text-2xl font-bold text-orange-600">96.5%</p>
            </div>
            <GraduationCap size={20} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Visualization. Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Visualization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Line charts: Best for trends over time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Bar charts: Compare categories</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Pie charts: Show composition</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsVisualization;