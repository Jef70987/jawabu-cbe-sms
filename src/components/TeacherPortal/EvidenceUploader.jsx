/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FolderOpen, Plus, RefreshCw, Upload, Download, FileText,
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Grid, List, Eye, Edit2, Trash2, Link2, Camera, Video, Music,
  FileImage, File, X, CheckCircle, AlertCircle, Loader2,
  User, Users, Calendar, Clock, MapPin, Tag, Target,
  Award, Star, Trophy, Zap, Flame, Shield, Heart,
  MessageCircle, MessageSquare, ThumbsUp, Share2,
  Printer, Mail, Phone, Globe, Lock, Unlock,
  TrendingUp, BarChart3, PieChart, Activity,
  Folder, Image, Video as VideoIcon, Mic, MicOff,
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Core Competencies for tagging
const CORE_COMPETENCIES = [
  { id: 'comm_collab', name: 'Communication and Collaboration', code: 'CC', color: 'bg-blue-500' },
  { id: 'self_efficacy', name: 'Self-efficacy', code: 'SE', color: 'bg-green-500' },
  { id: 'critical_thinking', name: 'Critical Thinking', code: 'CT', color: 'bg-purple-500' },
  { id: 'creativity', name: 'Creativity and Imagination', code: 'CI', color: 'bg-pink-500' },
  { id: 'citizenship', name: 'Citizenship', code: 'CZ', color: 'bg-yellow-500' },
  { id: 'digital_literacy', name: 'Digital Literacy', code: 'DL', color: 'bg-indigo-500' },
  { id: 'learning_to_learn', name: 'Learning to Learn', code: 'LL', color: 'bg-orange-500' }
];

// JSS Subjects
const JSS_SUBJECTS = [
  { id: 'eng', name: 'English', code: 'ENG' },
  { id: 'kis', name: 'Kiswahili / KSL', code: 'KIS' },
  { id: 'mat', name: 'Mathematics', code: 'MAT' },
  { id: 'sci', name: 'Integrated Science', code: 'SCI' },
  { id: 'sst', name: 'Social Studies', code: 'SST' },
  { id: 'agri', name: 'Agriculture & Nutrition', code: 'AGN' },
  { id: 'pts', name: 'Pre-Technical Studies', code: 'PTS' },
  { id: 'cas', name: 'Creative Arts & Sports', code: 'CAS' },
  { id: 're', name: 'Religious Education', code: 'RE' }
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
      <p className="text-gray-700 font-medium">Loading portfolio...</p>
    </div>
  </div>
);

// Evidence Card Component
const EvidenceCard = ({ evidence, onView, onEdit, onDelete, onTag, onFeature, isFeatured }) => {
  const getFileIcon = () => {
    if (evidence.fileType?.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    if (evidence.fileType?.startsWith('video/')) return <VideoIcon className="h-8 w-8 text-purple-500" />;
    if (evidence.fileType?.startsWith('audio/')) return <Mic className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const getTypeBadge = () => {
    if (evidence.fileType?.startsWith('image/')) return 'bg-blue-100 text-blue-800';
    if (evidence.fileType?.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    if (evidence.fileType?.startsWith('audio/')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${isFeatured ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-300'}`}>
      {/* Thumbnail Area */}
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        {evidence.thumbnail ? (
          <img src={evidence.thumbnail} alt={evidence.title} className="w-full h-full object-cover" />
        ) : (
          getFileIcon()
        )}
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3" /> Featured
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeBadge()}`}>
            {evidence.fileType?.split('/')[0] || 'Document'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{evidence.title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          {new Date(evidence.date).toLocaleDateString()} • {evidence.subject}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{evidence.description}</p>

        {/* Competency Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {evidence.competencies?.map(comp => {
            const compInfo = CORE_COMPETENCIES.find(c => c.id === comp);
            return compInfo ? (
              <span key={comp} className={`${compInfo.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                {compInfo.code}
              </span>
            ) : null;
          })}
        </div>

        {/* Reflection Preview */}
        {evidence.studentReflection && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            <span className="font-bold">Student:</span> {evidence.studentReflection.substring(0, 60)}...
          </div>
        )}
        {evidence.teacherFeedback && (
          <div className="mb-3 p-2 bg-green-50 rounded text-xs text-green-800">
            <span className="font-bold">Teacher:</span> {evidence.teacherFeedback.substring(0, 60)}...
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button onClick={() => onView(evidence)} className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            <Eye className="h-3 w-3 inline mr-1" /> View
          </button>
          <button onClick={() => onTag(evidence)} className="flex-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
            <Tag className="h-3 w-3 inline mr-1" /> Tag
          </button>
          {!isFeatured && (
            <button onClick={() => onFeature(evidence)} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600">
              <Star className="h-3 w-3" />
            </button>
          )}
          <button onClick={() => onEdit(evidence)} className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
            <Edit2 className="h-3 w-3" />
          </button>
          <button onClick={() => onDelete(evidence)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload Evidence Modal
const UploadEvidenceModal = ({ isOpen, onClose, onSave, students, subjects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentId: '',
    subject: '',
    competencies: [],
    date: new Date().toISOString().split('T')[0],
    file: null,
    studentReflection: '',
    teacherFeedback: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      studentId: '',
      subject: '',
      competencies: [],
      date: new Date().toISOString().split('T')[0],
      file: null,
      studentReflection: '',
      teacherFeedback: ''
    });
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);
    }
  };

  const handleCompetencyToggle = (compId) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.includes(compId)
        ? prev.competencies.filter(c => c !== compId)
        : [...prev.competencies, compId]
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.studentId || !formData.subject) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
    onClose();
  };
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Upload Evidence</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
                placeholder="e.g., Science Project Presentation"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Student *</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ({student.assessment_number || student.admission_no})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Learning Area *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
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
              placeholder="Describe the evidence and context..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Competency Tags</label>
            <div className="flex flex-wrap gap-2">
              {CORE_COMPETENCIES.map(comp => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleCompetencyToggle(comp.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    formData.competencies.includes(comp.id)
                      ? `${comp.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              className="w-full text-sm"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="bg-gray-200 h-1 rounded">
                  <div className="bg-green-600 h-1 rounded" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Student Reflection (Learner's Voice)</label>
            <textarea
              value={formData.studentReflection}
              onChange={(e) => setFormData({ ...formData, studentReflection: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="What did the student learn? What challenges did they overcome?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teacher's Narrative</label>
            <textarea
              value={formData.teacherFeedback}
              onChange={(e) => setFormData({ ...formData, teacherFeedback: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Teacher's observations and context..."
            />
          </div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-700 text-white text-sm font-medium">
            <Upload className="h-4 w-4 inline mr-1" /> Upload Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

// Bulk Upload Modal
const BulkUploadModal = ({ isOpen, onClose, onUpload, students }) => {
  const [files, setFiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (files.length === 0 || !selectedStudent) {
      alert('Please select files and a student');
      return;
    }
    setUploading(true);
    onUpload(files, selectedStudent, selectedSubject);
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Bulk Upload Evidence</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject (Optional)</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            >
              <option value="">All Subjects</option>
              {JSS_SUBJECTS.map(subject => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Files</label>
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              className="w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
          <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-green-700 text-white text-sm font-medium disabled:opacity-50">
            {uploading ? <ButtonSpinner /> : <Upload className="h-4 w-4 inline mr-1" />}
            Upload {files.length} File(s)
          </button>
        </div>
      </div>
    </div>
  );
};

// Evidence Detail Modal
const EvidenceDetailModal = ({ isOpen, onClose, evidence, onAddComment }) => {
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState('teacher');

  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">{evidence.title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6">
          {/* Media Preview */}
          <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {evidence.fileType?.startsWith('image/') && evidence.url && (
              <img src={evidence.url} alt={evidence.title} className="max-w-full max-h-[400px] object-contain" />
            )}
            {evidence.fileType?.startsWith('video/') && evidence.url && (
              <video src={evidence.url} controls className="max-w-full max-h-[400px]" />
            )}
            {evidence.fileType?.startsWith('audio/') && evidence.url && (
              <audio src={evidence.url} controls className="w-full" />
            )}
            {!evidence.url && (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Preview not available</p>
                <a href="#" className="text-blue-600 text-sm mt-2 inline-block">Download File</a>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">Student</p>
              <p className="font-medium">{evidence.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="font-medium">{evidence.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">{new Date(evidence.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Competencies</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {evidence.competencies?.map(comp => {
                  const compInfo = CORE_COMPETENCIES.find(c => c.id === comp);
                  return compInfo ? (
                    <span key={comp} className={`${compInfo.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {compInfo.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700">{evidence.description}</p>
          </div>

          {/* Reflection Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {evidence.studentReflection && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs font-bold text-blue-800 mb-1">Learner's Voice</p>
                <p className="text-sm text-blue-900">{evidence.studentReflection}</p>
              </div>
            )}
            {evidence.teacherFeedback && (
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs font-bold text-green-800 mb-1">Teacher's Narrative</p>
                <p className="text-sm text-green-900">{evidence.teacherFeedback}</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-bold text-gray-900 mb-3">Comments & Feedback</h4>
            <div className="space-y-3 mb-4">
              {evidence.comments?.map((comment, idx) => (
                <div key={idx} className={`p-3 rounded ${comment.type === 'teacher' ? 'bg-green-50' : comment.type === 'parent' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold">
                      {comment.type === 'teacher' ? '👩‍🏫 Teacher' : comment.type === 'parent' ? '👪 Parent' : '👨‍🎓 Student'}
                    </span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={commentType}
                onChange={(e) => setCommentType(e.target.value)}
                className="px-3 py-2 border border-gray-300 text-sm rounded"
              >
                <option value="teacher">As Teacher</option>
                <option value="parent">As Parent</option>
                <option value="student">As Student</option>
              </select>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded"
              />
              <button
                onClick={() => {
                  if (comment.trim()) {
                    onAddComment(evidence.id, comment, commentType);
                    setComment('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// KNEC Export Modal
const KNECExportModal = ({ isOpen, onClose, onExport, featuredItems }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    onExport();
    setTimeout(() => {
      setExporting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">KNEC CBA Export</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm font-bold text-blue-800">Ready for KNEC Submission</p>
            <p className="text-xs text-blue-700 mt-1">
              You have {featuredItems.length} featured artifacts ready for KNEC CBA Portal submission.
              {featuredItems.length < 45 && ` Need ${45 - featuredItems.length} more (5 per subject).`}
            </p>
          </div>
          <div className="space-y-2">
            {JSS_SUBJECTS.map(subject => {
              const count = featuredItems.filter(i => i.subject === subject.name).length;
              return (
                <div key={subject.id} className="flex justify-between items-center">
                  <span className="text-sm">{subject.name}</span>
                  <span className={`text-sm font-medium ${count >= 5 ? 'text-green-600' : 'text-orange-600'}`}>
                    {count}/5 artifacts
                  </span>
                </div>
              );
            })}
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> This will bundle all featured artifacts and prepare them for upload to the KNEC CBA Portal.
              The bundle includes metadata, competency tags, and teacher narratives.
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
          <button onClick={handleExport} disabled={exporting} className="px-4 py-2 bg-green-700 text-white text-sm font-medium disabled:opacity-50">
            {exporting ? <ButtonSpinner /> : <Download className="h-4 w-4 inline mr-1" />}
            Export to KNEC
          </button>
        </div>
      </div>
    </div>
  );
};

function DigitalPortfolio() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState({ classes: true, students: true, evidence: true });
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState('gallery'); // gallery, timeline, audit
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterCompetency, setFilterCompetency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showKNECExportModal, setShowKNECExportModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access digital portfolio');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading({ classes: true, students: true, evidence: true });
    try {
      await Promise.all([
        fetchClasses(),
        fetchEvidence()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load portfolio data');
    } finally {
      setLoading({ classes: false, students: false, evidence: false });
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
          await fetchClassStudents(data.data[0].id);
        }
      } else {
        const mockClasses = [
          { id: 1, class_name: 'Grade 7A', stream: 'A', students: 42 },
          { id: 2, class_name: 'Grade 7B', stream: 'B', students: 40 },
          { id: 3, class_name: 'Grade 8A', stream: 'A', students: 44 }
        ];
        setClasses(mockClasses);
        setSelectedClass(mockClasses[0]);
        await fetchClassStudents(mockClasses[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchClassStudents = async (classId) => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/${classId}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        if (data.data.length > 0 && !selectedStudent) {
          setSelectedStudent(data.data[0]);
        }
      } else {
        const mockStudents = Array.from({ length: 42 }, (_, i) => ({
          id: i + 1,
          admission_no: `JSS7${String(i + 1).padStart(3, '0')}`,
          assessment_number: `KNEC${String(i + 1).padStart(8, '0')}`,
          first_name: ['James', 'Mary', 'Peter', 'Grace', 'John', 'Jane', 'Michael', 'Sarah', 'David', 'Esther'][i % 10],
          last_name: ['Mwangi', 'Wanjiku', 'Omondi', 'Njeri', 'Kipchoge', 'Akinyi', 'Otieno', 'Chebet', 'Kamau', 'Wambui'][i % 10]
        }));
        setStudents(mockStudents);
        setSelectedStudent(mockStudents[0]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchEvidence = async () => {
    setLoading(prev => ({ ...prev, evidence: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/evidence/?student=${selectedStudent?.id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setEvidence(data.data);
        setFeaturedItems(data.data.filter(e => e.featured));
      } else {
        // Mock evidence data
        const mockEvidence = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          title: ['Science Project Presentation', 'Math Problem Solving', 'English Essay', 'Art Portfolio', 'Music Performance', 'Sports Day'][i % 6],
          description: 'Student demonstrated excellent understanding of the topic through practical application.',
          studentId: selectedStudent?.id || 1,
          studentName: `${selectedStudent?.first_name || 'John'} ${selectedStudent?.last_name || 'Mwangi'}`,
          subject: JSS_SUBJECTS[i % 9].name,
          competencies: [CORE_COMPETENCIES[i % 7].id],
          date: new Date(Date.now() - i * 86400000).toISOString(),
          fileType: i % 3 === 0 ? 'image/jpeg' : i % 3 === 1 ? 'video/mp4' : 'application/pdf',
          url: null,
          studentReflection: i % 2 === 0 ? 'I learned how to apply critical thinking to solve complex problems.' : '',
          teacherFeedback: 'Excellent work! Keep up the great effort.',
          comments: [],
          featured: i < 5
        }));
        setEvidence(mockEvidence);
        setFeaturedItems(mockEvidence.filter(e => e.featured));
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(prev => ({ ...prev, evidence: false }));
    }
  };

  const handleUploadEvidence = async (formData) => {
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('student_id', formData.studentId);
      payload.append('subject', formData.subject);
      payload.append('competencies', JSON.stringify(formData.competencies));
      payload.append('date', formData.date);
      payload.append('student_reflection', formData.studentReflection);
      payload.append('teacher_feedback', formData.teacherFeedback);
      if (formData.file) payload.append('file', formData.file);

      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/evidence/upload/`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeaders()['Authorization'] },
        body: payload
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Evidence uploaded successfully');
        await fetchEvidence();
      } else {
        addToast('error', data.error || 'Failed to upload evidence');
      }
    } catch (error) {
      console.error('Error uploading evidence:', error);
      addToast('error', 'Failed to upload evidence');
    }
  };

  const handleBulkUpload = async (files, studentId, subject) => {
    addToast('success', `Uploading ${files.length} files for student`);
    // Implementation for bulk upload
    await fetchEvidence();
  };

  const handleDeleteEvidence = async (evidence) => {
    if (!confirm(`Delete "${evidence.title}"? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/evidence/${evidence.id}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Evidence deleted');
        await fetchEvidence();
      } else {
        addToast('error', data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting evidence:', error);
      addToast('error', 'Failed to delete evidence');
    }
  };

  const handleToggleFeatured = async (evidence) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/evidence/${evidence.id}/feature/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', evidence.featured ? 'Removed from featured' : 'Added to featured');
        await fetchEvidence();
      } else {
        addToast('error', data.error || 'Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleAddComment = async (evidenceId, comment, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/evidence/${evidenceId}/comment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment, type })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Comment added');
        await fetchEvidence();
      } else {
        addToast('error', data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleKNECExport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/portfolio/knec-export/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'KNEC export prepared. Download will start shortly.');
        // Trigger download
        window.open(data.downloadUrl, '_blank');
      } else {
        addToast('error', data.error || 'Failed to prepare KNEC export');
      }
    } catch (error) {
      console.error('Error exporting to KNEC:', error);
      addToast('error', 'Failed to export to KNEC');
    }
  };

  const filteredEvidence = useMemo(() => {
    let filtered = evidence;
    if (filterSubject !== 'all') {
      filtered = filtered.filter(e => e.subject === filterSubject);
    }
    if (filterCompetency !== 'all') {
      filtered = filtered.filter(e => e.competencies?.includes(filterCompetency));
    }
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [evidence, filterSubject, filterCompetency, searchTerm]);

  // Portfolio Audit Stats
  const auditStats = {
    totalStudents: students.length,
    studentsWithEvidence: new Set(evidence.map(e => e.studentId)).size,
    totalEvidence: evidence.length,
    featuredCount: featuredItems.length,
    missingEvidence: students.length - new Set(evidence.map(e => e.studentId)).size,
    evidenceBySubject: JSS_SUBJECTS.map(subject => ({
      name: subject.name,
      count: evidence.filter(e => e.subject === subject.name).length
    }))
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access digital portfolio</p>
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

      {(loading.classes || loading.students || loading.evidence) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Digital Portfolio</h1>
              <p className="text-green-100 mt-1">Evidence Collection | Competency Tagging | Reflection Loop | KNEC Ready</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Add Evidence
              </button>
              <button
                onClick={() => setShowKNECExportModal(true)}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 inline mr-2" />
                KNEC Export
              </button>
              <button onClick={fetchEvidence} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Student & Class Selector */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const newClass = classes.find(c => c.id === parseInt(e.target.value));
                  setSelectedClass(newClass);
                  fetchClassStudents(newClass.id);
                }}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Student</label>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const newStudent = students.find(s => s.id === parseInt(e.target.value));
                  setSelectedStudent(newStudent);
                }}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Filter by Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="all">All Subjects</option>
                {JSS_SUBJECTS.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Filter by Competency</label>
              <select
                value={filterCompetency}
                onChange={(e) => setFilterCompetency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="all">All Competencies</option>
                {CORE_COMPETENCIES.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 text-sm border ${viewMode === 'gallery' ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}
            >
              <Grid className="h-4 w-4 inline mr-1" /> Gallery
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-sm border ${viewMode === 'timeline' ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}
            >
              <Calendar className="h-4 w-4 inline mr-1" /> Timeline
            </button>
            <button
              onClick={() => setViewMode('audit')}
              className={`px-3 py-1 text-sm border ${viewMode === 'audit' ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}
            >
              <BarChart3 className="h-4 w-4 inline mr-1" /> Portfolio Audit
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 text-sm w-64"
            />
          </div>
        </div>

        {/* Gallery View */}
        {viewMode === 'gallery' && (
          <>
            {filteredEvidence.length === 0 ? (
              <div className="bg-white border border-gray-300 p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No evidence found</h3>
                <p className="text-gray-500 mt-1 mb-4">Upload evidence to start building the digital portfolio</p>
                <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded">
                  <Upload className="h-4 w-4 inline mr-2" /> Upload Evidence
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvidence.map(item => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    onView={(ev) => { setSelectedEvidence(ev); setShowDetailModal(true); }}
                    onEdit={() => {}}
                    onDelete={handleDeleteEvidence}
                    onTag={() => {}}
                    onFeature={handleToggleFeatured}
                    isFeatured={item.featured}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-6">
              {filteredEvidence.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => (
                <div key={item.id} className="relative pl-16">
                  <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold z-10">
                    {idx + 1}
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()} • {item.subject}
                        </p>
                      </div>
                      {item.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.competencies?.map(comp => {
                        const compInfo = CORE_COMPETENCIES.find(c => c.id === comp);
                        return compInfo ? (
                          <span key={comp} className={`${compInfo.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                            {compInfo.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { setSelectedEvidence(item); setShowDetailModal(true); }} className="text-blue-600 text-sm hover:text-blue-800">
                        <Eye className="h-4 w-4 inline mr-1" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Audit View */}
        {viewMode === 'audit' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{auditStats.totalStudents}</p>
              </div>
              <div className="bg-white border border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-600">With Evidence</p>
                <p className="text-2xl font-bold text-green-700">{auditStats.studentsWithEvidence}</p>
              </div>
              <div className="bg-white border border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-600">Missing Evidence</p>
                <p className="text-2xl font-bold text-red-700">{auditStats.missingEvidence}</p>
              </div>
              <div className="bg-white border border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-600">Total Artifacts</p>
                <p className="text-2xl font-bold text-blue-700">{auditStats.totalEvidence}</p>
              </div>
              <div className="bg-white border border-gray-300 p-4 text-center">
                <p className="text-sm text-gray-600">Featured for KNEC</p>
                <p className="text-2xl font-bold text-purple-700">{auditStats.featuredCount}/45</p>
              </div>
            </div>

            {/* Evidence by Subject */}
            <div className="bg-white border border-gray-300">
              <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                <h3 className="font-bold text-gray-900">Evidence Distribution by Subject</h3>
              </div>
              <div className="p-4">
                {auditStats.evidenceBySubject.map(subject => (
                  <div key={subject.name} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{subject.name}</span>
                      <span className="font-medium">{subject.count} artifacts</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${(subject.count / Math.max(...auditStats.evidenceBySubject.map(s => s.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Missing Evidence */}
            {auditStats.missingEvidence > 0 && (
              <div className="bg-white border border-gray-300">
                <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
                  <h3 className="font-bold text-gray-900">Students Missing Evidence</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {students.filter(s => !evidence.some(e => e.studentId === s.id)).map(student => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span>{student.first_name} {student.last_name}</span>
                        <button onClick={() => { setSelectedStudent(student); setShowUploadModal(true); }} className="text-red-600 text-sm hover:text-red-800">
                          Add Evidence
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadEvidenceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleUploadEvidence}
        students={students}
        subjects={JSS_SUBJECTS}
      />

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        onUpload={handleBulkUpload}
        students={students}
      />

      <EvidenceDetailModal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedEvidence(null); }}
        evidence={selectedEvidence}
        onAddComment={handleAddComment}
      />

      <KNECExportModal
        isOpen={showKNECExportModal}
        onClose={() => setShowKNECExportModal(false)}
        onExport={handleKNECExport}
        featuredItems={featuredItems}
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

export default DigitalPortfolio;