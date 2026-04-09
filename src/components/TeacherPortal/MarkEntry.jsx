/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  Save,
  X,
  Filter,
  Users,
  ClipboardList,
  Award,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Printer,
  Edit,
  RefreshCw,
  Eye,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── CBC SCALE ───────────────────────────────────────────────────────────────
const LEGEND = [
  {
    sub: "EE1",
    pts: 8,
    label: "Exceptional",
    range: "90-100%",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    sub: "EE2",
    pts: 7,
    label: "Very Good",
    range: "75-89%",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    sub: "ME1",
    pts: 6,
    label: "Good",
    range: "58-74%",
    cls: "bg-sky-50 text-sky-800 border-sky-200",
  },
  {
    sub: "ME2",
    pts: 5,
    label: "Fair",
    range: "41-57%",
    cls: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    sub: "AE1",
    pts: 4,
    label: "Needs Improvement",
    range: "31-40%",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    sub: "AE2",
    pts: 3,
    label: "Below Average",
    range: "21-30%",
    cls: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    sub: "BE1",
    pts: 2,
    label: "Well Below Average",
    range: "11-20%",
    cls: "bg-rose-50 text-rose-800 border-rose-200",
  },
  {
    sub: "BE2",
    pts: 1,
    label: "Minimal",
    range: "1-10%",
    cls: "bg-rose-50 text-rose-700 border-rose-100",
  },
];

const META = {
  EE1: {
    label: "Exceptional",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  EE2: {
    label: "Very Good",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  ME1: { label: "Good", badge: "bg-sky-100 text-sky-800 border-sky-300" },
  ME2: { label: "Fair", badge: "bg-sky-100 text-sky-700 border-sky-200" },
  AE1: {
    label: "Needs Improvement",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
  },
  AE2: {
    label: "Below Average",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  BE1: {
    label: "Well Below Average",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
  },
  BE2: { label: "Minimal", badge: "bg-rose-100 text-rose-700 border-rose-200" },
};

const percentageToCbcCode = (perc) => {
  if (perc === "" || perc === null) return null;
  const p = parseFloat(perc);
  if (isNaN(p)) return null;
  if (p >= 90) return "EE1";
  if (p >= 75) return "EE2";
  if (p >= 58) return "ME1";
  if (p >= 41) return "ME2";
  if (p >= 31) return "AE1";
  if (p >= 21) return "AE2";
  if (p >= 11) return "BE1";
  return "BE2";
};

const getCbcGrade = (perc) => {
  const code = percentageToCbcCode(perc);
  if (!code) return null;
  return { code, label: META[code]?.label, cls: META[code]?.badge };
};

const getMidpoint = (rating) => {
  const map = {
    EE1: "95",
    EE2: "82",
    ME1: "66",
    ME2: "49",
    AE1: "35",
    AE2: "25",
    BE1: "15",
    BE2: "5",
  };
  return map[rating] || "";
};

// ─── ENDPOINTS ───────────────────────────────────────────────────────────────
const EP = {
  teacherClasses: "/api/registrar/academic/teacher-classes/",
  teacherLearningAreas: "/api/registrar/academic/teacher-learning-areas/",
  terms: "/api/registrar/academic/terms/",
  assessmentWindows: "/api/registrar/academic/assessment-windows/",
  strandsForArea: "/api/registrar/academic/strands-for-area/",
  substrandsForStrand: "/api/registrar/academic/substrands-for-strand/",
  competenciesForSub: "/api/registrar/academic/competencies-for-substrand/",
  studentsMarks: "/api/marks/students/",
  saveMarks: "/api/marks/save/",
};

const SESSION_KEY = "marksEntry_selections";

// ─── SESSION EXPIRED MODAL ────────────────────────────────────────────────────
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
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} z-50 max-w-sm`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const MarksEntrySheet = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, msg) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleApiError = useCallback((res) => {
    if (res?.status === 401) setShowSessionExpired(true);
  }, []);

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = "/logout";
  };

  const apiFetch = useCallback(
    async (url, opts = {}) => {
      const headers = {
        ...getAuthHeaders(),
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      };
      const res = await fetch(url, { ...opts, headers });
      if (res.status === 401) {
        handleApiError(res);
        return null;
      }
      return res.json();
    },
    [getAuthHeaders, handleApiError],
  );

  const isAdminOrRegistrar =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "registrar";

  // ─── State ────────────────────────────────────────────────────────────────
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const [selClass, setSelClass] = useState("");
  const [selTerm, setSelTerm] = useState("");
  const [selAssessmentWindowId, setSelAssessmentWindowId] = useState("");
  const [selSubject, setSelSubject] = useState("");

  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [assessmentWindows, setAssessmentWindows] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [learningAreaId, setLearningAreaId] = useState(null);
  const [learningAreaName, setLearningAreaName] = useState("");
  const [assessmentId, setAssessmentId] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [competencyId, setCompetencyId] = useState(null);

  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("entry");

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [loadingAssessmentWindows, setLoadingAssessmentWindows] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [didRestore, setDidRestore] = useState(false);

  // ─── NEW: Persist exact typed percentages across saves/refresh ─────────────
  const [persistedPercentages, setPersistedPercentages] = useState({});

  const effectiveTeacherId = isAdminOrRegistrar
    ? selectedTeacherId
    : user?.id || "";

  // ─── Restore from sessionStorage on mount ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;
    try {
      const {
        selectedTeacherId: tid,
        selClass: cls,
        selTerm: term,
        selAssessmentWindowId: windowId,
        selSubject: subject,
      } = JSON.parse(saved);
      if (tid) setSelectedTeacherId(tid);
      if (cls) setSelClass(cls);
      if (term) setSelTerm(term);
      if (windowId) setSelAssessmentWindowId(windowId);
      if (subject) setSelSubject(subject);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [isAuthenticated]);

  // ─── Persist to sessionStorage on change ─────────────────────────────────
  useEffect(() => {
    if (!selClass) return;
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        selectedTeacherId,
        selClass,
        selTerm,
        selAssessmentWindowId,
        selSubject,
      }),
    );
  }, [selectedTeacherId, selClass, selTerm, selAssessmentWindowId, selSubject]);

  // ─── Re-fetch students after restore ────────────────────────────────
  useEffect(() => {
    if (didRestore) return;
    if (
      !selClass ||
      !selTerm ||
      !selAssessmentWindowId ||
      !selSubject ||
      !isAuthenticated
    )
      return;
    if (subjects.length === 0) return;

    setDidRestore(true);
    const restore = async () => {
      setLoadingStudents(true);
      try {
        const strandRes = await apiFetch(
          `${API_BASE_URL}${EP.strandsForArea}?learning_area_id=${selSubject}&class_id=${selClass}`,
        );
        const firstStrand =
          strandRes?.success && strandRes.data?.length
            ? strandRes.data[0]
            : null;
        if (!firstStrand) return;

        const subRes = await apiFetch(
          `${API_BASE_URL}${EP.substrandsForStrand}?strand_id=${firstStrand.id}`,
        );
        const firstSub =
          subRes?.success && subRes.data?.length ? subRes.data[0] : null;
        if (!firstSub) return;

        const compRes = await apiFetch(
          `${API_BASE_URL}${EP.competenciesForSub}?substrand_id=${firstSub.id}`,
        );
        const firstComp =
          compRes?.success && compRes.data?.length ? compRes.data[0].id : null;
        if (!firstComp) return;

        setLearningAreaId(selSubject);
        setLearningAreaName(
          subjects.find((s) => String(s.id) === String(selSubject))
            ?.area_name || "",
        );
        setCompetencyId(firstComp);
        await _fetchStudentsWithWindow(
          selClass,
          selSubject,
          selAssessmentWindowId,
          firstComp,
        );
      } catch {
        /* silently fail */
      } finally {
        setLoadingStudents(false);
      }
    };
    restore();
  }, [
    selClass,
    selTerm,
    selAssessmentWindowId,
    selSubject,
    subjects,
    isAuthenticated,
    didRestore,
  ]);

  // ─── Load teachers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !isAdminOrRegistrar) return;
    (async () => {
      const data = await apiFetch(
        `${API_BASE_URL}/api/registrar/users/teachers/`,
      );
      if (data?.success) setTeachers(data.data || []);
    })();
  }, [isAuthenticated, isAdminOrRegistrar]);

  // ─── Load classes ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!didRestore) {
      setClasses([]);
      setSubjects([]);
      setStudents([]);
      setLearningAreaId(null);
      setLearningAreaName("");
      setAssessmentId(null);
      setCompetencyId(null);
    }
    if (!isAuthenticated) return;
    if (isAdminOrRegistrar && !selectedTeacherId) return;

    setLoadingClasses(true);
    (async () => {
      let url = `${API_BASE_URL}${EP.teacherClasses}`;
      if (effectiveTeacherId) url += `?teacher_id=${effectiveTeacherId}`;
      const data = await apiFetch(url);
      if (data?.success) setClasses(data.data || []);
      setLoadingClasses(false);
    })();
  }, [isAuthenticated, effectiveTeacherId]);

  // ─── Load terms ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingTerms(true);
    (async () => {
      const data = await apiFetch(`${API_BASE_URL}${EP.terms}`);
      if (data?.success) setTerms(data.data || []);
      setLoadingTerms(false);
    })();
  }, [isAuthenticated]);

  // ─── Load assessment windows ────────────────────────
  useEffect(() => {
    if (!didRestore) {
      setAssessmentWindows([]);
      setSelAssessmentWindowId("");
      setStudents([]);
      setAssessmentId(null);
      setCompetencyId(null);
    }

    if (!selTerm || !isAuthenticated) return;

    setLoadingAssessmentWindows(true);
    (async () => {
      try {
        const data = await apiFetch(
          `${API_BASE_URL}${EP.assessmentWindows}?term=${selTerm}`,
        );
        if (data?.success) {
          setAssessmentWindows(data.data || []);
        } else {
          showToast(
            "error",
            "Failed to load assessment windows for this term.",
          );
        }
      } catch {
        showToast("error", "Failed to load assessment windows.");
      } finally {
        setLoadingAssessmentWindows(false);
      }
    })();
  }, [selTerm, isAuthenticated]);

  // ─── Load subjects ────────────────────────────────
  useEffect(() => {
    if (!selClass || !isAuthenticated) return;
    if (subjects.length > 0) return;

    setLoadingSubjects(true);
    (async () => {
      try {
        let url = `${API_BASE_URL}${EP.teacherLearningAreas}?class_id=${selClass}`;
        if (effectiveTeacherId) url += `&teacher_id=${effectiveTeacherId}`;
        const data = await apiFetch(url);
        if (data?.success) setSubjects(data.data || []);
      } catch {
        showToast("error", "Failed to load subjects for this class.");
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, [selClass, isAuthenticated, effectiveTeacherId]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setDidRestore(false);
    setSelClass(classId);
    setSelSubject("");
    setSubjects([]);
    setStudents([]);
    setLearningAreaId(null);
    setLearningAreaName("");
    setAssessmentId(null);
    setCompetencyId(null);
    if (!classId) return;

    setLoadingSubjects(true);
    try {
      let url = `${API_BASE_URL}${EP.teacherLearningAreas}?class_id=${classId}`;
      if (effectiveTeacherId) url += `&teacher_id=${effectiveTeacherId}`;
      const data = await apiFetch(url);
      if (data?.success) setSubjects(data.data || []);
    } catch {
      showToast("error", "Failed to load subjects for this class.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleTermChange = (e) => {
    setDidRestore(false);
    setSelTerm(e.target.value);
    setSelSubject("");
    setStudents([]);
    setAssessmentId(null);
    setCompetencyId(null);
  };

  const handleAssessmentWindowChange = (e) => {
    setDidRestore(false);
    const windowId = e.target.value;
    setSelAssessmentWindowId(windowId);
    setStudents([]);
    setAssessmentId(null);
    setCompetencyId(null);

    if (windowId && selSubject && selClass) {
      _loadStudentsForSubject(selSubject, windowId);
    }
  };

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setDidRestore(false);
    setSelSubject(subjectId);
    setStudents([]);
    setAssessmentId(null);
    setCompetencyId(null);
    if (!subjectId || !selClass || !selAssessmentWindowId) return;
    await _loadStudentsForSubject(subjectId, selAssessmentWindowId);
  };

  const _loadStudentsForSubject = async (subjectId, windowId) => {
    setLoadingStudents(true);
    try {
      const strandRes = await apiFetch(
        `${API_BASE_URL}${EP.strandsForArea}?learning_area_id=${subjectId}&class_id=${selClass}`,
      );
      if (!strandRes?.success || !strandRes.data?.length) {
        showToast(
          "error",
          "No strands configured for this subject. Contact the registrar.",
        );
        return;
      }
      const firstStrand = strandRes.data[0];

      const subRes = await apiFetch(
        `${API_BASE_URL}${EP.substrandsForStrand}?strand_id=${firstStrand.id}`,
      );
      if (!subRes?.success || !subRes.data?.length) {
        showToast(
          "error",
          "No sub-strands configured for this subject. Contact the registrar.",
        );
        return;
      }
      const firstSub = subRes.data[0];

      const compRes = await apiFetch(
        `${API_BASE_URL}${EP.competenciesForSub}?substrand_id=${firstSub.id}`,
      );
      if (!compRes?.success || !compRes.data?.length) {
        showToast(
          "error",
          "No competencies mapped for this subject yet. Contact the registrar.",
        );
        return;
      }
      const firstComp = compRes.data[0].id;

      setLearningAreaId(subjectId);
      setLearningAreaName(
        subjects.find((s) => String(s.id) === String(subjectId))?.area_name ||
          "",
      );
      setCompetencyId(firstComp);
      await _fetchStudentsWithWindow(selClass, subjectId, windowId, firstComp);
    } catch (err) {
      console.error("_loadStudentsForSubject error:", err);
      showToast(
        "error",
        err.message || "Failed to load students for this subject.",
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // ─── FIXED FETCH: preserve exact typed % ───────────────────────────────
  const _fetchStudentsWithWindow = async (
    classId,
    laId,
    assessmentWindowId,
    compId,
  ) => {
    const params = new URLSearchParams({
      class_id: classId,
      learning_area_id: laId,
      assessment_window_id: assessmentWindowId,
      competency_id: compId,
    });
    const d = await apiFetch(`${API_BASE_URL}${EP.studentsMarks}?${params}`);
    if (!d?.success) throw new Error(d?.error || "Failed");

    const mapped = d.data.map((s) => {
      const persisted = persistedPercentages[s.id] || "";
      const displayPercentage = persisted || (s.rating ? getMidpoint(s.rating) : "");
      return {
        ...s,
        marks: { percentage: displayPercentage, comment: s.comment || "" },
        savedRating: s.rating,
      };
    });

    setStudents(mapped);
    setAssessmentId(d.assessment_id);
    setAssessmentStatus(d.assessment_status);
  };

  const refreshStudents = () => {
    if (selClass && learningAreaId && selAssessmentWindowId && competencyId) {
      setLoadingStudents(true);
      _fetchStudentsWithWindow(
        selClass,
        learningAreaId,
        selAssessmentWindowId,
        competencyId,
      )
        .catch(() => {})
        .finally(() => setLoadingStudents(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assessmentId || !competencyId) {
      showToast(
        "error",
        "Please select class, term, assessment and subject first.",
      );
      return;
    }
    setSaving(true);
    try {
      const marksPayload = students
        .map((s) => {
          const percentage = s.marks.percentage;
          const ratingCode = percentageToCbcCode(percentage);
          if (!ratingCode || percentage === "") return null;
          return {
            student_id: s.id,
            rating: ratingCode,
            comment: s.marks.comment || "",
          };
        })
        .filter(Boolean);

      if (marksPayload.length === 0) {
        showToast("error", "No valid marks to save (enter percentages 0-100).");
        setSaving(false);
        return;
      }

      const d = await apiFetch(`${API_BASE_URL}${EP.saveMarks}`, {
        method: "POST",
        body: JSON.stringify({
          assessment_id: assessmentId,
          competency_id: competencyId,
          marks: marksPayload,
        }),
      });
      if (d?.success) {
        showToast("success", d.message || "Marks saved successfully");
        refreshStudents();
      } else {
        showToast(
          "error",
          d?.error || d?.errors?.join(", ") || "Failed to save marks",
        );
      }
    } catch (err) {
      showToast("error", "Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  const isLocked = assessmentStatus === "Locked";
  const canSave =
    !!assessmentId && !!competencyId && students.length > 0 && !isLocked;

  // ─── Reusable Select ──────────────────────────────────────────────────────
  const Sel = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    disabled,
    busy,
  }) => (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled || busy}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
        >
          <option value="">{busy ? "Loading…" : placeholder}</option>
          {options.map((o) => (
            <option key={o.id ?? o.value} value={o.id ?? o.value}>
              {o.label ??
                o.class_name ??
                o.name ??
                o.area_name ??
                o.term ??
                o.full_name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
          ) : (
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );

  // ─── StudentRow (now preserves exact typed value) ───────────────────────
  const StudentRow = ({ student, index, isLocked, onUpdate }) => {
    const [localPercentage, setLocalPercentage] = useState(
      student.marks.percentage || "",
    );
    const [localComment, setLocalComment] = useState(
      student.marks.comment || "",
    );

    const commitChanges = () => {
      // Persist the exact value the teacher typed
      setPersistedPercentages((prev) => ({
        ...prev,
        [student.id]: localPercentage,
      }));
      onUpdate(student.id, {
        percentage: localPercentage,
        comment: localComment,
      });
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitChanges();
      }
    };

    const grade = getCbcGrade(localPercentage);

    return (
      <tr className="hover:bg-gray-50/70 transition-colors">
        <td className="px-5 py-3.5 text-gray-300 text-xs">{index + 1}</td>
        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
          {student.admission_no}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">
              {student.full_name}
            </span>
          </div>
        </td>
        <td className="px-5 py-3.5">
          <input
            type="text"
            inputMode="numeric"
            value={localPercentage}
            onChange={(e) => setLocalPercentage(e.target.value)}
            onBlur={commitChanges}
            onKeyDown={handleKeyDown}
            disabled={isLocked}
            placeholder="0-100"
            className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50"
          />
        </td>
        <td className="px-5 py-3.5">
          {grade ? (
            <div
              className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg border ${grade.cls}`}
            >
              {grade.code}
            </div>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
        </td>
        <td className="px-5 py-3.5">
          <input
            type="text"
            value={localComment}
            onChange={(e) => setLocalComment(e.target.value)}
            onBlur={commitChanges}
            onKeyDown={handleKeyDown}
            disabled={isLocked}
            placeholder="Add a comment…"
            maxLength={200}
            className="w-full min-w-[180px] px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </td>
      </tr>
    );
  };

  // ─── View Tab ─────────────────────────────────────────────────────────────
  const ViewTab = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "#",
                "Adm. No.",
                "Student Name",
                "CBC Grade",
                "Teacher Comment",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s, i) => {
              const ratingCode =
                s.savedRating || percentageToCbcCode(s.marks.percentage);
              return (
                <tr key={s.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 text-gray-300 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                    {s.admission_no}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {s.full_name}
                  </td>
                  <td className="px-5 py-3.5">
                    {ratingCode ? (
                      <div
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg border ${META[ratingCode]?.badge || "bg-gray-100"}`}
                      >
                        {ratingCode}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">
                    {s.marks.comment || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
        Total: <strong className="text-gray-700">{students.length}</strong>{" "}
        students
      </div>
    </div>
  );

  // ─── Entry Tab ────────────────────────────────────────────────────────────
  const EntryTab = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-800">
            Select Assessment Criteria
          </span>
          {learningAreaName && (
            <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              {learningAreaName}
            </span>
          )}
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-5 gap-4">
          {isAdminOrRegistrar && (
            <Sel
              label="Teacher"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              options={teachers}
              placeholder="Select teacher"
            />
          )}
          <Sel
            label="Class"
            value={selClass}
            onChange={handleClassChange}
            options={classes}
            placeholder="Select class"
            busy={loadingClasses}
          />
          <Sel
            label="Term"
            value={selTerm}
            onChange={handleTermChange}
            options={terms}
            placeholder="Select term"
            busy={loadingTerms}
            disabled={!selClass}
          />
          <Sel
            label="Assessment"
            value={selAssessmentWindowId}
            onChange={handleAssessmentWindowChange}
            options={assessmentWindows.map((w) => ({
              id: w.id,
              label: w.assessment_type,
            }))}
            placeholder={selTerm ? "Select assessment" : "Select term first"}
            disabled={!selTerm}
            busy={loadingAssessmentWindows}
          />
          <Sel
            label="Subject"
            value={selSubject}
            onChange={handleSubjectChange}
            options={subjects}
            placeholder={selClass ? "Select subject" : "Select class first"}
            disabled={!selClass || !selAssessmentWindowId || loadingSubjects}
            busy={loadingSubjects}
          />
        </div>
      </div>

      {loadingStudents ? (
        <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading students…</p>
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {isLocked && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-amber-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              This assessment is <strong className="ml-1">locked</strong> and
              cannot be modified.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "#",
                    "Adm. No.",
                    "Student Name",
                    "Marks (%)",
                    "CBC Grade",
                    "Teacher Comment",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s, i) => (
                  <StudentRow
                    key={s.id}
                    student={s}
                    index={i}
                    isLocked={isLocked}
                    onUpdate={(studentId, { percentage, comment }) => {
                      setStudents((prev) =>
                        prev.map((stu) =>
                          stu.id === studentId
                            ? {
                                ...stu,
                                marks: { ...stu.marks, percentage, comment },
                              }
                            : stu,
                        ),
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Total:{" "}
              <strong className="text-gray-700">{students.length}</strong>
            </span>
            <button
              type="button"
              onClick={refreshStudents}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
      ) : selSubject && !loadingStudents ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            No students found for the selected criteria.
          </p>
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Clear
        </button>
        <button
          type="submit"
          disabled={saving || !canSave}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Marks
            </>
          )}
        </button>
      </div>
    </form>
  );

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onLogout={handleLogout}
      />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Marks Entry Sheet
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                CBC Competency-Based Assessment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-800">
              CBC Rating Scale Reference
            </span>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {LEGEND.map((r) => (
              <div
                key={r.sub}
                className={`px-3 py-2 rounded-lg border text-center ${r.cls}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs">{r.sub}</span>
                  <span className="text-xs opacity-50">{r.pts}pt</span>
                </div>
                <p className="text-xs font-medium leading-tight">{r.label}</p>
                <p className="text-xs opacity-50 mt-0.5">{r.range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 -mb-px">
            {[
              {
                id: "entry",
                icon: <Edit className="w-4 h-4" />,
                label: "Marks Entry",
              },
              {
                id: "view",
                icon: <Eye className="w-4 h-4" />,
                label: "View Saved Marks",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "entry" ? <EntryTab /> : <ViewTab />}
      </div>
    </div>
  );
};

export default MarksEntrySheet;