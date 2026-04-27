/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar, Clock, Users, CheckSquare, FileText, TrendingUp,
  AlertCircle, CheckCircle, X, Loader2, Bell, BookOpen,
  Award, Target, Activity, UserCheck, ClipboardList,
  ChevronRight, RefreshCw, GraduationCap, BarChart3,
  Eye, Download, Filter, Search, ChevronDown, ChevronUp,
  UserPlus, UserMinus, Clock as ClockIcon, MapPin, User,
  Trophy, Star, TrendingDown, PieChart, Grid, List,
  Camera, Upload, Edit, Save, Trash2, Plus, Minus
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Toast Notification component
const Toast = ({ type, message, onClose, duration = 4000 }) => {
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
      case 'success': return 'bg-green-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />;
      case 'error': return <AlertCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 shadow-lg ${getStyles()} animate-slide-in-right`}>
      {getIcon()}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }} className="ml-2 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading data...</p>
    </div>
  </div>
);

function ClassProfile() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState('my-class');
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [subjectClasses, setSubjectClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState({ class: true, students: true, analytics: true, attendance: false, assessment: false, evidence: false });
  const [toasts, setToasts] = useState([]);
  const [classAnalytics, setClassAnalytics] = useState({
    meanScore: 0,
    classRank: 0,
    totalStreams: 0,
    performanceDistribution: {},
    subjectMastery: [],
    topPerformers: [],
    mostImproved: []
  });
  
  // Modal states
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Form states
  const [attendanceForm, setAttendanceForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    period: 'morning'
  });
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [attendanceRemarks, setAttendanceRemarks] = useState({});
  const [assessmentForm, setAssessmentForm] = useState({ 
    title: '', 
    maxScore: 100, 
    date: new Date().toISOString().split('T')[0], 
    scores: {} 
  });
  const [evidenceForm, setEvidenceForm] = useState({ studentId: '', description: '', file: null });
  
  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Refs for aborting requests
  const abortControllers = useRef({});

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch with abort
  const fetchWithAbort = useCallback(async (url, options, key) => {
    if (abortControllers.current[key]) {
      abortControllers.current[key].abort();
    }
    
    const controller = new AbortController();
    abortControllers.current[key] = controller;
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
      return null;
    }
  }, []);

  const fetchMyClasses = useCallback(async () => {
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/my-classes/`,
        { headers: getAuthHeaders() },
        'myClasses'
      );
      if (data && data.success) {
        setMyClasses(data.data);
        if (data.data.length > 0 && !selectedStream) {
          setSelectedStream(data.data[0]);
        }
      } else if (data && !data.success) {
        if (data.message !== 'You are not assigned to any class') {
          addToast('error', data.message || 'Failed to load classes');
        }
      }
    } catch (error) {
      console.error('Error fetching my classes:', error);
      addToast('error', 'Network error loading classes');
    }
  }, [getAuthHeaders, fetchWithAbort, selectedStream]);

  const fetchSubjectClasses = useCallback(async () => {
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/subject-classes/`,
        { headers: getAuthHeaders() },
        'subjectClasses'
      );
      if (data && data.success) {
        setSubjectClasses(data.data);
        if (data.data.length > 0 && !selectedSubject) {
          setSelectedSubject(data.data[0]);
        }
      } else if (data && !data.success) {
        addToast('error', data.message || 'Failed to load subject classes');
      }
    } catch (error) {
      console.error('Error fetching subject classes:', error);
      addToast('error', 'Network error loading subject classes');
    }
  }, [getAuthHeaders, fetchWithAbort, selectedSubject]);

  const fetchStudents = useCallback(async () => {
    const classId = activeTab === 'my-class' ? selectedStream?.id : selectedSubject?.id;
    if (!classId) return;
    
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/class-students/${classId}/`,
        { headers: getAuthHeaders() },
        'students'
      );
      if (data && data.success) {
        setStudents(data.data);
        const initialStatuses = {};
        const initialRemarks = {};
        data.data.forEach(student => {
          initialStatuses[student.id] = 'present';
          initialRemarks[student.id] = '';
        });
        setAttendanceStatuses(initialStatuses);
        setAttendanceRemarks(initialRemarks);
      } else if (data && !data.success) {
        addToast('error', data.message || 'Failed to load students');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      addToast('error', 'Network error loading students');
      setStudents([]);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  }, [activeTab, selectedStream, selectedSubject, getAuthHeaders, fetchWithAbort]);

  const fetchClassAnalytics = useCallback(async () => {
    if (!selectedStream?.id) return;
    
    setLoading(prev => ({ ...prev, analytics: true }));
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/class-analytics/${selectedStream.id}/`,
        { headers: getAuthHeaders() },
        'analytics'
      );
      if (data && data.success) {
        setClassAnalytics(data.data);
      } else if (data && !data.success) {
        addToast('error', data.message || 'Failed to load analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      addToast('error', 'Network error loading analytics');
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  }, [selectedStream, getAuthHeaders, fetchWithAbort]);

  const fetchClassData = useCallback(async () => {
    setLoading({ class: true, students: true, analytics: true, attendance: false, assessment: false, evidence: false });
    try {
      await Promise.all([
        fetchMyClasses(),
        fetchSubjectClasses()
      ]);
    } catch (error) {
      console.error('Error fetching class data:', error);
      addToast('error', 'Failed to load class data');
    } finally {
      setLoading(prev => ({ ...prev, class: false }));
    }
  }, [fetchMyClasses, fetchSubjectClasses]);

  // Initial load
  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access class profile');
      return;
    }
    fetchClassData();
  }, [isAuthenticated, fetchClassData]);

  // Load students and analytics when selected class changes
  useEffect(() => {
    if (selectedStream?.id && activeTab === 'my-class') {
      fetchStudents();
      fetchClassAnalytics();
    }
  }, [selectedStream?.id, activeTab, fetchStudents, fetchClassAnalytics]);

  // Load students when selected subject changes
  useEffect(() => {
    if (selectedSubject?.id && activeTab === 'subject-classes') {
      fetchStudents();
    }
  }, [selectedSubject?.id, activeTab, fetchStudents]);

  const handleAttendanceSubmit = async () => {
    if (!selectedStream?.id && !selectedSubject?.id) {
      addToast('warning', 'No class selected');
      return;
    }

    setLoading(prev => ({ ...prev, attendance: true }));
    try {
      const records = students.map(student => ({
        student_id: student.id,
        status: attendanceStatuses[student.id] || 'present',
        remarks: attendanceRemarks[student.id] || ''
      }));

      const payload = {
        date: attendanceForm.date,
        period: attendanceForm.period,
        records: records,
        class_id: selectedStream?.id || null
      };

      const response = await fetch(`${API_BASE_URL}/api/teacher/attendance/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        addToast('success', 'Attendance recorded successfully');
        setShowAttendanceModal(false);
        // Refresh analytics to update attendance stats
        await fetchClassAnalytics();
      } else {
        addToast('error', data.message || 'Failed to record attendance');
      }
    } catch (error) {
      console.error('Attendance error:', error);
      addToast('error', 'Error recording attendance');
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  const handleAssessmentSubmit = async () => {
    if (!assessmentForm.title) {
      addToast('warning', 'Please enter assessment title');
      return;
    }

    setLoading(prev => ({ ...prev, assessment: true }));
    try {
      const scores = Object.entries(assessmentForm.scores).map(([studentId, score]) => ({
        student_id: studentId,
        score: parseInt(score) || 0,
        feedback: ''
      }));

      const payload = {
        title: assessmentForm.title,
        max_score: assessmentForm.maxScore,
        date: assessmentForm.date,
        class_id: selectedStream?.id,
        subject: selectedSubject?.subject_name || 'General',
        scores: scores
      };

      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment saved successfully');
        setShowAssessmentModal(false);
        setAssessmentForm({ title: '', maxScore: 100, date: new Date().toISOString().split('T')[0], scores: {} });
        await fetchStudents();
        await fetchClassAnalytics();
      } else {
        addToast('error', data.message || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Assessment error:', error);
      addToast('error', 'Error saving assessment');
    } finally {
      setLoading(prev => ({ ...prev, assessment: false }));
    }
  };

  const handleEvidenceUpload = async () => {
    if (!evidenceForm.file) {
      addToast('warning', 'Please select a file to upload');
      return;
    }
    if (!evidenceForm.studentId) {
      addToast('warning', 'Please select a student');
      return;
    }
    
    setLoading(prev => ({ ...prev, evidence: true }));
    try {
      const formData = new FormData();
      formData.append('student_id', evidenceForm.studentId);
      formData.append('description', evidenceForm.description);
      formData.append('file', evidenceForm.file);
      
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeaders().Authorization
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Evidence uploaded successfully');
        setShowEvidenceModal(false);
        setEvidenceForm({ studentId: '', description: '', file: null });
      } else {
        addToast('error', data.message || 'Failed to upload evidence');
      }
    } catch (error) {
      console.error('Evidence error:', error);
      addToast('error', 'Error uploading evidence');
    } finally {
      setLoading(prev => ({ ...prev, evidence: false }));
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'EE', color: 'bg-green-600', label: 'Exceeding Expectations' };
    if (score >= 75) return { level: 'ME', color: 'bg-blue-600', label: 'Meeting Expectations' };
    if (score >= 60) return { level: 'AE', color: 'bg-yellow-600', label: 'Approaching Expectations' };
    return { level: 'BE', color: 'bg-red-600', label: 'Below Expectations' };
  };

  const updateAttendanceStatus = (studentId, status) => {
    setAttendanceStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const updateAttendanceRemark = (studentId, remark) => {
    setAttendanceRemarks(prev => ({ ...prev, [studentId]: remark }));
  };

  const updateAssessmentScore = (studentId, score) => {
    setAssessmentForm(prev => ({
      ...prev,
      scores: { ...prev.scores, [studentId]: score }
    }));
  };

  // Calculate attendance rate from students data
  const averageAttendanceRate = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / students.length)
    : 0;

  const filteredStudents = students.filter(s => {
    if (!searchTerm) return true;
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const admissionNo = (s.admission_no || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || admissionNo.includes(searchLower);
  }).sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = `${a.first_name} ${a.last_name}`;
      const nameB = `${b.first_name} ${b.last_name}`;
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'score') return (b.current_score || 0) - (a.current_score || 0);
    if (sortBy === 'attendance') return (b.attendance_rate || 0) - (a.attendance_rate || 0);
    return 0;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access class profile</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const isLoading = loading.class || loading.students || loading.analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      {isLoading && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 px-6 py-6 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Class Profile</h1>
            <p className="text-green-100 mt-1">Manage your class, track attendance, and monitor student progress</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchClassData} 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 inline mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white px-6 w-full">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('my-class')}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'my-class'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            My Class (Owner View)
          </button>
          <button
            onClick={() => setActiveTab('subject-classes')}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'subject-classes'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Subject Classes (Instructor View)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 w-full">
        {/* TAB 1: MY CLASS */}
        {activeTab === 'my-class' && (
          <div className="w-full">
            {/* Class Selector */}
            {myClasses.length > 1 && (
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Select Class:</label>
                <select
                  value={selectedStream?.id || ''}
                  onChange={(e) => {
                    const selected = myClasses.find(c => c.id === e.target.value);
                    setSelectedStream(selected);
                  }}
                  className="px-3 py-2 border border-gray-300 text-sm bg-white"
                >
                  {myClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} {cls.class_teacher_name === `${user?.first_name} ${user?.last_name}` ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedStream && students.length === 0 && !loading.students && (
              <div className="bg-yellow-50 border border-yellow-200 p-8 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-yellow-800 mb-1">No Students Found</h3>
                <p className="text-yellow-600">This class has no students assigned yet.</p>
              </div>
            )}

            {selectedStream && students.length > 0 && (
              <>
                {/* Class Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Capacity: {selectedStream.capacity || 'N/A'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Mean Score</p>
                    <p className="text-2xl font-bold text-green-700">{classAnalytics.meanScore || 0}%</p>
                    <p className="text-xs text-gray-500 mt-1">Rank: #{classAnalytics.classRank || 1} of {classAnalytics.totalStreams || 1}</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-700">{averageAttendanceRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Daily average</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Portfolio Completion</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {Math.round(students.filter(s => s.last_assessment > 0).length / students.length * 100)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Assessed students</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Class Rank</p>
                    <p className="text-2xl font-bold text-purple-700">#{classAnalytics.classRank || 1}</p>
                    <p className="text-xs text-gray-500 mt-1">Out of {classAnalytics.totalStreams || 1} streams</p>
                  </div>
                </div>

                {/* Subject Mastery Section */}
                {classAnalytics.subjectMastery && classAnalytics.subjectMastery.length > 0 && (
                  <div className="bg-white border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                      <h2 className="font-bold text-gray-900">Subject Mastery</h2>
                      <p className="text-xs text-gray-600">Performance across all subjects</p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {classAnalytics.subjectMastery.map(subject => (
                          <div key={subject.subject}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{subject.subject}</span>
                              <span className={subject.score >= subject.class_avg ? 'text-green-700' : 'text-red-700'}>
                                {subject.score}% {subject.score >= subject.class_avg ? '▲' : '▼'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2">
                              <div 
                                className={`h-2 ${subject.score >= subject.class_avg ? 'bg-green-600' : 'bg-red-600'}`}
                                style={{ width: `${subject.score}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Class avg: {subject.class_avg}% | Rank: #{subject.rank}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Performers & Most Improved */}
                {(classAnalytics.topPerformers?.length > 0 || classAnalytics.mostImproved?.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {classAnalytics.topPerformers?.length > 0 && (
                      <div className="bg-white border border-gray-200">
                        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
                          <div>
                            <h2 className="font-bold text-gray-900">Top Performers</h2>
                            <p className="text-xs text-gray-600">Highest overall scores</p>
                          </div>
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="divide-y divide-gray-200">
                          {classAnalytics.topPerformers.map((student, idx) => (
                            <div 
                              key={student.id} 
                              className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                              onClick={() => { 
                                const fullStudent = students.find(s => s.id === student.id);
                                setSelectedStudent(fullStudent || student); 
                                setShowStudentProfileModal(true); 
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">Improvement: {student.improvement}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-700">{student.score}%</p>
                                <p className="text-xs text-gray-500">{getPerformanceLevel(student.score).level}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {classAnalytics.mostImproved?.length > 0 && (
                      <div className="bg-white border border-gray-200">
                        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
                          <div>
                            <h2 className="font-bold text-gray-900">Most Improved</h2>
                            <p className="text-xs text-gray-600">Since last assessment</p>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="divide-y divide-gray-200">
                          {classAnalytics.mostImproved.map((student) => (
                            <div 
                              key={student.id} 
                              className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                              onClick={() => { 
                                const fullStudent = students.find(s => s.id === student.id);
                                setSelectedStudent(fullStudent || student); 
                                setShowStudentProfileModal(true); 
                              }}
                            >
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.from_score}% → {student.to_score}%</p>
                              </div>
                              <div className="px-2 py-1 bg-green-100 text-green-800 text-sm font-bold">
                                +{student.improvement}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Student Register Table */}
                <div className="bg-white border border-gray-200">
                  <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="font-bold text-gray-900">Student Register</h2>
                      <p className="text-xs text-gray-600">Official daily attendance & student records</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button 
                        onClick={() => setShowAttendanceModal(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                      >
                        <UserCheck className="h-3 w-3 inline mr-1" />
                        Take Attendance
                      </button>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="px-2 py-1.5 text-sm border border-gray-300 w-40"
                        />
                        <select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)} 
                          className="px-2 py-1.5 text-sm border border-gray-300"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="score">Sort by Score</option>
                          <option value="attendance">Sort by Attendance</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Admission No.</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Gender</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Current Score</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Target Level</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Attendance</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                              No students found matching your search
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => {
                            const perf = getPerformanceLevel(student.current_score || 0);
                            return (
                              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-600">{student.admission_no || 'N/A'}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{student.full_name || `${student.first_name} ${student.last_name}`}</td>
                                <td className="px-4 py-3 text-center text-gray-600">{student.gender || 'N/A'}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 text-xs font-bold text-white ${perf.color}`}>
                                    {student.current_score || 0}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800">{student.target_level || 'ME'}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <div className="w-16 bg-gray-200 h-1.5">
                                      <div className="bg-green-600 h-1.5" style={{ width: `${student.attendance_rate || 0}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-600">{student.attendance_rate || 0}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button 
                                    onClick={() => { setSelectedStudent(student); setShowStudentProfileModal(true); }}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="View Profile"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: SUBJECT CLASSES */}
        {activeTab === 'subject-classes' && (
          <div className="w-full">
            {/* Class Selector */}
            <div className="mb-6 bg-white border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Select Stream:</label>
                <select
                  value={selectedSubject?.id || ''}
                  onChange={(e) => {
                    const selected = subjectClasses.find(c => c.id === e.target.value);
                    setSelectedSubject(selected);
                  }}
                  className="px-3 py-2 border border-gray-300 text-sm bg-white flex-1"
                >
                  {subjectClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.subject_name} {cls.period ? `(${cls.period})` : ''}
                    </option>
                  ))}
                </select>
                {selectedSubject && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {selectedSubject.period && (
                      <span><ClockIcon className="h-4 w-4 inline mr-1" />{selectedSubject.period}</span>
                    )}
                    {selectedSubject.room && (
                      <span><MapPin className="h-4 w-4 inline mr-1" />{selectedSubject.room}</span>
                    )}
                    <span><Users className="h-4 w-4 inline mr-1" />{selectedSubject.students_count || students.length} Students</span>
                  </div>
                )}
              </div>
            </div>

            {selectedSubject && students.length === 0 && !loading.students && (
              <div className="bg-yellow-50 border border-yellow-200 p-8 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-yellow-800 mb-1">No Students Found</h3>
                <p className="text-yellow-600">This class has no students enrolled for this subject.</p>
              </div>
            )}

            {selectedSubject && students.length > 0 && (
              <>
                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 p-4 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-2">Syllabus Coverage - {selectedSubject.subject_name}</h3>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Term Progress</span>
                      <span className="font-bold text-green-700">
                        {Math.round(students.filter(s => s.last_assessment > 0).length / students.length * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 mb-4">
                      <div 
                        className="bg-green-600 h-3" 
                        style={{ width: `${Math.round(students.filter(s => s.last_assessment > 0).length / students.length * 100)}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Assessed Students:</span>
                        <span className="font-medium">{students.filter(s => s.last_assessment > 0).length}/{students.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class Average:</span>
                        <span className="font-medium">
                          {Math.round(students.reduce((sum, s) => sum + (s.current_score || 0), 0) / students.length)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setShowAttendanceModal(true)} 
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 text-left"
                      >
                        <UserCheck className="h-4 w-4 inline mr-2" />
                        Take Lesson Attendance
                      </button>
                      <button 
                        onClick={() => setShowAssessmentModal(true)} 
                        className="px-3 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 text-left"
                      >
                        <FileText className="h-4 w-4 inline mr-2" />
                        Quick Assessment Entry
                      </button>
                      <button 
                        onClick={() => setShowEvidenceModal(true)} 
                        className="px-3 py-2 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 text-left"
                      >
                        <Camera className="h-4 w-4 inline mr-2" />
                        Upload Evidence
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student Performance Table */}
                <div className="bg-white border border-gray-200">
                  <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="font-bold text-gray-900">Student Performance - {selectedSubject.subject_name}</h2>
                      <p className="text-xs text-gray-600">Current progress and individual goals</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 w-40"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Current Score</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Target Level</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Points to Target</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Last Assessment</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Evidence</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                              No students found matching your search
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => {
                            const perf = getPerformanceLevel(student.current_score || 0);
                            const targetValues = { 'BE': 60, 'AE': 75, 'ME': 90, 'EE': 100 };
                            const target = student.target_level || 'ME';
                            const pointsNeeded = Math.max(0, (targetValues[target] || 75) - (student.current_score || 0));
                            return (
                              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{student.full_name || `${student.first_name} ${student.last_name}`}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 text-xs font-bold text-white ${perf.color}`}>
                                    {student.current_score || 0}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800">{target}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {pointsNeeded > 0 ? (
                                    <span className="text-orange-600 font-medium">{pointsNeeded} pts</span>
                                  ) : (
                                    <span className="text-green-600">Achieved</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600">{student.last_assessment || 0}%</td>
                                <td className="px-4 py-3 text-center">
                                  <button 
                                    onClick={() => { setEvidenceForm({ ...evidenceForm, studentId: student.id }); setShowEvidenceModal(true); }}
                                    className="text-purple-600 hover:text-purple-800"
                                    title="Upload Evidence"
                                  >
                                    <Camera className="h-4 w-4" />
                                  </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button 
                                    onClick={() => { setSelectedStudent(student); setShowStudentProfileModal(true); }}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="View Profile"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAttendanceModal(false)}>
          <div className="bg-white w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Record Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={attendanceForm.date} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Period</label>
                  <select 
                    value={attendanceForm.period} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, period: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                  >
                    <option value="morning">Morning Session</option>
                    <option value="afternoon">Afternoon Session</option>
                    <option value="full">Full Day</option>
                  </select>
                </div>
              </div>
              <div className="border border-gray-200 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Student</th>
                      <th className="px-4 py-2 text-center font-bold text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{student.full_name || `${student.first_name} ${student.last_name}`}</td>
                        <td className="px-4 py-2 text-center">
                          <select 
                            value={attendanceStatuses[student.id] || 'present'}
                            onChange={(e) => updateAttendanceStatus(student.id, e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            placeholder="Optional" 
                            value={attendanceRemarks[student.id] || ''}
                            onChange={(e) => updateAttendanceRemark(student.id, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setShowAttendanceModal(false)} 
                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAttendanceSubmit} 
                disabled={loading.attendance} 
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.attendance && <ButtonSpinner />} Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssessmentModal(false)}>
          <div className="bg-white w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Quick Assessment Entry</h3>
              <button onClick={() => setShowAssessmentModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Title</label>
                  <input 
                    type="text" 
                    value={assessmentForm.title} 
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-300 text-sm" 
                    placeholder="e.g., Topic Quiz 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Max Score</label>
                  <input 
                    type="number" 
                    value={assessmentForm.maxScore} 
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, maxScore: parseInt(e.target.value) || 100 })} 
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                  />
                </div>
              </div>
              <div className="border border-gray-200 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Student</th>
                      <th className="px-4 py-2 text-center font-bold text-gray-700">Score</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{student.full_name || `${student.first_name} ${student.last_name}`}</td>
                        <td className="px-4 py-2 text-center">
                          <input 
                            type="number" 
                            className="w-20 px-2 py-1 text-sm border border-gray-300 text-center" 
                            placeholder="Score"
                            value={assessmentForm.scores[student.id] || ''}
                            onChange={(e) => updateAssessmentScore(student.id, e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            placeholder="Optional feedback" 
                            className="w-full px-2 py-1 text-sm border border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setShowAssessmentModal(false)} 
                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssessmentSubmit} 
                disabled={loading.assessment} 
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading.assessment && <ButtonSpinner />} Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEvidenceModal(false)}>
          <div className="bg-white w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Upload Evidence</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Student</label>
                <select 
                  value={evidenceForm.studentId} 
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, studentId: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 text-sm"
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_name || `${s.first_name} ${s.last_name}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={evidenceForm.description} 
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 text-sm" 
                  rows="3" 
                  placeholder="Describe the evidence being uploaded..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">File</label>
                <input 
                  type="file" 
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, file: e.target.files[0] })} 
                  className="w-full text-sm"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: Images, PDF, Documents (Max 10MB)</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowEvidenceModal(false)} 
                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleEvidenceUpload} 
                disabled={loading.evidence} 
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {loading.evidence && <ButtonSpinner />} Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStudentProfileModal(false)}>
          <div className="bg-white w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Student Profile</h3>
              <button onClick={() => setShowStudentProfileModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.full_name || `${selectedStudent.first_name} ${selectedStudent.last_name}`}</h2>
                  <p className="text-gray-600">Admission: {selectedStudent.admission_no || 'N/A'}</p>
                  <p className="text-gray-600">Gender: {selectedStudent.gender || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className="text-2xl font-bold text-green-700">{selectedStudent.current_score || 0}%</p>
                  <p className="text-xs text-gray-500">{getPerformanceLevel(selectedStudent.current_score || 0).label}</p>
                </div>
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedStudent.attendance_rate || 0}%</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Performance History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Assessment</span>
                    <span className="font-medium">{selectedStudent.last_assessment || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target Level</span>
                    <span className="font-medium">{selectedStudent.target_level || 'ME'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ClassProfile;