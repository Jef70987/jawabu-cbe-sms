/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────
//  CBC GRADE MAPPING
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
    throw new Error(bodyText.trim().startsWith('<') ? `Server returned HTML instead of JSON (HTTP ${res.status})` : `Unexpected response type "${contentType}"`);
  }
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || json.detail || `HTTP ${res.status}`);
  return json.data !== undefined ? json.data : json;
}

// ─────────────────────────────────────────────────────────────────
//  UTILITIES - FIXED EMOJI REGEX (no more syntax error)
// ─────────────────────────────────────────────────────────────────
const stripEmojis = (text) => {
  if (!text) return '';
  // Safe emoji stripping that works in all browsers
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')           // Surrogate pairs
    .replace(/[\u2600-\u27BF\u2B50-\u2B55\u203C-\u3299]/g, '') // Common emoji ranges
    .trim();
};

const formatAiContent = (text) => {
  if (!text) return '';
  let processed = stripEmojis(text);
  processed = processed.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  processed = processed.replace(/^### (.*$)/gm, '<h4 class="text-base font-semibold mt-5 mb-2 text-gray-800">$1</h4>');
  processed = processed.replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>');
  processed = processed.replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold mt-7 mb-4 text-gray-800">$1</h2>');
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  const lines = processed.split('\n');
  let inList = false, listType = null;
  const result = [];
  for (let line of lines) {
    const ulMatch = line.match(/^\s*[-*•]\s+(.*)/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push('</ul>');
        result.push('<ul class="list-disc pl-6 my-3 space-y-1">');
        inList = true; listType = 'ul';
      }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push('</ul>');
        result.push('<ol class="list-decimal pl-6 my-3 space-y-1">');
        inList = true; listType = 'ol';
      }
      result.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; listType = null; }
      result.push(line.trim() === '' ? '<br />' : `<p class="mb-3">${line}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('');
};

// ─────────────────────────────────────────────────────────────────
//  SMALL COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────────
const RatingBadge = ({ rating }) => {
  if (!rating) return null;
  const meta = CBC_META[rating];
  if (!meta) return <span className="text-xs text-gray-400">{rating}</span>;
  return <span className={`inline-flex font-bold rounded-lg border text-xs px-2.5 py-1 ${meta.badge}`}>{rating}</span>;
};

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
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
    <h4 className="font-bold text-gray-800 mb-4 text-xl border-b border-purple-200 pb-2">{stripEmojis(title)}</h4>
    <div className="text-gray-800 leading-relaxed" style={{ fontSize: '1rem', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: formatAiContent(content) }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT - FULLY FIXED (NO BLANK PAGE)
// ─────────────────────────────────────────────────────────────────
export default function RegistrarAnalytics() {
  const [academicYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableTerms, setAvailableTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [toast, setToast] = useState(null);

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStreamId, setSelectedStreamId] = useState('');

  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const showError = (msg) => setToast({ type: 'error', msg });

  // Load years
  useEffect(() => {
    const loadYears = async () => {
      try {
        const years = await apiFetch('/registrar/analytics/available-years/');
        setAvailableYears(years);
        if (years.length) setAcademicYear(years[0]);
      } catch (e) {
        console.error(e);
        setAvailableYears(['2026', '2025', '2024']);
        setAcademicYear('2025');
      }
    };
    loadYears();
  }, []);

  // Load terms
  useEffect(() => {
    if (!academicYear) return;
    const loadTerms = async () => {
      try {
        const terms = await apiFetch(`/registrar/analytics/available-terms/?academic_year=${academicYear}`);
        setAvailableTerms(terms);
        if (terms.length && !terms.includes(term)) setTerm(terms[0]);
      } catch (e) {
        console.error(e);
        setAvailableTerms(['Term 1', 'Term 2', 'Term 3']);
        if (!term) setTerm('Term 1');
      }
    };
    loadTerms();
  }, [academicYear]);

  // Load classes
  const loadClasses = async () => {
    if (!academicYear || !term) return;
    setLoadingClasses(true);
    try {
      const data = await apiFetch(`/registrar/analytics/classes/?academic_year=${academicYear}&term=${term}`);
      setClasses(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [academicYear, term]);

  // Auto-select first grade to prevent blank page
  useEffect(() => {
    const grades = [...new Set(classes.map(c => c.numericLevel).filter(Boolean))].sort((a, b) => a - b);
    if (grades.length && !selectedGrade) {
      setSelectedGrade(grades[0].toString());
    }
    setSelectedStreamId('');
    setAiData(null);
  }, [classes]);

  const streamsInSelectedGrade = useMemo(() => {
    if (!selectedGrade) return [];
    return classes.filter(c => c.numericLevel === parseInt(selectedGrade));
  }, [classes, selectedGrade]);

  const selectedStream = useMemo(() => {
    if (!selectedStreamId) return null;
    return streamsInSelectedGrade.find(s => s.id === parseInt(selectedStreamId));
  }, [streamsInSelectedGrade, selectedStreamId]);

  const chartData = useMemo(() => {
    if (!selectedGrade) return [];
    if (selectedStream) {
      const subs = selectedStream.subjectAverages || {};
      return Object.entries(subs)
        .map(([subject, avg]) => ({
          subject: subject.length > 14 ? subject.slice(0, 12) + '…' : subject,
          avg: Math.round(avg),
          full: subject,
        }))
        .sort((a, b) => b.avg - a.avg);
    } else {
      const gradeClasses = streamsInSelectedGrade;
      let subjectStats = {};
      gradeClasses.forEach(stream => {
        const num = stream.studentCount || 0;
        Object.entries(stream.subjectAverages || {}).forEach(([subj, pct]) => {
          if (!subjectStats[subj]) subjectStats[subj] = { weightedSum: 0, weight: 0 };
          subjectStats[subj].weightedSum += (pct || 0) * num;
          subjectStats[subj].weight += num;
        });
      });
      return Object.entries(subjectStats)
        .map(([subject, stats]) => ({
          subject: subject.length > 14 ? subject.slice(0, 12) + '…' : subject,
          avg: stats.weight > 0 ? Math.round(stats.weightedSum / stats.weight) : 0,
          full: subject,
        }))
        .sort((a, b) => b.avg - a.avg);
    }
  }, [selectedGrade, selectedStream, streamsInSelectedGrade]);

  const runAI = async () => {
    if (!selectedGrade) return;
    setLoadingAi(true);
    setAiData(null);
    try {
      const payload = {
        grade_level: parseInt(selectedGrade),
        academic_year: academicYear,
        term: term,
      };
      if (selectedStream) payload.class_id = selectedStream.id;

      const data = await apiFetch('/registrar/analytics/grade-ai-analysis/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAiData(data);
    } catch (e) {
      showError('AI analysis failed: ' + e.message);
    } finally {
      setLoadingAi(false);
    }
  };

  const getStreamCardColor = (avg) => {
    if (avg >= 75) return 'border-emerald-200 bg-emerald-50/40';
    if (avg >= 60) return 'border-sky-200 bg-sky-50/40';
    if (avg >= 40) return 'border-amber-200 bg-amber-50/40';
    return 'border-rose-200 bg-rose-50/40';
  };

  const getAvgTextColor = (avg) => {
    if (avg >= 75) return 'text-emerald-700';
    if (avg >= 60) return 'text-sky-700';
    if (avg >= 40) return 'text-amber-700';
    return 'text-rose-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-gray-900">Registrar Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">School-wide CBC performance · Select a grade and stream to analyse</p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Year & Term filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Year</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Term</label>
              <select value={term} onChange={e => setTerm(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {availableTerms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loadingClasses ? (
          <Spinner text="Loading school performance data…" />
        ) : classes.length === 0 ? (
          <Empty title="No class data available" sub="No active classes found for the selected academic year and term." />
        ) : (
          <>
            {/* Grade & Stream Selection */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Grade</label>
                  <select value={selectedGrade} onChange={e => { setSelectedGrade(e.target.value); setSelectedStreamId(''); setAiData(null); }}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {[...new Set(classes.map(c => c.numericLevel))].sort((a, b) => a - b).map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stream (Optional)</label>
                  <select value={selectedStreamId} onChange={e => { setSelectedStreamId(e.target.value); setAiData(null); }}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">All streams in this grade</option>
                    {streamsInSelectedGrade.map(stream => (
                      <option key={stream.id} value={stream.id}>{stream.className} {stream.stream && `— ${stream.stream}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stream Cards */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Streams in Grade {selectedGrade || '—'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {streamsInSelectedGrade.map(stream => (
                  <div key={stream.id} className={`rounded-2xl border p-4 transition-all hover:shadow-md cursor-pointer ${selectedStreamId === String(stream.id) ? 'ring-2 ring-purple-500' : ''} ${getStreamCardColor(stream.averagePercentage || 0)}`}
                    onClick={() => { setSelectedStreamId(String(stream.id)); setAiData(null); }}>
                    {/* ... same card content as before ... */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{stream.className}{stream.stream && <span className="font-normal text-gray-500 ml-1">— {stream.stream}</span>}</p>
                        <p className="text-xs text-gray-500 mt-1">{stream.studentCount} students • {stream.gradedStudents || 0} graded</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold leading-none ${getAvgTextColor(stream.averagePercentage || 0)}`}>{stream.averagePercentage || 0}</div>
                        <p className="text-[10px] font-medium text-gray-400 tracking-wider mt-0.5">AVG %</p>
                      </div>
                    </div>
                    {stream.gradeDistribution && Object.keys(stream.gradeDistribution).length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Grade Distribution</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stream.gradeDistribution)
                            .sort(([a], [b]) => ['EE1','EE2','ME1','ME2','AE2','AE1','BE2','BE1'].indexOf(a) - ['EE1','EE2','ME1','ME2','AE2','AE1','BE2','BE1'].indexOf(b))
                            .map(([grade, count]) => (
                              <div key={grade} className="flex items-center gap-1.5 bg-white/60 border border-gray-100 rounded-full px-2.5 py-1">
                                <RatingBadge rating={grade} />
                                <span className="font-semibold text-gray-700 text-xs">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Subject Performance – {selectedStream ? `Stream ${selectedStream.stream || selectedStream.className}` : `Grade ${selectedGrade} Average`} (%)
                </h4>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }} formatter={v => [`${v}%`, 'Average']} />
                    <Bar dataKey="avg" radius={[4, 4, 0, 0]} fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* AI Section - Data is now appended correctly */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedStream ? `Deep insights for ${selectedStream.className} ${selectedStream.stream || ''}` : selectedGrade ? `Deep insights for Grade ${selectedGrade}` : 'Select a grade to begin analysis'}
                  </p>
                </div>

                <button onClick={runAI} disabled={!selectedGrade || loadingAi}
                  className="flex items-center px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm">
                  {loadingAi && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
                  {loadingAi ? 'Generating…' : !selectedGrade ? 'Select a grade first' : aiData ? 'Regenerate Analysis' : 'Generate AI Analysis'}
                </button>
              </div>

              {!selectedGrade && (
                <div className="text-center py-12 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700">
                  <p className="text-lg font-medium">Please select a Grade above</p>
                  <p className="text-sm mt-1">Choose a grade (and optionally a stream) to generate AI-powered analysis.</p>
                </div>
              )}

              {selectedGrade && loadingAi && (
                <div className="flex items-center justify-center py-12 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-purple-700 text-sm">Analysing performance data…</p>
                  </div>
                </div>
              )}

              {selectedGrade && aiData && !loadingAi && (
                <div className="space-y-6">
                  {aiData.sections && Object.keys(aiData.sections).length > 0
                    ? Object.entries(aiData.sections).map(([title, content]) => <AiSection key={title} title={title} content={content} />)
                    : aiData.fullNarrative && <AiSection title="Comprehensive Analysis" content={aiData.fullNarrative} />}
                </div>
              )}

              {selectedGrade && !aiData && !loadingAi && (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-sm">Click “Generate AI Analysis” to receive detailed insights and recommendations.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium max-w-md ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
          <span className="text-base">{toast.type === 'error' ? '⚠️' : '✓'}</span>
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}