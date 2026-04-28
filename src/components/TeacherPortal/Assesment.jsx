/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, RefreshCw, FileText, CheckSquare, X, Loader2,
  AlertCircle, CheckCircle, Edit2, Trash2,
  Calendar, Users, Target, BarChart3,
  Search, ChevronLeft, ChevronRight,
  Trophy, Zap, Send
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white'
  };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${styles[type] || 'bg-blue-600 text-white'} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

function AssessmentManager() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [assessments, setAssessments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedAssessmentMaxScore, setSelectedAssessmentMaxScore] = useState(100);
  const [resultsData, setResultsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'cat',
    description: '',
    classId: '',
    subjectId: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59',
    maxScore: 100,
    instructions: '',
    allowLateSubmission: false,
    latePenalty: 10,
    published: false
  });

  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [gradingPage, setGradingPage] = useState(1);
  const [gradingSearch, setGradingSearch] = useState('');
  const studentsPerPage = 10;

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAssessments(), fetchClasses(), fetchSubjects()]);
    } catch (error) {
      addToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/list/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.data);
      }
    } catch (error) {
      addToast('error', 'Failed to load assessments');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/classes/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      addToast('error', 'Failed to load classes');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/subjects/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      addToast('error', 'Failed to load subjects');
    }
  };

  const fetchStudentsForGrading = async (assessmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${assessmentId}/students/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        setSelectedAssessmentMaxScore(data.maxScore);
        const initialScores = {};
        const initialFeedback = {};
        data.data.forEach(student => {
          initialScores[student.id] = (student.score !== undefined && student.score !== '') ? student.score : '';
          initialFeedback[student.id] = student.feedback || '';
        });
        setScores(initialScores);
        setFeedback(initialFeedback);
      }
    } catch (error) {
      addToast('error', 'Failed to load students');
    }
  };

  const handleCreateAssessment = async () => {
    if (!formData.title || !formData.classId || !formData.subjectId) {
      addToast('warning', 'Please fill in title, class, and subject');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment created successfully');
        setShowCreateModal(false);
        setFormData({
          title: '',
          type: 'cat',
          description: '',
          classId: '',
          subjectId: '',
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: '23:59',
          maxScore: 100,
          instructions: '',
          allowLateSubmission: false,
          latePenalty: 10,
          published: false
        });
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to create assessment');
      }
    } catch (error) {
      addToast('error', 'Failed to create assessment');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishAssessment = async (assessment) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${assessment.id}/publish/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'published' })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment published successfully');
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to publish assessment');
      }
    } catch (error) {
      addToast('error', 'Failed to publish assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      title: assessment.title || '',
      type: assessment.exam_type === 'cat' ? 'cat' : assessment.exam_type === 'cba' ? 'assignment' : 'exam',
      description: '',
      classId: assessment.classes?.[0] || '',
      subjectId: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '23:59',
      maxScore: assessment.max_score || assessment.total_marks || 100,
      instructions: assessment.instructions || '',
      allowLateSubmission: false,
      latePenalty: 10,
      published: assessment.status === 'published'
    });
    setShowEditModal(true);
  };

  const handleUpdateAssessment = async () => {
    if (!selectedAssessment) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${selectedAssessment.id}/update/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          maxScore: formData.maxScore,
          instructions: formData.instructions
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment updated successfully');
        setShowEditModal(false);
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to update assessment');
      }
    } catch (error) {
      addToast('error', 'Failed to update assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssessment) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${selectedAssessment.id}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment deleted');
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to delete');
      }
    } catch (error) {
      addToast('error', 'Failed to delete assessment');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
      setSelectedAssessment(null);
    }
  };

  const handleStartGrading = async (assessment) => {
    setSelectedAssessment(assessment);
    await fetchStudentsForGrading(assessment.id);
    setGradingPage(1);
    setGradingSearch('');
    setShowGradingModal(true);
  };

  const handleScoreChange = (studentId, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    if (numValue === '' || (numValue >= 0 && numValue <= selectedAssessmentMaxScore)) {
      setScores(prev => ({ ...prev, [studentId]: numValue }));
    }
  };

  const handleBulkScore = (score) => {
    const newScores = {};
    for (const student of filteredStudents) {
      newScores[student.id] = score;
    }
    setScores(prev => ({ ...prev, ...newScores }));
  };

  const handleSaveGrades = async () => {
    const gradesToSave = [];
    for (const [studentId, score] of Object.entries(scores)) {
      if (score !== '' && score !== null) {
        gradesToSave.push({
          studentId: studentId,
          score: score,
          feedback: feedback[studentId] || ''
        });
      }
    }
    if (gradesToSave.length === 0) {
      addToast('warning', 'No grades to save');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${selectedAssessment.id}/grade/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ grades: gradesToSave })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', `Saved ${gradesToSave.length} grade(s)`);
        setShowGradingModal(false);
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to save grades');
      }
    } catch (error) {
      addToast('error', 'Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const handleViewResults = async (assessment) => {
    setSelectedAssessment(assessment);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessment/${assessment.id}/results/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setResultsData(data.data);
        setSelectedAssessmentMaxScore(data.maxScore);
        setShowResultsModal(true);
      } else {
        addToast('error', data.message || 'Failed to load results');
      }
    } catch (error) {
      addToast('error', 'Failed to load results');
    }
  };

  const filteredStudents = useMemo(() => {
    let filtered = students;
    if (gradingSearch) {
      filtered = students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(gradingSearch.toLowerCase()) ||
        (s.admission_no && s.admission_no.toLowerCase().includes(gradingSearch.toLowerCase()))
      );
    }
    return filtered;
  }, [students, gradingSearch]);

  const paginatedStudents = filteredStudents.slice(
    (gradingPage - 1) * studentsPerPage,
    gradingPage * studentsPerPage
  );
  const totalGradingPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const filteredAssessments = useMemo(() => {
    let filtered = assessments;
    if (activeFilter !== 'all') {
      filtered = filtered.filter(a => a.status === activeFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(a =>
        (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.subject_name && a.subject_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.class_name && a.class_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  }, [assessments, activeFilter, searchTerm]);

  const counts = {
    all: assessments.length,
    draft: assessments.filter(a => a.status === 'draft').length,
    published: assessments.filter(a => a.status === 'published').length,
    ongoing: assessments.filter(a => a.status === 'ongoing').length,
    completed: assessments.filter(a => a.status === 'completed').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cat': return <Zap className="h-4 w-4 text-orange-500" />;
      case 'cba': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'end_term': return <Trophy className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access assessment manager</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium rounded-lg inline-block">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => {}} />
      ))}
      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Delete Assessment" 
        message={`Are you sure you want to delete "${selectedAssessment?.title || ''}"? This action cannot be undone.`} 
      />

      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Assessment Manager</h1>
            <p className="text-green-100 mt-1">Create, manage, and grade assessments for your classes</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 inline mr-2" />Create Assessment
            </button>
            <button onClick={fetchAssessments} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700">
              <RefreshCw className="h-4 w-4 inline mr-2" />Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveFilter('all')} className={`px-3 py-1 text-sm font-medium rounded-lg ${activeFilter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All ({counts.all})</button>
              <button onClick={() => setActiveFilter('draft')} className={`px-3 py-1 text-sm font-medium rounded-lg ${activeFilter === 'draft' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Draft ({counts.draft})</button>
              <button onClick={() => setActiveFilter('published')} className={`px-3 py-1 text-sm font-medium rounded-lg ${activeFilter === 'published' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Published ({counts.published})</button>
              <button onClick={() => setActiveFilter('ongoing')} className={`px-3 py-1 text-sm font-medium rounded-lg ${activeFilter === 'ongoing' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Ongoing ({counts.ongoing})</button>
              <button onClick={() => setActiveFilter('completed')} className={`px-3 py-1 text-sm font-medium rounded-lg ${activeFilter === 'completed' ? 'bg-purple-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Completed ({counts.completed})</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search assessments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading assessments...</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No assessments found</h3>
            <p className="text-gray-500 mt-1 mb-4">Create your first assessment to get started</p>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg">
              <Plus className="h-4 w-4 inline mr-2" />Create Assessment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map(assessment => (
              <div key={assessment.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(assessment.exam_type)}
                      <h3 className="font-bold text-gray-900">{assessment.title}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(assessment.status)}`}>
                      {assessment.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>ID: {assessment.exam_code || assessment.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{assessment.total_students || 0} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>Max Score: {assessment.max_score || assessment.total_marks}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessment.status === 'draft' && (
                      <>
                        <button onClick={() => handleEditAssessment(assessment)} className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700">
                          <Edit2 className="h-3 w-3 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => handlePublishAssessment(assessment)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                          <Send className="h-3 w-3 inline mr-1" /> Publish
                        </button>
                        <button onClick={() => handleDeleteClick(assessment)} className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700">
                          <Trash2 className="h-3 w-3 inline mr-1" /> Delete
                        </button>
                      </>
                    )}
                    {assessment.status === 'published' && (
                      <button onClick={() => handleStartGrading(assessment)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">
                        <CheckSquare className="h-3 w-3 inline mr-1" /> Start Grading
                      </button>
                    )}
                    {(assessment.status === 'ongoing' || assessment.status === 'completed') && (
                      <>
                        <button onClick={() => handleStartGrading(assessment)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">
                          <Edit2 className="h-3 w-3 inline mr-1" /> Continue
                        </button>
                        <button onClick={() => handleViewResults(assessment)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                          <BarChart3 className="h-3 w-3 inline mr-1" /> Results
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAssessments.length > 0 && (
          <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 flex justify-between items-center">
            <span>Showing {filteredAssessments.length} of {assessments.length} assessments</span>
            <div className="flex gap-4">
              <span><span className="font-bold">{assessments.filter(a => a.status === 'published').length}</span> Ready to grade</span>
              <span><span className="font-bold">{assessments.filter(a => a.status === 'ongoing').length}</span> In progress</span>
              <span><span className="font-bold">{assessments.filter(a => a.status === 'completed').length}</span> Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Create New Assessment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., Mathematics CAT 1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="cat">CAT (Continuous Assessment Test)</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam/Summative</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Class *</label>
                  <select 
                    value={formData.classId} 
                    onChange={(e) => setFormData({...formData, classId: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.display_name || `${cls.class_name} - ${cls.stream || 'No Stream'}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject *</label>
                  <select value={formData.subjectId} onChange={(e) => setFormData({...formData, subjectId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select Subject</option>
                    {subjects.map(sub => (<option key={sub.id} value={sub.id}>{sub.name}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Brief description of the assessment..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Due Time</label>
                  <input type="time" value={formData.dueTime} onChange={(e) => setFormData({...formData, dueTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Maximum Score</label>
                <input type="number" value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" min="1" max="1000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instructions for Students</label>
                <textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Instructions, guidelines, or rubrics for students..." />
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.allowLateSubmission} onChange={(e) => setFormData({...formData, allowLateSubmission: e.target.checked})} />
                    <span className="text-sm font-medium text-gray-700">Allow Late Submissions</span>
                  </label>
                  {formData.allowLateSubmission && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Penalty:</label>
                      <input type="number" value={formData.latePenalty} onChange={(e) => setFormData({...formData, latePenalty: parseInt(e.target.value)})} className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center" min="0" max="100" />
                      <span className="text-sm text-gray-600">% per day</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => setFormData({...formData, published: false})} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg">Save as Draft</button>
              <button onClick={handleCreateAssessment} disabled={saving} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg">
                {saving && <ButtonSpinner />} Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Assessment</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Maximum Score</label>
                <input type="number" value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" min="1" max="1000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instructions</label>
                <textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={handleUpdateAssessment} disabled={saving} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg">
                {saving && <ButtonSpinner />} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGradingModal(false)}>
          <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Grading: {selectedAssessment.title}</h3>
                <p className="text-sm text-gray-600">Max Score: {selectedAssessmentMaxScore}</p>
              </div>
              <button onClick={() => setShowGradingModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => handleBulkScore(selectedAssessmentMaxScore)} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg">All Full Marks</button>
                <button onClick={() => handleBulkScore(0)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg">All Zero</button>
                <button onClick={() => handleBulkScore('')} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg">Clear All</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search students..." value={gradingSearch} onChange={(e) => setGradingSearch(e.target.value)} className="pl-9 pr-3 py-1 border border-gray-300 rounded-lg text-sm w-48" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Admission No.</th>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-center">Score / {selectedAssessmentMaxScore}</th>
                    <th className="px-4 py-2 text-left">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map(student => (
                    <tr key={student.id} className="border-b border-gray-200">
                      <td className="px-4 py-2 text-gray-600">{student.admission_no}</td>
                      <td className="px-4 py-2 font-medium">{student.first_name} {student.last_name}</td>
                      <td className="px-4 py-2 text-center">
                        <input type="number" value={scores[student.id] === '' ? '' : scores[student.id]} onChange={(e) => handleScoreChange(student.id, e.target.value)} className="w-20 px-2 py-1 text-center border border-gray-300 rounded-lg" min="0" max={selectedAssessmentMaxScore} step="0.5" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={feedback[student.id] || ''} onChange={(e) => setFeedback(prev => ({ ...prev, [student.id]: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm" placeholder="Optional feedback..." />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalGradingPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button onClick={() => setGradingPage(p => Math.max(1, p-1))} disabled={gradingPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Prev</button>
                  <span className="text-sm">Page {gradingPage} of {totalGradingPages}</span>
                  <button onClick={() => setGradingPage(p => Math.min(totalGradingPages, p+1))} disabled={gradingPage === totalGradingPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Next</button>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowGradingModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSaveGrades} disabled={saving} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg">
                {saving && <ButtonSpinner />} Save Grades
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResultsModal(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Results: {selectedAssessment.title}</h3>
                <p className="text-sm text-gray-600">Max Score: {selectedAssessmentMaxScore}</p>
              </div>
              <button onClick={() => setShowResultsModal(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              {(() => {
                if (resultsData.length === 0) {
                  return <p className="text-center text-gray-500">No results available</p>;
                }
                const scores = resultsData.map(r => r.score);
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                const min = Math.min(...scores);
                const max = Math.max(...scores);
                const passed = resultsData.filter(r => (r.score / selectedAssessmentMaxScore * 100) >= 50).length;
                const ranges = [
                  { label: 'A (80-100%)', min: 80, max: 100, color: 'bg-green-500' },
                  { label: 'B (70-79%)', min: 70, max: 79, color: 'bg-blue-500' },
                  { label: 'C (60-69%)', min: 60, max: 69, color: 'bg-yellow-500' },
                  { label: 'D (50-59%)', min: 50, max: 59, color: 'bg-orange-500' },
                  { label: 'E (0-49%)', min: 0, max: 49, color: 'bg-red-500' }
                ];
                const distribution = ranges.map(range => ({
                  ...range,
                  count: resultsData.filter(r => {
                    const pct = (r.score / selectedAssessmentMaxScore * 100);
                    return pct >= range.min && pct <= range.max;
                  }).length
                }));
                return (
                  <>
                    <div className="grid grid-cols-5 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{avg.toFixed(1)}</p>
                        <p className="text-xs text-gray-600">Average</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-700">{min}</p>
                        <p className="text-xs text-gray-600">Lowest</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-700">{max}</p>
                        <p className="text-xs text-gray-600">Highest</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-700">{passed}</p>
                        <p className="text-xs text-gray-600">Passed</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{resultsData.length}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      {distribution.map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span>{item.count} students</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div className={`${item.color} h-full flex items-center justify-end px-2 text-xs text-white`} style={{ width: `${(item.count / resultsData.length) * 100}%` }}>
                              {item.count > 0 && item.count}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Admission</th>
                            <th className="px-4 py-2 text-left">Student</th>
                            <th className="px-4 py-2 text-center">Score</th>
                            <th className="px-4 py-2 text-center">%</th>
                            <th className="px-4 py-2 text-center">Grade</th>
                            <th className="px-4 py-2 text-left">Feedback</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultsData.map(result => {
                            const pct = (result.score / selectedAssessmentMaxScore * 100);
                            const grade = pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'E';
                            return (
                              <tr key={result.studentId} className="border-b border-gray-200">
                                <td className="px-4 py-2">{result.admission_no}</td>
                                <td className="px-4 py-2">{result.student_name}</td>
                                <td className="px-4 py-2 text-center">{result.score}/{selectedAssessmentMaxScore}</td>
                                <td className="px-4 py-2 text-center">{pct.toFixed(1)}%</td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`px-2 py-1 text-xs font-bold rounded ${grade === 'A' ? 'bg-green-100 text-green-800' : grade === 'B' ? 'bg-blue-100 text-blue-800' : grade === 'C' ? 'bg-yellow-100 text-yellow-800' : grade === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                                    {grade}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{result.feedback || '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default AssessmentManager;