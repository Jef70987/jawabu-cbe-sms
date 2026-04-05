/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { 
  Calendar, Plus, Edit2, Trash2, Eye, FileText, 
  Clock, Users, BookOpen, TrendingUp, Award,
  CheckCircle, AlertCircle, RefreshCw, Download,
  Printer, BarChart3, PieChart, Target, Medal,
  School, User, ChevronRight, ChevronDown, Search,
  Filter, XCircle, Loader2, Settings, Layout
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ExamAndReportManagement() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('assessment-windows');
  
  // Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [learningAreas, setLearningAreas] = useState([]);
  const [assessmentWindows, setAssessmentWindows] = useState([]);
  const [summativeAssessments, setSummativeAssessments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  
  // Performance Analysis
  const [analysisLevel, setAnalysisLevel] = useState('school');
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);   // tracks which assessment window is being edited

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  // Fetch Data
  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAcademicYears(),
        fetchClasses(),
        fetchLearningAreas(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      const res = await fetch(url, { 
        ...options, 
        headers: getAuthHeaders() 
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.success ? data : null;
    } catch (error) {
      console.warn(`Fetch failed for ${url}:`, error);
      return null;
    }
  };

  const fetchAcademicYears = async () => {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/registrar/academic/academic-years/`);
    if (data) {
      setAcademicYears(data.data);
      const current = data.data.find(y => y.is_current) || data.data[0];
      if (current) {
        setSelectedAcademicYear(current);
      }
    }
  };

  const fetchTerms = async (yearId) => {
    if (!yearId) return;
    const data = await fetchWithErrorHandling(
      `${API_BASE_URL}/api/registrar/academic/terms/?academic_year=${yearId}`
    );
    if (data && data.data) {
      setTerms(data.data);
    }
  };

  // AUTO-FETCH TERMS whenever selectedAcademicYear changes
  useEffect(() => {
    if (selectedAcademicYear?.id) {
      fetchTerms(selectedAcademicYear.id);
    }
  }, [selectedAcademicYear]);

  // AUTO-SELECT CURRENT TERM when terms are loaded
  useEffect(() => {
    if (terms.length > 0) {
      const currentTerm = terms.find(t => t.is_current) || terms[0];
      if (currentTerm && (!selectedTerm || selectedTerm.id !== currentTerm.id)) {
        setSelectedTerm(currentTerm);
      }
    }
  }, [terms]);

  // AUTO-FETCH assessment windows when tab is active OR term changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'assessment-windows') {
      fetchAssessmentWindows();
    }
  }, [activeTab, selectedTerm, isAuthenticated]);

  // AUTO-FETCH timetable when tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'timetable' && selectedClass?.id && selectedTerm?.id) {
      fetchTimetable();
    }
  }, [activeTab, selectedClass, selectedTerm, isAuthenticated]);

  const fetchClasses = async () => {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/registrar/classes/`);
    if (data) setClasses(data.data);
  };

  const fetchStudents = async (classId) => {
    const data = await fetchWithErrorHandling(
      `${API_BASE_URL}/api/registrar/students/?class_id=${classId}`
    );
    if (data) setStudents(data.data);
  };

  const fetchLearningAreas = async () => {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/registrar/academic/learning-areas/`);
    if (data) setLearningAreas(data.data);
  };

  const fetchAssessmentWindows = async () => {
    let url = `${API_BASE_URL}/api/registrar/academic/assessment-windows/`;
    if (selectedTerm?.id) url += `?term=${selectedTerm.id}`;
    const data = await fetchWithErrorHandling(url);
    setAssessmentWindows(data ? (data.data || []) : []);
  };

  const fetchSummativeAssessments = async () => {
    let url = `${API_BASE_URL}/api/registrar/academic/summative-assessments/`;
    if (selectedClass?.id) url += `?class_id=${selectedClass.id}`;
    if (selectedTerm?.id) url += `${selectedClass?.id ? '&' : '?'}term=${selectedTerm.id}`;
    const data = await fetchWithErrorHandling(url);
    if (data) setSummativeAssessments(data.data || []);
  };

  const fetchTimetable = async () => {
    if (!selectedClass?.id || !selectedTerm?.id) return;
    const data = await fetchWithErrorHandling(
      `${API_BASE_URL}/api/registrar/academic/timetable/?class_id=${selectedClass.id}&term=${selectedTerm.id}`
    );
    if (data) setTimetable(data.data || []);
  };

  const fetchPerformanceData = async () => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/registrar/academic/performance-analysis/`;
    const params = new URLSearchParams();
    if (selectedTerm?.id) params.append('term', selectedTerm.id);
    if (analysisLevel === 'class' && selectedClass?.id) params.append('class_id', selectedClass.id);
    if (analysisLevel === 'student' && selectedStudent?.id) params.append('student_id', selectedStudent.id);
    if (params.toString()) url += `?${params.toString()}`;
    
    const data = await fetchWithErrorHandling(url);
    if (data) setAnalysisData(data.data);
    else addNotification('error', 'Failed to load performance data');
    setLoading(false);
  };

  // ─────────────────────────────────────────────────────────────
  // UNIFIED SAVE (Create OR Update) + DELETE for Assessment Windows
  // ─────────────────────────────────────────────────────────────
  const handleSaveAssessmentWindow = async () => {
    const url = editingId 
      ? `${API_BASE_URL}/api/registrar/academic/assessment-windows/${editingId}/`
      : `${API_BASE_URL}/api/registrar/academic/assessment-windows/create/`;
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          ...formData, 
          term: selectedTerm?.id 
        })
      });

      const data = await res.json();
      if (data.success) {
        addNotification('success', editingId ? 'Assessment window updated' : 'Assessment window created');
        setShowModal(false);
        setEditingId(null);
        setFormData({});
        fetchAssessmentWindows();   // refresh instantly
      } else {
        addNotification('error', data.error || 'Save failed');
      }
    } catch (error) {
      addNotification('error', 'Failed to save assessment window');
    }
  };

  const handleDeleteAssessmentWindow = async (windowId) => {
    if (!window.confirm('Delete this assessment window permanently? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/registrar/academic/assessment-windows/${windowId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (data.success) {
        addNotification('success', 'Assessment window deleted');
        fetchAssessmentWindows();
      } else {
        addNotification('error', data.error || 'Delete failed');
      }
    } catch (error) {
      addNotification('error', 'Failed to delete assessment window');
    }
  };

  const handleCreateSummativeAssessment = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrar/academic/summative-assessments/create/`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, term: selectedTerm?.id, class_id: selectedClass?.id })
      });
      const data = await res.json();
      if (data.success) {
        addNotification('success', 'Summative assessment created');
        setShowModal(false);
        setFormData({});
        fetchSummativeAssessments();
      } else {
        addNotification('error', data.error || 'Creation failed');
      }
    } catch (error) {
      addNotification('error', 'Failed to create summative assessment');
    }
  };

  const handleGenerateTimetable = async () => {
    if (!selectedClass?.id || !selectedTerm?.id) {
      addNotification('warning', 'Please select class and term');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrar/academic/timetable/generate/`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: selectedClass.id, term: selectedTerm.id })
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data || []);
        addNotification('success', 'Timetable generated');
      } else {
        addNotification('error', data.error || 'Generation failed');
      }
    } catch (error) {
      addNotification('error', 'Failed to generate timetable');
    }
  };

  // Stats
  const stats = {
    assessmentWindows: assessmentWindows.length,
    activeWindows: assessmentWindows.filter(w => w.is_active).length,
    summativeAssessments: summativeAssessments.length,
    publishedAssessments: summativeAssessments.filter(a => a.status === 'Published').length
  };

  // Notification Component
  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <FileText className="h-5 w-5 text-blue-500" />
    };

    const styles = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200'
    };

    return (
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}>
        {icons[type]}
        <p className="text-sm font-medium text-gray-800">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Form Modal
  const FormModal = ({ isOpen, onClose, onSubmit, title, children, submitText = "Save" }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {submitText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Stat Card
  const StatCard = ({ title, value, icon, color, trend }) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      pink: 'bg-pink-50 text-pink-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-2">{trend}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // Performance Bar
  const PerformanceBar = ({ label, percentage, color }) => {
    const colors = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${colors[color]} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  // Rating Badge
  const RatingBadge = ({ rating, count }) => {
    const config = {
      EE: { label: 'Exceeding', color: 'bg-green-100 text-green-800', icon: '🏆' },
      ME: { label: 'Meeting', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      AE: { label: 'Approaching', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
      BE: { label: 'Below', color: 'bg-red-100 text-red-800', icon: '❌' }
    };

    const { label, color, icon } = config[rating] || config.ME;

    return (
      <div className="text-center">
        <div className={`px-3 py-2 rounded-lg ${color}`}>
          <div className="text-lg font-bold">{count}</div>
          <div className="text-xs font-medium">{label}</div>
        </div>
      </div>
    );
  };

  const renderAssessmentWindows = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assessment Windows" value={stats.assessmentWindows} icon={<Calendar className="h-6 w-6" />} color="blue" />
        <StatCard title="Active Windows" value={stats.activeWindows} icon={<CheckCircle className="h-6 w-6" />} color="green" />
        <StatCard title="Summative Assessments" value={stats.summativeAssessments} icon={<FileText className="h-6 w-6" />} color="purple" />
        <StatCard title="Published" value={stats.publishedAssessments} icon={<Eye className="h-6 w-6" />} color="indigo" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Assessment Windows
            </h3>
            <p className="text-sm text-gray-500 mt-1">Opener, Mid-Term, and End-Term assessment periods</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAssessmentWindows}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setModalType('assessmentWindow');
                setFormData({ assessment_type: '', weight_percentage: '', open_date: '', close_date: '', is_active: true });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Window
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {assessmentWindows.length === 0 ? (
            <div className="col-span-3 py-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No assessment windows created yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first window above</p>
            </div>
          ) : (
            assessmentWindows.map(window => (
              <div key={window.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800 text-lg">{window.assessment_type}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${window.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {window.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weight:</span>
                    <span className="font-medium text-gray-700">{window.weight_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Period:</span>
                    <span className="text-gray-700">{window.open_date} - {window.close_date}</span>
                  </div>
                  {window.term_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Term:</span>
                      <span className="text-gray-700">{window.term_name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(window.id);
                      setFormData({
                        assessment_type: window.assessment_type,
                        weight_percentage: window.weight_percentage,
                        open_date: window.open_date,
                        close_date: window.close_date,
                        is_active: window.is_active,
                      });
                      setModalType('assessmentWindow');
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit window"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAssessmentWindow(window.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete window"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
            <select
              value={selectedClass?.id || ''}
              onChange={(e) => {
                const cls = classes.find(c => c.id === e.target.value);
                setSelectedClass(cls);
                if (cls) fetchStudents(cls.id);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 w-64"
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name} ({c.class_code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Term</label>
            <select
              value={selectedTerm?.id || ''}
              onChange={(e) => {
                const term = terms.find(t => t.id === e.target.value);
                setSelectedTerm(term);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 w-48"
            >
              <option value="">Select Term</option>
              {terms.map(t => (
                <option key={t.id} value={t.id}>
                  {t.term} {t.is_current ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateTimetable}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Timetable
          </button>
        </div>
      </div>

      {timetable.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-2" />
              Exam Timetable - {selectedClass?.class_name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Learning Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timetable.map((slot, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{slot.date}</td>
                    <td className="px-4 py-3 text-sm">{slot.time}</td>
                    <td className="px-4 py-3 text-sm font-medium">{slot.learning_area}</td>
                    <td className="px-4 py-3 text-sm">{slot.duration} mins</td>
                    <td className="px-4 py-3 text-sm">{slot.venue || 'Classroom'}</td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformanceAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Level</label>
            <select
              value={analysisLevel}
              onChange={(e) => setAnalysisLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="school">School-wide Analysis</option>
              <option value="class">Class Analysis</option>
              <option value="student">Student Analysis</option>
            </select>
          </div>
          {analysisLevel === 'class' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const cls = classes.find(c => c.id === e.target.value);
                  setSelectedClass(cls);
                  if (cls) fetchStudents(cls.id);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 w-48"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.class_name}</option>
                ))}
              </select>
            </div>
          )}
          {analysisLevel === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass?.id || ''}
                  onChange={(e) => {
                    const cls = classes.find(c => c.id === e.target.value);
                    setSelectedClass(cls);
                    if (cls) fetchStudents(cls.id);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-48"
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.class_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudent(students.find(s => s.id === e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-64"
                  disabled={!selectedClass}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Term</label>
            <select
              value={selectedTerm?.id || ''}
              onChange={(e) => {
                const term = terms.find(t => t.id === e.target.value);
                setSelectedTerm(term);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 w-40"
            >
              <option value="">Select Term</option>
              {terms.map(t => (
                <option key={t.id} value={t.id}>{t.term} {t.is_current ? '(Current)' : ''}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchPerformanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Load Analysis
          </button>
        </div>
      </div>

      {analysisData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90">Average Performance</p>
              <p className="text-3xl font-bold mt-1">{analysisData.average_performance}%</p>
              <p className="text-xs opacity-75 mt-2">Overall CBE rating</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90">Competency Mastery</p>
              <p className="text-3xl font-bold mt-1">{analysisData.competency_mastery}%</p>
              <p className="text-xs opacity-75 mt-2">ME & EE combined</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90">Top Performing Area</p>
              <p className="text-xl font-bold truncate mt-1">{analysisData.top_performing_area}</p>
              <p className="text-xs opacity-75 mt-2">Highest mastery</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90">Needs Improvement</p>
              <p className="text-xl font-bold truncate mt-1">{analysisData.needs_improvement_area}</p>
              <p className="text-xs opacity-75 mt-2">Requires intervention</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Competency Rating Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RatingBadge rating="EE" count={analysisData.competency_breakdown?.EE || 0} />
              <RatingBadge rating="ME" count={analysisData.competency_breakdown?.ME || 0} />
              <RatingBadge rating="AE" count={analysisData.competency_breakdown?.AE || 0} />
              <RatingBadge rating="BE" count={analysisData.competency_breakdown?.BE || 0} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-green-600 mr-2" />
              Learning Area Performance
            </h3>
            <div className="space-y-4">
              {analysisData.learning_areas?.map(area => (
                <PerformanceBar
                  key={area.name}
                  label={area.name}
                  percentage={area.percentage}
                  color={area.percentage >= 80 ? 'green' : area.percentage >= 60 ? 'blue' : area.percentage >= 40 ? 'yellow' : 'red'}
                />
              ))}
            </div>
          </div>

          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysisData.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start text-amber-700">
                    <ChevronRight className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Please login to access exam and report management</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>

      {notifications.map(n => (
        <Notification key={n.id} type={n.type} message={n.message} onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} />
      ))}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="h-7 w-7 text-blue-600 mr-2" />
                Exam & Report Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage assessment windows, exam timetables, and performance analysis
              </p>
              {user && <p className="text-xs text-gray-400 mt-1">{user.first_name} {user.last_name} • {user.role}</p>}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedAcademicYear?.id || ''}
                onChange={(e) => {
                  const year = academicYears.find(y => y.id === e.target.value);
                  setSelectedAcademicYear(year);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {academicYears.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.year_name} ({year.year_code}) {year.is_current ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              <button onClick={fetchAllData} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            {[
              { id: 'assessment-windows', label: 'Assessment Windows', icon: Calendar },
              { id: 'timetable', label: 'Exam Timetable', icon: Clock },
              { id: 'performance', label: 'Performance Analysis', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'assessment-windows' && renderAssessmentWindows()}
            {activeTab === 'timetable' && renderTimetable()}
            {activeTab === 'performance' && renderPerformanceAnalysis()}
          </>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
          setFormData({});
        }}
        onSubmit={modalType === 'assessmentWindow' ? handleSaveAssessmentWindow : handleCreateSummativeAssessment}
        title={
          modalType === 'assessmentWindow' 
            ? (editingId ? 'Edit Assessment Window' : 'Add Assessment Window')
            : 'Create Summative Assessment'
        }
      >
        {modalType === 'assessmentWindow' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
              <select
                value={formData.assessment_type || ''}
                onChange={e => setFormData({...formData, assessment_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="Opener">Opener</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="End-Term">End-Term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight Percentage</label>
              <input
                type="number"
                value={formData.weight_percentage || ''}
                onChange={e => setFormData({...formData, weight_percentage: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., 15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Open Date</label>
                <input
                  type="date"
                  value={formData.open_date || ''}
                  onChange={e => setFormData({...formData, open_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                <input
                  type="date"
                  value={formData.close_date || ''}
                  onChange={e => setFormData({...formData, close_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.is_active !== false}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Code</label>
              <input
                type="text"
                value={formData.assessment_code || ''}
                onChange={e => setFormData({...formData, assessment_code: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., ASS-202403-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Area</label>
              <select
                value={formData.learning_area || ''}
                onChange={e => setFormData({...formData, learning_area: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select Learning Area</option>
                {learningAreas.map(area => (
                  <option key={area.id} value={area.id}>{area.area_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Window</label>
              <select
                value={formData.assessment_window || ''}
                onChange={e => setFormData({...formData, assessment_window: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select Assessment Window</option>
                {assessmentWindows.map(window => (
                  <option key={window.id} value={window.id}>{window.assessment_type} ({window.weight_percentage}%)</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}

export default ExamAndReportManagement;