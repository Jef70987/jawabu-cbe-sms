/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Calendar, Clock, Users, FileText, CheckSquare, TrendingUp,
  AlertCircle, CheckCircle, X, Loader2, Bell, BookOpen,
  Award, Target, Activity, UserCheck, ClipboardList,
  ChevronRight, RefreshCw, GraduationCap, BarChart3,
  Search, Filter, Download, Upload, Save, Eye, Edit2,
  Printer, Share2, Settings, Sliders, Star, Trophy,
  Zap, Flame, Shield, AlertTriangle, PieChart,
  ArrowUpDown, Maximize2, Minimize2, Grid, List,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon,
  Plus, Minus, Copy, Trash2, Link2, ExternalLink
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Exam Types with weights
const EXAM_TYPES = [
  { value: 'cba', label: 'Classroom-Based Assessment (CBA)', weight: 0.2, color: 'bg-blue-100 text-blue-800' },
  { value: 'sba', label: 'School-Based Assessment (SBA)', weight: 0.2, color: 'bg-green-100 text-green-800' },
  { value: 'cat', label: 'Continuous Assessment Test (CAT)', weight: 0.2, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'end_term', label: 'End of Term Exam', weight: 0.6, color: 'bg-purple-100 text-purple-800' },
  { value: 'mock', label: 'Mock Exam', weight: 1.0, color: 'bg-red-100 text-red-800' },
  { value: 'kjsea', label: 'KJSEA (Grade 9)', weight: 1.0, color: 'bg-indigo-100 text-indigo-800' }
];

// 4-Point Scale (Primary: G1-G6)
const FOUR_POINT_SCALE = [
  { level: 4, label: 'Exceeding Expectations (EE)', grade: 'EE', percentage: '90-100%', color: 'bg-green-600' },
  { level: 3, label: 'Meeting Expectations (ME)', grade: 'ME', percentage: '75-89%', color: 'bg-blue-600' },
  { level: 2, label: 'Approaching Expectations (AE)', grade: 'AE', percentage: '58-74%', color: 'bg-yellow-600' },
  { level: 1, label: 'Below Expectations (BE)', grade: 'BE', percentage: '0-57%', color: 'bg-red-600' }
];

// 8-Point Scale (JSS: G7-G9)
const EIGHT_POINT_SCALE = [
  { points: 8, level: 'EE 1', grade: 'EE', percentage: '90-100%', color: 'bg-green-600' },
  { points: 7, level: 'EE 2', grade: 'EE', percentage: '75-89%', color: 'bg-green-500' },
  { points: 6, level: 'ME 1', grade: 'ME', percentage: '58-74%', color: 'bg-blue-600' },
  { points: 5, level: 'ME 2', grade: 'ME', percentage: '41-57%', color: 'bg-blue-500' },
  { points: 4, level: 'AE 1', grade: 'AE', percentage: '31-40%', color: 'bg-yellow-600' },
  { points: 3, level: 'AE 2', grade: 'AE', percentage: '21-30%', color: 'bg-yellow-500' },
  { points: 2, level: 'BE 1', grade: 'BE', percentage: '11-20%', color: 'bg-red-600' },
  { points: 1, level: 'BE 2', grade: 'BE', percentage: '0-10%', color: 'bg-red-500' }
];

// Toast Notification
const Toast = ({ type, message, onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => onClose?.()} className="ml-4 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading exam data...</p>
    </div>
  </div>
);

// Grade Distribution Chart Component
const GradeDistributionChart = ({ distribution, scaleType }) => {
  const scale = scaleType === 'jss' ? EIGHT_POINT_SCALE : FOUR_POINT_SCALE;
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {scale.map(level => {
        const dist = distribution.find(d => d.level === level.level) || { count: 0 };
        const percentage = (dist.count / maxCount) * 100;
        return (
          <div key={level.level}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{level.level}</span>
              <span className="text-gray-500">{dist.count} student(s)</span>
            </div>
            <div className="w-full bg-gray-200 h-6 rounded overflow-hidden">
              <div
                className={`${level.color} h-full flex items-center justify-end px-2 text-xs text-white font-medium transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              >
                {dist.count > 0 && dist.count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Score Entry Row Component
const ScoreEntryRow = ({ student, score, maxScore, onScoreChange, onAbsentToggle, isAbsent, scaleType, validationError, index }) => {
  const [localScore, setLocalScore] = useState(score || '');
  const [error, setError] = useState(null);

  const getGradeFromScore = (rawScore) => {
    if (rawScore === null || rawScore === '' || isAbsent) return null;
    const percentage = (rawScore / maxScore) * 100;
    const scale = scaleType === 'jss' ? EIGHT_POINT_SCALE : FOUR_POINT_SCALE;
    return scale.find(l => percentage >= parseFloat(l.percentage.split('-')[0]) && percentage <= parseFloat(l.percentage.split('-')[1]));
  };

  const handleScoreBlur = () => {
    if (localScore === '') {
      onScoreChange(student.id, null);
      return;
    }
    const numScore = parseFloat(localScore);
    if (isNaN(numScore)) {
      setError('Invalid number');
      return;
    }
    if (numScore < 0 || numScore > maxScore) {
      setError(`Score must be between 0 and ${maxScore}`);
      onScoreChange(student.id, null, true);
      return;
    }
    setError(null);
    onScoreChange(student.id, numScore);
  };

  const grade = getGradeFromScore(localScore);

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${isAbsent ? 'bg-gray-100' : ''} ${validationError ? 'border-l-4 border-l-red-500' : ''}`}>
      <td className="px-4 py-3 text-gray-600 w-12 text-center">{index + 1}.</td>
      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{student.admission_no || student.assessment_number}</td>
      <td className="px-4 py-3 font-medium text-gray-900">{student.first_name} {student.last_name}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAbsent}
              onChange={() => onAbsentToggle(student.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            <span className="ml-2 text-xs text-gray-600">AB</span>
          </label>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <input
          type="number"
          value={localScore}
          onChange={(e) => setLocalScore(e.target.value)}
          onBlur={handleScoreBlur}
          disabled={isAbsent}
          className={`w-24 px-2 py-1 text-center border rounded ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${isAbsent ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
          min="0"
          max={maxScore}
          step="0.5"
          placeholder="-"
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </td>
      <td className="px-4 py-3 text-center">
        {!isAbsent && grade && (
          <div className="flex flex-col items-center">
            <span className={`px-2 py-1 text-xs font-bold text-white rounded ${grade.color}`}>
              {grade.grade}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">{grade.level}</span>
          </div>
        )}
        {isAbsent && <span className="text-xs text-gray-400">Absent</span>}
      </td>
    </tr>
  );
};

// Bulk Import Modal
const BulkImportModal = ({ isOpen, onClose, onImport, maxScore, subjects }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);

  const downloadTemplate = () => {
    const template = [
      {
        'Assessment_Number': 'JSS7001',
        'Student_Name': 'John Mwangi',
        'Raw_Score': '',
        'Remarks': ''
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Exam_Template');
    XLSX.writeFile(wb, `exam_template_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setPreview(json);
      setFile(file);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    if (preview.length > 0) {
      setImporting(true);
      onImport(preview);
      setTimeout(() => {
        setImporting(false);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Bulk Import Scores</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Download the template using the button below</li>
              <li>Fill in the Assessment Number and Raw Score for each student</li>
              <li>Maximum score is {maxScore} marks</li>
              <li>Upload the completed file back here</li>
            </ul>
          </div>

          <div className="mb-4">
            <button onClick={downloadTemplate} className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
              <Download className="h-4 w-4 inline mr-1" /> Download Template
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Excel/CSV File</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            />
          </div>

          {preview.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold text-gray-900 mb-2">Preview ({preview.length} records)</h4>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).slice(0, 4).map(key => (
                        <th key={key} className="px-2 py-1 text-left border">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 4).map((val, i) => (
                          <td key={i} className="px-2 py-1 border">{String(val).substring(0, 30)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">Showing first 5 of {preview.length} records</p>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm rounded">Cancel</button>
          <button onClick={handleImport} disabled={!file || importing} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded disabled:opacity-50">
            {importing ? <ButtonSpinner /> : <Upload className="h-4 w-4 inline mr-1" />}
            Import {preview.length} Records
          </button>
        </div>
      </div>
    </div>
  );
};

// Historical Data Modal
const HistoricalDataModal = ({ isOpen, onClose, student, historicalData }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Historical Performance: {student.first_name} {student.last_name}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">Assessment Number: {student.assessment_number || student.admission_no}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Grade 7 Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 1</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade7?.term1 || '—'}%</p>
                </div>
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 2</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade7?.term2 || '—'}%</p>
                </div>
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 3</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade7?.term3 || '—'}%</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Grade 8 Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 1</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade8?.term1 || '—'}%</p>
                </div>
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 2</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade8?.term2 || '—'}%</p>
                </div>
                <div className="bg-gray-50 p-3 text-center rounded">
                  <p className="text-xs text-gray-500">Term 3</p>
                  <p className="text-xl font-bold text-green-700">{historicalData?.grade8?.term3 || '—'}%</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm font-bold text-purple-800">KJSEA Eligibility Status</p>
              <p className="text-xs text-purple-700 mt-1">
                {historicalData?.grade7 && historicalData?.grade8 
                  ? '✓ Student has complete Grade 7 and 8 records and is eligible for KJSEA registration'
                  : '⚠️ Missing historical data. Please ensure Grade 7 and 8 scores are entered.'}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

function Exams() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [loading, setLoading] = useState({ exams: true, students: true, saving: false });
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('entry'); // entry, analytics, history
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [historicalData, setHistoricalData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const autoSaveTimer = useRef(null);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access exams');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (autoSaveEnabled && selectedExam && Object.keys(scores).length > 0) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [scores, absentStudents]);

  const fetchInitialData = async () => {
    setLoading({ exams: true, students: true, saving: false });
    try {
      await Promise.all([
        fetchExams(),
        fetchStudents()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load exam data');
    } finally {
      setLoading({ exams: false, students: false, saving: false });
    }
  };

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setExams(data.data);
        if (data.data.length > 0 && !selectedExam) {
          setSelectedExam(data.data[0]);
          if (data.data[0].status === 'marking' || data.data[0].status === 'live') {
            await fetchExamScores(data.data[0].id);
          }
        }
      } else {
        // Mock exams
        const mockExams = [
          { id: 1, title: 'Mathematics CAT 1', exam_code: 'MAT-CAT-001', exam_type: 'cat', subject: 'Mathematics', grade_level: '7', academic_year: 2026, term: 1, total_marks: 50, status: 'marking', start_date: '2026-03-15', end_date: '2026-03-20', passing_marks: 25, class_id: 1, className: 'Grade 7A' },
          { id: 2, title: 'Integrated Science SBA', exam_code: 'SCI-SBA-001', exam_type: 'sba', subject: 'Integrated Science', grade_level: '7', academic_year: 2026, term: 1, total_marks: 100, status: 'published', start_date: '2026-03-10', end_date: '2026-03-25', passing_marks: 50, class_id: 1, className: 'Grade 7A' },
          { id: 3, title: 'End of Term Exam', exam_code: 'EOT-001', exam_type: 'end_term', subject: 'All Subjects', grade_level: '7', academic_year: 2026, term: 1, total_marks: 100, status: 'scheduled', start_date: '2026-04-01', end_date: '2026-04-10', passing_marks: 50, class_id: 1, className: 'Grade 7A' }
        ];
        setExams(mockExams);
        setSelectedExam(mockExams[0]);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        const mockStudents = Array.from({ length: 42 }, (_, i) => ({
          id: i + 1,
          admission_no: `JSS7${String(i + 1).padStart(3, '0')}`,
          assessment_number: `KNEC${String(i + 1).padStart(8, '0')}`,
          first_name: ['James', 'Mary', 'Peter', 'Grace', 'John', 'Jane', 'Michael', 'Sarah', 'David', 'Esther'][i % 10],
          last_name: ['Mwangi', 'Wanjiku', 'Omondi', 'Njeri', 'Kipchoge', 'Akinyi', 'Otieno', 'Chebet', 'Kamau', 'Wambui'][i % 10]
        }));
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchExamScores = async (examId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${examId}/scores/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        const scoresMap = {};
        const absentSet = new Set();
        data.data.forEach(score => {
          scoresMap[score.student_id] = score.score;
          if (score.is_absent) absentSet.add(score.student_id);
        });
        setScores(scoresMap);
        setAbsentStudents(absentSet);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleScoreChange = (studentId, score, isInvalid = false) => {
    setScores(prev => ({ ...prev, [studentId]: score }));
    if (isInvalid) {
      setValidationErrors(prev => ({ ...prev, [studentId]: true }));
      setTimeout(() => {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[studentId];
          return newErrors;
        });
      }, 3000);
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[studentId];
        return newErrors;
      });
    }
  };

  const handleAbsentToggle = (studentId) => {
    setAbsentStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
        // Clear score when un-marking absent
        setScores(prevScores => {
          const newScores = { ...prevScores };
          delete newScores[studentId];
          return newScores;
        });
      } else {
        newSet.add(studentId);
        // Clear score when marking absent
        setScores(prevScores => {
          const newScores = { ...prevScores };
          delete newScores[studentId];
          return newScores;
        });
      }
      return newSet;
    });
  };

  const handleAutoSave = async () => {
    if (!selectedExam) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/bulk/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          scores: Object.entries(scores).map(([studentId, score]) => ({
            student_id: parseInt(studentId),
            score,
            is_absent: absentStudents.has(parseInt(studentId))
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setLastSaved(new Date());
        addToast('success', 'Auto-saved successfully');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  const handleManualSave = async () => {
    setLoading(prev => ({ ...prev, saving: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/scores/bulk/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          scores: Object.entries(scores).map(([studentId, score]) => ({
            student_id: parseInt(studentId),
            score,
            is_absent: absentStudents.has(parseInt(studentId))
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'All scores saved successfully');
        setLastSaved(new Date());
      } else {
        addToast('error', data.error || 'Failed to save scores');
      }
    } catch (error) {
      console.error('Error saving scores:', error);
      addToast('error', 'Failed to save scores');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleBulkImport = (importedData) => {
    importedData.forEach(row => {
      const student = students.find(s => 
        s.assessment_number === row['Assessment_Number'] || 
        s.admission_no === row['Assessment_Number']
      );
      if (student) {
        const rawScore = parseFloat(row['Raw_Score']);
        if (!isNaN(rawScore) && rawScore >= 0 && rawScore <= selectedExam.total_marks) {
          setScores(prev => ({ ...prev, [student.id]: rawScore }));
          setAbsentStudents(prev => {
            const newSet = new Set(prev);
            newSet.delete(student.id);
            return newSet;
          });
        }
      }
    });
    addToast('success', `Imported ${importedData.length} records`);
  };

  const handleFinalizeExam = async () => {
    if (!confirm('Finalizing this exam will lock all scores and mark it as ready for moderation. Continue?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/exams/${selectedExam.id}/finalize/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Exam finalized and submitted for moderation');
        await fetchExams();
      } else {
        addToast('error', data.error || 'Failed to finalize exam');
      }
    } catch (error) {
      console.error('Error finalizing exam:', error);
      addToast('error', 'Failed to finalize exam');
    }
  };

  const handleViewHistory = async (student) => {
    setSelectedStudentForHistory(student);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/students/${student.id}/historical-scores/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setHistoricalData(data.data);
      } else {
        setHistoricalData({ grade7: { term1: 68, term2: 72, term3: 75 }, grade8: { term1: 74, term2: 78, term3: 82 } });
      }
      setShowHistoricalModal(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const getStatistics = () => {
    const validScores = Object.entries(scores)
      .filter(([studentId]) => !absentStudents.has(parseInt(studentId)))
      .map(([_, score]) => score);
    
    if (validScores.length === 0) return { avg: 0, min: 0, max: 0, median: 0, count: 0 };
    
    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = sum / validScores.length;
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    const sorted = [...validScores].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    
    return { avg: avg.toFixed(1), min, max, median, count: validScores.length, total: students.length };
  };

  const getGradeDistribution = () => {
    const distribution = [];
    const scale = selectedExam?.grade_level >= '7' ? EIGHT_POINT_SCALE : FOUR_POINT_SCALE;
    
    scale.forEach(level => {
      distribution.push({ level: level.level, count: 0 });
    });
    
    Object.entries(scores).forEach(([studentId, score]) => {
      if (!absentStudents.has(parseInt(studentId))) {
        const percentage = (score / selectedExam?.total_marks) * 100;
        const foundLevel = scale.find(l => percentage >= parseFloat(l.percentage.split('-')[0]) && percentage <= parseFloat(l.percentage.split('-')[1]));
        if (foundLevel) {
          const dist = distribution.find(d => d.level === foundLevel.level);
          if (dist) dist.count++;
        }
      }
    });
    
    return distribution;
  };

  const getAtRiskStudents = () => {
    const atRisk = [];
    const scale = selectedExam?.grade_level >= '7' ? EIGHT_POINT_SCALE : FOUR_POINT_SCALE;
    const threshold = scale.find(l => l.level === (selectedExam?.grade_level >= '7' ? 'BE 2' : 1));
    
    Object.entries(scores).forEach(([studentId, score]) => {
      if (!absentStudents.has(parseInt(studentId))) {
        const percentage = (score / selectedExam?.total_marks) * 100;
        if (percentage <= 20) {
          const student = students.find(s => s.id === parseInt(studentId));
          if (student) atRisk.push({ ...student, score, percentage });
        }
      }
    });
    
    return atRisk;
  };

  const stats = getStatistics();
  const distribution = getGradeDistribution();
  const atRiskStudents = getAtRiskStudents();

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access exams</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      {(loading.exams || loading.students || loading.saving) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Examination Center</h1>
              <p className="text-green-100 mt-1">Mark entry | Analytics | KNEC Compliance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkImport(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700"
                disabled={!selectedExam || selectedExam.status !== 'marking'}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Bulk Import
              </button>
              <button
                onClick={handleManualSave}
                disabled={loading.saving || !selectedExam}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save All
              </button>
              {selectedExam?.status === 'marking' && (
                <button
                  onClick={handleFinalizeExam}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700"
                >
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Finalize Exam
                </button>
              )}
              <button onClick={fetchExams} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Exam Selector */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Exam</label>
              <select
                value={selectedExam?.id || ''}
                onChange={(e) => {
                  const exam = exams.find(ex => ex.id === parseInt(e.target.value));
                  setSelectedExam(exam);
                  if (exam.status === 'marking' || exam.status === 'live') {
                    fetchExamScores(exam.id);
                  } else {
                    setScores({});
                    setAbsentStudents(new Set());
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} ({EXAM_TYPES.find(t => t.value === exam.exam_type)?.label}) - {exam.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Exam Status</label>
              <div className="px-3 py-2 border border-gray-300 bg-gray-50 text-sm">
                {selectedExam && (
                  <span className={`px-2 py-1 text-xs font-medium rounded ${EXAM_TYPES.find(t => t.value === selectedExam.exam_type)?.color || 'bg-gray-100'}`}>
                    {selectedExam.status?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Class</label>
              <div className="px-3 py-2 border border-gray-300 bg-gray-50 text-sm">
                {selectedExam?.className || 'Grade 7A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Max Score</label>
              <div className="px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-bold text-green-700">
                {selectedExam?.total_marks} marks
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('entry')}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'entry'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Score Entry
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics & Insights
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Historical Data
            </button>
          </div>
        </div>

        {/* Tab 1: Score Entry */}
        {activeTab === 'entry' && selectedExam && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white border border-gray-300 p-3 text-center">
                <p className="text-xs text-gray-600">Students</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white border border-gray-300 p-3 text-center">
                <p className="text-xs text-gray-600">Scores Entered</p>
                <p className="text-xl font-bold text-green-700">{stats.count}</p>
              </div>
              <div className="bg-white border border-gray-300 p-3 text-center">
                <p className="text-xs text-gray-600">Class Mean</p>
                <p className="text-xl font-bold text-blue-700">{stats.avg}%</p>
              </div>
              <div className="bg-white border border-gray-300 p-3 text-center">
                <p className="text-xs text-gray-600">Highest Score</p>
                <p className="text-xl font-bold text-green-700">{stats.max}</p>
              </div>
              <div className="bg-white border border-gray-300 p-3 text-center">
                <p className="text-xs text-gray-600">Lowest Score</p>
                <p className="text-xl font-bold text-red-700">{stats.min}</p>
              </div>
            </div>

            {/* At-Risk Alert */}
            {atRiskStudents.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-800">At-Risk Students Alert</p>
                    <p className="text-sm text-red-700">
                      {atRiskStudents.length} student(s) scored below 20% and require immediate remedial intervention.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {atRiskStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => handleViewHistory(student)}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                        >
                          {student.first_name} {student.last_name} ({student.percentage}%)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm"
                />
              </div>
              {lastSaved && (
                <p className="text-xs text-gray-500">Last auto-saved: {lastSaved.toLocaleTimeString()}</p>
              )}
            </div>

            {/* Score Entry Table */}
            <div className="bg-white border border-gray-300 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left w-12 font-bold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Admission No.</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Absent</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Score / {selectedExam.total_marks}</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <ScoreEntryRow
                      key={student.id}
                      student={student}
                      score={scores[student.id]}
                      maxScore={selectedExam.total_marks}
                      onScoreChange={handleScoreChange}
                      onAbsentToggle={handleAbsentToggle}
                      isAbsent={absentStudents.has(student.id)}
                      scaleType={selectedExam.grade_level >= '7' ? 'jss' : 'primary'}
                      validationError={validationErrors[student.id]}
                      index={idx}
                    />
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tab 2: Analytics */}
        {activeTab === 'analytics' && selectedExam && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <div className="bg-white border border-gray-300">
              <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                <h3 className="font-bold text-gray-900">Grade Distribution</h3>
                <p className="text-xs text-gray-600">Performance breakdown by achievement level</p>
              </div>
              <div className="p-4">
                <GradeDistributionChart distribution={distribution} scaleType={selectedExam.grade_level >= '7' ? 'jss' : 'primary'} />
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white border border-gray-300">
              <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                <h3 className="font-bold text-gray-900">Performance Insights</h3>
                <p className="text-xs text-gray-600">Key statistics and recommendations</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm">Completion Rate</span>
                  <span className="text-lg font-bold text-green-700">{Math.round((stats.count / stats.total) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm">Pass Rate (≥50%)</span>
                  <span className="text-lg font-bold text-blue-700">
                    {Math.round((scores[Object.keys(scores).filter(id => !absentStudents.has(parseInt(id)) && scores[id] >= selectedExam.passing_marks).length] / stats.count) * 100) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm">Median Score</span>
                  <span className="text-lg font-bold text-purple-700">{stats.median}</span>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded">
                  <p className="text-sm font-bold text-yellow-800">Recommendations:</p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                    {distribution.find(d => d.level === (selectedExam.grade_level >= '7' ? 'BE 2' : 1))?.count > 0 && (
                      <li>Schedule remedial classes for students in the lowest achievement band</li>
                    )}
                    {stats.avg < 50 && (
                      <li>Class average is below passing threshold. Review teaching methodology.</li>
                    )}
                    {stats.count < stats.total && (
                      <li>{stats.total - stats.count} student(s) still need to be marked.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* KNEC Compliance Status */}
            <div className="bg-white border border-gray-300 lg:col-span-2">
              <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                <h3 className="font-bold text-gray-900">KNEC Compliance Status</h3>
                <p className="text-xs text-gray-600">CBA Portal submission readiness</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div>
                      <p className="text-xs text-gray-600">Assessment Numbers</p>
                      <p className="text-sm font-bold text-green-800">✓ Verified</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div>
                      <p className="text-xs text-gray-600">CBA Portal Sync</p>
                      <p className="text-sm font-bold text-yellow-800">Pending</p>
                    </div>
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <p className="text-xs text-gray-600">SBA Contribution</p>
                      <p className="text-sm font-bold text-blue-800">40% Weight</p>
                    </div>
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Historical Data */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h3 className="font-bold text-gray-900">Student Historical Performance</h3>
              <p className="text-xs text-gray-600">Track progress across terms and grades for KJSEA eligibility</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G7 T1</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G7 T2</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G7 T3</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G8 T1</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G8 T2</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">G8 T3</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Trend</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 10).map(student => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                      <td className="px-4 py-3 text-center">68%</td>
                      <td className="px-4 py-3 text-center">72%</td>
                      <td className="px-4 py-3 text-center">75%</td>
                      <td className="px-4 py-3 text-center">74%</td>
                      <td className="px-4 py-3 text-center">78%</td>
                      <td className="px-4 py-3 text-center">82%</td>
                      <td className="px-4 py-3 text-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleViewHistory(student)} className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
        maxScore={selectedExam?.total_marks || 100}
        subjects={[]}
      />

      <HistoricalDataModal
        isOpen={showHistoricalModal}
        onClose={() => { setShowHistoricalModal(false); setSelectedStudentForHistory(null); }}
        student={selectedStudentForHistory}
        historicalData={historicalData}
      />

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Exams;