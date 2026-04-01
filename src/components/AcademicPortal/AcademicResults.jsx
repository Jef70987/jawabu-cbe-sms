import React, { useState } from 'react';
import {
  Award, GraduationCap, TrendingUp, TrendingDown,
  Search, Filter, Download, Eye, Edit2,
  BarChart3, PieChart, FileText, Calendar,
  CheckCircle, AlertCircle, Printer, Mail
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart as RePieChart, Pie, Cell,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const AcademicResults = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExam, setSelectedExam] = useState('midterm');

  // Results Statistics
  const resultsStats = {
    averageGPA: 3.42,
    passRate: 94.2,
    distinctionCount: 245,
    meritCount: 580,
    improvementRate: 8.5,
    topPerformer: 'Emma Thompson',
    topScore: 98.5,
    lowestScore: 45
  };

  // Grade Distribution
  const gradeDistribution = [
    { grade: 'A', count: 420, percentage: 28, color: '#10B981' },
    { grade: 'B', count: 580, percentage: 38, color: '#3B82F6' },
    { grade: 'C', count: 320, percentage: 21, color: '#F59E0B' },
    { grade: 'D', count: 120, percentage: 8, color: '#EF4444' },
    { grade: 'F', count: 70, percentage: 5, color: '#6B7280' }
  ];

  // Subject Performance
  const subjectPerformance = [
    { subject: 'Mathematics', score: 87, passRate: 92, topScore: 100, failRate: 8 },
    { subject: 'English', score: 91, passRate: 96, topScore: 99, failRate: 4 },
    { subject: 'Science', score: 89, passRate: 94, topScore: 98, failRate: 6 },
    { subject: 'History', score: 86, passRate: 90, topScore: 97, failRate: 10 },
    { subject: 'Arts', score: 94, passRate: 98, topScore: 100, failRate: 2 }
  ];

  // Student Performance Data
  const studentPerformance = [
    { id: 1, name: 'Emma Thompson', grade: '10B', gpa: 4.0, rank: 1, status: 'Excellent' },
    { id: 2, name: 'Sophia Lee', grade: '9C', gpa: 3.9, rank: 2, status: 'Excellent' },
    { id: 3, name: 'Olivia Martinez', grade: '11B', gpa: 3.8, rank: 3, status: 'Good' },
    { id: 4, name: 'James Wilson', grade: '11A', gpa: 2.5, rank: 145, status: 'Needs Improvement' },
    { id: 5, name: 'Michael Brown', grade: '12C', gpa: 2.0, rank: 210, status: 'At Risk' }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={16} /> },
    { id: 'subjects', name: 'Subject Analysis', icon: <BarChart3 size={16} /> },
    { id: 'students', name: 'Student Results', icon: <GraduationCap size={16} /> },
    { id: 'transcripts', name: 'Transcripts', icon: <FileText size={16} /> }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Results & Grades</h1>
          <p className="text-gray-600 mt-1">Manage student results, transcripts, and academic performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="midterm">Mid-Term Results</option>
            <option value="final">Final Results</option>
            <option value="quarterly">Quarterly Results</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Results</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <FileText size={18} />
            <span>Publish Results</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average GPA</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{resultsStats.averageGPA}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 0.2 from last semester</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pass Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{resultsStats.passRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Above national average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Distinctions</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{resultsStats.distinctionCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12 from last semester</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Improvement Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{resultsStats.improvementRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Students showed improvement</p>
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
                {/* Grade Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Grade Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Subject Performance Radar */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Subject Performance Radar</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={subjectPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Radar name="Pass Rate" dataKey="passRate" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performers */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Top Performers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-90">Rank #1</p>
                    <p className="text-xl font-bold mt-1">Emma Thompson</p>
                    <p className="text-sm opacity-90">Grade 10B</p>
                    <p className="text-2xl font-bold mt-2">GPA: 4.0</p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-90">Rank #2</p>
                    <p className="text-xl font-bold mt-1">Sophia Lee</p>
                    <p className="text-sm opacity-90">Grade 9C</p>
                    <p className="text-2xl font-bold mt-2">GPA: 3.9</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-90">Rank #3</p>
                    <p className="text-xl font-bold mt-1">Olivia Martinez</p>
                    <p className="text-sm opacity-90">Grade 11B</p>
                    <p className="text-2xl font-bold mt-2">GPA: 3.8</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subject Analysis Tab */}
          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fail Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subjectPerformance.map((subject, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{subject.subject}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{subject.score}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: `${subject.score}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-green-600 font-medium">{subject.passRate}%</td>
                        <td className="px-4 py-3 font-medium text-blue-600">{subject.topScore}%</td>
                        <td className="px-4 py-3 text-red-600">{subject.failRate}%</td>
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
          )}

          {/* Student Results Tab */}
          {activeTab === 'students' && (
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
                  <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Grades</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Generate Report Cards
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentPerformance.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                        <td className="px-4 py-3 text-gray-600">{student.grade}</td>
                        <td className="px-4 py-3 font-medium text-blue-600">{student.gpa}</td>
                        <td className="px-4 py-3 text-gray-600">#{student.rank}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                            student.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                            student.status === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Printer size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Mail size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transcripts Tab */}
          {activeTab === 'transcripts' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">Transcript Management</h3>
                <p className="text-gray-600 mt-2">Generate and manage student transcripts</p>
                <div className="mt-4 flex justify-center space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Generate Transcripts
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Bulk Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicResults;