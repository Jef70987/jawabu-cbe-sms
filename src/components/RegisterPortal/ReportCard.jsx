import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── CBC GRADE MAPPING (8‑point scale) ───
const CBC_META = {
  EE1: { label: 'Exceptional',       badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', points: 8 },
  EE2: { label: 'Very Good',         badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', points: 7 },
  ME1: { label: 'Good',              badge: 'bg-sky-100 text-sky-800 border-sky-300',             points: 6 },
  ME2: { label: 'Fair',              badge: 'bg-sky-100 text-sky-700 border-sky-200',             points: 5 },
  AE2: { label: 'Needs Improvement', badge: 'bg-amber-100 text-amber-800 border-amber-300',       points: 4 },
  AE1: { label: 'Below Average',     badge: 'bg-amber-100 text-amber-700 border-amber-200',       points: 3 },
  BE2: { label: 'Well Below Average',badge: 'bg-rose-100 text-rose-800 border-rose-300',          points: 2 },
  BE1: { label: 'Minimal',           badge: 'bg-rose-100 text-rose-700 border-rose-200',          points: 1 },
};

// Convert points (0‑8) to CBC grade code
const pointsToCbcCode = (points) => {
  const num = parseInt(points);
  if (isNaN(num)) return null;
  if (num >= 8) return 'EE1';
  if (num >= 7) return 'EE2';
  if (num >= 6) return 'ME1';
  if (num >= 5) return 'ME2';
  if (num >= 4) return 'AE2';
  if (num >= 3) return 'AE1';
  if (num >= 2) return 'BE2';
  if (num >= 1) return 'BE1';
  return null;
};

// Accepts either numeric points (0‑8) or a grade code string (e.g., "ME1")
const getGradeInfo = (rating) => {
  if (!rating && rating !== 0) return null;
  // If it's a string that matches a CBC code
  if (typeof rating === 'string' && CBC_META[rating]) {
    return { code: rating, ...CBC_META[rating] };
  }
  // If it's a number (points)
  const num = parseInt(rating);
  if (!isNaN(num)) {
    const code = pointsToCbcCode(num);
    if (code) return { code, ...CBC_META[code] };
  }
  return null;
};

const ReportCardGenerator = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [termsList, setTermsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedClass && isAuthenticated) {
      fetchStudentsForClass();
    }
  }, [selectedClass, selectedTerm, selectedAcademicYear, isAuthenticated]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const currentRes = await fetch(`${API_BASE_URL}/api/registrar/academic/academic/current/`, {
        headers: getAuthHeaders(),
      });
      if (currentRes.ok) {
        const curr = await currentRes.json();
        if (curr.success && curr.data) {
          if (curr.data.academic_year) setSelectedAcademicYear(curr.data.academic_year.year_code);
          if (curr.data.term) setSelectedTerm(curr.data.term.term);
        }
      }

      const yearsRes = await fetch(`${API_BASE_URL}/api/registrar/academic/academic-years/`, {
        headers: getAuthHeaders(),
      });
      if (yearsRes.ok) {
        const yData = await yearsRes.json();
        if (yData.success) setAcademicYears(yData.data);
      }

      const termsRes = await fetch(`${API_BASE_URL}/api/registrar/academic/terms/`, {
        headers: getAuthHeaders(),
      });
      if (termsRes.ok) {
        const tData = await termsRes.json();
        if (tData.success) setTermsList(tData.data);
      }

      const classesRes = await fetch(`${API_BASE_URL}/api/registrar/report-cards/classes/`, {
        headers: getAuthHeaders(),
      });
      if (classesRes.ok) {
        const cData = await classesRes.json();
        if (cData.success) setClasses(cData.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForClass = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/report-cards/students/?class_id=${selectedClass}&term=${encodeURIComponent(selectedTerm)}&academic_year=${selectedAcademicYear}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) setStudents(data.data);
      } else {
        setError('Failed to load students');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load students');
    }
  };

  const handleGenerateReportCard = async () => {
    if (!selectedClass || !selectedTerm || !selectedAcademicYear) {
      setError('Please select class, term, and academic year');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/report-cards/generate/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: selectedClass,
          term: selectedTerm,
          academic_year: selectedAcademicYear,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        await fetchStudentsForClass();
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      setError('Failed to generate report cards');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async (student) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/report-cards/preview/?student_id=${student.id}&term=${encodeURIComponent(selectedTerm)}&academic_year=${selectedAcademicYear}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedStudent(student);
          setPreviewData(data.data);
          return;
        }
      }
      setError('Failed to load preview');
    } catch (err) {
      console.error(err);
      setError('Failed to load preview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading report card data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Report Card Generator</h1>
              <p className="text-sm text-gray-500 mt-1">
                Generate CBC format report cards with 8-point scale
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                CBC Format
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Year</option>
                {academicYears.map((y) => (
                  <option key={y.id} value={y.year_code}>
                    {y.year_name || y.year_code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Term</option>
                {termsList.map((t) => (
                  <option key={t.id} value={t.term}>
                    {t.term}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount} students)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReportCard}
                disabled={generating || !selectedClass || !selectedTerm || !selectedAcademicYear}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>Generate Report Cards</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Students</h2>
            <span className="text-sm text-gray-500">{students.length} students</span>
          </div>
          <div className="divide-y divide-gray-200">
            {students.map((student) => (
              <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{student.admissionNo}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-xs text-gray-500">{student.className}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      student.hasReport
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    {student.hasReport ? 'Generated' : 'Pending'}
                  </span>
                  <button
                    onClick={() => handlePreview(student)}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Preview
                  </button>
                  {student.hasReport && (
                    <button className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Print
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Modal */}
        {previewData && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Card Preview - {previewData.studentName}
                </h2>
                <button
                  onClick={() => {
                    setPreviewData(null);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">MINISTRY OF EDUCATION</h3>
                    <p className="text-lg text-gray-700">Kenya Certificate of Basic Education</p>
                    <p className="text-sm text-gray-500 mt-1">COMPETENCY BASED ASSESSMENT</p>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Admission:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.admissionNo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm text-gray-600">Class:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.className}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Term:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.term}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Year:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.academicYear}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm font-medium text-gray-900">{previewData.generatedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Areas */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Learning Areas Achievement</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Learning Area</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Points</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teacher's Comment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {previewData.learningAreas.map((area, index) => {
                            const gradeInfo = getGradeInfo(area.points);
                            return (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">{area.name}</td>
                                <td className="px-4 py-2 text-center">
                                  {gradeInfo ? (
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${gradeInfo.badge}`}>
                                      {gradeInfo.code}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{area.points}/8</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{area.teacherComment}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Core Competencies - FIXED: now handles both numbers and grade codes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Core Competencies</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {previewData.competencyRatings?.map((comp, index) => {
                        const gradeInfo = getGradeInfo(comp.rating);
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{comp.name}</span>
                            {gradeInfo ? (
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${gradeInfo.badge}`}>
                                {gradeInfo.code}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Values - FIXED */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewData.valuesRatings?.map((value, index) => {
                        const gradeInfo = getGradeInfo(value.rating);
                        return (
                          <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{value.name}</span>
                            {gradeInfo ? (
                              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${gradeInfo.badge}`}>
                                {gradeInfo.code}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attendance Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Attendance Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Total Days</p>
                        <p className="text-xl font-bold text-gray-900">65</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Present</p>
                        <p className="text-xl font-bold text-green-600">62</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Absent</p>
                        <p className="text-xl font-bold text-red-600">3</p>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Class Teacher's Remarks</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {previewData.teacherRemarks}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Head Teacher's Remarks</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {previewData.headTeacherRemarks || '_____________________'}
                    </p>
                  </div>

                  {/* Parent Feedback */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Parent/Guardian Feedback</h4>
                    <textarea
                      rows="3"
                      placeholder="Parent comments..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <div className="mt-3 flex justify-end gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>Parent Signature:</span>
                        <span className="border-b border-gray-300 w-32"></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Date:</span>
                        <span className="border-b border-gray-300 w-24"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setPreviewData(null);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report Card
                  </button>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {success && (
          <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <span className="text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCardGenerator;