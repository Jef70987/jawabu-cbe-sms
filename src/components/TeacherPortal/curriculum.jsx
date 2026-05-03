/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpen, Plus, RefreshCw, Download, FileText,
  Layers, GitBranch, Target, Award, Users,
  AlertCircle, CheckCircle, X, Loader2, Eye,
  ChevronDown, ChevronRight, Search, Filter,
  Calendar, Clock, Link2, CheckSquare,
  TrendingUp, BarChart3, Activity, ClipboardList,
  GraduationCap, UserCheck, Edit2, Save,
  Printer, Share2, ChevronLeft, ChevronRight as ChevronRightIcon,
  Grid, List, Star, Trophy, Flame, Zap, Trash2
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
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 shadow-lg ${getStyles()} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => onClose?.()} className="ml-4 text-white/80 hover:text-white">
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
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading curriculum...</p>
    </div>
  </div>
);

const ProgressRing = ({ percentage, size = 80, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#10b981" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-gray-800">{percentage}%</span>
        {label && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </div>
  );
};

const LessonPlanModal = ({ isOpen, onClose, lesson, onSave, saving }) => {
  const [formData, setFormData] = useState({
    topic: '',
    objectives: [],
    activities: [],
    resources: [],
    assessment: '',
    duration: 40,
    date: new Date().toISOString().split('T')[0],
    status: 'planned',
    id: null, subject_id: null, grade_id: null,
    strand_id: null, substrand_id: null, outcome_id: null,
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        topic:        lesson.topic        || '',
        objectives:   lesson.objectives   || [],
        activities:   lesson.activities   || [],
        resources:    lesson.resources    || [],
        assessment:   lesson.assessment   || '',
        duration:     lesson.duration     || 40,
        date:         lesson.lesson_date  || new Date().toISOString().split('T')[0],
        status:       lesson.status       || 'planned',
        id:           lesson.id           || null,
        subject_id:   lesson.subject_id   || null,
        grade_id:     lesson.grade_id     || null,
        strand_id:    lesson.strand_id    || null,
        substrand_id: lesson.substrand_id || null,
        outcome_id:   lesson.outcome_id   || null,
      });
    }
  }, [lesson]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Lesson Plan</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Lesson Topic</label>
            <input type="text" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duration (minutes)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Learning Objectives</label>
            <textarea value={formData.objectives.join('\n')} onChange={(e) => setFormData({ ...formData, objectives: e.target.value.split('\n').filter(o => o.trim()) })} rows="3" className="w-full px-3 py-2 border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Learning Activities</label>
            <textarea value={formData.activities.join('\n')} onChange={(e) => setFormData({ ...formData, activities: e.target.value.split('\n').filter(a => a.trim()) })} rows="3" className="w-full px-3 py-2 border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teaching/Learning Resources</label>
            <textarea value={formData.resources.join('\n')} onChange={(e) => setFormData({ ...formData, resources: e.target.value.split('\n').filter(r => r.trim()) })} rows="2" className="w-full px-3 py-2 border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Method</label>
            <textarea value={formData.assessment} onChange={(e) => setFormData({ ...formData, assessment: e.target.value })} rows="2" className="w-full px-3 py-2 border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(formData)} disabled={saving} className="px-4 py-2 bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50">
            {saving && <ButtonSpinner />} Save Lesson Plan
          </button>
        </div>
      </div>
    </div>
  );
};

function TeacherCurriculum() {
  const { user, getAuthHeaders, isAuthenticated, isLoading: authLoading } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [strands, setStrands] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [showLessonPlansList, setShowLessonPlansList] = useState(false);
  const [loading, setLoading] = useState({ curriculum: false, subjects: false, saving: false, lessonPlans: false });
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchWithTimeout = useCallback(async (url, options, timeout = 30000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('Request timeout');
      throw error;
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      addToast('error', 'Please login to access curriculum');
      return;
    }
    fetchCurriculumData();
    fetchLessonPlans();
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      fetchStrandsForSubject(selectedSubject.id, selectedGrade.id);
    }
  }, [selectedSubject, selectedGrade]);

  const fetchCurriculumData = async () => {
    setLoading(prev => ({ ...prev, curriculum: true, subjects: true }));
    try {
      await Promise.all([fetchSubjects(), fetchGradeLevels()]);
    } catch (error) {
      addToast('error', 'Failed to load curriculum data');
    } finally {
      setDataLoaded(true);
      setLoading(prev => ({ ...prev, curriculum: false, subjects: false }));
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/teacher/curriculum/subjects/`, { headers: getAuthHeaders() }, 30000);
      if (data?.success) {
        setSubjects(data.data);
        if (data.data.length > 0 && !selectedSubject) setSelectedSubject(data.data[0]);
      }
    } catch (error) {
      addToast('error', 'Network error - please check your connection');
    }
  };

  const fetchGradeLevels = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/teacher/curriculum/grade-levels/`, { headers: getAuthHeaders() }, 30000);
      if (data?.success) {
        setGradeLevels(data.data);
        if (data.data.length > 0 && !selectedGrade) setSelectedGrade(data.data[0]);
      }
    } catch (error) {
      addToast('error', 'Network error loading grade levels');
    }
  };

  const fetchStrandsForSubject = async (subjectId, gradeId) => {
    if (!subjectId) return;
    setLoading(prev => ({ ...prev, curriculum: true }));
    try {
      let url = `${API_BASE_URL}/api/teacher/curriculum/strands/?subject=${subjectId}`;
      if (gradeId) url += `&grade=${gradeId}`;
      const data = await fetchWithTimeout(url, { headers: getAuthHeaders() }, 30000);
      if (data?.success) {
        setStrands(data.data);
      } else {
        setStrands([]);
      }
    } catch (error) {
      addToast('error', 'Network error loading curriculum content');
      setStrands([]);
    } finally {
      setLoading(prev => ({ ...prev, curriculum: false }));
    }
  };

  const fetchLessonPlans = useCallback(async () => {
    setLoading(prev => ({ ...prev, lessonPlans: true }));
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/teacher/curriculum/lesson-plans/`,
        { headers: getAuthHeaders() },
        30000
      );
      if (data?.success) {
        setLessonPlans(data.data);
        return data.data;
      }
      return [];
    } catch (error) {
      addToast('error', 'Failed to load lesson plans');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, lessonPlans: false }));
    }
  }, [fetchWithTimeout, getAuthHeaders]);

  const handleSubjectChange = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  const handleGradeChange = (gradeId) => {
    const grade = gradeLevels.find(g => g.id === gradeId);
    setSelectedGrade(grade);
    setCurrentPage(1);
  };

  const handleCreateLessonPlan = (strand, subStrand, outcome) => {
    // ── FIX: only include outcome description in topic when outcome exists ──
    const topicParts = [subStrand?.substrand_name || strand?.strand_name];
    if (outcome?.description) {
      topicParts.push(outcome.description.substring(0, 50));
    }

    setSelectedLesson({
      strand,
      subStrand,
      outcome,
      topic:        topicParts.join(' - '),
      subject_id:   selectedSubject?.id,
      grade_id:     selectedGrade?.id,
      strand_id:    strand?.id    || null,
      substrand_id: subStrand?.id || null,
      outcome_id:   outcome?.id   || null,
    });
    setShowLessonModal(true);
  };

  const handleEditLessonPlan = (plan) => {
    setSelectedLesson({
      id:           plan.id,
      topic:        plan.topic,
      objectives:   plan.objectives,
      activities:   plan.activities,
      resources:    plan.resources,
      assessment:   plan.assessment,
      duration:     plan.duration,
      lesson_date:  plan.lesson_date,
      status:       plan.status,
      subject_id:   plan.subject_id,
      grade_id:     plan.grade_level_id,
      strand_id:    plan.strand_id,
      substrand_id: plan.substrand_id,
      outcome_id:   plan.outcome_id,
    });
    setShowLessonModal(true);
  };

  const handleSaveLessonPlan = async (lessonData) => {
    setLoading(prev => ({ ...prev, saving: true }));
    try {
      const payload = {
        ...lessonData,
        id:           lessonData.id           || selectedLesson?.id           || undefined,
        subject_id:   lessonData.subject_id   || selectedSubject?.id          || selectedLesson?.subject_id,
        grade_id:     lessonData.grade_id     || selectedGrade?.id            || selectedLesson?.grade_id,
        strand_id:    lessonData.strand_id    || selectedLesson?.strand_id    || undefined,
        substrand_id: lessonData.substrand_id || selectedLesson?.substrand_id || undefined,
        outcome_id:   lessonData.outcome_id   || selectedLesson?.outcome_id   || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/api/teacher/curriculum/lesson-plans/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data?.success) {
        addToast('success', 'Lesson plan saved successfully');
        setShowLessonModal(false);
        setSelectedLesson(null);
        await fetchLessonPlans();
      } else {
        addToast('error', data?.message || 'Failed to save lesson plan');
      }
    } catch (error) {
      addToast('error', 'Network error saving lesson plan');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/curriculum/lesson-plans/${planToDelete.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data?.success) {
        addToast('success', 'Lesson plan deleted successfully');
        await fetchLessonPlans();
      } else {
        addToast('error', data?.message || 'Failed to delete lesson plan');
      }
    } catch (error) {
      addToast('error', 'Network error deleting lesson plan');
    } finally {
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  const updateLessonProgress = async (planId, newStatus) => {
    // Optimistic update
    setLessonPlans(prev =>
      prev.map(p => p.id === planId ? { ...p, status: newStatus } : p)
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/teacher/curriculum/lesson-plans/${planId}/`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus })
        }
      );
      const data = await response.json();

      if (data?.success) {
        addToast('success', `Lesson marked as ${newStatus}`);
        await fetchLessonPlans();
      } else {
        addToast('error', data?.message || 'Failed to update status');
        await fetchLessonPlans();
      }
    } catch (error) {
      addToast('error', 'Network error updating status');
      await fetchLessonPlans();
    }
  };

  // ─── Normalize any ID value to a lowercase trimmed string ───────────────────
  const nid = (v) => (v == null ? '' : String(v).toLowerCase().trim());

  // ─── Collect ALL outcome IDs from loaded strands (normalized) ────────────────
  const allOutcomeIdsInView = useMemo(() => {
    const ids = new Set();
    strands.forEach(strand =>
      (strand.substrands || []).forEach(sub =>
        (sub.learning_outcomes || []).forEach(o => ids.add(nid(o.id)))
      )
    );
    return ids;
  }, [strands]);

  // ─── Collect ALL strand IDs in current view (for fallback coverage) ──────────
  const allStrandIdsInView = useMemo(() =>
    new Set(strands.map(s => nid(s.id))),
  [strands]);

  // ─── Collect ALL substrand IDs in current view ───────────────────────────────
  const allSubstrandIdsInView = useMemo(() => {
    const ids = new Set();
    strands.forEach(s => (s.substrands || []).forEach(sub => ids.add(nid(sub.id))));
    return ids;
  }, [strands]);

  // ─── Filter lesson plans to current subject + grade ──────────────────────────
  const currentLessonPlans = useMemo(() => {
    if (!selectedSubject || !selectedGrade) return [];
    const subjectId  = nid(selectedSubject.id);
    const gradeId    = nid(selectedGrade.id);
    const gradeLevel = selectedGrade.level;

    return lessonPlans.filter(plan => {
      const subjectMatch = nid(plan.subject_id) === subjectId;
      if (!subjectMatch) return false;

      // Primary: UUID match
      if (nid(plan.grade_level_id) === gradeId) return true;

      // Fallback: numeric level match
      if (gradeLevel != null && plan.grade_level === gradeLevel) return true;

      return false;
    });
  }, [lessonPlans, selectedSubject, selectedGrade]);

  // ─── Completed lessons count ──────────────────────────────────────────────────
  const completedLessons = useMemo(
    () => currentLessonPlans.filter(p => p.status === 'completed').length,
    [currentLessonPlans]
  );

  // ════════════════════════════════════════════════════════════════════════════
  // PROGRESS CALCULATION FIX
  //
  // Two tracking modes:
  //   MODE A – Outcome-based: when learning outcomes exist in the DB for the
  //            current subject/grade, track coverage by unique outcome_id.
  //   MODE B – Lesson-based:  when no outcomes are defined (substrand exists but
  //            has no learning outcomes), fall back to counting completed lesson
  //            plans that belong to strands in the current view.
  //
  // This ensures the ring and counters always update when the teacher marks a
  // lesson as complete, regardless of whether outcome_id is set.
  // ════════════════════════════════════════════════════════════════════════════

  // Is there any outcome data for the current curriculum view?
  const hasOutcomesInView = allOutcomeIdsInView.size > 0;

  // ── MODE A: outcome-based totals ─────────────────────────────────────────────
  const totalOutcomes = allOutcomeIdsInView.size;

  const coveredOutcomes = useMemo(() => {
    if (!hasOutcomesInView) return 0;
    const ids = new Set(
      currentLessonPlans
        .filter(p => p.status === 'completed' && p.outcome_id)
        .map(p => nid(p.outcome_id))
        .filter(id => id && allOutcomeIdsInView.has(id))
    );
    return ids.size;
  }, [currentLessonPlans, allOutcomeIdsInView, hasOutcomesInView]);

  // ── MODE B: lesson-based totals (fallback when no outcomes in DB) ─────────────
  //   "total" = all lesson plans in the current subject+grade view
  //   "covered" = completed ones whose strand is in the current view
  //             (or any completed plan when strand_id is unset)
  const lessonBasedTotal = currentLessonPlans.length;

  const lessonBasedCovered = useMemo(() => {
    return currentLessonPlans.filter(p => {
      if (p.status !== 'completed') return false;
      // If strand_id is set, it must belong to the current strand view
      if (p.strand_id) return allStrandIdsInView.has(nid(p.strand_id));
      // If no strand_id, count it (strand-agnostic plan)
      return true;
    }).length;
  }, [currentLessonPlans, allStrandIdsInView]);

  // ── Effective values used throughout the UI ───────────────────────────────────
  const effectiveTotal    = hasOutcomesInView ? totalOutcomes    : lessonBasedTotal;
  const effectiveCovered  = hasOutcomesInView ? coveredOutcomes  : lessonBasedCovered;
  const effectiveLabel    = hasOutcomesInView ? 'Outcomes'       : 'Lessons';

  const overallProgress   = effectiveTotal > 0
    ? Math.round((effectiveCovered / effectiveTotal) * 100)
    : 0;

  const remainingCount    = effectiveTotal - effectiveCovered;

  // ─── Strand-level progress ────────────────────────────────────────────────────
  //   MODE A: percentage of unique outcomes covered by completed plans
  //   MODE B: percentage of strand's lesson plans that are completed
  const getStrandProgress = useCallback((strand) => {
    if (hasOutcomesInView) {
      // MODE A – outcome-based
      const outcomeIds = new Set(
        (strand.substrands || []).flatMap(sub =>
          (sub.learning_outcomes || []).map(o => nid(o.id))
        )
      );
      if (outcomeIds.size === 0) {
        // This strand has no outcomes — fall back to lesson count for THIS strand
        const strandPlans = currentLessonPlans.filter(
          p => nid(p.strand_id) === nid(strand.id)
        );
        const completedCount = strandPlans.filter(p => p.status === 'completed').length;
        return strandPlans.length > 0
          ? Math.round((completedCount / strandPlans.length) * 100)
          : 0;
      }
      const covered = [...outcomeIds].filter(id =>
        currentLessonPlans.some(p => p.status === 'completed' && nid(p.outcome_id) === id)
      ).length;
      return Math.round((covered / outcomeIds.size) * 100);
    } else {
      // MODE B – lesson-based
      const strandPlans = currentLessonPlans.filter(
        p => nid(p.strand_id) === nid(strand.id)
      );
      const completedCount = strandPlans.filter(p => p.status === 'completed').length;
      return strandPlans.length > 0
        ? Math.round((completedCount / strandPlans.length) * 100)
        : 0;
    }
  }, [currentLessonPlans, hasOutcomesInView]);

  const filteredStrands = useMemo(() => {
    if (!searchTerm) return strands;
    return strands.filter(strand =>
      strand.strand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.substrands?.some(sub => sub.substrand_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [strands, searchTerm]);

  const paginatedStrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStrands.slice(start, start + itemsPerPage);
  }, [filteredStrands, currentPage]);

  const totalPages = Math.ceil(filteredStrands.length / itemsPerPage);

  if (authLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access curriculum</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium inline-block hover:bg-green-800">Go to Login</a>
        </div>
      </div>
    );
  }

  const isLoading = loading.curriculum || loading.subjects;

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setPlanToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Lesson Plan"
        message={`Are you sure you want to delete "${planToDelete?.topic}"? This action cannot be undone.`}
      />

      {isLoading && !dataLoaded && <GlobalSpinner />}

      <div className="bg-green-700 p-6 w-full">
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
            <button onClick={() => { fetchCurriculumData(); fetchLessonPlans(); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 inline mr-2" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Subject</label>
              <select value={selectedSubject?.id || ''} onChange={(e) => handleSubjectChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm bg-white" disabled={subjects.length === 0 || loading.subjects}>
                <option value="">{loading.subjects ? 'Loading subjects...' : 'Select a subject'}</option>
                {subjects.map(subject => (<option key={subject.id} value={subject.id}>{subject.area_name} ({subject.area_code})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Grade</label>
              <select value={selectedGrade?.id || ''} onChange={(e) => handleGradeChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm bg-white" disabled={gradeLevels.length === 0}>
                <option value="">Select a grade</option>
                {gradeLevels.map(grade => (<option key={grade.id} value={grade.id}>{grade.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Search Strand/Topic</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm" />
              </div>
            </div>
            <div>
              <button onClick={() => setShowLessonPlansList(!showLessonPlansList)} className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 mt-6">
                <FileText className="h-4 w-4 inline mr-2" />
                {showLessonPlansList ? 'Show Curriculum' : 'View Lesson Plans'} ({lessonPlans.length})
              </button>
            </div>
          </div>
        </div>

        {showLessonPlansList ? (
          <div className="bg-white border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-100">
              <h2 className="font-bold text-gray-900">My Lesson Plans</h2>
              <p className="text-sm text-gray-600">All saved lesson plans</p>
            </div>
            {loading.lessonPlans ? (
              <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-green-700" /><p className="mt-2 text-gray-600">Loading lesson plans...</p></div>
            ) : lessonPlans.length === 0 ? (
              <div className="p-12 text-center"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No lesson plans created yet</p><button onClick={() => setShowLessonPlansList(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded">Create Lesson Plan</button></div>
            ) : (
              <div className="divide-y divide-gray-200">
                {lessonPlans.map(plan => (
                  <div key={plan.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{plan.topic}</h3>
                        <p className="text-sm text-gray-600 mt-1">{plan.subject_name} | Grade {plan.grade_name} | {plan.lesson_date}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            onClick={() => updateLessonProgress(plan.id, plan.status === 'completed' ? 'planned' : 'completed')}
                            className={`px-2 py-1 text-xs rounded-l ${plan.status === 'completed' ? 'bg-green-600 text-white font-bold hover:bg-green-700' : 'bg-yellow-600 text-white font-bold hover:bg-yellow-700'}`}
                          >
                            {plan.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                          </button>
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600">{plan.duration} min</span>
                        </div>
                        {plan.strand_name && <p className="text-xs text-gray-500 mt-1">Strand: {plan.strand_name}</p>}
                        <div className="mt-2 w-full bg-gray-200 h-1.5 rounded">
                          <div className="bg-green-600 h-1.5 rounded" style={{ width: `${plan.status === 'completed' ? 100 : 50}%` }}></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditLessonPlan(plan)} className="p-1 text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteClick(plan)} className="p-1 text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {!dataLoaded && isLoading ? (
              <div className="bg-white border border-gray-200 p-12 text-center"><Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" /><p className="mt-4 text-gray-600">Loading curriculum content...</p></div>
            ) : subjects.length === 0 && !loading.subjects ? (
              <div className="bg-white border border-gray-200 p-12 text-center"><AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" /><p className="text-gray-600">No subjects assigned to you. Please contact the administrator.</p></div>
            ) : strands.length === 0 && !loading.curriculum && dataLoaded && selectedSubject && selectedGrade ? (
              <div className="bg-white border border-gray-200 p-12 text-center"><AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" /><p className="text-gray-600">No curriculum content found for this subject and grade</p></div>
            ) : strands.length > 0 ? (
              <>
                {/* ========== SYLLABUS COVERAGE STATS ========== */}
                <div className="bg-white border border-gray-200 p-6 mb-6">
                  <h2 className="font-bold text-gray-900 mb-4">Syllabus Coverage Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      {/* Ring always uses effectiveTotal / effectiveCovered so it updates on completion */}
                      <ProgressRing percentage={overallProgress} size={100} strokeWidth={8} label={effectiveLabel} />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700">{completedLessons}</div>
                      <p className="text-sm text-gray-600">Lessons Completed</p>
                      <p className="text-xs text-gray-400">in this subject &amp; grade</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{effectiveCovered}</div>
                      <p className="text-sm text-gray-600">
                        {hasOutcomesInView ? 'Outcomes Covered' : 'Lessons Covered'}
                      </p>
                      <p className="text-xs text-gray-400">of {effectiveTotal} total</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-700">{remainingCount}</div>
                      <p className="text-sm text-gray-600">
                        {hasOutcomesInView ? 'Remaining Outcomes' : 'Remaining Lessons'}
                      </p>
                      <p className="text-xs text-gray-400">to be covered</p>
                    </div>
                  </div>

                  {/* Info banner: no learning outcomes — lesson-based tracking active */}
                  {!hasOutcomesInView && strands.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-sm text-blue-800 rounded">
                      <strong>Note:</strong> No specific learning outcomes are defined for this subject &amp; grade.
                      Progress is tracked by lesson completion instead.
                      To enable outcome-level tracking, add learning outcomes to the curriculum in the admin panel.
                    </div>
                  )}

                  {/* Hint when outcomes exist but completed lessons aren't linked */}
                  {hasOutcomesInView && completedLessons > 0 && coveredOutcomes === 0 && totalOutcomes > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded">
                      <strong>Tip:</strong> Your completed lessons aren't linked to learning outcomes.
                      To track curriculum coverage, create lesson plans directly from a strand/outcome row.
                    </div>
                  )}
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedStrands.map(strand => {
                      const progress = getStrandProgress(strand);
                      return (
                        <div key={strand.id} className="bg-white border border-gray-200">
                          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div><h3 className="font-bold text-gray-900">{strand.strand_name}</h3><p className="text-xs text-gray-500">Code: {strand.strand_code}</p></div>
                              <div className="text-right"><div className="text-sm font-medium text-green-700">{progress}%</div><div className="w-24 bg-gray-200 h-1.5 mt-1"><div className="bg-green-600 h-1.5" style={{ width: `${progress}%` }}></div></div></div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-600 mb-3">{strand.description || 'No description available'}</p>
                            <div className="space-y-3">
                              {strand.substrands?.map(subStrand => (
                                <div key={subStrand.id} className="border-l-2 border-green-300 pl-3">
                                  <h4 className="font-medium text-gray-800 text-sm">{subStrand.substrand_name}</h4>
                                  <div className="mt-2 space-y-1">
                                    {subStrand.learning_outcomes?.length > 0 ? (
                                      subStrand.learning_outcomes.map(outcome => {
                                        const isCompleted = currentLessonPlans.some(
                                          lp => nid(lp.outcome_id) === nid(outcome.id) && lp.status === 'completed'
                                        );
                                        return (
                                          <div key={outcome.id} className="flex items-start justify-between text-sm">
                                            <span className={`flex-1 ${isCompleted ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                              {isCompleted ? '✓ ' : '• '}{outcome.description}
                                            </span>
                                            <button onClick={() => handleCreateLessonPlan(strand, subStrand, outcome)} className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700"><FileText className="h-3 w-3 inline mr-1" /> Plan</button>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      // No outcomes defined — show lesson plans for this substrand
                                      <div className="text-xs text-gray-400 italic">
                                        {currentLessonPlans.filter(p => nid(p.substrand_id) === nid(subStrand.id)).length > 0
                                          ? `${currentLessonPlans.filter(p => nid(p.substrand_id) === nid(subStrand.id) && p.status === 'completed').length} / ${currentLessonPlans.filter(p => nid(p.substrand_id) === nid(subStrand.id)).length} lessons completed`
                                          : 'No learning outcomes defined'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                              <span className="text-xs text-gray-500">{progress}% covered</span>
                              <button onClick={() => handleCreateLessonPlan(strand, null, null)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium hover:bg-green-700"><Plus className="h-3 w-3 inline mr-1" /> Add Lesson Plan</button>
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
                            <th className="px-4 py-3 text-left font-bold text-gray-700">Strand/Topic</th>
                            <th className="px-4 py-3 text-left font-bold text-gray-700">Sub-Strand</th>
                            <th className="px-4 py-3 text-left font-bold text-gray-700">Learning Outcome</th>
                            <th className="px-4 py-3 text-center font-bold text-gray-700">Domain</th>
                            <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStrands.map(strand => (
                            strand.substrands?.map(subStrand => {
                              // When no outcomes, show one row per substrand
                              if (!subStrand.learning_outcomes?.length) {
                                const subPlans = currentLessonPlans.filter(p => nid(p.substrand_id) === nid(subStrand.id));
                                const subCompleted = subPlans.filter(p => p.status === 'completed').length;
                                const hasPlans = subPlans.length > 0;
                                return (
                                  <tr key={`${strand.id}-${subStrand.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{strand.strand_name}<div className="text-xs text-gray-500">{strand.strand_code}</div></td>
                                    <td className="px-4 py-3">{subStrand.substrand_name}<div className="text-xs text-gray-500">{subStrand.substrand_code}</div></td>
                                    <td className="px-4 py-3 text-gray-400 italic text-xs">No outcomes defined</td>
                                    <td className="px-4 py-3 text-center">—</td>
                                    <td className="px-4 py-3 text-center">
                                      {hasPlans ? (
                                        <span className={`px-2 py-1 text-xs rounded ${subCompleted === subPlans.length ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                          {subCompleted}/{subPlans.length} done
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Not Started</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button onClick={() => handleCreateLessonPlan(strand, subStrand, null)} className="px-2 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 rounded">
                                        <Plus className="h-3 w-3 inline mr-1" /> Plan
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }

                              return subStrand.learning_outcomes.map((outcome, idx) => {
                                const hasLessonPlan = currentLessonPlans.some(lp => nid(lp.outcome_id) === nid(outcome.id));
                                const isCompleted = currentLessonPlans.some(lp => nid(lp.outcome_id) === nid(outcome.id) && lp.status === 'completed');
                                return (
                                  <tr key={`${strand.id}-${subStrand.id}-${outcome.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                                    {idx === 0 && (<>
                                      <td className="px-4 py-3 font-medium text-gray-900" rowSpan={subStrand.learning_outcomes.length}>{strand.strand_name}<div className="text-xs text-gray-500">{strand.strand_code}</div></td>
                                      <td className="px-4 py-3" rowSpan={subStrand.learning_outcomes.length}>{subStrand.substrand_name}<div className="text-xs text-gray-500">{subStrand.substrand_code}</div></td>
                                    </>)}
                                    <td className="px-4 py-3 text-gray-700">{outcome.description}</td>
                                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 text-xs bg-purple-100 text-purple-800">{outcome.domain}</span></td>
                                    <td className="px-4 py-3 text-center">
                                      {isCompleted ? (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
                                      ) : hasLessonPlan ? (
                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Planned</span>
                                      ) : (
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Not Started</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button onClick={() => handleCreateLessonPlan(strand, subStrand, outcome)} className="px-2 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 rounded">
                                        {hasLessonPlan ? <Edit2 className="h-3 w-3 inline mr-1" /> : <Plus className="h-3 w-3 inline mr-1" />}
                                        {hasLessonPlan ? 'Edit Plan' : 'Plan'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"><ChevronRightIcon className="h-4 w-4" /></button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-gray-100 border border-gray-200 text-sm text-gray-600 flex justify-between items-center flex-wrap gap-2">
                  <span>Showing {paginatedStrands.length} of {filteredStrands.length} strands</span>
                  <div className="flex gap-4">
                    <span><span className="font-bold">{subjects.length}</span> Subjects</span>
                    <span><span className="font-bold">{strands.length}</span> Strands</span>
                    <span><span className="font-bold">{lessonPlans.length}</span> Lesson Plans</span>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>

      <LessonPlanModal
        isOpen={showLessonModal}
        onClose={() => { setShowLessonModal(false); setSelectedLesson(null); }}
        lesson={selectedLesson}
        onSave={handleSaveLessonPlan}
        saving={loading.saving}
      />

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default TeacherCurriculum;