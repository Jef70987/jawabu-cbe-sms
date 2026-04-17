/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, BookOpen, Target, Award,
  AlertCircle, CheckCircle, X, Loader2, RefreshCw, Download,
  ChevronDown, ChevronUp, PieChart, Activity, Star, Medal,
  TrendingDown, Filter, Calendar, UserCheck, FileText
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles[type]} border p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

function Analytics() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState({
    classPerformance: {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      totalStudents: 0,
      gradeDistribution: {},
      subjectPerformance: []
    },
    studentRankings: [],
    improvementTrends: [],
    competencyAverages: {},
    topPerformers: [],
    strugglingStudents: []
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access analytics');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedClass) {
      fetchAnalytics();
    }
  }, [selectedClass, selectedSubject, selectedExam]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mock classes
      setClasses([
        { id: 1, name: 'Grade 7A', stream: 'A', level: 'Junior' },
        { id: 2, name: 'Grade 7B', stream: 'B', level: 'Junior' },
        { id: 3, name: 'Grade 8A', stream: 'A', level: 'Junior' }
      ]);
      
      setSubjects(['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Digital Literacy']);
      setExams([
        { id: 1, title: 'End of Term 1 Exam', term: 'Term 1', year: 2024 },
        { id: 2, title: 'Mid Term 2 Exam', term: 'Term 2', year: 2024 }
      ]);
      
      setSelectedClass('1');
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Mock analytics data
      setAnalytics({
        classPerformance: {
          averageScore: 74.5,
          highestScore: 98,
          lowestScore: 42,
          passRate: 82.5,
          totalStudents: 44,
          gradeDistribution: {
            'A': 8,
            'B': 15,
            'C': 12,
            'D': 6,
            'E': 3
          },
          subjectPerformance: [
            { subject: 'Mathematics', average: 71.2, highest: 95, lowest: 45, passRate: 78 },
            { subject: 'English', average: 76.8, highest: 98, lowest: 52, passRate: 85 },
            { subject: 'Kiswahili', average: 73.5, highest: 92, lowest: 48, passRate: 80 },
            { subject: 'Integrated Science', average: 78.2, highest: 96, lowest: 55, passRate: 88 },
            { subject: 'Digital Literacy', average: 81.3, highest: 99, lowest: 60, passRate: 92 }
          ]
        },
        studentRankings: [
          { id: 1, name: 'Mary Wanjiku', admission_no: 'ADM002', average: 91.5, rank: 1, trend: 'up' },
          { id: 2, name: 'David Kiprop', admission_no: 'ADM005', average: 88.2, rank: 2, trend: 'up' },
          { id: 3, name: 'John Mwangi', admission_no: 'ADM001', average: 85.0, rank: 3, trend: 'stable' },
          { id: 4, name: 'Sarah Achieng', admission_no: 'ADM004', average: 72.3, rank: 4, trend: 'down' },
          { id: 5, name: 'James Otieno', admission_no: 'ADM003', average: 65.8, rank: 5, trend: 'stable' }
        ],
        improvementTrends: [
          { month: 'January', average: 68.5 },
          { month: 'February', average: 71.2 },
          { month: 'March', average: 74.5 },
          { month: 'April', average: 76.8 },
          { month: 'May', average: 78.2 }
        ],
        competencyAverages: {
          'Communication and Collaboration': 78.5,
          'Critical Thinking': 72.3,
          'Creativity': 75.8,
          'Citizenship': 82.1,
          'Digital Literacy': 81.2,
          'Learning to Learn': 74.6,
          'Self-Efficacy': 76.4
        },
        topPerformers: [
          { id: 2, name: 'Mary Wanjiku', admission_no: 'ADM002', average: 91.5, subjects: { Mathematics: 94, English: 96, Science: 92 } },
          { id: 5, name: 'David Kiprop', admission_no: 'ADM005', average: 88.2, subjects: { Mathematics: 92, English: 87, Science: 89 } }
        ],
        strugglingStudents: [
          { id: 4, name: 'Sarah Achieng', admission_no: 'ADM004', average: 52.3, subjects: { Mathematics: 48, English: 55, Science: 52 } },
          { id: 3, name: 'James Otieno', admission_no: 'ADM003', average: 58.8, subjects: { Mathematics: 52, English: 60, Science: 58 } }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      addNotification('error', 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = analytics.studentRankings.map(student => ({
      'Rank': student.rank,
      'Admission No': student.admission_no,
      'Student Name': student.name,
      'Average Score': student.average,
      'Performance Trend': student.trend === 'up' ? 'Improving' : student.trend === 'down' ? 'Declining' : 'Stable'
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Class_Performance');
    XLSX.writeFile(workbook, `class_analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
    addNotification('success', 'Export completed');
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access analytics</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Class Analytics</h1>
              <p className="text-blue-100 mt-1">Comprehensive performance analytics and insights</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                <Download className="h-4 w-4 inline mr-2" />
                Export Report
              </button>
              <button onClick={fetchAnalytics} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Filters */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Assessment</label>
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">All Assessments</option>
                {exams.map(e => (
                  <option key={e.id} value={e.id}>{e.title} ({e.year})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-blue-700">{analytics.classPerformance.averageScore}%</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Highest Score</p>
            <p className="text-2xl font-bold text-green-700">{analytics.classPerformance.highestScore}%</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Lowest Score</p>
            <p className="text-2xl font-bold text-red-700">{analytics.classPerformance.lowestScore}%</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Pass Rate</p>
            <p className="text-2xl font-bold text-purple-700">{analytics.classPerformance.passRate}%</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.classPerformance.totalStudents}</p>
          </div>
        </div>

        {/* Grade Distribution & Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Grade Distribution */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Grade Distribution</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {Object.entries(analytics.classPerformance.gradeDistribution).map(([grade, count]) => (
                  <div key={grade}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-bold ${getGradeColor(grade)} px-2 py-0.5`}>Grade {grade}</span>
                      <span>{count} students ({Math.round((count / analytics.classPerformance.totalStudents) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div className={`h-2 ${grade === 'A' ? 'bg-green-600' : grade === 'B' ? 'bg-blue-600' : grade === 'C' ? 'bg-yellow-600' : grade === 'D' ? 'bg-orange-600' : 'bg-red-600'}`} style={{ width: `${(count / analytics.classPerformance.totalStudents) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Subject Performance</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {analytics.classPerformance.subjectPerformance.map(subject => (
                  <div key={subject.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="font-bold">{subject.average}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div className="bg-blue-600 h-2" style={{ width: `${subject.average}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Highest: {subject.highest}%</span>
                      <span>Lowest: {subject.lowest}%</span>
                      <span>Pass: {subject.passRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student Rankings */}
        <div className="bg-white border border-gray-300 mb-6">
          <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Student Performance Rankings</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Rank</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Admission No</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Average Score</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Trend</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {analytics.studentRankings.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">
                      {student.rank === 1 && <Medal className="h-5 w-5 text-yellow-500 inline" />}
                      {student.rank === 2 && <Medal className="h-5 w-5 text-gray-400 inline" />}
                      {student.rank === 3 && <Medal className="h-5 w-5 text-amber-600 inline" />}
                      {student.rank > 3 && student.rank}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 font-medium">{student.name}</td>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">{student.average}%</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {getTrendIcon(student.trend)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button 
                        onClick={() => { setSelectedStudent(student); setShowStudentDetails(true); }}
                        className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Improvement Trends & Competencies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Improvement Trends */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Improvement Trends</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {analytics.improvementTrends.map((trend, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{trend.month}</span>
                      <span className="font-bold">{trend.average}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div className="bg-green-600 h-2" style={{ width: `${trend.average}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">📈 Overall improvement of +9.7% from January to May</p>
              </div>
            </div>
          </div>

          {/* Competency Averages */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Core Competencies Performance</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {Object.entries(analytics.competencyAverages).map(([competency, score]) => (
                  <div key={competency}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{competency}</span>
                      <span className="font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div className={`h-2 ${score >= 80 ? 'bg-green-600' : score >= 70 ? 'bg-blue-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers & Struggling Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-green-50">
              <h2 className="font-bold text-green-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performers
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {analytics.topPerformers.map(student => (
                <div key={student.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.admission_no}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">{student.average}%</p>
                      <p className="text-xs text-gray-500">Overall Average</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {Object.entries(student.subjects).map(([subject, score]) => (
                      <div key={subject} className="bg-gray-50 p-2 border border-gray-200">
                        <p className="text-xs text-gray-600">{subject}</p>
                        <p className="font-bold text-gray-800">{score}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Struggling Students */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-red-50">
              <h2 className="font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Needs Intervention
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {analytics.strugglingStudents.map(student => (
                <div key={student.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.admission_no}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700">{student.average}%</p>
                      <p className="text-xs text-gray-500">Below Average</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {Object.entries(student.subjects).map(([subject, score]) => (
                      <div key={subject} className="bg-gray-50 p-2 border border-gray-200">
                        <p className="text-xs text-gray-600">{subject}</p>
                        <p className="font-bold text-red-600">{score}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button className="w-full px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                      Create Intervention Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowStudentDetails(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Student Performance Details</h3>
              <button onClick={() => setShowStudentDetails(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 border border-blue-300 flex items-center justify-center">
                  <span className="text-blue-800 font-bold text-xl">{selectedStudent.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h4>
                  <p className="text-gray-600">Admission: {selectedStudent.admission_no}</p>
                  <p className="text-gray-600">Current Average: {selectedStudent.average}%</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 mb-4">
                <p className="text-sm font-bold text-blue-800">Recommendations</p>
                <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                  <li>Focus on problem-solving skills in Mathematics</li>
                  <li>Additional reading comprehension practice</li>
                  <li>One-on-one tutoring sessions twice a week</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                  View Full Report
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                  Schedule Parent Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;