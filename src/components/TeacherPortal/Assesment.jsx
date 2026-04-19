/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus, RefreshCw, FileText, CheckSquare, X, Loader2,
  AlertCircle, CheckCircle, Eye, Edit2, Trash2, Copy,
  Calendar, Clock, Users, BarChart3, TrendingUp,
  Download, Upload, Search, Filter, ChevronDown,
  ChevronUp, ChevronLeft, ChevronRight, Grid, List,
  Award, Target, Activity, UserCheck, ClipboardList,
  BookOpen, GraduationCap, PieChart, Save, Send,
  Printer, Share2, Settings, Sliders, Star, Trophy,
  Zap, Flame, Bell, Lock, Unlock, ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Toast Notification component
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

// Assessment Card Component
const AssessmentCard = ({ assessment, onEdit, onDelete, onGrade, onViewResults }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cat': return <Zap className="h-5 w-5 text-orange-500" />;
      case 'assignment': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'project': return <Target className="h-5 w-5 text-purple-500" />;
      case 'exam': return <Trophy className="h-5 w-5 text-yellow-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-300 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(assessment.type)}
            <h3 className="font-bold text-gray-900">{assessment.title}</h3>
          </div>
          <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(assessment.status)}`}>
            {assessment.status?.toUpperCase()}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{assessment.totalStudents || 0} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Max Score: {assessment.maxScore}</span>
          </div>
          {assessment.submittedCount !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <CheckSquare className="h-4 w-4 text-green-600" />
              <span className="text-green-600">{assessment.submittedCount} submitted</span>
              <span className="text-gray-400">|</span>
              <span className="text-orange-600">{assessment.gradedCount || 0} graded</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {assessment.status === 'draft' && (
            <>
              <button onClick={() => onEdit(assessment)} className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700">
                <Edit2 className="h-3 w-3 inline mr-1" /> Edit
              </button>
              <button onClick={() => onDelete(assessment)} className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                <Trash2 className="h-3 w-3 inline mr-1" /> Delete
              </button>
            </>
          )}
          {assessment.status === 'published' && (
            <button onClick={() => onGrade(assessment)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
              <CheckSquare className="h-3 w-3 inline mr-1" /> Start Grading
            </button>
          )}
          {(assessment.status === 'ongoing' || assessment.status === 'completed') && (
            <>
              <button onClick={() => onGrade(assessment)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                <Edit2 className="h-3 w-3 inline mr-1" /> Continue Grading
              </button>
              <button onClick={() => onViewResults(assessment)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                <BarChart3 className="h-3 w-3 inline mr-1" /> View Results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Grading Interface Modal
const GradingModal = ({ isOpen, onClose, assessment, students, onSave }) => {
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const studentsPerPage = 10;

  useEffect(() => {
    if (assessment && students) {
      const initialScores = {};
      const initialFeedback = {};
      students.forEach(student => {
        const existing = assessment.scores?.find(s => s.studentId === student.id);
        initialScores[student.id] = existing?.score || '';
        initialFeedback[student.id] = existing?.feedback || '';
      });
      setScores(initialScores);
      setFeedback(initialFeedback);
    }
  }, [assessment, students]);

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleScoreChange = (studentId, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    if (numValue === '' || (numValue >= 0 && numValue <= (assessment?.maxScore || 100))) {
      setScores(prev => ({ ...prev, [studentId]: numValue }));
    }
  };

  const handleBulkScore = (score) => {
    const newScores = {};
    filteredStudents.forEach(student => {
      newScores[student.id] = score;
    });
    setScores(prev => ({ ...prev, ...newScores }));
  };

  const handleSave = () => {
    const grades = Object.entries(scores).map(([studentId, score]) => ({
      studentId: parseInt(studentId),
      score: score === '' ? null : score,
      feedback: feedback[studentId] || ''
    }));
    onSave(grades);
  };

  const getStatistics = () => {
    const validScores = Object.values(scores).filter(s => s !== '' && s !== null);
    if (validScores.length === 0) return null;
    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = sum / validScores.length;
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    return { avg, min, max, count: validScores.length };
  };

  const stats = getStatistics();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Grading: {assessment?.title}</h3>
            <p className="text-sm text-gray-600">Max Score: {assessment?.maxScore} | Type: {assessment?.type?.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => handleBulkScore(assessment?.maxScore)} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
              All Full Marks
            </button>
            <button onClick={() => handleBulkScore(0)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
              All Zero
            </button>
            <button onClick={() => handleBulkScore('')} className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
              Clear All
            </button>
          </div>
          <div className="flex gap-4">
            {stats && (
              <div className="text-sm">
                <span className="font-medium">Avg: {stats.avg.toFixed(1)}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-medium">Min: {stats.min}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-medium">Max: {stats.max}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-medium">Graded: {stats.count}</span>
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1 border border-gray-300 text-sm w-48"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Admission No.</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Student Name</th>
                <th className="px-4 py-2 text-center font-bold text-gray-700">Score / {assessment?.maxScore}</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-600">{student.admission_no}</td>
                  <td className="px-4 py-2 font-medium">{student.first_name} {student.last_name}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      value={scores[student.id] === '' ? '' : scores[student.id]}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded"
                      min="0"
                      max={assessment?.maxScore}
                      step="0.5"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={feedback[student.id]}
                      onChange={(e) => setFeedback(prev => ({ ...prev, [student.id]: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Optional feedback..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded">
            <Save className="h-4 w-4 inline mr-1" /> Save Grades
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Assessment Modal
const CreateAssessmentModal = ({ isOpen, onClose, onSave, classes, subjects }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'cat',
    description: '',
    classId: '',
    subjectId: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59',
    maxScore: 100,
    instructions: '',
    allowLateSubmission: false,
    latePenalty: 10,
    published: false
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.classId || !formData.subjectId) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Create New Assessment</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
                placeholder="e.g., Mathematics CAT 1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              >
                <option value="cat">CAT (Continuous Assessment Test)</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="exam">Exam/Summative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              >
                <option value="">Select Subject</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Brief description of the assessment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Due Time</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Maximum Score</label>
            <input
              type="number"
              value={formData.maxScore}
              onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              min="1"
              max="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Instructions for Students</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Instructions, guidelines, or rubrics for students..."
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allowLateSubmission}
                  onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-700">Allow Late Submissions</span>
              </label>
              {formData.allowLateSubmission && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Penalty:</label>
                  <input
                    type="number"
                    value={formData.latePenalty}
                    onChange={(e) => setFormData({ ...formData, latePenalty: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border border-gray-300 text-sm text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-600">% per day</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm rounded">Cancel</button>
          <button onClick={() => setFormData({ ...formData, published: false })} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded">
            <Save className="h-4 w-4 inline mr-1" /> Save as Draft
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded">
            <Send className="h-4 w-4 inline mr-1" /> Publish
          </button>
        </div>
      </div>
    </div>
  );
};

// Results Analytics Modal
const ResultsModal = ({ isOpen, onClose, assessment, results }) => {
  const [view, setView] = useState('summary');

  if (!isOpen) return null;

  const stats = {
    avg: results?.reduce((sum, r) => sum + r.score, 0) / (results?.length || 1),
    min: Math.min(...(results?.map(r => r.score) || [0])),
    max: Math.max(...(results?.map(r => r.score) || [0])),
    median: results?.sort((a, b) => a.score - b.score)[Math.floor(results?.length / 2)]?.score || 0,
    passed: results?.filter(r => r.score >= (assessment?.maxScore * 0.5)).length || 0
  };

  const getGradeDistribution = () => {
    if (!results) return [];
    const ranges = [
      { label: 'A (80-100%)', min: 80, max: 100, color: 'bg-green-500' },
      { label: 'B (70-79%)', min: 70, max: 79, color: 'bg-blue-500' },
      { label: 'C (60-69%)', min: 60, max: 69, color: 'bg-yellow-500' },
      { label: 'D (50-59%)', min: 50, max: 59, color: 'bg-orange-500' },
      { label: 'E (0-49%)', min: 0, max: 49, color: 'bg-red-500' }
    ];
    return ranges.map(range => ({
      ...range,
      count: results.filter(r => (r.score / assessment?.maxScore * 100) >= range.min && (r.score / assessment?.maxScore * 100) <= range.max).length
    }));
  };

  const distribution = getGradeDistribution();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Assessment Results: {assessment?.title}</h3>
            <p className="text-sm text-gray-600">{assessment?.type?.toUpperCase()} | Max Score: {assessment?.maxScore}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-2 px-6">
            <button
              onClick={() => setView('summary')}
              className={`px-4 py-2 text-sm font-medium ${view === 'summary' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600'}`}
            >
              Summary
            </button>
            <button
              onClick={() => setView('distribution')}
              className={`px-4 py-2 text-sm font-medium ${view === 'distribution' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600'}`}
            >
              Distribution
            </button>
            <button
              onClick={() => setView('students')}
              className={`px-4 py-2 text-sm font-medium ${view === 'students' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600'}`}
            >
              Student List
            </button>
          </div>
        </div>

        <div className="p-6">
          {view === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-green-700">{stats.avg.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Average Score</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-blue-700">{stats.min}</p>
                  <p className="text-xs text-gray-600">Lowest Score</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-orange-700">{stats.max}</p>
                  <p className="text-xs text-gray-600">Highest Score</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-purple-700">{stats.median}</p>
                  <p className="text-xs text-gray-600">Median Score</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-green-700">{stats.passed}</p>
                  <p className="text-xs text-gray-600">Passed (≥50%)</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Performance Insights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Class average is {stats.avg > (assessment?.maxScore * 0.7) ? 'above' : 'below'} the expected threshold</li>
                  <li>• {stats.passed} out of {results?.length} students ({Math.round(stats.passed / results?.length * 100)}%) passed the assessment</li>
                  <li>• Score range: {stats.min} to {stats.max} (difference of {stats.max - stats.min} points)</li>
                  <li>• {stats.max === assessment?.maxScore ? '🎉 Some students achieved perfect scores!' : '📈 Room for improvement on top scores'}</li>
                </ul>
              </div>
            </div>
          )}

          {view === 'distribution' && (
            <div className="space-y-4">
              {distribution.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count} students ({Math.round(item.count / results?.length * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-6 rounded overflow-hidden">
                    <div
                      className={`${item.color} h-full flex items-center justify-end px-2 text-xs text-white font-medium`}
                      style={{ width: `${(item.count / results?.length) * 100}%` }}
                    >
                      {item.count > 0 && item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'students' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">Admission No.</th>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">Student Name</th>
                    <th className="px-4 py-2 text-center font-bold text-gray-700">Score</th>
                    <th className="px-4 py-2 text-center font-bold text-gray-700">Percentage</th>
                    <th className="px-4 py-2 text-center font-bold text-gray-700">Grade</th>
                    <th className="px-4 py-2 text-left font-bold text-gray-700">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.map(result => {
                    const percentage = (result.score / assessment?.maxScore) * 100;
                    const grade = percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'E';
                    return (
                      <tr key={result.studentId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-600">{result.admission_no}</td>
                        <td className="px-4 py-2 font-medium">{result.student_name}</td>
                        <td className="px-4 py-2 text-center font-medium">{result.score}/{assessment?.maxScore}</td>
                        <td className="px-4 py-2 text-center">{percentage.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            grade === 'A' ? 'bg-green-100 text-green-800' :
                            grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            grade === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-sm">{result.feedback || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function AssessmentManager() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [assessments, setAssessments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState({ assessments: true, classes: true, subjects: true });
  const [toasts, setToasts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access assessment manager');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading({ assessments: true, classes: true, subjects: true });
    try {
      await Promise.all([
        fetchAssessments(),
        fetchClasses(),
        fetchSubjects()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load data');
    } finally {
      setLoading({ assessments: false, classes: false, subjects: false });
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.data);
      } else {
        // Mock data
        const mockAssessments = [
          { id: 1, title: 'Mathematics CAT 1', type: 'cat', description: 'Algebra and Geometry', classId: 1, className: 'Grade 7A', subjectId: 1, subjectName: 'Mathematics', dueDate: '2024-03-25', maxScore: 50, status: 'published', totalStudents: 42, submittedCount: 0, gradedCount: 0 },
          { id: 2, title: 'Science Project', type: 'project', description: 'Environmental Conservation Project', classId: 1, className: 'Grade 7A', subjectId: 3, subjectName: 'Integrated Science', dueDate: '2024-04-05', maxScore: 100, status: 'draft', totalStudents: 42 },
          { id: 3, title: 'English Assignment', type: 'assignment', description: 'Essay Writing', classId: 2, className: 'Grade 7B', subjectId: 2, subjectName: 'English', dueDate: '2024-03-20', maxScore: 30, status: 'ongoing', totalStudents: 40, submittedCount: 28, gradedCount: 15 },
          { id: 4, title: 'End of Term Exam', type: 'exam', description: 'Comprehensive Examination', classId: 1, className: 'Grade 7A', subjectId: 1, subjectName: 'Mathematics', dueDate: '2024-04-15', maxScore: 100, status: 'draft', totalStudents: 42 }
        ];
        setAssessments(mockAssessments);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
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
      } else {
        const mockClasses = [
          { id: 1, class_name: 'Grade 7A', stream: 'A', students: 42 },
          { id: 2, class_name: 'Grade 7B', stream: 'B', students: 40 }
        ];
        setClasses(mockClasses);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-subjects/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      } else {
        const mockSubjects = [
          { id: 1, name: 'Mathematics', code: 'MAT' },
          { id: 2, name: 'English', code: 'ENG' },
          { id: 3, name: 'Integrated Science', code: 'SCI' }
        ];
        setSubjects(mockSubjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/${classId}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        const mockStudents = Array.from({ length: 42 }, (_, i) => ({
          id: i + 1,
          admission_no: `JSS7${String(i + 1).padStart(3, '0')}`,
          first_name: ['James', 'Mary', 'Peter', 'Grace', 'John'][i % 5],
          last_name: ['Mwangi', 'Wanjiku', 'Omondi', 'Njeri', 'Kipchoge'][i % 5]
        }));
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateAssessment = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment created successfully');
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      addToast('error', 'Failed to create assessment');
    }
  };

  const handleDeleteAssessment = async (assessment) => {
    if (!confirm(`Delete "${assessment.title}"? This action cannot be undone.`)) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/${assessment.id}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assessment deleted');
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      addToast('error', 'Failed to delete assessment');
    }
  };

  const handleStartGrading = async (assessment) => {
    setSelectedAssessment(assessment);
    await fetchStudentsForClass(assessment.classId);
    setShowGradingModal(true);
  };

  const handleSaveGrades = async (grades) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/${selectedAssessment.id}/grade/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ grades })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', `Grades saved for ${grades.length} student(s)`);
        setShowGradingModal(false);
        await fetchAssessments();
      } else {
        addToast('error', data.error || 'Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      addToast('error', 'Failed to save grades');
    }
  };

  const handleViewResults = async (assessment) => {
    setSelectedAssessment(assessment);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/${assessment.id}/results/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // Set results and show modal
        setShowResultsModal(true);
      } else {
        addToast('error', 'Failed to load results');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      addToast('error', 'Failed to load results');
    }
  };

  const filteredAssessments = useMemo(() => {
    let filtered = assessments;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(a => a.status === activeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.className?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });
    
    return filtered;
  }, [assessments, activeFilter, searchTerm, sortBy]);

  const getStatusCounts = () => {
    return {
      all: assessments.length,
      draft: assessments.filter(a => a.status === 'draft').length,
      published: assessments.filter(a => a.status === 'published').length,
      ongoing: assessments.filter(a => a.status === 'ongoing').length,
      completed: assessments.filter(a => a.status === 'completed').length
    };
  };

  const counts = getStatusCounts();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access assessment manager</p>
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

      {(loading.assessments || loading.classes || loading.subjects) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Assessment Manager</h1>
              <p className="text-green-100 mt-1">Create, manage, and grade assessments for your classes</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Create Assessment
              </button>
              <button onClick={fetchAssessments} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setActiveFilter('draft')}
                className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === 'draft' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Draft ({counts.draft})
              </button>
              <button
                onClick={() => setActiveFilter('published')}
                className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === 'published' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Published ({counts.published})
              </button>
              <button
                onClick={() => setActiveFilter('ongoing')}
                className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === 'ongoing' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Ongoing ({counts.ongoing})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === 'completed' ? 'bg-purple-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Completed ({counts.completed})
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 text-sm w-64"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessments Grid */}
        {filteredAssessments.length === 0 ? (
          <div className="bg-white border border-gray-300 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No assessments found</h3>
            <p className="text-gray-500 mt-1 mb-4">Create your first assessment to get started</p>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded">
              <Plus className="h-4 w-4 inline mr-2" />
              Create Assessment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map(assessment => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onEdit={() => {}}
                onDelete={handleDeleteAssessment}
                onGrade={handleStartGrading}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {filteredAssessments.length > 0 && (
          <div className="mt-6 p-3 bg-gray-100 border border-gray-300 text-sm text-gray-600 flex justify-between items-center">
            <span>Showing {filteredAssessments.length} assessments</span>
            <div className="flex gap-4">
              <span><span className="font-bold">{assessments.filter(a => a.status === 'published').length}</span> Ready to grade</span>
              <span><span className="font-bold">{assessments.filter(a => a.status === 'ongoing').length}</span> In progress</span>
              <span><span className="font-bold">{assessments.filter(a => a.status === 'completed').length}</span> Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateAssessmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAssessment}
        classes={classes}
        subjects={subjects}
      />

      <GradingModal
        isOpen={showGradingModal}
        onClose={() => { setShowGradingModal(false); setSelectedAssessment(null); }}
        assessment={selectedAssessment}
        students={students}
        onSave={handleSaveGrades}
      />

      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => { setShowResultsModal(false); setSelectedAssessment(null); }}
        assessment={selectedAssessment}
        results={[]}
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

export default AssessmentManager;