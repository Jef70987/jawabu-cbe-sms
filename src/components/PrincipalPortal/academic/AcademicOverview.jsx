import React, { useState } from 'react';
import {
  BookOpen, GraduationCap, Users, Award,
  TrendingUp, TrendingDown, Calendar, Download,
  Eye, BarChart3, PieChart, Activity
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const AcademicOverview = () => {
  const academicStats = {
    totalStudents: 2450,
    totalTeachers: 142,
    totalCourses: 86,
    averageGPA: 3.42,
    passRate: 94.2,
    honorsStudents: 520,
    completionRate: 96.8
  };

  const performanceData = [
    { month: 'Jan', avgGrade: 82, attendance: 92, submissions: 88 },
    { month: 'Feb', avgGrade: 84, attendance: 93, submissions: 90 },
    { month: 'Mar', avgGrade: 86, attendance: 94, submissions: 92 },
    { month: 'Apr', avgGrade: 85, attendance: 93, submissions: 91 },
    { month: 'May', avgGrade: 87, attendance: 95, submissions: 93 },
    { month: 'Jun', avgGrade: 89, attendance: 96, submissions: 95 }
  ];

  const subjectPerformance = [
    { name: 'Mathematics', score: 87, students: 580, color: '#3B82F6' },
    { name: 'Science', score: 89, students: 540, color: '#10B981' },
    { name: 'English', score: 91, students: 620, color: '#F59E0B' },
    { name: 'History', score: 86, students: 480, color: '#8B5CF6' },
    { name: 'Arts', score: 94, students: 320, color: '#EF4444' }
  ];

  const gradeDistribution = [
    { grade: 'A', count: 420, percentage: 28 },
    { grade: 'B', count: 580, percentage: 38 },
    { grade: 'C', count: 320, percentage: 21 },
    { grade: 'D', count: 120, percentage: 8 },
    { grade: 'F', count: 70, percentage: 5 }
  ];

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2024-04-15', students: 580 },
    { id: 2, subject: 'Physics', date: '2024-04-16', students: 420 },
    { id: 3, subject: 'English Literature', date: '2024-04-17', students: 620 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Overview</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of academic performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Calendar size={18} />
            <span>Academic Calendar</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{academicStats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average GPA</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{academicStats.averageGPA}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 0.2 from last semester</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pass Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{academicStats.passRate}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Above national average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Honors Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{academicStats.honorsStudents}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Award className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">21% of student body</p>
        </div>
      </div>

      {/* Performance Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Academic Performance Trends</h2>
          <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
            <option>This Semester</option>
            <option>Last Semester</option>
            <option>Academic Year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgGrade" stroke="#3B82F6" strokeWidth={2} name="Avg Grade" />
            <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
            <Line type="monotone" dataKey="submissions" stroke="#F59E0B" strokeWidth={2} name="Submissions %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Performance & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h2>
          <div className="grid grid-cols-1 gap-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{subject.name}</p>
                  <p className="text-xs text-gray-500">{subject.students} students</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold" style={{ color: subject.color }}>{subject.score}%</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full" style={{ width: `${subject.score}%`, backgroundColor: subject.color }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Examinations</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Schedule</button>
        </div>
        <div className="space-y-4">
          {upcomingExams.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{exam.subject}</p>
                  <p className="text-xs text-gray-500">{exam.date} • {exam.students} students</p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <GraduationCap size={24} className="mb-2" />
          <p className="font-semibold">Generate Report Cards</p>
          <p className="text-xs text-blue-100 mt-1">End of semester reports</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <Calendar size={24} className="mb-2" />
          <p className="font-semibold">Schedule Exams</p>
          <p className="text-xs text-green-100 mt-1">Plan examination timetable</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <BarChart3 size={24} className="mb-2" />
          <p className="font-semibold">Performance Analysis</p>
          <p className="text-xs text-purple-100 mt-1">Detailed academic insights</p>
        </button>
        <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white hover:shadow-lg transition">
          <BookOpen size={24} className="mb-2" />
          <p className="font-semibold">Curriculum Review</p>
          <p className="text-xs text-orange-100 mt-1">Update course content</p>
        </button>
      </div>
    </div>
  );
};

export default AcademicOverview;