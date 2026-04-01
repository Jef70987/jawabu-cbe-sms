import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Search, Filter,
  Download, Eye, Edit2, MoreVertical,
  CheckCircle, XCircle, AlertCircle,
  TrendingUp, TrendingDown, PieChart,
  BarChart3, UserCheck, UserX, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart as RePieChart, Pie, Cell,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const AcademicAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  // Attendance Statistics
  const attendanceStats = {
    overallRate: 94.2,
    presentToday: 2180,
    absentToday: 142,
    lateToday: 28,
    excusedToday: 45,
    weeklyAverage: 93.8,
    monthlyTarget: 95,
    improvedStudents: 245,
    decliningStudents: 98
  };

  // Daily Attendance Data
  const dailyAttendance = [
    { day: 'Mon', present: 2250, absent: 120, late: 25, excused: 35 },
    { day: 'Tue', present: 2280, absent: 95, late: 20, excused: 30 },
    { day: 'Wed', present: 2265, absent: 105, late: 22, excused: 38 },
    { day: 'Thu', present: 2290, absent: 85, late: 18, excused: 32 },
    { day: 'Fri', present: 2240, absent: 130, late: 28, excused: 42 },
  ];

  // Grade Level Attendance
  const gradeAttendance = [
    { grade: 'Grade 9', rate: 95.2, present: 590, absent: 30, trend: '+2.1%' },
    { grade: 'Grade 10', rate: 94.8, present: 560, absent: 32, trend: '+1.5%' },
    { grade: 'Grade 11', rate: 93.5, present: 540, absent: 38, trend: '-0.8%' },
    { grade: 'Grade 12', rate: 92.8, present: 490, absent: 42, trend: '-1.2%' },
  ];

  // Recent Attendance Records
  const recentAttendance = [
    { id: 1, student: 'Emma Thompson', grade: '10B', status: 'Present', time: '8:25 AM', date: '2024-04-01' },
    { id: 2, student: 'James Wilson', grade: '11A', status: 'Late', time: '9:15 AM', date: '2024-04-01' },
    { id: 3, student: 'Sophia Lee', grade: '9C', status: 'Absent', time: '-', date: '2024-04-01' },
    { id: 4, student: 'Michael Brown', grade: '12C', status: 'Present', time: '8:20 AM', date: '2024-04-01' },
    { id: 5, student: 'Olivia Martinez', grade: '11B', status: 'Excused', time: '-', date: '2024-04-01' },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={16} /> },
    { id: 'daily', name: 'Daily Attendance', icon: <Calendar size={16} /> },
    { id: 'students', name: 'Student Records', icon: <Users size={16} /> },
    { id: 'reports', name: 'Reports', icon: <FileText size={16} /> }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Late': return 'bg-yellow-100 text-yellow-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircle size={14} className="text-green-600" />;
      case 'Late': return <Clock size={14} className="text-yellow-600" />;
      case 'Absent': return <XCircle size={14} className="text-red-600" />;
      case 'Excused': return <FileText size={14} className="text-blue-600" />;
      default: return null;
    }
  };

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Present', value: attendanceStats.presentToday, color: '#10B981' },
    { name: 'Absent', value: attendanceStats.absentToday, color: '#EF4444' },
    { name: 'Late', value: attendanceStats.lateToday, color: '#F59E0B' },
    { name: 'Excused', value: attendanceStats.excusedToday, color: '#3B82F6' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and monitor student and staff attendance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <CheckCircle size={18} />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overall Attendance</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{attendanceStats.overallRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 1.2% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Present Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{attendanceStats.presentToday}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Out of {attendanceStats.presentToday + attendanceStats.absentToday} students</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Absent Today</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{attendanceStats.absentToday}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <UserX className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">{attendanceStats.lateToday} late arrivals</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Monthly Target</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{attendanceStats.monthlyTarget}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Currently {attendanceStats.overallRate}%</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Attendance Trend */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Daily Attendance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Attendance Composition */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Today's Attendance Composition</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Level Attendance */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Attendance by Grade Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {gradeAttendance.map((grade, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">{grade.grade}</h4>
                        <span className={`text-xs ${grade.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {grade.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{grade.rate}%</p>
                      <p className="text-sm text-gray-600 mt-1">{grade.present} present / {grade.absent} absent</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${grade.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={20} className="text-green-600" />
                    <h4 className="font-semibold text-gray-800">Improved Attendance</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">{attendanceStats.improvedStudents}</p>
                  <p className="text-sm text-gray-600">students showed improvement this month</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingDown size={20} className="text-red-600" />
                    <h4 className="font-semibold text-gray-800">Declining Attendance</h4>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-2">{attendanceStats.decliningStudents}</p>
                  <p className="text-sm text-gray-600">students need attention</p>
                </div>
              </div>
            </div>
          )}

          {/* Daily Attendance Tab */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Grades</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Sections</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Update Attendance
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{record.student}</p>
                            <p className="text-xs text-gray-500">ID: {record.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.grade}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.time}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Edit2 size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-gray-600">Showing 5 of 2450 students</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded-lg">1</button>
                  <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Student Records Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Excellent Attendance (&gt;95%)</p>
                  <p className="text-2xl font-bold text-blue-600">1,245</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Good Attendance (85-95%)</p>
                  <p className="text-2xl font-bold text-yellow-600">890</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Needs Improvement (&lt;85%)</p>
                  <p className="text-2xl font-bold text-red-600">315</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Students with Low Attendance</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Michael Brown', grade: '12C', rate: 72, daysAbsent: 28 },
                    { name: 'James Wilson', grade: '11A', rate: 78, daysAbsent: 22 },
                    { name: 'Sarah Chen', grade: '10B', rate: 82, daysAbsent: 18 }
                  ].map((student, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.grade}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-600">{student.rate}%</p>
                          <p className="text-xs text-gray-500">{student.daysAbsent} days absent</p>
                        </div>
                        <button className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                          Follow Up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Monthly Attendance Report</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dailyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="present" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Attendance Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Present</span>
                        <span>{attendanceStats.presentToday}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Absent</span>
                        <span>{attendanceStats.absentToday}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Late</span>
                        <span>{attendanceStats.lateToday}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '1%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Generate Full Report
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Export to Excel
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Print Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicAttendance;