/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  RefreshCw, X, Loader2, AlertCircle, CheckCircle,
  Search, ChevronDown, ChevronUp, Grid, Users, Link2
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── LEVEL CONFIG with explicit hex colors (no dynamic Tailwind) ──────────────
const LEVEL_CONFIG = {
  5: { label: 'EE', name: 'Exceeding Expectations',  hex: '#16a34a', light: '#dcfce7', textHex: '#14532d', score: 90 },
  4: { label: 'ME', name: 'Meeting Expectations',     hex: '#2563eb', light: '#dbeafe', textHex: '#1e3a8a', score: 75 },
  3: { label: 'AE', name: 'Approaching Expectations', hex: '#ca8a04', light: '#fef9c3', textHex: '#713f12', score: 60 },
  2: { label: 'BE', name: 'Below Expectations',       hex: '#ea580c', light: '#ffedd5', textHex: '#7c2d12', score: 40 },
  1: { label: 'WB', name: 'Well Below Expectations',  hex: '#dc2626', light: '#fee2e2', textHex: '#7f1d1d', score: 20 },
};

const getLevelFromScore = (score) => {
  if (score === null || score === undefined) return null;
  if (score >= 90) return LEVEL_CONFIG[5];
  if (score >= 75) return LEVEL_CONFIG[4];
  if (score >= 60) return LEVEL_CONFIG[3];
  if (score >= 40) return LEVEL_CONFIG[2];
  return LEVEL_CONFIG[1];
};

const resolveLevel = (data) => {
  if (!data) return null;
  const lvl = parseInt(data.level);
  if (!isNaN(lvl) && LEVEL_CONFIG[lvl]) return LEVEL_CONFIG[lvl];
  if (data.score !== undefined && data.score !== null) return getLevelFromScore(parseFloat(data.score));
  return null;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onClose?.(), 300); }, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!visible) return null;
  const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#ca8a04';
  return (
    <div style={{ backgroundColor: bg }} className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in-right">
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error'   && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4 opacity-80 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  );
};

// ─── Global spinner ───────────────────────────────────────────────────────────
const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 animate-spin mb-3" style={{ color: '#16a34a' }} />
      <p className="text-gray-700 font-medium">Loading competency data...</p>
    </div>
  </div>
);

// ─── Heatmap Cell ─────────────────────────────────────────────────────────────
const HeatmapCell = ({ student, competency, data, onUpdate, onEvidence }) => {
  const level = resolveLevel(data);

  return (
    <div className="relative group flex items-center justify-center py-2">
      <button
        onClick={() => onUpdate(student, competency, data)}
        style={level
          ? { backgroundColor: level.hex, boxShadow: `0 2px 8px ${level.hex}55` }
          : { backgroundColor: '#e5e7eb' }
        }
        className="w-14 h-14 rounded-lg transition-all duration-200 flex flex-col items-center justify-center hover:opacity-85 hover:scale-105 transform"
      >
        {level ? (
          <>
            <span className="font-bold text-sm leading-none" style={{ color: '#fff' }}>{level.label}</span>
            <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>{data?.level}</span>
          </>
        ) : (
          <span className="text-sm font-medium text-gray-400">—</span>
        )}
      </button>

      {data?.evidence_count > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onEvidence(student, competency, data); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full text-white flex items-center justify-center shadow hover:opacity-80"
          style={{ backgroundColor: '#7c3aed' }}
        >
          <Link2 className="h-3 w-3" />
        </button>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none">
        {student.first_name} {student.last_name}<br />
        {level
          ? <span style={{ color: level.hex === '#ca8a04' ? '#fde68a' : level.hex }}>{level.name} ({level.label}) — {data?.score ?? level.score}%</span>
          : 'Not assessed'
        }
      </div>
    </div>
  );
};

// ─── Student Detail Card ──────────────────────────────────────────────────────
const StudentDetailCard = ({ student, competencies }) => {
  const [expanded, setExpanded] = useState(false);

  const avgScore = (() => {
    let total = 0, count = 0;
    Object.values(competencies).forEach(c => {
      const s = c?.score !== undefined ? parseFloat(c.score) : (c?.level ? LEVEL_CONFIG[c.level]?.score : null);
      if (s !== null && !isNaN(s)) { total += s; count++; }
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  })();

  const avgLevel = getLevelFromScore(parseFloat(avgScore));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{student.first_name} {student.last_name}</h3>
          <p className="text-xs text-gray-500">Admission: {student.admission_no}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: avgLevel?.hex || '#6b7280' }}>{avgScore}%</div>
          {avgLevel && (
            <div className="text-xs font-semibold mt-0.5" style={{ color: avgLevel.hex }}>
              {avgLevel.label} — {avgLevel.name}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(competencies).map(([compId, compData]) => {
          const level = resolveLevel(compData);
          const score = compData?.score ?? (level?.score || 0);
          return (
            <div key={compId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">{compData?.name || compId}</span>
                <span className="font-bold" style={{ color: level?.hex || '#9ca3af' }}>
                  {level ? `${level.label} (${score}%)` : '—'}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${score}%`, backgroundColor: level?.hex || '#d1d5db' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 w-full text-center text-sm flex items-center justify-center gap-1 hover:opacity-75 transition-opacity"
        style={{ color: '#2563eb' }}
      >
        {expanded ? <><ChevronUp className="h-4 w-4" /> Show Less</> : <><ChevronDown className="h-4 w-4" /> Show Details</>}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
          <p>
            <strong className="text-gray-800">Strengths: </strong>
            {Object.values(competencies).filter(c => parseInt(c?.level) >= 4).map(c => c?.name).join(', ') || 'None identified'}
          </p>
          <p>
            <strong className="text-gray-800">Areas for Improvement: </strong>
            {Object.values(competencies).filter(c => parseInt(c?.level) <= 2 && c?.level).map(c => c?.name).join(', ') || 'None identified'}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Level Selector Modal ─────────────────────────────────────────────────────
const LevelSelector = ({ currentLevel, onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Competency Level</h3>
      <div className="space-y-2">
        {Object.entries(LEVEL_CONFIG).reverse().map(([level, config]) => (
          <button
            key={level}
            onClick={() => onSelect(parseInt(level), config.score)}
            style={{
              backgroundColor: config.light,
              color: config.textHex,
              border: `2px solid ${parseInt(level) === currentLevel ? config.hex : config.light}`,
              outline: parseInt(level) === currentLevel ? `3px solid ${config.hex}` : 'none',
            }}
            className="w-full p-3 rounded-lg text-left flex justify-between items-center hover:opacity-80 transition-all"
          >
            <div>
              <span className="font-extrabold text-sm">{config.label}</span>
              <p className="text-xs mt-0.5">{config.name}</p>
            </div>
            <span
              className="text-sm font-extrabold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: config.hex }}
            >
              {config.score}%
            </span>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
    </div>
  </div>
);

// ─── Evidence Modal ───────────────────────────────────────────────────────────
const EvidenceModal = ({ isOpen, onClose, student, competency, evidence, onSave }) => {
  const [formData, setFormData] = useState({
    description: '', evidence_type: 'observation',
    date: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => {
    if (evidence) setFormData({
      description: evidence.description || '',
      evidence_type: evidence.evidence_type || 'observation',
      date: evidence.date || new Date().toISOString().split('T')[0],
      notes: evidence.notes || ''
    });
  }, [evidence]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Link Evidence</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Student</label><p className="text-gray-900">{student?.first_name} {student?.last_name}</p></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Competency</label><p className="text-gray-900">{competency?.name}</p></div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Describe the evidence..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Type</label>
            <select value={formData.evidence_type} onChange={(e) => setFormData({...formData, evidence_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="observation">Observation</option>
              <option value="project">Project Work</option>
              <option value="portfolio">Portfolio</option>
              <option value="presentation">Presentation</option>
              <option value="test">Assessment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Additional notes..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-1 hover:opacity-90" style={{ backgroundColor: '#16a34a' }}>
            <Link2 className="h-4 w-4" /> Link Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function CompetencyMatrix() {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [classes, setClasses]                         = useState([]);
  const [subjects, setSubjects]                       = useState([]);
  const [students, setStudents]                       = useState([]);
  const [coreCompetencies, setCoreCompetencies]       = useState([]);
  const [selectedClass, setSelectedClass]             = useState(null);
  const [selectedSubject, setSelectedSubject]         = useState(null);
  const [competencyData, setCompetencyData]           = useState({});
  const [classAverages, setClassAverages]             = useState({});
  const [viewMode, setViewMode]                       = useState('heatmap');
  const [filterCompetency, setFilterCompetency]       = useState('all');
  const [searchTerm, setSearchTerm]                   = useState('');
  const [loading, setLoading]                         = useState({ classes: true, students: true, data: true });
  const [toasts, setToasts]                           = useState([]);
  const [showLevelSelector, setShowLevelSelector]     = useState(false);
  const [showEvidenceModal, setShowEvidenceModal]     = useState(false);
  const [selectedStudent, setSelectedStudent]         = useState(null);
  const [selectedCompetency, setSelectedCompetency]   = useState(null);
  const [selectedCompetencyData, setSelectedCompetencyData] = useState(null);
  const [saving, setSaving]                           = useState(false);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  useEffect(() => { if (isAuthenticated) fetchInitialData(); }, [isAuthenticated]);
  useEffect(() => { if (selectedClass) { fetchStudents(); fetchCompetencyData(); } }, [selectedClass]);
  useEffect(() => { if (selectedClass && students.length > 0) fetchCompetencyData(); }, [selectedSubject]);

  const fetchInitialData = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try { await Promise.all([fetchClasses(), fetchCoreCompetencies(), fetchSubjects()]); }
    catch { addToast('error', 'Failed to load data'); }
    finally { setLoading(prev => ({ ...prev, classes: false })); }
  };

  const fetchClasses = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/classes/`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setClasses(data.data);
        if (data.data.length > 0 && !selectedClass) setSelectedClass(data.data[0]);
      } else addToast('error', data.message || 'Failed to load classes');
    } catch { addToast('error', 'Network error loading classes'); }
  };

  const fetchSubjects = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/subjects/`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setSubjects(data.data);
        if (data.data.length > 0 && !selectedSubject) setSelectedSubject(data.data[0]);
      }
    } catch (e) { console.error('Subjects error:', e); }
  };

  const fetchCoreCompetencies = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/core/`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) setCoreCompetencies(data.data);
    } catch (e) { console.error('Competencies error:', e); }
  };

  const fetchStudents = async () => {
    if (!selectedClass?.id) return;
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/students/${selectedClass.id}/`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) setStudents(data.data); else setStudents([]);
    } catch { addToast('error', 'Failed to load students'); setStudents([]); }
    finally { setLoading(prev => ({ ...prev, students: false })); }
  };

  const fetchCompetencyData = async () => {
    if (!selectedClass?.id) return;
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/matrix/retrieve/?class_id=${selectedClass.id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setCompetencyData(data.data.competencies || {});
        setClassAverages(data.data.class_averages || {});
      }
    } catch (e) { console.error('Matrix error:', e); }
    finally { setLoading(prev => ({ ...prev, data: false })); }
  };

  const handleUpdateCompetency = async (student, competency, level, score) => {
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/matrix/update/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ student_id: student.id, competency_id: competency.id, level, score, subject_id: selectedSubject?.id })
      });
      const data = await res.json();
      if (data.success) { addToast('success', `Updated ${competency.name} to ${LEVEL_CONFIG[level]?.label}`); await fetchCompetencyData(); }
      else addToast('error', data.error || 'Update failed');
    } catch { addToast('error', 'Failed to update competency'); }
    finally { setSaving(false); setShowLevelSelector(false); }
  };

  const handleSaveEvidence = async (evData) => {
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/competency/evidence/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...evData, student_id: selectedStudent.id, competency_id: selectedCompetency.id })
      });
      const data = await res.json();
      if (data.success) { addToast('success', 'Evidence linked successfully'); setShowEvidenceModal(false); await fetchCompetencyData(); }
      else addToast('error', data.error || 'Failed to link evidence');
    } catch { addToast('error', 'Failed to save evidence'); }
    finally { setSaving(false); }
  };

  // ✅ Safe key lookup — handles both string & number IDs from API
  const getCellData = (studentId, compId) =>
    competencyData[String(studentId)]?.[String(compId)] ||
    competencyData[studentId]?.[compId] ||
    {};

  const visibleCompetencies = filterCompetency === 'all'
    ? coreCompetencies
    : coreCompetencies.filter(c => String(c.id) === String(filterCompetency));

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvgColor = (avgPct) => {
    const lvl = getLevelFromScore(parseFloat(avgPct));
    return lvl?.hex || '#9ca3af';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the competency matrix.</p>
          <a href="/login" className="px-6 py-3 text-white font-medium rounded-lg inline-block" style={{ backgroundColor: '#16a34a' }}>Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(t => (
        <Toast key={t.id} type={t.type} message={t.message} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
      ))}
      {(loading.classes || loading.students || loading.data || saving) && <GlobalSpinner />}

      {/* ── Header ── */}
      <div className="p-6" style={{ backgroundColor: '#15803d' }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Competency Matrix</h1>
            <p className="mt-1 text-sm" style={{ color: '#bbf7d0' }}>7 Core Competencies · Heatmap Visualization · Evidence Tracking</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('heatmap')}
              className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
              style={viewMode === 'heatmap'
                ? { backgroundColor: '#fff', color: '#15803d' }
                : { backgroundColor: '#166534', color: '#fff' }}
            >
              <Grid className="h-4 w-4 inline mr-1" />Heatmap
            </button>
            <button
              onClick={() => setViewMode('student_detail')}
              className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
              style={viewMode === 'student_detail'
                ? { backgroundColor: '#fff', color: '#15803d' }
                : { backgroundColor: '#166534', color: '#fff' }}
            >
              <Users className="h-4 w-4 inline mr-1" />Student View
            </button>
            <button
              onClick={fetchCompetencyData}
              className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90"
              style={{ backgroundColor: '#2563eb' }}
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* ── Filters ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => setSelectedClass(classes.find(c => String(c.id) === String(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}{cls.is_class_teacher ? ' (Your Class)' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Filter Competency</label>
              <select
                value={filterCompetency}
                onChange={(e) => setFilterCompetency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="all">All Competencies</option>
                {coreCompetencies.map(comp => (<option key={comp.id} value={comp.id}>{comp.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or admission no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── HEATMAP VIEW ── */}
        {viewMode === 'heatmap' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th className="sticky left-0 z-10 border-b border-r border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900 min-w-[190px]"
                      style={{ backgroundColor: '#f9fafb' }}>
                    Student
                  </th>
                  {visibleCompetencies.map(comp => {
                    const avg = classAverages[String(comp.id)] ?? classAverages[comp.id] ?? 0;
                    return (
                      <th key={comp.id} className="border-b border-gray-200 px-3 py-3 text-center min-w-[95px]">
                        <div className="font-bold text-gray-900 text-sm">{comp.code || comp.name?.substring(0, 4)}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[84px] mx-auto" title={comp.name}>{comp.name}</div>
                        <div className="text-xs font-bold mt-1" style={{ color: getAvgColor(avg) }}>
                          Avg: {avg}%
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCompetencies.length + 1} className="text-center py-12 text-gray-400 text-sm">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr key={student.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td className="sticky left-0 z-10 border-b border-r border-gray-200 px-4 py-2 font-medium text-gray-900 text-sm"
                          style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        {student.first_name} {student.last_name}
                        <div className="text-xs text-gray-500">{student.admission_no}</div>
                      </td>
                      {visibleCompetencies.map(comp => {
                        const cellData = getCellData(student.id, comp.id);
                        return (
                          <td key={comp.id} className="border-b border-gray-100 px-2 py-1 text-center">
                            <HeatmapCell
                              student={student}
                              competency={comp}
                              data={cellData}
                              onUpdate={(s, c, d) => {
                                setSelectedStudent(s);
                                setSelectedCompetency(c);
                                setSelectedCompetencyData(d);
                                setShowLevelSelector(true);
                              }}
                              onEvidence={(s, c) => {
                                setSelectedStudent(s);
                                setSelectedCompetency(c);
                                setShowEvidenceModal(true);
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── STUDENT DETAIL VIEW ── */}
        {viewMode === 'student_detail' && (
          <div className="flex flex-col gap-5 max-w-2xl mx-auto">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No students found</div>
            ) : (
              filteredStudents.map(student => {
                const studentCompetencies = {};
                coreCompetencies.forEach(comp => {
                  studentCompetencies[comp.id] = { ...getCellData(student.id, comp.id), name: comp.name };
                });
                return <StudentDetailCard key={student.id} student={student} competencies={studentCompetencies} />;
              })
            )}
          </div>
        )}

        {/* ── Legend ── */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-bold text-gray-700">Legend:</span>
          {Object.entries(LEVEL_CONFIG).reverse().map(([level, config]) => (
            <div key={level} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: config.hex }}>
                <span className="text-white text-xs font-bold">{config.label}</span>
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: config.hex }}>{config.label}</div>
                <div className="text-xs text-gray-500">{config.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {showLevelSelector && selectedStudent && selectedCompetency && (
        <LevelSelector
          currentLevel={selectedCompetencyData?.level}
          onSelect={(level, score) => handleUpdateCompetency(selectedStudent, selectedCompetency, level, score)}
          onClose={() => setShowLevelSelector(false)}
        />
      )}
      {showEvidenceModal && selectedStudent && selectedCompetency && (
        <EvidenceModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          student={selectedStudent}
          competency={selectedCompetency}
          evidence={null}
          onSave={handleSaveEvidence}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default CompetencyMatrix;