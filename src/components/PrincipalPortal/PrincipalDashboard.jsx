import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, UserCheck, BookOpen, DollarSign, TrendingUp, AlertTriangle,
  Calendar, Bell, Download, MoreVertical, Activity, Award, Clock
} from 'lucide-react';

const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 2450,
    totalStaff: 186,
    totalDepartments: 12,
    monthlyRevenue: 1250000,
    attendanceRate: 94.5,
    performanceIndex: 87.3
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'New staff onboarding completed', time: '5 min ago', type: 'staff' },
    { id: 2, action: 'Fee payment deadline approaching', time: '15 min ago', type: 'finance' },
    { id: 3, action: 'Disciplinary hearing scheduled', time: '1 hour ago', type: 'discipline' },
    { id: 4, action: 'Department meeting minutes uploaded', time: '2 hours ago', type: 'academic' },
  ]);

  const performanceData = [
    { month: 'Jan', academics: 85, attendance: 92, discipline: 88 },
    { month: 'Feb', academics: 87, attendance: 93, discipline: 86 },
    { month: 'Mar', academics: 86, attendance: 91, discipline: 89 },
    { month: 'Apr', academics: 89, attendance: 94, discipline: 87 },
    { month: 'May', academics: 88, attendance: 92, discipline: 90 },
    { month: 'Jun', academics: 91, attendance: 95, discipline: 92 },
  ];

  const departmentPerformance = [
    { name: 'Science', value: 92 },
    { name: 'Arts', value: 88 },
    { name: 'Commerce', value: 85 },
    { name: 'Technology', value: 94 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Principal's Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Smith • Last login: Today 8:30 AM</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-2">↑ 12% from last year</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Teaching Staff</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalStaff}</p>
              <p className="text-sm text-green-600 mt-2">↑ 5 new this month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">${(stats.monthlyRevenue/1000).toFixed(1)}K</p>
              <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.attendanceRate}%</p>
              <p className="text-sm text-yellow-600 mt-2">Target: 96%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Activity className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Performance Trends</h2>
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>Custom range</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="academics" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="discipline" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentPerformance}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {departmentPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentPerformance.map((dept, index) => (
              <div key={dept.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-600">{dept.name}: {dept.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'staff' ? 'bg-blue-100' :
                    activity.type === 'finance' ? 'bg-green-100' :
                    activity.type === 'discipline' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'staff' && <UserCheck size={16} className="text-blue-600" />}
                    {activity.type === 'finance' && <DollarSign size={16} className="text-green-600" />}
                    {activity.type === 'discipline' && <AlertTriangle size={16} className="text-red-600" />}
                    {activity.type === 'academic' && <BookOpen size={16} className="text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Activities
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg text-center min-w-[60px]">
                <p className="text-xs font-semibold">MAR</p>
                <p className="text-xl font-bold">15</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Board of Governors Meeting</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Clock size={14} className="mr-1" /> 10:00 AM - 12:00 PM
                </p>
              </div>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                View
              </button>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg text-center min-w-[60px]">
                <p className="text-xs font-semibold">MAR</p>
                <p className="text-xl font-bold">18</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Academic Excellence Awards</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Clock size={14} className="mr-1" /> 2:00 PM - 4:00 PM
                </p>
              </div>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                View
              </button>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg text-center min-w-[60px]">
                <p className="text-xs font-semibold">MAR</p>
                <p className="text-xl font-bold">22</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Parent-Teacher Conference</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Clock size={14} className="mr-1" /> 9:00 AM - 3:00 PM
                </p>
              </div>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                View
              </button>
            </div>
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;