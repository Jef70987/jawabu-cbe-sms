/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';

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
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
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
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading data...</p>
    </div>
  </div>
);

function ClassProfile() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState('my-class');
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [subjectClasses, setSubjectClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState({ class: true, students: true, analytics: true });
  const [toasts, setToasts] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [competencyData, setCompetencyData] = useState([]);
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
  const [attendanceForm, setAttendanceForm] = useState({ date: new Date().toISOString().split('T')[0], period: 'morning', records: [] });
  const [assessmentForm, setAssessmentForm] = useState({ title: '', maxScore: 100, date: new Date().toISOString().split('T')[0], scores: {} });
  const [evidenceForm, setEvidenceForm] = useState({ studentId: '', description: '', file: null });
  
  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCompetency, setFilterCompetency] = useState('all');

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access class profile');
      return;
    }
    fetchClassData();
  }, [isAuthenticated]);

  const fetchClassData = async () => {
    setLoading({ class: true, students: true, analytics: true });
    try {
      await Promise.all([
        fetchMyClasses(),
        fetchSubjectClasses(),
        fetchStudents(),
        fetchClassAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching class data:', error);
      addToast('error', 'Failed to load class data');
    } finally {
      setLoading({ class: false, students: false, analytics: false });
    }
  };

  const fetchMyClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-classes/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setMyClasses(data.data);
        if (data.data.length > 0 && !selectedStream) {
          setSelectedStream(data.data[0]);
        }
      } else {
        // Mock data for demo
        setMyClasses([
          { id: 1, class_name: 'Grade 7A', class_code: 'G7A', stream: 'A', capacity: 45, current_students: 42, class_teacher_name: 'Mr. John Otieno', subject: 'Mathematics', numeric_level: 7 },
          { id: 2, class_name: 'Grade 7B', class_code: 'G7B', stream: 'B', capacity: 45, current_students: 40, class_teacher_name: 'Mrs. Jane Akinyi', subject: 'Mathematics', numeric_level: 7 }
        ]);
        setSelectedStream({ id: 1, class_name: 'Grade 7A', class_code: 'G7A', stream: 'A', capacity: 45, current_students: 42, class_teacher_name: 'Mr. John Otieno', subject: 'Mathematics', numeric_level: 7 });
      }
    } catch (error) {
      console.error('Error fetching my classes:', error);
    }
  };

  const fetchSubjectClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/subject-classes/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSubjectClasses(data.data);
        if (data.data.length > 0 && !selectedSubject) {
          setSelectedSubject(data.data[0]);
        }
      } else {
        // Mock data for demo
        setSubjectClasses([
          { id: 1, class_name: 'Grade 7A', class_code: 'G7A', subject: 'Mathematics', students_count: 42, period: '08:00-09:00', room: 'Room 101' },
          { id: 2, class_name: 'Grade 7B', class_code: 'G7B', subject: 'Mathematics', students_count: 40, period: '09:00-10:00', room: 'Room 101' },
          { id: 3, class_name: 'Grade 7C', class_code: 'G7C', subject: 'Mathematics', students_count: 38, period: '14:00-15:00', room: 'Room 102' }
        ]);
        setSelectedSubject({ id: 1, class_name: 'Grade 7A', class_code: 'G7A', subject: 'Mathematics', students_count: 42, period: '08:00-09:00', room: 'Room 101' });
      }
    } catch (error) {
      console.error('Error fetching subject classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/${selectedStream?.id || 1}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        // Mock student data for demo
        setStudents([
          { id: 1, admission_no: 'JSS7001', first_name: 'James', last_name: 'Mwangi', gender: 'M', current_score: 78, target_level: 'ME', competency_levels: { collaboration: 3, communication: 4, critical_thinking: 3, creativity: 4 }, attendance_rate: 92, last_assessment: 82 },
          { id: 2, admission_no: 'JSS7002', first_name: 'Mary', last_name: 'Wanjiku', gender: 'F', current_score: 85, target_level: 'EE', competency_levels: { collaboration: 4, communication: 4, critical_thinking: 4, creativity: 4 }, attendance_rate: 95, last_assessment: 88 },
          { id: 3, admission_no: 'JSS7003', first_name: 'Peter', last_name: 'Omondi', gender: 'M', current_score: 65, target_level: 'AE', competency_levels: { collaboration: 3, communication: 2, critical_thinking: 3, creativity: 3 }, attendance_rate: 88, last_assessment: 70 },
          { id: 4, admission_no: 'JSS7004', first_name: 'Grace', last_name: 'Njeri', gender: 'F', current_score: 92, target_level: 'EE', competency_levels: { collaboration: 4, communication: 5, critical_thinking: 4, creativity: 5 }, attendance_rate: 98, last_assessment: 95 },
          { id: 5, admission_no: 'JSS7005', first_name: 'Brian', last_name: 'Kipchoge', gender: 'M', current_score: 71, target_level: 'ME', competency_levels: { collaboration: 3, communication: 3, critical_thinking: 3, creativity: 3 }, attendance_rate: 85, last_assessment: 75 },
          { id: 6, admission_no: 'JSS7006', first_name: 'Faith', last_name: 'Chebet', gender: 'F', current_score: 88, target_level: 'EE', competency_levels: { collaboration: 4, communication: 4, critical_thinking: 4, creativity: 4 }, attendance_rate: 96, last_assessment: 90 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClassAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-analytics/${selectedStream?.id || 1}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setClassAnalytics(data.data);
      } else {
        // Mock analytics data
        setClassAnalytics({
          meanScore: 79.8,
          classRank: 2,
          totalStreams: 4,
          performanceDistribution: { 'AE': 8, 'ME': 15, 'EE': 12, 'BE': 7 },
          subjectMastery: [
            { subject: 'Mathematics', score: 76, classAvg: 72, rank: 2 },
            { subject: 'English', score: 82, classAvg: 78, rank: 1 },
            { subject: 'Kiswahili', score: 79, classAvg: 75, rank: 2 },
            { subject: 'Integrated Science', score: 74, classAvg: 70, rank: 3 },
            { subject: 'Pre-Technical Studies', score: 81, classAvg: 76, rank: 1 }
          ],
          topPerformers: [
            { id: 4, name: 'Grace Njeri', score: 92, improvement: '+5' },
            { id: 2, name: 'Mary Wanjiku', score: 85, improvement: '+3' },
            { id: 6, name: 'Faith Chebet', score: 88, improvement: '+4' }
          ],
          mostImproved: [
            { id: 3, name: 'Peter Omondi', improvement: '+12', fromScore: 58, toScore: 70 },
            { id: 5, name: 'Brian Kipchoge', improvement: '+8', fromScore: 63, toScore: 71 }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleAttendanceSubmit = async () => {
    setLoading(prev => ({ ...prev, attendance: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/attendance/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceForm)
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Attendance recorded successfully');
        setShowAttendanceModal(false);
      } else {
        addToast('error', data.error || 'Failed to record attendance');
      }
    } catch (error) {
      addToast('error', 'Error recording attendance');
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  const handleAssessmentSubmit = async () => {
    setLoading(prev => ({ ...prev, assessment: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...assessmentForm,
          class_id: selectedStream?.id,
          subject: selectedSubject?.subject
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment saved successfully');
        setShowAssessmentModal(false);
      } else {
        addToast('error', data.error || 'Failed to save assessment');
      }
    } catch (error) {
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
    setLoading(prev => ({ ...prev, evidence: true }));
    try {
      const formData = new FormData();
      formData.append('student_id', evidenceForm.studentId);
      formData.append('description', evidenceForm.description);
      formData.append('file', evidenceForm.file);
      
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeaders().Authorization },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Evidence uploaded successfully');
        setShowEvidenceModal(false);
        setEvidenceForm({ studentId: '', description: '', file: null });
      } else {
        addToast('error', data.error || 'Failed to upload evidence');
      }
    } catch (error) {
      addToast('error', 'Error uploading evidence');
    } finally {
      setLoading(prev => ({ ...prev, evidence: false }));
    }
  };

  // Helper functions
  const getCompetencyColor = (level) => {
    const colors = { 1: 'bg-red-100 text-red-800', 2: 'bg-orange-100 text-orange-800', 3: 'bg-yellow-100 text-yellow-800', 4: 'bg-green-100 text-green-800', 5: 'bg-blue-100 text-blue-800' };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'EE', color: 'bg-green-600', label: 'Exceeding Expectations' };
    if (score >= 75) return { level: 'ME', color: 'bg-blue-600', label: 'Meeting Expectations' };
    if (score >= 60) return { level: 'AE', color: 'bg-yellow-600', label: 'Approaching Expectations' };
    return { level: 'BE', color: 'bg-red-600', label: 'Below Expectations' };
  };

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
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
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
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

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Class Profile</h1>
              <p className="text-green-100 mt-1">Manage your class, track attendance, and monitor student progress</p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchClassData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-300 bg-white px-6">
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

      <div className="mx-auto p-6">
        {/* TAB 1: MY CLASS - Owner/Manager View */}
        {activeTab === 'my-class' && (
          <div>
            {/* Class Selector */}
            {myClasses.length > 1 && (
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Select Class:</label>
                <select
                  value={selectedStream?.id || ''}
                  onChange={(e) => setSelectedStream(myClasses.find(c => c.id === parseInt(e.target.value)))}
                  className="px-3 py-2 border border-gray-300 text-sm bg-white rounded-md"
                >
                  {myClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.class_name} - {cls.class_teacher_name === `${user?.first_name} ${user?.last_name}` ? '(You)' : ''}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedStream && (
              <>
                {/* Class Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white border border-gray-300 p-4">
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedStream.current_students || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Capacity: {selectedStream.capacity}</p>
                  </div>
                  <div className="bg-white border border-gray-300 p-4">
                    <p className="text-sm text-gray-600">Mean Score</p>
                    <p className="text-2xl font-bold text-green-700">{classAnalytics.meanScore}%</p>
                    <p className="text-xs text-gray-500 mt-1">Rank: #{classAnalytics.classRank} of {classAnalytics.totalStreams}</p>
                  </div>
                  <div className="bg-white border border-gray-300 p-4">
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-700">{students.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / (students.length || 1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Daily average</p>
                  </div>
                  <div className="bg-white border border-gray-300 p-4">
                    <p className="text-sm text-gray-600">Competency Mastery</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {Math.round(students.reduce((sum, s) => {
                        const comps = Object.values(s.competency_levels || {});
                        return sum + (comps.reduce((a, b) => a + b, 0) / (comps.length || 1));
                      }, 0) / (students.length || 1) * 20)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Avg competency level</p>
                  </div>
                  <div className="bg-white border border-gray-300 p-4">
                    <p className="text-sm text-gray-600">Portfolio Completion</p>
                    <p className="text-2xl font-bold text-orange-700">32/42</p>
                    <p className="text-xs text-gray-500 mt-1">76% completed</p>
                  </div>
                </div>

                {/* Stream Analytics & Benchmarking */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Mean Score Comparison */}
                  <div className="bg-white border border-gray-300">
                    <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                      <h2 className="font-bold text-gray-900">Mean Score Comparison</h2>
                      <p className="text-xs text-gray-600">Class vs Other Streams</p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {myClasses.map(cls => (
                          <div key={cls.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{cls.class_name}</span>
                              <span className={cls.id === selectedStream.id ? 'font-bold text-green-700' : ''}>
                                {cls.id === selectedStream.id ? classAnalytics.meanScore : Math.floor(Math.random() * 20) + 65}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2">
                              <div 
                                className={`h-2 ${cls.id === selectedStream.id ? 'bg-green-600' : 'bg-blue-600'}`}
                                style={{ width: `${cls.id === selectedStream.id ? classAnalytics.meanScore : Math.floor(Math.random() * 20) + 65}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subject Mastery Heatmap */}
                  <div className="bg-white border border-gray-300">
                    <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                      <h2 className="font-bold text-gray-900">Subject Mastery Heatmap</h2>
                      <p className="text-xs text-gray-600">Winning vs Sinking subjects</p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {classAnalytics.subjectMastery.map(subject => (
                          <div key={subject.subject}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{subject.subject}</span>
                              <span className={subject.score >= subject.classAvg ? 'text-green-700' : 'text-red-700'}>
                                {subject.score}% {subject.score >= subject.classAvg ? '▲' : '▼'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2">
                              <div 
                                className={`h-2 ${subject.score >= subject.classAvg ? 'bg-green-600' : 'bg-red-600'}`}
                                style={{ width: `${subject.score}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Class avg: {subject.classAvg}% | Rank: #{subject.rank}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranking Engine */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Top Performers */}
                  <div className="bg-white border border-gray-300">
                    <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-gray-900">🏆 Top Performers</h2>
                        <p className="text-xs text-gray-600">Highest overall scores</p>
                      </div>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {classAnalytics.topPerformers.map((student, idx) => (
                        <div key={student.id} className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedStudent(student); setShowStudentProfileModal(true); }}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-yellow-700">
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

                  {/* Most Improved */}
                  <div className="bg-white border border-gray-300">
                    <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-gray-900">📈 Most Improved</h2>
                        <p className="text-xs text-gray-600">Since last SBA</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {classAnalytics.mostImproved.map((student) => (
                        <div key={student.id} className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedStudent(student); setShowStudentProfileModal(true); }}>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.fromScore}% → {student.toScore}%</p>
                          </div>
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-sm font-bold">
                            +{student.improvement}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Holistic CBA Progress - Competency Matrix */}
                <div className="bg-white border border-gray-300 mb-6">
                  <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                    <h2 className="font-bold text-gray-900">Competency Matrix</h2>
                    <p className="text-xs text-gray-600">Core competencies across the entire class</p>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-bold text-gray-700">Competency</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Level 1</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Level 2</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Level 3</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Level 4</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Level 5</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-700">Class Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['collaboration', 'communication', 'critical_thinking', 'creativity'].map(comp => {
                          const levels = students.reduce((acc, s) => {
                            const level = s.competency_levels?.[comp] || 3;
                            acc[level] = (acc[level] || 0) + 1;
                            return acc;
                          }, {});
                          const avg = students.reduce((sum, s) => sum + (s.competency_levels?.[comp] || 3), 0) / (students.length || 1);
                          return (
                            <tr key={comp} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium text-gray-800 capitalize">{comp.replace('_', ' ')}</td>
                              {[1,2,3,4,5].map(level => (
                                <td key={level} className="text-center py-2 px-3">
                                  <span className={`px-2 py-1 text-xs ${getCompetencyColor(level)}`}>
                                    {levels[level] || 0}
                                  </span>
                                </td>
                              ))}
                              <td className="text-center py-2 px-3 font-bold text-gray-800">{avg.toFixed(1)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Daily Roll Call Register & Student List */}
                <div className="bg-white border border-gray-300">
                  <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="font-bold text-gray-900">Student Register</h2>
                      <p className="text-xs text-gray-600">Official daily attendance & student records</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowAttendanceModal(true)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700"
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
                          className="px-2 py-1 text-sm border border-gray-300 w-40"
                        />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 text-sm border border-gray-300">
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
                        {filteredStudents.map(student => {
                          const perf = getPerformanceLevel(student.current_score || 0);
                          return (
                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-600">{student.admission_no}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{student.first_name} {student.last_name}</td>
                              <td className="px-4 py-3 text-center text-gray-600">{student.gender}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs font-bold text-white ${perf.color}`}>
                                  {student.current_score}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800">{student.target_level}</span>
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
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: SUBJECT CLASSES - Instructor View */}
        {activeTab === 'subject-classes' && (
          <div>
            {/* Class Selector */}
            <div className="mb-6 bg-white border border-gray-300 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-bold text-gray-700">Select Stream:</label>
                <select
                  value={selectedSubject?.id || ''}
                  onChange={(e) => setSelectedSubject(subjectClasses.find(c => c.id === parseInt(e.target.value)))}
                  className="px-3 py-2 border border-gray-300 text-sm bg-white flex-1"
                >
                  {subjectClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.class_name} - {cls.subject} ({cls.period})</option>
                  ))}
                </select>
                {selectedSubject && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span><ClockIcon className="h-4 w-4 inline mr-1" />{selectedSubject.period}</span>
                    <span><MapPin className="h-4 w-4 inline mr-1" />{selectedSubject.room}</span>
                    <span><Users className="h-4 w-4 inline mr-1" />{selectedSubject.students_count} Students</span>
                  </div>
                )}
              </div>
            </div>

            {selectedSubject && (
              <>
                {/* Syllabus Coverage & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white border border-gray-300 p-4 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-2">Syllabus Coverage - {selectedSubject.subject}</h3>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Term 1 Progress</span>
                      <span className="font-bold text-green-700">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 mb-4">
                      <div className="bg-green-600 h-3" style={{ width: '68%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between"><span>Topics Covered:</span><span className="font-medium">12/18</span></div>
                      <div className="flex justify-between"><span>Strands Completed:</span><span className="font-medium">4/6</span></div>
                      <div className="flex justify-between"><span>Assessments Done:</span><span className="font-medium">3/5</span></div>
                      <div className="flex justify-between"><span>Pending Lessons:</span><span className="font-medium">6</span></div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-300 p-4">
                    <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setShowAttendanceModal(true)} className="px-3 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 text-left">
                        <UserCheck className="h-4 w-4 inline mr-2" />
                        Take Lesson Attendance
                      </button>
                      <button onClick={() => setShowAssessmentModal(true)} className="px-3 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 text-left">
                        <FileText className="h-4 w-4 inline mr-2" />
                        Quick Assessment Entry
                      </button>
                      <button onClick={() => setShowEvidenceModal(true)} className="px-3 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 text-left">
                        <Camera className="h-4 w-4 inline mr-2" />
                        Upload Evidence
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student Performance Table for Subject */}
                <div className="bg-white border border-gray-300">
                  <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="font-bold text-gray-900">Student Performance - {selectedSubject.subject}</h2>
                      <p className="text-xs text-gray-600">Current progress and individual goals</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 w-40"
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
                        {filteredStudents.map(student => {
                          const perf = getPerformanceLevel(student.current_score || 0);
                          const targetValues = { 'BE': 60, 'AE': 75, 'ME': 90, 'EE': 100 };
                          const pointsNeeded = Math.max(0, (targetValues[student.target_level] || 75) - (student.current_score || 0));
                          return (
                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{student.first_name} {student.last_name}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs font-bold text-white ${perf.color}`}>
                                  {student.current_score}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800">{student.target_level}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {pointsNeeded > 0 ? (
                                  <span className="text-orange-600 font-medium">{pointsNeeded} pts</span>
                                ) : (
                                  <span className="text-green-600">✓ Achieved</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600">{student.last_assessment}%</td>
                              <td className="px-4 py-3 text-center">
                                <button 
                                  onClick={() => { setEvidenceForm({ ...evidenceForm, studentId: student.id }); setShowEvidenceModal(true); }}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  <Camera className="h-4 w-4" />
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button 
                                  onClick={() => { setSelectedStudent(student); setShowStudentProfileModal(true); }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
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
          <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Record Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Period</label>
                  <select value={attendanceForm.period} onChange={(e) => setAttendanceForm({ ...attendanceForm, period: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm">
                    <option value="morning">Morning Session</option>
                    <option value="afternoon">Afternoon Session</option>
                    <option value="full">Full Day</option>
                  </select>
                </div>
              </div>
              <div className="border border-gray-300 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Student</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-2 text-center">
                          <select className="px-2 py-1 text-sm border border-gray-300">
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-4 py-2"><input type="text" placeholder="Optional" className="w-full px-2 py-1 text-sm border border-gray-300" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
              <button onClick={handleAttendanceSubmit} disabled={loading.attendance} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium disabled:opacity-50">
                {loading.attendance && <ButtonSpinner />} Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssessmentModal(false)}>
          <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Quick Assessment Entry</h3>
              <button onClick={() => setShowAssessmentModal(false)} className="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Title</label>
                  <input type="text" value={assessmentForm.title} onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm" placeholder="e.g., Topic Quiz 1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Max Score</label>
                  <input type="number" value={assessmentForm.maxScore} onChange={(e) => setAssessmentForm({ ...assessmentForm, maxScore: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 text-sm" />
                </div>
              </div>
              <div className="border border-gray-300 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Student</th>
                      <th className="px-4 py-2 text-center">Score</th>
                      <th className="px-4 py-2 text-left">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-2 text-center">
                          <input type="number" className="w-20 px-2 py-1 text-sm border border-gray-300 text-center" placeholder="Score" />
                        </td>
                        <td className="px-4 py-2"><input type="text" placeholder="Optional feedback" className="w-full px-2 py-1 text-sm border border-gray-300" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowAssessmentModal(false)} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
              <button onClick={handleAssessmentSubmit} disabled={loading.assessment} className="px-4 py-2 bg-green-600 text-white text-sm font-medium disabled:opacity-50">
                {loading.assessment && <ButtonSpinner />} Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEvidenceModal(false)}>
          <div className="bg-white max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Upload Evidence</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Student</label>
                <select value={evidenceForm.studentId} onChange={(e) => setEvidenceForm({ ...evidenceForm, studentId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={evidenceForm.description} onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm" rows="3" placeholder="Describe the evidence being uploaded..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">File</label>
                <input type="file" onChange={(e) => setEvidenceForm({ ...evidenceForm, file: e.target.files[0] })} className="w-full text-sm" />
                <p className="text-xs text-gray-500 mt-1">Supported: Images, PDF, Documents</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowEvidenceModal(false)} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
              <button onClick={handleEvidenceUpload} disabled={loading.evidence} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium disabled:opacity-50">
                {loading.evidence && <ButtonSpinner />} Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStudentProfileModal(false)}>
          <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Student Profile</h3>
              <button onClick={() => setShowStudentProfileModal(false)} className="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                  <p className="text-gray-600">Admission: {selectedStudent.admission_no}</p>
                  <p className="text-gray-600">Gender: {selectedStudent.gender}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className="text-2xl font-bold text-green-700">{selectedStudent.current_score}%</p>
                  <p className="text-xs text-gray-500">{getPerformanceLevel(selectedStudent.current_score).label}</p>
                </div>
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedStudent.attendance_rate}%</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Competency Levels</h4>
                <div className="space-y-2">
                  {Object.entries(selectedStudent.competency_levels || {}).map(([comp, level]) => (
                    <div key={comp}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{comp.replace('_', ' ')}</span>
                        <span className={`px-2 py-0.5 text-xs ${getCompetencyColor(level)}`}>Level {level}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2">
                        <div className="bg-green-600 h-2" style={{ width: `${(level / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Performance History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Assessment</span>
                    <span className="font-medium">{selectedStudent.last_assessment}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target Level</span>
                    <span className="font-medium">{selectedStudent.target_level}</span>
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