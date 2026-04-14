/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────
//  API HELPER
// ─────────────────────────────────────────────────────────────────
const TOKEN_KEYS = ['access_token', 'accessToken', 'token', 'authToken', 'jwt', 'access'];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getAuthToken() {
  for (const key of TOKEN_KEYS) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }
  return null;
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}/api${cleanPath}`;
  const res = await fetch(url, { ...options, headers });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const bodyText = await res.text();
    throw new Error(
      bodyText.trim().startsWith('<')
        ? `Server returned HTML instead of JSON (HTTP ${res.status}). URL: ${url}`
        : `Unexpected response type "${contentType}" from ${url}`
    );
  }
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || json.detail || `HTTP ${res.status}`);
  return json.data !== undefined ? json.data : json;
}

// ─────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────
const RATING_COLORS = {
  EE1: '#059669', EE2: '#10b981',
  ME1: '#2563eb', ME2: '#3b82f6',
  AE1: '#d97706', AE2: '#f59e0b',
  BE1: '#dc2626', BE2: '#ef4444',
};

const RATING_BG = {
  EE1: 'bg-emerald-600', EE2: 'bg-emerald-500',
  ME1: 'bg-blue-700',    ME2: 'bg-blue-500',
  AE1: 'bg-amber-600',   AE2: 'bg-amber-400',
  BE1: 'bg-red-600',     BE2: 'bg-red-400',
};

const RATING_LABELS = {
  EE1: 'Exceeds Expectations (Highest)', EE2: 'Exceeds Expectations',
  ME1: 'Meets Expectations (Highest)',   ME2: 'Meets Expectations',
  AE1: 'Approaches Expectations (H)',    AE2: 'Approaches Expectations',
  BE1: 'Below Expectations (Highest)',   BE2: 'Below Expectations',
};

const CONFIDENCE_STYLE = {
  High:   'bg-green-50 text-green-700 border-green-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low:    'bg-gray-100 text-gray-600 border-gray-200',
};

const PATHWAY_COLOR = {
  blue:   { card: 'border-blue-200 bg-blue-50',     badge: 'bg-blue-100 text-blue-700',     bar: 'bg-blue-500' },
  green:  { card: 'border-green-200 bg-green-50',   badge: 'bg-green-100 text-green-700',   bar: 'bg-green-500' },
  purple: { card: 'border-purple-200 bg-purple-50', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  orange: { card: 'border-orange-200 bg-orange-50', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
};

// ─────────────────────────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────
const RatingBadge = ({ rating, large = false }) => {
  if (!rating) return null;
  return (
    <span className={`inline-block font-bold rounded-full text-white ${large ? 'text-base px-3 py-1' : 'text-xs px-2 py-0.5'} ${RATING_BG[rating] || 'bg-gray-400'}`}>
      {rating}
    </span>
  );
};

const ProgressBar = ({ pct, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(pct || 0, 100)}%` }} />
  </div>
);

const Spinner = ({ text = 'Loading…' }) => (
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

const AiSection = ({ title, content }) => (
  <div className="border border-gray-200 rounded-2xl p-5 bg-white">
    <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-100 pb-2">{title}</h4>
    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{content}</div>
  </div>
);

const SubjectTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{d.full}</p>
      <p className="text-gray-500">Points: <span className="font-medium text-gray-800">{d.points}/8</span></p>
      <p className="text-gray-500">Rating: <span className="font-medium" style={{ color: RATING_COLORS[d.rating] }}>{d.rating}</span></p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
//  PATHWAY CARD
// ─────────────────────────────────────────────────────────────────
const PathwayCard = ({ pathway, isTop = false }) => {
  const colors = PATHWAY_COLOR[pathway.color] || PATHWAY_COLOR.blue;
  return (
    <div className={`border-2 rounded-2xl p-5 ${isTop ? colors.card + ' shadow-md' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{pathway.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{pathway.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{pathway.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
          {isTop && <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">Top Match</span>}
          <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${CONFIDENCE_STYLE[pathway.confidence] || CONFIDENCE_STYLE.Low}`}>
            {pathway.confidence}
          </span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Match</span>
          <span className="font-semibold text-gray-800">{pathway.matchScore}%</span>
        </div>
        <ProgressBar pct={pathway.matchScore} color={colors.bar} />
      </div>
      {pathway.matchFactors?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {pathway.matchFactors.map((f, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{f}</span>
          ))}
        </div>
      )}
      {pathway.recommendedCareers && (
        <p className="text-xs text-gray-600 mb-2">{pathway.recommendedCareers.slice(0, 3).join(' · ')}</p>
      )}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Avg Salary</p>
          <p className="text-xs font-medium text-gray-700">{pathway.averageSalary}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Universities</p>
          <p className="text-xs font-medium text-gray-700">{(pathway.universities || []).slice(0, 2).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
//  STUDENT DETAIL PANEL (slide-over)
// ─────────────────────────────────────────────────────────────────
function StudentPanel({ studentSummary, academicYear, term, onClose }) {
  const [profile, setProfile] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [activeTab, setActiveTab] = useState('pathway');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [toast, setToast] = useState(null);

  const showError = (msg) => setToast({ type: 'error', msg });
  const showSuccess = (msg) => setToast({ type: 'success', msg });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    setProfile(null);
    setAiData(null);
    setActiveTab('pathway');

    apiFetch(`/registrar/analytics/student-profile/?student_id=${studentSummary.id}`)
      .then(data => { if (!cancelled) setProfile(data); })
      .catch(e => { if (!cancelled) showError(e.message); })
      .finally(() => { if (!cancelled) setLoadingProfile(false); });

    return () => { cancelled = true; };
  }, [studentSummary.id]);

  const runAI = async () => {
    setLoadingAI(true);
    setAiData(null);
    setActiveTab('ai');
    try {
      const data = await apiFetch('/registrar/analytics/ai-analysis/', {
        method: 'POST',
        body: JSON.stringify({ student_id: studentSummary.id, academic_year: academicYear, term }),
      });
      setAiData(data);
      showSuccess(`AI analysis complete using ${data.provider} (${data.model})`);
    } catch (e) {
      showError('AI analysis failed: ' + e.message);
      setActiveTab('pathway');
    } finally {
      setLoadingAI(false);
    }
  };

  const radarData = profile?.competencies
    ? Object.entries(profile.competencies).map(([name, pct]) => ({
        competency: name.length > 14 ? name.slice(0, 13) + '…' : name,
        score: pct,
        fullMark: 100,
      }))
    : [];

  const barData = profile?.learningAreas?.map(s => ({
    subject: s.name.length > 13 ? s.name.slice(0, 12) + '…' : s.name,
    points: s.points,
    rating: s.rating,
    full: s.name,
    fill: RATING_COLORS[s.rating] || '#94a3b8',
  })) || [];

  const TABS = [
    { id: 'pathway', label: 'Career Pathway' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'competencies', label: 'Competencies', hide: radarData.length === 0 },
    { id: 'ai', label: 'AI Analysis' },
  ].filter(t => !t.hide);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {studentSummary.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{studentSummary.name}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                <span>{studentSummary.admissionNo}</span>
                {studentSummary.upi && <><span>·</span><span>UPI: {studentSummary.upi}</span></>}
                <span>·</span>
                <RatingBadge rating={studentSummary.overallGrade} />
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                  {studentSummary.overallPercentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={runAI}
              disabled={loadingAI || loadingProfile}
              className="flex items-center px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loadingAI && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />}
              {loadingAI ? 'Generating…' : '🤖 AI Analysis'}
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex-shrink-0">
          <nav className="flex space-x-6">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                  activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loadingProfile && <Spinner text="Loading student profile…" />}

          {!loadingProfile && profile && (
            <>
              {/* CAREER PATHWAY TAB */}
              {activeTab === 'pathway' && (
                <div className="space-y-5">
                  {!profile.isGrade9 ? (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                      <p className="text-blue-800 font-semibold mb-1">Career Pathway Guidance</p>
                      <p className="text-blue-600 text-sm">Available only for Grade 9 students.</p>
                    </div>
                  ) : !profile.pathwayRecommendations?.length ? (
                    <Empty title="No pathway data" sub="Subject ratings are needed to generate recommendations." />
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">🏆 Top Recommended Pathway</h3>
                        <PathwayCard pathway={profile.pathwayRecommendations[0]} isTop />
                      </div>
                      {profile.pathwayRecommendations.length > 1 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-600 mb-3">Other Pathways</h3>
                          <div className="space-y-3">
                            {profile.pathwayRecommendations.slice(1).map(p => (
                              <PathwayCard key={p.id} pathway={p} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        {profile.bestSubjects?.length > 0 && (
                          <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-4">
                            <h4 className="font-semibold text-emerald-800 mb-2 text-sm">⭐ Strongest</h4>
                            {profile.bestSubjects.map((s, i) => (
                              <div key={i} className="flex items-center justify-between py-1">
                                <span className="text-xs text-gray-700">{s.name}</span>
                                <RatingBadge rating={s.rating} />
                              </div>
                            ))}
                          </div>
                        )}
                        {profile.needsSupportSubjects?.length > 0 && (
                          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-4">
                            <h4 className="font-semibold text-amber-800 mb-2 text-sm">📌 Needs Support</h4>
                            {profile.needsSupportSubjects.map((s, i) => (
                              <div key={i} className="flex items-center justify-between py-1">
                                <span className="text-xs text-gray-700">{s.name}</span>
                                <RatingBadge rating={s.rating} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SUBJECTS TAB */}
              {activeTab === 'subjects' && (
                <div className="space-y-5">
                  {barData.length === 0 ? (
                    <Empty title="No subject ratings yet" sub="Ratings appear once teachers submit assessments." />
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-gray-600">Performance by Learning Area</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-35} textAnchor="end" interval={0} />
                          <YAxis domain={[0, 8]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <Tooltip content={<SubjectTooltip />} />
                          <Bar dataKey="points" radius={[5, 5, 0, 0]}>
                            {barData.map((entry, index) => (
                              <rect key={index} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {(profile.learningAreas || []).slice().sort((a, b) => b.points - a.points).map((s, i) => (
                          <div key={i} className="border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">{s.name}</span>
                                {s.assessment_type && (
                                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{s.assessment_type}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{s.points}/8</span>
                                <RatingBadge rating={s.rating} />
                              </div>
                            </div>
                            <ProgressBar pct={(s.points / 8) * 100} color={s.points >= 6 ? 'bg-emerald-500' : s.points >= 4 ? 'bg-blue-500' : s.points >= 2 ? 'bg-amber-500' : 'bg-red-400'} />
                            {s.comment && <p className="text-xs text-gray-400 mt-1.5 italic">"{s.comment}"</p>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* COMPETENCIES TAB */}
              {activeTab === 'competencies' && (
                <div className="space-y-5">
                  {radarData.length === 0 ? (
                    <Empty title="No competency data" sub="Competency ratings appear once assessments are completed." />
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="competency" tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                          <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {Object.entries(profile.competencies || {}).sort(([, a], [, b]) => b - a).map(([name, pct]) => (
                          <div key={name}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700">{name}</span>
                              <span className="font-medium text-gray-800">{pct}%</span>
                            </div>
                            <ProgressBar pct={pct} color={pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 25 ? 'bg-amber-500' : 'bg-red-400'} />
                          </div>
                        ))}
                      </div>
                      {profile.values && Object.keys(profile.values).length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-600 mb-3">Values &amp; Character</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(profile.values).map(([name, pct]) => (
                              <div key={name} className="border border-gray-100 rounded-xl p-3 text-center">
                                <div className="text-xl font-bold text-blue-600 mb-0.5">{pct}%</div>
                                <div className="text-xs text-gray-500 mb-1.5">{name}</div>
                                <ProgressBar pct={pct} color={pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* AI ANALYSIS TAB */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  {loadingAI && <Spinner text="Generating AI analysis… this may take a moment." />}
                  {!loadingAI && !aiData && (
                    <div className="text-center py-12">
                      <p className="text-3xl mb-3">🤖</p>
                      <p className="font-semibold text-gray-700 mb-1">No AI Analysis Yet</p>
                      <p className="text-sm text-gray-400 mb-5">Click the button above to generate a detailed CBC report.</p>
                      <button onClick={runAI} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-2xl hover:bg-purple-700 transition-colors">
                        Run AI Analysis
                      </button>
                    </div>
                  )}
                  {!loadingAI && aiData && (
                    <>
                      <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl px-4 py-2.5">
                        <span className="text-xs text-purple-700">🤖 <strong>{aiData.provider}</strong> · {aiData.model}</span>
                        <button onClick={runAI} disabled={loadingAI} className="text-xs text-purple-600 hover:text-purple-800 font-medium underline underline-offset-2">
                          Regenerate
                        </button>
                      </div>
                      {aiData.isGrade9 && aiData.topPathway && (
                        <div className="border border-purple-200 bg-purple-50 rounded-2xl p-4">
                          <p className="text-xs font-medium text-purple-500 mb-2">Recommended Grade 10 Pathway</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{aiData.topPathway.icon}</span>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{aiData.topPathway.name}</p>
                                <p className="text-xs text-gray-500">Match: {aiData.topPathway.matchScore}%</p>
                              </div>
                            </div>
                            <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${CONFIDENCE_STYLE[aiData.topPathway.confidence] || CONFIDENCE_STYLE.Low}`}>
                              {aiData.topPathway.confidence}
                            </span>
                          </div>
                        </div>
                      )}
                      {aiData.sections && Object.keys(aiData.sections).length > 0
                        ? Object.entries(aiData.sections).map(([title, content]) => (
                            <AiSection key={title} title={title} content={content} />
                          ))
                        : aiData.fullNarrative && (
                            <AiSection title="Full Analysis" content={aiData.fullNarrative} />
                          )
                      }
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Panel Toast */}
        {toast && (
          <div className={`absolute bottom-4 left-4 right-4 z-10 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-xs font-medium
            ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
          >
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="flex-1">{toast.msg}</span>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  CLASS ROSTER
// ─────────────────────────────────────────────────────────────────
function ClassRoster({ students, classObj, onSelectStudent }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase())
    )
    .slice()
    .sort((a, b) => {
      if (sort === 'pct')   return b.overallPercentage - a.overallPercentage;
      if (sort === 'grade') return (a.overallGrade || '').localeCompare(b.overallGrade || '');
      return a.name.localeCompare(b.name);
    });

  const dist = students.reduce((acc, s) => {
    const g = s.overallGrade || 'N/A';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const avgPct = students.length
    ? Math.round(students.reduce((sum, s) => sum + (s.overallPercentage || 0), 0) / students.length)
    : 0;
  const graded = students.filter(s => s.hasReport).length;

  return (
    <div className="space-y-6">
      {/* Class Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs text-blue-500 font-medium">Total Students</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{students.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs text-emerald-500 font-medium">Avg Performance</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{avgPct}%</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-xs text-purple-500 font-medium">Reports Submitted</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">{graded}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-xs text-amber-500 font-medium">Grade &amp; Stream</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {classObj.numericLevel}
            {classObj.stream && <span className="text-lg font-semibold ml-0.5">{classObj.stream}</span>}
          </p>
        </div>
      </div>

      {/* Grade Distribution */}
      {Object.keys(dist).length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">Grade Distribution</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dist)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([grade, count]) => (
                <div key={grade} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
                  <RatingBadge rating={grade} />
                  <span className="text-sm font-semibold text-gray-700">{count}</span>
                  <span className="text-xs text-gray-400">student{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Search & Sort */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or admission no…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="name">Sort: Name</option>
          <option value="pct">Sort: Performance ↓</option>
          <option value="grade">Sort: Grade</option>
        </select>
      </div>

      {/* Student Rows */}
      {filtered.length === 0 ? (
        <Empty title="No students found" sub="Try a different search term." />
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectStudent(s)}
              className="w-full text-left border border-gray-100 rounded-2xl px-5 py-4 hover:border-blue-300 hover:bg-blue-50/40 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.admissionNo}{s.upi ? ` · UPI: ${s.upi}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {s.hasReport ? (
                  <>
                    <span className="text-xs text-gray-400 hidden sm:block">{s.gradedSubjectsCount} subject{s.gradedSubjectsCount !== 1 ? 's' : ''}</span>
                    <span className="text-sm font-bold text-gray-700 hidden sm:block">{s.overallPercentage}%</span>
                    <RatingBadge rating={s.overallGrade} />
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No report yet</span>
                )}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN ANALYTICS COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [academicYear, setAcademicYear] = useState('2025');
  const [term, setTerm] = useState('Term 1');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [toast, setToast] = useState(null);

  const showError = (msg) => setToast({ type: 'error', msg });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadClasses = useCallback(async () => {
    setLoadingClasses(true);
    try {
      const data = await apiFetch(`/registrar/analytics/classes/?academic_year=${academicYear}&term=${term}`);
      setClasses(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoadingClasses(false);
    }
  }, [academicYear, term]);

  useEffect(() => {
    loadClasses();
    setSelectedClass('');
    setStudents([]);
    setActiveStudent(null);
  }, [academicYear, term]);

  const onClassChange = async (e) => {
    const id = e.target.value;
    setSelectedClass(id);
    setStudents([]);
    setActiveStudent(null);
    if (!id) return;

    setLoadingStudents(true);
    try {
      const data = await apiFetch(`/registrar/analytics/students/?class_id=${id}&academic_year=${academicYear}&term=${term}`);
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const selectedClassObj = classes.find(c => String(c.id) === String(selectedClass));

  // Group classes by grade level for <optgroup> rendering
  const classesByGrade = classes.reduce((acc, c) => {
    const key = `Grade ${c.numericLevel}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Registrar Analytics &amp; Career Pathways</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            School-wide AI-powered CBC insights · Select year, term and class stream
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filters — 3 columns, no student dropdown */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
              <select
                value={term}
                onChange={e => setTerm(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            {/* Class & Stream — grouped by grade via <optgroup> */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class &amp; Stream</label>
              {loadingClasses ? (
                <div className="h-12 bg-gray-100 animate-pulse rounded-3xl" />
              ) : (
                <select
                  value={selectedClass}
                  onChange={onClassChange}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select class &amp; stream…</option>
                  {Object.entries(classesByGrade).map(([gradeLabel, gradeClasses]) => (
                    <optgroup key={gradeLabel} label={gradeLabel}>
                      {gradeClasses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.className}{c.stream ? ` — Stream ${c.stream}` : ''} ({c.studentCount} students)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        {!selectedClass && (
          <Empty
            title="Select a class and stream to begin"
            sub="Choose year, term and class stream above to view the student roster and CBC analytics."
          />
        )}

        {selectedClass && loadingStudents && <Spinner text="Loading class roster…" />}

        {selectedClass && !loadingStudents && students.length === 0 && (
          <Empty title="No students found" sub="This class has no active students for the selected period." />
        )}

        {selectedClass && !loadingStudents && students.length > 0 && selectedClassObj && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedClassObj.className}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Grade {selectedClassObj.numericLevel}
                  {selectedClassObj.stream ? ` · Stream ${selectedClassObj.stream}` : ''}
                  {selectedClassObj.isGrade9 && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                      Grade 9 — Career Pathway Year
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">Click a student to view their CBC profile →</p>
            </div>

            <ClassRoster
              students={students}
              classObj={selectedClassObj}
              onSelectStudent={setActiveStudent}
            />
          </div>
        )}
      </div>

      {/* Student Detail Slide-over Panel */}
      {activeStudent && (
        <StudentPanel
          studentSummary={activeStudent}
          academicYear={academicYear}
          term={term}
          onClose={() => setActiveStudent(null)}
        />
      )}

      {/* Global Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-3xl shadow-xl border text-sm font-medium max-w-md
          ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}