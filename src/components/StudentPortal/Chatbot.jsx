/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  GraduationCap,
  FileText,
  Target,
  Lightbulb,
  Brain,
  Activity,
  Shield,
  AlertTriangle,
  LineChart,
  PieChart,
  BookOpen,
  ClipboardList,
  Info,
  ShieldAlert,
  ShieldX,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const META = {
  EE1: { label: "Exceptional",       badge: "bg-emerald-100 text-emerald-800 border-emerald-200", bar: "bg-emerald-600" },
  EE2: { label: "Very Good",         badge: "bg-emerald-100 text-emerald-800 border-emerald-200", bar: "bg-emerald-500" },
  ME1: { label: "Good",              badge: "bg-blue-100 text-blue-800 border-blue-200",           bar: "bg-blue-600"   },
  ME2: { label: "Fair",              badge: "bg-blue-100 text-blue-800 border-blue-200",           bar: "bg-blue-400"   },
  AE1: { label: "Needs Improvement", badge: "bg-yellow-100 text-yellow-800 border-yellow-200",    bar: "bg-yellow-500" },
  AE2: { label: "Below Average",     badge: "bg-yellow-100 text-yellow-800 border-yellow-200",    bar: "bg-yellow-400" },
  BE1: { label: "Well Below Average",badge: "bg-red-100 text-red-800 border-red-200",             bar: "bg-red-600"    },
  BE2: { label: "Minimal",           badge: "bg-red-100 text-red-800 border-red-200",             bar: "bg-red-400"    },
  EE:  { label: "Exceeding Expectations",  badge: "bg-emerald-100 text-emerald-800 border-emerald-200", bar: "bg-emerald-600" },
  ME:  { label: "Meeting Expectations",    badge: "bg-blue-100 text-blue-800 border-blue-200",          bar: "bg-blue-600"    },
  AE:  { label: "Approaching Expectations",badge: "bg-yellow-100 text-yellow-800 border-yellow-200",   bar: "bg-yellow-500"  },
  BE:  { label: "Below Expectations",      badge: "bg-red-100 text-red-800 border-red-200",             bar: "bg-red-600"     },
};

const LEGEND_4POINT = [
  { sub: "EE", pts: 4, label: "Exceeding Expectations",  range: "90-100%", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { sub: "ME", pts: 3, label: "Meeting Expectations",    range: "75-89%",  cls: "bg-blue-100 text-blue-800 border-blue-200"           },
  { sub: "AE", pts: 2, label: "Approaching Expectations",range: "58-74%",  cls: "bg-yellow-100 text-yellow-800 border-yellow-200"    },
  { sub: "BE", pts: 1, label: "Below Expectations",      range: "0-57%",   cls: "bg-red-100 text-red-800 border-red-200"             },
];

const LEGEND_8POINT = [
  { sub: "EE1", pts: 8, label: "Exceptional",        range: "90-100%", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { sub: "EE2", pts: 7, label: "Very Good",           range: "75-89%",  cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { sub: "ME1", pts: 6, label: "Good",                range: "58-74%",  cls: "bg-blue-100 text-blue-800 border-blue-200"          },
  { sub: "ME2", pts: 5, label: "Fair",                range: "41-57%",  cls: "bg-blue-100 text-blue-800 border-blue-200"          },
  { sub: "AE1", pts: 4, label: "Needs Improvement",  range: "31-40%",  cls: "bg-yellow-100 text-yellow-800 border-yellow-200"    },
  { sub: "AE2", pts: 3, label: "Below Average",       range: "21-30%",  cls: "bg-yellow-100 text-yellow-800 border-yellow-200"    },
  { sub: "BE1", pts: 2, label: "Well Below Average",  range: "11-20%",  cls: "bg-red-100 text-red-800 border-red-200"             },
  { sub: "BE2", pts: 1, label: "Minimal",             range: "1-10%",   cls: "bg-red-100 text-red-800 border-red-200"             },
];

const getIsFourPoint = (className) => {
  if (!className) return false;
  const c = className.toLowerCase();
  if (c.includes("pp")) return true;
  const match = className.match(/(\d+)/);
  if (match) { const g = parseInt(match[1]); return g >= 1 && g <= 6; }
  return false;
};

const getGradeCode = (pct, isFourPoint) => {
  if (pct == null || isNaN(pct)) return isFourPoint ? "BE" : "BE2";
  const n = parseFloat(pct);
  if (isFourPoint) {
    if (n >= 90) return "EE"; if (n >= 75) return "ME"; if (n >= 58) return "AE"; return "BE";
  }
  if (n >= 90) return "EE1"; if (n >= 75) return "EE2"; if (n >= 58) return "ME1";
  if (n >= 41) return "ME2"; if (n >= 31) return "AE1"; if (n >= 21) return "AE2";
  if (n >= 11) return "BE1"; return "BE2";
};

const getBarColor  = (code) => META[code]?.bar   || "bg-gray-400";
const getBadgeClass= (code) => META[code]?.badge  || "bg-gray-100 text-gray-700 border-gray-200";

const QUICK_SUGGESTIONS = [
  { text: "My competency summary", icon: TrendingUp, query: "Show me my competency mastery summary" },
  { text: "Fee balance",           icon: FileText,   query: "What is my current fee balance?" },
  { text: "Upcoming assessments",  icon: Calendar,   query: "When are my upcoming assessments?" },
  { text: "Career pathway",        icon: Target,     query: "Recommend career pathways based on my competencies" },
  { text: "Areas to improve",      icon: Lightbulb,  query: "Which competency areas need improvement?" },
  { text: "Attendance record",     icon: Clock,      query: "Show my attendance record" },
];

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatBotMessage = (text) => {
  if (!text) return null;
  const esc = (s) => s.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m] ?? m);
  let escaped = esc(text);
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*(.*?)\*/g, "<em>$1</em>");
  const lines = escaped.split("\n");
  const result = [];
  let inList = false;
  for (const line of lines) {
    if (line.trim().startsWith("- ")) {
      if (!inList) { result.push('<ul class="list-disc pl-5 my-2 space-y-1">'); inList = true; }
      result.push(`<li>${line.trim().substring(2)}</li>`);
    } else {
      if (inList) { result.push("</ul>"); inList = false; }
      if (line.trim() === "") result.push("<br />");
      else result.push(`<p class="mb-2">${line}</p>`);
    }
  }
  if (inList) result.push("</ul>");
  return <div dangerouslySetInnerHTML={{ __html: result.join("") }} />;
};

// ─── Discipline status config ─────────────────────────────────────────────────
const DISCIPLINE_STATUS_CONFIG = {
  Good:       { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  icon: Shield,      label: "Good Standing"  },
  Warning:    { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  icon: AlertTriangle,label: "Warning Issued" },
  Probation:  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: ShieldAlert,  label: "On Probation"   },
  Suspension: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    icon: ShieldX,      label: "Suspension"     },
};

// ─── Discipline card ──────────────────────────────────────────────────────────
// FIX: replaced the old card (which only showed a raw incident count) with a card
// that surfaces discipline_status, discipline_points, open_discipline_cases,
// active_suspensions, and suspension_detail — matching what Jawabu now knows.
const DisciplineCard = ({ analyticsData, isMobile = false }) => {
  if (!analyticsData) return null;

  const {
    open_discipline_cases = 0,
    discipline_points     = 0,
    discipline_status     = "Good",
    active_suspensions    = 0,
    suspension_detail     = [],
  } = analyticsData;

  // Only render if there is something to report
  const hasIssue =
    discipline_status !== "Good" ||
    open_discipline_cases > 0   ||
    active_suspensions > 0;

  if (!hasIssue) return null;

  const cfg   = DISCIPLINE_STATUS_CONFIG[discipline_status] || DISCIPLINE_STATUS_CONFIG.Warning;
  const Icon  = cfg.icon;
  const p     = isMobile ? "p-4" : "p-5";
  const title = isMobile ? "text-sm" : "text-base";

  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-xl ${p}`}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-gray-800 ${title}`}>
              Discipline Record
            </h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              {cfg.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
            <span>
              <span className="font-semibold text-gray-800">{discipline_points}</span> discipline pts
            </span>
            {open_discipline_cases > 0 && (
              <span>
                <span className="font-semibold text-gray-800">{open_discipline_cases}</span> open case{open_discipline_cases > 1 ? "s" : ""}
              </span>
            )}
            {active_suspensions > 0 && (
              <span className="text-red-700 font-semibold">
                {active_suspensions} active suspension{active_suspensions > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Contextual message */}
          <p className={`mt-2 text-xs ${cfg.text}`}>
            {discipline_status === "Suspension" || active_suspensions > 0
              ? "You have an active or pending suspension. Your parent/guardian must be involved. Report to the Deputy Headteacher immediately."
              : discipline_status === "Probation"
              ? "You are currently on probation due to accumulated discipline points. Please urgently speak with the Deputy Headteacher."
              : "You have an open discipline matter. Please speak with your class teacher or Deputy Headteacher to resolve it."}
          </p>

          {/* Suspension detail */}
          {suspension_detail.length > 0 && (
            <div className="mt-3 space-y-2">
              {suspension_detail.map((s, idx) => (
                <div key={idx} className="bg-white border border-red-200 rounded-lg px-3 py-2 text-xs text-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{s.type} Suspension</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      s.status === "Active" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>{s.status}</span>
                  </div>
                  <p className="text-gray-500">{s.start_date} → {s.end_date}</p>
                  {s.reason && <p className="mt-1 text-gray-600 italic">{s.reason}</p>}
                  {!s.parent_notified && (
                    <p className="mt-1 text-red-600 font-medium">Parent / guardian not yet notified.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatInput = ({ value, onChange, onKeyDown, placeholder, disabled, inputRef }) => (
  <input
    ref={inputRef} type="text" value={value} onChange={onChange} onKeyDown={onKeyDown}
    placeholder={placeholder} disabled={disabled}
    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm rounded-xl bg-white"
  />
);

const CompetencyBadge = ({ code }) => {
  const meta = META[code];
  if (!meta) return <span className="text-xs text-gray-400">—</span>;
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-bold border ${meta.badge}`}>
      {code} · {meta.label}
    </span>
  );
};

const CBCLegend = ({ isFourPoint }) => {
  const legends = isFourPoint ? LEGEND_4POINT : LEGEND_8POINT;
  return (
    <div className={`grid ${isFourPoint ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"} gap-2`}>
      {legends.map((r) => (
        <div key={r.sub} className={`px-3 py-2 border text-center ${r.cls}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs">{r.sub}</span>
            <span className="text-xs opacity-50">{r.pts}pt</span>
          </div>
          <p className="text-xs font-medium leading-tight">{r.label}</p>
          <p className="text-xs opacity-50 mt-0.5">{r.range}</p>
        </div>
      ))}
    </div>
  );
};

const RiskCard = ({ title, value, riskLevel, icon: Icon, description }) => {
  const MAP = {
    low:    { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Low Risk"    },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Medium Risk" },
    high:   { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   label: "High Risk"   },
  };
  const c = MAP[riskLevel] || MAP.low;
  return (
    <div className={`p-4 border ${c.border} ${c.bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${c.text}`} />
          <span className="text-xs font-medium text-gray-500">{title}</span>
        </div>
        <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

const TrendBar = ({ label, value, isFourPoint }) => {
  const code = getGradeCode(value, isFourPoint);
  const bar  = getBarColor(code);
  const meta = META[code];
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 truncate max-w-[55%]">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-bold border ${meta?.badge || ""}`}>{code}</span>
          <span className="font-medium text-gray-800">{value}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${bar}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
};

const SplitPerformanceTrend = ({ examTrend = [], assessmentTrend = [], isFourPoint }) => {
  const [activeTab, setActiveTab] = useState(examTrend.length > 0 ? "exams" : "assessments");
  const tabs = [
    { key: "exams",       label: "Formal Exams",      icon: BookOpen,    data: examTrend,       color: "text-blue-600",   tip: "Official school exams set by the administration (e.g. End-Term, Mid-Term, JESMA)." },
    { key: "assessments", label: "Class Assessments",  icon: ClipboardList,data: assessmentTrend, color: "text-purple-600", tip: "Ongoing tests set by your subject teachers (e.g. CATs, assignments, projects)." },
  ];
  const active = tabs.find((t) => t.key === activeTab);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <LineChart className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-gray-800">Performance Trend</h3>
      </div>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === tab.key ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.key ? tab.color : ""}`} />
            {tab.label}
            {tab.data.length > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? "bg-gray-100 text-gray-600" : "bg-gray-200 text-gray-500"}`}>
                {tab.data.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 italic">{active?.tip}</p>
      <div className="space-y-3">
        {active?.data.length === 0 ? (
          <div className="text-center py-6">
            <active.icon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No {active.key === "exams" ? "formal exam" : "class assessment"} results published yet.</p>
          </div>
        ) : (
          active.data.map((item, idx) => <TrendBar key={idx} label={item.term} value={item.value} isFourPoint={isFourPoint} />)
        )}
      </div>
    </div>
  );
};

const CompetencySection = ({ title, icon: Icon, items, color, emptyMsg, isFourPoint }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{title}</span>
      <span className="text-xs text-gray-400 ml-auto">{items.length} subject{items.length !== 1 ? "s" : ""}</span>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-gray-400 py-2">{emptyMsg}</p>
    ) : (
      items.map((comp, idx) => {
        const code = comp.grade || getGradeCode(comp.mastery, isFourPoint);
        const bar  = getBarColor(code);
        const meta = META[code];
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <div>
                <span className="text-gray-700 font-medium">{comp.name}</span>
                {comp.exam_title && <span className="text-gray-400 ml-1 text-[10px]">· {comp.exam_title}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{comp.mastery}%</span>
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold border ${meta?.badge || ""}`}>{code}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-2 rounded-full transition-all duration-500 ${bar}`} style={{ width: `${Math.min(comp.mastery, 100)}%` }} />
            </div>
          </div>
        );
      })
    )}
  </div>
);

const CompetencyMastery = ({ competencies = [], isFourPoint }) => {
  const examComps   = competencies.filter((c) => !c.is_teacher_assessment);
  const assessComps = competencies.filter((c) => c.is_teacher_assessment);
  if (competencies.length === 0) return <p className="text-xs text-gray-400">No competency data available yet.</p>;
  return (
    <div className="space-y-5">
      {examComps.length > 0   && <CompetencySection title="From Formal Exams"      icon={BookOpen}    items={examComps}   color="text-blue-600"   emptyMsg="No exam results available."       isFourPoint={isFourPoint} />}
      {assessComps.length > 0 && <CompetencySection title="From Class Assessments" icon={ClipboardList}items={assessComps} color="text-purple-600" emptyMsg="No assessment results available." isFourPoint={isFourPoint} />}
    </div>
  );
};

const ChatMessage = React.memo(({ message, isUser, timestamp }) => {
  const content = isUser
    ? <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
    : formatBotMessage(message);
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isUser ? "ml-2" : "mr-2"}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${isUser ? "bg-blue-600" : "bg-green-700"}`}>
            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
        </div>
        <div className={`flex-1 ${isUser ? "items-end" : "items-start"}`}>
          <div className={`px-4 py-2 rounded-xl border border-gray-200 ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
            {content}
          </div>
          <p className="text-xs text-gray-400 mt-1 px-1">{timestamp}</p>
        </div>
      </div>
    </div>
  );
});

const TypingIndicator = React.memo(() => (
  <div className="flex justify-start mb-4">
    <div className="flex max-w-[85%] flex-row">
      <div className="w-8 h-8 bg-green-700 flex items-center justify-center rounded-xl mr-2">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
        <div className="flex gap-1">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-2 h-2 bg-gray-500 animate-bounce rounded-full" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
));

const ChatPanel = ({
  isMobileView, onClose, messages, isTyping, isSending,
  inputValue, handleInputChange, handleKeyPress, handleSend,
  handleSuggestionClick, analyticsError, messagesEndRef, inputRef,
}) => (
  <div className={`flex flex-col bg-white border border-gray-200 shadow-xl ${isMobileView ? "fixed inset-0 z-50" : "h-full rounded-xl"}`}>
    <div className={`flex items-center ${isMobileView ? "justify-between" : ""} gap-3 p-4 bg-green-700 border-b border-green-800 ${!isMobileView ? "rounded-t-xl" : ""}`}>
      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl flex-shrink-0">
        <Bot className="w-5 h-5 text-green-700" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-white">Jawabu — Academic Assistant</h3>
        <p className="text-xs text-green-100">AI-Powered | CBC Curriculum Support</p>
      </div>
      {isMobileView && <button onClick={onClose} className="text-white/70 hover:text-white ml-2"><X className="w-5 h-5" /></button>}
    </div>

    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-xl mb-4">
            <Brain className="w-10 h-10 text-green-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hi, I'm Jawabu — your CBC Academic Assistant</h3>
          <p className="text-gray-600 mb-3 text-sm max-w-md">
            I can help you understand your grades, explain the difference between exams and assessments, recommend career pathways, and much more.
          </p>
          {analyticsError && (
            <p className="text-xs text-amber-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Analytics could not be loaded — I'll answer from general knowledge.
            </p>
          )}
          <div className="w-full">
            <p className="text-xs font-medium text-gray-500 mb-3 text-left">QUICK QUESTIONS</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s, idx) => (
                <button key={idx} onClick={() => handleSuggestionClick(s.query)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm rounded-xl">
                  <s.icon className="w-3 h-3 text-blue-600" />
                  <span className="text-gray-700">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.timestamp} />)}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>

    {messages.length > 0 && !isTyping && (
      <div className="px-4 py-2 border-t border-gray-200 bg-white overflow-x-auto">
        <div className="flex gap-2">
          {QUICK_SUGGESTIONS.slice(0, 4).map((s, idx) => (
            <button key={idx} onClick={() => handleSuggestionClick(s.query)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-xs whitespace-nowrap rounded-lg">
              <s.icon className="w-3 h-3 text-blue-600" />
              <span className="text-gray-700">{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
      <div className="flex gap-2">
        <ChatInput inputRef={inputRef} value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress}
          placeholder="Ask about your grades, exams, assessments, career..." disabled={isSending} />
        <button onClick={handleSend} disabled={!inputValue.trim() || isSending}
          className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl flex-shrink-0">
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">AI Assistant — CBC Competency-Based Curriculum</p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Chatbot = () => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messages,         setMessages]          = useState([]);
  const [inputValue,       setInputValue]        = useState("");
  const [isTyping,         setIsTyping]          = useState(false);
  const [isSending,        setIsSending]         = useState(false);
  const [isMobile,         setIsMobile]          = useState(false);
  const [analyticsData,    setAnalyticsData]     = useState(null);
  const [analyticsLoading, setAnalyticsLoading]  = useState(true);
  const [analyticsError,   setAnalyticsError]    = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/student/chatbot/analytics/`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) setAnalyticsData(json.data);
      else setAnalyticsError(json.error || "Failed to load analytics.");
    } catch (err) {
      setAnalyticsError(err.message || "Failed to connect to server.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!isAuthenticated) { setAnalyticsLoading(false); return; }
    fetchAnalytics();
  }, [isAuthenticated, fetchAnalytics]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (isMobileChatOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isMobileChatOpen]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    setMessages((prev) => [...prev, { id: Date.now(), text: message, isUser: true, timestamp: getTimestamp() }]);
    setInputValue("");
    setIsTyping(true);
    try {
      const context = analyticsData ? {
        student_name:  analyticsData.student_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        student_class: analyticsData.student_class || "",
        admission_no:  analyticsData.admission_no  || "",
        student_role:  user?.role || "student",
      } : {};
      const res  = await fetch(`${API_BASE_URL}/api/student/chatbot/message/`, {
        method:  "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body:    JSON.stringify({
          message,
          context,
          conversation_history: messages.slice(-10).map((m) => ({ role: m.isUser ? "user" : "assistant", content: m.text })),
        }),
      });
      const data    = await res.json();
      const botText = res.ok ? data.response || "Thank you for your message." : data.error || "Something went wrong.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: botText, isUser: false, timestamp: getTimestamp() }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: "Connection error. Please try again.", isUser: false, timestamp: getTimestamp() }]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [analyticsData, user, getAuthHeaders, messages, isSending]);

  const studentName = analyticsData?.student_name || user?.first_name || "Student";

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading CBC Analytics Dashboard...</p>
      </div>
    );
  }

  const overall      = analyticsData?.overall_competency ?? 0;
  const examTrend    = analyticsData?.exam_trend          ?? [];
  const assessTrend  = analyticsData?.assessment_trend    ?? [];
  const competencies = analyticsData?.competencies        ?? [];
  const risks        = analyticsData?.risks               ?? {};
  const pathways     = analyticsData?.career_pathways     ?? [];
  const isFourPoint  = getIsFourPoint(analyticsData?.student_class);
  const overallCode  = analyticsData?.competency_level    || getGradeCode(overall, isFourPoint);
  const overallBar   = getBarColor(overallCode);

  const chatPanelProps = {
    messages, isTyping, isSending, inputValue,
    handleInputChange:    (e) => setInputValue(e.target.value),
    handleKeyPress:       (e) => { if (e.key === "Enter" && !isSending) { e.preventDefault(); sendMessage(inputValue); } },
    handleSend:           () => sendMessage(inputValue),
    handleSuggestionClick:(q) => sendMessage(q),
    analyticsError, messagesEndRef, inputRef,
  };

  // ── Desktop ────────────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen gap-6 p-6 overflow-hidden">
          {/* Left — dashboard */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <div className="bg-green-700 border border-green-800 rounded-xl px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl">
                  <GraduationCap className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CBC Competency Analytics Dashboard</h1>
                  <p className="text-green-100 text-sm">Welcome back, {studentName} | Competency-Based Curriculum</p>
                </div>
              </div>
            </div>

            {analyticsError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                Analytics error: {analyticsError}
                <button onClick={fetchAnalytics} className="ml-3 underline text-amber-800 font-medium">Retry</button>
              </div>
            )}

            {/* Overall competency */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-700" />
                  <h2 className="text-lg font-semibold text-gray-800">Overall Competency Mastery</h2>
                </div>
                <CompetencyBadge code={overallCode} />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-3 rounded-full transition-all duration-700 ${overallBar}`} style={{ width: `${overall}%` }} />
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-800">{overall}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <CBCLegend isFourPoint={isFourPoint} />
              </div>
            </div>

            {/* FIX: replaced old minimal card with full DisciplineCard */}
            <DisciplineCard analyticsData={analyticsData} isMobile={false} />

            {/* Trend + Pathways */}
            <div className="grid grid-cols-2 gap-6">
              <SplitPerformanceTrend examTrend={examTrend} assessmentTrend={assessTrend} isFourPoint={isFourPoint} />
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Recommended Career Pathways</h3>
                </div>
                {pathways.length === 0 && <p className="text-xs text-gray-400">No pathway data available yet.</p>}
                <div className="space-y-4">
                  {pathways.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-800">{p.name}</span>
                        <span className="text-green-700 font-semibold">{p.match}% Match</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: `${p.match}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">Based on: {(p.competencies || []).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Competency Area Mastery</h3>
              </div>
              <CompetencyMastery competencies={competencies} isFourPoint={isFourPoint} />
            </div>
          </div>

          {/* Right — chat */}
          <div className="w-[380px] flex-shrink-0">
            <ChatPanel isMobileView={false} onClose={() => {}} {...chatPanelProps} />
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {!isMobileChatOpen && (
        <button onClick={() => setIsMobileChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-700 hover:bg-green-800 text-white p-4 shadow-lg transition-colors rounded-xl lg:hidden">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 bg-gray-50">
          <ChatPanel isMobileView={true} onClose={() => setIsMobileChatOpen(false)} {...chatPanelProps} />
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="bg-green-700 border border-green-800 rounded-xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
              <GraduationCap className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CBC Analytics</h1>
              <p className="text-green-100 text-xs">Welcome, {studentName}</p>
            </div>
          </div>
        </div>

        {analyticsError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            {analyticsError}
            <button onClick={fetchAnalytics} className="ml-2 underline font-medium">Retry</button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-700" />
              <h3 className="font-semibold text-gray-800 text-sm">Overall Competency</h3>
            </div>
            <CompetencyBadge code={overallCode} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full transition-all duration-700 ${overallBar}`} style={{ width: `${overall}%` }} />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-800">{overall}%</span>
          </div>
          <div className="mt-3"><CBCLegend isFourPoint={isFourPoint} /></div>
        </div>

        {/* FIX: replaced old minimal card with full DisciplineCard */}
        <DisciplineCard analyticsData={analyticsData} isMobile={true} />

        <SplitPerformanceTrend examTrend={examTrend} assessmentTrend={assessTrend} isFourPoint={isFourPoint} />

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Career Pathways</h3>
          </div>
          <div className="space-y-3">
            {pathways.length === 0 && <p className="text-xs text-gray-400">No pathway data yet.</p>}
            {pathways.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="text-green-700">{p.match}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-1.5 bg-green-600 rounded-full" style={{ width: `${p.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Competency Areas</h3>
          </div>
          <CompetencyMastery competencies={competencies} isFourPoint={isFourPoint} />
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 flex items-center justify-center rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Jawabu — Academic Assistant</p>
                <p className="text-xs text-gray-600">Ask about your grades, exams, or career</p>
              </div>
            </div>
            <button onClick={() => setIsMobileChatOpen(true)}
              className="px-4 py-2 bg-green-700 text-white text-sm hover:bg-green-800 flex items-center gap-2 rounded-xl">
              <MessageCircle className="w-4 h-4" /> Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;