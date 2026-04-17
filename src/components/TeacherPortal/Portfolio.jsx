import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, X, Image, File, Video, FileText, Download, Eye,
  Search, Filter, Grid, List, Trash2, AlertCircle, CheckCircle,
  Loader2, RefreshCw, Plus, FolderOpen, Calendar, User, BookOpen
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles[type]} border p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// View Evidence Modal
const ViewEvidenceModal = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">{evidence.title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-4 bg-gray-100 border border-gray-300 flex items-center justify-center min-h-[300px]">
            {evidence.evidence_type === 'image' && (
              <img src={evidence.file_url || '/placeholder-image.jpg'} alt={evidence.title} className="max-w-full max-h-[400px] object-contain" />
            )}
            {evidence.evidence_type === 'video' && (
              <video controls className="max-w-full max-h-[400px]">
                <source src={evidence.file_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {evidence.evidence_type === 'document' && (
              <div className="text-center p-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Document Preview Not Available</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                  <Download className="h-4 w-4 inline mr-2" />
                  Download Document
                </button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p><span className="font-bold text-gray-700">Description:</span> {evidence.description}</p>
            <p><span className="font-bold text-gray-700">Student:</span> {evidence.student_name}</p>
            <p><span className="font-bold text-gray-700">Subject:</span> {evidence.subject}</p>
            <p><span className="font-bold text-gray-700">Uploaded:</span> {evidence.created_at}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Close
          </button>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-bold border border-green-800 hover:bg-green-800">
            <Download className="h-4 w-4 inline mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

function EvidenceVault() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [evidences, setEvidences] = useState([]);
  const [filteredEvidences, setFilteredEvidences] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [notifications, setNotifications] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceToDelete, setEvidenceToDelete] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    student_id: '',
    subject: '',
    evidence_type: 'image'
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access evidence vault');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    filterEvidences();
  }, [evidences, selectedStudent, selectedSubject]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setEvidences(data.data);
        setFilteredEvidences(data.data);
      } else {
        // Mock evidence data
        setEvidences([
          { id: 1, title: 'Science Project - Model of Solar System', description: 'John created an excellent 3D model showing all planets', student_id: 1, student_name: 'John Mwangi', subject: 'Integrated Science', evidence_type: 'image', file_url: '/mock-image.jpg', created_at: '2024-03-15' },
          { id: 2, title: 'Mathematics Problem Solving', description: 'Mary solved complex algebra problems with step-by-step working', student_id: 2, student_name: 'Mary Wanjiku', subject: 'Mathematics', evidence_type: 'document', file_url: '/mock-doc.pdf', created_at: '2024-03-14' },
          { id: 3, title: 'Digital Literacy Project', description: 'Created a presentation on internet safety and cyberbullying', student_id: 3, student_name: 'James Otieno', subject: 'Digital Literacy', evidence_type: 'video', file_url: '/mock-video.mp4', created_at: '2024-03-13' },
          { id: 4, title: 'English Essay - My Hero', description: 'Well-structured essay with excellent vocabulary', student_id: 4, student_name: 'Sarah Achieng', subject: 'English', evidence_type: 'document', file_url: '/mock-doc2.pdf', created_at: '2024-03-12' },
          { id: 5, title: 'Art Project - Landscape Painting', description: 'Beautiful watercolor painting of Mt. Kenya', student_id: 5, student_name: 'David Kiprop', subject: 'Creative Arts', evidence_type: 'image', file_url: '/mock-image2.jpg', created_at: '2024-03-11' }
        ]);
        setFilteredEvidences([
          { id: 1, title: 'Science Project - Model of Solar System', description: 'John created an excellent 3D model showing all planets', student_id: 1, student_name: 'John Mwangi', subject: 'Integrated Science', evidence_type: 'image', file_url: '/mock-image.jpg', created_at: '2024-03-15' },
          { id: 2, title: 'Mathematics Problem Solving', description: 'Mary solved complex algebra problems with step-by-step working', student_id: 2, student_name: 'Mary Wanjiku', subject: 'Mathematics', evidence_type: 'document', file_url: '/mock-doc.pdf', created_at: '2024-03-14' },
          { id: 3, title: 'Digital Literacy Project', description: 'Created a presentation on internet safety and cyberbullying', student_id: 3, student_name: 'James Otieno', subject: 'Digital Literacy', evidence_type: 'video', file_url: '/mock-video.mp4', created_at: '2024-03-13' },
          { id: 4, title: 'English Essay - My Hero', description: 'Well-structured essay with excellent vocabulary', student_id: 4, student_name: 'Sarah Achieng', subject: 'English', evidence_type: 'document', file_url: '/mock-doc2.pdf', created_at: '2024-03-12' },
          { id: 5, title: 'Art Project - Landscape Painting', description: 'Beautiful watercolor painting of Mt. Kenya', student_id: 5, student_name: 'David Kiprop', subject: 'Creative Arts', evidence_type: 'image', file_url: '/mock-image2.jpg', created_at: '2024-03-11' }
        ]);
        
        setStudents([
          { id: 1, name: 'John Mwangi', admission_no: 'ADM001' },
          { id: 2, name: 'Mary Wanjiku', admission_no: 'ADM002' },
          { id: 3, name: 'James Otieno', admission_no: 'ADM003' },
          { id: 4, name: 'Sarah Achieng', admission_no: 'ADM004' },
          { id: 5, name: 'David Kiprop', admission_no: 'ADM005' }
        ]);
        
        setSubjects(['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Digital Literacy', 'Creative Arts', 'Social Studies']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to load evidence data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvidences = () => {
    let filtered = [...evidences];
    
    if (selectedStudent) {
      filtered = filtered.filter(e => e.student_id == selectedStudent);
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(e => e.subject === selectedSubject);
    }
    
    setFilteredEvidences(filtered);
  };

  const clearFilters = () => {
    setSelectedStudent('');
    setSelectedSubject('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      // Auto-detect file type
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setUploadForm(prev => ({ ...prev, evidence_type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        setUploadForm(prev => ({ ...prev, evidence_type: 'video' }));
      } else {
        setUploadForm(prev => ({ ...prev, evidence_type: 'document' }));
      }
    }
  };

  const uploadEvidence = async () => {
    if (!uploadForm.title || !uploadForm.student_id || !uploadFile) {
      addNotification('warning', 'Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('student_id', uploadForm.student_id);
      formData.append('subject', uploadForm.subject);
      formData.append('evidence_type', uploadForm.evidence_type);
      formData.append('file', uploadFile);

      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Evidence uploaded successfully');
        setShowUploadModal(false);
        setUploadForm({ title: '', description: '', student_id: '', subject: '', evidence_type: 'image' });
        setUploadFile(null);
        setUploadProgress(0);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to upload evidence');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      addNotification('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (evidence) => {
    setEvidenceToDelete(evidence);
    setShowDeleteModal(true);
  };

  const deleteEvidence = async () => {
    if (!evidenceToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/${evidenceToDelete.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Evidence deleted successfully');
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to delete evidence');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      addNotification('error', 'Failed to delete evidence');
    } finally {
      setShowDeleteModal(false);
      setEvidenceToDelete(null);
    }
  };

  const viewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setShowViewModal(true);
  };

  const getEvidenceIcon = (type) => {
    switch(type) {
      case 'image': return <Image className="h-8 w-8 text-blue-600" />;
      case 'video': return <Video className="h-8 w-8 text-purple-600" />;
      case 'document': return <FileText className="h-8 w-8 text-green-600" />;
      default: return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const downloadEvidence = async (evidence) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/evidence/${evidence.id}/download/`, {
        headers: getAuthHeaders()
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${evidence.title}.${evidence.file_url?.split('.').pop() || 'file'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addNotification('success', 'Download started');
    } catch (error) {
      console.error('Error downloading:', error);
      addNotification('error', 'Failed to download file');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access evidence vault</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Evidence"
        message={`Are you sure you want to delete "${evidenceToDelete?.title}"? This action cannot be undone.`}
        onConfirm={deleteEvidence}
        onCancel={() => { setShowDeleteModal(false); setEvidenceToDelete(null); }}
      />

      {/* View Evidence Modal */}
      {showViewModal && selectedEvidence && (
        <ViewEvidenceModal evidence={selectedEvidence} onClose={() => { setShowViewModal(false); setSelectedEvidence(null); }} />
      )}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Evidence Vault</h1>
              <p className="text-orange-100 mt-1">Upload and manage student work as evidence of learning</p>
            </div>
            <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-blue-700 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
              <Upload className="h-4 w-4 inline mr-2" />
              Upload Evidence
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Filters */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Student</label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Students</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Subject</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={clearFilters} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50">
                Clear Filters
              </button>
              <div className="flex border border-gray-300">
                <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                  <Grid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Total Evidence Items</p>
            <p className="text-2xl font-bold text-gray-900">{evidences.length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Images</p>
            <p className="text-2xl font-bold text-blue-700">{evidences.filter(e => e.evidence_type === 'image').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Documents</p>
            <p className="text-2xl font-bold text-green-700">{evidences.filter(e => e.evidence_type === 'document').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-xs text-gray-600">Videos</p>
            <p className="text-2xl font-bold text-purple-700">{evidences.filter(e => e.evidence_type === 'video').length}</p>
          </div>
        </div>

        {/* Evidence Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
                <p className="mt-2 text-gray-600">Loading evidence...</p>
              </div>
            ) : filteredEvidences.length === 0 ? (
              <div className="col-span-full bg-white border border-gray-300 p-12 text-center text-gray-400">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No evidence found. Upload some student work!</p>
              </div>
            ) : (
              filteredEvidences.map(evidence => (
                <div key={evidence.id} className="bg-white border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-300 cursor-pointer" onClick={() => viewEvidence(evidence)}>
                    {getEvidenceIcon(evidence.evidence_type)}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 truncate" title={evidence.title}>{evidence.title}</h3>
                      <button onClick={() => confirmDelete(evidence)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evidence.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span className="truncate">{evidence.student_name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <BookOpen className="h-3 w-3" />
                      <span>{evidence.subject}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{evidence.created_at}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => viewEvidence(evidence)} className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                        <Eye className="h-3 w-3 inline mr-1" />
                        View
                      </button>
                      <button onClick={() => downloadEvidence(evidence)} className="flex-1 px-3 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700">
                        <Download className="h-3 w-3 inline mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Evidence List View */}
        {viewMode === 'list' && (
          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Title</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Student</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 hidden md:table-cell">Subject</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 hidden lg:table-cell">Date</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
                      </td>
                    </tr>
                  ) : filteredEvidences.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-400">
                        No evidence found
                      </td>
                    </tr>
                  ) : (
                    filteredEvidences.map(evidence => (
                      <tr key={evidence.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">
                          {getEvidenceIcon(evidence.evidence_type)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {evidence.title}
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{evidence.description}</p>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">{evidence.student_name}</td>
                        <td className="border border-gray-300 px-4 py-3 hidden md:table-cell">{evidence.subject}</td>
                        <td className="border border-gray-300 px-4 py-3 hidden lg:table-cell">{evidence.created_at}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => viewEvidence(evidence)} className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button onClick={() => downloadEvidence(evidence)} className="px-2 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700">
                              <Download className="h-3 w-3" />
                            </button>
                            <button onClick={() => confirmDelete(evidence)} className="px-2 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Upload Evidence</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                <input 
                  type="text" 
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., Science Project - Model of Solar System"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="Describe the evidence and what it demonstrates..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Student *</label>
                <select 
                  value={uploadForm.student_id}
                  onChange={(e) => setUploadForm({...uploadForm, student_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject *</label>
                <select 
                  value={uploadForm.subject}
                  onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Type</label>
                <select 
                  value={uploadForm.evidence_type}
                  onChange={(e) => setUploadForm({...uploadForm, evidence_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="image">Image (JPG, PNG, GIF)</option>
                  <option value="video">Video (MP4, MOV)</option>
                  <option value="document">Document (PDF, DOC, PPT)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Upload File *</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
              </div>
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="bg-gray-200 h-2 rounded">
                    <div className="bg-green-600 h-2 rounded" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={uploadEvidence} disabled={uploading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Upload className="h-4 w-4 inline mr-2" />}
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceVault;