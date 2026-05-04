import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Loader2, Printer, Award, BookOpen, Hash,
  ClipboardList, ChevronDown, Calendar,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Print styles injected into <head> once ────────────────────────────────────
const PRINT_STYLE_ID = 'report-card-print-styles';

function injectPrintStyles() {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.innerHTML = `
    @media print {
      /* Hide EVERYTHING on the page first */
      body > * {
        display: none !important;
      }

      /* Then show only the report card portal root */
      #report-card-print-root,
      #report-card-print-root * {
        display: revert !important;
      }

      /* Flatten layout so the card fills the page */
      #report-card-print-root {
        position: fixed !important;
        inset: 0 !important;
        z-index: 99999 !important;
        background: white !important;
        overflow: visible !important;
      }

      /* Remove screen-only chrome */
      .print\\:hidden { display: none !important; }
      .print\\:shadow-none { box-shadow: none !important; }
      .print\\:bg-white { background-color: white !important; }
      .print\\:bg-gray-200 { background-color: #e5e7eb !important; }
      .print\\:text-black { color: black !important; }
      .print\\:text-gray-600 { color: #4b5563 !important; }
      .print\\:p-0 { padding: 0 !important; }
      .print\\:rounded-none { border-radius: 0 !important; }
      .print\\:text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
    }
  `;
  document.head.appendChild(style);
}

// ── Grade colour helper ───────────────────────────────────────────────────────
const gradeColor = (code) => {
  if (!code) return 'bg-gray-100 text-gray-700';
  const c = code.toUpperCase();
  if (c.startsWith('EE')) return 'bg-emerald-100 text-emerald-800';
  if (c.startsWith('ME')) return 'bg-blue-100 text-blue-800';
  if (c.startsWith('AE')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// ── Subject table ─────────────────────────────────────────────────────────────
const SubjectTable = ({ title, icon, iconColor, results, emptyMsg }) => {
  const IconComponent = icon;

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-3">
        {IconComponent && <IconComponent className={`w-5 h-5 ${iconColor}`} />}
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <span className="ml-auto text-xs text-gray-400">
          {results.length} subject{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-3">{emptyMsg}</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm print:text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Exam / Assessment</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">%</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Teacher's Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{r.subject}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden sm:table-cell">{r.exam_title || '—'}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gradeColor(r.grade)}`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center font-medium text-gray-700">{r.points}</td>
                  <td className="px-4 py-2.5 text-center font-medium text-gray-700">{r.percentage}%</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden md:table-cell">{r.teacher_comment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Term selector ─────────────────────────────────────────────────────────────
const TermSelector = ({ terms, currentTermId, onChange }) => {
  if (!terms || terms.length <= 1) return null;

  return (
    <div className="relative inline-flex items-center gap-2 print:hidden">
      <Calendar className="w-4 h-4 text-gray-500" />
      <div className="relative">
        <select
          value={currentTermId}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        >
          {terms.map((t) => (
            <option key={t.term_id} value={t.term_id}>{t.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const StudentReportCard = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [termId,  setTermId]  = useState('');
  const printRef = useRef();

  // Inject print styles once on mount
  useEffect(() => {
    injectPrintStyles();
  }, []);

  const fetchReport = useCallback(async (tid = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/student/report-card/?term_id=${encodeURIComponent(tid)}`,
        { headers: getAuthHeaders() }
      );
      if (res.status === 404) {
        setReport({ __empty: true });
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setReport(json.data);
        if (!tid && json.data.current_term_id) {
          setTermId(json.data.current_term_id);
        }
      } else if (!json.success && json.data == null) {
        setReport({ __empty: true });
      } else {
        setError(json.error || 'Failed to load report card');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchReport(termId);
  }, [isAuthenticated, termId, fetchReport]);

  const handlePrint = () => {
    // Wrap the card in a known root id so the print CSS can isolate it
    const card = printRef.current;
    if (!card) { window.print(); return; }

    // Create an isolated wrapper at body level
    const wrapper = document.createElement('div');
    wrapper.id = 'report-card-print-root';
    wrapper.innerHTML = card.outerHTML;
    document.body.appendChild(wrapper);

    window.print();

    // Clean up after the print dialog closes
    document.body.removeChild(wrapper);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
          <p className="text-sm text-gray-500">Loading report card…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchReport(termId)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report || report.__empty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-1">No Results Available</p>
          <p className="text-gray-400 text-sm">No report card results have been published for this term yet.</p>
        </div>
      </div>
    );
  }

  const summativeResults = report.summative_results || report.formal_results     || [];
  const sbaResults       = report.sba_results       || report.assessment_results || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 print:bg-white">
      {/* This div is cloned into an isolated wrapper before printing */}
      <div
        className="w-full bg-white shadow-lg overflow-hidden print:shadow-none print:rounded-none"
        ref={printRef}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-green-700 px-6 py-5 print:bg-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {report.student.photo_url && (
                <img
                  src={report.student.photo_url}
                  alt="student"
                  className="w-16 h-16 object-cover border-2 border-white flex-shrink-0"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white print:text-black">Student Report Card</h1>
                <p className="text-green-100 text-sm print:text-gray-600">
                  {report.term} &middot; Academic Year {report.academic_year}
                </p>
              </div>
            </div>
            {/* Print button — hidden when printing */}
            <div className="flex items-center gap-3 print:hidden">
              <TermSelector
                terms={report.available_terms}
                currentTermId={termId || report.current_term_id}
                onChange={setTermId}
              />
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-lg font-medium text-sm hover:bg-green-50"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        {/* ── Student Info ───────────────────────────────────────────────── */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-200 bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Student</p>
            <p className="font-semibold text-gray-800">{report.student.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Admission No.</p>
            <p className="font-mono font-semibold text-gray-800 flex items-center gap-1">
              <Hash className="w-3 h-3" />{report.student.admission_no}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Class</p>
            <p className="font-semibold text-gray-800">{report.student.class}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date Printed</p>
            <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* ── Grading Scale Key ──────────────────────────────────────────── */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CBC Grading Scale</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { code: 'EE / EE1', label: 'Exceeding / Exceptional',  cls: 'bg-emerald-100 text-emerald-800' },
              { code: 'ME / ME1', label: 'Meeting / Good',            cls: 'bg-blue-100 text-blue-800'       },
              { code: 'AE / AE1', label: 'Approaching / Needs Imp.',  cls: 'bg-yellow-100 text-yellow-800'   },
              { code: 'BE / BE2', label: 'Below / Minimal',           cls: 'bg-red-100 text-red-800'         },
            ].map((g) => (
              <span key={g.code} className={`px-2 py-1 rounded font-semibold ${g.cls}`}>
                {g.code} — {g.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Summative Results ──────────────────────────────────────────── */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <SubjectTable
            title="Summative Assessments (Formal Exams)"
            icon={BookOpen}
            iconColor="text-blue-600"
            results={summativeResults}
            emptyMsg="No formal exam results published for this term."
          />
        </div>

        {/* ── SBA Results ────────────────────────────────────────────────── */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <SubjectTable
            title="School-Based Assessments (SBA / CAT / CBA)"
            icon={ClipboardList}
            iconColor="text-purple-600"
            results={sbaResults}
            emptyMsg="No SBA / CAT results published for this term."
          />
        </div>

        {/* ── Overall Summary ────────────────────────────────────────────── */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Overall Performance</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Overall Grade</p>
              <p className={`text-3xl font-bold ${gradeColor(report.overall_grade)} inline-block px-3 py-1 rounded-lg`}>
                {report.overall_grade}
              </p>
              <p className="text-xs text-gray-500 mt-1">{report.overall_grade_label}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Avg. Points</p>
              <p className="text-3xl font-bold text-blue-600">{report.overall_points}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Avg. %</p>
              <p className="text-3xl font-bold text-blue-600">{report.overall_percentage}%</p>
            </div>
          </div>
        </div>

        {/* ── Attendance & Remarks ───────────────────────────────────────── */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-3">Attendance</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Sessions</span>
                <span className="font-semibold">{report.attendance.total_days}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Present</span>
                <span className="font-semibold text-green-700">{report.attendance.present}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Absent</span>
                <span className="font-semibold text-red-600">{report.attendance.absent}</span>
              </div>
              {report.attendance.rate != null && (
                <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Rate</span>
                  <span className="font-bold text-blue-600">{report.attendance.rate}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Class Teacher's Remark</p>
              <p className="italic text-gray-700 text-sm">{report.class_teacher_remark || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Head Teacher's Remark</p>
              <p className="italic text-gray-700 text-sm">{report.head_teacher_remark || '—'}</p>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="p-5 bg-gray-50 border-t text-center text-xs text-gray-400">
          {report.next_term_begins && report.next_term_begins !== 'To be announced'
            ? `Next term begins on ${report.next_term_begins} · `
            : ''}
          This is a computer-generated report card.
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;