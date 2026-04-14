/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  BookOpen, Users, Target, CheckCircle, Plus, Save, X, Filter,
  ChevronRight, Layers, Award, Heart, Loader2, AlertCircle,
  Check, Trash2, Edit3, RefreshCw, GraduationCap, Search,
  LogOut, UserCheck, BookMarked, ChevronDown
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── KICD Core Competency labels (UI-only, codes stored in DB) ───────────────
const CORE_COMPETENCY_OPTIONS = [
  { code: 'CC01', name: 'Communication and Collaboration' },
  { code: 'CC02', name: 'Critical Thinking and Problem Solving' },
  { code: 'CC03', name: 'Creativity and Imagination' },
  { code: 'CC04', name: 'Citizenship' },
  { code: 'CC05', name: 'Digital Literacy' },
  { code: 'CC06', name: 'Learning to Learn' },
  { code: 'CC07', name: 'Self-efficacy' },
];

const VALUE_OPTIONS = [
  { code: 'VAL01', name: 'Respect' },
  { code: 'VAL02', name: 'Responsibility' },
  { code: 'VAL03', name: 'Integrity' },
  { code: 'VAL04', name: 'Honesty' },
  { code: 'VAL05', name: 'Love' },
  { code: 'VAL06', name: 'Tolerance' },
  { code: 'VAL07', name: 'Peace' },
];

// ─── Session Expired Modal ────────────────────────────────────────────────────
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
        </div>
        <p className="text-gray-600 mb-6">Your session has expired. Please login again.</p>
        <div className="flex justify-end">
          <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Toast Notification ───────────────────────────────────────────────────────
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error:   'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />,
    error:   <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} z-50 max-w-sm animate-slide-up`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2"><X className="h-4 w-4" /></button>
    </div>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h3 className="font-semibold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ─── New Competency Form Card ─────────────────────────────────────────────────
const CompetencyForm = ({ index, comp, onChange, onRemove }) => {
  const toggle = (field, code) => {
    const current = comp[field] || [];
    onChange(field, current.includes(code) ? current.filter(c => c !== code) : [...current, code]);
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">{index + 1}</span>
          </div>
          <h3 className="font-medium text-gray-900">New Learning Outcome</h3>
        </div>
        <button onClick={onRemove} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Competency Code *</label>
            <input
              type="text"
              value={comp.competency_code}
              onChange={e => onChange('competency_code', e.target.value.toUpperCase())}
              placeholder="e.g., ENG-L1.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              value={comp.display_order}
              onChange={e => onChange('display_order', e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcome / Competency Statement *</label>
          <textarea
            value={comp.competency_statement}
            onChange={e => onChange('competency_statement', e.target.value)}
            rows="3"
            placeholder="Describe what the learner should be able to do..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Indicator</label>
          <textarea
            value={comp.performance_indicator}
            onChange={e => onChange('performance_indicator', e.target.value)}
            rows="2"
            placeholder="How will success be measured?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Award className="h-4 w-4 text-blue-500" /> Core Competencies (KICD)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CORE_COMPETENCY_OPTIONS.map(cc => (
              <label key={cc.code} className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={comp.core_competencies?.includes(cc.code) || false}
                  onChange={() => toggle('core_competencies', cc.code)}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800 block">{cc.name}</span>
                  <span className="text-xs text-gray-400">{cc.code}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Heart className="h-4 w-4 text-pink-500" /> Values
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VALUE_OPTIONS.map(v => (
              <label key={v.code} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-pink-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={comp.values?.includes(v.code) || false}
                  onChange={() => toggle('values', v.code)}
                  className="rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800 block">{v.name}</span>
                  <span className="text-xs text-gray-400">{v.code}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={comp.is_core_competency !== false}
            onChange={e => onChange('is_core_competency', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-700">Mark as Core Competency</span>
        </label>
      </div>
    </div>
  );
};

// ─── Competency Card (read-only) ──────────────────────────────────────────────
const CompetencyCard = ({ comp, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-mono font-medium">
            {comp.competency_code}
          </span>
          {comp.is_core_competency && (
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Core</span>
          )}
        </div>
        <p className="text-gray-800 text-sm mb-2">{comp.competency_statement}</p>
        {comp.performance_indicator && (
          <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-100">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Performance Indicator: </span>
              {comp.performance_indicator}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {(comp.core_competencies || []).map(cc => {
            const opt = CORE_COMPETENCY_OPTIONS.find(o => o.code === cc);
            return (
              <span key={cc} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs flex items-center gap-1 border border-blue-100">
                <Award className="h-3 w-3" /> {opt?.name || cc}
              </span>
            );
          })}
          {(comp.values || []).map(v => {
            const opt = VALUE_OPTIONS.find(o => o.code === v);
            return (
              <span key={v} className="px-2 py-1 bg-pink-50 text-pink-700 rounded-md text-xs flex items-center gap-1 border border-pink-100">
                <Heart className="h-3 w-3" /> {opt?.name || v}
              </span>
            );
          })}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CompetencyMatrix = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStrands, setLoadingStrands] = useState(false);
  const [loadingSubstrands, setLoadingSubstrands] = useState(false);
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const isAdminOrRegistrar = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'registrar';
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [strands, setStrands] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [competencies, setCompetencies] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedNumericLevel, setSelectedNumericLevel] = useState(null);   // ← GRADE FIX
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStrand, setSelectedStrand] = useState('');
  const [selectedSubstrand, setSelectedSubstrand] = useState('');

  const [newCompetencies, setNewCompetencies] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleApiError = useCallback((res) => {
    if (res?.status === 401) setShowSessionExpired(true);
  }, []);

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = '/logout';
  };

  const apiFetch = useCallback(async (url, opts = {}) => {
    const res = await fetch(url, { headers: getAuthHeaders(), ...opts });
    if (res.status === 401) { handleApiError(res); return null; }
    return res.json();
  }, [getAuthHeaders, handleApiError]);

  // Fetch teachers (admin only)
  useEffect(() => {
    if (!isAuthenticated || !isAdminOrRegistrar) return;
    (async () => {
      const data = await apiFetch(`${API_BASE_URL}/api/registrar/users/teachers/`);
      if (data?.success) setTeachers(data.data);
    })();
  }, [isAuthenticated, isAdminOrRegistrar, apiFetch]);

  const effectiveTeacherId = isAdminOrRegistrar ? selectedTeacherId : (user?.id || '');

  // Fetch classes
  useEffect(() => {
    setClasses([]);
    setSelectedClass('');
    setSelectedNumericLevel(null);
    setSubjects([]);
    setSelectedSubject('');
    resetBelow('class');

    if (!isAuthenticated) return;
    if (isAdminOrRegistrar && !selectedTeacherId) return;

    const fetchClasses = async () => {
      setLoadingClasses(true);
      const url = effectiveTeacherId
        ? `${API_BASE_URL}/api/registrar/academic/teacher-classes/?teacher_id=${effectiveTeacherId}`
        : `${API_BASE_URL}/api/registrar/academic/teacher-classes/`;
      const data = await apiFetch(url);
      if (data?.success) setClasses(data.data || []);
      setLoadingClasses(false);
    };
    fetchClasses();
  }, [isAuthenticated, effectiveTeacherId]);

  // Fetch subjects when class changes
  useEffect(() => {
    setSubjects([]);
    setSelectedSubject('');
    resetBelow('subject');

    if (!selectedClass) return;

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      const url = `${API_BASE_URL}/api/registrar/academic/teacher-learning-areas/?class_id=${selectedClass}${effectiveTeacherId ? `&teacher_id=${effectiveTeacherId}` : ''}`;
      const data = await apiFetch(url);
      if (data?.success) setSubjects(data.data);
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, [selectedClass, effectiveTeacherId]);

  // Fetch strands when subject changes — NOW GRADE-SPECIFIC (fixed)
  useEffect(() => {
    setStrands([]);
    setSelectedStrand('');
    resetBelow('strand');

    if (!selectedSubject || !selectedNumericLevel) return;

    const fetchStrands = async () => {
      setLoadingStrands(true);
      // Correct param names for registrar endpoint
      const url = `${API_BASE_URL}/api/registrar/academic/strands-for-area/?learning_area=${selectedSubject}&numeric_level=${selectedNumericLevel}`;
      const data = await apiFetch(url);
      if (data?.success) setStrands(data.data);
      setLoadingStrands(false);
    };
    fetchStrands();
  }, [selectedSubject, selectedNumericLevel]);

  // Fetch substrands when strand changes
  useEffect(() => {
    setSubstrands([]);
    setSelectedSubstrand('');
    setCompetencies([]);
    setNewCompetencies([]);

    if (!selectedStrand) return;

    const fetchSubstrands = async () => {
      setLoadingSubstrands(true);
      const data = await apiFetch(`${API_BASE_URL}/api/registrar/academic/substrands-for-strand/?strand_id=${selectedStrand}`);
      if (data?.success) setSubstrands(data.data);
      setLoadingSubstrands(false);
    };
    fetchSubstrands();
  }, [selectedStrand]);

  // Fetch competencies when substrand changes
  useEffect(() => {
    setCompetencies([]);
    setNewCompetencies([]);

    if (!selectedSubstrand) return;

    const fetchCompetencies = async () => {
      setLoadingCompetencies(true);
      const data = await apiFetch(`${API_BASE_URL}/api/registrar/academic/competencies-for-substrand/?substrand_id=${selectedSubstrand}`);
      if (data?.success) setCompetencies(data.data);
      setLoadingCompetencies(false);
    };
    fetchCompetencies();
  }, [selectedSubstrand]);

  const resetBelow = (level) => {
    if (level === 'class') {
      setStrands([]); setSelectedStrand('');
      setSubstrands([]); setSelectedSubstrand('');
      setCompetencies([]); setNewCompetencies([]);
    } else if (level === 'subject') {
      setStrands([]); setSelectedStrand('');
      setSubstrands([]); setSelectedSubstrand('');
      setCompetencies([]); setNewCompetencies([]);
    } else if (level === 'strand') {
      setSubstrands([]); setSelectedSubstrand('');
      setCompetencies([]); setNewCompetencies([]);
    }
  };

  // Handle class selection + capture numeric_level
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);

    if (classId) {
      const selectedClassObj = classes.find(c => String(c.id) === String(classId));
      setSelectedNumericLevel(selectedClassObj ? selectedClassObj.numeric_level : null);
    } else {
      setSelectedNumericLevel(null);
    }

    setSelectedSubject('');
    resetBelow('class');
  };

  const addNewRow = () => {
    if (!selectedSubstrand) { showToast('warning', 'Select a sub-strand first'); return; }
    setNewCompetencies(prev => [...prev, {
      _id: Date.now(),
      competency_code: '',
      competency_statement: '',
      performance_indicator: '',
      is_core_competency: true,
      core_competencies: [],
      values: [],
      display_order: '',
    }]);
  };

  const updateNewRow = (idx, field, value) => {
    setNewCompetencies(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeNewRow = (idx) => {
    setNewCompetencies(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (newCompetencies.length === 0) return;
    const invalid = newCompetencies.find(c => !c.competency_code.trim() || !c.competency_statement.trim());
    if (invalid) { showToast('warning', 'All competencies require a code and statement'); return; }

    setSaving(true);
    let successCount = 0;
    let failCount = 0;

    for (const comp of newCompetencies) {
      const { _id, ...payload } = comp;
      const data = await apiFetch(`${API_BASE_URL}/api/registrar/academic/competency-mapping/create/`, {
        method: 'POST',
        body: JSON.stringify({ ...payload, substrand_id: selectedSubstrand }),
      });
      if (data?.success) successCount++;
      else failCount++;
    }

    if (successCount > 0) showToast('success', `${successCount} competency${successCount > 1 ? 'ies' : ''} saved`);
    if (failCount > 0) showToast('error', `${failCount} competency${failCount > 1 ? 'ies' : ''} failed to save`);

    setNewCompetencies([]);

    // Refresh list
    setLoadingCompetencies(true);
    const data = await apiFetch(`${API_BASE_URL}/api/registrar/academic/competencies-for-substrand/?substrand_id=${selectedSubstrand}`);
    if (data?.success) setCompetencies(data.data);
    setLoadingCompetencies(false);

    setSaving(false);
  };

  const handleDeleteCompetency = async (id, code) => {
    setDeleting(id);
    const data = await apiFetch(`${API_BASE_URL}/api/registrar/academic/competency-mapping/${id}/delete/`, { method: 'DELETE' });
    if (data?.success) {
      showToast('success', `Competency ${code} deleted`);
      setCompetencies(prev => prev.filter(c => c.id !== id));
    } else {
      showToast('error', data?.error || 'Delete failed');
    }
    setDeleting(null);
    setDeleteConfirm(null);
  };

  const getClassName = (id) => classes.find(c => String(c.id) === String(id))?.class_name || '';
  const getSubjectName = (id) => subjects.find(s => String(s.id) === String(id))?.area_name || '';
  const getStrandName = (id) => strands.find(s => String(s.id) === String(id))?.strand_name || '';
  const getSubstrandName = (id) => substrands.find(s => String(s.id) === String(id))?.substrand_name || '';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Please login to access the Competency Matrix</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  const breadcrumb = [
    selectedClass && getClassName(selectedClass),
    selectedSubject && getSubjectName(selectedSubject),
    selectedStrand && getStrandName(selectedStrand),
    selectedSubstrand && getSubstrandName(selectedSubstrand),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(1rem); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDeleteCompetency(deleteConfirm.id, deleteConfirm.code)}
        message={`Delete competency "${deleteConfirm?.code}"? This cannot be undone.`}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Competency Matrix</h1>
              </div>
              <p className="text-sm text-gray-500 mt-0.5 ml-10">
                Map learning outcomes to KICD core competencies and values
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedClass('');
                setSelectedNumericLevel(null);
                setSelectedSubject('');
                setSelectedStrand('');
                setSelectedSubstrand('');
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Reset filters"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-screen-2xl mx-auto">

        {/* Scope Selection */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <h2 className="font-semibold text-gray-700 text-sm">Scope Selection</h2>
            {breadcrumb.length > 0 && (
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                {breadcrumb.map((b, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    <span className={i === breadcrumb.length - 1 ? 'font-semibold text-blue-600' : ''}>{b}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {isAdminOrRegistrar && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Teacher</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={selectedTeacherId}
                      onChange={e => setSelectedTeacherId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    disabled={loadingClasses || (isAdminOrRegistrar && !selectedTeacherId)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none disabled:opacity-50"
                  >
                    <option value="">{loadingClasses ? 'Loading…' : 'Select Class'}</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.class_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={e => { setSelectedSubject(e.target.value); setSelectedStrand(''); resetBelow('subject'); }}
                    disabled={loadingSubjects || !selectedClass}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none disabled:opacity-50"
                  >
                    <option value="">{loadingSubjects ? 'Loading…' : 'Select Subject'}</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.area_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Strand</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedStrand}
                    onChange={e => { setSelectedStrand(e.target.value); setSelectedSubstrand(''); resetBelow('strand'); }}
                    disabled={loadingStrands || !selectedSubject}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none disabled:opacity-50"
                  >
                    <option value="">{loadingStrands ? 'Loading…' : 'Select Strand'}</option>
                    {strands.map(s => (
                      <option key={s.id} value={s.id}>{s.strand_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sub-strand</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedSubstrand}
                    onChange={e => setSelectedSubstrand(e.target.value)}
                    disabled={loadingSubstrands || !selectedStrand}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none disabled:opacity-50"
                  >
                    <option value="">{loadingSubstrands ? 'Loading…' : 'Select Sub-strand'}</option>
                    {substrands.map(s => (
                      <option key={s.id} value={s.id}>{s.substrand_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        {!selectedSubstrand ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-semibold mb-1">No Sub-strand Selected</h3>
            <p className="text-gray-400 text-sm">
              Use the filters above to navigate to a sub-strand and view or add competencies.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Learning Outcomes — <span className="text-blue-600">{getSubstrandName(selectedSubstrand)}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {competencies.length} existing competency{competencies.length !== 1 ? 'ies' : ''}
                  {newCompetencies.length > 0 && ` · ${newCompetencies.length} unsaved`}
                </p>
              </div>
              <button
                onClick={addNewRow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Learning Outcome
              </button>
            </div>

            {newCompetencies.length > 0 && (
              <div className="space-y-4">
                {newCompetencies.map((comp, idx) => (
                  <CompetencyForm
                    key={comp._id}
                    index={idx}
                    comp={comp}
                    onChange={(field, value) => updateNewRow(idx, field, value)}
                    onRemove={() => removeNewRow(idx)}
                  />
                ))}

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving…' : `Save ${newCompetencies.length} Competency${newCompetencies.length !== 1 ? 'ies' : ''}`}
                  </button>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-800">Existing Competencies</h3>
              </div>

              {loadingCompetencies ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : competencies.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                  <Target className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No competencies yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "Add Learning Outcome" to create the first one</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {competencies.map(comp => (
                    <CompetencyCard
                      key={comp.id}
                      comp={comp}
                      onDelete={() => setDeleteConfirm({ id: comp.id, code: comp.competency_code })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetencyMatrix;