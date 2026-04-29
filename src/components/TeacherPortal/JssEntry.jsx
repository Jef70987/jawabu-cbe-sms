/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  RefreshCw, FileText, X, Loader2,
  AlertCircle, CheckCircle,
  Users, Target, BarChart3,
  Save, Upload, Download,
  AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// KNEC 8-Point Achievement Level Scale
const ACHIEVEMENT_LEVELS = [
  { min: 90, max: 100, level: 8, code: 'AL-8', label: 'EE1', description: 'Exceptional' },
  { min: 75, max: 89, level: 7, code: 'AL-7', label: 'EE2', description: 'Very Good' },
  { min: 58, max: 74, level: 6, code: 'AL-6', label: 'ME1', description: 'Good' },
  { min: 41, max: 57, level: 5, code: 'AL-5', label: 'ME2', description: 'Fair' },
  { min: 31, max: 40, level: 4, code: 'AL-4', label: 'AE1', description: 'Needs Improvement' },
  { min: 21, max: 30, level: 3, code: 'AL-3', label: 'AE2', description: 'Below Average' },
  { min: 11, max: 20, level: 2, code: 'AL-2', label: 'BE1', description: 'Well Below Average' },
  { min: 1, max: 10, level: 1, code: 'AL-1', label: 'BE2', description: 'Minimal' },
  { min: 0, max: 0, level: 0, code: 'AL-0', label: 'AB', description: 'Absent' }
];

const calculateAchievementLevel = (percentage) => {
  if (percentage === null || percentage === undefined) return ACHIEVEMENT_LEVELS[8];
  const level = ACHIEVEMENT_LEVELS.find(l => percentage >= l.min && percentage <= l.max);
  return level || ACHIEVEMENT_LEVELS[8];
};

const calculateWeightedTotal = (sbaScore, examScore, sbaWeight = 40, examWeight = 60) => {
  if (sbaScore === null || examScore === null || sbaScore === '' || examScore === '') return null;
  const weighted = (parseFloat(sbaScore) * sbaWeight / 100) + (parseFloat(examScore) * examWeight / 100);
  return Math.round(weighted * 10) / 10;
};

const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  const styles = { success: 'bg-green-600 text-white', error: 'bg-red-600 text-white', warning: 'bg-yellow-500 text-white' };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${styles[type] || 'bg-blue-600 text-white'} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4 text-white/80 hover:text-white"><X className="h-4 w-4" /></button>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Processing...</p>
    </div>
  </div>
);

function JssEntryMarks() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState({ classes: true, subjects: true, students: true, saving: false });
  const [toasts, setToasts] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [viewMode, setViewMode] = useState('student');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [terms, setTerms] = useState([]);

  // Generate dynamic year range (current year - 2 to current year + 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = -2; i <= 2; i++) {
    yearOptions.push(currentYear + i);
  }

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchClasses();
      fetchTerms();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects();
      fetchStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedTerm && selectedYear && students.length > 0) {
      fetchExistingMarks();
    }
  }, [selectedTerm, selectedYear, students]);

  useEffect(() => {
    if (students.length > 0 && selectedClass) {
      fetchExistingMarks();
    }
  }, [students]);

  const fetchClasses = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/jss/classes/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) {
        setClasses(data.data);
        if (data.data.length > 0 && !selectedClass) {
          setSelectedClass(data.data[0]);
        }
      } else {
        addToast('error', data.message || 'Failed to load classes');
      }
    } catch (error) {
      addToast('error', 'Network error loading classes');
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/jss/terms/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) {
        setTerms(data.data);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  const fetchSubjects = async () => {
    if (!selectedClass?.grade_level) return;
    
    setLoading(prev => ({ ...prev, subjects: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/jss/subjects/?grade_level=${selectedClass.grade_level}`, { 
        headers: getAuthHeaders() 
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSubjects(data.data);
        if (data.data.length > 0 && !selectedSubject) {
          setSelectedSubject(data.data[0]);
        }
      } else {
        addToast('error', data.message || 'Failed to load subjects');
      }
    } catch (error) {
      addToast('error', 'Network error loading subjects');
    } finally {
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass?.id) return;
    
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/jss/students/${selectedClass.id}/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(data.data);
      } else {
        addToast('error', data.message || 'Failed to load students');
        setStudents([]);
      }
    } catch (error) {
      addToast('error', 'Network error loading students');
      setStudents([]);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchExistingMarks = async () => {
    if (!selectedClass?.id) return;
    
    try {
      const url = `${API_BASE_URL}/api/teacher/jss/marks/retrieve/?class_id=${selectedClass.id}&term=${encodeURIComponent(selectedTerm)}&year=${selectedYear}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) {
        const newMarksData = {};
        students.forEach(student => {
          newMarksData[student.id] = data.data[student.id] || {};
        });
        setMarksData(newMarksData);
      }
    } catch (error) {
      console.error('Error fetching existing marks:', error);
    }
  };

  const handleMarkChange = (studentId, subjectId, field, value) => {
    setMarksData(prev => {
      const current = prev[studentId]?.[subjectId] || { sba: null, exam: null };
      const newMarks = { ...current, [field]: value === '' ? null : value };
      
      const subject = subjects.find(s => s.id === subjectId);
      const weightedTotal = calculateWeightedTotal(newMarks.sba, newMarks.exam, subject?.sba_weight, subject?.exam_weight);
      const achievementLevel = weightedTotal !== null ? calculateAchievementLevel(weightedTotal) : null;
      
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subjectId]: {
            sba: newMarks.sba,
            exam: newMarks.exam,
            weighted_total: weightedTotal,
            grade: achievementLevel?.label,
            level_code: achievementLevel?.code
          }
        }
      };
    });
  };

  const handleSaveAll = async () => {
    if (!selectedClass?.id) {
      addToast('warning', 'No class selected');
      return;
    }

    setLoading(prev => ({ ...prev, saving: true }));
    try {
      const payload = {
        class_id: selectedClass.id,
        term: selectedTerm,
        year: parseInt(selectedYear),
        marks: marksData
      };
      const response = await fetch(`${API_BASE_URL}/api/teacher/jss/marks/bulk-save/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', `Saved ${data.saved_count || 'all'} marks successfully`);
      } else {
        addToast('error', data.error || 'Failed to save marks');
      }
    } catch (error) {
      addToast('error', 'Failed to save marks');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const processBulkUpload = (uploadedData) => {
    let imported = 0;
    uploadedData.forEach(row => {
      const student = students.find(s => s.admission_no === row['Admission_No'] || s.admission_no === row['Admission_No']?.toString());
      if (student) {
        subjects.forEach(subject => {
          const sbaKey = `${subject.name}_SBA`;
          const examKey = `${subject.name}_Summative`;
          if (row[sbaKey] !== undefined && row[examKey] !== undefined) {
            const sbaScore = row[sbaKey].toString();
            const examScore = row[examKey].toString();
            if (sbaScore && examScore) {
              handleMarkChange(student.id, subject.id, 'sba', sbaScore);
              handleMarkChange(student.id, subject.id, 'exam', examScore);
              imported++;
            }
          }
        });
      }
    });
    addToast('success', `Imported ${imported} subject marks`);
  };

  const getStudentAverage = (studentId) => {
    let total = 0, count = 0;
    subjects.forEach(subject => {
      const marks = marksData[studentId]?.[subject.id];
      if (marks?.weighted_total !== null && marks?.weighted_total !== undefined) {
        total += marks.weighted_total;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : null;
  };

  const getOverallClassAverage = () => {
    let total = 0, count = 0;
    students.forEach(student => {
      const avg = getStudentAverage(student.id);
      if (avg) { total += parseFloat(avg); count++; }
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  };

  const getCompletionRate = () => {
    let completed = 0, total = 0;
    students.forEach(student => {
      subjects.forEach(subject => {
        const marks = marksData[student.id]?.[subject.id];
        if (marks?.sba !== null && marks?.sba !== '' && marks?.exam !== null && marks?.exam !== '') completed++;
        total++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const toggleExpand = (studentId) => {
    setExpandedStudents(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access marks entry</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium rounded-lg inline-block">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (<Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />))}
      {(loading.saving) && <GlobalSpinner />}

      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">JSS Marks Entry (KNEC Compliant)</h1>
            <p className="text-green-100 mt-1">9-Subject Curriculum | SBA + Summative | 8-Point Achievement Level</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowBulkUpload(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Upload className="h-4 w-4 inline mr-2" /> Bulk Upload</button>
            <button onClick={handleSaveAll} disabled={loading.saving} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"><Save className="h-4 w-4 inline mr-2" /> Save All</button>
            <button onClick={fetchStudents} disabled={loading.students} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"><RefreshCw className="h-4 w-4 inline mr-2" /> Refresh</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select 
                value={selectedClass?.id || ''} 
                onChange={(e) => {
                  const newClass = classes.find(c => c.id === e.target.value);
                  setSelectedClass(newClass);
                }} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" 
                disabled={loading.classes}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name} (Grade {cls.grade_level})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Term</label>
              <select 
                value={selectedTerm} 
                onChange={(e) => setSelectedTerm(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                {terms.map(term => (
                  <option key={term.id} value={term.name}>{term.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">View Mode</label>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('student')} className={`flex-1 px-3 py-2 text-sm border rounded-lg ${viewMode === 'student' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>By Student</button>
                <button onClick={() => setViewMode('subject')} className={`flex-1 px-3 py-2 text-sm border rounded-lg ${viewMode === 'subject' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>By Subject</button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-600">Class Average</p>
            <p className="text-2xl font-bold text-green-700">{getOverallClassAverage()}%</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-blue-700">{getCompletionRate()}%</p>
          </div>
        </div>

        {loading.students ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : viewMode === 'student' ? (
          <div className="space-y-3">
            {students.map(student => {
              const avg = getStudentAverage(student.id);
              const level = avg ? calculateAchievementLevel(parseFloat(avg)) : null;
              const isExpanded = expandedStudents[student.id];
              return (
                <div key={student.id} className="bg-white rounded-lg border border-gray-200">
                  <div 
                    className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center rounded-t-lg" 
                    onClick={() => toggleExpand(student.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-bold">{student.first_name?.charAt(0)}{student.last_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{student.first_name} {student.last_name}</p>
                        <p className="text-xs text-gray-500">Admission: {student.admission_no}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {avg && (
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-700">{avg}%</div>
                          <div className="text-xs text-gray-500">Overall</div>
                        </div>
                      )}
                      {level && (
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                          {level.label} ({level.level})
                        </div>
                      )}
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjects.map(subject => {
                          const marks = marksData[student.id]?.[subject.id] || { sba: null, exam: null, weighted_total: null, grade: null };
                          return (
                            <div key={subject.id} className={`bg-white border p-4 rounded-lg ${marks.weighted_total !== null ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-gray-900">{subject.name}</h3>
                                  <p className="text-xs text-gray-500">{subject.code}</p>
                                </div>
                                {marks.weighted_total !== null && (
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-green-700">{marks.weighted_total}%</div>
                                    <div className="text-xs font-medium text-green-600">{marks.grade}</div>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-red-400 mb-1">
                                    SBA Average ({subject.sba_weight}%) - Auto-calculated from assessments
                                  </label>
                                  <input 
                                    type="number" 
                                    value={marks.sba === null ? '' : marks.sba} 
                                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-100" 
                                    readOnly
                                    disabled
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">Summative ({subject.exam_weight}%)</label>
                                  <input 
                                    type="number" 
                                    value={marks.exam === null ? '' : marks.exam} 
                                    onChange={(e) => handleMarkChange(student.id, subject.id, 'exam', e.target.value)} 
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded" 
                                    placeholder="0-100" 
                                    min="0" 
                                    max="100" 
                                    step="0.5" 
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Subject</label>
              <select 
                value={selectedSubject?.id || ''} 
                onChange={(e) => setSelectedSubject(subjects.find(s => s.id === e.target.value))} 
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white w-full md:w-64"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            {selectedSubject && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Admission No.</th>
                      <th className="px-4 py-3 text-left">Student Name</th>
                      <th className="px-4 py-3 text-center">SBA ({selectedSubject.sba_weight}%)</th>
                      <th className="px-4 py-3 text-center">Summative ({selectedSubject.exam_weight}%)</th>
                      <th className="px-4 py-3 text-center">Weighted Total</th>
                      <th className="px-4 py-3 text-center">Achievement Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const marks = marksData[student.id]?.[selectedSubject.id] || {};
                      return (
                        <tr key={student.id} className="border-b border-gray-200">
                          <td className="px-4 py-3">{student.admission_no}</td>
                          <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="number" 
                              value={marks.sba === null ? '' : marks.sba} 
                              onChange={(e) => handleMarkChange(student.id, selectedSubject.id, 'sba', e.target.value)} 
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded" 
                              min="0" 
                              max="100" 
                              step="0.5" 
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="number" 
                              value={marks.exam === null ? '' : marks.exam} 
                              onChange={(e) => handleMarkChange(student.id, selectedSubject.id, 'exam', e.target.value)} 
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded" 
                              min="0" 
                              max="100" 
                              step="0.5" 
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {marks.weighted_total !== null ? `${marks.weighted_total}%` : '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {marks.grade && (
                              <span className={`px-2 py-1 text-xs font-bold rounded ${
                                marks.grade === 'EE1' || marks.grade === 'EE2' ? 'bg-green-100 text-green-800' : 
                                marks.grade === 'ME1' || marks.grade === 'ME2' ? 'bg-blue-100 text-blue-800' : 
                                marks.grade === 'AE1' || marks.grade === 'AE2' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {marks.grade}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBulkUpload(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Bulk Upload Marks</h3>
              <button onClick={() => setShowBulkUpload(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Instructions</h4>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Prepare Excel file with columns: Admission_No, Student_Name, and [Subject_Name]_SBA, [Subject_Name]_Summative</li>
                  <li>Scores must be between 0 and 100</li>
                  <li>Admission numbers must match existing students</li>
                </ul>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload Excel/CSV file with student marks</p>
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  onChange={async (e) => { 
                    const file = e.target.files[0]; 
                    if (!file) return; 
                    const reader = new FileReader(); 
                    reader.onload = (evt) => { 
                      const data = new Uint8Array(evt.target.result); 
                      const workbook = XLSX.read(data, { type: 'array' }); 
                      const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
                      const json = XLSX.utils.sheet_to_json(sheet); 
                      processBulkUpload(json); 
                      setShowBulkUpload(false); 
                    }; 
                    reader.readAsArrayBuffer(file); 
                  }} 
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default JssEntryMarks;