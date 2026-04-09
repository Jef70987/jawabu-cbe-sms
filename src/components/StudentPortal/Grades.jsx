/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Authentication/AuthContext";
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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── CBC 8-LEVEL SCALE ─────────────────────────────
const LEGEND = [
  { sub: "EE1", pts: 8, label: "Exceptional", range: "90-100%", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { sub: "EE2", pts: 7, label: "Very Good", range: "75-89%", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { sub: "ME1", pts: 6, label: "Good", range: "58-74%", cls: "bg-sky-50 text-sky-800 border-sky-200" },
  { sub: "ME2", pts: 5, label: "Fair", range: "41-57%", cls: "bg-sky-50 text-sky-700 border-sky-100" },
  { sub: "AE1", pts: 4, label: "Needs Improvement", range: "31-40%", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  { sub: "AE2", pts: 3, label: "Below Average", range: "21-30%", cls: "bg-amber-50 text-amber-700 border-amber-100" },
  { sub: "BE1", pts: 2, label: "Well Below Average", range: "11-20%", cls: "bg-rose-50 text-rose-800 border-rose-200" },
  { sub: "BE2", pts: 1, label: "Minimal", range: "1-10%", cls: "bg-rose-50 text-rose-700 border-rose-100" },
];

const META = {
  EE1: { label: "Exceptional", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", bar: "bg-emerald-500" },
  EE2: { label: "Very Good", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400" },
  ME1: { label: "Good", badge: "bg-sky-100 text-sky-800 border-sky-300", bar: "bg-sky-500" },
  ME2: { label: "Fair", badge: "bg-sky-100 text-sky-700 border-sky-200", bar: "bg-sky-400" },
  AE1: { label: "Needs Improvement", badge: "bg-amber-100 text-amber-800 border-amber-300", bar: "bg-amber-500" },
  AE2: { label: "Below Average", badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-400" },
  BE1: { label: "Well Below Average", badge: "bg-rose-100 text-rose-800 border-rose-300", bar: "bg-rose-500" },
  BE2: { label: "Minimal", badge: "bg-rose-100 text-rose-700 border-rose-200", bar: "bg-rose-400" },
};

const CODE_TO_PCT = { EE1: 95, EE2: 82, ME1: 66, ME2: 49, AE1: 35, AE2: 25, BE1: 15, BE2: 5 };

// ─── Direct points → exact teacher rating ───
const pointsToCbcCode = (points) => {
  if (points === null || points === undefined) return null;
  const p = Math.round(points);
  const map = {
    8: "EE1", 7: "EE2", 6: "ME1", 5: "ME2",
    4: "AE1", 3: "AE2", 2: "BE1", 1: "BE2",
  };
  return map[p] || null;
};

const Grades = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [windows, setWindows] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState("");
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const prevWindowRef = useRef("");

  const apiFetch = useCallback(async (url) => {
    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) {
        logout();
        window.location.href = "/logout";
        return null;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      console.log(`[DEBUG] API ${url} →`, json);
      return json;
    } catch (e) {
      console.error("[API Error]", e);
      return null;
    }
  }, [getAuthHeaders, logout]);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingProfile(true);
    const res = await apiFetch(`${API_BASE_URL}/api/student/profile/`);
    if (res?.success) setProfile(res.data);
    setLoadingProfile(false);
  }, [apiFetch, isAuthenticated]);

  const fetchResults = useCallback(async (termId, windowId = "") => {
    if (!profile?.id) return;
    setLoadingResults(true);
    setError(null);

    let url = `${API_BASE_URL}/api/student/results/preview/?student_id=${profile.id}&term_id=${termId}&window_id=${windowId || ''}`;
    
    const res = await apiFetch(url);
    if (res?.success) {
      console.log("[DEBUG] PREVIEW DATA RECEIVED →", res.data);
      setResults(res.data);
    } else {
      setError(res?.error || "Failed to load results");
      setResults(null);
    }
    setLoadingResults(false);
  }, [apiFetch, profile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      setLoadingTerms(true);
      const res = await apiFetch(`${API_BASE_URL}/api/student/results/terms/`);
      if (res?.success) {
        const list = res.data || [];
        setTerms(list);
        const current = list.find((t) => t.is_current) || list[0];
        if (current) setSelectedTerm(String(current.id));
      }
      setLoadingTerms(false);
    })();
    fetchProfile();
  }, [isAuthenticated, apiFetch, fetchProfile]);

  useEffect(() => {
    if (!selectedTerm) return;
    setWindows([]);
    setSelectedWindow("");
    setResults(null);
    (async () => {
      const res = await apiFetch(`${API_BASE_URL}/api/student/results/assessments/?term_id=${selectedTerm}`);
      if (res?.success) {
        const list = res.data || [];
        setWindows(list);
        const first = list.length > 0 ? String(list[0].id) : "";
        setSelectedWindow(first);
        await fetchResults(selectedTerm, first);
      }
    })();
  }, [selectedTerm, apiFetch, fetchResults]);

  useEffect(() => {
    if (!selectedTerm || selectedWindow === prevWindowRef.current) return;
    prevWindowRef.current = selectedWindow;
    fetchResults(selectedTerm, selectedWindow);
  }, [selectedWindow, selectedTerm, fetchResults]);

  // ── FIXED DERIVED VALUES ─────────────────────
  const preview = results || {};
  const learningAreas = preview.learningAreas || [];

  // 1. Calculate each subject's displayed percentage (exact midpoint the teacher assigned)
  const subjectPercentages = learningAreas.map((la) => {
    const code = la.score || pointsToCbcCode(la.points);
    return code ? CODE_TO_PCT[code] : 0;
  });

  // 2. Overall % = true average of the displayed subject percentages
  //    → When 1 subject → overall % = exactly that subject's % (15% for BE1)
  const average_percentage = subjectPercentages.length
    ? Math.round(subjectPercentages.reduce((a, b) => a + b, 0) / subjectPercentages.length)
    : null;

  // Average points (still used for overall grade badge)
  const average_points = learningAreas.length
    ? (learningAreas.reduce((a, b) => a + (b.points || 0), 0) / learningAreas.length).toFixed(1)
    : null;

  const summary = {
    average_percentage,
    average_points,
    total_subjects: learningAreas.length,
    overall_code: pointsToCbcCode(
      learningAreas.length
        ? learningAreas.reduce((a, b) => a + (b.points || 0), 0) / learningAreas.length
        : null
    ),
  };

  const overallMeta = summary.overall_code ? META[summary.overall_code] : null;

  const selectedTermObj = terms.find((t) => String(t.id) === selectedTerm);

  // ── SUBJECTS (unchanged - uses exact teacher rating) ─────────────────────
  const subjects = learningAreas.map((la) => {
    const code = la.score || pointsToCbcCode(la.points);
    const meta = code ? META[code] : null;
    return {
      learning_area: la.name,
      learning_area_code: la.code || "",
      points: la.points || 0,
      percentage: code ? CODE_TO_PCT[code] : 0,
      rating_code: code,
      teacher_comment: la.teacherComment || "",
    };
  });

  const studentName = profile?.full_name || preview.studentName || "—";
  const admissionNo = profile?.admission_no || preview.admissionNo || "—";
  const className = profile?.current_class_name || preview.className || "—";

  if (loadingTerms || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER + FILTERS */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Report Card</h1>
              <p className="text-xs text-gray-400 mt-0.5">CBE Competency-Based Performance</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select 
                value={selectedTerm} 
                onChange={(e) => setSelectedTerm(e.target.value)} 
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              >
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.term} · {t.academic_year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {windows.length > 0 && (
              <div className="relative">
                <select 
                  value={selectedWindow} 
                  onChange={(e) => setSelectedWindow(e.target.value)} 
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >
                  <option value="">All Windows</option>
                  {windows.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.assessment_type} {w.weight_percentage ? `(${w.weight_percentage}%)` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            <button 
              onClick={() => fetchResults(selectedTerm, selectedWindow)} 
              disabled={loadingResults || !selectedTerm} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingResults ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* LEGEND */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-800">CBC Rating Scale Reference</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {LEGEND.map((r) => (
              <div key={r.sub} className={`px-3 py-2 rounded-lg border text-center ${r.cls}`}>
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

        {!selectedTerm ? (
          <div className="bg-white rounded-xl border border-gray-200 text-center py-20">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Select a term to view your results</p>
          </div>
        ) : loadingResults ? (
          <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : results ? (
          <>
            {/* STUDENT INFO HEADER */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">STUDENT</p>
                  <p className="font-semibold text-gray-900 text-sm">{studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ADMISSION NO.</p>
                  <p className="font-mono font-semibold text-gray-900 text-sm flex items-center gap-1">
                    <Hash className="w-3 h-3 text-gray-400" />{admissionNo}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CLASS</p>
                  <p className="font-semibold text-gray-900 text-sm">{className}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TERM</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedTermObj 
                      ? `${selectedTermObj.term} · ${selectedTermObj.academic_year}` 
                      : (preview.term ? `${preview.term} · ${preview.academicYear || ""}` : "—")
                    }
                  </p>
                </div>
              </div>

              {overallMeta && summary.average_percentage != null && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-gray-500">Overall Performance</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${overallMeta.bar}`} 
                        style={{ width: `${summary.average_percentage}%` }} 
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{summary.average_percentage}%</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${overallMeta.badge}`}>
                      {summary.overall_code} · {META[summary.overall_code]?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">OVERALL %</p>
                  <Percent className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-4xl font-bold text-blue-600">
                  {summary.average_percentage != null ? `${summary.average_percentage}%` : "—%"}
                </span>
                {overallMeta && summary.average_percentage != null && (
                  <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${overallMeta.bar}`} 
                      style={{ width: `${summary.average_percentage}%` }} 
                    />
                  </div>
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">AVERAGE POINTS</p>
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-4xl font-bold text-indigo-600">{summary.average_points || "—"}</div>
                <p className="text-xs text-gray-400 mt-1">out of 8.0</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SUBJECTS ASSESSED</p>
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-4xl font-bold text-emerald-600">{summary.total_subjects ?? "—"}</div>
                <p className="text-xs text-gray-400 mt-1">learning areas</p>
              </div>
            </div>

            {/* SUBJECTS TABLE */}
            {subjects.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">Subject Performance</h2>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">{subjects.length} subjects</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">SUBJECT</th>
                        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">GRADE</th>
                        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">POINTS</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">PERFORMANCE</th>
                        <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">%</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">TEACHER COMMENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjects.map((sub, idx) => {
                        const code = sub.rating_code;
                        const meta = code ? META[code] : null;
                        const pct = sub.percentage;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="font-medium text-gray-800">{sub.learning_area}</div>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              {meta ? (
                                <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${meta.badge}`}>
                                  {code}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="font-bold text-gray-700">{sub.points}</span>
                              <span className="text-gray-400 text-xs">/8</span>
                            </td>
                            <td className="px-5 py-3.5 hidden sm:table-cell">
                              {meta && (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-500 ${meta.bar}`} 
                                      style={{ width: `${pct}%` }} 
                                    />
                                  </div>
                                  <span className="text-xs text-gray-400 w-28 shrink-0">{meta.label}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                              <span className="text-sm font-semibold text-gray-600">{sub.percentage}%</span>
                            </td>
                            <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-500 max-w-[200px]">
                              <span className="line-clamp-2">{sub.teacher_comment || "—"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-gray-400 text-sm mt-1">No marks have been entered for the selected term{selectedWindow ? "/window" : ""} yet.</p>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* ERROR TOAST */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Grades;