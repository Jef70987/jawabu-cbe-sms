/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────
//  CBC GRADE MAPPING – EXACTLY MATCHING REPORT CARD ANALYZER
// ─────────────────────────────────────────────────────────────────
const CBC_META = {
  EE1: { label: 'Exceptional',       badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', bar: 'bg-emerald-500', hex: '#10b981' },
  EE2: { label: 'Very Good',         badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-400', hex: '#34d399' },
  ME1: { label: 'Good',              badge: 'bg-sky-100 text-sky-800 border-sky-300',             bar: 'bg-sky-500',   hex: '#0ea5e9' },
  ME2: { label: 'Fair',              badge: 'bg-sky-100 text-sky-700 border-sky-200',             bar: 'bg-sky-400',   hex: '#38bdf8' },
  AE2: { label: 'Needs Improvement', badge: 'bg-amber-100 text-amber-800 border-amber-300',       bar: 'bg-amber-500', hex: '#f59e0b' },
  AE1: { label: 'Below Average',     badge: 'bg-amber-100 text-amber-700 border-amber-200',       bar: 'bg-amber-400', hex: '#fbbf24' },
  BE2: { label: 'Well Below Average',badge: 'bg-rose-100 text-rose-800 border-rose-300',          bar: 'bg-rose-500',  hex: '#f43f5e' },
  BE1: { label: 'Minimal',           badge: 'bg-rose-100 text-rose-700 border-rose-200',          bar: 'bg-rose-400',  hex: '#fb7185' },
};

// Percent → CBC code (matches backend exactly)
const percentageToCbcCode = (perc) => {
  if (perc === null || perc === undefined) return null;
  const p = parseFloat(perc);
  if (isNaN(p)) return null;
  if (p >= 90) return 'EE1';
  if (p >= 75) return 'EE2';
  if (p >= 60) return 'ME1';
  if (p >= 40) return 'ME2';
  if (p >= 30) return 'AE2';
  if (p >= 20) return 'AE1';
  if (p >= 10) return 'BE2';
  return 'BE1';
};

const getCbcGrade = (perc) => {
  const code = percentageToCbcCode(perc);
  return code ? { code, ...CBC_META[code] } : null;
};

// Convert CBC code to midpoint percent for progress bars
const codeToPercent = (code) => {
  const map = { EE1: 95, EE2: 82, ME1: 67, ME2: 49.5, AE2: 34.5, AE1: 24.5, BE2: 14.5, BE1: 5 };
  return map[code] || 0;
};

// ─────────────────────────────────────────────────────────────────
//  API HELPER — FIXED & PRODUCTION READY
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
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}/api${cleanPath}`;
  const res = await fetch(url, { ...options, headers });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const bodyText = await res.text();
    const isHtml = bodyText.trim().startsWith('<');
    if (isHtml) {
      if (res.status === 401 || res.status === 403 || res.url.includes('login')) {
        throw new Error(
          `Auth failed (HTTP ${res.status}). Token found: ${token ? 'YES' : 'NO'}. URL: ${url}`
        );
      }
      throw new Error(`Server returned HTML instead of JSON (HTTP ${res.status}). URL: ${url}`);
    }
    throw new Error(`Unexpected response type "${contentType}" from ${url} (HTTP ${res.status})`);
  }

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || json.detail || `HTTP ${res.status} from ${url}`);
  }
  return json.data !== undefined ? json.data : json;
}

// ─────────────────────────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────
const RatingBadge = ({ rating, large = false }) => {
  if (!rating) return null;
  const meta = CBC_META[rating];
  if (!meta) return <span className="text-xs text-gray-400">{rating}</span>;
  return (
    <span className={`inline-flex font-bold rounded-lg border ${large ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1'} ${meta.badge}`}>
      {rating}
    </span>
  );
};

const Bar2 = ({ pct, colorClass = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div className={`h-2 rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${Math.min(pct || 0, 100)}%` }} />
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
  <div className="border border-gray-200 rounded-xl p-6 bg-white">
    <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-3">{title}</h4>
    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{content}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [profile, setProfile] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [activeTab, setActiveTab] = useState('pathway');

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
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
    (async () => {
      try {
        const data = await apiFetch('/analytics/classes/');
        setClasses(Array.isArray(data) ? data : []);
      } catch (e) {
        showError(e.message);
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, []);

  const onClassChange = async (e) => {
    const id = e.target.value;
    setSelectedClass(id);
    setSelectedStudent('');
    setProfile(null);
    setAiData(null);
    setStudents([]);
    if (!id) return;

    setLoadingStudents(true);
    try {
      const data = await apiFetch(`/analytics/students/?class_id=${id}`);
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const onStudentChange = async (e) => {
    const id = e.target.value;
    setSelectedStudent(id);
    setProfile(null);
    setAiData(null);
    setActiveTab('pathway');
    if (!id) return;

    setLoadingProfile(true);
    try {
      const data = await apiFetch(`/analytics/student-profile/?student_id=${id}`);
      setProfile(data);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const runAI = async () => {
    if (!selectedStudent) return;
    setLoadingAI(true);
    setAiData(null);
    setActiveTab('ai');
    try {
      const data = await apiFetch('/analytics/ai-analysis/', {
        method: 'POST',
        body: JSON.stringify({ student_id: selectedStudent }),
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

  const selectedClassObj = classes.find(c => String(c.id) === String(selectedClass));
  const isGrade9 = selectedClassObj?.isGrade9 || profile?.isGrade9;

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
    fill: CBC_META[s.rating]?.hex || '#94a3b8',
  })) || [];

  const TABS = [
    { id: 'pathway', label: 'Career Pathway' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'competencies', label: 'Competencies', hide: radarData.length === 0 },
    { id: 'ai', label: 'AI Analysis' },
  ].filter(t => !t.hide);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics &amp; Career Pathways</h1>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered CBC learner insights · Grade 9 students get Grade 10 pathway guidance
              </p>
            </div>
            {selectedStudent && (
              <button
                onClick={runAI}
                disabled={loadingAI || loadingProfile}
                className="flex items-center px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingAI ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : null}
                {loadingAI ? 'Generating Analysis...' : 'Run AI Analysis'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Selectors */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class / Grade</label>
              {loadingClasses ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
              ) : (
                <select
                  value={selectedClass}
                  onChange={onClassChange}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a class…</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.className} ({c.studentCount} students){c.isGrade9 ? ' — Grade 9 Exit' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Student</label>
              {loadingStudents ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
              ) : (
                <select
                  value={selectedStudent}
                  onChange={onStudentChange}
                  disabled={!selectedClass || students.length === 0}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
                >
                  <option value="">
                    {!selectedClass ? 'Select a class first' : students.length === 0 ? 'No students in this class' : 'Select a student…'}
                  </option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionNo}){s.overallGrade ? ` — ${s.overallGrade}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {loadingProfile && <Spinner text="Loading student profile…" />}
        {!loadingProfile && !profile && (
          <Empty title="Select a class and student to begin" sub="Choose from your assigned classes, then pick a learner to view their CBC analytics and career pathway." />
        )}

        {!loadingProfile && profile && (
          <>
            {/* Profile Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{profile.admissionNo}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{profile.className}</span>
                        {profile.upi && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>UPI: {profile.upi}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Use new CBC badge style */}
                      {profile.overallGrade && <RatingBadge rating={profile.overallGrade} large />}
                      <div className="px-4 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-2xl border border-blue-200">
                        {profile.overallPercentage}% average
                      </div>
                      {profile.isGrade9 && (
                        <div className="px-4 py-1 bg-orange-50 text-orange-700 text-sm font-medium rounded-2xl border border-orange-200">
                          Grade 9 Exit
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Subjects Graded', value: profile.gradedSubjectsCount },
                      { label: 'Average Points', value: `${profile.averagePoints} / 8` },
                      { label: 'Strongest', value: profile.bestSubjects?.slice(0, 2).map(s => s.name).join(', ') || '—' },
                      { label: 'Needs Support', value: profile.needsSupportSubjects?.length > 0 ? profile.needsSupportSubjects.map(s => s.name).join(', ') : 'None' },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              {/* Career Pathway Tab */}
              {activeTab === 'pathway' && (
                <div className="space-y-8">
                  {!isGrade9 ? (
                    <div className="p-8 bg-blue-50 border border-blue-200 rounded-3xl text-center">
                      <p className="text-blue-800 font-semibold text-xl mb-2">Career Pathway Guidance</p>
                      <p className="text-blue-600">Available only for Grade 9 students at Junior Secondary exit.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">Grade 10 Pathway Recommendations</h3>
                        <span className="text-xs text-gray-400">Ranked by CBC ratings</span>
                      </div>
                      {profile.pathwayRecommendations?.length > 0 && (
                        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1 bg-green-600 text-white text-xs font-medium rounded-3xl">TOP RECOMMENDATION</span>
                            <span className="px-4 py-1 text-xs font-medium rounded-3xl border bg-green-50 text-green-700 border-green-200">
                              {profile.pathwayRecommendations[0].confidence} Confidence
                            </span>
                          </div>
                          <div className="flex items-start gap-6">
                            <div className="flex-1">
                              <h4 className="text-2xl font-bold text-gray-900 mb-2">{profile.pathwayRecommendations[0].name}</h4>
                              <p className="text-gray-600 mb-6">{profile.pathwayRecommendations[0].description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Match Score</p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-4xl font-bold text-blue-600">{profile.pathwayRecommendations[0].matchScore}%</span>
                                    <div className="flex-1"><Bar2 pct={profile.pathwayRecommendations[0].matchScore} colorClass="bg-blue-600" /></div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Careers</p>
                                  <p className="text-sm text-gray-800">{profile.pathwayRecommendations[0].recommendedCareers?.slice(0, 3).join(', ')}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Salary Range</p>
                                  <p className="text-sm text-gray-800">{profile.pathwayRecommendations[0].averageSalary}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-4">
                        {profile.pathwayRecommendations?.map(p => (
                          <div key={p.id} className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h5 className="font-semibold text-gray-900">{p.name}</h5>
                                <span className="text-xs text-gray-400">{p.code}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-3xl font-bold text-blue-600">{p.matchScore}%</span>
                              </div>
                            </div>
                            <Bar2 pct={p.matchScore} colorClass="bg-blue-600" />
                            <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 mb-2">Required Subjects</p>
                                <div className="flex flex-wrap gap-2">
                                  {p.requiredSubjects?.map(s => (
                                    <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-2xl text-xs">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-2">Careers</p>
                                <p className="text-gray-700">{p.recommendedCareers?.slice(0, 4).join(', ')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Subjects Tab */}
              {activeTab === 'subjects' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-gray-900">Learning Area Performance</h3>
                  {profile.learningAreas?.length === 0 ? (
                    <Empty title="No subject ratings yet" sub="Marks have not been entered for this student." />
                  ) : (
                    <>
                      <div className="border border-gray-200 rounded-3xl p-6">
                        <p className="text-sm font-medium text-gray-700 mb-4">Points per Subject (out of 8)</p>
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="subject" angle={-30} textAnchor="end" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 8]} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v, _, props) => [`${v}/8 pts (${props.payload.rating})`, props.payload.full]} />
                            <Bar dataKey="points" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {profile.learningAreas?.map((s, i) => {
                          const grade = getCbcGrade(s.points * 12.5);
                          const barColor = grade ? grade.bar : 'bg-gray-400';
                          return (
                            <div key={i} className="flex items-center gap-6 p-5 border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors">
                              <div className="flex-1">
                                <div className="flex justify-between mb-3">
                                  <span className="font-medium text-gray-800">{s.name}</span>
                                  <div className="flex items-center gap-3">
                                    <RatingBadge rating={s.rating} />
                                    <span className="text-xs text-gray-400 font-mono">{s.points}/8</span>
                                  </div>
                                </div>
                                <Bar2 pct={s.points * 12.5} colorClass={barColor} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Competencies Tab */}
              {activeTab === 'competencies' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-gray-900">Core Competencies &amp; Values</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="border border-gray-200 rounded-3xl p-6">
                      <p className="text-sm font-medium text-gray-700 mb-4">Competency Radar</p>
                      <ResponsiveContainer width="100%" height={320}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="competency" tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="border border-gray-200 rounded-3xl p-6">
                      <p className="text-sm font-medium text-gray-700 mb-4">Competency Scores</p>
                      <div className="space-y-6">
                        {radarData.map((c, i) => {
                          let colorClass = 'bg-amber-400';
                          if (c.score >= 75) colorClass = 'bg-emerald-500';
                          else if (c.score >= 50) colorClass = 'bg-sky-500';
                          else if (c.score >= 25) colorClass = 'bg-amber-400';
                          else colorClass = 'bg-rose-400';
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

              {/* AI Analysis Tab */}
              {activeTab === 'ai' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">AI-Powered CBC Analysis</h3>
                    {!loadingAI && !aiData && (
                      <button onClick={runAI} className="px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-3xl hover:bg-purple-700 transition-colors">
                        Generate Analysis
                      </button>
                    )}
                  </div>
                  {loadingAI && (
                    <div className="p-12 bg-purple-50 border border-purple-100 rounded-3xl text-center">
                      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-purple-800 font-medium">Analysing learner profile…</p>
                      <p className="text-purple-600 text-sm mt-1">This usually takes 4–8 seconds</p>
                    </div>
                  )}
                  {!loadingAI && !aiData && (
                    <Empty title="No AI analysis yet" sub="Click the button above to generate a personalised CBC narrative and teacher recommendations." />
                  )}
                  {!loadingAI && aiData && (
                    <>
                      <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-3xl px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-purple-700 font-medium">{aiData.studentName}</div>
                          <div className="text-purple-600 text-sm">
                            Overall Grade: <strong>{aiData.overallGrade}</strong>
                          </div>
                        </div>
                        <div className="text-xs text-purple-400">via {aiData.provider} • {aiData.model}</div>
                        <button onClick={runAI} className="text-xs px-5 py-2 border border-purple-200 text-purple-700 rounded-3xl hover:bg-purple-100">
                          Regenerate
                        </button>
                      </div>
                      <div className="space-y-6">
                        {Object.entries(aiData.sections || {}).map(([key, content]) => (
                          <AiSection key={key} title={key} content={content} />
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

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-3xl shadow-xl border text-sm font-medium max-w-md
          ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
        >
          <span className="flex-shrink-0">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}