/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  Plus, RefreshCw, FileText, CheckSquare, X, Loader2,
  AlertCircle, CheckCircle, Eye, Edit2, Trash2, Copy,
  Calendar, Clock, Users, BarChart3, TrendingUp,
  Download, Upload, Search, Filter, ChevronDown,
  ChevronUp, ChevronLeft, ChevronRight, Grid, List,
  Award, Target, Activity, UserCheck, ClipboardList,
  BookOpen, GraduationCap, PieChart, Save, Send,
  Printer, Share2, Settings, Sliders, Star, Trophy,
  Zap, Flame, Bell, Lock, Unlock, Calculator,
  Database, HardDrive, Shield, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// JSS Subjects (9-subject rationalized curriculum as per KICD 2026)
const JSS_SUBJECTS = [
  { id: 'eng', name: 'English', code: 'ENG', sbaWeight: 40, examWeight: 60 },
  { id: 'kis', name: 'Kiswahili / KSL', code: 'KIS', sbaWeight: 40, examWeight: 60 },
  { id: 'mat', name: 'Mathematics', code: 'MAT', sbaWeight: 40, examWeight: 60 },
  { id: 'sci', name: 'Integrated Science', code: 'SCI', sbaWeight: 40, examWeight: 60 },
  { id: 'sst', name: 'Social Studies', code: 'SST', sbaWeight: 40, examWeight: 60 },
  { id: 'agri', name: 'Agriculture & Nutrition', code: 'AGN', sbaWeight: 40, examWeight: 60 },
  { id: 'pts', name: 'Pre-Technical Studies', code: 'PTS', sbaWeight: 40, examWeight: 60 },
  { id: 'cas', name: 'Creative Arts & Sports', code: 'CAS', sbaWeight: 40, examWeight: 60 },
  { id: 're', name: 'Religious Education', code: 'RE', sbaWeight: 40, examWeight: 60 }
];

// 8-Point Achievement Level Scale (KNEC JSS Standard)
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

// Calculate Achievement Level from percentage
const calculateAchievementLevel = (percentage) => {
  if (percentage === null || percentage === undefined) return ACHIEVEMENT_LEVELS[8];
  const level = ACHIEVEMENT_LEVELS.find(l => percentage >= l.min && percentage <= l.max);
  return level || ACHIEVEMENT_LEVELS[8];
};

// Calculate weighted total from SBA and Summative scores
const calculateWeightedTotal = (sbaScore, examScore, sbaWeight = 40, examWeight = 60) => {
  if (sbaScore === null || examScore === null) return null;
  const weighted = (sbaScore * sbaWeight / 100) + (examScore * examWeight / 100);
  return Math.round(weighted * 10) / 10;
};

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
      <p className="text-gray-700 font-medium">Processing...</p>
    </div>
  </div>
);

// Subject Card Component
const SubjectCard = ({ subject, marks, onMarkEntry, onValidationError }) => {
  const [localSBA, setLocalSBA] = useState(marks?.sba || '');
  const [localExam, setLocalExam] = useState(marks?.exam || '');
  const [error, setError] = useState(null);

  const validateScore = (value, field) => {
    if (value === '' || value === null) return true;
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (num < 0 || num > 100) return false;
    return true;
  };

  const handleSBAChange = (value) => {
    setError(null);
    if (!validateScore(value, 'sba')) {
      setError('Score must be between 0 and 100');
      onValidationError?.(subject.id, 'sba', 'Invalid score range');
      return;
    }
    setLocalSBA(value);
    const sbaScore = value === '' ? null : parseFloat(value);
    const examScore = localExam === '' ? null : parseFloat(localExam);
    const weightedTotal = calculateWeightedTotal(sbaScore, examScore, subject.sbaWeight, subject.examWeight);
    const achievementLevel = weightedTotal !== null ? calculateAchievementLevel(weightedTotal) : null;
    
    onMarkEntry?.(subject.id, {
      sba: sbaScore,
      exam: examScore,
      weightedTotal,
      achievementLevel,
      levelCode: achievementLevel?.code,
      grade: achievementLevel?.label
    });
  };

  const handleExamChange = (value) => {
    setError(null);
    if (!validateScore(value, 'exam')) {
      setError('Score must be between 0 and 100');
      onValidationError?.(subject.id, 'exam', 'Invalid score range');
      return;
    }
    setLocalExam(value);
    const sbaScore = localSBA === '' ? null : parseFloat(localSBA);
    const examScore = value === '' ? null : parseFloat(value);
    const weightedTotal = calculateWeightedTotal(sbaScore, examScore, subject.sbaWeight, subject.examWeight);
    const achievementLevel = weightedTotal !== null ? calculateAchievementLevel(weightedTotal) : null;
    
    onMarkEntry?.(subject.id, {
      sba: sbaScore,
      exam: examScore,
      weightedTotal,
      achievementLevel,
      levelCode: achievementLevel?.code,
      grade: achievementLevel?.label
    });
  };

  const weightedTotal = marks?.weightedTotal;
  const achievementLevel = marks?.achievementLevel;
  const isComplete = marks?.sba !== null && marks?.exam !== null && marks?.sba !== '' && marks?.exam !== '';

  return (
    <div className={`bg-white border p-4 ${isComplete ? 'border-green-300 bg-green-50' : 'border-gray-300'} ${error ? 'border-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{subject.name}</h3>
          <p className="text-xs text-gray-500">Code: {subject.code}</p>
        </div>
        {isComplete && (
          <div className="text-right">
            <div className="text-lg font-bold text-green-700">{weightedTotal}%</div>
            <div className="text-xs font-medium text-green-600">{achievementLevel?.label} ({achievementLevel?.level})</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            SBA Score ({subject.sbaWeight}%)
          </label>
          <input
            type="number"
            value={localSBA}
            onChange={(e) => handleSBAChange(e.target.value)}
            className={`w-full px-2 py-1 text-sm border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
            placeholder="0-100"
            min="0"
            max="100"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Summative Score ({subject.examWeight}%)
          </label>
          <input
            type="number"
            value={localExam}
            onChange={(e) => handleExamChange(e.target.value)}
            className={`w-full px-2 py-1 text-sm border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
            placeholder="0-100"
            min="0"
            max="100"
            step="0.5"
          />
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> {error}
        </div>
      )}

      {isComplete && weightedTotal !== null && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Achievement Level:</span>
            <span className="font-bold text-green-700">{achievementLevel?.level} - {achievementLevel?.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Student Row Component for Table View
const StudentMarksRow = ({ student, subjects, marksData, onMarkChange, onValidationError }) => {
  const [expanded, setExpanded] = useState(false);

  const getOverallAverage = () => {
    let total = 0;
    let count = 0;
    subjects.forEach(subject => {
      const marks = marksData[subject.id];
      if (marks?.weightedTotal !== null && marks?.weightedTotal !== undefined) {
        total += marks.weightedTotal;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : null;
  };

  const getOverallAchievementLevel = () => {
    const avg = getOverallAverage();
    if (avg === null) return null;
    return calculateAchievementLevel(parseFloat(avg));
  };

  const overallAvg = getOverallAverage();
  const overallLevel = getOverallAchievementLevel();

  return (
    <div className="border border-gray-300 mb-3">
      <div 
        className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-700 font-bold">
              {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900">{student.first_name} {student.last_name}</p>
            <p className="text-xs text-gray-500">Assessment No: {student.assessment_number || student.admission_no}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {overallAvg && (
            <div className="text-right">
              <div className="text-sm font-bold text-green-700">{overallAvg}%</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
          )}
          {overallLevel && (
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
              {overallLevel.label} ({overallLevel.level})
            </div>
          )}
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                marks={marksData[subject.id]}
                onMarkEntry={(subjectId, data) => onMarkChange(student.id, subjectId, data)}
                onValidationError={(subjectId, field, error) => onValidationError(student.id, subjectId, field, error)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Bulk Upload Modal
const BulkUploadModal = ({ isOpen, onClose, onUpload, subjects }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    const template = [
      {
        'Assessment_Number': 'JSS7001',
        'Student_Name': 'John Mwangi',
        ...subjects.reduce((acc, subject) => {
          acc[`${subject.name}_SBA`] = '';
          acc[`${subject.name}_Summative`] = '';
          return acc;
        }, {})
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks_Template');
    XLSX.writeFile(wb, 'jss_marks_template.xlsx');
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

  const handleUpload = () => {
    if (preview.length > 0) {
      setUploading(true);
      onUpload(preview);
      setTimeout(() => {
        setUploading(false);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Bulk Upload Marks</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Download the template using the button below</li>
              <li>Fill in SBA and Summative scores for each subject (0-100 range)</li>
              <li>Ensure Assessment Numbers match your class list</li>
              <li>Upload the completed file back here</li>
              <li>Invalid scores will be highlighted during validation</li>
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
                      {Object.keys(preview[0] || {}).slice(0, 5).map(key => (
                        <th key={key} className="px-2 py-1 text-left border">{key}</th>
                      ))}
                      <th className="px-2 py-1 text-left border">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 5).map((val, i) => (
                          <td key={i} className="px-2 py-1 border">{String(val).substring(0, 20)}</td>
                        ))}
                        <td className="px-2 py-1 border">...</td>
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
          <button onClick={handleUpload} disabled={!file || uploading} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded disabled:opacity-50">
            {uploading ? <ButtonSpinner /> : <Upload className="h-4 w-4 inline mr-1" />}
            Upload & Import
          </button>
        </div>
      </div>
    </div>
  );
};

// KJSEA Transition Tool Modal (for Grade 9 final placement)
const KJSEATransitionModal = ({ isOpen, onClose, student, marksData, subjects }) => {
  const [selectedTerm, setSelectedTerm] = useState('term3');
  
  // This would fetch historical data from Grade 7 and 8
  const historicalData = {
    grade7: { term1: 65, term2: 68, term3: 72 },
    grade8: { term1: 70, term2: 74, term3: 78 }
  };

  const calculateKJSEAScore = () => {
    // Formula: 30% Grade 7 + 30% Grade 8 + 40% Grade 9
    const grade7Avg = (historicalData.grade7.term1 + historicalData.grade7.term2 + historicalData.grade7.term3) / 3;
    const grade8Avg = (historicalData.grade8.term1 + historicalData.grade8.term2 + historicalData.grade8.term3) / 3;
    const grade9Avg = Object.values(marksData).reduce((sum, m) => sum + (m?.weightedTotal || 0), 0) / (subjects.length || 1);
    
    const kjseaScore = (grade7Avg * 0.3) + (grade8Avg * 0.3) + (grade9Avg * 0.4);
    return Math.round(kjseaScore * 10) / 10;
  };

  const kjseaScore = calculateKJSEAScore();
  const kjseaLevel = calculateAchievementLevel(kjseaScore);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">KJSEA Transition Tool</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-bold text-gray-900">Student: {student?.first_name} {student?.last_name}</h4>
            <p className="text-sm text-gray-600">Assessment Number: {student?.assessment_number || student?.admission_no}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grade 7 Average:</span>
                <span className="text-lg font-bold text-blue-700">{((historicalData.grade7.term1 + historicalData.grade7.term2 + historicalData.grade7.term3) / 3).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Based on Term 1, 2, and 3 assessments</div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grade 8 Average:</span>
                <span className="text-lg font-bold text-blue-700">{((historicalData.grade8.term1 + historicalData.grade8.term2 + historicalData.grade8.term3) / 3).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Based on Term 1, 2, and 3 assessments</div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grade 9 Average:</span>
                <span className="text-lg font-bold text-blue-700">{Object.values(marksData).reduce((sum, m) => sum + (m?.weightedTotal || 0), 0) / (subjects.length || 1)}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Current term performance</div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800">Predicted KJSEA Placement Score</p>
                <p className="text-3xl font-bold text-green-700 my-2">{kjseaScore}%</p>
                <p className="text-sm text-green-800">
                  Achievement Level: {kjseaLevel.label} ({kjseaLevel.level}) - {kjseaLevel.description}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  *This is a predictive score based on 30% G7 + 30% G8 + 40% G9 performance
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-800">Official KNEC Note:</p>
                <p className="text-xs text-yellow-700 mt-1">
                  The final KJSEA score is calculated by KNEC using national standardization. 
                  This tool provides an estimate based on school-based assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function JssEntryMarks() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState({ students: true, classes: true, saving: false });
  const [toasts, setToasts] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showKJSEA, setShowKJSEA] = useState(false);
  const [selectedStudentForKJSEA, setSelectedStudentForKJSEA] = useState(null);
  const [viewMode, setViewMode] = useState('student'); // student or subject
  const [selectedSubject, setSelectedSubject] = useState(JSS_SUBJECTS[0]);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveProgress, setSaveProgress] = useState(0);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access marks entry');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading({ students: true, classes: true, saving: false });
    try {
      await Promise.all([
        fetchClasses(),
        fetchStudents()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load data');
    } finally {
      setLoading({ students: false, classes: false, saving: false });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-classes/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
        if (data.data.length > 0 && !selectedClass) {
          setSelectedClass(data.data[0]);
        }
      } else {
        const mockClasses = [
          { id: 1, class_name: 'Grade 7A', stream: 'A', students: 42, grade: 7 },
          { id: 2, class_name: 'Grade 7B', stream: 'B', students: 40, grade: 7 },
          { id: 3, class_name: 'Grade 8A', stream: 'A', students: 44, grade: 8 },
          { id: 4, class_name: 'Grade 9A', stream: 'A', students: 38, grade: 9 }
        ];
        setClasses(mockClasses);
        setSelectedClass(mockClasses[0]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/${selectedClass?.id || 1}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        // Initialize marks data for students
        const initialMarks = {};
        data.data.forEach(student => {
          initialMarks[student.id] = {};
          JSS_SUBJECTS.forEach(subject => {
            initialMarks[student.id][subject.id] = {
              sba: null,
              exam: null,
              weightedTotal: null,
              achievementLevel: null
            };
          });
        });
        setMarksData(initialMarks);
      } else {
        // Mock students with assessment numbers
        const mockStudents = Array.from({ length: 42 }, (_, i) => ({
          id: i + 1,
          admission_no: `JSS7${String(i + 1).padStart(3, '0')}`,
          assessment_number: `KNEC${String(i + 1).padStart(8, '0')}`,
          first_name: ['James', 'Mary', 'Peter', 'Grace', 'John', 'Jane', 'Michael', 'Sarah', 'David', 'Esther'][i % 10],
          last_name: ['Mwangi', 'Wanjiku', 'Omondi', 'Njeri', 'Kipchoge', 'Akinyi', 'Otieno', 'Chebet', 'Kamau', 'Wambui'][i % 10],
          gender: i % 2 === 0 ? 'M' : 'F'
        }));
        setStudents(mockStudents);
        
        const initialMarks = {};
        mockStudents.forEach(student => {
          initialMarks[student.id] = {};
          JSS_SUBJECTS.forEach(subject => {
            initialMarks[student.id][subject.id] = {
              sba: null,
              exam: null,
              weightedTotal: null,
              achievementLevel: null
            };
          });
        });
        setMarksData(initialMarks);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      addToast('error', 'Failed to load students');
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const handleMarkChange = (studentId, subjectId, data) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: data
      }
    }));
  };

  const handleValidationError = (studentId, subjectId, field, error) => {
    setValidationErrors(prev => ({
      ...prev,
      [`${studentId}-${subjectId}-${field}`]: error
    }));
    setTimeout(() => {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${studentId}-${subjectId}-${field}`];
        return newErrors;
      });
    }, 3000);
  };

  const handleSaveAll = async () => {
    setLoading(prev => ({ ...prev, saving: true }));
    setSaveProgress(0);
    
    try {
      const payload = {
        classId: selectedClass?.id,
        term: selectedTerm,
        year: selectedYear,
        marks: marksData
      };
      
      const response = await fetch(`${API_BASE_URL}/api/teacher/marks/bulk-save/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        addToast('success', 'All marks saved successfully');
      } else {
        addToast('error', data.error || 'Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      addToast('error', 'Failed to save marks');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
      setSaveProgress(100);
    }
  };

  const handleBulkUpload = (uploadedData) => {
    // Process uploaded data and update marksData
    uploadedData.forEach(row => {
      const student = students.find(s => 
        s.assessment_number === row['Assessment_Number'] || 
        s.admission_no === row['Assessment_Number']
      );
      if (student) {
        JSS_SUBJECTS.forEach(subject => {
          const sbaKey = `${subject.name}_SBA`;
          const examKey = `${subject.name}_Summative`;
          if (row[sbaKey] !== undefined && row[examKey] !== undefined) {
            const sbaScore = parseFloat(row[sbaKey]);
            const examScore = parseFloat(row[examKey]);
            if (!isNaN(sbaScore) && !isNaN(examScore) && sbaScore >= 0 && sbaScore <= 100 && examScore >= 0 && examScore <= 100) {
              const weightedTotal = calculateWeightedTotal(sbaScore, examScore, subject.sbaWeight, subject.examWeight);
              const achievementLevel = calculateAchievementLevel(weightedTotal);
              handleMarkChange(student.id, subject.id, {
                sba: sbaScore,
                exam: examScore,
                weightedTotal,
                achievementLevel,
                levelCode: achievementLevel.code,
                grade: achievementLevel.label
              });
            }
          }
        });
      }
    });
    addToast('success', `Imported ${uploadedData.length} records`);
  };

  const handleKJSEATransition = (student) => {
    setSelectedStudentForKJSEA(student);
    setShowKJSEA(true);
  };

  const getStudentCompletionRate = (studentId) => {
    const studentMarks = marksData[studentId] || {};
    let completed = 0;
    let total = 0;
    JSS_SUBJECTS.forEach(subject => {
      const marks = studentMarks[subject.id];
      if (marks?.sba !== null && marks?.exam !== null) {
        completed++;
      }
      total++;
    });
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getOverallClassAverage = () => {
    let total = 0;
    let count = 0;
    students.forEach(student => {
      let studentTotal = 0;
      let studentCount = 0;
      JSS_SUBJECTS.forEach(subject => {
        const marks = marksData[student.id]?.[subject.id];
        if (marks?.weightedTotal !== null && marks?.weightedTotal !== undefined) {
          studentTotal += marks.weightedTotal;
          studentCount++;
        }
      });
      if (studentCount > 0) {
        total += studentTotal / studentCount;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access marks entry</p>
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

      {(loading.students || loading.classes || loading.saving) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">JSS Marks Entry (KNEC Compliant)</h1>
              <p className="text-green-100 mt-1">9-Subject Rationalized Curriculum | SBA + Summative | 8-Point Achievement Level</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUpload(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={handleSaveAll}
                disabled={loading.saving}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save All Marks
              </button>
              <button onClick={fetchStudents} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Class and Term Selector */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const newClass = classes.find(c => c.id === parseInt(e.target.value));
                  setSelectedClass(newClass);
                  fetchStudents();
                }}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name} (Grade {cls.grade})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('student')}
                  className={`flex-1 px-3 py-2 text-sm border ${viewMode === 'student' ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}
                >
                  By Student
                </button>
                <button
                  onClick={() => setViewMode('subject')}
                  className={`flex-1 px-3 py-2 text-sm border ${viewMode === 'subject' ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}
                >
                  By Subject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-3 text-center">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 text-center">
            <p className="text-sm text-gray-600">Class Average</p>
            <p className="text-2xl font-bold text-green-700">{getOverallClassAverage()}%</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 text-center">
            <p className="text-sm text-gray-600">Subjects Complete</p>
            <p className="text-2xl font-bold text-blue-700">
              {Math.round(students.reduce((sum, s) => sum + getStudentCompletionRate(s.id), 0) / (students.length || 1))}%
            </p>
          </div>
          <div className="bg-white border border-gray-300 p-3 text-center">
            <p className="text-sm text-gray-600">KJSEA Ready (G9)</p>
            <p className="text-2xl font-bold text-purple-700">
              {selectedClass?.grade === 9 ? students.filter(s => getStudentCompletionRate(s.id) === 100).length : 0}/{students.length}
            </p>
          </div>
        </div>

        {/* Grade 9 KJSEA Transition Notice */}
        {selectedClass?.grade === 9 && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-300 rounded flex justify-between items-center">
            <div>
              <h4 className="font-bold text-purple-900">KJSEA Transition Ready</h4>
              <p className="text-sm text-purple-800">This class is eligible for final KJSEA placement calculation</p>
            </div>
            <button
              onClick={() => {
                if (students.length > 0) {
                  handleKJSEATransition(students[0]);
                }
              }}
              className="px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded hover:bg-purple-800"
            >
              <Calculator className="h-4 w-4 inline mr-1" />
              Calculate KJSEA Scores
            </button>
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'student' ? (
          <div className="space-y-3">
            {students.map(student => (
              <StudentMarksRow
                key={student.id}
                student={student}
                subjects={JSS_SUBJECTS}
                marksData={marksData[student.id] || {}}
                onMarkChange={handleMarkChange}
                onValidationError={handleValidationError}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-300 p-4">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Subject</label>
              <select
                value={selectedSubject.id}
                onChange={(e) => setSelectedSubject(JSS_SUBJECTS.find(s => s.id === e.target.value))}
                className="px-3 py-2 border border-gray-300 text-sm bg-white w-full md:w-64"
              >
                {JSS_SUBJECTS.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Assessment No.</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">SBA ({selectedSubject.sbaWeight}%)</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Summative ({selectedSubject.examWeight}%)</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Weighted Total</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Achievement Level</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const marks = marksData[student.id]?.[selectedSubject.id] || {};
                    return (
                      <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{student.assessment_number || student.admission_no}</td>
                        <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={marks.sba === null ? '' : marks.sba}
                            onChange={(e) => {
                              const value = e.target.value;
                              const sbaScore = value === '' ? null : parseFloat(value);
                              const examScore = marks.exam;
                              const weightedTotal = calculateWeightedTotal(sbaScore, examScore, selectedSubject.sbaWeight, selectedSubject.examWeight);
                              const achievementLevel = weightedTotal !== null ? calculateAchievementLevel(weightedTotal) : null;
                              handleMarkChange(student.id, selectedSubject.id, {
                                sba: sbaScore,
                                exam: examScore,
                                weightedTotal,
                                achievementLevel,
                                levelCode: achievementLevel?.code,
                                grade: achievementLevel?.label
                              });
                            }}
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
                            onChange={(e) => {
                              const value = e.target.value;
                              const examScore = value === '' ? null : parseFloat(value);
                              const sbaScore = marks.sba;
                              const weightedTotal = calculateWeightedTotal(sbaScore, examScore, selectedSubject.sbaWeight, selectedSubject.examWeight);
                              const achievementLevel = weightedTotal !== null ? calculateAchievementLevel(weightedTotal) : null;
                              handleMarkChange(student.id, selectedSubject.id, {
                                sba: sbaScore,
                                exam: examScore,
                                weightedTotal,
                                achievementLevel,
                                levelCode: achievementLevel?.code,
                                grade: achievementLevel?.label
                              });
                            }}
                            className="w-20 px-2 py-1 text-center border border-gray-300 rounded"
                            min="0"
                            max="100"
                            step="0.5"
                          />
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          {marks.weightedTotal !== null ? `${marks.weightedTotal}%` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {marks.achievementLevel && (
                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                              marks.achievementLevel.level >= 7 ? 'bg-green-100 text-green-800' :
                              marks.achievementLevel.level >= 5 ? 'bg-blue-100 text-blue-800' :
                              marks.achievementLevel.level >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {marks.achievementLevel.label} ({marks.achievementLevel.level})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
        subjects={JSS_SUBJECTS}
      />

      <KJSEATransitionModal
        isOpen={showKJSEA}
        onClose={() => { setShowKJSEA(false); setSelectedStudentForKJSEA(null); }}
        student={selectedStudentForKJSEA}
        marksData={selectedStudentForKJSEA ? marksData[selectedStudentForKJSEA.id] : {}}
        subjects={JSS_SUBJECTS}
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

export default JssEntryMarks;