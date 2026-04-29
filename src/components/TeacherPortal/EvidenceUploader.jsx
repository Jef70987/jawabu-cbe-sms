/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus, RefreshCw, Upload, Download, FileText, X, Loader2,
  AlertCircle, CheckCircle, Eye, Edit2, Trash2, Link2,
  Camera, Video, FileImage, Calendar, Search, Filter,
  Grid, List, BarChart3, Star, FolderOpen, Users,
  Tag, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
      <p className="text-gray-700 font-medium">Loading portfolio...</p>
    </div>
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

const EvidenceCard = ({ evidence, onView, onDelete, onFeature, isFeatured, coreCompetencies }) => {
  const competency = coreCompetencies.find(c => c.id === evidence.competency_id);
  return (
    <div className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${isFeatured ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}>
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        {evidence.file_url && evidence.evidence_type?.startsWith('image/') ? (
          <img src={evidence.file_url} alt={evidence.title} className="w-full h-full object-cover" />
        ) : (
          <FileText className="h-12 w-12 text-gray-400" />
        )}
        {isFeatured && <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"><Star className="h-3 w-3 inline mr-1" /> Featured</div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 truncate">{evidence.title}</h3>
        <p className="text-xs text-gray-500 mb-2">{evidence.date ? new Date(evidence.date).toLocaleDateString() : 'No date'} • {evidence.subject || 'General'}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{evidence.description}</p>
        {competency && <div className="mb-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{competency.code}: {competency.name}</span></div>}
        <div className="flex gap-2">
          <button onClick={() => onView(evidence)} className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"><Eye className="h-3 w-3 inline mr-1" /> View</button>
          {!isFeatured && <button onClick={() => onFeature(evidence)} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"><Star className="h-3 w-3" /></button>}
          <button onClick={() => onDelete(evidence)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"><Trash2 className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
};

const UploadEvidenceModal = ({ isOpen, onClose, onSave, students, subjects, competencies, addToast }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', student_id: '', subject: '', competencies: [],
    date: new Date().toISOString().split('T')[0], file: null, student_reflection: '', teacher_feedback: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '', description: '', student_id: '', subject: '', competencies: [],
        date: new Date().toISOString().split('T')[0], file: null, student_reflection: '', teacher_feedback: ''
      });
      setUploadProgress(0);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else setPreviewUrl(null);
      let progress = 0;
      const interval = setInterval(() => { progress += 10; setUploadProgress(progress); if (progress >= 100) clearInterval(interval); }, 200);
    }
  };

  const handleCompetencyToggle = (compId) => {
    setFormData(prev => ({ ...prev, competencies: prev.competencies.includes(compId) ? prev.competencies.filter(c => c !== compId) : [...prev.competencies, compId] }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.student_id) {
      if (addToast) addToast('warning', 'Please fill in title and select a student');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">Upload Evidence</h3><button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button></div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Student *</label><select value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select Student</option>{students.map(s => (<option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Learning Area</label><select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select Subject</option>{subjects.map(s => (<option key={s.id} value={s.name}>{s.name}</option>))}</select></div>
          </div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-2">Core Competencies</label><div className="flex flex-wrap gap-2">{competencies.map(comp => (<button key={comp.id} type="button" onClick={() => handleCompetencyToggle(comp.id)} className={`px-3 py-1 text-xs rounded-full ${formData.competencies.includes(comp.id) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{comp.name}</button>))}</div></div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"><input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*,video/*,application/pdf" className="hidden" id="file-upload" /><label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">{previewUrl ? <img src={previewUrl} alt="Preview" className="h-32 w-auto object-contain mb-3" /> : formData.file ? <FileText className="h-12 w-12 text-green-600 mb-2" /> : <Upload className="h-12 w-12 text-gray-400 mb-2" />}<p className="text-sm text-gray-600">{formData.file ? formData.file.name : 'Click to upload'}</p></label>{uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2"><div className="bg-gray-200 h-1 rounded"><div className="bg-green-600 h-1 rounded" style={{ width: `${uploadProgress}%` }}></div></div></div>}</div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 mb-1">Student Reflection</label><textarea value={formData.student_reflection} onChange={(e) => setFormData({...formData, student_reflection: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Teacher's Narrative</label><textarea value={formData.teacher_feedback} onChange={(e) => setFormData({...formData, teacher_feedback: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div></div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg"><button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button><button onClick={handleSubmit} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg"><Upload className="h-4 w-4 inline mr-1" /> Upload</button></div>
      </div>
    </div>
  );
};

const EvidenceDetailModal = ({ isOpen, onClose, evidence, onAddComment, coreCompetencies }) => {
  const [comment, setComment] = useState('');
  const competency = coreCompetencies.find(c => c.id === evidence?.competency_id);
  if (!isOpen || !evidence) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">{evidence.title}</h3><button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button></div>
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[200px] mb-4">{evidence.file_url && evidence.evidence_type?.startsWith('image/') ? <img src={evidence.file_url} alt={evidence.title} className="max-w-full max-h-[300px] object-contain" /> : <FileText className="h-16 w-16 text-gray-400" />}</div>
          <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-xs text-gray-500">Student</p><p className="font-medium">{evidence.student_name}</p></div><div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{new Date(evidence.date).toLocaleDateString()}</p></div><div><p className="text-xs text-gray-500">Subject</p><p className="font-medium">{evidence.subject || 'General'}</p></div><div><p className="text-xs text-gray-500">Competency</p><p className="font-medium">{competency ? competency.name : 'Not tagged'}</p></div></div>
          <div className="mb-4"><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-sm text-gray-700">{evidence.description}</p></div>
          <div className="border-t border-gray-200 pt-4"><h4 className="font-bold text-gray-900 mb-3">Add Comment</h4><div className="flex gap-2"><input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" /><button onClick={() => { if (comment.trim()) { onAddComment(evidence.id, comment); setComment(''); } }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"><MessageCircle className="h-4 w-4" /></button></div></div>
        </div>
      </div>
    </div>
  );
};

function DigitalPortfolio() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState({ classes: true, students: true, evidence: true });
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState('gallery');
  const [filterSubject, setFilterSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceToDelete, setEvidenceToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const addToast = (type, message) => { 
    const id = Date.now(); 
    setToasts(prev => [...prev, { id, type, message }]); 
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000); 
  };

  useEffect(() => { if (isAuthenticated) fetchInitialData(); }, [isAuthenticated]);
  useEffect(() => { if (selectedClass) { fetchStudents(); } }, [selectedClass]);
  useEffect(() => { if (selectedStudent) fetchEvidence(); }, [selectedStudent]);

  const fetchInitialData = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try { await Promise.all([fetchClasses(), fetchSubjects(), fetchCompetencies()]); } catch (error) { addToast('error', 'Failed to load data'); } finally { setLoading(prev => ({ ...prev, classes: false })); }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/classes/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) { setClasses(data.data); if (data.data.length > 0 && !selectedClass) setSelectedClass(data.data[0]); }
      else addToast('error', data.message || 'Failed to load classes');
    } catch (error) { addToast('error', 'Network error loading classes'); }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/subjects/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) setSubjects(data.data);
    } catch (error) { console.error('Error fetching subjects:', error); }
  };

  const fetchCompetencies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/competencies/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) setCompetencies(data.data);
    } catch (error) { console.error('Error fetching competencies:', error); }
  };

  const fetchStudents = async () => {
    if (!selectedClass?.id) return;
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/students/${selectedClass.id}/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) { setStudents(data.data); if (data.data.length > 0 && !selectedStudent) setSelectedStudent(data.data[0]); }
      else setStudents([]);
    } catch (error) { addToast('error', 'Failed to load students'); setStudents([]); } finally { setLoading(prev => ({ ...prev, students: false })); }
  };

  const fetchEvidence = async () => {
    if (!selectedStudent?.id) return;
    setLoading(prev => ({ ...prev, evidence: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/list/?student_id=${selectedStudent.id}`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) setEvidence(data.data);
      else setEvidence([]);
    } catch (error) { addToast('error', 'Failed to load evidence'); setEvidence([]); } finally { setLoading(prev => ({ ...prev, evidence: false })); }
  };

  const handleUploadEvidence = async (formData) => {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('student_id', formData.student_id);
      payload.append('subject', formData.subject);
      payload.append('competencies', JSON.stringify(formData.competencies));
      payload.append('date', formData.date);
      payload.append('student_reflection', formData.student_reflection);
      payload.append('teacher_feedback', formData.teacher_feedback);
      if (formData.file) payload.append('file', formData.file);

      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/upload/`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeaders().Authorization },
        body: payload
      });
      const data = await response.json();
      if (data.success) { addToast('success', 'Evidence uploaded successfully'); await fetchEvidence(); }
      else addToast('error', data.error || 'Failed to upload');
    } catch (error) { addToast('error', 'Failed to upload evidence'); } finally { setSaving(false); }
  };

  const handleDeleteClick = (evidenceItem) => {
    setEvidenceToDelete(evidenceItem);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!evidenceToDelete) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/${evidenceToDelete.id}/delete/`, { 
        method: 'DELETE', 
        headers: getAuthHeaders() 
      });
      const data = await response.json();
      if (data.success) { addToast('success', 'Evidence deleted'); await fetchEvidence(); }
      else addToast('error', data.error || 'Failed to delete');
    } catch (error) { addToast('error', 'Failed to delete evidence'); } finally { setSaving(false); setShowDeleteConfirm(false); setEvidenceToDelete(null); }
  };

  const handleToggleFeatured = async (evidenceItem) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/${evidenceItem.id}/feature/`, { 
        method: 'POST', 
        headers: getAuthHeaders() 
      });
      const data = await response.json();
      if (data.success) { addToast('success', evidenceItem.featured ? 'Removed from featured' : 'Added to featured'); await fetchEvidence(); }
      else addToast('error', data.error || 'Failed to update');
    } catch (error) { addToast('error', 'Failed to update featured status'); } finally { setSaving(false); }
  };

  const handleAddComment = async (evidenceId, comment) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/${evidenceId}/comment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment, type: 'teacher' })
      });
      const data = await response.json();
      if (data.success) { addToast('success', 'Comment added'); await fetchEvidence(); }
      else addToast('error', data.error || 'Failed to add comment');
    } catch (error) { addToast('error', 'Failed to add comment'); }
  };

  const filteredEvidence = useMemo(() => {
    let filtered = evidence;
    if (filterSubject !== 'all') filtered = filtered.filter(e => e.subject === filterSubject);
    if (searchTerm) filtered = filtered.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  }, [evidence, filterSubject, searchTerm]);

  if (!isAuthenticated) {
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="text-center"><AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2><p className="text-gray-600 mb-4">Please login</p><a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium rounded-lg">Go to Login</a></div></div>);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (<Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />))}
      <ConfirmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDeleteConfirm} title="Delete Evidence" message={`Are you sure you want to delete "${evidenceToDelete?.title}"? This cannot be undone.`} />
      {(loading.classes || loading.students || loading.evidence || saving) && <GlobalSpinner />}

      <div className="bg-green-700 p-6"><div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"><div><h1 className="text-2xl font-bold text-white">Digital Portfolio</h1><p className="text-green-100 mt-1">Evidence Collection | Competency Tagging</p></div><div className="flex gap-3"><button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"><Plus className="h-4 w-4 inline mr-2" /> Add Evidence</button><button onClick={fetchEvidence} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg"><RefreshCw className="h-4 w-4 inline mr-2" /> Refresh</button></div></div></div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label><select value={selectedClass?.id || ''} onChange={(e) => setSelectedClass(classes.find(c => c.id === e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">{classes.map(cls => (<option key={cls.id} value={cls.id}>{cls.class_name_display}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Select Student</label><select value={selectedStudent?.id || ''} onChange={(e) => setSelectedStudent(students.find(s => s.id === e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" disabled={loading.students}>{students.map(s => (<option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Filter by Subject</label><select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="all">All Subjects</option>{subjects.map(s => (<option key={s.id} value={s.name}>{s.name}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Search</label><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search evidence..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" /></div></div>
          </div>
        </div>

        <div className="flex gap-2 mb-4"><button onClick={() => setViewMode('gallery')} className={`px-3 py-1 text-sm rounded-lg ${viewMode === 'gallery' ? 'bg-green-700 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}><Grid className="h-4 w-4 inline mr-1" /> Gallery</button><button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm rounded-lg ${viewMode === 'list' ? 'bg-green-700 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}><List className="h-4 w-4 inline mr-1" /> List</button></div>

        {filteredEvidence.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center"><FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-700">No evidence found</h3><p className="text-gray-500 mt-1 mb-4">Upload evidence to start building the portfolio</p><button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg"><Upload className="h-4 w-4 inline mr-2" /> Upload Evidence</button></div>
        ) : viewMode === 'gallery' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredEvidence.map(item => (<EvidenceCard key={item.id} evidence={item} onView={(ev) => { setSelectedEvidence(ev); setShowDetailModal(true); }} onDelete={handleDeleteClick} onFeature={handleToggleFeatured} isFeatured={item.featured} coreCompetencies={competencies} />))}</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-left">Subject</th><th className="px-4 py-3 text-left">Competency</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-center">Actions</th></tr></thead><tbody>{filteredEvidence.map(item => (<tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50"><td className="px-4 py-3 font-medium">{item.title}</td><td className="px-4 py-3">{item.student_name}</td><td className="px-4 py-3">{item.subject || '-'}</td><td className="px-4 py-3">{competencies.find(c => c.id === item.competency_id)?.name || '-'}</td><td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td><td className="px-4 py-3 text-center"><button onClick={() => { setSelectedEvidence(item); setShowDetailModal(true); }} className="text-blue-600 hover:text-blue-800 mr-2"><Eye className="h-4 w-4" /></button><button onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button></td></tr>))}</tbody></table></div>
        )}
      </div>

      <UploadEvidenceModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onSave={handleUploadEvidence} 
        students={students} 
        subjects={subjects} 
        competencies={competencies}
        addToast={addToast}
      />
      <EvidenceDetailModal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setSelectedEvidence(null); }} evidence={selectedEvidence} onAddComment={handleAddComment} coreCompetencies={competencies} />

      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }`}</style>
    </div>
  );
}

export default DigitalPortfolio;