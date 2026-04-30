/* eslint-disable react-hooks/exhaustive-deps */
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

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      {type === 'warning' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

function ClassProfile() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('my-class');
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [subjectClasses, setSubjectClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [classAnalytics, setClassAnalytics] = useState({
    meanScore: 0,
    classRank: 0,
    totalStreams: 0,
    performanceDistribution: {},
    subjectMastery: [],
    topPerformers: [],
    mostImproved: []
  });
  
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
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
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const abortControllers = useRef({});

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchWithTimeout = async (url, options, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  const fetchMyClasses = useCallback(async () => {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/teacher/my-classes/`,
        { headers: getAuthHeaders() }
      );
      if (data && data.success) {
        setMyClasses(data.data || []);
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching my classes:', error);
      addToast('error', 'Failed to load your classes');
      return [];
    }
  }, [getAuthHeaders]);

  const fetchSubjectClasses = useCallback(async () => {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/teacher/subject-classes/`,
        { headers: getAuthHeaders() }
      );
      if (data && data.success) {
        setSubjectClasses(data.data || []);
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching subject classes:', error);
      addToast('error', 'Failed to load subject classes');
      return [];
    }
  }, [getAuthHeaders]);

  const fetchStudents = useCallback(async (classId) => {
    if (!classId) return;
    
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/teacher/class-students/${classId}/`,
        { headers: getAuthHeaders() }
      );
      if (data && data.success) {
        setStudents(data.data || []);
        const initialStatuses = {};
        const initialRemarks = {};
        (data.data || []).forEach(student => {
          initialStatuses[student.id] = 'present';
          initialRemarks[student.id] = '';
        });
        setAttendanceStatuses(initialStatuses);
        setAttendanceRemarks(initialRemarks);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      addToast('error', 'Failed to load students');
      setStudents([]);
    }
  }, [getAuthHeaders]);

  const fetchClassAnalytics = useCallback(async (classId) => {
    if (!classId) return;
    
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/teacher/class-analytics/${classId}/`,
        { headers: getAuthHeaders() }
      );
      if (data && data.success && data.data) {
        setClassAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, [getAuthHeaders]);

  // INITIAL LOAD - ONLY ONCE
  useEffect(() => {
    if (!isAuthenticated || initialLoadDone) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [myClassesData, subjectClassesData] = await Promise.all([
          fetchMyClasses(),
          fetchSubjectClasses()
        ]);
        
        if (activeTab === 'my-class' && myClassesData?.length > 0) {
          setSelectedStream(myClassesData[0]);
          await fetchStudents(myClassesData[0].id);
          await fetchClassAnalytics(myClassesData[0].id);
        } else if (activeTab === 'subject-classes' && subjectClassesData?.length > 0) {
          setSelectedSubject(subjectClassesData[0]);
          await fetchStudents(subjectClassesData[0].id);
        }
        setInitialLoadDone(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        addToast('error', 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated]);

  // Handle tab changes - ONLY when tab changes
  useEffect(() => {
    if (!initialLoadDone) return;
    
    if (activeTab === 'my-class' && myClasses.length > 0 && selectedStream?.id) {
      fetchStudents(selectedStream.id);
      fetchClassAnalytics(selectedStream.id);
    } else if (activeTab === 'subject-classes' && subjectClasses.length > 0 && selectedSubject?.id) {
      fetchStudents(selectedSubject.id);
    }
  }, [activeTab]);

  // Handle selected subject change - ONLY when selected subject changes
  useEffect(() => {
    if (activeTab === 'subject-classes' && selectedSubject?.id && initialLoadDone) {
      fetchStudents(selectedSubject.id);
    }
  }, [selectedSubject?.id]);

  // Handle selected stream change - ONLY when selected stream changes
  useEffect(() => {
    if (activeTab === 'my-class' && selectedStream?.id && initialLoadDone) {
      fetchStudents(selectedStream.id);
      fetchClassAnalytics(selectedStream.id);
    }
  }, [selectedStream?.id]);

  const handleAttendanceSubmit = async () => {
    if (!selectedStream?.id && !selectedSubject?.id) {
      addToast('warning', 'No class selected');
      return;
    }

    setSubmitting(true);
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
        class_id: selectedStream?.id || null,
        subject_id: selectedSubject?.id || null
      };

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/teacher/attendance/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }, 15000);
      
      if (response.success) {
        addToast('success', 'Attendance recorded successfully');
        setShowAttendanceModal(false);
        if (selectedStream?.id) {
          await fetchClassAnalytics(selectedStream.id);
        }
      } else {
        addToast('error', response.message || 'Failed to record attendance');
      }
    } catch (error) {
      console.error('Attendance error:', error);
      addToast('error', 'Error recording attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssessmentSubmit = async () => {
    if (!assessmentForm.title) {
      addToast('warning', 'Please enter assessment title');
      return;
    }

    setSubmitting(true);
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
        class_id: selectedStream?.id || selectedSubject?.id,
        subject: selectedSubject?.subject_name || 'General',
        scores: scores
      };

      const response = await fetchWithTimeout(`${API_BASE_URL}/api/teacher/assessment/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }, 15000);
      
      if (response.success) {
        addToast('success', 'Assessment saved successfully');
        setShowAssessmentModal(false);
        setAssessmentForm({ title: '', maxScore: 100, date: new Date().toISOString().split('T')[0], scores: {} });
        
        if (selectedStream?.id) {
          await fetchStudents(selectedStream.id);
          await fetchClassAnalytics(selectedStream.id);
        } else if (selectedSubject?.id) {
          await fetchStudents(selectedSubject.id);
        }
      } else {
        addToast('error', response.message || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Assessment error:', error);
      addToast('error', 'Error saving assessment');
    } finally {
      setSubmitting(false);
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
    
    setSubmitting(true);
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
      setSubmitting(false);
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
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      <div className="bg-green-700 px-6 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Class Profile</h1>
            <p className="text-green-100 mt-1">Manage your class, track attendance, and monitor student progress</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab('my-class');
              if (myClasses.length > 0) setSelectedStream(myClasses[0]);
            }}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'my-class'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            My Class ({myClasses.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('subject-classes');
              if (subjectClasses.length > 0) setSelectedSubject(subjectClasses[0]);
            }}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'subject-classes'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Subject Classes ({subjectClasses.length})
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading class data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'my-class' && (
              <div>
                {myClasses.length > 1 && (
                  <div className="mb-6 flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700">Select Class:</label>
                    <select
                      value={selectedStream?.id || ''}
                      onChange={(e) => {
                        const selected = myClasses.find(c => c.id === e.target.value);
                        setSelectedStream(selected);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      {myClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedStream && students.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-yellow-800 mb-1">No Students Found</h3>
                    <p className="text-yellow-600">This class has no students assigned yet.</p>
                  </div>
                ) : selectedStream && students.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Mean Score</p>
                        <p className="text-2xl font-bold text-green-700">{classAnalytics.meanScore || 0}%</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                        <p className="text-2xl font-bold text-blue-700">{averageAttendanceRate}%</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Class Rank</p>
                        <p className="text-2xl font-bold text-purple-700">#{classAnalytics.classRank || 1}</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Streams</p>
                        <p className="text-2xl font-bold text-orange-700">{classAnalytics.totalStreams || 1}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 rounded-t-lg flex justify-between items-center flex-wrap gap-3">
                        <div>
                          <h2 className="font-bold text-gray-900">Student Register</h2>
                          <p className="text-xs text-gray-600">Official daily attendance & student records</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <button 
                            onClick={() => setShowAttendanceModal(true)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
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
                              className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg w-40"
                            />
                            <select 
                              value={sortBy} 
                              onChange={(e) => setSortBy(e.target.value)} 
                              className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
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
                              <th className="px-4 py-3 text-center font-bold text-gray-700">Attendance</th>
                              <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                  No students found matching your search
                                </td>
                              </tr>
                            ) : (
                              filteredStudents.map(student => {
                                const perf = getPerformanceLevel(student.current_score || 0);
                                return (
                                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-600">{student.admission_no || 'N/A'}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                      {student.full_name || `${student.first_name} ${student.last_name}`}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">{student.gender || 'N/A'}</td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`px-2 py-1 text-xs font-bold text-white rounded ${perf.color}`}>
                                        {student.current_score || 0}%
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                          <div className="bg-green-600 rounded-full h-1.5" style={{ width: `${student.attendance_rate || 0}%` }}></div>
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
                ) : null}
              </div>
            )}

            {activeTab === 'subject-classes' && (
              <div>
                {subjectClasses.length > 0 && (
                  <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-sm font-bold text-gray-700">Select Stream:</label>
                      <select
                        value={selectedSubject?.id || ''}
                        onChange={(e) => {
                          const selected = subjectClasses.find(c => c.id === e.target.value);
                          setSelectedSubject(selected);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white flex-1"
                      >
                        {subjectClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name} - {cls.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {selectedSubject && students.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-yellow-800 mb-1">No Students Found</h3>
                    <p className="text-yellow-600">This class has no students enrolled for this subject.</p>
                  </div>
                ) : selectedSubject && students.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:col-span-2">
                        <h3 className="font-bold text-gray-900 mb-2">Syllabus Coverage - {selectedSubject.subject_name}</h3>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Term Progress</span>
                          <span className="font-bold text-green-700">
                            {Math.round(students.filter(s => s.last_assessment > 0).length / students.length * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-green-600 rounded-full h-3" 
                            style={{ width: `${Math.round(students.filter(s => s.last_assessment > 0).length / students.length * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 rounded-t-lg flex justify-between items-center flex-wrap gap-3">
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
                            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg w-40"
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
                              <th className="px-4 py-3 text-center font-bold text-gray-700">Last Assessment</th>
                              <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                  No students found matching your search
                                </td>
                              </tr>
                            ) : (
                              filteredStudents.map(student => {
                                const perf = getPerformanceLevel(student.current_score || 0);
                                return (
                                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                      {student.full_name || `${student.first_name} ${student.last_name}`}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`px-2 py-1 text-xs font-bold text-white rounded ${perf.color}`}>
                                        {student.current_score || 0}%
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                        {student.target_level || 'ME'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">{student.last_assessment || 0}%</td>
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
                ) : null}
              </div>
            )}
          </>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAttendanceModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center sticky top-0">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Period</label>
                  <select 
                    value={attendanceForm.period} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, period: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="morning">Morning Session</option>
                    <option value="afternoon">Afternoon Session</option>
                    <option value="full">Full Day</option>
                  </select>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
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
                            className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setShowAttendanceModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAttendanceSubmit} 
                disabled={submitting} 
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting && <ButtonSpinner />} Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssessmentModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center sticky top-0">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    placeholder="e.g., Topic Quiz 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Max Score</label>
                  <input 
                    type="number" 
                    value={assessmentForm.maxScore} 
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, maxScore: parseInt(e.target.value) || 100 })} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Student</th>
                      <th className="px-4 py-2 text-center font-bold text-gray-700">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{student.full_name || `${student.first_name} ${student.last_name}`}</td>
                        <td className="px-4 py-2 text-center">
                          <input 
                            type="number" 
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg text-center" 
                            placeholder="Score"
                            value={assessmentForm.scores[student.id] || ''}
                            onChange={(e) => updateAssessmentScore(student.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setShowAssessmentModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssessmentSubmit} 
                disabled={submitting} 
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting && <ButtonSpinner />} Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEvidenceModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Upload Evidence</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Student</label>
                <select 
                  value={evidenceForm.studentId} 
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, studentId: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
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
                  accept="image/*,application/pdf"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: Images, PDF (Max 10MB)</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button 
                onClick={() => setShowEvidenceModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleEvidenceUpload} 
                disabled={submitting} 
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting && <ButtonSpinner />} Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStudentProfileModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Student Profile</h3>
              <button onClick={() => setShowStudentProfileModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.full_name || `${selectedStudent.first_name} ${selectedStudent.last_name}`}</h2>
                  <p className="text-gray-600">Admission: {selectedStudent.admission_no || 'N/A'}</p>
                  <p className="text-gray-600">Gender: {selectedStudent.gender || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className="text-2xl font-bold text-green-700">{selectedStudent.current_score || 0}%</p>
                  <p className="text-xs text-gray-500">{getPerformanceLevel(selectedStudent.current_score || 0).label}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedStudent.attendance_rate || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
}

export default ClassProfile;