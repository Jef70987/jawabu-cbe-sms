/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Plus, RefreshCw, Download, FileText,
  Layers, GitBranch, Target, Award, Users,
  AlertCircle, CheckCircle, X, Loader2, Eye,
  ChevronDown, ChevronRight, Search, Filter,
  Calendar, Clock, Link2, CheckSquare,
  TrendingUp, BarChart3, Activity, ClipboardList,
  GraduationCap, UserCheck, Edit2, Save,
  Printer, Share2, ChevronLeft, ChevronRight as ChevronRightIcon,
  Grid, List, Star, Trophy, Flame, Zap
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
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

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      {type === 'warning' && <AlertCircle className="h-5 w-5" />}
      {(!type || type === 'info') && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => onClose?.()} className="ml-4 text-white/80 hover:text-white">
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
      <p className="text-gray-700 font-medium">Loading curriculum...</p>
    </div>
  </div>
);

// Progress Ring Component
const ProgressRing = ({ percentage, size = 80, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-gray-800">{percentage}%</span>
        {label && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </div>
  );
};

// Lesson Plan Modal
const LessonPlanModal = ({ isOpen, onClose, lesson, onSave }) => {
  const [formData, setFormData] = useState({
    topic: '',
    objectives: [],
    activities: [],
    resources: [],
    assessment: '',
    duration: 40,
    date: new Date().toISOString().split('T')[0],
    status: 'planned'
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        topic: lesson.topic || '',
        objectives: lesson.objectives || [],
        activities: lesson.activities || [],
        resources: lesson.resources || [],
        assessment: lesson.assessment || '',
        duration: lesson.duration || 40,
        date: lesson.date || new Date().toISOString().split('T')[0],
        status: lesson.status || 'planned'
      });
    }
  }, [lesson]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Lesson Plan</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Lesson Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="e.g., Introduction to Cell Structure"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Learning Objectives</label>
            <textarea
              value={formData.objectives.join('\n')}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value.split('\n').filter(o => o.trim()) })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Enter each objective on a new line"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Learning Activities</label>
            <textarea
              value={formData.activities.join('\n')}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value.split('\n').filter(a => a.trim()) })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Enter each activity on a new line"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teaching/Learning Resources</label>
            <textarea
              value={formData.resources.join('\n')}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value.split('\n').filter(r => r.trim()) })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Enter each resource on a new line"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Method</label>
            <textarea
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="How will learning be assessed?"
            />
          </div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium">
            <Save className="h-4 w-4 inline mr-1" /> Save Lesson Plan
          </button>
        </div>
      </div>
    </div>
  );
};

function TeacherCurriculum() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [curriculum, setCurriculum] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [strands, setStrands] = useState([]);
  const [loading, setLoading] = useState({ curriculum: true, subjects: true });
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed
  const [searchTerm, setSearchTerm] = useState('');
  const [syllabusProgress, setSyllabusProgress] = useState({});
  const [lessonPlans, setLessonPlans] = useState({});
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedStrand, setSelectedStrand] = useState(null);
  const [expandedStrands, setExpandedStrands] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access curriculum');
      return;
    }
    fetchCurriculumData();
  }, [isAuthenticated]);

  const fetchCurriculumData = async () => {
    setLoading({ curriculum: true, subjects: true });
    try {
      await Promise.all([
        fetchSubjects(),
        fetchGradeLevels(),
        fetchSyllabusProgress()
      ]);
    } catch (error) {
      console.error('Error fetching curriculum:', error);
      addToast('error', 'Failed to load curriculum data');
    } finally {
      setLoading({ curriculum: false, subjects: false });
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-subjects/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
        if (data.data.length > 0 && !selectedSubject) {
          setSelectedSubject(data.data[0]);
          await fetchStrandsForSubject(data.data[0].id);
        }
      } else {
        // Mock data
        const mockSubjects = [
          { id: 1, name: 'Mathematics', code: 'MAT', description: 'Core Mathematics', isCore: true, gradeLevel: 'G7' },
          { id: 2, name: 'English', code: 'ENG', description: 'English Language', isCore: true, gradeLevel: 'G7' },
          { id: 3, name: 'Integrated Science', code: 'SCI', description: 'Integrated Science', isCore: true, gradeLevel: 'G7' },
          { id: 4, name: 'Pre-Technical Studies', code: 'PTS', description: 'Pre-Technical Studies', isCore: true, gradeLevel: 'G7' }
        ];
        setSubjects(mockSubjects);
        setSelectedSubject(mockSubjects[0]);
        await fetchStrandsForSubject(mockSubjects[0].id);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchGradeLevels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/grade-levels/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setGradeLevels(data.data);
        if (data.data.length > 0 && !selectedGrade) {
          setSelectedGrade(data.data[0]);
        }
      } else {
        // Mock grade levels
        const mockGrades = [
          { id: 7, name: 'Grade 7', code: 'G7', level: 7 },
          { id: 8, name: 'Grade 8', code: 'G8', level: 8 },
          { id: 9, name: 'Grade 9', code: 'G9', level: 9 }
        ];
        setGradeLevels(mockGrades);
        setSelectedGrade(mockGrades[0]);
      }
    } catch (error) {
      console.error('Error fetching grade levels:', error);
    }
  };

  const fetchStrandsForSubject = async (subjectId, gradeId = selectedGrade?.id) => {
    setLoading(prev => ({ ...prev, curriculum: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/curriculum/strands/?subject=${subjectId}&grade=${gradeId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStrands(data.data);
        // Initialize expanded state for all strands
        const expanded = {};
        data.data.forEach(strand => {
          expanded[strand.id] = false;
        });
        setExpandedStrands(expanded);
      } else {
        // Mock strands data for Integrated Science
        const mockStrands = [
          { 
            id: 1, 
            name: 'Human Health', 
            code: 'HH', 
            description: 'Understanding the human body and health practices',
            subStrands: [
              { id: 11, name: 'The Circulatory System', code: 'CS', outcomes: [
                { id: 111, description: 'Identify the parts of the circulatory system', domain: 'cognitive', competencies: ['CT', 'DL'] },
                { id: 112, description: 'Demonstrate how blood flows through the heart', domain: 'psychomotor', competencies: ['CT', 'PS'] }
              ]},
              { id: 12, name: 'The Respiratory System', code: 'RS', outcomes: [
                { id: 121, description: 'Explain the process of breathing', domain: 'cognitive', competencies: ['CT'] },
                { id: 122, description: 'Model the breathing process using a bell jar', domain: 'psychomotor', competencies: ['CT', 'PS'] }
              ]}
            ],
            progress: 65,
            totalLessons: 8,
            completedLessons: 5
          },
          { 
            id: 2, 
            name: 'Environment and Resources', 
            code: 'ER', 
            description: 'Understanding environmental conservation and resource management',
            subStrands: [
              { id: 21, name: 'Conservation of Resources', code: 'CR', outcomes: [
                { id: 211, description: 'Identify renewable and non-renewable resources', domain: 'cognitive', competencies: ['CT', 'DL'] },
                { id: 212, description: 'Demonstrate proper waste management practices', domain: 'psychomotor', competencies: ['PS', 'CO'] }
              ]}
            ],
            progress: 40,
            totalLessons: 10,
            completedLessons: 4
          },
          { 
            id: 3, 
            name: 'Plants and Animals', 
            code: 'PA', 
            description: 'Classification and characteristics of living things',
            subStrands: [
              { id: 31, name: 'Classification of Living Things', code: 'CLT', outcomes: [
                { id: 311, description: 'Classify organisms into their kingdoms', domain: 'cognitive', competencies: ['CT'] }
              ]}
            ],
            progress: 25,
            totalLessons: 12,
            completedLessons: 3
          }
        ];
        setStrands(mockStrands);
      }
    } catch (error) {
      console.error('Error fetching strands:', error);
      addToast('error', 'Failed to load curriculum content');
    } finally {
      setLoading(prev => ({ ...prev, curriculum: false }));
    }
  };

  const fetchSyllabusProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/syllabus-progress/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSyllabusProgress(data.data);
      } else {
        // Mock progress
        const mockProgress = {
          1: { covered: 65, total: 100, completedLessons: 5, totalLessons: 8 },
          2: { covered: 40, total: 100, completedLessons: 4, totalLessons: 10 },
          3: { covered: 25, total: 100, completedLessons: 3, totalLessons: 12 }
        };
        setSyllabusProgress(mockProgress);
      }
    } catch (error) {
      console.error('Error fetching syllabus progress:', error);
    }
  };

  const handleSubjectChange = (subjectId) => {
    const subject = subjects.find(s => s.id === parseInt(subjectId));
    setSelectedSubject(subject);
    fetchStrandsForSubject(subjectId);
  };

  const handleGradeChange = (gradeId) => {
    const grade = gradeLevels.find(g => g.id === parseInt(gradeId));
    setSelectedGrade(grade);
    if (selectedSubject) {
      fetchStrandsForSubject(selectedSubject.id, gradeId);
    }
  };

  const toggleStrandExpanded = (strandId) => {
    setExpandedStrands(prev => ({ ...prev, [strandId]: !prev[strandId] }));
  };

  const handleCreateLessonPlan = (strand, subStrand, outcome) => {
    setSelectedLesson({
      strand,
      subStrand,
      outcome,
      topic: `${subStrand?.name || strand?.name} - ${outcome?.description?.substring(0, 50)}...`
    });
    setShowLessonModal(true);
  };

  const handleSaveLessonPlan = async (lessonData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/lesson-plans/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...lessonData,
          subject_id: selectedSubject?.id,
          grade_id: selectedGrade?.id,
          strand_id: selectedLesson?.strand?.id,
          substrand_id: selectedLesson?.subStrand?.id,
          outcome_id: selectedLesson?.outcome?.id
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Lesson plan saved successfully');
        setShowLessonModal(false);
        setSelectedLesson(null);
      } else {
        addToast('error', data.error || 'Failed to save lesson plan');
      }
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      addToast('error', 'Failed to save lesson plan');
    }
  };

  const getOverallProgress = () => {
    if (strands.length === 0) return 0;
    const total = strands.reduce((sum, s) => sum + (s.progress || 0), 0);
    return Math.round(total / strands.length);
  };

  const getCompletedLessons = () => {
    return strands.reduce((sum, s) => sum + (s.completedLessons || 0), 0);
  };

  const getTotalLessons = () => {
    return strands.reduce((sum, s) => sum + (s.totalLessons || 0), 0);
  };

  const filteredStrands = useMemo(() => {
    if (!searchTerm) return strands;
    return strands.filter(strand =>
      strand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.subStrands?.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [strands, searchTerm]);

  const paginatedStrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStrands.slice(start, start + itemsPerPage);
  }, [filteredStrands, currentPage]);

  const totalPages = Math.ceil(filteredStrands.length / itemsPerPage);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access curriculum</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">
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

      {(loading.curriculum || loading.subjects) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Curriculum & Syllabus</h1>
              <p className="text-green-100 mt-1">CBC/CBE curriculum structure, learning outcomes, and lesson planning</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm border ${viewMode === 'grid' ? 'bg-white text-green-700' : 'bg-green-600 text-white border-green-500'}`}>
                <Grid className="h-4 w-4 inline mr-1" /> Grid
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm border ${viewMode === 'list' ? 'bg-white text-green-700' : 'bg-green-600 text-white border-green-500'}`}>
                <List className="h-4 w-4 inline mr-1" /> List
              </button>
              <button onClick={() => fetchCurriculumData()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Subject & Grade Selector */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Subject</label>
              <select
                value={selectedSubject?.id || ''}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Grade</label>
              <select
                value={selectedGrade?.id || ''}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {gradeLevels.map(grade => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Search Strand/Topic</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Progress Overview */}
        <div className="bg-white border border-gray-300 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Syllabus Coverage Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <ProgressRing percentage={getOverallProgress()} size={100} strokeWidth={8} label="Overall" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">{getCompletedLessons()}</div>
              <p className="text-sm text-gray-600">Lessons Completed</p>
              <p className="text-xs text-gray-400">out of {getTotalLessons()}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">{Math.round((getCompletedLessons() / (getTotalLessons() || 1)) * 100)}%</div>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-700">{getTotalLessons() - getCompletedLessons()}</div>
              <p className="text-sm text-gray-600">Remaining Lessons</p>
            </div>
          </div>
        </div>

        {/* Curriculum Content */}
        {loading.curriculum ? (
          <div className="bg-white border border-gray-300 p-12 text-center">
            <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading curriculum content...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedStrands.map(strand => {
                  const progress = strand.progress || syllabusProgress[strand.id]?.covered || 0;
                  return (
                    <div key={strand.id} className="bg-white border border-gray-300">
                      <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{strand.name}</h3>
                            <p className="text-xs text-gray-500">Code: {strand.code}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-700">{progress}%</div>
                            <div className="w-24 bg-gray-200 h-1.5 mt-1">
                              <div className="bg-green-600 h-1.5" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">{strand.description}</p>
                        <div className="space-y-3">
                          {strand.subStrands?.map(subStrand => (
                            <div key={subStrand.id} className="border-l-2 border-green-300 pl-3">
                              <h4 className="font-medium text-gray-800 text-sm">{subStrand.name}</h4>
                              <div className="mt-2 space-y-1">
                                {subStrand.outcomes?.map(outcome => (
                                  <div key={outcome.id} className="flex items-start justify-between text-sm">
                                    <span className="text-gray-600 flex-1">• {outcome.description}</span>
                                    <button
                                      onClick={() => handleCreateLessonPlan(strand, subStrand, outcome)}
                                      className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                    >
                                      <FileText className="h-3 w-3 inline mr-1" />
                                      Plan
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{strand.completedLessons || 0}/{strand.totalLessons || 0} lessons</span>
                          <button
                            onClick={() => handleCreateLessonPlan(strand, null, null)}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
                          >
                            <Plus className="h-3 w-3 inline mr-1" />
                            Add Lesson Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Strand/Topic</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Sub-Strand</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Learning Outcome</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Domain</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Competencies</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Progress</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStrands.map(strand => (
                        strand.subStrands?.map(subStrand => (
                          subStrand.outcomes?.map((outcome, idx) => (
                            <tr key={`${strand.id}-${subStrand.id}-${outcome.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                              {idx === 0 && (
                                <>
                                  <td className="px-4 py-3 font-medium text-gray-900" rowSpan={subStrand.outcomes.length}>
                                    {strand.name}
                                    <div className="text-xs text-gray-500">{strand.code}</div>
                                  </td>
                                  <td className="px-4 py-3" rowSpan={subStrand.outcomes.length}>
                                    {subStrand.name}
                                    <div className="text-xs text-gray-500">{subStrand.code}</div>
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-3 text-gray-700">{outcome.description}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                  {outcome.domain}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {outcome.competencies?.map(comp => (
                                    <span key={comp} className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 bg-gray-200 h-1.5">
                                    <div className="bg-green-600 h-1.5" style={{ width: `${strand.progress || 0}%` }}></div>
                                  </div>
                                  <span className="text-xs text-gray-600">{strand.progress || 0}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleCreateLessonPlan(strand, subStrand, outcome)}
                                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                  <FileText className="h-3 w-3 inline mr-1" />
                                  Plan
                                </button>
                              </td>
                            </tr>
                          ))
                        ))
                      ))}
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

            {/* Quick Stats Footer */}
            <div className="mt-4 p-3 bg-gray-100 border border-gray-300 text-sm text-gray-600 flex justify-between items-center">
              <span>Showing {paginatedStrands.length} of {filteredStrands.length} strands</span>
              <div className="flex gap-4">
                <span><span className="font-bold">{subjects.length}</span> Subjects</span>
                <span><span className="font-bold">{strands.length}</span> Strands</span>
                <span><span className="font-bold">{strands.reduce((sum, s) => sum + (s.subStrands?.length || 0), 0)}</span> Sub-strands</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lesson Plan Modal */}
      <LessonPlanModal
        isOpen={showLessonModal}
        onClose={() => { setShowLessonModal(false); setSelectedLesson(null); }}
        lesson={selectedLesson}
        onSave={handleSaveLessonPlan}
      />

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

export default TeacherCurriculum;