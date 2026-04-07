/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Award, Users, Eye, RefreshCw, Loader2, AlertCircle, X,
  TrendingUp, UserCheck, UserX, BarChart3, Printer, BookOpen, Hash
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── CBC 8-LEVEL SCALE ───────────────────────────────────────────────
const LEGEND = [
  { sub: 'EE1', pts: 8, label: 'Exceptional',       range: '90-100%', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { sub: 'EE2', pts: 7, label: 'Very Good',          range: '75-89%',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { sub: 'ME1', pts: 6, label: 'Good',               range: '58-74%',  cls: 'bg-sky-50 text-sky-800 border-sky-200' },
  { sub: 'ME2', pts: 5, label: 'Fair',               range: '41-57%',  cls: 'bg-sky-50 text-sky-700 border-sky-100' },
  { sub: 'AE1', pts: 4, label: 'Needs Improvement',  range: '31-40%',  cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  { sub: 'AE2', pts: 3, label: 'Below Average',      range: '21-30%',  cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  { sub: 'BE1', pts: 2, label: 'Well Below Average', range: '11-20%',  cls: 'bg-rose-50 text-rose-800 border-rose-200' },
  { sub: 'BE2', pts: 1, label: 'Minimal',            range: '1-10%',   cls: 'bg-rose-50 text-rose-700 border-rose-100' },
];

const META = {
  EE1: { label: 'Exceptional',       badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', bar: 'bg-emerald-500' },
  EE2: { label: 'Very Good',         badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-400' },
  ME1: { label: 'Good',              badge: 'bg-sky-100 text-sky-800 border-sky-300',             bar: 'bg-sky-500' },
  ME2: { label: 'Fair',              badge: 'bg-sky-100 text-sky-700 border-sky-200',             bar: 'bg-sky-400' },
  AE1: { label: 'Needs Improvement', badge: 'bg-amber-100 text-amber-800 border-amber-300',       bar: 'bg-amber-500' },
  AE2: { label: 'Below Average',     badge: 'bg-amber-100 text-amber-700 border-amber-200',       bar: 'bg-amber-400' },
  BE1: { label: 'Well Below Average',badge: 'bg-rose-100 text-rose-800 border-rose-300',          bar: 'bg-rose-500' },
  BE2: { label: 'Minimal',           badge: 'bg-rose-100 text-rose-700 border-rose-200',          bar: 'bg-rose-400' },
};

const percentageToCbcCode = (perc) => {
  if (!perc && perc !== 0) return null;
  const p = parseFloat(perc);
  if (isNaN(p)) return null;
  if (p >= 90) return 'EE1';
  if (p >= 75) return 'EE2';
  if (p >= 58) return 'ME1';
  if (p >= 41) return 'ME2';
  if (p >= 31) return 'AE1';
  if (p >= 21) return 'AE2';
  if (p >= 11) return 'BE1';
  return 'BE2';
};

const getCbcGrade = (perc) => {
  const code = percentageToCbcCode(perc);
  return code ? { code, ...META[code] } : null;
};

// Convert a CBC code (e.g. "ME1") → percentage midpoint for the progress bar
const codeToPercent = (code) => {
  const map = { EE1: 95, EE2: 82, ME1: 66, ME2: 49, AE1: 35, AE2: 25, BE1: 15, BE2: 5 };
  return map[code] || 0;
};

// ────────────────────────────────────────────────────────────────────
const ReportCardAnalyzer = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [loading, setLoading]               = useState(true);
  const [classes, setClasses]               = useState([]);
  const [selectedClass, setSelectedClass]   = useState('');
  const [students, setStudents]             = useState([]);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [previewData, setPreviewData]       = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError]                   = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchClasses();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedClass) fetchClassData();
  }, [selectedClass]);

  const apiFetch = async (url) => {
    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) { logout(); window.location.href = '/logout'; return null; }
      return res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/api/teacher/report-cards/my-class/`);
      if (res?.success) {
        const list = res.data || [];
        setClasses(list);
        // ── AUTO-SELECT: if only one class, pick it immediately ──
        if (list.length === 1) setSelectedClass(String(list[0].id));
      }
    } catch (e) {
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassData = async () => {
    if (!selectedClass) return;
    try {
      const [studentsRes, analyticsRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/teacher/report-cards/students/?class_id=${selectedClass}`),
        apiFetch(`${API_BASE_URL}/api/teacher/report-cards/class-analytics/?class_id=${selectedClass}`)
      ]);
      if (studentsRes?.success)  setStudents(studentsRes.data || []);
      if (analyticsRes?.success) setClassAnalytics(analyticsRes.data);
    } catch (e) {
      setError('Failed to load class data');
    }
  };

  const handlePreview = async (student) => {
    try {
      setPreviewLoading(true);
      setSelectedStudent(student);
      const res = await apiFetch(
        `${API_BASE_URL}/api/teacher/report-cards/preview/?student_id=${student.id}`
      );
      if (res?.success) setPreviewData(res.data);
      else setError('Failed to load preview');
    } catch (e) {
      setError('Preview failed');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => { setPreviewData(null); setSelectedStudent(null); };

  const getOverallMastery = () => Math.round(classAnalytics?.mastery_percentage || 0);

  // ── Overall % from learningAreas in previewData ──
  const getPreviewOverall = () => {
    if (!previewData?.learningAreas?.length) return null;
    const pts = previewData.learningAreas.map(la => la.points || 0);
    const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
    return Math.round(avg * 12.5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Class Report Card</h1>
              <p className="text-xs text-gray-400 mt-0.5">CBE Competency-Based Performance Overview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {classes.length > 1 && (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_name} ({c.studentCount} students)
                  </option>
                ))}
              </select>
            )}
            {classes.length === 1 && (
              <span className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
                {classes[0].class_name} · {classes[0].studentCount} students
              </span>
            )}
            <button
              onClick={fetchClassData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!selectedClass ? (
          <div className="bg-white rounded-xl border border-gray-200 text-center py-20">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Select a class to view CBC analytics</p>
          </div>
        ) : (
          <>
            {/* CBC LEGEND */}
            <div className="bg-white border border-gray-200 rounded-xl">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-800">CBC Rating Scale Reference</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {LEGEND.map(r => (
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

            {/* CLASS ANALYTICS CARDS */}
            {classAnalytics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Class Mastery</p>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-4xl font-bold text-emerald-600">{getOverallMastery()}%</span>
                  <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getOverallMastery()}%` }} />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Points</p>
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600">{classAnalytics.average_points?.toFixed(1) || '0.0'}</div>
                  <p className="text-xs text-gray-400 mt-1">out of 8.0</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Performer</p>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-semibold text-gray-800 truncate">{classAnalytics.top_student || '—'}</p>
                  <p className="text-emerald-600 text-sm mt-1">{classAnalytics.top_score || '—'}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Needs Support</p>
                    <UserX className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="font-semibold text-rose-600 text-4xl">{classAnalytics.needs_support_count || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">students below 41%</p>
                </div>
              </div>
            )}

            {/* STUDENTS TABLE */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <h2 className="font-semibold text-gray-800">Student Performance</h2>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  {students.length} learners
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">ADM NO.</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">STUDENT</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">OVERALL %</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">GRADE</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">GRADED SUBJECTS</th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => {
                      const grade = getCbcGrade(student.overall_percentage);
                      return (
                        <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{student.admissionNo}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-800">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{student.overall_percentage || '—'}%</td>
                          <td className="px-5 py-3.5 text-center">
                            {grade ? (
                              <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-lg border ${grade.badge}`}>{grade.code}</span>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-blue-600">{student.graded_subjects_count} subjects</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handlePreview(student)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {students.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No students found for this class</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          PREVIEW MODAL
      ══════════════════════════════════════════════ */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Student Report Card</h3>
                  <p className="text-xs text-blue-100 mt-0.5">CBC Competency-Based Assessment</p>
                </div>
              </div>
              <button onClick={closePreview} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto">
              {previewLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : previewData ? (
                <div className="p-6 space-y-6">

                  {/* ── STUDENT INFO CARD ── */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Student Name</p>
                        <p className="font-semibold text-gray-900 text-sm">{previewData.studentName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Admission No.</p>
                        <p className="font-mono font-semibold text-gray-900 text-sm flex items-center gap-1">
                          <Hash className="w-3 h-3 text-gray-400" />{previewData.admissionNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Class</p>
                        <p className="font-semibold text-gray-900 text-sm">{previewData.className}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Term / Year</p>
                        <p className="font-semibold text-gray-900 text-sm">{previewData.term} · {previewData.academicYear}</p>
                      </div>
                    </div>

                    {/* Overall grade pill */}
                    {(() => {
                      const overall = getPreviewOverall();
                      const grade   = overall !== null ? getCbcGrade(overall) : null;
                      return overall !== null && grade ? (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Overall Performance</span>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-2 rounded-full ${grade.bar}`} style={{ width: `${overall}%` }} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{overall}%</span>
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${grade.badge}`}>
                              {grade.code} · {grade.label}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* ── LEARNING AREAS / SUBJECTS TABLE ── */}
                  {previewData.learningAreas?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold text-gray-800 text-sm">Subject Performance</h4>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {previewData.learningAreas.length} subjects
                        </span>
                      </div>
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                              <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Grade</th>
                              <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Points</th>
                              <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Performance</th>
                              <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Teacher Comment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {previewData.learningAreas.map((la, idx) => {
                              const code  = la.score || percentageToCbcCode(la.points * 12.5);
                              const meta  = code ? META[code] : null;
                              const pct   = code ? codeToPercent(code) : 0;
                              const pts   = la.points || (LEGEND.find(l => l.sub === code)?.pts || 0);
                              return (
                                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                  <td className="px-4 py-3 font-medium text-gray-800">{la.name}</td>
                                  <td className="px-4 py-3 text-center">
                                    {meta ? (
                                      <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${meta.badge}`}>
                                        {code}
                                      </span>
                                    ) : <span className="text-gray-300">—</span>}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="font-bold text-gray-700">{pts}</span>
                                    <span className="text-gray-400 text-xs">/8</span>
                                  </td>
                                  <td className="px-4 py-3 hidden sm:table-cell">
                                    {meta && (
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div className={`h-1.5 rounded-full ${meta.bar}`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-400 w-14">{meta.label}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell max-w-[180px] truncate">
                                    {la.teacherComment || '—'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── REMARKS ── */}
                  {(previewData.teacherRemarks || previewData.headTeacherRemarks) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {previewData.teacherRemarks && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Class Teacher's Remarks</p>
                          <p className="text-sm text-blue-900">{previewData.teacherRemarks}</p>
                        </div>
                      )}
                      {previewData.headTeacherRemarks && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Head Teacher's Remarks</p>
                          <p className="text-sm text-indigo-900">{previewData.headTeacherRemarks}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                  No report data available for this student.
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50">
              <p className="text-xs text-gray-400">Generated: {previewData?.generatedDate || '—'}</p>
              <div className="flex gap-3">
                <button onClick={closePreview} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  Close
                </button>
                <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Print Report Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ERROR TOAST */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
};

export default ReportCardAnalyzer;