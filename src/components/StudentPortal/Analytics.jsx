/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award, Brain, BarChart3, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  CBC GRADE MAPPING
// ─────────────────────────────────────────────────────────────────
const CBC_META = {
  EE1: { label: "Exceptional",        badge: "bg-emerald-100 text-emerald-800 border-emerald-300", bar: "bg-emerald-500", hex: "#10b981" },
  EE2: { label: "Very Good",          badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400", hex: "#34d399" },
  ME1: { label: "Good",               badge: "bg-sky-100 text-sky-800 border-sky-300",             bar: "bg-sky-500",    hex: "#0ea5e9" },
  ME2: { label: "Fair",               badge: "bg-sky-100 text-sky-700 border-sky-200",             bar: "bg-sky-400",    hex: "#38bdf8" },
  AE2: { label: "Needs Improvement",  badge: "bg-amber-100 text-amber-800 border-amber-300",       bar: "bg-amber-500",  hex: "#f59e0b" },
  AE1: { label: "Below Average",      badge: "bg-amber-100 text-amber-700 border-amber-200",       bar: "bg-amber-400",  hex: "#fbbf24" },
  BE2: { label: "Well Below Average", badge: "bg-rose-100 text-rose-800 border-rose-300",          bar: "bg-rose-500",   hex: "#f43f5e" },
  BE1: { label: "Minimal",            badge: "bg-rose-100 text-rose-700 border-rose-200",          bar: "bg-rose-400",   hex: "#fb7185" },
};

const percentageToCbcCode = (perc) => {
  if (perc === null || perc === undefined) return null;
  const p = parseFloat(perc);
  if (isNaN(p)) return null;
  if (p >= 90) return "EE1";
  if (p >= 75) return "EE2";
  if (p >= 60) return "ME1";
  if (p >= 40) return "ME2";
  if (p >= 30) return "AE2";
  if (p >= 20) return "AE1";
  if (p >= 10) return "BE2";
  return "BE1";
};

const getCbcGrade = (perc) => {
  const code = percentageToCbcCode(perc);
  return code ? { code, ...CBC_META[code] } : null;
};

// ─────────────────────────────────────────────────────────────────
//  API HELPER
// ─────────────────────────────────────────────────────────────────
const TOKEN_KEYS = ["access_token", "accessToken", "token", "authToken", "jwt", "access"];
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthToken() {
  for (const key of TOKEN_KEYS) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }
  return null;
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}/api${cleanPath}`;
  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const bodyText = await res.text();
    const isHtml = bodyText.trim().startsWith("<");
    if (isHtml) throw new Error(`Server returned HTML instead of JSON (HTTP ${res.status})`);
    throw new Error(`Unexpected response type "${contentType}" from ${url}`);
  }
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || json.detail || `HTTP ${res.status}`);
  return json.data !== undefined ? json.data : json;
}

const stripEmojis = (text) =>
  text ? text.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "").trim() : "";

// ─────────────────────────────────────────────────────────────────
//  CLIENT-SIDE VALUE INJECTOR
// ─────────────────────────────────────────────────────────────────
function injectAiValues(text, { overallPercentage, overallGrade, averagePoints, studentName, term }) {
  if (!text) return text;
  let t = text;
  const replacements = {
    overall_percentage: overallPercentage, overallPercentage,
    overall_grade: overallGrade, overallGrade,
    avg_points: averagePoints, averagePoints,
    student_name: studentName, studentName,
    term,
  };
  for (const [key, val] of Object.entries(replacements)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`\\{${escaped}\\}`, "gi"), String(val ?? ""));
    t = t.replace(new RegExp(`\\[${escaped}\\]`, "gi"), String(val ?? ""));
  }
  t = t.replace(/\bof\s+%/g, `of ${overallPercentage}%`);
  t = t.replace(/percentage\s+of\s+%/gi, `percentage of ${overallPercentage}%`);
  t = t.replace(/\[(?:X|VALUE|PERCENTAGE|NUMBER|\d*)\]%/gi, `${overallPercentage}%`);
  t = t.replace(/a perfect\s+\.\s+out\s+of(?:\s+\d+)?\s+points/gi, `a score of ${averagePoints} out of 8 points`);
  t = t.replace(/scored?\s+\.\s+out\s+of/gi, `scored ${averagePoints} out of`);
  return t;
}

// ─────────────────────────────────────────────────────────────────
//  SECTION ORDER — must match backend SECTION_ORDER exactly
// ─────────────────────────────────────────────────────────────────
const SECTION_ORDER = [
  "Your Strengths",
  "Areas for Improvement",
  "My Next Steps",
  "What You Can Do Better",
  "Grade 10 Pathway Recommendation",
];

function orderSections(raw) {
  const ordered = {};
  for (const title of SECTION_ORDER) {
    if (title in raw) ordered[title] = raw[title];
  }
  // Append any unexpected sections the AI added
  for (const [k, v] of Object.entries(raw)) {
    if (!(k in ordered)) ordered[k] = v;
  }
  return ordered;
}

// ─────────────────────────────────────────────────────────────────
//  FORMAT AI MARKDOWN → HTML  (all styles inline — no <style> tag)
// ─────────────────────────────────────────────────────────────────
const formatAiContent = (text) => {
  if (!text) return "";
  let processed = stripEmojis(text);
  processed = processed.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Strip any stray ## headings — the section card header already shows the title
  processed = processed.replace(/^#{1,3}[^#\n]*\n?/gm, "");
  processed = processed.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="font-weight:600;color:#111827">$1</strong>',
  );
  processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>");

  const lines = processed.split("\n");
  let inList = false, listType = null;
  const result = [];

  for (const line of lines) {
    const ulMatch = line.match(/^\s*[-*•]\s+(.*)/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
        result.push('<ul style="margin:8px 0 12px 20px;display:flex;flex-direction:column;gap:7px;list-style:disc">');
        inList = true; listType = "ul";
      }
      result.push(`<li style="color:#374151;line-height:1.75;padding-left:4px">${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) result.push(listType === "ul" ? "</ul>" : "</ol>");
        result.push('<ol style="margin:8px 0 12px 20px;display:flex;flex-direction:column;gap:7px;list-style:decimal">');
        inList = true; listType = "ol";
      }
      result.push(`<li style="color:#374151;line-height:1.75;padding-left:4px">${olMatch[1]}</li>`);
    } else {
      if (inList) { result.push(listType === "ol" ? "</ol>" : "</ul>"); inList = false; listType = null; }
      if (line.trim())
        result.push(`<p style="margin-bottom:10px;color:#374151;line-height:1.75">${line.trim()}</p>`);
    }
  }
  if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
  return result.join("");
};

// ─────────────────────────────────────────────────────────────────
//  AI SECTION — coloured header band + body  (all inline styles)
// ─────────────────────────────────────────────────────────────────
const SECTION_STYLES = {
  "your strengths": {
    headBg: "#EEEDFE", iconBg: "#CECBF6", titleColor: "#3730A3", borderColor: "#A5B4FC",
    iconPath: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  "areas for improvement": {
    headBg: "#FEF3C7", iconBg: "#FDE68A", titleColor: "#92400E", borderColor: "#FCD34D",
    iconPath: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  },
  "my next steps": {
    headBg: "#ECFDF5", iconBg: "#A7F3D0", titleColor: "#065F46", borderColor: "#6EE7B7",
    iconPath: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3",
  },
  "what you can do better": {
    headBg: "#FFF7ED", iconBg: "#FED7AA", titleColor: "#9A3412", borderColor: "#FDBA74",
    iconPath: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  "grade 10 pathway recommendation": {
    headBg: "#EFF6FF", iconBg: "#BFDBFE", titleColor: "#1E3A8A", borderColor: "#93C5FD",
    iconPath: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
};

const DEFAULT_STYLE = {
  headBg: "#F3F4F6", iconBg: "#E5E7EB", titleColor: "#1F2937", borderColor: "#D1D5DB",
  iconPath: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
};

const AiSection = ({ title, content, aiMeta }) => {
  const cleanTitle = stripEmojis(title);
  const key = cleanTitle.toLowerCase().trim();
  const s = SECTION_STYLES[key] || DEFAULT_STYLE;

  const injected = injectAiValues(content, {
    overallPercentage: aiMeta?.overallPercentage ?? "",
    overallGrade:      aiMeta?.overallGrade      ?? "",
    averagePoints:     aiMeta?.averagePoints      ?? "",
    studentName:       aiMeta?.studentName        ?? "",
    term:              aiMeta?.term               ?? "",
  });

  return (
    <div style={{
      border: `1px solid ${s.borderColor}`,
      borderRadius: 12,
      overflow: "hidden",
      background: "#ffffff",
      marginBottom: 12,
    }}>
      {/* Coloured title band */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: s.headBg,
        borderBottom: `1px solid ${s.borderColor}`,
      }}>
        {/* Icon square */}
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: s.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke={s.titleColor} width={17} height={17}>
            <path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} />
          </svg>
        </div>

        {/* Title */}
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: s.titleColor,
          textTransform: "capitalize",
          letterSpacing: "0.01em",
        }}>
          {cleanTitle}
        </span>
      </div>

      {/* Body */}
      <div
        dangerouslySetInnerHTML={{ __html: formatAiContent(injected) }}
        style={{ padding: "16px 18px", fontSize: 14, lineHeight: 1.75, color: "#374151" }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
//  SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────
const RatingBadge = ({ rating, large = false }) => {
  if (!rating) return null;
  const meta = CBC_META[rating];
  if (!meta) return <span className="text-xs text-gray-400">{rating}</span>;
  return (
    <span className={`inline-flex font-bold rounded-lg border ${large ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1"} ${meta.badge}`}>
      {rating}
    </span>
  );
};

const Bar2 = ({ pct, colorClass = "bg-blue-500" }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div className={`h-2 rounded-full transition-all duration-500 ${colorClass}`}
      style={{ width: `${Math.min(pct || 0, 100)}%` }} />
  </div>
);

const Spinner = ({ text = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const Empty = ({ title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
    <p className="text-lg font-semibold text-gray-700">{title}</p>
    {sub && <p className="text-sm text-gray-400 max-w-sm">{sub}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function Analysis() {
  const [terms, setTerms]               = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [profile, setProfile]           = useState(null);
  const [aiData, setAiData]             = useState(null);
  const [activeTab, setActiveTab]       = useState("performance");

  const [loadingTerms,   setLoadingTerms]   = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAI,      setLoadingAI]      = useState(false);

  const [toast, setToast] = useState(null);
  const showError   = (msg) => setToast({ type: "error",   msg });
  const showSuccess = (msg) => setToast({ type: "success", msg });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/student/analysis/terms/");
        setTerms(Array.isArray(data) ? data : []);
        const current = data.find((t) => t.is_current);
        if (current) setSelectedTerm(current.id);
      } catch (e) { showError(e.message); }
      finally { setLoadingTerms(false); }
    })();
  }, []);

  const onTermChange = async (e) => {
    const id = e.target.value;
    setSelectedTerm(id);
    setProfile(null);
    setAiData(null);
    setActiveTab("performance");
    if (!id) return;
    setLoadingProfile(true);
    try {
      const data = await apiFetch(`/student/analysis/profile/?term_id=${id}`);
      setProfile(data);
    } catch (e) { showError(e.message); }
    finally { setLoadingProfile(false); }
  };

  const runAI = async () => {
    if (!selectedTerm) return;
    setLoadingAI(true);
    setAiData(null);
    setActiveTab("ai");
    try {
      const data = await apiFetch("/student/analysis/ai-analysis/", {
        method: "POST",
        body: JSON.stringify({ term_id: selectedTerm }),
      });
      setAiData(data);
      showSuccess(`AI analysis complete using ${data.provider} (${data.model})`);
    } catch (e) {
      showError("AI analysis failed: " + e.message);
      setActiveTab("performance");
    } finally { setLoadingAI(false); }
  };

  const radarData = profile?.competencies
    ? Object.entries(profile.competencies).map(([name, pct]) => ({
        competency: name.length > 14 ? name.slice(0, 13) + "…" : name,
        score: pct, fullMark: 100,
      }))
    : [];

  const barData = profile?.learningAreas?.map((s) => ({
    subject: s.name.length > 13 ? s.name.slice(0, 12) + "…" : s.name,
    points: s.points, rating: s.rating, full: s.name,
    fill: CBC_META[s.rating]?.hex || "#94a3b8",
  })) || [];

  const pathwayData = profile?.pathwayRecommendations || [];

  const TABS = [
    { id: "performance",  label: "Performance",      icon: BarChart3  },
    { id: "competencies", label: "Competencies",      icon: TrendingUp, hide: radarData.length === 0 },
    { id: "pathways",     label: "Grade 10 Pathways", icon: Award      },
    { id: "ai",           label: "AI Analysis",       icon: Brain      },
  ].filter((t) => !t.hide);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My CBC Analysis</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Term-by-term marks • Teacher-assessed grades • AI insights &amp; Grade 10 Pathways
              </p>
            </div>
            {selectedTerm && profile && (
              <button onClick={runAI} disabled={loadingAI || loadingProfile}
                className="flex items-center px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm">
                {loadingAI
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  : <Brain className="w-4 h-4 mr-2" />}
                {loadingAI ? "Generating Analysis..." : "Run AI Analysis"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">

        {/* ── Term Selector ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Select Term
            </label>
            {loadingTerms ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <select value={selectedTerm} onChange={onTermChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select a term…</option>
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.term} {t.academic_year} {t.is_current ? "— Current" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loadingProfile && <Spinner text="Loading term analysis…" />}
        {!loadingProfile && !profile && selectedTerm && (
          <Empty title="No data for this term" sub="No assessments have been recorded yet for the selected term." />
        )}
        {!loadingProfile && !selectedTerm && (
          <Empty
            title="Select a term to begin"
            sub="Choose any past or current term to view your CBC performance, teacher grades, AI insights, and Grade 10 pathway recommendations."
          />
        )}

        {!loadingProfile && profile && (
          <>
            {/* ── Profile Header ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-md flex-shrink-0">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{profile.admissionNo}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{profile.className}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="font-medium text-gray-700">{profile.term} {profile.academicYear}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {profile.overallGrade && <RatingBadge rating={profile.overallGrade} large />}
                      <div className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl border border-blue-200">
                        {profile.overallPercentage}% average
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Subjects Graded", value: profile.gradedSubjectsCount,                                                    icon: Award      },
                      { label: "Average Points",  value: `${profile.averagePoints} / 8`,                                                 icon: TrendingUp },
                      { label: "Strongest",       value: profile.bestSubjects?.slice(0, 2).map((s) => s.name).join(", ") || "—",         icon: Award      },
                      { label: "Needs Support",   value: profile.needsSupportSubjects?.length > 0 ? profile.needsSupportSubjects.map((s) => s.name).join(", ") : "None", icon: TrendingUp },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          {item.icon && <item.icon className="w-3.5 h-3.5" />}
                          <p className="text-xs font-medium text-gray-500">{item.label}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex gap-2 sm:gap-6">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all ${
                        isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}>
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {isActive && <ChevronRight className="w-3 h-3 ml-1" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── Tab Content ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

              {/* Performance */}
              {activeTab === "performance" && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" /> Subject Performance
                  </h3>
                  {profile.learningAreas?.length === 0 ? (
                    <Empty title="No subjects graded yet" sub="Your teacher has not entered marks for this term." />
                  ) : (
                    <>
                      <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                        <p className="text-sm font-medium text-gray-700 mb-4">Points per Subject (out of 8)</p>
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="subject" angle={-30} textAnchor="end" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 8]} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v, _, props) => [`${v}/8 pts (${props.payload.rating})`, props.payload.full]} />
                            <Bar dataKey="points" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                        {profile.learningAreas?.map((s, i) => {
                          const grade = getCbcGrade(s.points * 12.5);
                          const barColor = grade ? grade.bar : "bg-gray-400";
                          return (
                            <div key={i} className="flex items-center gap-6 p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="flex-1">
                                <div className="flex justify-between mb-3">
                                  <span className="font-medium text-gray-800">{s.name}</span>
                                  <div className="flex items-center gap-3">
                                    <RatingBadge rating={s.rating} />
                                    <span className="text-xs text-gray-400 font-mono">{s.points}/8</span>
                                  </div>
                                </div>
                                <Bar2 pct={s.points * 12.5} colorClass={barColor} />
                                {s.teacherComment && (
                                  <p className="text-xs text-gray-500 mt-3 italic border-l-2 border-gray-200 pl-3">
                                    Teacher note: {s.teacherComment}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Competencies */}
              {activeTab === "competencies" && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" /> Core Competencies
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                      <p className="text-sm font-medium text-gray-700 mb-4">Competency Radar</p>
                      <ResponsiveContainer width="100%" height={320}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="competency" tick={{ fontSize: 12, fill: "#6b7280" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                      <p className="text-sm font-medium text-gray-700 mb-4">Competency Scores</p>
                      <div className="space-y-6">
                        {radarData.map((c, i) => {
                          let colorClass = "bg-amber-400";
                          if (c.score >= 75) colorClass = "bg-emerald-500";
                          else if (c.score >= 50) colorClass = "bg-sky-500";
                          else if (c.score >= 25) colorClass = "bg-amber-400";
                          else colorClass = "bg-rose-400";
                          return (
                            <div key={i}>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-700">{c.competency}</span>
                                <span className="text-sm font-bold text-blue-600">{c.score}%</span>
                              </div>
                              <Bar2 pct={c.score} colorClass={colorClass} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pathways */}
              {activeTab === "pathways" && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" /> Grade 10 Pathway Recommendations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Based on your CBC performance + Kenya's future job trends (2030)
                  </p>
                  {pathwayData.length === 0 ? (
                    <Empty title="No pathway data yet" sub="Complete more assessments to get personalised recommendations." />
                  ) : (
                    <div className="space-y-6">
                      {pathwayData.map((p) => (
                        <div key={p.id} className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="font-semibold text-lg text-gray-900">{p.name}</h5>
                              <span className="text-xs text-gray-400">{p.code}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-4xl font-bold text-blue-600">{p.matchScore}%</span>
                              <p className="text-xs text-gray-500">Match Score</p>
                              <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full ${
                                p.confidence === "High"   ? "bg-green-100 text-green-700" :
                                p.confidence === "Medium" ? "bg-amber-100 text-amber-700" :
                                                            "bg-red-100 text-red-700"
                              }`}>
                                {p.confidence}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{p.description}</p>
                          <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Key Subjects</p>
                              <div className="flex flex-wrap gap-2">
                                {p.requiredSubjects?.map((s) => (
                                  <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-2xl text-xs">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Future Careers</p>
                              <p className="text-gray-700">{p.recommendedCareers?.join(", ")}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-100 bg-blue-50 rounded-xl p-4 text-xs">
                            <span className="font-medium text-blue-700">Future Trend:</span> {p.growthNote}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Analysis */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-500" /> AI-Powered Analysis
                    </h3>
                    {!loadingAI && !aiData && (
                      <button onClick={runAI}
                        className="flex items-center px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
                        <Brain className="w-4 h-4 mr-2" /> Generate My Analysis
                      </button>
                    )}
                  </div>

                  {/* Loading */}
                  {loadingAI && (
                    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                      <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-purple-800 font-medium text-base">Analysing your term performance…</p>
                      <p className="text-purple-500 text-sm mt-1">This usually takes 4–8 seconds</p>
                    </div>
                  )}

                  {/* Empty */}
                  {!loadingAI && !aiData && (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                      <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No AI analysis yet</p>
                      <p className="text-sm text-gray-400 mt-1">Click the button above to get a personalised CBC narrative.</p>
                    </div>
                  )}

                  {/* Report */}
                  {!loadingAI && aiData && (
                    <>
                      {/* Meta bar */}
                      <div style={{
                        display: "flex", flexWrap: "wrap", alignItems: "center",
                        justifyContent: "space-between", gap: 12,
                        background: "#F5F3FF", border: "0.5px solid #DDD6FE",
                        borderRadius: 12, padding: "14px 18px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: "50%",
                            background: "#7C3AED", color: "#EDE9FE",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 600, fontSize: 15, flexShrink: 0,
                          }}>
                            {aiData.studentName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "#1F2937" }}>
                              {aiData.studentName}
                            </div>
                            <div style={{ fontSize: 12, color: "#7C3AED", marginTop: 2 }}>
                              {aiData.term}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {aiData.overallGrade && (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 8,
                              background: "#fff", border: "0.5px solid #DDD6FE",
                              borderRadius: 8, padding: "4px 12px",
                            }}>
                              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Overall Grade</span>
                              <RatingBadge rating={aiData.overallGrade} />
                            </div>
                          )}
                          {aiData.overallPercentage != null && (
                            <div style={{
                              background: "#EFF6FF", border: "0.5px solid #BFDBFE",
                              color: "#1D4ED8", borderRadius: 8,
                              padding: "5px 14px", fontSize: 13, fontWeight: 700,
                            }}>
                              {aiData.overallPercentage}%
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            fontSize: 11, color: "#9333EA",
                            background: "rgba(255,255,255,0.6)",
                            border: "0.5px solid #DDD6FE",
                            borderRadius: 999, padding: "3px 10px",
                          }}>
                            {aiData.provider} · {aiData.model}
                          </span>
                          <button onClick={runAI} style={{
                            fontSize: 12, color: "#7C3AED", background: "transparent",
                            border: "0.5px solid #C4B5FD", borderRadius: 999,
                            padding: "4px 14px", cursor: "pointer",
                          }}>
                            Regenerate
                          </button>
                        </div>
                      </div>

                      {/* Section cards — ordered by SECTION_ORDER */}
                      <div style={{ marginTop: 8 }}>
                        {Object.entries(orderSections(aiData.sections || {})).map(([key, content]) => (
                          <AiSection
                            key={key}
                            title={key}
                            content={content}
                            aiMeta={{
                              overallPercentage: aiData.overallPercentage,
                              overallGrade:      aiData.overallGrade,
                              averagePoints:     aiData.averagePoints,
                              studentName:       aiData.studentName,
                              term:              aiData.term,
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium max-w-md ${
          toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"
        }`}>
          <span className="flex-shrink-0 text-base">{toast.type === "error" ? "⚠️" : "✓"}</span>
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}