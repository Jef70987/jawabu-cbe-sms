/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Calendar, Clock, Users, CheckSquare, FileText, TrendingUp,
  AlertCircle, CheckCircle, X, Loader2, Bell, BookOpen,
  Award, Target, Activity, UserCheck, ClipboardList,
  ChevronRight, RefreshCw, GraduationCap, BarChart3,
  Search, Filter, Download, Save, Eye, UserX, UserCheck as UserCheckIcon,
  ChevronLeft, ChevronRight as ChevronRightIcon, Grid, List,
  Sun, Cloud, Moon, Clock as ClockIcon, MapPin, Phone, Mail
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
      case 'warning': return <AlertCircle className="h-5 w-5" />;
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

// Quick toggle component for individual student
const AttendanceToggle = ({ status, onToggle, disabled }) => {
  const isPresent = status === 'present';
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-16 h-8 transition-all duration-200 ease-in-out focus:outline-none ${
        isPresent ? 'bg-green-500' : 'bg-red-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white shadow-md transition-transform duration-200 ease-in-out ${
          isPresent ? 'translate-x-8' : 'translate-x-0'
        }`}
      />
      <span className={`absolute text-xs font-bold text-white ${isPresent ? 'left-2' : 'right-2'} top-2`}>
        {isPresent ? 'P' : 'A'}
      </span>
    </button>
  );
};

// Bulk action bar component
const BulkActionBar = ({ selectedCount, onMarkAllPresent, onMarkAllAbsent, onClear, onSave }) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-gray-900 text-white shadow-xl px-6 py-3 flex items-center gap-4 animate-slide-up">
      <span className="text-sm font-medium">{selectedCount} student(s) selected</span>
      <div className="w-px h-6 bg-gray-600"></div>
      <button onClick={onMarkAllPresent} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-sm font-medium flex items-center gap-1">
        <CheckCircle className="h-4 w-4" /> Mark Present
      </button>
      <button onClick={onMarkAllAbsent} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm font-medium flex items-center gap-1">
        <X className="h-4 w-4" /> Mark Absent
      </button>
      <button onClick={onClear} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-sm font-medium">
        Clear
      </button>
      <button onClick={onSave} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm font-medium flex items-center gap-1">
        <Save className="h-4 w-4" /> Save Selected
      </button>
    </div>
  );
};

function Attendance() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState({ classes: true, students: true, subjects: true, saving: false });
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('morning');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 20;

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

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access attendance');
      return;
    }
    fetchInitialData();
    
    return () => {
      Object.values(abortControllers.current).forEach(controller => controller.abort());
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedDate) {
      fetchAttendanceRecords();
      fetchAttendanceHistory();
    }
  }, [selectedClass, selectedSubject, selectedDate, selectedPeriod]);

  const fetchInitialData = async () => {
    setLoading({ classes: true, students: true, subjects: true, saving: false });
    try {
      await Promise.all([
        fetchTeacherClasses(),
        fetchTeacherSubjects()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      addToast('error', 'Failed to load data');
    } finally {
      setLoading(prev => ({ ...prev, classes: false, subjects: false }));
    }
  };

  const fetchTeacherClasses = async () => {
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/attendance/subject-classes/`,
        { headers: getAuthHeaders() },
        'classes'
      );
      if (data && data.success) {
        setClasses(data.data);
        if (data.data.length > 0) {
          // FIXED: Use class_id instead of id
          const firstClass = data.data[0];
          setSelectedClass({
            id: firstClass.class_id,
            class_name: firstClass.class_name,
            subject_name: firstClass.subject_name
          });
          await fetchClassStudents(firstClass.class_id);
        } else {
          addToast('warning', 'No classes assigned to you');
        }
      } else if (data && !data.success) {
        addToast('error', data.message || 'Failed to load classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      addToast('error', 'Network error loading classes');
    }
  };

  const fetchTeacherSubjects = async () => {
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/attendance/my-subjects/`,
        { headers: getAuthHeaders() },
        'subjects'
      );
      if (data && data.success) {
        setSubjects(data.data);
        if (data.data.length > 0) {
          setSelectedSubject(data.data[0]);
        }
      } else if (data && !data.success) {
        addToast('error', data.message || 'Failed to load subjects');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchClassStudents = async (classId) => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/attendance/class-students/${classId}/`,
        { headers: getAuthHeaders() },
        'students'
      );
      if (data && data.success) {
        setStudents(data.data);
        setStats(prev => ({ ...prev, total: data.data.length }));
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
  };

  const fetchAttendanceRecords = async () => {
    if (!selectedClass?.id || !selectedSubject?.id) return;
    
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/attendance/records/?class_id=${selectedClass.id}&subject_id=${selectedSubject.id}&date=${selectedDate}&period=${selectedPeriod}`,
        { headers: getAuthHeaders() },
        'attendance'
      );
      if (data && data.success && data.data) {
        const records = {};
        data.data.forEach(record => {
          records[record.student_id] = record.status;
        });
        setAttendanceRecords(records);
        updateStats(records);
      } else {
        // Initialize all students as unmarked if no records
        const initialRecords = {};
        students.forEach(student => {
          initialRecords[student.id] = 'unmarked';
        });
        setAttendanceRecords(initialRecords);
        updateStats(initialRecords);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAttendanceHistory = async () => {
    if (!selectedClass?.id || !selectedSubject?.id) return;
    
    try {
      const data = await fetchWithAbort(
        `${API_BASE_URL}/api/teacher/attendance/history/?class_id=${selectedClass.id}&subject_id=${selectedSubject.id}`,
        { headers: getAuthHeaders() },
        'history'
      );
      if (data && data.success) {
        setAttendanceHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const updateStats = (records) => {
    const present = Object.values(records).filter(s => s === 'present').length;
    const absent = Object.values(records).filter(s => s === 'absent').length;
    const total = students.length;
    setStats({
      present,
      absent,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    });
  };

  const handleToggleAttendance = (studentId) => {
    setAttendanceRecords(prev => {
      const currentStatus = prev[studentId];
      const newStatus = currentStatus === 'present' ? 'absent' : 'present';
      const newRecords = { ...prev, [studentId]: newStatus };
      updateStats(newRecords);
      return newRecords;
    });
  };

  const handleBulkMark = (status) => {
    const newRecords = { ...attendanceRecords };
    if (selectedStudents.size > 0) {
      selectedStudents.forEach(studentId => {
        newRecords[studentId] = status;
      });
      setSelectedStudents(new Set());
    } else {
      students.forEach(student => {
        newRecords[student.id] = status;
      });
    }
    setAttendanceRecords(newRecords);
    updateStats(newRecords);
    addToast('success', `Marked ${selectedStudents.size > 0 ? selectedStudents.size : students.length} student(s) as ${status}`);
  };

  const handleSaveAttendance = async () => {
    setLoading(prev => ({ ...prev, saving: true }));
    try {
      const recordsToSave = Object.entries(attendanceRecords)
        .filter(([_, status]) => status !== 'unmarked')
        .map(([studentId, status]) => ({
          student_id: studentId,
          class_id: selectedClass.id,
          subject_id: selectedSubject.id,
          date: selectedDate,
          period: selectedPeriod,
          status: status
        }));

      if (recordsToSave.length === 0) {
        addToast('warning', 'No attendance records to save');
        setLoading(prev => ({ ...prev, saving: false }));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/teacher/attendance/bulk-save/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ records: recordsToSave })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', `Attendance saved for ${recordsToSave.length} student(s)`);
        await fetchAttendanceHistory();
        await fetchAttendanceRecords();
      } else {
        addToast('error', data.message || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      addToast('error', 'Network error saving attendance');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  // FIXED: Handle class change using class_id
  const handleClassChange = async (classId) => {
    const selected = classes.find(c => c.class_id === classId);
    if (selected) {
      setSelectedClass({
        id: selected.class_id,
        class_name: selected.class_name,
        subject_name: selected.subject_name
      });
      setSelectedStudents(new Set());
      setCurrentPage(1);
      await fetchClassStudents(classId);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredStudents.slice(start, start + studentsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getDateOptions = () => {
    const options = [];
    for (let i = -7; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      options.push(date.toISOString().split('T')[0]);
    }
    return options;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access attendance</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium inline-block hover:bg-blue-700">
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

      {(loading.saving) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Attendance Register</h1>
            <p className="text-green-100 mt-1">Quick and easy attendance marking for your classes</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className="px-4 py-2 bg-white text-blue-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              {showHistory ? 'Hide History' : 'View History'}
            </button>
            <button 
              onClick={() => { fetchAttendanceRecords(); fetchAttendanceHistory(); }} 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-700">{stats.present}</p>
              </div>
              <UserCheckIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-700">{stats.percentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unmarked</p>
                <p className="text-2xl font-bold text-orange-700">
                  {Object.values(attendanceRecords).filter(s => s === 'unmarked').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select 
                value={selectedClass?.id || ''} 
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
                disabled={loading.classes}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} - {cls.subject_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              <select 
                value={selectedSubject?.id || ''} 
                onChange={(e) => setSelectedSubject(subjects.find(s => s.id === e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
                disabled={subjects.length === 0}
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {getDateOptions().map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Period</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="morning">Morning Session (8:00 - 12:00)</option>
                <option value="afternoon">Afternoon Session (12:00 - 16:00)</option>
                <option value="full">Full Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or admission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History Panel */}
        {showHistory && attendanceHistory.length > 0 && (
          <div className="bg-white border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
              <h2 className="font-bold text-gray-900">Attendance History - {selectedClass?.class_name} ({selectedSubject?.name})</h2>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Date</th>
                    <th className="text-center py-2 px-3 font-bold text-gray-700">Present</th>
                    <th className="text-center py-2 px-3 font-bold text-gray-700">Absent</th>
                    <th className="text-center py-2 px-3 font-bold text-gray-700">Attendance %</th>
                    <th className="text-center py-2 px-3 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map(record => (
                    <tr key={record.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{new Date(record.date).toLocaleDateString('en-KE')}</td>
                      <td className="py-2 px-3 text-center text-green-700 font-medium">{record.present}</td>
                      <td className="py-2 px-3 text-center text-red-700 font-medium">{record.absent}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 h-2">
                            <div className="bg-blue-600 h-2" style={{ width: `${record.percentage}%` }}></div>
                          </div>
                          <span className="text-gray-700">{record.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium ${
                          record.percentage >= 90 ? 'bg-green-100 text-green-800' : 
                          record.percentage >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.percentage >= 90 ? 'Excellent' : record.percentage >= 75 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showHistory && attendanceHistory.length === 0 && !loading.students && (
          <div className="bg-white border border-gray-200 mb-6 p-8 text-center">
            <p className="text-gray-500">No attendance history available</p>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-3 py-1 text-sm border ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <Grid className="h-4 w-4 inline mr-1" /> Grid View
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-3 py-1 text-sm border ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <List className="h-4 w-4 inline mr-1" /> List View
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleSelectAll()} 
              className="px-3 py-1 text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
            >
              {selectedStudents.size === filteredStudents.length && filteredStudents.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            <button 
              onClick={() => handleBulkMark('present')} 
              className="px-3 py-1 text-sm bg-green-600 text-white border border-green-700 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 inline mr-1" /> All Present
            </button>
            <button 
              onClick={() => handleBulkMark('absent')} 
              className="px-3 py-1 text-sm bg-red-600 text-white border border-red-700 hover:bg-red-700"
            >
              <X className="h-4 w-4 inline mr-1" /> All Absent
            </button>
            <button 
              onClick={handleSaveAttendance} 
              disabled={loading.saving}
              className="px-4 py-1 text-sm bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading.saving ? <ButtonSpinner /> : <Save className="h-4 w-4 inline mr-1" />}
              Save All
            </button>
          </div>
        </div>

        {/* Students Grid/List View */}
        {loading.students ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-600">No students found in this class</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedStudents.map(student => {
                  const status = attendanceRecords[student.id] || 'unmarked';
                  const isSelected = selectedStudents.has(student.id);
                  return (
                    <div 
                      key={student.id} 
                      className={`bg-white border transition-all cursor-pointer hover:shadow-lg ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                      } ${status === 'present' ? 'bg-green-50' : status === 'absent' ? 'bg-red-50' : 'bg-white'}`}
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-bold text-lg">
                              {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                            </span>
                          </div>
                          <AttendanceToggle 
                            status={status === 'present' ? 'present' : 'absent'}
                            onToggle={(e) => { e.stopPropagation(); handleToggleAttendance(student.id); }}
                            disabled={loading.saving}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-gray-500">{student.admission_no}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 ${
                              (student.attendance_rate || 0) >= 90 ? 'bg-green-100 text-green-800' :
                              (student.attendance_rate || 0) >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {(student.attendance_rate || 0)}% overall
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left w-10">
                          <input 
                            type="checkbox" 
                            checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                            onChange={() => handleSelectAll()}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Admission No.</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Gender</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Overall Attendance</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Today's Status</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Quick Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map(student => {
                        const status = attendanceRecords[student.id] || 'unmarked';
                        return (
                          <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input 
                                type="checkbox" 
                                checked={selectedStudents.has(student.id)}
                                onChange={() => handleStudentSelect(student.id)}
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-600">{student.admission_no}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{student.first_name} {student.last_name}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{student.gender}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-20 bg-gray-200 h-1.5">
                                  <div className="bg-blue-600 h-1.5" style={{ width: `${student.attendance_rate || 0}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-600">{student.attendance_rate || 0}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-medium ${
                                status === 'present' ? 'bg-green-100 text-green-800' :
                                status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {status === 'present' ? 'Present' : status === 'absent' ? 'Absent' : 'Not Marked'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <AttendanceToggle 
                                status={status === 'present' ? 'present' : 'absent'}
                                onToggle={() => handleToggleAttendance(student.id)}
                                disabled={loading.saving}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Summary Footer */}
            <div className="mt-4 p-3 bg-gray-100 border border-gray-200 text-sm text-gray-600 flex justify-between items-center">
              <span>Showing {paginatedStudents.length} of {filteredStudents.length} students</span>
              <span className="font-medium">
                Present: {stats.present} | Absent: {stats.absent} | Unmarked: {Object.values(attendanceRecords).filter(s => s === 'unmarked').length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar 
        selectedCount={selectedStudents.size}
        onMarkAllPresent={() => handleBulkMark('present')}
        onMarkAllAbsent={() => handleBulkMark('absent')}
        onClear={() => setSelectedStudents(new Set())}
        onSave={handleSaveAttendance}
      />

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Attendance;