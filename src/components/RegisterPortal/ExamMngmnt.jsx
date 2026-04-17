/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Exam Status Constants
const EXAM_STATUS = {
  DRAFT: { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800', next: ['scheduled', 'cancelled'] },
  SCHEDULED: { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800', next: ['live', 'cancelled'] },
  LIVE: { value: 'live', label: 'Live', color: 'bg-green-100 text-green-800', next: ['marking', 'cancelled'] },
  MARKING: { value: 'marking', label: 'Marking', color: 'bg-yellow-100 text-yellow-800', next: ['moderation', 'published'] },
  MODERATION: { value: 'moderation', label: 'Moderation', color: 'bg-purple-100 text-purple-800', next: ['published'] },
  PUBLISHED: { value: 'published', label: 'Published', color: 'bg-indigo-100 text-indigo-800', next: ['archived'] },
  ARCHIVED: { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800', next: [] },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', next: [] }
};

const EXAM_TYPES = [
  { value: 'cba', label: 'Classroom-Based Assessment (CBA)', weight: 0.2 },
  { value: 'sba', label: 'School-Based Assessment (SBA)', weight: 0.2 },
  { value: 'cat', label: 'Continuous Assessment Test (CAT)', weight: 0.2 },
  { value: 'end_term', label: 'End of Term Exam', weight: 0.6 },
  { value: 'mock', label: 'Mock Exam', weight: 1.0 },
  { value: 'kpsea', label: 'KPSEA (Grade 6)', weight: 1.0 },
  { value: 'kjsea', label: 'KJSEA (Grade 9)', weight: 1.0 },
  { value: 'kcse', label: 'KCSE (Form 4)', weight: 1.0 }
];

const SUBJECTS = {
  'early_years': ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor and Creative Activities', 'Religious Education'],
  'lower_primary': ['English', 'Kiswahili', 'Mathematics', 'Environmental Activities', 'Hygiene and Nutrition', 'Religious Education', 'Creative Arts'],
  'upper_primary': ['English', 'Kiswahili', 'Mathematics', 'Science and Technology', 'Social Studies', 'Religious Education', 'Creative Arts', 'Physical Education'],
  'junior': ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Pre-Technical Studies', 'Social Studies', 'Religious Education', 'Creative Arts', 'Physical Education', 'Agriculture and Nutrition']
};

const CBC_COMPETENCIES = [
  'Communication and Collaboration',
  'Critical Thinking and Problem Solving',
  'Creativity and Imagination',
  'Citizenship',
  'Digital Literacy',
  'Learning to Learn',
  'Self-Efficacy'
];

const CBC_VALUES = [
  'Love',
  'Responsibility',
  'Respect',
  'Unity',
  'Peace',
  'Patriotism',
  'Integrity'
];

const FOUR_POINT_SCALE = [
  { level: 4, label: 'Exceeding Expectations (EE)', description: 'Exceptional mastery independently', percentage: '90-100%' },
  { level: 3, label: 'Meeting Expectations (ME)', description: 'Performs correctly and independently', percentage: '75-89%' },
  { level: 2, label: 'Approaching Expectations (AE)', description: 'Progress with occasional support', percentage: '58-74%' },
  { level: 1, label: 'Below Expectations (BE)', description: 'Requires significant intervention', percentage: '0-57%' }
];

const EIGHT_POINT_SCALE = [
  { points: 8, level: 'EE 1', original: 'Exceeding Expectations', percentage: '90-100%' },
  { points: 7, level: 'EE 2', original: 'Exceeding Expectations', percentage: '75-89%' },
  { points: 6, level: 'ME 1', original: 'Meeting Expectations', percentage: '58-74%' },
  { points: 5, level: 'ME 2', original: 'Meeting Expectations', percentage: '41-57%' },
  { points: 4, level: 'AE 1', original: 'Approaching Expectations', percentage: '31-40%' },
  { points: 3, level: 'AE 2', original: 'Approaching Expectations', percentage: '21-30%' },
  { points: 2, level: 'BE 1', original: 'Below Expectations', percentage: '11-20%' },
  { points: 1, level: 'BE 2', original: 'Below Expectations', percentage: '0-10%' }
];

function ExamManagement() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [markingData, setMarkingData] = useState({});
  const [moderationData, setModerationData] = useState({});
  const [permissions, setPermissions] = useState({
    schoolWide: false,
    gradeLevels: {},
    subjectTeachers: {},
    autoPublish: false,
    requireModeration: true
  });
  const [scheduledLock, setScheduledLock] = useState({
    enabled: false,
    lockUntil: ''
  });

  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
      success: 'bg-green-50 border-green-400 text-green-800',
      error: 'bg-red-50 border-red-400 text-red-800',
      warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      info: 'bg-blue-50 border-blue-400 text-blue-800'
    };

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 bg-white shadow-lg animate-slide-in ${styles[type]}`}>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        </div>
      </div>
    );
  };

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access exam management');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [exams, searchTerm, selectedStatus, selectedExamType]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const examsRes = await fetch(`${API_BASE_URL}/api/registrar/exams/`, {
        headers: getAuthHeaders()
      });
      const examsData = await examsRes.json();
      if (examsData.success) {
        setExams(examsData.data);
      }

      const classesRes = await fetch(`${API_BASE_URL}/api/registrar/classes/`, {
        headers: getAuthHeaders()
      });
      const classesData = await classesRes.json();
      if (classesData.success) {
        setClasses(classesData.data);
      }

      const teachersRes = await fetch(`${API_BASE_URL}/api/registrar/teachers/`, {
        headers: getAuthHeaders()
      });
      const teachersData = await teachersRes.json();
      if (teachersData.success) {
        setTeachers(teachersData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...exams];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(term) ||
        e.exam_code?.toLowerCase().includes(term)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }

    if (selectedExamType) {
      filtered = filtered.filter(e => e.exam_type === selectedExamType);
    }

    setFilteredExams(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedExamType('');
  };

  const getPaginatedItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const createExam = () => {
    setSelectedExam(null);
    setEditFormData({
      exam_code: '',
      title: '',
      exam_type: '',
      academic_year: new Date().getFullYear(),
      term: 1,
      grade_level: '',
      start_date: '',
      end_date: '',
      duration_minutes: 180,
      total_marks: 100,
      passing_marks: 50,
      status: 'draft',
      instructions: '',
      subjects: [],
      classes: [],
      marking_scheme: '',
      weighting: {},
      room_allocation: [],
      invigilators: []
    });
    setShowExamModal(true);
  };

  const editExam = (exam) => {
    setSelectedExam(exam);
    setEditFormData({
      id: exam.id,
      exam_code: exam.exam_code,
      title: exam.title,
      exam_type: exam.exam_type,
      academic_year: exam.academic_year,
      term: exam.term,
      grade_level: exam.grade_level,
      start_date: exam.start_date,
      end_date: exam.end_date,
      duration_minutes: exam.duration_minutes,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      status: exam.status,
      instructions: exam.instructions,
      subjects: exam.subjects || [],
      classes: exam.classes || [],
      marking_scheme: exam.marking_scheme || '',
      weighting: exam.weighting || {},
      room_allocation: exam.room_allocation || [],
      invigilators: exam.invigilators || []
    });
    setShowExamModal(true);
  };

  const saveExam = async () => {
    try {
      const url = selectedExam 
        ? `${API_BASE_URL}/api/registrar/exams/update/${selectedExam.id}/`
        : `${API_BASE_URL}/api/registrar/exams/create/`;
      const method = selectedExam ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(editFormData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Exam ${selectedExam ? 'updated' : 'created'} successfully!`);
        await fetchData();
        setShowExamModal(false);
      } else {
        addNotification('error', data.error || 'Failed to save exam');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      addNotification('error', 'Failed to save exam.');
    }
  };

  const updateExamStatus = async (examId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/update/${examId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Exam status updated to ${EXAM_STATUS[newStatus.toUpperCase()]?.label || newStatus}`);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      addNotification('error', 'Failed to update status.');
    }
  };

  const openScheduleModal = (exam) => {
    setSelectedExam(exam);
    setSchedules([]);
    setShowScheduleModal(true);
  };

  const openMarkingModal = (exam) => {
    setSelectedExam(exam);
    setMarkingData({});
    setShowMarkingModal(true);
  };

  const openModerationModal = (exam) => {
    setSelectedExam(exam);
    setModerationData({});
    setShowModerationModal(true);
  };

  const checkConflicts = (schedules) => {
    const conflictsList = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        if (schedules[i].class_id === schedules[j].class_id &&
            schedules[i].date === schedules[j].date) {
          const start1 = new Date(`2000-01-01T${schedules[i].start_time}`);
          const end1 = new Date(`2000-01-01T${schedules[i].end_time}`);
          const start2 = new Date(`2000-01-01T${schedules[j].start_time}`);
          const end2 = new Date(`2000-01-01T${schedules[j].end_time}`);
          
          if ((start1 < end2 && end1 > start2)) {
            conflictsList.push({
              exam1: schedules[i],
              exam2: schedules[j],
              class: classes.find(c => c.id == schedules[i].class_id)?.class_name
            });
          }
        }
      }
    }
    return conflictsList;
  };

  const saveSchedule = async () => {
    const detectedConflicts = checkConflicts(schedules);
    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      setShowConflictModal(true);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/schedule/${selectedExam.id}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ schedules })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', 'Schedule saved successfully');
        setShowScheduleModal(false);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      addNotification('error', 'Failed to save schedule.');
    }
  };

  const openPermissionModal = () => {
    setShowPermissionModal(true);
  };

  const savePermissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/permissions/${selectedExam?.id || 'global'}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ permissions, scheduledLock })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', 'Permissions updated successfully');
        setShowPermissionModal(false);
      } else {
        addNotification('error', data.error || 'Failed to save permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      addNotification('error', 'Failed to save permissions.');
    }
  };

  const assignMarkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/markers/${selectedExam.id}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(markingData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', 'Markers assigned successfully');
        setShowMarkingModal(false);
      } else {
        addNotification('error', data.error || 'Failed to assign markers');
      }
    } catch (error) {
      console.error('Error assigning markers:', error);
      addNotification('error', 'Failed to assign markers.');
    }
  };

  const submitModeration = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/moderate/${selectedExam.id}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(moderationData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', 'Moderation completed successfully');
        setShowModerationModal(false);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to submit moderation');
      }
    } catch (error) {
      console.error('Error submitting moderation:', error);
      addNotification('error', 'Failed to submit moderation.');
    }
  };

  const deleteExam = async (exam) => {
    if (!window.confirm(`Are you sure you want to delete ${exam.title}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/exams/delete/${exam.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Exam ${exam.title} deleted successfully`);
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      addNotification('error', 'Failed to delete exam.');
    }
  };

  const exportToCSV = () => {
    try {
      const exportData = filteredExams.map(exam => ({
        'Exam Code': exam.exam_code,
        'Title': exam.title,
        'Type': EXAM_TYPES.find(t => t.value === exam.exam_type)?.label || exam.exam_type,
        'Year': exam.academic_year,
        'Term': exam.term,
        'Start Date': exam.start_date,
        'End Date': exam.end_date,
        'Duration (mins)': exam.duration_minutes,
        'Total Marks': exam.total_marks,
        'Passing Marks': exam.passing_marks,
        'Status': EXAM_STATUS[exam.status?.toUpperCase()]?.label || exam.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Exams');
      XLSX.writeFile(workbook, `exams_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      addNotification('success', `Exported ${exportData.length} exams successfully`);
    } catch (error) {
      console.error('Error exporting:', error);
      addNotification('error', 'Failed to export data.');
    }
  };

  const canEdit = (status) => {
    return status === 'draft' || status === 'scheduled';
  };

  const getSubjectsForGrade = (gradeLevel) => {
    if (gradeLevel === 'pp1' || gradeLevel === 'pp2') return SUBJECTS.early_years;
    if (['1', '2', '3'].includes(gradeLevel)) return SUBJECTS.lower_primary;
    if (['4', '5', '6'].includes(gradeLevel)) return SUBJECTS.upper_primary;
    if (['7', '8', '9'].includes(gradeLevel)) return SUBJECTS.junior;
    return SUBJECTS.upper_primary;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4 border border-blue-300">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please login to access exam management</p>
          <a href="/login" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Examination Management</h1>
              <p className="text-sm text-gray-600 mt-1">Enterprise control tower for CBC/CBE examinations</p>
            </div>
            <div className="flex gap-3">
              <button onClick={openPermissionModal} className="px-5 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">
                Global Permissions
              </button>
              <button onClick={exportToCSV} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                Export CSV
              </button>
              <button onClick={createExam} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                Create Exam
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Total Exams</p>
            <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.status === 'draft').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-blue-700">{exams.filter(e => e.status === 'scheduled').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Live</p>
            <p className="text-2xl font-bold text-green-700">{exams.filter(e => e.status === 'live').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Marking</p>
            <p className="text-2xl font-bold text-yellow-700">{exams.filter(e => e.status === 'marking').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Moderation</p>
            <p className="text-2xl font-bold text-purple-700">{exams.filter(e => e.status === 'moderation').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Published</p>
            <p className="text-2xl font-bold text-indigo-700">{exams.filter(e => e.status === 'published').length}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3">
            <p className="text-xs text-gray-600">Archived</p>
            <p className="text-2xl font-bold text-gray-700">{exams.filter(e => e.status === 'archived').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code or title..." 
                className="w-full px-3 py-2 text-sm border border-gray-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Status</option>
                {Object.values(EXAM_STATUS).map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Exam Type</label>
              <select value={selectedExamType} onChange={(e) => setSelectedExamType(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Types</option>
                {EXAM_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={clearFilters} className="text-xs text-blue-700 hover:text-blue-900 font-bold">Clear All Filters</button>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100">Exam Code</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100">Title</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden md:table-cell">Type</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden lg:table-cell">Period</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden sm:table-cell">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-xs font-bold text-gray-700 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-500">Loading exams...</td>
                  </tr>
                ) : getPaginatedItems().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-500">No exams found</td>
                  </tr>
                ) : (
                  getPaginatedItems().map(exam => {
                    const status = EXAM_STATUS[exam.status?.toUpperCase()];
                    return (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{exam.exam_code}</td>
                        <td className="border border-gray-300 px-4 py-3 font-medium">{exam.title}</td>
                        <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-xs">
                          {EXAM_TYPES.find(t => t.value === exam.exam_type)?.label || exam.exam_type}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 hidden lg:table-cell text-xs">
                          {exam.start_date} to {exam.end_date}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 hidden sm:table-cell">
                          <span className={`px-2 py-1 text-xs font-bold border ${status?.color}`}>
                            {status?.label}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <button 
                              onClick={() => editExam(exam)} 
                              disabled={!canEdit(exam.status)}
                              className={`px-3 py-1 text-xs font-medium border ${canEdit(exam.status) ? 'bg-green-600 text-white border-green-700 hover:bg-green-700' : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'}`}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => openScheduleModal(exam)} 
                              className="px-3 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700"
                            >
                              Schedule
                            </button>
                            {exam.status === 'marking' && (
                              <button 
                                onClick={() => openMarkingModal(exam)} 
                                className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium border border-yellow-700 hover:bg-yellow-700"
                              >
                                Marking
                              </button>
                            )}
                            {exam.status === 'moderation' && (
                              <button 
                                onClick={() => openModerationModal(exam)} 
                                className="px-3 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700"
                              >
                                Moderate
                              </button>
                            )}
                            {exam.status !== 'archived' && exam.status !== 'cancelled' && (
                              <select
                                value=""
                                onChange={(e) => updateExamStatus(exam.id, e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-400 bg-white"
                              >
                                <option value="">Change Status</option>
                                {status?.next.map(nextStatus => (
                                  <option key={nextStatus} value={nextStatus}>
                                    Move to {EXAM_STATUS[nextStatus.toUpperCase()]?.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button 
                              onClick={() => deleteExam(exam)} 
                              className="px-3 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredExams.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-300 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredExams.length)} of {filteredExams.length} exams
              </p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExamModal(false)}>
          <div className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">{selectedExam ? 'Edit Exam' : 'Create Exam'}</h3>
              <button onClick={() => setShowExamModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Code *</label>
                  <input type="text" name="exam_code" value={editFormData.exam_code} onChange={(e) => setEditFormData({...editFormData, exam_code: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Title *</label>
                  <input type="text" name="title" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Type *</label>
                  <select name="exam_type" value={editFormData.exam_type} onChange={(e) => setEditFormData({...editFormData, exam_type: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" required>
                    <option value="">Select Type</option>
                    {EXAM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Grade Level *</label>
                  <select name="grade_level" value={editFormData.grade_level} onChange={(e) => setEditFormData({...editFormData, grade_level: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" required>
                    <option value="">Select Grade</option>
                    <option value="pp1">Pre-Primary 1 (PP1)</option>
                    <option value="pp2">Pre-Primary 2 (PP2)</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Academic Year</label>
                  <input type="number" name="academic_year" value={editFormData.academic_year} onChange={(e) => setEditFormData({...editFormData, academic_year: parseInt(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Term</label>
                  <select name="term" value={editFormData.term} onChange={(e) => setEditFormData({...editFormData, term: parseInt(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input type="date" name="start_date" value={editFormData.start_date} onChange={(e) => setEditFormData({...editFormData, start_date: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input type="date" name="end_date" value={editFormData.end_date} onChange={(e) => setEditFormData({...editFormData, end_date: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration (minutes)</label>
                  <input type="number" name="duration_minutes" value={editFormData.duration_minutes} onChange={(e) => setEditFormData({...editFormData, duration_minutes: parseInt(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Marks</label>
                  <input type="number" name="total_marks" value={editFormData.total_marks} onChange={(e) => setEditFormData({...editFormData, total_marks: parseInt(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Passing Marks</label>
                  <input type="number" name="passing_marks" value={editFormData.passing_marks} onChange={(e) => setEditFormData({...editFormData, passing_marks: parseInt(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subjects</label>
                  <div className="border border-gray-300 p-3 max-h-40 overflow-y-auto">
                    {getSubjectsForGrade(editFormData.grade_level).map(subject => (
                      <label key={subject} className="flex items-center mr-4 mb-2">
                        <input type="checkbox" checked={editFormData.subjects?.includes(subject)} onChange={(e) => {
                          const subjects = e.target.checked 
                            ? [...(editFormData.subjects || []), subject]
                            : (editFormData.subjects || []).filter(s => s !== subject);
                          setEditFormData({...editFormData, subjects});
                        }} className="mr-2" />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instructions</label>
                  <textarea name="instructions" value={editFormData.instructions} onChange={(e) => setEditFormData({...editFormData, instructions: e.target.value})} rows="3" className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowExamModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={saveExam} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">Save Exam</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Schedule Exam: {selectedExam.title}</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-4 bg-yellow-50 border border-yellow-300 p-3">
                <p className="text-sm text-yellow-800">⚠️ Schedule each subject with date, time, and room. The system will detect conflicts automatically.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mb-4">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">Subject</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">Start Time</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">End Time</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">Room</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold">Invigilator</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-xs font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-3 py-2">
                          <select value={schedule.subject} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].subject = e.target.value;
                            setSchedules(newSchedules);
                          }} className="w-full px-2 py-1 text-sm border border-gray-400 bg-white">
                            <option value="">Select</option>
                            {(editFormData.subjects || getSubjectsForGrade(selectedExam.grade_level)).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input type="date" value={schedule.date} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].date = e.target.value;
                            setSchedules(newSchedules);
                          }} className="w-full px-2 py-1 text-sm border border-gray-400 bg-white" />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input type="time" value={schedule.start_time} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].start_time = e.target.value;
                            setSchedules(newSchedules);
                          }} className="w-full px-2 py-1 text-sm border border-gray-400 bg-white" />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input type="time" value={schedule.end_time} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].end_time = e.target.value;
                            setSchedules(newSchedules);
                          }} className="w-full px-2 py-1 text-sm border border-gray-400 bg-white" />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input type="text" value={schedule.room} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].room = e.target.value;
                            setSchedules(newSchedules);
                          }} placeholder="Room No" className="w-full px-2 py-1 text-sm border border-gray-400 bg-white" />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <select value={schedule.invigilator} onChange={(e) => {
                            const newSchedules = [...schedules];
                            newSchedules[index].invigilator = e.target.value;
                            setSchedules(newSchedules);
                          }} className="w-full px-2 py-1 text-sm border border-gray-400 bg-white">
                            <option value="">Select</option>
                            {teachers.map(t => (
                              <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <button onClick={() => setSchedules(schedules.filter((_, i) => i !== index))} className="text-red-600 hover:text-red-800">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button onClick={() => setSchedules([...schedules, { subject: '', date: '', start_time: '', end_time: '', room: '', invigilator: '', class_id: selectedExam.classes?.[0] }])} className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                + Add Schedule
              </button>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={saveSchedule} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">Save Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Marking Modal */}
      {showMarkingModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMarkingModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Assign Markers: {selectedExam.title}</h3>
              <button onClick={() => setShowMarkingModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Assign teachers to mark each subject. Multiple markers can be assigned to the same subject.</p>
              </div>
              
              {(selectedExam.subjects || getSubjectsForGrade(selectedExam.grade_level)).map(subject => (
                <div key={subject} className="mb-4 p-3 border border-gray-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{subject}</label>
                  <select 
                    multiple 
                    value={markingData[subject] || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setMarkingData({...markingData, [subject]: selected});
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white h-32"
                  >
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl to select multiple markers</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowMarkingModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={assignMarkers} className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium border border-yellow-700 hover:bg-yellow-700">Assign Markers</button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {showModerationModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModerationModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Moderate Exam: {selectedExam.title}</h3>
              <button onClick={() => setShowModerationModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-4 bg-purple-50 border border-purple-300 p-3">
                <p className="text-sm text-purple-800">Review and moderate all marked scripts before publishing.</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Moderator</label>
                <select value={moderationData.moderator} onChange={(e) => setModerationData({...moderationData, moderator: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                  <option value="">Select Moderator</option>
                  {teachers.filter(t => t.role === 'senior_teacher' || t.role === 'hod').map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Moderation Notes</label>
                <textarea value={moderationData.notes} onChange={(e) => setModerationData({...moderationData, notes: e.target.value})} rows="4" className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" placeholder="Enter moderation comments, discrepancies found, recommendations..."></textarea>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={moderationData.approved} onChange={(e) => setModerationData({...moderationData, approved: e.target.checked})} className="mr-2" />
                  <span className="text-sm">Approve all results for publication</span>
                </label>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowModerationModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={submitModeration} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">Submit Moderation</button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPermissionModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Global Permission Settings</h3>
              <button onClick={() => setShowPermissionModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300">
                  <div>
                    <p className="font-bold text-sm">School-Wide Mark Uploading</p>
                    <p className="text-xs text-gray-600">Allow all teachers to upload marks for any exam</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={permissions.schoolWide} onChange={(e) => setPermissions({...permissions, schoolWide: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 mb-2">
                  <div>
                    <p className="font-bold text-sm">Require Moderation</p>
                    <p className="text-xs text-gray-600">Results must be moderated before publication</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={permissions.requireModeration} onChange={(e) => setPermissions({...permissions, requireModeration: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 mb-2">
                  <div>
                    <p className="font-bold text-sm">Scheduled Lock</p>
                    <p className="text-xs text-gray-600">Auto-expire permissions after timestamp</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={scheduledLock.enabled} onChange={(e) => setScheduledLock({...scheduledLock, enabled: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                {scheduledLock.enabled && (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Lock Until</label>
                    <input type="datetime-local" value={scheduledLock.lockUntil} onChange={(e) => setScheduledLock({...scheduledLock, lockUntil: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white" />
                    <p className="text-xs text-gray-500 mt-1">Permissions will automatically expire after this timestamp</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="font-bold text-sm mb-3">Grade Level Permissions</p>
                <div className="max-h-60 overflow-y-auto border border-gray-300">
                  {classes.map(cls => (
                    <div key={cls.id} className="flex items-center justify-between p-2 border-b border-gray-200">
                      <span className="text-sm">{cls.class_name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={permissions.gradeLevels[cls.id] || false} onChange={(e) => setPermissions({
                          ...permissions,
                          gradeLevels: {...permissions.gradeLevels, [cls.id]: e.target.checked}
                        })} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowPermissionModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={savePermissions} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">Save Permissions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamManagement;