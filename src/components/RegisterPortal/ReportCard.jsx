/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileText, Download, Printer, TrendingUp, Users, BookOpen, 
  BarChart3, PieChart, AlertCircle, CheckCircle, X, Loader2,
  Eye, Calendar, Filter, ChevronDown, ChevronUp, School,
  Award, Target, Activity, RefreshCw, Upload, FileSpreadsheet,
  Settings, UserCheck, ClipboardList, GraduationCap, Star,
  Clock, MessageSquare, DollarSign, Percent, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// CBC/CBE Grading Schemes
const FOUR_POINT_SCALE = [
  { level: 4, label: 'Exceeding Expectations (EE)', short: 'EE', description: 'Exceptional mastery independently', color: 'bg-green-100 text-green-800' },
  { level: 3, label: 'Meeting Expectations (ME)', short: 'ME', description: 'Performs correctly and independently', color: 'bg-blue-100 text-blue-800' },
  { level: 2, label: 'Approaching Expectations (AE)', short: 'AE', description: 'Progress with occasional support', color: 'bg-yellow-100 text-yellow-800' },
  { level: 1, label: 'Below Expectations (BE)', short: 'BE', description: 'Requires significant intervention', color: 'bg-red-100 text-red-800' }
];

const EIGHT_POINT_SCALE = [
  { points: 8, level: 'EE 1', original: 'Exceeding Expectations', percentage: '90-100%', color: 'bg-green-100 text-green-800' },
  { points: 7, level: 'EE 2', original: 'Exceeding Expectations', percentage: '75-89%', color: 'bg-green-100 text-green-800' },
  { points: 6, level: 'ME 1', original: 'Meeting Expectations', percentage: '58-74%', color: 'bg-blue-100 text-blue-800' },
  { points: 5, level: 'ME 2', original: 'Meeting Expectations', percentage: '41-57%', color: 'bg-blue-100 text-blue-800' },
  { points: 4, level: 'AE 1', original: 'Approaching Expectations', percentage: '31-40%', color: 'bg-yellow-100 text-yellow-800' },
  { points: 3, level: 'AE 2', original: 'Approaching Expectations', percentage: '21-30%', color: 'bg-yellow-100 text-yellow-800' },
  { points: 2, level: 'BE 1', original: 'Below Expectations', percentage: '11-20%', color: 'bg-red-100 text-red-800' },
  { points: 1, level: 'BE 2', original: 'Below Expectations', percentage: '0-10%', color: 'bg-red-100 text-red-800' }
];

const CBC_COMPETENCIES = [
  'Communication and Collaboration',
  'Critical Thinking and Problem Solving',
  'Creativity and Imagination',
  'Citizenship',
  'Digital Literacy',
  'Learning to Learn',
  'Self-Efficacy'
];

const CBC_VALUES = [
  'Love', 'Responsibility', 'Respect', 'Unity', 'Peace', 'Patriotism', 'Integrity'
];

// Notification Component
const Notification = ({ type, message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-300 text-green-800';
      case 'error': return 'bg-red-50 border-red-300 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default: return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full md:w-auto ${getStyles()} border p-4 shadow-lg`}>
      <div className="flex items-start">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mr-3" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mr-3" />}
        {type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />}
        {(type === 'info' || !type) && <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />}
        <div className="flex-1">
          <p className="text-sm font-bold">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Information'}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }} className="ml-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

function ResultsReporting() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Modal States
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  
  // Bulk Generation
  const [bulkGeneration, setBulkGeneration] = useState({
    examId: '',
    classIds: [],
    format: 'pdf',
    includeCompetencies: true,
    includeValues: true
  });
  
  // File Upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Analytics Data
  const [analytics, setAnalytics] = useState({
    schoolPerformance: {
      averageScore: 0,
      passRate: 0,
      totalStudents: 0,
      totalExams: 0,
      topPerformer: null,
      bottomPerformer: null,
      gradeDistribution: {}
    },
    classPerformance: [],
    subjectPerformance: [],
    trendData: [],
    comparisonData: {}
  });

  const printRef = useRef();

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Grade Levels Configuration
  const gradeLevels = [
    { id: 'pp1', name: 'Pre-Primary 1', code: 'PP1', levelType: 'early-years', order: 1, numericLevel: 0 },
    { id: 'pp2', name: 'Pre-Primary 2', code: 'PP2', levelType: 'early-years', order: 2, numericLevel: 0 },
    { id: '1', name: 'Grade 1', code: 'G1', levelType: 'early-years', order: 3, numericLevel: 1 },
    { id: '2', name: 'Grade 2', code: 'G2', levelType: 'early-years', order: 4, numericLevel: 2 },
    { id: '3', name: 'Grade 3', code: 'G3', levelType: 'early-years', order: 5, numericLevel: 3 },
    { id: '4', name: 'Grade 4', code: 'G4', levelType: 'primary', order: 6, numericLevel: 4 },
    { id: '5', name: 'Grade 5', code: 'G5', levelType: 'primary', order: 7, numericLevel: 5 },
    { id: '6', name: 'Grade 6', code: 'G6', levelType: 'primary', order: 8, numericLevel: 6 },
    { id: '7', name: 'Grade 7', code: 'G7', levelType: 'junior', order: 9, numericLevel: 7 },
    { id: '8', name: 'Grade 8', code: 'G8', levelType: 'junior', order: 10, numericLevel: 8 },
    { id: '9', name: 'Grade 9', code: 'G9', levelType: 'junior', order: 11, numericLevel: 9 }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access results');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (results.length > 0 && exams.length > 0) {
      calculateAnalytics();
    }
  }, [results, exams, selectedExam, selectedClass, selectedStream, selectedSubject]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resultsRes, examsRes, classesRes, studentsRes, teachersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/results/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/exams/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/students/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/teachers/`, { headers: getAuthHeaders() })
      ]);

      const resultsData = await resultsRes.json();
      const examsData = await examsRes.json();
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const teachersData = await teachersRes.json();

      if (resultsData.success) setResults(resultsData.data);
      if (examsData.success) setExams(examsData.data.filter(e => e.status === 'published'));
      if (classesData.success) setClasses(classesData.data);
      if (studentsData.success) setStudents(studentsData.data);
      if (teachersData.success) setTeachers(teachersData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = () => {
    let filteredResults = [...results];
    
    if (selectedExam) {
      filteredResults = filteredResults.filter(r => r.exam_id == selectedExam);
    }
    if (selectedClass) {
      filteredResults = filteredResults.filter(r => r.class_id == selectedClass);
    }
    if (selectedSubject) {
      filteredResults = filteredResults.filter(r => r.subject === selectedSubject);
    }

    // School Performance
    const scores = filteredResults.map(r => r.score);
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const passed = filteredResults.filter(r => r.score >= 50).length;
    const passRate = filteredResults.length ? (passed / filteredResults.length) * 100 : 0;

    // Grade Distribution
    const gradeDist = {};
    EIGHT_POINT_SCALE.forEach(grade => {
      const count = filteredResults.filter(r => {
        if (grade.percentage === '90-100%') return r.score >= 90;
        if (grade.percentage === '75-89%') return r.score >= 75 && r.score < 90;
        if (grade.percentage === '58-74%') return r.score >= 58 && r.score < 75;
        if (grade.percentage === '41-57%') return r.score >= 41 && r.score < 58;
        if (grade.percentage === '31-40%') return r.score >= 31 && r.score < 41;
        if (grade.percentage === '21-30%') return r.score >= 21 && r.score < 31;
        if (grade.percentage === '11-20%') return r.score >= 11 && r.score < 21;
        return r.score < 11;
      }).length;
      gradeDist[grade.level] = count;
    });

    // Class Performance
    const classPerf = {};
    classes.forEach(cls => {
      const classResults = filteredResults.filter(r => r.class_id === cls.id);
      if (classResults.length) {
        const classScores = classResults.map(r => r.score);
        classPerf[cls.id] = {
          className: cls.class_name,
          average: classScores.reduce((a, b) => a + b, 0) / classScores.length,
          count: classResults.length,
          passRate: (classResults.filter(r => r.score >= 50).length / classResults.length) * 100
        };
      }
    });

    // Subject Performance
    const subjects = [...new Set(filteredResults.map(r => r.subject))];
    const subjectPerf = subjects.map(subject => {
      const subjectResults = filteredResults.filter(r => r.subject === subject);
      const subjectScores = subjectResults.map(r => r.score);
      return {
        subject,
        average: subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length,
        count: subjectResults.length,
        highest: Math.max(...subjectScores),
        lowest: Math.min(...subjectScores)
      };
    }).sort((a, b) => b.average - a.average);

    setAnalytics({
      schoolPerformance: {
        averageScore: Math.round(avgScore * 100) / 100,
        passRate: Math.round(passRate * 100) / 100,
        totalResults: filteredResults.length,
        totalStudents: new Set(filteredResults.map(r => r.student_id)).size,
        gradeDistribution: gradeDist
      },
      classPerformance: Object.values(classPerf).sort((a, b) => b.average - a.average),
      subjectPerformance: subjectPerf,
      topSubjects: subjectPerf.slice(0, 3),
      bottomSubjects: subjectPerf.slice(-3)
    });
  };

  const getGradeLevel = (student) => {
    const classObj = classes.find(c => c.id == student?.current_class);
    const className = classObj?.class_name || '';
    if (className.includes('PP') || className.includes('Pre-Primary')) return 'early_years';
    if (['1', '2', '3'].some(g => className.includes(g))) return 'lower_primary';
    if (['4', '5', '6'].some(g => className.includes(g))) return 'upper_primary';
    if (['7', '8', '9'].some(g => className.includes(g))) return 'junior';
    return 'upper_primary';
  };

  const calculateGrade = (percentage, gradeLevel) => {
    if (gradeLevel === 'early_years' || gradeLevel === 'lower_primary') {
      if (percentage >= 90) return FOUR_POINT_SCALE[0];
      if (percentage >= 75) return FOUR_POINT_SCALE[1];
      if (percentage >= 58) return FOUR_POINT_SCALE[2];
      return FOUR_POINT_SCALE[3];
    } else {
      if (percentage >= 90) return EIGHT_POINT_SCALE[0];
      if (percentage >= 75) return EIGHT_POINT_SCALE[1];
      if (percentage >= 58) return EIGHT_POINT_SCALE[2];
      if (percentage >= 41) return EIGHT_POINT_SCALE[3];
      if (percentage >= 31) return EIGHT_POINT_SCALE[4];
      if (percentage >= 21) return EIGHT_POINT_SCALE[5];
      if (percentage >= 11) return EIGHT_POINT_SCALE[6];
      return EIGHT_POINT_SCALE[7];
    }
  };

  const generateStudentReport = (student) => {
    const studentResults = results.filter(r => r.student_id === student.id);
    const exam = exams.find(e => e.id == selectedExam);
    const gradeLevel = getGradeLevel(student);
    
    const subjectGrades = [];
    const subjects = [...new Set(studentResults.map(r => r.subject))];
    
    subjects.forEach(subject => {
      const subjectResults = studentResults.filter(r => r.subject === subject);
      const avgScore = subjectResults.reduce((a, b) => a + b.score, 0) / subjectResults.length;
      const grade = calculateGrade(avgScore, gradeLevel);
      subjectGrades.push({
        subject,
        score: Math.round(avgScore),
        grade: gradeLevel === 'early_years' || gradeLevel === 'lower_primary' ? grade.short : grade.level,
        level: grade.level,
        color: grade.color
      });
    });

    setReportData({ student, exam, gradeLevel, subjectGrades, generatedDate: new Date().toLocaleDateString() });
    setShowReportModal(true);
  };

  const generateBulkReports = async () => {
    if (!bulkGeneration.examId || bulkGeneration.classIds.length === 0) {
      addNotification('warning', 'Please select exam and at least one class');
      return;
    }
    
    addNotification('info', `Generating ${bulkGeneration.classIds.length} class reports...`);
    // Implementation for bulk report generation
    addNotification('success', 'Bulk reports generated successfully');
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      addNotification('warning', 'Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('exam_id', bulkGeneration.examId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/results/bulk-upload/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification('success', `Uploaded ${data.count} results successfully`);
        setShowBulkImportModal(false);
        setUploadFile(null);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to upload results');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      addNotification('error', 'Failed to upload file');
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = results.map(result => {
        const student = students.find(s => s.id === result.student_id);
        const exam = exams.find(e => e.id == result.exam_id);
        return {
          'Student Name': `${student?.first_name} ${student?.last_name}`,
          'Admission No': student?.admission_no,
          'UPI Number': student?.upi_number,
          'Exam': exam?.title,
          'Subject': result.subject,
          'Score (%)': result.score,
          'Date': result.created_at?.split('T')[0]
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
      XLSX.writeFile(workbook, `cbc_results_${new Date().toISOString().split('T')[0]}.xlsx`);
      addNotification('success', `Exported ${exportData.length} results successfully`);
    } catch (error) {
      console.error('Error exporting:', error);
      addNotification('error', 'Failed to export data.');
    }
  };

  const downloadTemplate = () => {
    const template = [
      { student_id: 'STU001', subject: 'Mathematics', score: 85, exam_id: 'EXAM001' },
      { student_id: 'STU001', subject: 'English', score: 78, exam_id: 'EXAM001' }
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'results_upload_template.xlsx');
    addNotification('success', 'Template downloaded');
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access results</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="mb-8 bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">CBC Results & Analytics</h1>
            <p className="text-blue-100 mt-1">Competency-Based Curriculum assessment reporting and analytics</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowBulkImportModal(true)} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
              <Upload className="h-4 w-4 inline mr-2" />
              Bulk Import
            </button>
            <button onClick={exportToExcel} className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
              <Download className="h-4 w-4 inline mr-2" />
              Export
            </button>
            <button onClick={fetchData} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-300 pb-4">
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'analytics' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          School Analytics
        </button>
        <button 
          onClick={() => setActiveTab('classes')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'classes' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Class Performance
        </button>
        <button 
          onClick={() => setActiveTab('students')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'students' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <GraduationCap className="h-4 w-4 inline mr-2" />
          Student Reports
        </button>
        <button 
          onClick={() => setActiveTab('bulk')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'bulk' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Bulk Generation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Kiswahili">Kiswahili</option>
              <option value="Science">Science</option>
              <option value="Integrated Science">Integrated Science</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <button onClick={() => { setSelectedExam(''); setSelectedClass(''); setSelectedSubject(''); }} className="text-xs text-blue-700 hover:text-blue-900 font-bold">
            Clear All Filters
          </button>
          {isLoading && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
        </div>
      </div>

      {/* TAB 1: SCHOOL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.schoolPerformance.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border border-blue-200">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{analytics.schoolPerformance.passRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.schoolPerformance.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border border-purple-200">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Results</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.schoolPerformance.totalResults}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 flex items-center justify-center border border-orange-200">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white border border-gray-300 mb-6">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Grade Distribution (8-Point Scale)</h2>
              <p className="text-sm text-gray-600 mt-0.5">Performance breakdown by achievement level</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {EIGHT_POINT_SCALE.map(grade => (
                  <div key={grade.level} className="text-center p-3 border border-gray-200">
                    <div className={`${grade.color} px-3 py-2 font-bold text-lg`}>{grade.level}</div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{analytics.schoolPerformance.gradeDistribution[grade.level] || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">{grade.percentage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Subject Performance Analysis</h2>
              <p className="text-sm text-gray-600 mt-0.5">Average scores by learning area</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Subject</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Average Score</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Highest</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Lowest</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.subjectPerformance.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{subject.subject}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{subject.average}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-green-600">{subject.highest}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-red-600">{subject.lowest}%</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 h-2">
                            <div className="bg-blue-600 h-2" style={{ width: `${subject.average}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{Math.round(subject.average)}%</span>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASS PERFORMANCE */}
      {activeTab === 'classes' && (
        <div>
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Class Performance Comparison</h2>
              <p className="text-sm text-gray-600 mt-0.5">Average scores and pass rates by stream</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Stream</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Students</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Average Score</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Pass Rate</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Performance Trend</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.classPerformance.map((cls, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{cls.className}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{cls.count}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{Math.round(cls.average)}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium ${cls.passRate >= 80 ? 'bg-green-100 text-green-800' : cls.passRate >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {Math.round(cls.passRate)}%
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 h-2">
                            <div className={`h-2 ${cls.average >= 70 ? 'bg-green-600' : cls.average >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{ width: `${cls.average}%` }}></div>
                          </div>
                          {cls.average >= 70 ? <ArrowUp className="h-3 w-3 text-green-600" /> : <ArrowDown className="h-3 w-3 text-red-600" />}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                          View Details
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

      {/* TAB 3: STUDENT REPORTS */}
      {activeTab === 'students' && (
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
            <h2 className="text-md font-bold text-gray-900">Individual Student Reports</h2>
            <p className="text-sm text-gray-600 mt-0.5">Generate and download CBC assessment reports</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Admission No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 hidden md:table-cell">UPI Number</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 hidden sm:table-cell">Class</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-4 py-12 text-center text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-4 py-12 text-center text-gray-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                      <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-xs">{student.upi_number || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 hidden sm:table-cell">{classes.find(c => c.id == student.current_class)?.class_name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button onClick={() => generateStudentReport(student)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                          <Eye className="h-3 w-3 inline mr-1" />
                          Generate Report
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BULK GENERATION */}
      {activeTab === 'bulk' && (
        <div className="bg-white border border-gray-300 p-6">
          <h2 className="text-md font-bold text-gray-900 mb-2">Bulk Report Generation</h2>
          <p className="text-sm text-gray-600 mb-6">Generate reports for multiple students or entire classes at once</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
              <select 
                value={bulkGeneration.examId}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Classes</label>
              <select 
                multiple 
                value={bulkGeneration.classIds}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, classIds: Array.from(e.target.selectedOptions, opt => opt.value) })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white h-32"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl to select multiple classes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Report Format</label>
              <select 
                value={bulkGeneration.format}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="both">Both PDF & Excel</option>
              </select>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={bulkGeneration.includeCompetencies}
                  onChange={(e) => setBulkGeneration({ ...bulkGeneration, includeCompetencies: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Include Competencies Assessment</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={bulkGeneration.includeValues}
                  onChange={(e) => setBulkGeneration({ ...bulkGeneration, includeValues: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Include Values Assessment</span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800">Bulk Generation Notice</p>
                <p className="text-sm text-gray-700 mt-1">This will generate reports for all students in the selected classes. The process may take a few minutes depending on the number of students.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={generateBulkReports} className="px-5 py-2 bg-blue-700 text-white text-sm font-bold border border-blue-800 hover:bg-blue-800">
              Generate Bulk Reports
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBulkImportModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Bulk Import Results</h3>
              <button onClick={() => setShowBulkImportModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
                <select 
                  value={bulkGeneration.examId}
                  onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload File</label>
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={downloadTemplate} className="text-sm text-blue-600 hover:text-blue-800">
                  Download Template
                </button>
              </div>
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 h-2">
                    <div className="bg-blue-600 h-2" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowBulkImportModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleBulkUpload} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Report Modal */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center no-print">
              <h3 className="text-md font-bold text-gray-900">CBC Assessment Report</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-1 bg-gray-600 text-white text-xs font-medium border border-gray-700 hover:bg-gray-700">
                  <Printer className="h-3 w-3 inline mr-1" />
                  Print
                </button>
                <button onClick={() => setShowReportModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
              </div>
            </div>
            <div ref={printRef} className="p-6">
              {/* School Header */}
              <div className="text-center mb-6 pb-4 border-b border-gray-300">
                <h1 className="text-2xl font-bold text-gray-900">KIBERA ACADEMY</h1>
                <p className="text-sm text-gray-600">Ministry of Education Registration: KCBA001</p>
                <p className="text-xs text-gray-500">P.O. Box 12345-00100, Nairobi | Tel: 020-1234567</p>
              </div>

              {/* Student Profile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-300 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Student Name</p>
                  <p className="font-bold text-gray-900">{reportData.student.first_name} {reportData.student.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission Number</p>
                  <p className="font-bold text-gray-900">{reportData.student.admission_no}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">UPI Number</p>
                  <p className="font-bold text-gray-900">{reportData.student.upi_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-bold text-gray-900">{classes.find(c => c.id == reportData.student.current_class)?.class_name}</p>
                </div>
              </div>

              {/* Subject Grades */}
              <h3 className="text-md font-bold text-gray-800 mb-3">Academic Performance</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-bold">Subject</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold">Score (%)</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold">Grade</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold">Achievement Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.subjectGrades.map((subject, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">{subject.subject}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">{subject.score}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">{subject.grade}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <span className={`px-2 py-1 text-xs font-bold ${subject.color}`}>{subject.level}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Achievement Level Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(reportData.gradeLevel === 'upper_primary' || reportData.gradeLevel === 'junior' ? EIGHT_POINT_SCALE : FOUR_POINT_SCALE).map(grade => (
                    <div key={grade.level} className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 text-xs font-bold ${grade.color}`}>{grade.level}</span>
                      <span className="text-gray-600">{grade.label}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>Generated on: {reportData.generatedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsReporting;