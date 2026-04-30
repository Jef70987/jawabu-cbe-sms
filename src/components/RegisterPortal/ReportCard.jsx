/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileText, Download, Printer, TrendingUp, Users, 
  BarChart3, AlertCircle, CheckCircle, X, Loader2,
  Eye, RefreshCw, Upload, GraduationCap, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// CBC/CBE Grading Schemes (display only)
const FOUR_POINT_SCALE = [
  { level: 4, label: 'Exceeding Expectations (EE)', short: 'EE', color: 'bg-green-100 text-green-800' },
  { level: 3, label: 'Meeting Expectations (ME)', short: 'ME', color: 'bg-blue-100 text-blue-800' },
  { level: 2, label: 'Approaching Expectations (AE)', short: 'AE', color: 'bg-yellow-100 text-yellow-800' },
  { level: 1, label: 'Below Expectations (BE)', short: 'BE', color: 'bg-red-100 text-red-800' }
];

const EIGHT_POINT_SCALE = [
  { points: 8, level: 'EE1', original: 'Exceeding Expectations', percentage: '90-100%', color: 'bg-green-100 text-green-800' },
  { points: 7, level: 'EE2', original: 'Exceeding Expectations', percentage: '75-89%', color: 'bg-green-100 text-green-800' },
  { points: 6, level: 'ME1', original: 'Meeting Expectations', percentage: '58-74%', color: 'bg-blue-100 text-blue-800' },
  { points: 5, level: 'ME2', original: 'Meeting Expectations', percentage: '41-57%', color: 'bg-blue-100 text-blue-800' },
  { points: 4, level: 'AE1', original: 'Approaching Expectations', percentage: '31-40%', color: 'bg-yellow-100 text-yellow-800' },
  { points: 3, level: 'AE2', original: 'Approaching Expectations', percentage: '21-30%', color: 'bg-yellow-100 text-yellow-800' },
  { points: 2, level: 'BE1', original: 'Below Expectations', percentage: '11-20%', color: 'bg-red-100 text-red-800' },
  { points: 1, level: 'BE2', original: 'Below Expectations', percentage: '0-10%', color: 'bg-red-100 text-red-800' }
];

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
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 shadow-lg ${styles[type]}`}>
      <div className="flex items-start">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mr-3" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mr-3" />}
        <div className="flex-1">
          <p className="text-sm font-bold">{type === 'success' ? 'Success' : 'Error'}</p>
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
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Bulk Generation
  const [bulkGeneration, setBulkGeneration] = useState({
    examId: '',
    classIds: [],
    format: 'pdf',
    includeCompetencies: true,
    includeValues: true
  });
  
  const [analytics, setAnalytics] = useState({
    total_results: 0,
    average_score: 0,
    pass_rate: 0,
    total_students: 0,
    grade_distribution: {},
    top_performers: [],
    subject_performance: [],
    class_performance: []
  });

  const printRef = useRef();

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access results');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAnalytics();
    fetchResults();
  }, [selectedExam, selectedClass, selectedSubject]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [examsRes, classesRes, studentsRes, subjectsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/exams/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/students/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/resultsreport/subjects/`, { headers: getAuthHeaders() })
      ]);

      const examsData = await examsRes.json();
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const subjectsData = await subjectsRes.json();

      if (examsData.success) setExams(examsData.data || []);
      if (classesData.success) setClasses(classesData.data || []);
      if (studentsData.success) setStudents(studentsData.data || []);
      if (subjectsData.success) setSubjects(subjectsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/`;
      const params = new URLSearchParams();
      if (selectedExam) params.append('exam_id', selectedExam);
      if (selectedClass) params.append('class_id', selectedClass);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setResults(data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/analytics/`;
      const params = new URLSearchParams();
      if (selectedExam) params.append('exam_id', selectedExam);
      if (selectedClass) params.append('class_id', selectedClass);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchStudentReport = async (student) => {
    setSelectedStudent(student);
    setIsLoading(true);
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/student/${student.id}/`;
      if (selectedExam) url += `?exam_id=${selectedExam}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        setStudentReport(data.data);
        setShowReportModal(true);
      } else {
        addNotification('error', data.error || 'Failed to fetch student report');
      }
    } catch (error) {
      console.error('Error fetching student report:', error);
      addNotification('error', 'Failed to fetch student report');
    } finally {
      setIsLoading(false);
    }
  };

 const generateBulkReports = async () => {
    if (!bulkGeneration.examId || bulkGeneration.classIds.length === 0) {
      addNotification('warning', 'Please select exam and at least one class');
      return;
    }
    
    setUploading(true);
    addNotification('info', `Generating reports for ${bulkGeneration.classIds.length} classes...`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/resultsreport/bulk-generate/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          exam_id: bulkGeneration.examId,
          class_ids: bulkGeneration.classIds,
          format: bulkGeneration.format,
          include_competencies: bulkGeneration.includeCompetencies,
          include_values: bulkGeneration.includeValues
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Generated ${data.data.total_students} reports successfully`);
        
        // Export to Excel if requested
        if (bulkGeneration.format === 'excel' || bulkGeneration.format === 'both') {
          const exportData = data.data.reports.flatMap(report => 
            report.subjects.map(subject => ({
              'Student Name': report.student_name,
              'Admission No': report.admission_no,
              'Class': report.class_name,
              'Exam': report.exam_title,
              'Subject': subject.subject,
              'Score (%)': subject.score,
              'Grade': subject.grade
            }))
          );
          
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk Reports');
          XLSX.writeFile(workbook, `bulk_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
          addNotification('success', 'Excel file downloaded');
        }
        
        // Show summary
        addNotification('info', `Reports cover ${data.data.total_students} students across ${bulkGeneration.classIds.length} classes`);
      } else {
        addNotification('error', data.error || 'Failed to generate reports');
      }
    } catch (error) {
      console.error('Error generating bulk reports:', error);
      addNotification('error', 'Failed to generate bulk reports');
    } finally {
      setUploading(false);
    }
  };

  const fetchStudentReportForBulk = async (student, examId) => {
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/student/${student.id}/`;
      if (examId) url += `?exam_id=${examId}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        // Here you could save to PDF or Excel
        console.log(`Report generated for ${student.first_name} ${student.last_name}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile || !bulkGeneration.examId) {
      addNotification('warning', 'Please select exam and file');
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('exam_id', bulkGeneration.examId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/resultsreport/bulk-upload/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification('success', `Uploaded ${data.saved_count} results successfully`);
        setShowBulkImportModal(false);
        setUploadFile(null);
        await fetchAnalytics();
        await fetchResults();
      } else {
        addNotification('error', data.error || 'Failed to upload results');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      addNotification('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = results.map(result => ({
        'Student Name': result.student_name,
        'Admission No': result.student_admission,
        'Exam': result.exam_title,
        'Subject': result.subject,
        'Score (%)': result.percentage,
        'Grade': result.grade,
        'Date': result.marked_at?.split('T')[0] || ''
      }));

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
      { student_id: 'STU001', subject: 'Mathematics', score: 85 },
      { student_id: 'STU001', subject: 'English', score: 78 }
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

  const clearFilters = () => {
    setSelectedExam('');
    setSelectedClass('');
    setSelectedSubject('');
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
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="mb-8 bg-green-700 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">CBC Results & Analytics</h1>
            <p className="text-blue-100 mt-1">Competency-Based Curriculum assessment reporting</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowBulkImportModal(true)} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 rounded">
              <Upload className="h-4 w-4 inline mr-2" />
              Bulk Import
            </button>
            <button onClick={exportToExcel} className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700 rounded">
              <Download className="h-4 w-4 inline mr-2" />
              Export
            </button>
            <button onClick={fetchData} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-300 pb-4">
        <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2 border text-sm font-medium rounded ${activeTab === 'analytics' ? 'bg-blue-700 text-white border-blue-800' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>
          <BarChart3 className="h-4 w-4 inline mr-2" />
          School Analytics
        </button>
        <button onClick={() => setActiveTab('classes')} className={`px-5 py-2 border text-sm font-medium rounded ${activeTab === 'classes' ? 'bg-blue-700 text-white border-blue-800' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>
          <Users className="h-4 w-4 inline mr-2" />
          Class Performance
        </button>
        <button onClick={() => setActiveTab('students')} className={`px-5 py-2 border text-sm font-medium rounded ${activeTab === 'students' ? 'bg-blue-700 text-white border-blue-800' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>
          <GraduationCap className="h-4 w-4 inline mr-2" />
          Student Reports
        </button>
        <button onClick={() => setActiveTab('bulk')} className={`px-5 py-2 border text-sm font-medium rounded ${activeTab === 'bulk' ? 'bg-blue-700 text-white border-blue-800' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>
          <FileText className="h-4 w-4 inline mr-2" />
          Bulk Generation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 p-4 mb-6 rounded">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
              <option value="">All Subjects</option>
              {subjects.map(subj => (
                <option key={subj.id} value={subj.name}>{subj.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={clearFilters} className="text-xs text-blue-700 hover:text-blue-900 font-bold">Clear All Filters</button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-300 p-5 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(analytics.average_score)}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border border-blue-200 rounded">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{Math.round(analytics.pass_rate)}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center border border-green-200 rounded">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.total_students}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border border-purple-200 rounded">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 p-5 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Results</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.total_results}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 flex items-center justify-center border border-orange-200 rounded">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white border border-gray-300 mb-6 rounded">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Grade Distribution (8-Point Scale)</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {EIGHT_POINT_SCALE.map(grade => (
                  <div key={grade.level} className="text-center p-3 border border-gray-200 rounded">
                    <div className={`${grade.color} px-3 py-2 font-bold text-lg rounded`}>{grade.level}</div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{analytics.grade_distribution?.[grade.level] || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">{grade.percentage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white border border-gray-300 mb-6 rounded">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Top Performers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold">Student Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold">Admission No</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">Average Score</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.top_performers?.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{student.name}</td>
                      <td className="border border-gray-300 px-4 py-3">{student.admission_no}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{student.average_score}%</td>
                    </tr>
                  ))}
                  {(!analytics.top_performers || analytics.top_performers.length === 0) && (
                    <tr><td colSpan="3" className="border border-gray-300 px-4 py-8 text-center text-gray-500">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white border border-gray-300 rounded">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">Subject Performance Analysis</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold">Subject</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">Average Score</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">Highest</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">Lowest</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.subject_performance?.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{subject.subject}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{Math.round(subject.average)}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-green-600">{Math.round(subject.highest)}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-red-600">{Math.round(subject.lowest)}%</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 h-2 rounded">
                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${subject.average}%` }}></div>
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

      {/* Class Performance Tab */}
      {activeTab === 'classes' && (
        <div className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
            <h2 className="text-md font-bold text-gray-900">Class Performance Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold">Stream</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Students</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Average Score</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Pass Rate</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.class_performance?.map((cls, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">{cls.class_name}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{cls.count}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">{Math.round(cls.average)}%</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${cls.pass_rate >= 80 ? 'bg-green-100 text-green-800' : cls.pass_rate >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {Math.round(cls.pass_rate)}%
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {cls.average >= 70 ? <ArrowUp className="h-4 w-4 text-green-600 inline" /> : <ArrowDown className="h-4 w-4 text-red-600 inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Reports Tab */}
      {activeTab === 'students' && (
        <div className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
            <h2 className="text-md font-bold text-gray-900">Individual Student Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold">Admission No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold">Student Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left hidden md:table-cell">UPI Number</th>
                  <th className="border border-gray-300 px-4 py-3 text-left hidden sm:table-cell">Class</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" className="border border-gray-300 px-4 py-12 text-center text-gray-500">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="5" className="border border-gray-300 px-4 py-12 text-center text-gray-400">No students found</td></tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                      <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-xs">{student.upi_number || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 hidden sm:table-cell">{classes.find(c => c.id === student.current_class)?.class_name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button onClick={() => fetchStudentReport(student)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700 rounded">
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

      {/* Bulk Generation Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white border border-gray-300 p-6 rounded">
          <h2 className="text-md font-bold text-gray-900 mb-2">Bulk Report Generation</h2>
          <p className="text-sm text-gray-600 mb-6">Generate reports for multiple students or entire classes at once</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
              <select 
                value={bulkGeneration.examId}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
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
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white h-32 rounded"
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
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
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
          
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800">Bulk Generation Notice</p>
                <p className="text-sm text-gray-700 mt-1">This will generate reports for all students in the selected classes. The process may take a few minutes depending on the number of students.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={generateBulkReports} className="px-5 py-2 bg-blue-700 text-white text-sm font-bold border border-blue-800 hover:bg-blue-800 rounded">
              Generate Bulk Reports
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBulkImportModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full mx-4 rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">Bulk Import Results</h3>
              <button onClick={() => setShowBulkImportModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
                <select 
                  value={bulkGeneration.examId}
                  onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
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
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={downloadTemplate} className="text-sm text-blue-600 hover:text-blue-800">Download Template</button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b">
              <button onClick={() => setShowBulkImportModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded">Cancel</button>
              <button onClick={handleBulkUpload} disabled={uploading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 rounded">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Report Modal */}
      {showReportModal && studentReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0 no-print rounded-t">
              <h3 className="text-md font-bold text-gray-900">CBC Assessment Report</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-1 bg-gray-600 text-white text-xs font-medium border border-gray-700 hover:bg-gray-700 rounded">
                  <Printer className="h-3 w-3 inline mr-1" />
                  Print
                </button>
                <button onClick={() => setShowReportModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
              </div>
            </div>
            <div ref={printRef} className="p-6">
              <div className="text-center mb-6 pb-4 border-b border-gray-300">
                <h1 className="text-2xl font-bold text-gray-900">JAWABU ACADEMY</h1>
                <p className="text-sm text-gray-600">Competency-Based Education Assessment Report</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-300 mb-6 rounded">
                <div>
                  <p className="text-xs text-gray-500">Student Name</p>
                  <p className="font-bold text-gray-900">{studentReport.student?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission Number</p>
                  <p className="font-bold text-gray-900">{studentReport.student?.admission_no}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">UPI Number</p>
                  <p className="font-bold text-gray-900">{studentReport.student?.upi_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-bold text-gray-900">{studentReport.student?.class_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Average Score</p>
                  <p className="font-bold text-gray-900">{Math.round(studentReport.summary?.average_score || 0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Subjects</p>
                  <p className="font-bold text-gray-900">{studentReport.summary?.total_subjects || 0}</p>
                </div>
              </div>

              <h3 className="text-md font-bold text-gray-800 mb-3">Academic Performance</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-bold">Subject</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold">Score (%)</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentReport.results?.map((result, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">{result.subject}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">{Math.round(result.percentage)}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">{result.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-300">
                <p>Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsReporting;