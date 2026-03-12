import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart,
  Download, Calendar, Filter, Eye, MoreVertical,
  Users, GraduationCap, DollarSign, Award,
  Activity, Target, AlertTriangle, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, PieChart as RePieChart,
  Pie, Cell, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';

const PrincipalAnalytics = () => {
  const [timeframe, setTimeframe] = useState('year');
  const [dataType, setDataType] = useState('overview');

  // Performance Metrics
  const performanceMetrics = {
    academicScore: 87.5,
    attendanceRate: 94.2,
    graduationRate: 96.5,
    collegeAcceptance: 92.3,
    parentSatisfaction: 88.7,
    staffRetention: 91.2,
    budgetUtilization: 78.5,
    studentTeacherRatio: '13:1'
  };

  // Year-over-Year Comparison
  const yearlyComparison = [
    { year: '2020', enrollment: 2100, graduation: 1980, performance: 82 },
    { year: '2021', enrollment: 2250, graduation: 2120, performance: 84 },
    { year: '2022', enrollment: 2350, graduation: 2210, performance: 86 },
    { year: '2023', enrollment: 2420, graduation: 2310, performance: 88 },
    { year: '2024', enrollment: 2450, graduation: 2360, performance: 90 },
  ];

  // Department Performance Radar Data
  const departmentRadar = [
    { subject: 'Science', A: 92, B: 88, fullMark: 100 },
    { subject: 'Math', A: 89, B: 85, fullMark: 100 },
    { subject: 'English', A: 91, B: 87, fullMark: 100 },
    { subject: 'Arts', A: 94, B: 90, fullMark: 100 },
    { subject: 'Commerce', A: 87, B: 83, fullMark: 100 },
    { subject: 'Technology', A: 95, B: 91, fullMark: 100 },
  ];

  // Predictive Analytics
  const predictions = [
    { metric: 'Enrollment', current: 2450, predicted: 2600, confidence: 92 },
    { metric: 'Graduation Rate', current: 96.5, predicted: 97.2, confidence: 88 },
    { metric: 'Budget', current: '5.2M', predicted: '5.5M', confidence: 85 },
    { metric: 'Staff Count', current: 186, predicted: 195, confidence: 90 },
  ];

  // Student Demographics
  const demographics = [
    { name: 'Grade 9', count: 620, color: '#3B82F6' },
    { name: 'Grade 10', count: 590, color: '#10B981' },
    { name: 'Grade 11', count: 580, color: '#F59E0B' },
    { name: 'Grade 12', count: 660, color: '#8B5CF6' },
  ];

  // Financial Trends
  const financialTrends = [
    { month: 'Jan', revenue: 850, expenses: 720, profit: 130 },
    { month: 'Feb', revenue: 860, expenses: 730, profit: 130 },
    { month: 'Mar', revenue: 855, expenses: 740, profit: 115 },
    { month: 'Apr', revenue: 870, expenses: 750, profit: 120 },
    { month: 'May', revenue: 865, expenses: 760, profit: 105 },
    { month: 'Jun', revenue: 890, expenses: 780, profit: 110 },
  ];

  // Discipline Trends
  const disciplineTrends = [
    { month: 'Jan', cases: 28, resolved: 24, suspensions: 4 },
    { month: 'Feb', cases: 32, resolved: 28, suspensions: 5 },
    { month: 'Mar', cases: 35, resolved: 30, suspensions: 6 },
    { month: 'Apr', cases: 30, resolved: 32, suspensions: 4 },
    { month: 'May', cases: 38, resolved: 35, suspensions: 7 },
    { month: 'Jun', cases: 42, resolved: 38, suspensions: 8 },
  ];

  // Key Insights
  const insights = [
    {
      category: 'Positive',
      items: [
        'Graduation rate up 2.5% from last year',
        'Student performance improved in STEM subjects',
        'Staff retention at all-time high'
      ]
    },
    {
      category: 'Attention Needed',
      items: [
        'Budget utilization exceeds target by 5%',
        'Disciplinary cases increased in Grade 11',
        'Technology department needs more resources'
      ]
    }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive data analysis and institutional insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">This year</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Academic Performance</p>
              <p className="text-2xl font-bold text-blue-600">{performanceMetrics.academicScore}%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <GraduationCap size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 2.5% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-green-600">{performanceMetrics.attendanceRate}%</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Activity size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 1.2% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Graduation Rate</p>
              <p className="text-2xl font-bold text-purple-600">{performanceMetrics.graduationRate}%</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Award size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Above national average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">College Acceptance</p>
              <p className="text-2xl font-bold text-orange-600">{performanceMetrics.collegeAcceptance}%</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Target size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 3.1% from last year</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Parent Satisfaction</p>
          <p className="text-lg font-semibold text-gray-800">{performanceMetrics.parentSatisfaction}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Staff Retention</p>
          <p className="text-lg font-semibold text-gray-800">{performanceMetrics.staffRetention}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Budget Utilization</p>
          <p className="text-lg font-semibold text-orange-600">{performanceMetrics.budgetUtilization}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Student-Teacher Ratio</p>
          <p className="text-lg font-semibold text-gray-800">{performanceMetrics.studentTeacherRatio}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Year-over-Year Performance */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Year-over-Year Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="enrollment" fill="#3B82F6" />
              <Bar yAxisId="left" dataKey="graduation" fill="#10B981" />
              <Line yAxisId="right" type="monotone" dataKey="performance" stroke="#F59E0B" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Department Radar */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Department Performance Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={departmentRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="This Year" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Radar name="Last Year" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Trends */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Financial Trends (in $K)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Discipline Trends */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Discipline Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={disciplineTrends}>
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
      </div>

      {/* Demographics and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Demographics */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Student Demographics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={demographics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {demographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Predictive Analytics</h3>
          <div className="space-y-3">
            {predictions.map((pred, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{pred.metric}</p>
                  <p className="text-xs text-gray-500">Current: {pred.current}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">{pred.predicted}</p>
                  <p className="text-xs text-gray-500">{pred.confidence}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-green-600 mb-2">Positive Trends</p>
              <ul className="space-y-1">
                {insights[0].items.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start">
                    <TrendingUp size={12} className="text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 mb-2">Attention Needed</p>
              <ul className="space-y-1">
                {insights[1].items.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start">
                    <AlertTriangle size={12} className="text-orange-500 mr-1 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">YoY Enrollment Growth</p>
          <p className="text-3xl font-bold mt-1">+16.7%</p>
          <p className="text-blue-100 text-xs mt-2">Since 2020</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-green-100 text-sm">Performance Improvement</p>
          <p className="text-3xl font-bold mt-1">+8.5%</p>
          <p className="text-green-100 text-xs mt-2">Academic scores</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Budget Efficiency</p>
          <p className="text-3xl font-bold mt-1">92%</p>
          <p className="text-purple-100 text-xs mt-2">Resource optimization</p>
        </div>
      </div>
    </div>
  );
};

export default PrincipalAnalytics;