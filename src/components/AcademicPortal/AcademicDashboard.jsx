import React, { useState } from 'react';
import {
  BookOpen, GraduationCap, Users, Calendar,
  TrendingUp, Award, Clock, CheckCircle,
  Download, Filter, Eye, MoreVertical,
  BarChart3, PieChart, Activity, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart as RePieChart, Pie, Cell,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const AcademicDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  // Academic Statistics
  const academicStats = {
    totalStudents: 2450,
    totalCourses: 86,
    totalTeachers: 142,
    averageGPA: 3.42,
    passRate: 94.2,
    honorsStudents: 520,
    completionRate: 96.8,
    activeSemester: 'Spring 2024'
  };

  // Monthly Performance Data
  const performanceData = [
    { month: 'Jan', avgGrade: 82, attendance: 92, submissions: 88 },
    { month: 'Feb', avgGrade: 84, attendance: 93, submissions: 90 },
    { month: 'Mar', avgGrade: 86, attendance: 94, submissions: 92 },
    { month: 'Apr', avgGrade: 85, attendance: 93, submissions: 91 },
    { month: 'May', avgGrade: 87, attendance: 95, submissions: 93 },
    { month: 'Jun', avgGrade: 89, attendance: 96, submissions: 95 },
  ];

  // Subject Performance
  const subjectPerformance = [
    { name: 'Mathematics', score: 87, students: 580, color: '#3B82F6' },
    { name: 'Science', score: 89, students: 540, color: '#10B981' },
    { name: 'English', score: 91, students: 620, color: '#F59E0B' },
    { name: 'History', score: 86, students: 480, color: '#8B5CF6' },
    { name: 'Arts', score: 94, students: 320, color: '#EF4444' },
  ];

  // Grade Distribution
  const gradeDistribution = [
    { grade: 'A', count: 420, percentage: 28 },
    { grade: 'B', count: 580, percentage: 38 },
    { grade: 'C', count: 320, percentage: 21 },
    { grade: 'D', count: 120, percentage: 8 },
    { grade: 'F', count: 70, percentage: 5 },
  ];

  // Upcoming Exams
  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2024-04-15', students: 580, venue: 'Main Hall' },
    { id: 2, subject: 'Physics', date: '2024-04-16', students: 420, venue: 'Science Block' },
    { id: 3, subject: 'English Literature', date: '2024-04-17', students: 620, venue: 'Main Hall' },
    { id: 4, subject: 'Chemistry', date: '2024-04-18', students: 380, venue: 'Science Block' },
  ];

  // Recent Achievements
  const achievements = [
    { id: 1, title: 'National Science Olympiad Winners', students: 8, date: '2024-03-15' },
    { id: 2, title: 'Mathematics Competition Top 10', students: 5, date: '2024-03-12' },
    { id: 3, title: 'Debate Championship', students: 4, date: '2024-03-10' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Anderson • {academicStats.activeSemester} Semester</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="month">Last 30 days</option>
            <option value="semester">This Semester</option>
            <option value="year">Academic Year</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
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
              <GraduationCap className="text-blue-600" size={24} />
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
              <CheckCircle className="text-purple-600" size={24} />
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
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">21% of student body</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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

        {/* Grade Distribution */}
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
          <div className="grid grid-cols-3 gap-2 mt-4">
            {gradeDistribution.map((grade, index) => (
              <div key={grade.grade} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-xs text-gray-600">Grade {grade.grade}</span>
                <p className="text-sm font-semibold text-gray-800">{grade.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Subject Performance</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All Subjects</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                <BookOpen size={20} style={{ color: subject.color }} />
              </div>
              <h3 className="font-semibold text-gray-800">{subject.name}</h3>
              <p className="text-2xl font-bold mt-2" style={{ color: subject.color }}>{subject.score}%</p>
              <p className="text-xs text-gray-500 mt-1">{subject.students} students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Exams and Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Examinations</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View Schedule</button>
          </div>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{exam.subject}</p>
                    <p className="text-xs text-gray-500">{exam.date} • {exam.students} students</p>
                  </div>
                </div>
                <span className="text-xs text-gray-600">{exam.venue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Achievements</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award size={16} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.students} students • {achievement.date}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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

export default AcademicDashboard;