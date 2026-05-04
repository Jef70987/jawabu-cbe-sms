import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { fetchStudentMLInsight } from "../../services/mlApi";
import {
  MessageCircle, Send, X, Bot, User, Loader2,
  Clock, Calendar, TrendingUp, Award, GraduationCap,
  FileText, Target, Lightbulb, Brain, Activity,
  Shield, AlertTriangle, LineChart, PieChart,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Constants ────────────────────────────────────────────────────────────────
const COMPETENCY_LEVELS = [
  { code: 'EE1', label: 'Exceptional',        range: '90-100%', color: 'bg-emerald-600' },
  { code: 'EE2', label: 'Very Good',           range: '75-89%',  color: 'bg-emerald-500' },
  { code: 'ME1', label: 'Good',                range: '58-74%',  color: 'bg-blue-500'    },
  { code: 'ME2', label: 'Fair',                range: '41-57%',  color: 'bg-blue-400'    },
  { code: 'AE1', label: 'Needs Improvement',   range: '31-40%',  color: 'bg-amber-500'   },
  { code: 'AE2', label: 'Below Average',       range: '21-30%',  color: 'bg-amber-400'   },
  { code: 'BE1', label: 'Well Below',          range: '11-20%',  color: 'bg-red-500'     },
  { code: 'BE2', label: 'Minimal',             range: '0-10%',   color: 'bg-red-600'     },
];

const QUICK_SUGGESTIONS = [
  { text: 'My competency summary', icon: TrendingUp, query: 'Show me my competency mastery summary' },
  { text: 'Fee balance',           icon: FileText,   query: 'What is my current fee balance?'        },
  { text: 'Upcoming assessments',  icon: Calendar,   query: 'When are my upcoming assessments?'      },
  { text: 'Career pathway',        icon: Target,     query: 'Recommend career pathways based on my competencies' },
  { text: 'Areas to improve',      icon: Lightbulb,  query: 'Which competency areas need improvement?' },
  { text: 'Attendance record',     icon: Clock,      query: 'Show my attendance record'               },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCompetencyLevel = (pct) => {
  if (pct >= 90) return COMPETENCY_LEVELS[0];
  if (pct >= 75) return COMPETENCY_LEVELS[1];
  if (pct >= 58) return COMPETENCY_LEVELS[2];
  if (pct >= 41) return COMPETENCY_LEVELS[3];
  if (pct >= 31) return COMPETENCY_LEVELS[4];
  if (pct >= 21) return COMPETENCY_LEVELS[5];
  if (pct >= 11) return COMPETENCY_LEVELS[6];
  return COMPETENCY_LEVELS[7];
};

const barColor = (pct) =>
  pct >= 75 ? 'bg-green-600' : pct >= 58 ? 'bg-blue-500' : pct >= 41 ? 'bg-amber-500' : 'bg-red-500';

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Bot message formatter (bold, italic, lists, paragraphs) ─────────────────
const formatBotMessage = (text) => {
  if (!text) return null;
  const escapeHtml = (str) => str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
  const lines = escaped.split('\n');
  const result = [];
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        result.push('<ul class="list-disc pl-5 my-2 space-y-1">');
        inList = true;
      }
      const content = line.trim().substring(2);
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      if (line.trim() === '') {
        result.push('<br />');
      } else {
        result.push(`<p class="mb-2">${line}</p>`);
      }
    }
  }
  if (inList) result.push('</ul>');
  return <div dangerouslySetInnerHTML={{ __html: result.join('') }} />;
};

// ─── Chat input — defined OUTSIDE Chatbot so it never remounts on re-render ──
const ChatInput = ({ value, onChange, onKeyDown, placeholder, disabled, inputRef }) => (
  <input
    ref={inputRef}
    type="text"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    disabled={disabled}
    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm rounded-xl bg-white"
  />
);

// ─── Small UI components ──────────────────────────────────────────────────────
const CompetencyBadge = ({ percentage }) => {
  const level = getCompetencyLevel(percentage);
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${level.color}`} />
      <span className="text-xs font-medium text-gray-600">{level.code}</span>
      <span className="text-xs text-gray-400">{level.label}</span>
    </div>
  );
};

const CBCLegend = () => (
  <div className="grid grid-cols-4 gap-2">
    {COMPETENCY_LEVELS.map((l) => (
      <div key={l.code} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${l.color}`} />
        <span className="text-xs text-gray-500">{l.code}</span>
      </div>
    ))}
  </div>
);

const RiskCard = ({ title, value, riskLevel, icon: Icon, description }) => {
  const MAP = {
    low:    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Low Risk'    },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Medium Risk' },
    high:   { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700',   label: 'High Risk'   },
  };
  const c = MAP[riskLevel] || MAP.low;
  return (
    <div className={`p-4 border ${c.border} ${c.bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {IconComponent ? React.createElement(IconComponent, { className: `w-4 h-4 ${c.text}` }) : null}
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
});

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

const CompetencySection = ({ title, icon: IconComponent, items, color, emptyMsg, isFourPoint }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      {IconComponent ? React.createElement(IconComponent, { className: `w-3.5 h-3.5 ${color}` }) : null}
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
                {comp.exam_title && <span className="text-gray-400 ml-1 text-[10px]"> {comp.exam_title}</span>}
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
        <ChatInput
          inputRef={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask about your competencies, career pathways, or risks..."
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending}
          className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl flex-shrink-0"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">AI Assistant for CBC Competency-Based Curriculum</p>
    </div>
  </div>
);

// ─── Main Chatbot component ───────────────────────────────────────────────────
const Chatbot = () => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [mlInsight, setMlInsight] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);
  const [mlLastUpdated, setMlLastUpdated] = useState(null);
  const [mlReloadKey, setMlReloadKey] = useState(0);
  const refreshMlInsight = useCallback(() => {
    setMlReloadKey((prev) => prev + 1);
  }, []);
  const studentId = useMemo(() => {
    return user?.student_id || user?.student?.id || user?.student_profile?.id || null;
  }, [user]);
  const isChatOpen = !isMobile || isMobileChatOpen;
  const canRefreshMlInsight = isAuthenticated && isChatOpen && !mlLoading;
  const mlInsights = useMemo(() => ({
    prediction: mlInsight?.prediction ?? null,
    confidence: mlInsight?.confidence ?? null,
    recommendations: mlInsight?.recommendations ?? [],
    factors: mlInsight?.factors ?? [],
    overall_competency: analyticsData?.overall_competency ?? 0,
    exam_trend: analyticsData?.exam_trend ?? [],
    assessment_trend: analyticsData?.assessment_trend ?? [],
    competencies: analyticsData?.competencies ?? [],
    risks: analyticsData?.risks ?? {},
    career_pathways: analyticsData?.career_pathways ?? [],
  }), [analyticsData, mlInsight]);

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
      const res = await fetch(`${API_BASE_URL}/api/student/chatbot/analytics/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setAnalyticsData(json.data);
      } else {
        setAnalyticsError(json.error || "Failed to load analytics.");
      }
    } catch (err) {
      setAnalyticsError(err.message || "Failed to connect to server.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, [getAuthHeaders]);
  useEffect(() => {
    if (!isChatOpen) return;
    if (!isAuthenticated) {
      setMlInsight(null);
      setMlError(null);
      setMlLoading(false);
      return;
    }
    const controller = new AbortController();
    const loadMlInsight = async () => {
      setMlLoading(true);
      setMlError(null);
      try {
        const token = getAuthHeaders()?.Authorization || null;
        const insight = await fetchStudentMLInsight({
          studentId,
          token,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setMlInsight(insight);
        setMlLastUpdated(insight?.lastUpdated || new Date().toISOString());
        if (insight?.source === "unavailable") {
          setMlError("ML insight unavailable");
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        setMlError(sanitizeMlErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setMlLoading(false);
        }
      }
    };
    loadMlInsight();
    return () => controller.abort();
  }, [isChatOpen, isAuthenticated, studentId, getAuthHeaders, mlReloadKey]);

  useEffect(() => {
    if (!isAuthenticated) {
      setAnalyticsLoading(false);
      setAnalyticsData(null);
      return;
    }
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
    const mlIntent = detectMlIntent(message);
    if (mlIntent) {
      const mlAwareReply = buildMlAwareResponse(mlIntent, mlInsight);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: mlAwareReply,
          isUser: false,
          timestamp: getTimestamp(),
        },
      ]);
      setIsTyping(false);
      setIsSending(false);
      return;
    }
    try {
      const context = analyticsData ? {
        student_name: analyticsData.student_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        student_class: analyticsData.student_class || "",
        admission_no: analyticsData.admission_no || "",
        student_role: user?.role || "student",
      } : {
        student_name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Student",
        student_class: user?.student_class || user?.class_name || "",
        admission_no: user?.admission_no || "",
        student_role: user?.role || "student",
      };
      const res = await fetch(`${API_BASE_URL}/api/student/chatbot/message/`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
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
  }, [analyticsData, getAuthHeaders, isSending, messages, mlInsight, user]);

  const handleSuggestionClick = useCallback((query) => sendMessage(query), [sendMessage]);
  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isSending) sendMessage(inputValue);
  }, [inputValue, isSending, sendMessage]);
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !isSending) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend, isSending]);
  const handleInputChange = useCallback((e) => setInputValue(e.target.value), []);
  const studentName = analyticsData?.student_name || user?.first_name || "Student";

  const riskDisplay = formatRiskLevel(mlInsight?.riskLevel);
  const predictionDisplay = formatPredictionValue(mlInsight?.prediction);
  const confidenceDisplay = formatConfidenceValue(mlInsight?.confidence);
  const confidenceBandDisplay = formatConfidenceBand(mlInsight?.confidenceBand);
  const sourceDisplay = formatMlSource(mlInsight?.source);
  const lastUpdatedDisplay = formatLastUpdated(mlLastUpdated || mlInsight?.lastUpdated);
  const isInsightStale = isMlInsightStale(mlLastUpdated || mlInsight?.lastUpdated);
  const missingMlFields = predictionDisplay === 'Prediction unavailable'
    || confidenceDisplay === 'Confidence unavailable';
  const mlErrorDisplay = mlError ? sanitizeMlErrorMessage(mlError) : null;
  const explainabilityFactors = Array.isArray(mlInsight?.factors) ? mlInsight.factors : [];
  const mlRecommendations = Array.isArray(mlInsight?.recommendations) ? mlInsight.recommendations : [];

  const mlSummaryPanel = (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-700" />
          <h3 className="font-semibold text-gray-800">ML Insight Summary</h3>
          {mlLoading && (
            <span className="text-xs text-blue-600">Updating...</span>
          )}
        </div>
        <button
          type="button"
          onClick={refreshMlInsight}
          disabled={!canRefreshMlInsight}
          title="Refresh ML insight"
          aria-label="Refresh ML insight"
          className="self-start md:self-auto px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mlLoading ? 'Refreshing...' : 'Refresh ML insight'}
        </button>
      </div>

      {analyticsLoading && (
        <p className="text-xs text-gray-500 mb-3">Loading ML insights...</p>
      )}

      {mlErrorDisplay && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700">
          {mlErrorDisplay}
        </div>
      )}

      {missingMlFields && !analyticsLoading && (
        <p className="text-xs text-gray-500 mb-3">Some ML fields are missing.</p>
      )}

      {isInsightStale && !mlLoading && (
        <p className="text-xs text-amber-700 mb-3">Insight may be out of date</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Risk estimate</p>
          <p className="font-medium text-gray-800">{riskDisplay}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Prediction</p>
          <p className="font-medium text-gray-800">{predictionDisplay}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Prediction confidence</p>
          <p className="font-medium text-gray-800">{confidenceDisplay}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Confidence band</p>
          <p className="font-medium text-gray-800">{confidenceBandDisplay}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">ML source</p>
          <p className="font-medium text-gray-800">{sourceDisplay}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last updated</p>
          <p className="font-medium text-gray-800">{lastUpdatedDisplay}</p>
        </div>
      </div>
    </div>
  );

  const mlExplainabilityPanel = (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Why this prediction?</h3>
        <p className="text-xs text-gray-500">Main signals associated with this estimate</p>
      </div>

      {explainabilityFactors.length === 0 ? (
        <p className="text-sm text-gray-500">Explanation is not available for this prediction yet.</p>
      ) : (
        <div className="space-y-3">
          {explainabilityFactors.map((factor, index) => {
            const directionMeta = getFactorDirectionMeta(factor?.direction);
            const factorLabel = factor?.label || humanizeFeatureName(factor?.feature);
            const factorExplanation = factor?.explanation || directionMeta.fallbackExplanation;

            return (
              <div
                key={factor?.feature || factor?.label || `factor-${index}`}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-800">{factorLabel}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      {formatFactorImpact(factor?.impact)}
                    </span>
                    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${directionMeta.classes}`}>
                      {directionMeta.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{factorExplanation}</p>
                <p className="text-[11px] text-gray-500">{getFactorSourceLabel(factor?.source)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const mlRecommendationsPanel = (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Recommended actions</h3>
        <p className="text-xs text-gray-500">Personalized next steps based on available ML context</p>
      </div>

      {mlRecommendations.length === 0 ? (
        <p className="text-sm text-gray-500">No personalized recommendations are available yet.</p>
      ) : (
        <div className="space-y-3">
          {mlRecommendations.map((recommendation, index) => {
            const priority = normalizeRecommendationPriority(recommendation?.priority);
            const type = normalizeRecommendationType(recommendation?.type);
            const priorityMeta = getRecommendationPriorityMeta(priority);
            const title = recommendation?.title || 'Recommended action';
            const description = recommendation?.description || 'Review this recommendation with a teacher or advisor.';

            return (
              <div
                key={recommendation?.id || recommendation?.title || `recommendation-${index}`}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-800">{title}</p>
                  <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${priorityMeta.classes}`}>
                    {priorityMeta.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{description}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                  <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full">
                    {getRecommendationTypeLabel(type)}
                  </span>
                  <span>{getRecommendationSourceLabel(recommendation?.source)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (analyticsLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading CBC Analytics Dashboard...</p>
      </div>
    );
  }

  const overall = mlInsights?.overall_competency ?? 0;
  const examTrend = mlInsights?.exam_trend ?? [];
  const assessTrend = mlInsights?.assessment_trend ?? [];
  const competencies = mlInsights?.competencies ?? [];
  const pathways = mlInsights?.career_pathways ?? [];
  const isFourPoint = getIsFourPoint(analyticsData?.student_class);
  const overallCode = analyticsData?.competency_level || getGradeCode(overall, isFourPoint);
  const overallBar = getBarColor(overallCode);

  const chatPanelProps = {
    messages,
    isTyping,
    isSending,
    inputValue,
    handleInputChange,
    handleKeyPress,
    handleSend,
    handleSuggestionClick,
    analyticsError: analyticsError || mlError,
    messagesEndRef,
    inputRef,
  };

  // Desktop 
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen gap-6 p-6 overflow-hidden">
          {/* Left dashboard */}
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

            {(analyticsError || mlErrorDisplay) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                {analyticsError && <span>Analytics error: {analyticsError}</span>}
                {!analyticsError && mlErrorDisplay && <span>{mlErrorDisplay}</span>}
                <button
                  onClick={analyticsError ? fetchAnalytics : refreshMlInsight}
                  className="ml-3 underline text-amber-800 font-medium"
                >
                  Retry
                </button>
              </div>
            )}
            {mlSummaryPanel}
            {mlExplainabilityPanel}
            {mlRecommendationsPanel}
            {/* Overall Competency */}
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

          {/* Right chat */}
          <div className="w-[380px] flex-shrink-0">
            <ChatPanel isMobileView={false} onClose={() => {}} {...chatPanelProps} />
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Mobile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

        {(analyticsError || mlErrorDisplay) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            {analyticsError && <span>Analytics error: {analyticsError}</span>}
            {!analyticsError && mlErrorDisplay && <span>{mlErrorDisplay}</span>}
            <button onClick={analyticsError ? fetchAnalytics : refreshMlInsight} className="ml-2 underline font-medium">Retry</button>
          </div>
        )}

        {mlSummaryPanel}
        {mlExplainabilityPanel}
        {mlRecommendationsPanel}

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
                <p className="text-sm font-semibold text-gray-800">Jawabu an Academic Assistant</p>
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
