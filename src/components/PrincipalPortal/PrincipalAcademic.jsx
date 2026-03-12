import React, { useState } from 'react';
import {
  BookOpen, GraduationCap, Calendar, Clock, Users,
  Award, Download, Filter, Search, Eye, Edit2,
  TrendingUp, TrendingDown, BarChart3, PieChart,
  FileText, Plus, MoreVertical, CheckCircle, XCircle
} from 'lucide-react';

const PrincipalAcademic = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const academicStats = {
    totalStudents: 2450,
    totalTeachers: 142,
    totalCourses: 86,
    averageGPA: 3.4,
    passRate: 94.2,
    honorsStudents: 520,
    advancedPlacement: 380,
    remedialStudents: 145
  };

  const departmentPerformance = [
    { name: 'Science', avgGrade: 'B+', passRate: 96, honors: 145, apStudents: 98 },
    { name: 'Mathematics', avgGrade: 'B', passRate: 92, honors: 128, apStudents: 85 },
    { name: 'English', avgGrade: 'A-', passRate: 98, honors: 156, apStudents: 76 },
    { name: 'Arts', avgGrade: 'A', passRate: 99, honors: 112, apStudents: 45 },
    { name: 'Commerce', avgGrade: 'B+', passRate: 94, honors: 98, apStudents: 52 },
    { name: 'Technology', avgGrade: 'A-', passRate: 97, honors: 105, apStudents: 62 },
  ];

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', grade: '12A', date: '2024-03-20', time: '9:00 AM', students: 35 },
    { id: 2, subject: 'Physics', grade: '11B', date: '2024-03-21', time: '10:30 AM', students: 28 },
    { id: 3, subject: 'English Literature', grade: '10C', date: '2024-03-22', time: '8:00 AM', students: 32 },
    { id: 4, subject: 'Chemistry', grade: '12B', date: '2024-03-23', time: '1:00 PM', students: 30 },
  ];

  const recentResults = [
    { id: 1, subject: 'Mathematics', grade: '10A', passRate: 97, highest: '98%', lowest: '65%' },
    { id: 2, subject: 'English', grade: '9B', passRate: 99, highest: '100%', lowest: '72%' },
    { id: 3, subject: 'Science', grade: '11C', passRate: 92, highest: '96%', lowest: '58%' },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'curriculum', name: 'Curriculum', icon: <BookOpen size={16} /> },
    { id: 'exams', name: 'Examinations', icon: <FileText size={16} /> },
    { id: 'results', name: 'Results', icon: <Award size={16} /> },
    { id: 'timetable', name: 'Timetable', icon: <Calendar size={16} /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Management</h1>
          <p className="text-gray-600 mt-1">Oversee curriculum, examinations, and academic performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>New Academic Year</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average GPA</p>
                      <p className="text-2xl font-bold text-gray-800">{academicStats.averageGPA}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <GraduationCap size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">↑ 0.2 from last semester</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pass Rate</p>
                      <p className="text-2xl font-bold text-gray-800">{academicStats.passRate}%</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Above target (92%)</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Honors Students</p>
                      <p className="text-2xl font-bold text-gray-800">{academicStats.honorsStudents}</p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Award size={20} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">21% of student body</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">AP Students</p>
                      <p className="text-2xl font-bold text-gray-800">{academicStats.advancedPlacement}</p>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <BookOpen size={20} className="text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">↑ 45 from last year</p>
                </div>
              </div>

              {/* Department Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Honors</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AP Students</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {departmentPerformance.map((dept, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{dept.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              dept.avgGrade.includes('A') ? 'bg-green-100 text-green-800' :
                              dept.avgGrade.includes('B') ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {dept.avgGrade}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">{dept.passRate}%</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${dept.passRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{dept.honors}</td>
                          <td className="px-4 py-3 text-gray-600">{dept.apStudents}</td>
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
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Total Courses</h4>
                  <p className="text-3xl font-bold text-blue-600">86</p>
                  <p className="text-sm text-blue-700 mt-1">Across 12 departments</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Core Courses</h4>
                  <p className="text-3xl font-bold text-green-600">42</p>
                  <p className="text-sm text-green-700 mt-1">Required for graduation</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Electives</h4>
                  <p className="text-3xl font-bold text-purple-600">44</p>
                  <p className="text-sm text-purple-700 mt-1">Specialization options</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Curriculum Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Mathematics (Grades 9-12)</span>
                    <span className="text-sm text-gray-500">8 courses • 24 credits</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Sciences (Grades 9-12)</span>
                    <span className="text-sm text-gray-500">10 courses • 30 credits</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Languages (Grades 9-12)</span>
                    <span className="text-sm text-gray-500">6 courses • 18 credits</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Examinations</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Schedule Exam
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{exam.subject}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.grade}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.date}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.time}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.students}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Edit2 size={16} className="text-gray-600" />
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

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Examination Results</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Publish Results
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800">{result.subject} - {result.grade}</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pass Rate:</span>
                        <span className="font-medium text-green-600">{result.passRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Highest:</span>
                        <span className="font-medium text-gray-800">{result.highest}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lowest:</span>
                        <span className="font-medium text-gray-800">{result.lowest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timetable Tab */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Master Timetable</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    View Schedule
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Timetable viewer will be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">Select a grade to view class schedules</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrincipalAcademic;