/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { fetchStudentMLInsight } from '../../services/mlApi';
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
    return [planFromRecommendations, ruleBasedNote, confidenceNote].filter(Boolean).join('\n\n');
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
      'Review these options with a teacher or career advisor before choosing a pathway.',
    ];
    if (ruleBasedNote) responseSections.push(ruleBasedNote);
    if (confidenceNote) responseSections.push(confidenceNote);
    return responseSections.join('\n\n');
  }

  return ML_INSIGHT_UNAVAILABLE_MESSAGE;
};

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

const PerformanceTrend = ({ data = [] }) => (
  <div className="space-y-3">
    {data.length === 0 && <p className="text-xs text-gray-400">No trend data available yet.</p>}
    {data.map((item, idx) => (
      <div key={idx} className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">{item.term}</span>
          <span className="font-medium text-gray-800">{item.value}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className={`h-2 rounded-full ${barColor(item.value)}`} style={{ width: `${item.value}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const CompetencyMastery = ({ competencies = [] }) => (
  <div className="space-y-4">
    {competencies.length === 0 && <p className="text-xs text-gray-400">No competency data available yet.</p>}
    {competencies.map((comp, idx) => (
      <div key={idx} className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-700 font-medium">{comp.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{comp.mastery}%</span>
            <CompetencyBadge percentage={comp.mastery} />
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className={`h-2 rounded-full ${barColor(comp.mastery)}`} style={{ width: `${comp.mastery}%` }} />
        </div>
      </div>
    ))}
  </div>
);

// ─── Chat message component (formatted bot responses) ────────────────────────
const ChatMessage = React.memo(({ message, isUser, timestamp }) => {
  const content = isUser ? (
    <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
  ) : (
    formatBotMessage(message)
  );
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${isUser ? 'bg-blue-600' : 'bg-green-700'}`}>
            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
        </div>
        <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-2 rounded-xl border border-gray-200 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
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
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-2">
        <div className="w-8 h-8 bg-green-700 flex items-center justify-center rounded-xl">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
        <div className="flex gap-1">
          {[0, 150, 300].map((delay) => (
            <div key={delay} className="w-2 h-2 bg-gray-500 animate-bounce rounded-full" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
));

// ─── Chat panel — defined OUTSIDE Chatbot so it never remounts on re-render ──
const ChatPanel = ({
  isMobileView,
  onClose,
  messages,
  isTyping,
  isSending,
  inputValue,
  handleInputChange,
  handleKeyPress,
  handleSend,
  handleSuggestionClick,
  analyticsError,
  messagesEndRef,
  inputRef,
}) => (
  <div className={`flex flex-col bg-white border border-gray-200 shadow-xl ${isMobileView ? 'fixed inset-0 z-50' : 'h-full rounded-xl'}`}>
    <div className={`flex items-center ${isMobileView ? 'justify-between' : ''} gap-3 p-4 bg-green-700 border-b border-green-800 ${!isMobileView ? 'rounded-t-xl' : ''}`}>
      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl flex-shrink-0">
        <Bot className="w-5 h-5 text-green-700" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-white">Jawabu an Accademic Assistant</h3>
        <p className="text-xs text-green-100">AI-Powered | Competency-Based Curriculum Support</p>
      </div>
      {isMobileView && (
        <button onClick={onClose} className="text-white/70 hover:text-white ml-2">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-xl mb-4">
            <Brain className="w-10 h-10 text-green-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hi, I'm your CBC Academic Assistant</h3>
          <p className="text-gray-600 mb-6 text-sm max-w-md">
            I can help you understand your competency mastery, recommend career pathways,
            analyse performance risks, and provide personalised learning recommendations.
          </p>
          {analyticsError && (
            <p className="text-xs text-amber-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Analytics could not be loaded — the AI will answer from general knowledge.
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
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.timestamp} />
          ))}
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
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [mlInsight, setMlInsight] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);
  const [mlLastUpdated, setMlLastUpdated] = useState(null);
  const [mlReloadKey, setMlReloadKey] = useState(0);

  const analyticsLoading = mlLoading;
  const analyticsError = mlError;

  const refreshMlInsight = useCallback(() => {
    setMlReloadKey((prev) => prev + 1);
  }, []);

  const studentId = useMemo(() => {
    return user?.student_id || user?.student?.id || user?.student_profile?.id || null;
  }, [user]);

  const analyticsData = useMemo(() => {
    const studentName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student';
    const predictionValue = mlInsight?.prediction;
    const riskLevel = mlInsight?.riskLevel || 'unknown';
    const riskPercent = typeof predictionValue === 'number'
      ? `${Math.round(predictionValue * 100)}%`
      : 'Prediction unavailable';

    return {
      student_name: studentName,
      student_class: user?.student_class || user?.class_name || '',
      admission_no: user?.admission_no || '',
      confidence_score: mlInsight?.confidence ?? null,
      recommendations: mlInsight?.recommendations ?? [],
      top_factors: mlInsight?.factors ?? [],
      overall_competency: typeof predictionValue === 'number' ? Math.round(predictionValue * 100) : 0,
      performance_trend: [],
      competencies: [],
      career_pathways: [],
      risks: predictionValue === null
        ? {}
        : {
            failure_risk: {
              value: riskPercent,
              level: riskLevel,
              description: 'ML-based estimate from available student signals.',
            },
          },
      source: mlInsight?.source ?? 'unavailable',
      last_updated: mlLastUpdated,
    };
  }, [mlInsight, mlLastUpdated, user]);

  // Canonical ML interface (frontend abstraction)
  const mlInsights = analyticsData ? {
    // Core ML fields (matches spec)
    prediction: mlInsight?.prediction ?? null,
    confidence: mlInsight?.confidence ?? null,
    recommendations: mlInsight?.recommendations ?? [],
    factors: mlInsight?.factors ?? [],

    // Existing fields (backward compatibility)
    overall_competency: analyticsData.overall_competency || 0,
    performance_trend: analyticsData.performance_trend || [],
    competencies: analyticsData.competencies || [],
    risks: analyticsData.risks || {},
    career_pathways: analyticsData.career_pathways || []
  } : null;

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch ML insight when chat is open and user context is ready.
  useEffect(() => {
    const isChatOpen = !isMobile || isMobileChatOpen;
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
        if (insight?.source === 'unavailable') {
          setMlError('ML insight unavailable');
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setMlError(err?.message || 'Unable to load ML insight.');
        setMlInsight(null);
        setMlLastUpdated(null);
      } finally {
        if (!controller.signal.aborted) {
          setMlLoading(false);
        }
      }
    };

    loadMlInsight();

    return () => controller.abort();
  }, [isMobile, isMobileChatOpen, isAuthenticated, studentId, getAuthHeaders, mlReloadKey]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isMobileChatOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isMobileChatOpen]);

  // Send message function
  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isSending) return;
    setIsSending(true);

    setMessages(prev => [...prev, {
      id: Date.now(), text: message, isUser: true, timestamp: getTimestamp()
    }]);
    setInputValue('');
    setIsTyping(true);

    const mlIntent = detectMlIntent(message);
    if (mlIntent) {
      const mlAwareReply = buildMlAwareResponse(mlIntent, mlInsight);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: mlAwareReply,
        isUser: false,
        timestamp: getTimestamp(),
      }]);
      setIsTyping(false);
      setIsSending(false);
      return;
    }

    try {
      const context = {
        student_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
        student_class: user?.student_class || user?.class_name || '',
        admission_no: user?.admission_no || '',
        student_role:  user?.role || 'student',
      };

      const res = await fetch(`${API_BASE_URL}/api/student/chatbot/message/`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context,
          conversation_history: messages.slice(-10).map(m => ({
            role:    m.isUser ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botText = res.ok
        ? (data.response || 'Thank you for your message. How else can I help you?')
        : (data.error   || 'Something went wrong. Please try again.');

      setMessages(prev => [...prev, {
        id: Date.now() + 1, text: botText, isUser: false, timestamp: getTimestamp()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'I am having trouble connecting. Please check your connection and try again.',
        isUser: false,
        timestamp: getTimestamp(),
      }]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [user, getAuthHeaders, messages, isSending, mlInsight]);

  const handleSuggestionClick = useCallback((query) => sendMessage(query), [sendMessage]);
  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isSending) sendMessage(inputValue);
  }, [inputValue, isSending, sendMessage]);
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isSending) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend, isSending]);
  const handleInputChange = useCallback((e) => setInputValue(e.target.value), []);

  const studentName = analyticsData?.student_name || user?.first_name || 'Student';
  const isChatOpen = !isMobile || isMobileChatOpen;
  const canRefreshMlInsight = isAuthenticated && isChatOpen && !mlLoading;

  const riskDisplay = formatRiskLevel(mlInsight?.riskLevel);
  const predictionDisplay = formatPredictionValue(mlInsight?.prediction);
  const confidenceDisplay = formatConfidenceValue(mlInsight?.confidence);
  const confidenceBandDisplay = formatConfidenceBand(mlInsight?.confidenceBand);
  const sourceDisplay = formatMlSource(mlInsight?.source);
  const lastUpdatedDisplay = formatLastUpdated(mlLastUpdated || mlInsight?.lastUpdated);
  const isInsightStale = isMlInsightStale(mlLastUpdated || mlInsight?.lastUpdated);
  const missingMlFields = predictionDisplay === 'Prediction unavailable'
    || confidenceDisplay === 'Confidence unavailable';
  const mlErrorDisplay = analyticsError && analyticsError !== 'ML insight unavailable'
    ? `ML insight unavailable: ${analyticsError}`
    : analyticsError;
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

  if (analyticsLoading && !mlInsight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading ML insights...</p>
        </div>
      </div>
    );
  }

  const overall = mlInsights?.overall_competency ?? 0;
  const trend = mlInsights?.performance_trend ?? [];
  const competencies = mlInsights?.competencies ?? [];
  const risks = mlInsights?.risks ?? {};
  const pathways = mlInsights?.career_pathways ?? [];
  const prediction = mlInsights?.prediction;
  const confidence = mlInsights?.confidence;
  const recommendations = mlInsights?.recommendations ?? [];
  const topFactors = mlInsights?.factors ?? [];

  // Shared chat panel props
  const chatPanelProps = {
    messages,
    isTyping,
    isSending,
    inputValue,
    handleInputChange,
    handleKeyPress,
    handleSend,
    handleSuggestionClick,
    analyticsError,
    messagesEndRef,
    inputRef,
  };

  // Desktop layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen gap-6 p-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Header */}
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
                {mlErrorDisplay || 'ML insight unavailable'}
                <button onClick={refreshMlInsight} className="ml-3 underline text-amber-800 font-medium">Retry</button>
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
                <CompetencyBadge percentage={overall} />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 bg-green-600 rounded-full transition-all duration-700" style={{ width: `${overall}%` }} />
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-800">{overall}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <CBCLegend />
              </div>
            </div>

            {/* Risk Cards */}
            <div className="grid grid-cols-3 gap-4">
              {risks.failure_risk && (
                <RiskCard title="Failure Risk" value={risks.failure_risk.value} riskLevel={risks.failure_risk.level} icon={AlertTriangle} description={risks.failure_risk.description} />
              )}
              {risks.dropout_risk && (
                <RiskCard title="Dropout Risk" value={risks.dropout_risk.value} riskLevel={risks.dropout_risk.level} icon={Shield} description={risks.dropout_risk.description} />
              )}
              {risks.intervention_needed && (
                <RiskCard title="Interventions Needed" value={risks.intervention_needed.value} riskLevel={risks.intervention_needed.level} icon={Activity} description={risks.intervention_needed.description} />
              )}
              {!risks.failure_risk && !risks.dropout_risk && !risks.intervention_needed && (
                <p className="col-span-3 text-xs text-gray-400">Risk data not available yet.</p>
              )}
            </div>

            {/* Trend + Pathways */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Competency Performance Trend</h3>
                </div>
                <PerformanceTrend data={trend} />
              </div>
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
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: `${p.match}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">Based on: {(p.competencies || []).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Competency Mastery */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Competency Area Mastery</h3>
              </div>
              <CompetencyMastery competencies={competencies} />
            </div>
          </div>

          {/* Chat Panel Desktop */}
          <div className="w-[380px] flex-shrink-0">
            <ChatPanel isMobileView={false} onClose={() => {}} {...chatPanelProps} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
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
            {mlErrorDisplay || 'ML insight unavailable'}
            <button onClick={refreshMlInsight} className="ml-2 underline font-medium">Retry</button>
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
            <CompetencyBadge percentage={overall} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${overall}%` }} />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-800">{overall}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {risks.failure_risk && <RiskCard title="Failure Risk" value={risks.failure_risk.value} riskLevel={risks.failure_risk.level} icon={AlertTriangle} description={risks.failure_risk.description} />}
          {risks.dropout_risk && <RiskCard title="Dropout Risk" value={risks.dropout_risk.value} riskLevel={risks.dropout_risk.level} icon={Shield} description={risks.dropout_risk.description} />}
          {risks.intervention_needed && <RiskCard title="Interventions" value={risks.intervention_needed.value} riskLevel={risks.intervention_needed.level} icon={Activity} description={risks.intervention_needed.description} />}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Performance Trend</h3>
          </div>
          <PerformanceTrend data={trend} />
        </div>

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
                <div className="h-1.5 bg-gray-200 rounded-full">
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
          <div className="space-y-3">
            {competencies.slice(0, 6).map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">{comp.name}</span>
                  <span className="text-gray-600">{comp.mastery}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-1.5 rounded-full ${barColor(comp.mastery)}`} style={{ width: `${comp.mastery}%` }} />
                </div>
              </div>
            ))}
            {competencies.length === 0 && <p className="text-xs text-gray-400">No competency data yet.</p>}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 flex items-center justify-center rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">CBC Academic Assistant</p>
                <p className="text-xs text-gray-600">Ask about competencies, careers, or risks</p>
              </div>
            </div>
            <button onClick={() => setIsMobileChatOpen(true)}
              className="px-4 py-2 bg-green-700 text-white text-sm hover:bg-green-800 flex items-center gap-2 rounded-xl">
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
