/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white'
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${styles[type]} border border-gray-600 p-4 min-w-[280px] shadow-lg animate-slide-in-right`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-bold capitalize text-sm">{type}</p>
          <p className="text-sm text-white/90 mt-1">{message}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-400 max-w-md w-full rounded">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium rounded hover:bg-gray-100">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-yellow-600 text-white text-sm font-bold rounded hover:bg-yellow-700">Finalize</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Exams() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExams();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedExam) {
      fetchStudents();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setExams(data.data);
        if (data.data.length > 0) {
          setSelectedExam(data.data[0]);
        }
      } else {
        setError(data.message || 'Failed to load exams');
      }
    } catch (err) {
      setError('Network error: Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedExam) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        const scoresMap = {};
        const absentSet = new Set();
        data.data.forEach(student => {
          if (student.score !== null && student.score !== undefined) {
            scoresMap[student.student_id] = student.score;
          }
          if (student.is_absent) {
            absentSet.add(student.student_id);
          }
        });
        setScores(scoresMap);
        setAbsentStudents(absentSet);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    }
  };

  const handleScoreChange = (studentId, value) => {
    if (value === '') {
      const newScores = { ...scores };
      delete newScores[studentId];
      setScores(newScores);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= selectedExam.total_marks) {
        setScores(prev => ({ ...prev, [studentId]: numValue }));
      }
    }
  };

  const handleAbsentToggle = (studentId) => {
    setAbsentStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
        const newScores = { ...scores };
        delete newScores[studentId];
        setScores(newScores);
      }
      return newSet;
    });
  };

  const handleSaveScores = async () => {
    if (!selectedExam) return;
    setSaving(true);
    
    const scoresToSave = [];
    Object.entries(scores).forEach(([studentId, score]) => {
      scoresToSave.push({
        student_id: studentId,
        score: parseFloat(score),
        is_absent: false
      });
    });
    absentStudents.forEach(studentId => {
      scoresToSave.push({
        student_id: studentId,
        score: null,
        is_absent: true
      });
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/bulk/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ scores: scoresToSave })
      });
      const data = await response.json();
      if (data.success) {
        addToast(`Saved ${data.saved_count} scores successfully`, 'success');
      } else {
        addToast(data.message || 'Failed to save scores', 'error');
      }
    } catch (err) {
      addToast('Network error: Could not save scores', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizeExam = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/finalize/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('Exam finalized and submitted for moderation', 'success');
        await fetchExams();
      } else {
        addToast(data.message || 'Failed to finalize', 'error');
      }
    } catch (err) {
      addToast('Network error: Could not finalize exam', 'error');
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
    }
  };

  const openFinalizeConfirm = () => {
    setShowConfirmModal(true);
  };

  const getStatistics = () => {
    const validScores = Object.entries(scores)
      .filter(([id]) => !absentStudents.has(id))
      .map(([, score]) => score);
    if (validScores.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0, total: students.length };
    }
    const sum = validScores.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / validScores.length).toFixed(1),
      min: Math.min(...validScores),
      max: Math.max(...validScores),
      count: validScores.length,
      total: students.length
    };
  };

  const stats = getStatistics();

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access exams</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium rounded">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalizeExam}
        title="Finalize Exam"
        message={`Are you sure you want to finalize "${selectedExam?.title}"? Scores will be locked and sent for moderation.`}
      />

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      <div className="bg-green-700 px-6 py-6">
        <h1 className="text-2xl font-bold text-white">Examination Center</h1>
        <p className="text-green-100 mt-1">Mark student scores for assigned exams</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Exam Selector */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Exam</label>
              <select
                value={selectedExam?.id || ''}
                onChange={(e) => {
                  const exam = exams.find(ex => ex.id === e.target.value);
                  setSelectedExam(exam);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={isLoading}
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} - {exam.assigned_subject} ({exam.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm">
                {selectedExam?.status?.toUpperCase() || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Class</label>
              <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm">
                {selectedExam?.className || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Total Marks</label>
              <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm font-bold text-green-700">
                {selectedExam?.total_marks || 0} marks
              </div>
            </div>
          </div>
        </div>

        {/* Subject Info Card */}
        {selectedExam && selectedExam.assigned_subject && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-bold">You are marking:</span> {selectedExam.title} - 
              <span className="font-bold ml-1 text-green-700">{selectedExam.assigned_subject}</span>
            </p>
            <p className="text-xs text-red-600 mt-1">Only enter scores for this subject. Other subjects will be marked by other teachers.</p>
          </div>
        )}

        {/* Statistics */}
        {selectedExam && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-600">Scores Entered</p>
              <p className="text-xl font-bold text-green-700">{stats.count}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-600">Average Score</p>
              <p className="text-xl font-bold text-blue-700">{stats.avg}%</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-600">Highest/Lowest</p>
              <p className="text-sm font-bold text-gray-900">{stats.max} / {stats.min}</p>
            </div>
          </div>
        )}

        {/* Score Entry Table */}
        {selectedExam && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex gap-2">
                {selectedExam.status === 'marking' && (
                  <button
                    onClick={openFinalizeConfirm}
                    disabled={saving}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    {saving ? 'Processing...' : 'Finalize Exam'}
                  </button>
                )}
                <button
                  onClick={handleSaveScores}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Scores'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">#</th>
                    <th className="px-4 py-3 text-left">Admission No.</th>
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-center w-20">Absent</th>
                    <th className="px-4 py-3 text-center">Score / {selectedExam.total_marks}</th>
                    <th className="px-4 py-3 text-center w-24">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const isAbsent = absentStudents.has(student.student_id);
                      const score = scores[student.student_id] || '';
                      const percentage = score ? (score / selectedExam.total_marks) * 100 : 0;
                      let grade = '';
                      if (!isAbsent && score) {
                        if (selectedExam.grade_level === '1' || selectedExam.grade_level === '2' || 
                            selectedExam.grade_level === '3' || selectedExam.grade_level === '4' || 
                            selectedExam.grade_level === '5' || selectedExam.grade_level === '6' || 
                            selectedExam.grade_level === '5' || selectedExam.grade_level=== '7') {
                          if (percentage >= 90) grade = 'EE';
                          else if (percentage >= 75) grade = 'ME';
                          else if (percentage >= 58) grade = 'AE';
                          else grade = 'BE';
                        } else {
                          if (percentage >= 90) grade = 'EE1';
                          else if (percentage >= 75) grade = 'EE2';
                          else if (percentage >= 58) grade = 'ME1';
                          else if (percentage >= 41) grade = 'ME2';
                          else if (percentage >= 31) grade = 'AE1';
                          else if (percentage >= 21) grade = 'AE2';
                          else if (percentage >= 11) grade = 'BE1';
                          else grade = 'BE2';
                        }
                      }

                      return (
                        <tr key={student.student_id} className={`border-b border-gray-200 ${isAbsent ? 'bg-gray-100' : ''}`}>
                          <td className="px-4 py-3 text-gray-600 text-center">{idx + 1}</td>
                          <td className="px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                          <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                          <td className="px-4 py-3 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAbsent}
                                onChange={() => handleAbsentToggle(student.student_id)}
                                className="w-4 h-4"
                              />
                              <span className="ml-2 text-xs text-gray-600">AB</span>
                            </label>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={score}
                              onChange={(e) => handleScoreChange(student.student_id, e.target.value)}
                              disabled={isAbsent}
                              className={`w-24 px-2 py-1 text-center border rounded ${isAbsent ? 'bg-gray-100 text-gray-400' : 'bg-white border-gray-300'}`}
                              min="0"
                              max={selectedExam.total_marks}
                              step="0.5"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {!isAbsent && grade && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {grade}
                              </span>
                            )}
                            {isAbsent && <span className="text-xs text-gray-400">Absent</span>}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!selectedExam && !isLoading && exams.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-8 text-center">
            <p className="text-yellow-800">No exams assigned to you for marking.</p>
            <p className="text-yellow-600 text-sm mt-1">Exams will appear here once the Registrar creates and assigns them.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;