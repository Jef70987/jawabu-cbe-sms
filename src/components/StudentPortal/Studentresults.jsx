/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  BookOpen,
  ChevronDown,
  Loader2,
  AlertCircle,
  X,
  TrendingUp,
  Award,
  BarChart3,
  Hash,
  FileText,
  Star,
  Target,
  Bug,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── CBC META ────────────────────────────────────────────────────────
const CBC_META = {
  EE1: {
    label: "Exceptional",
    range: "90-100%",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
  },
  EE2: {
    label: "Very Good",
    range: "75-89%",
    badge: "bg-emerald-50  text-emerald-700 border-emerald-200",
    bar: "bg-emerald-400",
    text: "text-emerald-600",
  },
  ME1: {
    label: "Good",
    range: "58-74%",
    badge: "bg-sky-100     text-sky-800     border-sky-300",
    bar: "bg-sky-500",
    text: "text-sky-700",
  },
  ME2: {
    label: "Fair",
    range: "41-57%",
    badge: "bg-sky-50      text-sky-700     border-sky-200",
    bar: "bg-sky-400",
    text: "text-sky-600",
  },
  AE1: {
    label: "Needs Improvement",
    range: "31-40%",
    badge: "bg-amber-100   text-amber-800   border-amber-300",
    bar: "bg-amber-500",
    text: "text-amber-700",
  },
  AE2: {
    label: "Below Average",
    range: "21-30%",
    badge: "bg-amber-50    text-amber-700   border-amber-200",
    bar: "bg-amber-400",
    text: "text-amber-600",
  },
  BE1: {
    label: "Well Below Average",
    range: "11-20%",
    badge: "bg-rose-100    text-rose-800    border-rose-300",
    bar: "bg-rose-500",
    text: "text-rose-700",
  },
  BE2: {
    label: "Minimal",
    range: "1-10%",
    badge: "bg-rose-50     text-rose-700    border-rose-200",
    bar: "bg-rose-400",
    text: "text-rose-600",
  },
};

const GradeBadge = ({ code, size = "md" }) => {
  const meta = CBC_META[code];
  if (!meta) return <span className="text-gray-300 text-xs">—</span>;
  const sz =
    size === "lg"
      ? "px-3.5 py-1.5 text-sm font-bold"
      : "px-2.5 py-1 text-xs font-bold";
  return (
    <span
      className={`inline-flex items-center rounded-lg border ${sz} ${meta.badge}`}
    >
      {code}
    </span>
  );
};

const ProgressBar = ({ code, percentage }) => {
  const meta = CBC_META[code];
  if (!meta) return null;
  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${meta.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-9 text-right ${meta.text}`}>
        {percentage}%
      </span>
    </div>
  );
};

const Select = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      className={`
        w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-sm font-medium
        bg-white transition-all outline-none
        ${
          disabled || loading
            ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
            : "border-gray-200 text-gray-700 cursor-pointer hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
      `}
    >
      <option value="">{loading ? "Loading…" : placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────
const StudentResults = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [results, setResults] = useState(null);

  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const apiFetch = useCallback(
    async (url) => {
      try {
        console.log("📡 Fetching:", url);
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.status === 401) {
          logout();
          window.location.href = "/logout";
          return null;
        }
        const data = await res.json();
        console.log("✅ API Response:", data);
        return data;
      } catch (e) {
        console.error("❌ API Error:", e);
        return null;
      }
    },
    [getAuthHeaders, logout],
  );

  // 1. Load terms
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
      } else {
        setError("Failed to load terms");
      }
      setLoadingTerms(false);
    })();
  }, [isAuthenticated, apiFetch]);

  // 2. Load ALL assessment windows when term changes + AUTO-SELECT (this fixes the empty results)
  useEffect(() => {
    if (!selectedTerm) {
      setAssessments([]);
      setSelectedAssessment("");
      setResults(null);
      return;
    }

    (async () => {
      setLoadingAssessments(true);
      setSelectedAssessment(""); // temporary reset
      setResults(null);

      const res = await apiFetch(
        `${API_BASE_URL}/api/student/results/assessments/?term_id=${selectedTerm}`,
      );

      if (res?.success) {
        let data = res.data || [];

        // Optional polish: put active windows first (preserves original open_date order)
        data = [...data].sort((a, b) => {
          if (a.is_active && !b.is_active) return -1;
          if (!a.is_active && b.is_active) return 1;
          return 0;
        });

        setAssessments(data);

        // ── AUTO-SELECT: Prefer active window, otherwise first one ──
        if (data.length > 0) {
          const active = data.find((a) => a.is_active);
          const defaultId = active ? active.id : data[0].id;
          setSelectedAssessment(String(defaultId));
        }
      }

      setLoadingAssessments(false);
    })();
  }, [selectedTerm, apiFetch]);

  // 3. Load results whenever term or assessment changes
  useEffect(() => {
    if (!selectedTerm) return;
    (async () => {
      setLoadingResults(true);
      setError(null);
      const url = selectedAssessment
        ? `${API_BASE_URL}/api/student/results/?term_id=${selectedTerm}&window_id=${selectedAssessment}`
        : `${API_BASE_URL}/api/student/results/?term_id=${selectedTerm}`;
      const res = await apiFetch(url);

      if (res?.success && res.data) {
        setResults(res.data);
        console.log("🎉 Results loaded successfully:", {
          subjects: res.data.subjects?.length || 0,
          summary: !!res.data.summary,
          debug: res.data.debug,
        });
      } else {
        setError(res?.error || "Failed to load results");
        setResults(null);
      }
      setLoadingResults(false);
    })();
  }, [selectedTerm, selectedAssessment, apiFetch]);

  const termOptions = terms.map((t) => ({
    value: String(t.id),
    label: `${t.term} — ${t.academic_year}${t.is_current ? " (Current)" : ""}`,
  }));

  const assessmentOptions = assessments.map((a) => ({
    value: String(a.id),
    label: a.assessment_type + (a.weight ? ` (${a.weight}%)` : ""),
  }));

  const summary = results?.summary;
  const subjects = results?.subjects || [];
  const hasResults = !loadingResults && results && subjects.length > 0;
  const isEmpty =
    !loadingResults && selectedTerm && (!results || subjects.length === 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Results</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                CBC Competency-Based Assessment Report
              </p>
            </div>
          </div>
          {results && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-mono font-semibold">
                {results.admission_no}
              </span>
              <span className="text-gray-300">·</span>
              <span className="font-medium text-gray-700">
                {results.student_name}
              </span>
              <span className="text-gray-300">·</span>
              <span className="font-medium text-blue-600">
                {results.class_name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* ── FILTER BAR ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Search Criteria
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Term
              </label>
              <Select
                value={selectedTerm}
                onChange={setSelectedTerm}
                options={termOptions}
                placeholder="Select term"
                loading={loadingTerms}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Assessment
              </label>
              <Select
                value={selectedAssessment}
                onChange={setSelectedAssessment}
                options={assessmentOptions}
                placeholder={
                  selectedTerm ? "All assessments" : "Select term first"
                }
                disabled={!selectedTerm}
                loading={loadingAssessments}
              />
            </div>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loadingResults && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* ── NO TERM SELECTED ── */}
        {!loadingResults && !selectedTerm && (
          <div className="bg-white rounded-xl border border-gray-200 py-24 text-center">
            <Target className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              Select a term to view your results
            </p>
          </div>
        )}

        {/* ── EMPTY RESULTS ── */}
        {isEmpty && (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
            <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No results found for this selection
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Selected Assessment ID:{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {selectedAssessment || "None"}
              </span>
            </p>
            {results?.debug && (
              <pre className="mt-6 text-[10px] bg-gray-900 text-emerald-300 p-4 rounded-xl text-left mx-auto max-w-md overflow-auto font-mono">
                {JSON.stringify(results.debug, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        {hasResults && (
          <>
            {/* Context pills */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-blue-50 border border-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                {results.term_info?.term}
              </span>
              <span className="text-gray-300">/</span>
              <span className="bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full">
                {results.term_info?.academic_year}
              </span>
              {results.window_info?.assessment_type && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full">
                    {results.window_info.assessment_type}
                    {results.window_info.weight && (
                      <span className="ml-1 opacity-60 text-xs">
                        · {results.window_info.weight}% weight
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>

            {/* ── SUMMARY CARDS ── */}
            {summary && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overall grade */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Overall Grade
                    </p>
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <GradeBadge code={summary.overall_code} size="lg" />
                    <p
                      className={`text-xs font-medium ${CBC_META[summary.overall_code]?.text || "text-gray-500"}`}
                    >
                      {summary.overall_label}
                    </p>
                  </div>
                </div>

                {/* Average % */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Average
                    </p>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">
                    {summary.average_percentage}%
                  </p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-1.5 bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${summary.average_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Avg points */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Avg Points
                    </p>
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {summary.average_points}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">out of 8.0</p>
                </div>

                {/* Subjects */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Subjects
                    </p>
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">
                    {summary.total_subjects}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">assessed</p>
                </div>
              </div>
            )}

            {/* ── CBC SCALE REFERENCE ── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Star className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-gray-600">
                  CBC Rating Scale
                </span>
              </div>
              <div className="px-5 py-3 flex flex-wrap gap-2">
                {Object.entries(CBC_META).map(([code, meta]) => (
                  <div
                    key={code}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${meta.badge}`}
                  >
                    <span className="font-bold">{code}</span>
                    <span className="opacity-50">·</span>
                    <span>{meta.label}</span>
                    <span className="opacity-40 text-[10px] hidden sm:inline">
                      {meta.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SUBJECTS TABLE ── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <h2 className="font-semibold text-gray-800 text-sm">
                    Subject Results
                  </h2>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  {subjects.length} subjects
                </span>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-gray-100 sm:hidden">
                {subjects.map((s, i) => {
                  const meta = CBC_META[s.rating_code] || {};
                  return (
                    <div key={i} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {s.learning_area}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                            {s.learning_area_code}
                          </p>
                        </div>
                        <GradeBadge code={s.rating_code} />
                      </div>
                      <ProgressBar
                        code={s.rating_code}
                        percentage={s.percentage}
                      />
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${meta.text || ""}`}
                        >
                          {s.label}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {s.points}/8 pts
                        </span>
                      </div>
                      {s.teacher_comment && (
                        <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
                          "{s.teacher_comment}"
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Mobile overall row */}
                {summary && (
                  <div className="p-4 bg-gray-50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700 text-sm">
                        Overall
                      </span>
                      <GradeBadge code={summary.overall_code} />
                    </div>
                    <ProgressBar
                      code={summary.overall_code}
                      percentage={summary.average_percentage}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium ${CBC_META[summary.overall_code]?.text || ""}`}
                      >
                        {summary.overall_label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {summary.average_points}/8 avg
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-8">
                        #
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[200px]">
                        Performance
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Teacher Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subjects.map((s, i) => {
                      const meta = CBC_META[s.rating_code] || {};
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                            {i + 1}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800">
                              {s.learning_area}
                            </p>
                            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                              {s.learning_area_code}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <GradeBadge code={s.rating_code} />
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="font-bold text-gray-700">
                              {s.points}
                            </span>
                            <span className="text-gray-400 text-xs">/8</span>
                          </td>
                          <td className="px-5 py-4">
                            <ProgressBar
                              code={s.rating_code}
                              percentage={s.percentage}
                            />
                            <p
                              className={`text-[11px] mt-1.5 font-medium ${meta.text || "text-gray-400"}`}
                            >
                              {s.label}
                              <span className="text-gray-400 font-normal ml-1">
                                · {s.range}
                              </span>
                            </p>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 max-w-[220px]">
                            {s.teacher_comment ? (
                              <span className="italic line-clamp-2">
                                "{s.teacher_comment}"
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Summary footer */}
                  {summary && (
                    <tfoot>
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td className="px-5 py-4" />
                        <td className="px-5 py-4 font-bold text-gray-700">
                          Overall
                        </td>
                        <td className="px-5 py-4 text-center">
                          <GradeBadge code={summary.overall_code} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="font-bold text-gray-700">
                            {summary.average_points}
                          </span>
                          <span className="text-gray-400 text-xs">/8</span>
                        </td>
                        <td className="px-5 py-4" colSpan={2}>
                          <ProgressBar
                            code={summary.overall_code}
                            percentage={summary.average_percentage}
                          />
                          <p
                            className={`text-[11px] mt-1.5 font-medium ${CBC_META[summary.overall_code]?.text || ""}`}
                          >
                            {summary.overall_label}
                            <span className="text-gray-400 font-normal ml-1">
                              · {summary.total_subjects} subjects assessed
                            </span>
                          </p>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* TEMPORARY DEBUG PANEL - ENHANCED */}
      {results && (
        <div className="fixed bottom-6 left-6 bg-white border border-amber-300 rounded-2xl p-4 shadow-2xl max-w-xs text-[10px] font-mono z-50">
          <div className="flex items-center gap-2 text-amber-600 mb-3">
            <Bug className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest">
              Debug Panel
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div>
              Selected Window ID:{" "}
              <span className="font-semibold text-blue-600">
                {selectedAssessment}
              </span>
            </div>
            <div>
              Subjects returned:{" "}
              <span className="font-semibold text-emerald-600">
                {subjects.length}
              </span>
            </div>
            {results.debug && (
              <>
                <div className="pt-2 border-t border-amber-200 mt-2 text-[9px]">
                  <div>
                    base_ratings_for_term:{" "}
                    <span className="text-rose-600">
                      {results.debug.base_ratings_for_term}
                    </span>
                  </div>
                  <div>
                    term_fallback_used:{" "}
                    <span className="font-semibold">
                      {results.debug.term_fallback_used ? "✅ YES" : "No"}
                    </span>
                  </div>
                  <div>
                    total_ratings_ever:{" "}
                    <span className="text-purple-600">
                      {results.debug.total_ratings_for_student_ever}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* ERROR TOAST */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
