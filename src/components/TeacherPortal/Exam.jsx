import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Lock, AlertTriangle, CheckCircle, XCircle, Info,
  X, Search, Save, Shield, Eye, CheckSquare
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const GLOBALLY_LOCKED = new Set(['published', 'archived', 'cancelled']);

// ── Toast ─────────────────────────────────────────────────────────────────────

const TOAST_ICONS = {
  success: <CheckCircle   className="w-4 h-4 flex-shrink-0" />,
  error:   <XCircle       className="w-4 h-4 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
  info:    <Info          className="w-4 h-4 flex-shrink-0" />,
};
const TOAST_STYLES = {
  success: 'bg-green-600 text-white',
  error:   'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info:    'bg-blue-600 text-white',
};

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!visible) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 ${TOAST_STYLES[type]} p-4 min-w-[280px] shadow-lg rounded animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        {TOAST_ICONS[type]}
        <div className="flex-1">
          <p className="font-bold capitalize text-sm">{type}</p>
          <p className="text-sm text-white/90 mt-0.5">{message}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmClass = 'bg-yellow-600 hover:bg-yellow-700', saving }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-300 max-w-md w-full rounded">
        <div className="p-6">
          <div className="flex items-center mb-4 gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">{message}</p>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} disabled={saving}
              className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={saving}
              className={`px-4 py-2 text-white text-sm font-bold rounded disabled:opacity-50 ${confirmClass}`}>
              {saving ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Grade helper ──────────────────────────────────────────────────────────────
// FIX: gradeLevel must be a number (not a UUID string).
// The list endpoint now provides grade_level_numeric directly.
const computeGrade = (percentage, gradeLevel) => {
  if (percentage === undefined || percentage === null || percentage === '') return '';
  // Ensure we are working with a real integer, not a UUID or null
  const numericLevel = parseInt(gradeLevel, 10);
  const upper = !isNaN(numericLevel) && numericLevel >= 7;
  if (upper) {
    if (percentage >= 90) return 'EE1';
    if (percentage >= 75) return 'EE2';
    if (percentage >= 58) return 'ME1';
    if (percentage >= 41) return 'ME2';
    if (percentage >= 31) return 'AE1';
    if (percentage >= 21) return 'AE2';
    if (percentage >= 11) return 'BE1';
    return 'BE2';
  }
  if (percentage >= 90) return 'EE';
  if (percentage >= 75) return 'ME';
  if (percentage >= 58) return 'AE';
  return 'BE';
};

const STATUS_BANNER = {
  published: {
    color:  'bg-indigo-50 border-indigo-300 text-indigo-800',
    label:  'Published',
    detail: 'Results have been published. No further changes are allowed.',
  },
  archived: {
    color:  'bg-gray-100 border-gray-300 text-gray-700',
    label:  'Archived',
    detail: 'This exam is archived and closed for editing.',
  },
  cancelled: {
    color:  'bg-red-50 border-red-300 text-red-800',
    label:  'Cancelled',
    detail: 'This exam has been cancelled.',
  },
};

// ── Moderator progress bar ────────────────────────────────────────────────────

const ModeratorProgress = ({ allSubjects, moderatedSubjects }) => {
  const done  = moderatedSubjects.length;
  const total = allSubjects.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-purple-800">Moderation Progress</p>
        <p className="text-sm text-purple-700">{done} / {total} subjects locked</p>
      </div>
      <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {allSubjects.map(sub => {
          const done = moderatedSubjects.includes(sub);
          return (
            <span key={sub}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                done
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-purple-300 text-purple-700'
              }`}>
              {done && <CheckSquare className="w-3 h-3" />}
              {sub}
              {done ? ' ✓' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

function Exams() {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [exams, setExams]                         = useState([]);
  const [selection, setSelection]                 = useState({ examId: null, subject: '' });
  const [students, setStudents]                   = useState([]);
  const [scores, setScores]                       = useState({});
  const [absentStudents, setAbsentStudents]       = useState(new Set());
  const [finalizedSubjects, setFinalizedSubjects] = useState(new Set());
  const [moderatedSubjects, setModeratedSubjects] = useState([]);
  const [isModerator, setIsModerator]             = useState(false);

  const [isLoading, setIsLoading]                 = useState(true);
  const [saving, setSaving]                       = useState(false);
  const [error, setError]                         = useState(null);
  const [searchTerm, setSearchTerm]               = useState('');
  const [toasts, setToasts]                       = useState([]);
  const [showConfirmModal, setShowConfirmModal]   = useState(false);
  const [showModerateConfirm, setShowModerateConfirm] = useState(false);

  const fetchingRef     = useRef(false);
  const lastFetchKeyRef = useRef('');

  // ── Derived ───────────────────────────────────────────────────────────────

  const { examId: selectedExamId, subject: selectedSubject } = selection;
  const selectedExam = exams.find(e => e.id === selectedExamId) ?? null;

  const globallyLocked = selectedExam ? GLOBALLY_LOCKED.has(selectedExam.status) : false;

  const markerSubjectLocked = !isModerator && selectedSubject
    ? finalizedSubjects.has(selectedSubject)
    : false;

  const moderatorSubjectLocked = isModerator && selectedSubject
    ? moderatedSubjects.includes(selectedSubject)
    : false;

  const isLocked = globallyLocked || markerSubjectLocked || moderatorSubjectLocked;

  const assignedSubjects = selectedExam?.assigned_subjects ?? [];
  const teacherAllDone   = !isModerator && assignedSubjects.length > 0
    && assignedSubjects.every(s => finalizedSubjects.has(s));

  const canFinalize = !isModerator && selectedExam?.status === 'marking' && !teacherAllDone;

  const allModerated = isModerator && assignedSubjects.length > 0
    && assignedSubjects.every(s => moderatedSubjects.includes(s));

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5500);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // ── fetchExams ────────────────────────────────────────────────────────────

  const fetchExams = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/exams/`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) { setExams(data.data); return data.data; }
      setError(data.message || 'Failed to load exams');
      return [];
    } catch {
      setError('Network error: Could not connect to server');
      return [];
    }
  }, [getAuthHeaders]);

  // ── fetchStudents ─────────────────────────────────────────────────────────

  const fetchStudents = useCallback(async (examId, subject, force = false) => {
    if (!examId || !subject) return;
    const key = `${examId}::${subject}`;
    if (fetchingRef.current) return;
    if (!force && lastFetchKeyRef.current === key) return;

    fetchingRef.current = true;
    try {
      const url  = `${API_BASE_URL}/api/teacher/exams/${examId}/scores/?subject=${encodeURIComponent(subject)}`;
      const res  = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!data.success) return;

      lastFetchKeyRef.current = key;

      if (data.className) {
        setExams(prev => prev.map(e => e.id === examId ? { ...e, className: data.className } : e));
      }

      setIsModerator(!!data.is_moderator);

      setStudents(data.data);

      // FIX: patch grade_level_numeric from scores endpoint (integer, never UUID)
      if (data.grade_level_numeric !== undefined) {
        setExams(prev => prev.map(e =>
          e.id === examId ? { ...e, grade_level_numeric: data.grade_level_numeric } : e
        ));
      }

      const scoresMap = {};
      const absentSet = new Set();
      data.data.forEach(s => {
        if (s.score !== null && s.score !== undefined) scoresMap[s.student_id] = s.score;
        if (s.is_absent) absentSet.add(s.student_id);
      });
      setScores(scoresMap);
      setAbsentStudents(absentSet);

      if (Array.isArray(data.finalized_subjects)) {
        setFinalizedSubjects(new Set(data.finalized_subjects));
      }
      if (Array.isArray(data.moderated_subjects)) {
        setModeratedSubjects(data.moderated_subjects);
      }
      if (data.teacher_all_finalized !== undefined) {
        setExams(prev => prev.map(e =>
          e.id === examId ? { ...e, teacher_all_finalized: data.teacher_all_finalized } : e
        ));
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [getAuthHeaders]);

  // ── Helper: build initial selection ──────────────────────────────────────

  const buildSelection = (exam, overrideSubject = null) => {
    const subs   = exam?.assigned_subjects ?? [];
    const modded = exam?.moderated_subjects ?? [];
    const finSet = new Set(exam?.finalized_subjects ?? []);
    let subject = overrideSubject && subs.includes(overrideSubject)
      ? overrideSubject
      : (subs.find(s => !finSet.has(s) && !modded.includes(s)) ?? subs[0] ?? '');
    return { examId: exam?.id ?? null, subject };
  };

  // ── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    fetchExams().then(list => {
      setIsLoading(false);
      if (!list.length) return;
      const first = list[0];
      setFinalizedSubjects(new Set(first.finalized_subjects ?? []));
      setModeratedSubjects(first.moderated_subjects ?? []);
      setIsModerator(!!first.is_moderator);
      setSelection(buildSelection(first));
    });
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch students when selection changes ─────────────────────────────────

  useEffect(() => {
    if (!selectedExamId || !selectedSubject) return;
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) return;
    if (!(exam.assigned_subjects ?? []).includes(selectedSubject)) return;

    setStudents([]);
    setScores({});
    setAbsentStudents(new Set());
    fetchStudents(selectedExamId, selectedSubject);
  }, [selectedExamId, selectedSubject]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Exam dropdown change ──────────────────────────────────────────────────

  const handleExamChange = (examId) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    lastFetchKeyRef.current = '';
    setFinalizedSubjects(new Set(exam.finalized_subjects ?? []));
    setModeratedSubjects(exam.moderated_subjects ?? []);
    setIsModerator(!!exam.is_moderator);
    setSelection(buildSelection(exam));
  };

  const handleSubjectChange = (subject) => {
    lastFetchKeyRef.current = '';
    setSelection(prev => ({ ...prev, subject }));
  };

  // ── Score / absent handlers ───────────────────────────────────────────────

  const handleScoreChange = (studentId, value) => {
    if (isLocked) return;
    if (value === '') {
      setScores(prev => { const n = { ...prev }; delete n[studentId]; return n; });
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0 && num <= (selectedExam?.total_marks ?? Infinity)) {
        setScores(prev => ({ ...prev, [studentId]: num }));
      }
    }
  };

  const handleAbsentToggle = (studentId) => {
    if (isLocked) return;
    setAbsentStudents(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
        setScores(p => { const n = { ...p }; delete n[studentId]; return n; });
      }
      return next;
    });
  };

  // ── Build score payload ───────────────────────────────────────────────────

  const buildPayload = () => {
    const payload = [];
    Object.entries(scores).forEach(([id, score]) => {
      payload.push({ student_id: id, score: parseFloat(score), is_absent: false });
    });
    absentStudents.forEach(id => {
      if (scores[id] === undefined) payload.push({ student_id: id, score: null, is_absent: true });
    });
    return payload;
  };

  // ── Save scores (markers) ─────────────────────────────────────────────────

  const handleSaveScores = async () => {
    if (!selectedExam || !selectedSubject || isLocked) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/bulk/`, {
        method:  'POST',
        headers: getAuthHeaders(),
        body:    JSON.stringify({ subject: selectedSubject, scores: buildPayload() }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Saved ${data.saved_count} scores for ${selectedSubject}`, 'success');
        fetchExams();
      } else {
        addToast(data.message || 'Failed to save scores', 'error');
      }
    } catch {
      addToast('Network error: Could not save scores', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Moderator: save + lock subject ───────────────────────────────────────

  const handleModeratorSaveAndLock = async () => {
    if (!selectedExam || !selectedSubject) return;
    setSaving(true);
    setShowModerateConfirm(false);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/bulk/`, {
        method:  'POST',
        headers: getAuthHeaders(),
        body:    JSON.stringify({ subject: selectedSubject, scores: buildPayload() }),
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.moderated_subjects)) {
          setModeratedSubjects(data.moderated_subjects);
          setExams(prev => prev.map(e =>
            e.id === selectedExam.id
              ? { ...e, moderated_subjects: data.moderated_subjects, status: data.exam_status ?? e.status }
              : e
          ));
        }

        if (data.all_moderated) {
          addToast('All subjects moderated — exam published!', 'success');
          await fetchExams();
          lastFetchKeyRef.current = '';
        } else {
          addToast(`"${selectedSubject}" moderated and locked. ${data.message}`, 'success');
          const nextSub = assignedSubjects.find(
            s => s !== selectedSubject && !data.moderated_subjects.includes(s)
          );
          if (nextSub) {
            lastFetchKeyRef.current = '';
            setSelection({ examId: selectedExamId, subject: nextSub });
          }
        }
      } else {
        addToast(data.message || 'Failed to save moderation', 'error');
      }
    } catch {
      addToast('Network error: Could not save moderation', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Finalize (markers) ────────────────────────────────────────────────────

  const handleFinalizeExam = async () => {
    if (!selectedExam) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/finalize/`, {
        method: 'POST', headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        addToast(data.message, 'success');
        setFinalizedSubjects(new Set(assignedSubjects));
        setExams(prev => prev.map(e =>
          e.id === selectedExam.id
            ? { ...e, status: data.exam_status ?? e.status, teacher_all_finalized: true, finalized_subjects: assignedSubjects }
            : e
        ));
        lastFetchKeyRef.current = '';
        await fetchStudents(selectedExam.id, selectedSubject, true);
      } else {
        addToast(data.message || 'Failed to finalize', 'error');
      }
    } catch {
      addToast('Network error: Could not finalize exam', 'error');
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
    }
  };

  // ── Statistics ────────────────────────────────────────────────────────────

  const stats = (() => {
    const valid = Object.entries(scores)
      .filter(([id]) => !absentStudents.has(id))
      .map(([, s]) => s);
    if (!valid.length) return { avg: 0, min: 0, max: 0, count: 0, total: students.length };
    const sum = valid.reduce((a, b) => a + b, 0);
    return { avg: (sum / valid.length).toFixed(1), min: Math.min(...valid), max: Math.max(...valid), count: valid.length, total: students.length };
  })();

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Auth guard ────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access exams</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium rounded">Go to Login</a>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideInRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slideInRight 0.25s ease-out; }
      `}</style>

      {/* Marker finalize confirm */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalizeExam}
        saving={saving}
        title="Finalize Exam"
        confirmLabel="Finalize"
        confirmClass="bg-yellow-600 hover:bg-yellow-700"
        message={`Are you sure you want to finalize "${selectedExam?.title}"? Your scores will be locked and cannot be edited after this.`}
      />

      {/* Moderator save+lock confirm */}
      <ConfirmModal
        isOpen={showModerateConfirm}
        onClose={() => setShowModerateConfirm(false)}
        onConfirm={handleModeratorSaveAndLock}
        saving={saving}
        title={`Lock "${selectedSubject}" scores`}
        confirmLabel="Save & Lock"
        confirmClass="bg-purple-600 hover:bg-purple-700"
        message={`Save your moderator adjustments for "${selectedSubject}" and lock this subject permanently. This cannot be undone.${
          assignedSubjects.filter(s => !moderatedSubjects.includes(s) && s !== selectedSubject).length === 0
            ? ' This is the last subject — the exam will be published automatically.'
            : ''
        }`}
      />

      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}

      <div className="bg-green-700 px-6 py-6">
        <h1 className="text-2xl font-bold text-white">Examination Center</h1>
        <p className="text-green-100 mt-1">
          {isModerator
            ? 'Moderating exam — adjust scores per subject then lock each one to complete moderation'
            : 'Mark student scores for assigned exams'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
        )}

        {/* Selectors */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Exam</label>
              <select
                value={selectedExamId || ''}
                onChange={(e) => handleExamChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={isLoading}
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                    {(exam.assigned_subjects?.length ?? 0) > 1
                      ? ` (${exam.assigned_subjects.length} subjects)`
                      : ` - ${exam.assigned_subject || exam.assigned_subjects?.[0]}`}
                    {exam.is_moderator ? ' [Moderator]' : ''}
                    {' '}({exam.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedExam && (selectedExam.assigned_subjects?.length ?? 0) > 1 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {isModerator ? 'Subject to Moderate' : 'Subject You Are Marking'}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  {selectedExam.assigned_subjects.map(sub => {
                    const isModded  = moderatedSubjects.includes(sub);
                    const isFinaled = !isModerator && finalizedSubjects.has(sub);
                    return (
                      <option key={sub} value={sub}>
                        {sub}
                        {isModded  ? ' ✓ (moderated)' : ''}
                        {isFinaled ? ' (finalized)'   : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <div className={`px-3 py-2 border rounded text-sm font-semibold flex items-center gap-2 ${
                isLocked ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}>
                {isLocked && <Lock className="w-3.5 h-3.5" />}
                {selectedExam?.status?.toUpperCase() || 'N/A'}
                {isModerator && !moderatorSubjectLocked && ' (moderator)'}
                {moderatorSubjectLocked && ' (subject locked)'}
                {markerSubjectLocked && !isModerator && ' (finalized)'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Class</label>
              <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm">
                {selectedExam?.className || selectedExam?.grade_level_display || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject / Max Marks</label>
              <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm flex justify-between">
                <span>{selectedSubject || '—'}</span>
                <span className="font-bold text-green-700">{selectedExam?.total_marks || 0} marks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Moderator progress tracker */}
        {selectedExam && isModerator && !globallyLocked && (
          <ModeratorProgress
            allSubjects={assignedSubjects}
            moderatedSubjects={moderatedSubjects}
          />
        )}

        {/* Moderator: current subject already locked */}
        {selectedExam && isModerator && moderatorSubjectLocked && !globallyLocked && (
          <div className="flex items-start gap-3 px-4 py-3 border rounded mb-6 bg-purple-50 border-purple-300 text-purple-800">
            <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">"{selectedSubject}" — Moderation Locked</p>
              <p className="text-sm mt-0.5">
                You have already saved and locked this subject.
                {!allModerated && ' Select another subject to continue moderating.'}
              </p>
            </div>
          </div>
        )}

        {/* Moderator: current subject editable */}
        {selectedExam && isModerator && !moderatorSubjectLocked && !globallyLocked && (
          <div className="flex items-start gap-3 px-4 py-3 border rounded mb-6 bg-blue-50 border-blue-300 text-blue-800">
            <Eye className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Moderator — Editing "{selectedSubject}"</p>
              <p className="text-sm mt-0.5">
                Review and adjust scores. When satisfied, click <strong>Save &amp; Lock Subject</strong> to
                permanently lock this subject. Once locked it cannot be changed.
              </p>
            </div>
          </div>
        )}

        {/* Global lock banner */}
        {selectedExam && globallyLocked && (() => {
          const cfg = STATUS_BANNER[selectedExam.status] ?? {
            color: 'bg-gray-100 border-gray-300 text-gray-700',
            label: selectedExam.status,
            detail: 'This exam is closed for editing.',
          };
          return (
            <div className={`flex items-start gap-3 px-4 py-3 border rounded mb-6 ${cfg.color}`}>
              <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Marks Locked — {cfg.label}</p>
                <p className="text-sm mt-0.5">{cfg.detail}</p>
              </div>
            </div>
          );
        })()}

        {/* Marker: subject finalized banner */}
        {selectedExam && !globallyLocked && !isModerator && markerSubjectLocked && (
          <div className="flex items-start gap-3 px-4 py-3 border rounded mb-6 bg-yellow-50 border-yellow-300 text-yellow-800">
            <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Subject Finalized — {selectedSubject}</p>
              <p className="text-sm mt-0.5">
                You have already finalized this subject. Scores are read-only.
                {!teacherAllDone && ' You may still enter marks for your other subjects.'}
              </p>
            </div>
          </div>
        )}

        {/* Marker: moderation in progress banner */}
        {selectedExam && selectedExam.status === 'moderation' && !isModerator && !markerSubjectLocked && (
          <div className="flex items-start gap-3 px-4 py-3 border rounded mb-6 bg-purple-50 border-purple-300 text-purple-800">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Exam Under Moderation</p>
              <p className="text-sm mt-0.5">
                This exam is currently being moderated. You may continue entering scores for unfinalised subjects.
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        {selectedExam && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Students',   value: stats.total,                   color: 'text-gray-900' },
              { label: 'Scores Entered',   value: stats.count,                   color: 'text-green-700' },
              { label: 'Average Score',    value: `${stats.avg}%`,               color: 'text-blue-700' },
              { label: 'Highest / Lowest', value: `${stats.max} / ${stats.min}`, color: 'text-gray-900' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded p-3 text-center">
                <p className="text-xs text-gray-600">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Score table */}
        {selectedExam && (
          <>
            <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex gap-2 items-center">
                {/* Marker: finalize button */}
                {canFinalize && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={saving}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {saving ? 'Processing...' : 'Finalize Exam'}
                  </button>
                )}

                {/* Moderator: Save & Lock button */}
                {isModerator && !moderatorSubjectLocked && !globallyLocked && (
                  <button
                    onClick={() => setShowModerateConfirm(true)}
                    disabled={saving}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save & Lock Subject'}
                  </button>
                )}

                {/* Marker: plain save button */}
                {!isModerator && !isLocked && (
                  <button
                    onClick={handleSaveScores}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Scores'}
                  </button>
                )}

                {/* Read-only badge */}
                {isLocked && (
                  <div className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2 cursor-not-allowed select-none bg-gray-200 text-gray-500">
                    <Lock className="h-4 w-4" />
                    {moderatorSubjectLocked ? 'Subject Locked' : 'Read-Only'}
                  </div>
                )}
              </div>
            </div>

            <div className={`bg-white border rounded overflow-x-auto ${
              isLocked ? 'border-gray-300' : isModerator ? 'border-purple-200' : 'border-gray-200'
            }`}>
              <table className="w-full text-sm">
                <thead className={
                  isLocked ? 'bg-gray-200'
                  : isModerator ? 'bg-purple-50'
                  : 'bg-gray-50'
                }>
                  <tr>
                    <th className="px-4 py-3 text-left w-12">#</th>
                    <th className="px-4 py-3 text-left">Admission No.</th>
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-left">Stream</th>
                    <th className="px-4 py-3 text-center w-20">Absent</th>
                    <th className="px-4 py-3 text-center">
                      Score / {selectedExam.total_marks}
                      {isModerator && !moderatorSubjectLocked && !globallyLocked && (
                        <span className="ml-2 text-xs font-normal text-purple-600">(moderator edit)</span>
                      )}
                      {moderatorSubjectLocked && (
                        <span className="ml-2 text-xs font-normal text-gray-500">(locked)</span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-center w-24">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-400">No students found</td>
                    </tr>
                  ) : filteredStudents.map((student, idx) => {
                    const isAbsent = absentStudents.has(student.student_id);
                    const score    = scores[student.student_id] ?? '';
                    const pct      = score !== '' ? (score / selectedExam.total_marks) * 100 : null;
                    // FIX: use grade_level_numeric (integer from API) — never the grade_level UUID
                    const grade = !isAbsent && score !== ''
                      ? computeGrade(pct, selectedExam.grade_level_numeric)
                      : '';
                    return (
                      <tr key={student.student_id}
                        className={`border-b border-gray-200 ${isAbsent ? 'bg-gray-100' : isLocked ? 'bg-gray-50' : ''}`}
                      >
                        <td className="px-4 py-3 text-gray-600 text-center">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                        <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{student.stream || '—'}</td>

                        <td className="px-4 py-3 text-center">
                          <label className={`inline-flex items-center ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                            <input
                              type="checkbox"
                              checked={isAbsent}
                              onChange={() => handleAbsentToggle(student.student_id)}
                              disabled={isLocked}
                              className="w-4 h-4"
                            />
                            <span className="ml-2 text-xs text-gray-600">AB</span>
                          </label>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={score}
                            onChange={(e) => handleScoreChange(student.student_id, e.target.value)}
                            disabled={isAbsent || isLocked}
                            readOnly={isLocked}
                            className={`w-24 px-2 py-1 text-center border rounded transition-colors ${
                              isLocked
                                ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                                : isAbsent
                                ? 'bg-gray-100 text-gray-400 border-gray-300'
                                : isModerator
                                ? 'bg-white border-purple-300 focus:border-purple-500'
                                : 'bg-white border-gray-300'
                            }`}
                            min="0"
                            max={selectedExam.total_marks}
                            step="0.5"
                          />
                        </td>

                        <td className="px-4 py-3 text-center font-bold">
                          {!isAbsent && grade && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{grade}</span>
                          )}
                          {isAbsent && <span className="text-xs text-gray-400">Absent</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!selectedExam && !isLoading && exams.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-8 text-center">
            <p className="text-yellow-800 font-medium">No exams assigned to you for marking.</p>
            <p className="text-yellow-600 text-sm mt-1">Exams will appear here once the Registrar creates and assigns them.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;