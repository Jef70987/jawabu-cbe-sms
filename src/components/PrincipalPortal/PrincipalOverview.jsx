import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, GraduationCap, BookOpen,
  DollarSign, Calendar, Download, Filter, Eye, MoreVertical,
  BarChart3, PieChart, Activity, Award, Clock, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const PrincipalOverview = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  
  const overviewStats = {
    totalStudents: 2450,
    totalStaff: 186,
    totalDepartments: 12,
    averageAttendance: 94.2,
    graduationRate: 96.5,
    collegeAcceptance: 92.3,
    budgetUtilization: 78.5,
    parentSatisfaction: 88.7
  };

  const enrollmentTrends = [
    { year: '2020', enrollment: 2100, graduation: 1980 },
    { year: '2021', enrollment: 2250, graduation: 2120 },
    { year: '2022', enrollment: 2350, graduation: 2210 },
    { year: '2023', enrollment: 2420, graduation: 2310 },
    { year: '2024', enrollment: 2450, graduation: 2360 },
  ];

  const departmentMetrics = [
    { name: 'Science', students: 520, teachers: 28, performance: 92, attendance: 95 },
    { name: 'Mathematics', students: 480, teachers: 25, performance: 89, attendance: 94 },
    { name: 'English', students: 450, teachers: 24, performance: 91, attendance: 93 },
    { name: 'Arts', students: 320, teachers: 18, performance: 94, attendance: 96 },
    { name: 'Commerce', students: 380, teachers: 20, performance: 87, attendance: 92 },
    { name: 'Technology', students: 300, teachers: 16, performance: 95, attendance: 97 },
  ];

  const recentAchievements = [
    { id: 1, title: 'National Science Fair Winners', department: 'Science', date: '2024-03-15', type: 'academic' },
    { id: 2, title: 'State Basketball Championship', department: 'Sports', date: '2024-03-14', type: 'sports' },
    { id: 3, title: 'Mathematics Olympiad Top 10', department: 'Mathematics', date: '2024-03-12', type: 'academic' },
    { id: 4, title: 'Community Service Award', department: 'Student Affairs', date: '2024-03-10', type: 'community' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Teacher strike threat next week', severity: 'high' },
    { id: 2, type: 'info', message: 'Budget review meeting tomorrow', severity: 'medium' },
    { id: 3, type: 'success', message: 'Accreditation visit completed', severity: 'low' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Institutional Overview</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of school performance and metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>2023-2024</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Download size={18} />
            <span>Export Overview</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <span className="text-xs text-green-600 font-medium">+5.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overviewStats.totalStudents}</p>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-xs text-gray-400 mt-1">↑ 120 from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <GraduationCap className="text-green-600" size={20} />
            </div>
            <span className="text-xs text-green-600 font-medium">+2.1%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overviewStats.graduationRate}%</p>
          <p className="text-sm text-gray-600">Graduation Rate</p>
          <p className="text-xs text-gray-400 mt-1">Above national average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Activity className="text-purple-600" size={20} />
            </div>
            <span className="text-xs text-green-600 font-medium">+1.8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overviewStats.averageAttendance}%</p>
          <p className="text-sm text-gray-600">Attendance Rate</p>
          <p className="text-xs text-gray-400 mt-1">Target: 96%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <DollarSign className="text-orange-600" size={20} />
            </div>
            <span className="text-xs text-yellow-600 font-medium">-3.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overviewStats.budgetUtilization}%</p>
          <p className="text-sm text-gray-600">Budget Utilization</p>
          <p className="text-xs text-gray-400 mt-1">Within target range</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Enrollment & Graduation Trends</h2>
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
              <option>Last 5 Years</option>
              <option>Last 10 Years</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enrollment" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="graduation" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Student-Teacher Ratio</span>
              <span className="font-semibold text-gray-800">13:1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">College Acceptance</span>
              <span className="font-semibold text-green-600">{overviewStats.collegeAcceptance}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parent Satisfaction</span>
              <span className="font-semibold text-blue-600">{overviewStats.parentSatisfaction}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Departments</span>
              <span className="font-semibold text-gray-800">{overviewStats.totalDepartments}</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Department Performance Metrics</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teachers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentMetrics.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{dept.name}</td>
                  <td className="px-4 py-3 text-gray-600">{dept.students}</td>
                  <td className="px-4 py-3 text-gray-600">{dept.teachers}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">{dept.performance}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${dept.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">{dept.attendance}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${dept.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Achievements and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.type === 'academic' ? 'bg-blue-100' :
                    achievement.type === 'sports' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Award size={16} className={
                      achievement.type === 'academic' ? 'text-blue-600' :
                      achievement.type === 'sports' ? 'text-green-600' : 'text-purple-600'
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.department} • {achievement.date}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alerts & Notifications</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg ${
                alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={18} className={
                    alert.severity === 'high' ? 'text-red-600' :
                    alert.severity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  } />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.severity === 'high' ? 'text-red-800' :
                      alert.severity === 'medium' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalOverview;