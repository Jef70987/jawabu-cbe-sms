import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { fetchStudentMLInsight, getMLInsightUnavailable } from "../../services/mlApi";
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

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
const API_ORIGIN = NORMALIZED_API_BASE_URL.endsWith("/api")
  ? NORMALIZED_API_BASE_URL.slice(0, -4)
  : NORMALIZED_API_BASE_URL;
const API_BASE_URL = `${API_ORIGIN}/api`;

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

const formatRiskLevel = (level) => {
  const normalized = typeof level === 'string' ? level.toLowerCase() : 'unknown';
  if (normalized === 'high') return 'High risk';
  if (normalized === 'medium') return 'Medium risk';
  if (normalized === 'low') return 'Low risk';
  return 'Risk unknown';
};

const formatPredictionValue = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Prediction unavailable';
  if (value >= 0 && value <= 1) return `${Math.round(value * 100)}%`;
  return `${Math.round(value)}`;
};

const formatConfidenceValue = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Confidence unavailable';
  if (value >= 0 && value <= 1) return `${Math.round(value * 100)}%`;
  if (value > 1 && value <= 100) return `${Math.round(value)}%`;
  return `${Math.round(value)}`;
};

const formatConfidenceBand = (band) => {
  const normalized = typeof band === 'string' ? band.toLowerCase() : 'unknown';
  if (normalized === 'high') return 'High confidence';
  if (normalized === 'medium') return 'Medium confidence';
  if (normalized === 'low') return 'Low confidence';
  return 'Confidence band unknown';
};

const formatMlSource = (source) => {
  const normalized = typeof source === 'string' ? source.toLowerCase() : 'unknown';
  if (normalized === 'ml_api') return 'ML API';
  if (normalized === 'chatbot_api') return 'Chatbot API';
  if (normalized === 'fallback') return 'Fallback data';
  if (normalized === 'unavailable') return 'Unavailable';
  return 'Unknown source';
};

const formatLastUpdated = (value) => {
  if (!value) return 'Not updated yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not updated yet';
  return date.toLocaleString();
};

const humanizeFeatureName = (feature) => {
  if (typeof feature !== 'string' || !feature.trim()) return 'Signal';
  return feature
    .split('_')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const formatFactorImpact = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Impact unavailable';
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const absoluteValue = Math.abs(value);
  if (absoluteValue <= 1) return `${sign}${Math.round(absoluteValue * 100)}%`;
  return `${sign}${absoluteValue.toFixed(1)}`;
};

const getFactorDirectionMeta = (direction) => {
  const normalized = typeof direction === 'string' ? direction.toLowerCase() : 'neutral';
  if (normalized === 'positive') {
    return {
      direction: 'positive',
      label: 'Positive signal',
      classes: 'bg-green-50 text-green-700 border-green-200',
      fallbackExplanation: 'This signal is associated with a stronger estimate.',
    };
  }
  if (normalized === 'negative') {
    return {
      direction: 'negative',
      label: 'Needs attention',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      fallbackExplanation: 'This signal is associated with a weaker estimate.',
    };
  }
  return {
    direction: 'neutral',
    label: 'Context signal',
    classes: 'bg-slate-50 text-slate-700 border-slate-200',
    fallbackExplanation: 'This signal is included in the available ML context.',
  };
};

const getFactorSourceLabel = (source) => {
  const normalized = typeof source === 'string' ? source.toLowerCase() : '';
  if (normalized === 'model') return 'Model signal';
  if (normalized === 'rule_based') return 'Rule-based signal';
  if (normalized === 'fallback') return 'Fallback signal';
  return 'Signal';
};

const normalizeRecommendationPriority = (priority) => {
  const normalized = typeof priority === 'string' ? priority.toLowerCase() : 'medium';
  if (normalized === 'high' || normalized === 'medium' || normalized === 'low') return normalized;
  return 'medium';
};

const getRecommendationPriorityMeta = (priority) => {
  if (priority === 'high') {
    return {
      label: 'High priority',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  if (priority === 'low') {
    return {
      label: 'Low priority',
      classes: 'bg-green-50 text-green-700 border-green-200',
    };
  }
  return {
    label: 'Medium priority',
    classes: 'bg-slate-50 text-slate-700 border-slate-200',
  };
};

const normalizeRecommendationType = (type) => {
  const normalized = typeof type === 'string' ? type.toLowerCase() : 'general';
  if (normalized === 'academic' || normalized === 'attendance' || normalized === 'behavior' || normalized === 'career' || normalized === 'general') {
    return normalized;
  }
  return 'general';
};

const getRecommendationTypeLabel = (type) => {
  if (type === 'academic') return 'Academic';
  if (type === 'attendance') return 'Attendance';
  if (type === 'behavior') return 'Behavior';
  if (type === 'career') return 'Career';
  return 'General';
};

const getRecommendationSourceLabel = (source) => {
  const normalized = typeof source === 'string' ? source.toLowerCase() : '';
  if (normalized === 'ml') return 'ML recommendation';
  if (normalized === 'rule_based') return 'Rule-based recommendation';
  if (normalized === 'fallback') return 'Fallback recommendation';
  return 'Recommendation';
};

const isMlInsightStale = (timestamp) => {
  if (!timestamp) return false;
  const updatedAt = new Date(timestamp).getTime();
  if (Number.isNaN(updatedAt)) return false;
  return Date.now() - updatedAt > 60 * 60 * 1000;
};

const ML_INSIGHT_UNAVAILABLE_MESSAGE = 'ML insight is not available yet. I can still give general study guidance, but personalized prediction-based advice requires the latest ML insight to load.';
const LOW_CONFIDENCE_CAVEAT = 'This estimate may be incomplete because model confidence is low or unavailable.';
const IMPROVEMENT_EMPTY_RECOMMENDATIONS = 'No personalized recommendations are available yet. Review your recent performance, attendance, and competency gaps with a teacher or advisor.';
const CAREER_FALLBACK_MESSAGE = 'I do not have personalized career pathway recommendations yet. A teacher or career advisor should review your competencies, interests, and subject performance before choosing a pathway.';

const normalizeMessageText = (message) => (typeof message === 'string' ? message.toLowerCase().trim() : '');

const sanitizeMlErrorMessage = (error) => {
  const raw = typeof error === 'string' ? error : error?.message;
  const normalized = String(raw || '')
    .replace(/\s+/g, ' ')
    .replace(/^TypeError:\s*/i, '')
    .trim();

  if (!normalized) return 'ML insight unavailable';
  const lowered = normalized.toLowerCase();
  if (lowered.includes('failed to fetch')) {
    return 'ML insight unavailable: Unable to reach ML services right now. Please try again.';
  }
  if (lowered.includes('not permitted')) {
    return 'ML insight unavailable: You are not permitted to view this ML insight.';
  }
  if (lowered.includes('rate-limited') || lowered.includes('rate limited')) {
    return 'ML insight unavailable: ML insight is temporarily rate-limited. Please try again shortly.';
  }

  const clipped = normalized.slice(0, 180);
  if (clipped.toLowerCase().startsWith('ml insight unavailable')) return clipped;
  return `ML insight unavailable: ${clipped}`;
};

const detectMlIntent = (message) => {
  const content = normalizeMessageText(message);
  if (!content) return null;

  const riskPatterns = [
    'why at risk',
    'why am i at risk',
    'why this prediction',
    'explain prediction',
    'why predicted',
    'what affects my risk',
  ];
  const improvementPatterns = [
    'how can i improve',
    'how do i improve',
    'improve my performance',
    'what should i focus on',
    'what should i work on',
    'next steps',
  ];
  const studyPlanPatterns = [
    'study plan',
    'revision plan',
    'learning plan',
    'recommend study',
    'what should i study',
  ];
  const careerPatterns = [
    'career pathway',
    'career paths',
    'future career',
    'subject choice',
    'career',
    'pathway',
  ];

  if (riskPatterns.some((pattern) => content.includes(pattern))) return 'risk_explanation';
  if (improvementPatterns.some((pattern) => content.includes(pattern))) return 'improvement';
  if (studyPlanPatterns.some((pattern) => content.includes(pattern))) return 'study_plan';
  if (careerPatterns.some((pattern) => content.includes(pattern))) return 'career';
  return null;
};

const formatPredictionForMessage = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value >= 0 && value <= 1) return `${Math.round(value * 100)}%`;
  return `${Math.round(value)}`;
};

const formatConfidenceForMessage = (value, band) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return band ? `Confidence band: ${formatConfidenceBand(band)}.` : null;
  }

  let formattedValue = null;
  if (value >= 0 && value <= 1) formattedValue = `${Math.round(value * 100)}%`;
  else if (value > 1 && value <= 100) formattedValue = `${Math.round(value)}%`;
  else formattedValue = `${Math.round(value)}`;

  if (band) return `${formattedValue} (${formatConfidenceBand(band)})`;
  return formattedValue;
};

const hasLowOrUnknownConfidence = (insight) => {
  const confidence = insight?.confidence;
  const confidenceBand = typeof insight?.confidenceBand === 'string' ? insight.confidenceBand.toLowerCase() : 'unknown';
  if (typeof confidence !== 'number' || Number.isNaN(confidence)) return true;
  if (confidenceBand === 'low' || confidenceBand === 'unknown') return true;
  return confidence < 0.5;
};

const summarizeFactorsForMessage = (factors, limit = 3) => {
  if (!Array.isArray(factors)) return [];
  return factors.slice(0, limit).map((factor) => {
    const label = factor?.label || humanizeFeatureName(factor?.feature);
    const directionMeta = getFactorDirectionMeta(factor?.direction);
    return `${label}: ${directionMeta.fallbackExplanation}`;
  });
};

const summarizeRecommendationsForMessage = (recommendations, limit = 3) => {
  if (!Array.isArray(recommendations)) return [];
  return recommendations.slice(0, limit).map((recommendation) => {
    const title = recommendation?.title || 'Recommended action';
    const description = recommendation?.description || 'Review this recommendation with a teacher or advisor.';
    return `${title} - ${description}`;
  });
};

const hasRuleBasedRecommendations = (recommendations) =>
  Array.isArray(recommendations)
  && recommendations.some((recommendation) => normalizeMessageText(recommendation?.source) === 'rule_based');

const buildMlAwareResponse = (intent, insight) => {
  if (!insight || insight?.source === 'unavailable') {
    return ML_INSIGHT_UNAVAILABLE_MESSAGE;
  }

  const riskLevel = formatRiskLevel(insight?.riskLevel);
  const prediction = formatPredictionForMessage(insight?.prediction);
  const confidence = formatConfidenceForMessage(insight?.confidence, insight?.confidenceBand);
  const factors = summarizeFactorsForMessage(insight?.factors, intent === 'improvement' ? 2 : 3);
  const recommendations = summarizeRecommendationsForMessage(insight?.recommendations, 3);
  const lowConfidence = hasLowOrUnknownConfidence(insight);
  const ruleBasedRecommendation = hasRuleBasedRecommendations(insight?.recommendations);
  const confidenceNote = lowConfidence ? LOW_CONFIDENCE_CAVEAT : '';
  const ruleBasedNote = ruleBasedRecommendation ? 'Some recommendations are rule-based, not direct model decisions.' : '';

  if (intent === 'risk_explanation') {
    const sections = [];
    sections.push(`Current estimate: ${riskLevel}${prediction ? `, with a prediction value of ${prediction}.` : '.'}`);
    if (confidence) sections.push(`Confidence context: ${confidence}.`);
    if (factors.length > 0) {
      sections.push(`Top signals associated with this estimate:\n${factors.map((factor, index) => `${index + 1}. ${factor}`).join('\n')}`);
    } else {
      sections.push('Factor details are not available yet, so this estimate should be reviewed with your teacher or advisor.');
    }
    sections.push('This insight supports review and planning with your teacher or advisor.');
    if (confidenceNote) sections.push(confidenceNote);
    return sections.join('\n\n');
  }

  if (intent === 'improvement') {
    if (recommendations.length === 0) {
      return [IMPROVEMENT_EMPTY_RECOMMENDATIONS, confidenceNote].filter(Boolean).join('\n\n');
    }

    const sections = [];
    sections.push(`Suggested next steps:\n${recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}`);
    if (factors.length > 0) {
      sections.push(`Signals to review with your teacher:\n${factors.map((factor, index) => `${index + 1}. ${factor}`).join('\n')}`);
    }
    sections.push('This insight supports review and planning with your teacher or advisor.');
    sections.push('Review these actions with a teacher or advisor before making major study changes.');
    if (ruleBasedNote) sections.push(ruleBasedNote);
    if (confidenceNote) sections.push(confidenceNote);
    return sections.join('\n\n');
  }

  if (intent === 'study_plan') {
    if (recommendations.length === 0) {
      const generalPlan = [
        'General guidance (not personalized):',
        '1. Review your weakest topics first.',
        '2. Practice recent assessments and track repeated mistakes.',
        '3. Ask your teacher for targeted feedback on priority gaps.',
        '4. Track progress weekly and adjust your plan.',
      ].join('\n');
      return [generalPlan, confidenceNote].filter(Boolean).join('\n\n');
    }

    const planFromRecommendations = `Study plan based on available recommendations:\n${recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}`;
    return [
      planFromRecommendations,
      'This insight supports review and planning with your teacher or advisor.',
      ruleBasedNote,
      confidenceNote,
    ].filter(Boolean).join('\n\n');
  }

  if (intent === 'career') {
    const careerRecommendations = Array.isArray(insight?.recommendations)
      ? insight.recommendations.filter((recommendation) => normalizeRecommendationType(recommendation?.type) === 'career')
      : [];

    if (careerRecommendations.length === 0) {
      return [CAREER_FALLBACK_MESSAGE, confidenceNote].filter(Boolean).join('\n\n');
    }

    const careerSummary = summarizeRecommendationsForMessage(careerRecommendations, 3);
    const responseSections = [
      `Career-related suggestions from your current insight:\n${careerSummary.map((item, index) => `${index + 1}. ${item}`).join('\n')}`,
      'This insight supports review and planning with your teacher or advisor.',
      'Review these options with a teacher or career advisor before choosing a pathway.',
    ];
    if (ruleBasedNote) responseSections.push(ruleBasedNote);
    if (confidenceNote) responseSections.push(confidenceNote);
    return responseSections.join('\n\n');
  }

  return ML_INSIGHT_UNAVAILABLE_MESSAGE;
};

// Bot message formatter (bold, italic, lists, paragraphs)
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

// Discipline status config
const DISCIPLINE_STATUS_CONFIG = {
  Good:       { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  icon: Shield,      label: "Good Standing"  },
  Warning:    { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  icon: AlertTriangle,label: "Warning Issued" },
  Probation:  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: ShieldAlert,  label: "On Probation"   },
  Suspension: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    icon: ShieldX,      label: "Suspension"     },
};

// Discipline card
// FIX: replaced the old card (which only showed a raw incident count) with a card
// that surfaces discipline_status, discipline_points, open_discipline_cases,
// active_suspensions, and suspension_detail - matching what Jawabu now knows.
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
                  <p className="text-gray-500">{s.start_date} -&gt; {s.end_date}</p>
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
  if (!meta) return <span className="text-xs text-gray-400">-</span>;
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-bold border ${meta.badge}`}>
      {code} - {meta.label}
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

const RiskCard = ({ title, value, riskLevel, icon: IconComponent, description }) => {
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
                {comp.exam_title && <span className="text-gray-400 ml-1 text-[10px]">- {comp.exam_title}</span>}
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
        <h3 className="text-base font-semibold text-white">Jawabu - Academic Assistant</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hi, I'm Jawabu - your CBC Academic Assistant</h3>
          <p className="text-gray-600 mb-3 text-sm max-w-md">
            I can help you understand your grades, explain the difference between exams and assessments, recommend career pathways, and much more.
          </p>
          {analyticsError && (
            <p className="text-xs text-amber-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Analytics could not be loaded - I'll answer from general knowledge.
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
      <p className="text-xs text-gray-400 mt-2 text-center">AI Assistant - CBC Competency-Based Curriculum</p>
    </div>
  </div>
);

// Main component
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
      const res = await fetch(`${API_BASE_URL}/student/chatbot/analytics/`, {
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
      setMlInsight(getMLInsightUnavailable(studentId));
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
        const normalizedInsight = insight || getMLInsightUnavailable(studentId);
        setMlInsight(normalizedInsight);
        setMlLastUpdated(normalizedInsight?.lastUpdated || null);
        if (normalizedInsight?.error) {
          setMlError(normalizedInsight.error);
        } else if (normalizedInsight?.source === "unavailable") {
          setMlError("ML insight is not available yet.");
        } else {
          setMlError(null);
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        setMlInsight(getMLInsightUnavailable(studentId));
        setMlError("ML insight is unavailable right now. Please try again.");
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
      const res = await fetch(`${API_BASE_URL}/student/chatbot/message/`, {
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

      {mlInsight?.source === 'unavailable' && !mlLoading && (
        <p className="text-xs text-gray-500 mb-3">ML insight unavailable</p>
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
          {/* Left - dashboard */}
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

          {/* Right - chat */}
          <div className="w-[380px] flex-shrink-0">
            <ChatPanel isMobileView={false} onClose={() => {}} {...chatPanelProps} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile
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
                <p className="text-sm font-semibold text-gray-800">Jawabu - Academic Assistant</p>
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
