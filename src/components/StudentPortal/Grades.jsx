import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { API_BASE_URL } from "../../services/apiBase";
import {
  Award,
  BookOpen,
  Hash,
  ChevronDown,
  Loader2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  X,
  FileText,
  Percent,
} from "lucide-react";

const LEGEND_4POINT = [
  {
    sub: "EE",
    pts: 4,
    label: "Exceeding Expectations",
    range: "90-100%",
    cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    sub: "ME",
    pts: 3,
    label: "Meeting Expectations",
    range: "75-89%",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    sub: "AE",
    pts: 2,
    label: "Approaching Expectations",
    range: "58-74%",
    cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    sub: "BE",
    pts: 1,
    label: "Below Expectations",
    range: "0-57%",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
];

const LEGEND_8POINT = [
  {
    sub: "EE1",
    pts: 8,
    label: "Exceptional",
    range: "90-100%",
    cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    sub: "EE2",
    pts: 7,
    label: "Very Good",
    range: "75-89%",
    cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    sub: "ME1",
    pts: 6,
    label: "Good",
    range: "58-74%",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    sub: "ME2",
    pts: 5,
    label: "Fair",
    range: "41-57%",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    sub: "AE1",
    pts: 4,
    label: "Needs Improvement",
    range: "31-40%",
    cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    sub: "AE2",
    pts: 3,
    label: "Below Average",
    range: "21-30%",
    cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    sub: "BE1",
    pts: 2,
    label: "Well Below Average",
    range: "11-20%",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
  {
    sub: "BE2",
    pts: 1,
    label: "Minimal",
    range: "1-10%",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
];

const META = {
  EE1: {
    label: "Exceptional",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "bg-emerald-600",
  },
  EE2: {
    label: "Very Good",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "bg-emerald-500",
  },
  ME1: {
    label: "Good",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    bar: "bg-blue-600",
  },
  ME2: {
    label: "Fair",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    bar: "bg-blue-400",
  },
  AE1: {
    label: "Needs Improvement",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bar: "bg-yellow-600",
  },
  AE2: {
    label: "Below Average",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bar: "bg-yellow-400",
  },
  BE1: {
    label: "Well Below Average",
    badge: "bg-red-100 text-red-800 border-red-200",
    bar: "bg-red-600",
  },
  BE2: {
    label: "Minimal",
    badge: "bg-red-100 text-red-800 border-red-200",
    bar: "bg-red-400",
  },
  EE: {
    label: "Exceeding Expectations",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "bg-emerald-600",
  },
  ME: {
    label: "Meeting Expectations",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    bar: "bg-blue-600",
  },
  AE: {
    label: "Approaching Expectations",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bar: "bg-yellow-500",
  },
  BE: {
    label: "Below Expectations",
    badge: "bg-red-100 text-red-800 border-red-200",
    bar: "bg-red-600",
  },
};

const GRADE_TO_POINTS = {
  EE1: 8,
  EE2: 7,
  ME1: 6,
  ME2: 5,
  AE1: 4,
  AE2: 3,
  BE1: 2,
  BE2: 1,
  EE: 4,
  ME: 3,
  AE: 2,
  BE: 1,
};

function isFourPointScale(gradeLevel) {
  const gl = String(gradeLevel || "")
    .toLowerCase()
    .trim();
  return ["pp1", "pp2", "1", "2", "3", "4", "5", "6"].includes(gl);
}

function percentageToGrade(pct, gradeLevel) {
  if (pct === null || pct === undefined || isNaN(pct)) return null;
  const n = parseFloat(pct);
  if (isFourPointScale(gradeLevel)) {
    if (n >= 90) return "EE";
    if (n >= 75) return "ME";
    if (n >= 58) return "AE";
    return "BE";
  }
  if (n >= 90) return "EE1";
  if (n >= 75) return "EE2";
  if (n >= 58) return "ME1";
  if (n >= 41) return "ME2";
  if (n >= 31) return "AE1";
  if (n >= 21) return "AE2";
  if (n >= 11) return "BE1";
  return "BE2";
}

// ── Subject table rows ────────────────────────────────────────────────────────
const SubjectRow = ({ sub }) => {
  const meta = sub.grade_code ? META[sub.grade_code] : null;
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="font-medium text-gray-800">{sub.learning_area}</div>
        {sub.exam_title && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            {sub.exam_title}
          </div>
        )}
      </td>
      <td className="px-5 py-3.5 text-center">
        {meta ? (
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-bold border ${meta.badge}`}
          >
            {sub.grade_code}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className="font-bold text-gray-700">{sub.points}</span>
        <span className="text-gray-400 text-xs">/8</span>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className="text-sm font-semibold text-gray-700">
          {sub.percentage > 0 ? `${sub.percentage.toFixed(1)}%` : "—"}
        </span>
      </td>
      <td className="px-5 py-3.5 hidden sm:table-cell">
        {meta && sub.percentage > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden min-w-[80px]">
              <div
                className={`h-1.5 transition-all duration-500 ${meta.bar}`}
                style={{ width: `${Math.min(sub.percentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-32 shrink-0">
              {meta.label}
            </span>
          </div>
        )}
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-500 max-w-[200px]">
        <span className="line-clamp-2">{sub.teacher_comment || "—"}</span>
      </td>
    </tr>
  );
};

// Section divider row inside the table
const SectionHeader = ({ label, count, color }) => (
  <tr>
    <td colSpan={6} className={`px-5 py-2 ${color} border-y border-gray-200`}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs opacity-60">
          · {count} subject{count !== 1 ? "s" : ""}
        </span>
      </div>
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const Grades = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [windows, setWindows] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState("");
  const [results, setResults] = useState(null);

  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const lastFetchRef = useRef({ key: null });

  const apiFetch = useCallback(
    async (url) => {
      try {
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.status === 401) {
          logout();
          window.location.href = "/logout";
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.error("[API Error]", url, e);
        return null;
      }
    },
    [getAuthHeaders, logout],
  );

  const fetchResults = useCallback(
    async (profileId, termId, windowId = "") => {
      if (!profileId || !termId) return;
      const key = `${termId}|${windowId}`;
      if (lastFetchRef.current.key === key) return;
      lastFetchRef.current.key = key;

      setLoadingResults(true);
      setError(null);
      const url =
        `${API_BASE_URL}/student/results/preview/` +
        `?student_id=${profileId}&term_id=${termId}&window_id=${windowId}`;
      const res = await apiFetch(url);
      if (res?.success) setResults(res.data);
      else {
        setError(res?.error || "Failed to load results");
        setResults(null);
      }
      setLoadingResults(false);
    },
    [apiFetch],
  );

  const fetchWindowsAndResults = useCallback(
    async (profileId, termId) => {
      if (!profileId || !termId) return;
      setLoadingWindows(true);
      setWindows([]);
      setSelectedWindow("");
      setResults(null);
      lastFetchRef.current.key = null;

      const res = await apiFetch(
        `${API_BASE_URL}/student/results/assessments/?term_id=${termId}`,
      );
      let firstWindowId = "";
      if (res?.success && res.data?.length > 0) {
        setWindows(res.data);
        // Default to "All Assessments" (empty string) so everything shows
        firstWindowId = "";
        setSelectedWindow("");
      }
      setLoadingWindows(false);
      await fetchResults(profileId, termId, firstWindowId);
    },
    [apiFetch, fetchResults],
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoadingInit(true);
      const [profileRes, termsRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/student/profile/`),
        apiFetch(`${API_BASE_URL}/student/results/terms/`),
      ]);
      if (cancelled) return;
      const resolvedProfile = profileRes?.success ? profileRes.data : null;
      const resolvedTerms =
        termsRes?.success && termsRes.data?.length > 0 ? termsRes.data : [];
      setProfile(resolvedProfile);
      setTerms(resolvedTerms);
      const currentTerm =
        resolvedTerms.find((t) => t.is_current) || resolvedTerms[0];
      if (currentTerm && resolvedProfile?.id) {
        const termId = String(currentTerm.id);
        setSelectedTerm(termId);
        await fetchWindowsAndResults(resolvedProfile.id, termId);
      }
      setLoadingInit(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, apiFetch, fetchWindowsAndResults]);

  const handleTermChange = useCallback(
    (termId) => {
      if (termId === selectedTerm) return;
      setSelectedTerm(termId);
      if (profile?.id) fetchWindowsAndResults(profile.id, termId);
    },
    [selectedTerm, profile, fetchWindowsAndResults],
  );

  const handleWindowChange = useCallback(
    (windowId) => {
      if (windowId === selectedWindow) return;
      setSelectedWindow(windowId);
      if (profile?.id && selectedTerm) {
        lastFetchRef.current.key = null;
        fetchResults(profile.id, selectedTerm, windowId);
      }
    },
    [selectedWindow, profile, selectedTerm, fetchResults],
  );

  const handleRefresh = useCallback(() => {
    if (!profile?.id || !selectedTerm) return;
    lastFetchRef.current.key = null;
    fetchResults(profile.id, selectedTerm, selectedWindow);
  }, [profile, selectedTerm, selectedWindow, fetchResults]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const preview = results || {};
  const learningAreas = preview.learningAreas || [];
  const gradeLevelForScale = learningAreas[0]?.gradeLevel || "";

  const subjects = learningAreas.map((la) => {
    const rawPct = parseFloat(la.percentage) || 0;
    const gradeLevel = la.gradeLevel || "";
    const gradeCode =
      la.score && META[la.score]
        ? la.score
        : percentageToGrade(rawPct, gradeLevel);
    const points =
      la.points || (gradeCode ? GRADE_TO_POINTS[gradeCode] : 0) || 0;
    return {
      learning_area: la.name,
      exam_title: la.examTitle || "",
      exam_id: la.examId || "",
      grade_code: gradeCode,
      points,
      percentage: rawPct,
      teacher_comment: la.teacherComment || "",
      is_teacher_assessment: la.isTeacherAssessment || false,
    };
  });

  // Split for grouped display
  const examSubjects = subjects.filter((s) => !s.is_teacher_assessment);
  const assessmentSubjects = subjects.filter((s) => s.is_teacher_assessment);

  // Overall stats across ALL subjects
  const validPcts = subjects
    .filter((s) => s.percentage > 0)
    .map((s) => s.percentage);
  const average_percentage = validPcts.length
    ? Math.round(validPcts.reduce((a, b) => a + b, 0) / validPcts.length)
    : null;

  const average_points = subjects.length
    ? (subjects.reduce((a, b) => a + b.points, 0) / subjects.length).toFixed(1)
    : null;

  const overall_code =
    average_percentage != null
      ? percentageToGrade(average_percentage, gradeLevelForScale)
      : null;
  const overallMeta = overall_code ? META[overall_code] : null;

  const selectedTermObj = terms.find((t) => String(t.id) === selectedTerm);
  const studentName = profile?.full_name || preview.studentName || "—";
  const admissionNo = profile?.admission_no || preview.admissionNo || "—";
  const className = profile?.current_class_name || preview.className || "—";
  const activeLegend = isFourPointScale(gradeLevelForScale)
    ? LEGEND_4POINT
    : LEGEND_8POINT;

  // Whether we are in "all assessments" view (no specific window selected)
  const isAllView = !selectedWindow;

  const TABLE_HEAD = (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="px-5 py-3.5 text-left   text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          SUBJECT
        </th>
        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          GRADE
        </th>
        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          POINTS
        </th>
        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          MARKS %
        </th>
        <th className="px-5 py-3.5 text-left   text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
          PERFORMANCE
        </th>
        <th className="px-5 py-3.5 text-left   text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
          TEACHER COMMENT
        </th>
      </tr>
    </thead>
  );

  if (loadingInit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-green-700 border-b border-green-800 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <Award className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Report Card</h1>
              <p className="text-xs text-green-100 mt-0.5">
                CBE Competency-Based Performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {terms.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTerm}
                  onChange={(e) => handleTermChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-green-600 text-sm bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-white"
                >
                  {terms.map((t) => (
                    <option key={t.id} value={String(t.id)}>
                      {t.term} · {t.academic_year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
            {windows.length > 0 && (
              <div className="relative">
                <select
                  value={selectedWindow}
                  onChange={(e) => handleWindowChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-green-600 text-sm bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-white"
                >
                  <option value="">All Assessments</option>

                  {windows.some((w) => w.is_teacher_assessment) && (
                    <optgroup label="Assessments">
                      {windows
                        .filter((w) => w.is_teacher_assessment)
                        .map((w) => (
                          <option key={w.id} value={String(w.id)}>
                            {w.assessment_type}
                          </option>
                        ))}
                    </optgroup>
                  )}

                  {windows.some((w) => !w.is_teacher_assessment) && (
                    <optgroup label="Exams">
                      {windows
                        .filter((w) => !w.is_teacher_assessment)
                        .map((w) => (
                          <option key={w.id} value={String(w.id)}>
                            {w.assessment_type}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loadingResults || !selectedTerm}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingResults ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Legend */}
        <div className="bg-white border border-gray-300">
          <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
            <Award className="w-4 h-4 text-green-700" />
            <span className="text-sm font-semibold text-gray-800">
              CBC Rating Scale Reference
            </span>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeLegend.map((r) => (
              <div
                key={r.sub}
                className={`px-3 py-2 border text-center ${r.cls}`}
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

        {/* No terms */}
        {terms.length === 0 ? (
          <div className="bg-white border border-gray-300 text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No results available yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Results will appear here once your teacher has published marks.
            </p>
          </div>
        ) : loadingWindows || loadingResults ? (
          <div className="bg-white border border-gray-300 flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : results ? (
          <>
            {/* Student info */}
            <div className="bg-white border border-gray-300 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    STUDENT
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {studentName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    ADMISSION NO.
                  </p>
                  <p className="font-mono font-semibold text-gray-900 text-sm flex items-center gap-1">
                    <Hash className="w-3 h-3 text-gray-400" />
                    {admissionNo}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    CLASS
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {className}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    TERM
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedTermObj
                      ? `${selectedTermObj.term} · ${selectedTermObj.academic_year}`
                      : preview.term
                        ? `${preview.term} · ${preview.academicYear || ""}`
                        : "—"}
                  </p>
                </div>
              </div>

              {overallMeta && average_percentage != null && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-gray-500">
                    Overall Performance
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-40 bg-gray-200 overflow-hidden">
                      <div
                        className={`h-2 transition-all duration-700 ${overallMeta.bar}`}
                        style={{ width: `${average_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {average_percentage}%
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-bold border ${overallMeta.badge}`}
                    >
                      {overall_code} · {overallMeta.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-300 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    OVERALL %
                  </p>
                  <Percent className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-4xl font-bold text-blue-600">
                  {average_percentage != null ? `${average_percentage}%` : "—%"}
                </span>
                {overallMeta && average_percentage != null && (
                  <div className="h-2 bg-gray-100 mt-4 overflow-hidden">
                    <div
                      className={`h-2 transition-all duration-700 ${overallMeta.bar}`}
                      style={{ width: `${average_percentage}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-300 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    AVERAGE POINTS
                  </p>
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {average_points ?? "—"}
                </div>
                <p className="text-xs text-gray-400 mt-1">out of 8.0</p>
              </div>

              <div className="bg-white border border-gray-300 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    SUBJECTS ASSESSED
                  </p>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {subjects.length || "—"}
                </div>
                <p className="text-xs text-gray-400 mt-1">learning areas</p>
              </div>
            </div>

            {/* Subject Performance table */}
            {subjects.length > 0 ? (
              <div className="bg-white border border-gray-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <h2 className="font-semibold text-gray-800">
                      Subject Performance
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2.5 py-1 border border-gray-200">
                    {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    {TABLE_HEAD}
                    <tbody className="divide-y divide-gray-100">
                      {isAllView ? (
                        <>
                          {/* Exams section */}
                          {examSubjects.length > 0 &&
                            assessmentSubjects.length > 0 && (
                              <SectionHeader
                                label="Exams"
                                count={examSubjects.length}
                                color="bg-blue-50 text-blue-700"
                              />
                            )}
                          {examSubjects.map((sub, idx) => (
                            <SubjectRow key={`exam-${idx}`} sub={sub} />
                          ))}

                          {/* Assessments section */}
                          {assessmentSubjects.length > 0 &&
                            examSubjects.length > 0 && (
                              <SectionHeader
                                label="Assessments"
                                count={assessmentSubjects.length}
                                color="bg-emerald-50 text-emerald-700"
                              />
                            )}
                          {assessmentSubjects.map((sub, idx) => (
                            <SubjectRow key={`ass-${idx}`} sub={sub} />
                          ))}
                        </>
                      ) : (
                        // Single window selected — flat list, no section headers
                        subjects.map((sub, idx) => (
                          <SubjectRow key={`single-${idx}`} sub={sub} />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-300 text-center py-16">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-gray-400 text-sm mt-1">
                  No marks have been entered for the selected term
                  {selectedWindow ? "/assessment" : ""} yet.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-300 text-center py-20">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No results available</p>
            <p className="text-gray-400 text-sm mt-1">
              No data found for the selected term
            </p>
          </div>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 shadow-lg flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-white/70 hover:text-white ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Grades;
