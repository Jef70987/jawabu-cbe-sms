/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, RefreshCw, School, CheckCircle, Users, 
  BarChart3, AlertCircle, X, Loader2, Info,
  Edit2, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext'; 
import { useNavigate } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Toast Notification component with auto-dismiss and different colors
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
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
      {getIcon()}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }} className="ml-2 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Spinner component for buttons
const ButtonSpinner = () => (
  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
);

// Global overlay spinner
const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading data...</p>
    </div>
  </div>
);

function ClassManagement() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [numericLevels, setNumericLevels] = useState([]);
  const [loading, setLoading] = useState({ classes: true, teachers: true, streams: true, levels: true });
  const [toasts, setToasts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedGradeId, setSelectedGradeId] = useState('7');
  
  // Loading states for specific actions
  const [actionLoading, setActionLoading] = useState({
    addStream: false,
    updateStream: false,
    deleteStream: false,
    toggleStatus: false,
    assignTeacher: false,
    promote: false,
    fetchData: false
  });
  
  // Modal states
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showTeacherAssignmentModal, setShowTeacherAssignmentModal] = useState(false);
  const [showSubjectTeacherModal, setShowSubjectTeacherModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [selectedStreamForTeachers, setSelectedStreamForTeachers] = useState(null);
  const [selectedStreamForSubjects, setSelectedStreamForSubjects] = useState(null);
  
  // Form Data
  const [newStream, setNewStream] = useState({
    name: '',
    code: '',
    gradeId: '',
    capacity: 40,
    classTeacherId: ''
  });
  
  const [promotionData, setPromotionData] = useState({
    fromGradeId: '',
    toGradeId: '',
    streamIds: [],
    academicYear: new Date().getFullYear().toString()
  });
  
  // Subject assignment
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacherForSubject, setSelectedTeacherForSubject] = useState('');

  const navigate = useNavigate();

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access class management');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
      fetchSubjects();
    }, []);

    // Fetch with timeout
  const fetchWithTimeout = useCallback(async (url, options, timeout = 8000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, []);

  const fetchInitialData = async () => {
    if (!isAuthenticated) return;
    
    setActionLoading(prev => ({ ...prev, fetchData: true }));
    
    try {
      setLoading({ classes: true, teachers: true, streams: true, levels: true });
      await fetchStreams();
      await fetchNumericLevels();
      await fetchClasses();
      await fetchTeachers();
    } catch (error) {
      console.error('Initial fetch error:', error);
      addToast('error', 'Error fetching initial data. Please refresh the page.');
    } finally {
      setLoading({ classes: false, teachers: false, streams: false, levels: false });
      setActionLoading(prev => ({ ...prev, fetchData: false }));
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/streams/`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setStreams(data.data);
      }
    } catch (error) {
      console.error('Streams fetch error:', error);
      addToast('error', 'Failed to load streams');
    } finally {
      setLoading(prev => ({ ...prev, streams: false }));
    }
  };

  const fetchNumericLevels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/numeric-levels/`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setNumericLevels(data.data);
      }
    } catch (error) {
      console.error('Numeric levels fetch error:', error);
      addToast('error', 'Failed to load numeric levels');
    } finally {
      setLoading(prev => ({ ...prev, levels: false }));
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/`, { headers: getAuthHeaders() });
      if (!response.ok) {
        if (response.status === 401) {
          addToast('error', 'Session expired. Please login again.');
          navigate('/Logout');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) setClasses(data.data);
      else addToast('error', data.error || 'Failed to load classes');
    } catch (error) {
      console.error('Classes fetch error:', error);
      addToast('error', 'Error fetching classes. Please check your connection.');
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/api/registrar/classes/subjects/`,
        { headers: getAuthHeaders() },
        8000
      );
      if (data && data.success) {
        setSubjects(data.data);
        
      }
    } catch (error) {
      addToast('error', 'Failed to load subjects');
    } finally {
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/teachers/`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setTeachers(data.data);
      }
    } catch (error) {
      addToast('error', 'Failed to load teachers');
    } finally {
      setLoading(prev => ({ ...prev, teachers: false }));
    }
  };

  // Grade Levels Configuration based on Kenyan system
  const gradeLevels = [
    // Early Years Education (EYE)
    { id: 'pp1', name: 'Pre-Primary 1', code: 'PP1', levelType: 'early-years', order: 1, numericLevel: 1 },
    { id: 'pp2', name: 'Pre-Primary 2', code: 'PP2', levelType: 'early-years', order: 2, numericLevel: 2 },
    { id: '1', name: 'Grade 1', code: 'G1', levelType: 'early-years', order: 3, numericLevel: 3 },
    { id: '2', name: 'Grade 2', code: 'G2', levelType: 'early-years', order: 4, numericLevel: 4 },
    { id: '3', name: 'Grade 3', code: 'G3', levelType: 'early-years', order: 5, numericLevel: 5 },
    // Middle School - Upper Primary
    { id: '4', name: 'Grade 4', code: 'G4', levelType: 'primary', order: 6, numericLevel: 6 },
    { id: '5', name: 'Grade 5', code: 'G5', levelType: 'primary', order: 7, numericLevel: 7 },
    { id: '6', name: 'Grade 6', code: 'G6', levelType: 'primary', order: 8, numericLevel: 8 },
    // Junior Secondary School (JSS)
    { id: '7', name: 'Grade 7', code: 'G7', levelType: 'junior', order: 9, numericLevel: 9},
    { id: '8', name: 'Grade 8', code: 'G8', levelType: 'junior', order: 10, numericLevel: 10 },
    { id: '9', name: 'Grade 9', code: 'G9', levelType: 'junior', order: 11, numericLevel: 11}
  ];

  // Get classes grouped by grade level
  const getClassesForGrade = (gradeId) => {
    const gradeInfo = gradeLevels.find(g => g.id === gradeId);
    if (!gradeInfo) return [];
    if (gradeInfo.numericLevel === 0) {
      return classes.filter(c => c.class_name.toLowerCase().includes(gradeInfo.name.toLowerCase()));
    }
    return classes.filter(c => c.numeric_level === gradeInfo.numericLevel);
  };

  const getGradeInfo = (numericLevel) => {
    return gradeLevels.find(g => g.numericLevel === numericLevel);
  };

  const getTotalStudents = () => {
    return classes.reduce((sum, c) => sum + (c.current_students || 0), 0);
  };

  const getTotalBoys = () => {
    return Math.ceil(getTotalStudents() / 2);
  };

  const getTotalGirls = () => {
    return Math.floor(getTotalStudents() / 2);
  };

  const getTotalStreams = () => {
    return classes.length;
  };

  const getFullStreamsCount = () => {
    return classes.filter(c => (c.current_students || 0) >= c.capacity).length;
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Not Assigned';
  };

  const getCapacityStatus = (cls) => {
    const percentage = ((cls.current_students || 0) / cls.capacity) * 100;
    if (percentage >= 100) return { class: 'bg-red-100 text-red-800', text: 'Full' };
    if (percentage >= 85) return { class: 'bg-yellow-100 text-yellow-800', text: 'Near Capacity' };
    return { class: 'bg-green-100 text-green-800', text: 'Available' };
  };

  const getGradeLevelsByType = (type) => {
    return gradeLevels.filter(g => g.levelType === type);
  };

  // Stream CRUD operations
  const addStream = async () => {
    if (!newStream.name || !newStream.gradeId) {
      addToast('warning', 'Please fill in all required fields');
      return;
    }

    setActionLoading(prev => ({ ...prev, addStream: true }));

    try {
      const gradeInfo = gradeLevels.find(g => g.id === newStream.gradeId);
      const numericLevelValue = gradeInfo.numericLevel;
      const gradeName = gradeInfo.name;

      const formDataToSend = {
        class_code: newStream.code.toUpperCase(),
        class_name: gradeName,
        numeric_level: numericLevelValue,
        stream: newStream.name,
        capacity: newStream.capacity,
        class_teacher_id: newStream.classTeacherId || '',
        is_active: true
      };

      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formDataToSend)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        addToast('success', `Stream "${newStream.name}" created successfully`);
        await fetchClasses();
        setShowStreamModal(false);
        setNewStream({ name: '', code: '', gradeId: '', capacity: 40, classTeacherId: '' });
        setEditingStream(null);
      } else {
        addToast('error', data.error || 'Failed to create stream');
      }
    } catch (error) {
      addToast('error', 'Failed to create stream. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, addStream: false }));
    }
  };

  const editStream = (cls) => {
    const gradeInfo = getGradeInfo(cls.numeric_level);
    const gradeId = gradeInfo ? gradeLevels.find(g => g.numericLevel === cls.numeric_level)?.id : '';
    setEditingStream(cls);
    setNewStream({
      name: cls.class_name,
      code: cls.class_code,
      gradeId: gradeId,
      capacity: cls.capacity,
      classTeacherId: cls.class_teacher_id || ''
    });
    setShowStreamModal(true);
  };

  const updateStream = async () => {
    if (!editingStream || !newStream.name) return;

    setActionLoading(prev => ({ ...prev, updateStream: true }));

    try {
      const gradeInfo = gradeLevels.find(g => g.id === newStream.gradeId);
      const numericLevelValue = gradeInfo ? gradeInfo.numericLevel : editingStream.numeric_level;
      
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/update/${editingStream.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          class_code: newStream.code.toUpperCase(),
          class_name: newStream.name,
          numeric_level: numericLevelValue,
          capacity: newStream.capacity,
          class_teacher_id: newStream.classTeacherId || '',
          is_active: editingStream.is_active
        })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        addToast('success', `Stream "${newStream.name}" updated successfully`);
        await fetchClasses();
        setShowStreamModal(false);
        setNewStream({ name: '', code: '', gradeId: '', capacity: 40, classTeacherId: '' });
        setEditingStream(null);
      } else {
        addToast('error', data.error || 'Failed to update stream');
      }
    } catch (error) {
      addToast('error', 'Failed to update stream. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, updateStream: false }));
    }
  };

  const deleteStream = async (classId, className) => {
    // Using toast confirm instead of window.confirm
    const confirmed = window.confirm(`Are you sure you want to delete ${className}?`);
    if (!confirmed) return;
    
    setActionLoading(prev => ({ ...prev, deleteStream: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/delete/${classId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        addToast('success', `Stream "${className}" deleted successfully`);
        await fetchClasses();
      } else {
        addToast('error', data.error || 'Failed to delete stream');
      }
    } catch (error) {
      addToast('error', 'Failed to delete stream. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, deleteStream: false }));
    }
  };

  const toggleStreamStatus = async (classId, currentStatus, className) => {
    setActionLoading(prev => ({ ...prev, toggleStatus: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/update/${classId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        addToast('success', `Stream "${className}" ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await fetchClasses();
      } else {
        addToast('error', data.error || 'Failed to update stream status');
      }
    } catch (error) {
      addToast('error', 'Failed to update stream. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, toggleStatus: false }));
    }
  };

  const assignClassTeacher = (cls) => {
    setSelectedStreamForTeachers(cls);
    setNewStream({
      ...newStream,
      classTeacherId: cls.class_teacher_id || ''
    });
    setShowTeacherAssignmentModal(true);
  };

  const saveClassTeacher = async () => {
    if (selectedStreamForTeachers && newStream.classTeacherId) {
      setActionLoading(prev => ({ ...prev, assignTeacher: true }));

      try {
        const response = await fetch(`${API_BASE_URL}/api/registrar/classes/update/${selectedStreamForTeachers.id}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            class_teacher_id: newStream.classTeacherId
          })
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          addToast('success', 'Class teacher assigned successfully');
          await fetchClasses();
          setShowTeacherAssignmentModal(false);
          setSelectedStreamForTeachers(null);
          setNewStream({ ...newStream, classTeacherId: '' });
        } else {
          addToast('error', data.error || 'Failed to assign class teacher');
        }
      } catch (error) {
        addToast('error', 'Failed to assign class teacher. Please try again.');
      } finally {
        setActionLoading(prev => ({ ...prev, assignTeacher: false }));
      }
    }
  };

  const assignSubjectTeacher = (cls) => {
    setSelectedStreamForSubjects(cls);
    setSelectedSubject('');
    setSelectedTeacherForSubject('');
    setShowSubjectTeacherModal(true);
  };

  const addSubjectTeacher = async () => {
    if (selectedStreamForSubjects && selectedSubject && selectedTeacherForSubject) {
      addToast('info', 'Subject teacher assignment feature - Integrate with your backend');
      setShowSubjectTeacherModal(false);
      setSelectedStreamForSubjects(null);
    }
  };

  const promoteStudents = async () => {
    if (promotionData.fromGradeId && promotionData.toGradeId) {
      setActionLoading(prev => ({ ...prev, promote: true }));

      try {
        const fromGrade = gradeLevels.find(g => g.id === promotionData.fromGradeId);
        const toGrade = gradeLevels.find(g => g.id === promotionData.toGradeId);
        const fromClasses = getClassesForGrade(promotionData.fromGradeId);
        const totalStudents = fromClasses.reduce((sum, c) => sum + (c.current_students || 0), 0);
        
        // Simulate API call - replace with actual promotion API endpoint
        // const response = await fetch(`${API_BASE_URL}/api/registrar/classes/promote/`, {
        //   method: 'POST',
        //   headers: getAuthHeaders(),
        //   body: JSON.stringify(promotionData)
        // });
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        addToast('success', `Promotion initiated: Moving ${totalStudents} students from ${fromGrade?.name} to ${toGrade?.name}`);
        setShowPromotionModal(false);
        setPromotionData({ fromGradeId: '', toGradeId: '', streamIds: [], academicYear: new Date().getFullYear().toString() });
      } catch (error) {
        addToast('error', 'Failed to process promotion. Please try again.');
      } finally {
        setActionLoading(prev => ({ ...prev, promote: false }));
      }
    }
  };

  // Render table for any grade level
  const renderStreamTable = (grade, gradeClasses) => {
    return (
      <div key={grade.id} className="bg-white border border-gray-300 mb-4">
        <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">{grade.name}</h3>
              <p className="text-xs text-gray-600">{grade.code}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{gradeClasses.reduce((sum, c) => sum + (c.current_students || 0), 0)} students</div>
              <div className="text-xs text-gray-600">{gradeClasses.length} streams</div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 bg-gray-100">Stream Name</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 bg-gray-100">Capacity</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 bg-gray-100">Enrolled</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 bg-gray-100">Class Teacher</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 bg-gray-100">Status</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gradeClasses.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{cls.class_name}</p>
                      <p className="text-xs text-gray-500">Code: {cls.class_code}</p>
                    </div>
                   </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{cls.capacity}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-900 font-medium">{cls.current_students || 0}</span>
                      <div className="w-20 bg-gray-300 h-1.5">
                        <div className="bg-blue-600 h-1.5" style={{ width: `${Math.min(100, ((cls.current_students || 0) / cls.capacity) * 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {cls.class_teacher_name ? (
                      <span className="text-gray-800">{cls.class_teacher_name}</span>
                    ) : (
                      <span className="text-red-600 text-xs">Not Assigned</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium ${cls.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cls.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium ${getCapacityStatus(cls).class}`}>
                      {getCapacityStatus(cls).text}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => assignClassTeacher(cls)} 
                        disabled={actionLoading.assignTeacher}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {actionLoading.assignTeacher && selectedStreamForTeachers?.id === cls.id && <ButtonSpinner />}
                        Assign
                      </button>
                      <button 
                        onClick={() => editStream(cls)} 
                        disabled={actionLoading.updateStream}
                        className="px-3 py-1 bg-gray-500 text-white text-xs font-medium border border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStreamStatus(cls.id, cls.is_active, cls.class_name)} 
                        disabled={actionLoading.toggleStatus}
                        className={`px-3 py-1 text-white text-xs font-medium border flex items-center gap-1 ${cls.is_active ? 'bg-red-600 border-red-700 hover:bg-red-700' : 'bg-green-600 border-green-700 hover:bg-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading.toggleStatus && <ButtonSpinner />}
                        {cls.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteStream(cls.id, cls.class_name)} 
                        disabled={actionLoading.deleteStream}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {actionLoading.deleteStream && <ButtonSpinner />}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {gradeClasses.length === 0 && (
                <tr>
                  <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-400">
                    No streams configured for this grade
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access class management</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Global Overlay Spinner */}
      {actionLoading.fetchData && <GlobalSpinner />}

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      {/* Header with bg-green-700 */}
      <div className="mb-8 bg-green-700 p-6">
        <h1 className="text-2xl font-bold text-white">Class & Stream Management</h1>
        <p className="text-green-100 mt-1">Configure grades, streams, and manage teacher assignments</p>
        {user && (
          <p className="text-sm text-green-100 mt-2">
            Logged in as: <span className="font-bold">{user.first_name} {user.last_name}</span> ({user.role})
          </p>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-300 pb-4">
        <button 
          onClick={() => setActiveTab('grades')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'grades' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Grade & Stream Config
        </button>
        <button 
          onClick={() => setActiveTab('teachers')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'teachers' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Faculty Mapping
        </button>
        <button 
          onClick={() => setActiveTab('promotion')} 
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === 'promotion' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Promotion Tool
        </button>
      </div>

      {/* TAB 1: GRADE & STREAM CONFIG */}
      {activeTab === 'grades' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white border border-gray-300 p-5">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading.classes ? '...' : getTotalStudents()}</p>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <p className="text-sm text-gray-600">Boys</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading.classes ? '...' : getTotalBoys()}</p>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <p className="text-sm text-gray-600">Girls</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading.classes ? '...' : getTotalGirls()}</p>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <p className="text-sm text-gray-600">Total Streams</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{getTotalStreams()}</p>
            </div>
            <div className="bg-white border border-gray-300 p-5">
              <p className="text-sm text-gray-600">Full Streams</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{getFullStreamsCount()}</p>
            </div>
          </div>

          {/* Add Stream Button */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => { setEditingStream(null); setNewStream({ name: '', code: '', gradeId: selectedGradeId, capacity: 40, classTeacherId: '' }); setShowStreamModal(true); }} 
              disabled={actionLoading.addStream}
              className="px-5 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {actionLoading.addStream && <ButtonSpinner />}
              Add Stream
            </button>
          </div>

          {/* Loading State */}
          {loading.classes && (
            <div className="bg-white border border-gray-300 p-12 text-center">
              <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading classes...</p>
            </div>
          )}

          {/* Early Years Section with Table */}
          {!loading.classes && (
            <>
              <div className="mb-8">
                <h2 className="text-md font-bold text-gray-800 mb-3 bg-gray-200 p-2">Early Years Education</h2>
                {getGradeLevelsByType('early-years').map(grade => {
                  const gradeClasses = getClassesForGrade(grade.id);
                  return renderStreamTable(grade, gradeClasses);
                })}
              </div>

              {/* Primary Section with Table */}
              <div className="mb-8">
                <h2 className="text-md font-bold text-gray-800 mb-3 bg-gray-200 p-2">Primary Education</h2>
                {getGradeLevelsByType('primary').map(grade => {
                  const gradeClasses = getClassesForGrade(grade.id);
                  return renderStreamTable(grade, gradeClasses);
                })}
              </div>

              {/* Junior School Section with Table */}
              <div>
                <h2 className="text-md font-bold text-gray-800 mb-3 bg-gray-200 p-2">Junior School (JSS)</h2>
                {getGradeLevelsByType('junior').map(grade => {
                  const gradeClasses = getClassesForGrade(grade.id);
                  return renderStreamTable(grade, gradeClasses);
                })}
              </div>
            </>
          )}

          {!loading.classes && classes.length === 0 && (
            <div className="bg-white border border-gray-300 p-12 text-center">
              <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No streams found</h3>
              <p className="text-gray-500 mt-1 mb-4">Create your first stream to get started</p>
              <button onClick={() => { setEditingStream(null); setNewStream({ name: '', code: '', gradeId: selectedGradeId, capacity: 40, classTeacherId: '' }); setShowStreamModal(true); }} className="px-5 py-2 bg-green-700 text-white text-sm font-medium border border-green-800">
                Add Stream
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FACULTY MAPPING */}
      {activeTab === 'teachers' && (
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
            <h2 className="text-md font-bold text-gray-900">Teacher Assignments by Stream</h2>
            <p className="text-sm text-gray-600 mt-0.5">Class Teachers and Subject Specialists for JSS</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-6 py-3 text-left font-bold text-gray-700 bg-gray-100">Grade / Stream</th>
                  <th className="border border-gray-300 px-6 py-3 text-left font-bold text-gray-700 bg-gray-100">Class Teacher</th>
                  <th className="border border-gray-300 px-6 py-3 text-left font-bold text-gray-700 bg-gray-100">Subject Specialists (JSS)</th>
                  <th className="border border-gray-300 px-6 py-3 text-center font-bold text-gray-700 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gradeLevels.map(grade => {
                  const gradeClasses = getClassesForGrade(grade.id);
                  return gradeClasses.map(cls => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{grade.name} - {cls.class_name}</p>
                          <p className="text-xs text-gray-500">{cls.class_code}</p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-6 py-4">
                        {cls.class_teacher_name ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-300 flex items-center justify-center border border-gray-400">
                              <span className="text-gray-800 text-xs font-bold">{cls.class_teacher_name.charAt(0)}</span>
                            </div>
                            <span className="text-gray-800">{cls.class_teacher_name}</span>
                          </div>
                        ) : (
                          <span className="text-red-600 text-xs">Not Assigned</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {grade.levelType === 'junior' && (
                            <button 
                              onClick={() => assignSubjectTeacher(cls)} 
                              className="px-2 py-1 bg-white border border-gray-400 text-gray-700 text-xs font-medium hover:bg-gray-100"
                            >
                              Add Subject Teacher
                            </button>
                          )}
                          {grade.levelType !== 'junior' && (
                            <span className="text-xs text-gray-400">No subject specialists for this level</span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <button 
                          onClick={() => assignClassTeacher(cls)} 
                          disabled={actionLoading.assignTeacher}
                          className="px-3 py-1 bg-green-700 text-white text-xs font-medium border border-green-800 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                        >
                          {actionLoading.assignTeacher && selectedStreamForTeachers?.id === cls.id && <ButtonSpinner />}
                          Assign Teacher
                        </button>
                       </td>
                     </tr>
                  ));
                })}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 px-6 py-8 text-center text-gray-400">
                      No streams available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTION TOOL */}
      {activeTab === 'promotion' && (
        <div className="bg-white border border-gray-300 p-6">
          <h2 className="text-md font-bold text-gray-900 mb-2">Bulk Promotion / Transition Tool</h2>
          <p className="text-sm text-gray-600 mb-6">Move entire streams from one grade to the next</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">From Grade</label>
              <select 
                value={promotionData.fromGradeId}
                onChange={(e) => setPromotionData({ ...promotionData, fromGradeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                disabled={actionLoading.promote}
              >
                <option value="">Select Grade</option>
                {gradeLevels.map(grade => {
                  const gradeClasses = getClassesForGrade(grade.id);
                  const totalStudents = gradeClasses.reduce((sum, c) => sum + (c.current_students || 0), 0);
                  return (
                    <option key={grade.id} value={grade.id}>
                      {grade.name} ({totalStudents} students)
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">To Grade</label>
              <select 
                value={promotionData.toGradeId}
                onChange={(e) => setPromotionData({ ...promotionData, toGradeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                disabled={actionLoading.promote}
              >
                <option value="">Select Destination Grade</option>
                {gradeLevels.map(grade => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Academic Year</label>
            <input 
              type="text" 
              value={promotionData.academicYear}
              onChange={(e) => setPromotionData({ ...promotionData, academicYear: e.target.value })}
              className="w-full md:w-64 px-3 py-2 border border-gray-400 text-sm bg-white" 
              placeholder="2025-2026"
              disabled={actionLoading.promote}
            />
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-gray-700 mt-0.5 font-bold">!</div>
              <div>
                <p className="font-bold text-gray-800">Transition Notice</p>
                <p className="text-sm text-gray-700 mt-1">This action will promote all students from the selected grade to the next level. Please ensure all assessments are finalized before proceeding.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={promoteStudents}
              disabled={!promotionData.fromGradeId || !promotionData.toGradeId || actionLoading.promote}
              className="px-5 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {actionLoading.promote && <ButtonSpinner />}
              Process Promotion
            </button>
          </div>
        </div>
      )}

      {/* Stream Modal - Add/Edit Stream */}
      {showStreamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowStreamModal(false); setEditingStream(null); }}>
          <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">{editingStream ? 'Edit Stream' : 'Add Stream'}</h3>
              <button onClick={() => { setShowStreamModal(false); setEditingStream(null); }} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Grade</label>
                <select 
                  value={newStream.gradeId}
                  onChange={(e) => setNewStream({ ...newStream, gradeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  disabled={actionLoading.addStream || actionLoading.updateStream}
                >
                  <option value="">Select Grade</option>
                  {gradeLevels.map(grade => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Stream Name</label>
                <input 
                  type="text" 
                  value={newStream.name}
                  onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" 
                  placeholder="e.g., blue, red, green"
                  disabled={actionLoading.addStream || actionLoading.updateStream}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Stream Code</label>
                <input 
                  type="text" 
                  value={newStream.code}
                  onChange={(e) => setNewStream({ ...newStream, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" 
                  placeholder="e.g., B001, R001, Y001"
                  disabled={actionLoading.addStream || actionLoading.updateStream}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  value={newStream.capacity}
                  onChange={(e) => setNewStream({ ...newStream, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" 
                  min="1" 
                  max="60"
                  disabled={actionLoading.addStream || actionLoading.updateStream}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Class Teacher</label>
                <select 
                  value={newStream.classTeacherId}
                  onChange={(e) => setNewStream({ ...newStream, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  disabled={actionLoading.addStream || actionLoading.updateStream}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name} {teacher.specialization && `(${teacher.specialization})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => { setShowStreamModal(false); setEditingStream(null); }} 
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={actionLoading.addStream || actionLoading.updateStream}
              >
                Cancel
              </button>
              <button 
                onClick={editingStream ? updateStream : addStream} 
                disabled={actionLoading.addStream || actionLoading.updateStream}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(actionLoading.addStream || actionLoading.updateStream) && <ButtonSpinner />}
                {editingStream ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Teacher Assignment Modal */}
      {showTeacherAssignmentModal && selectedStreamForTeachers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTeacherAssignmentModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Assign Class Teacher</h3>
              <button onClick={() => setShowTeacherAssignmentModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">Stream: <span className="font-bold text-gray-900">{selectedStreamForTeachers.class_name}</span></p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Teacher</label>
                <select 
                  value={newStream.classTeacherId}
                  onChange={(e) => setNewStream({ ...newStream, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  disabled={actionLoading.assignTeacher}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name} {teacher.specialization && `- ${teacher.specialization}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowTeacherAssignmentModal(false)} 
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={actionLoading.assignTeacher}
              >
                Cancel
              </button>
              <button 
                onClick={saveClassTeacher} 
                disabled={actionLoading.assignTeacher}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading.assignTeacher && <ButtonSpinner />}
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Teacher Assignment Modal */}
      {showSubjectTeacherModal && selectedStreamForSubjects && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSubjectTeacherModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Assign Subject Specialist</h3>
              <button onClick={() => setShowSubjectTeacherModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">Stream: <span className="font-bold text-gray-900">{selectedStreamForSubjects.class_name}</span></p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Teacher</label>
                <select 
                  value={selectedTeacherForSubject}
                  onChange={(e) => setSelectedTeacherForSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name} - {teacher.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowSubjectTeacherModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={addSubjectTeacher} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
            
      {/* Add CSS animation for toasts */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ClassManagement;