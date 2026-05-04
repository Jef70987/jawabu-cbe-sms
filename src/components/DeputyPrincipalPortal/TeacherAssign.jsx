/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  BookOpen, Plus, RefreshCw, Trash2, UserCheck, Users,
  AlertCircle, CheckCircle, X, Loader2, Search, Filter,
  Save, Edit, Eye, ChevronLeft, ChevronRight,
  Grid, List, Target, Award, GraduationCap,
  School, Calendar, Clock, MapPin, Mail, Phone,
  ChevronDown, ChevronUp, UserPlus, UserMinus, User,
  Layers, GitBranch, Database, Zap, Flame, Trophy, 
  Microscope, Calculator, Book, Languages, Music, Palette, 
  Briefcase, Heart, Globe, Code, Leaf, Utensils, 
  Beaker, Activity
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
      {type === 'warning' && <AlertCircle className="h-5 w-5" />}
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
      <p className="text-gray-700 font-medium">Loading teacher assignments...</p>
    </div>
  </div>
);

// Subject Icon Component
const SubjectIcon = ({ subjectName }) => {
  const name = subjectName?.toLowerCase() || '';
  if (name.includes('science') || name.includes('biology') || name.includes('chemistry')) return <Beaker className="h-4 w-4" />;
  if (name.includes('math')) return <Calculator className="h-4 w-4" />;
  if (name.includes('english') || name.includes('literature')) return <Book className="h-4 w-4" />;
  if (name.includes('kiswahili') || name.includes('swahili')) return <Languages className="h-4 w-4" />;
  if (name.includes('music')) return <Music className="h-4 w-4" />;
  if (name.includes('art') || name.includes('drawing')) return <Palette className="h-4 w-4" />;
  if (name.includes('business') || name.includes('commerce')) return <Briefcase className="h-4 w-4" />;
  if (name.includes('social') || name.includes('history') || name.includes('geography')) return <Globe className="h-4 w-4" />;
  if (name.includes('computer') || name.includes('ict')) return <Code className="h-4 w-4" />;
  if (name.includes('agriculture')) return <Leaf className="h-4 w-4" />;
  if (name.includes('physical') || name.includes('pe')) return <Activity className="h-4 w-4" />;
  return <BookOpen className="h-4 w-4" />;
};

// Assignment Modal (Create/Edit)
const AssignmentModal = ({ isOpen, onClose, onSave, classes, subjects, teachers, academicYears, saving, editData }) => {
  const [formData, setFormData] = useState({
    id: null,
    class_id: '',
    subject_id: '',
    teacher_id: '',
    periods_per_week: 5,
    is_compulsory: true,
    academic_year: '',    // will be set from dropdown
    original_class_id: '',
    original_subject_id: ''
  });

  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState(null);
  const [localErrors, setLocalErrors] = useState({});

  const isEditMode = !!editData?.id;

  // Set default academic year from prop (first current, else first in list)
  const defaultAcademicYear = useMemo(() => {
    if (academicYears && academicYears.length > 0) {
      const current = academicYears.find(y => y.is_current);
      return current ? current.year_code : academicYears[0].year_code;
    }
    return '';
  }, [academicYears]);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        class_id: editData.class_id || '',
        subject_id: editData.subject_id || '',
        teacher_id: editData.teacher_id || '',
        periods_per_week: editData.periods_per_week || 5,
        is_compulsory: editData.is_compulsory !== undefined ? editData.is_compulsory : true,
        academic_year: editData.academic_year || defaultAcademicYear,
        original_class_id: editData.class_id || '',
        original_subject_id: editData.subject_id || ''
      });
      
      if (editData.class_numeric_level) {
        if (editData.class_numeric_level <= 2) setSelectedGradeLevel('early');
        else if (editData.class_numeric_level <= 8) setSelectedGradeLevel('primary');
        else setSelectedGradeLevel('junior');
      }
    } else {
      setFormData({
        id: null,
        class_id: '',
        subject_id: '',
        teacher_id: '',
        periods_per_week: 5,
        is_compulsory: true,
        academic_year: defaultAcademicYear,
        original_class_id: '',
        original_subject_id: ''
      });
      setSelectedGradeLevel('');
      setSelectedClassDetails(null);
      setSelectedTeacherDetails(null);
    }
    setLocalErrors({});
  }, [editData, defaultAcademicYear]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      let filtered = [];
      if (selectedGradeLevel === 'early') {
        filtered = classes.filter(c => c.numeric_level === 1 || c.numeric_level === 2);
      } else if (selectedGradeLevel === 'primary') {
        filtered = classes.filter(c => c.numeric_level >= 3 && c.numeric_level <= 8);
      } else if (selectedGradeLevel === 'junior') {
        filtered = classes.filter(c => c.numeric_level >= 9 && c.numeric_level <= 11);
      } else {
        filtered = classes;
      }
      setFilteredClasses(filtered);
    }
  }, [classes, selectedGradeLevel]);

  useEffect(() => {
    if (formData.class_id) {
      const selected = filteredClasses.find(c => c.id === formData.class_id);
      setSelectedClassDetails(selected);
    } else {
      setSelectedClassDetails(null);
    }
  }, [formData.class_id, filteredClasses]);

  useEffect(() => {
    if (formData.teacher_id) {
      const selected = teachers.find(t => t.id === formData.teacher_id);
      setSelectedTeacherDetails(selected);
    } else {
      setSelectedTeacherDetails(null);
    }
  }, [formData.teacher_id, teachers]);

  const handleGradeLevelChange = (level) => {
    setSelectedGradeLevel(level);
    setFormData(prev => ({ ...prev, class_id: '' }));
    setSelectedClassDetails(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.class_id) errors.class_id = 'Please select a class';
    if (!formData.subject_id) errors.subject_id = 'Please select a subject';
    if (!formData.teacher_id) errors.teacher_id = 'Please select a teacher';
    if (!formData.academic_year) errors.academic_year = 'Please select an academic year';
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Teacher Assignment' : 'Assign Teacher to Class'}
          </h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        
        <div className="p-6">
          {/* Step 1: Grade Level & Class */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Step 1: Select Grade Level</label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleGradeLevelChange('early')}
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  selectedGradeLevel === 'early' 
                    ? 'bg-green-600 text-white border-green-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Early Years (PP1-PP2)
              </button>
              <button
                type="button"
                onClick={() => handleGradeLevelChange('primary')}
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  selectedGradeLevel === 'primary' 
                    ? 'bg-green-600 text-white border-green-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Primary (G1-G6)
              </button>
              <button
                type="button"
                onClick={() => handleGradeLevelChange('junior')}
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  selectedGradeLevel === 'junior' 
                    ? 'bg-green-600 text-white border-green-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Junior Secondary (G7-G9)
              </button>
            </div>
            
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              className={`w-full px-3 py-2 border rounded text-sm bg-white ${localErrors.class_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a class</option>
              {filteredClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} - Stream: {cls.stream || 'None'} (Capacity: {cls.capacity})
                </option>
              ))}
            </select>
            {localErrors.class_id && <p className="text-red-500 text-xs mt-1">{localErrors.class_id}</p>}
            
            {selectedClassDetails && (
              <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                <p className="font-bold text-blue-800 mb-1">Class Details:</p>
                <p className="text-blue-700">• Class Name: {selectedClassDetails.class_name}</p>
                <p className="text-blue-700">• Stream: {selectedClassDetails.stream || 'No stream specified'}</p>
                <p className="text-blue-700">• Capacity: {selectedClassDetails.capacity} students</p>
                <p className="text-blue-700">• Class Code: {selectedClassDetails.class_code}</p>
                <p className="text-blue-700">• Grade Level: {selectedClassDetails.grade_name || selectedClassDetails.numeric_level}</p>
              </div>
            )}
          </div>

          {/* Step 2: Subject */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Step 2: Select Subject</label>
            <select
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              className={`w-full px-3 py-2 border rounded text-sm bg-white ${localErrors.subject_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.area_name} ({sub.area_code}) - {sub.area_type || 'Core Subject'}
                </option>
              ))}
            </select>
            {localErrors.subject_id && <p className="text-red-500 text-xs mt-1">{localErrors.subject_id}</p>}
          </div>

          {/* Step 3: Teacher Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Step 3: Select Teacher</label>
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className={`w-full px-3 py-2 border rounded text-sm bg-white ${localErrors.teacher_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name} ({teacher.teacher_code || teacher.staff_id}) - {teacher.teacher_category_name || 'N/A'} - {teacher.specialization || 'No specialization'}
                </option>
              ))}
            </select>
            {localErrors.teacher_id && <p className="text-red-500 text-xs mt-1">{localErrors.teacher_id}</p>}
            
            {selectedTeacherDetails && (
              <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200 text-sm">
                <p className="font-bold text-purple-800 mb-1">Teacher Qualifications:</p>
                <p className="text-purple-700">• Category: {selectedTeacherDetails.teacher_category_name}</p>
                <p className="text-purple-700">• Specialization: {selectedTeacherDetails.specialization || 'Not specified'}</p>
                <p className="text-purple-700">• Highest Qualification: {selectedTeacherDetails.highest_qualification || 'Not specified'}</p>
              </div>
            )}
          </div>

          {/* Step 4: Additional Settings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Periods per Week</label>
              <input
                type="number"
                value={formData.periods_per_week}
                onChange={(e) => setFormData({ ...formData, periods_per_week: parseInt(e.target.value) || 0 })}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Year *</label>
              <select
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className={`w-full px-3 py-2 border rounded text-sm bg-white ${localErrors.academic_year ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Year</option>
                {academicYears.map(yr => (
                  <option key={yr.id} value={yr.year_code}>
                    {yr.year_code} {yr.is_current ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              {localErrors.academic_year && <p className="text-red-500 text-xs mt-1">{localErrors.academic_year}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="is_compulsory"
              checked={formData.is_compulsory}
              onChange={(e) => setFormData({ ...formData, is_compulsory: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_compulsory" className="text-sm text-gray-700">Compulsory Subject</label>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving && <ButtonSpinner />} {isEditMode ? 'Update Assignment' : 'Assign Teacher'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, assignment, deleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Confirm Removal</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        <div className="p-6">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-center text-gray-700">Are you sure you want to remove this teacher assignment?</p>
          {assignment && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
              {/* USE CLASS_NAME (the actual created name) directly */}
              <p><span className="font-bold">Class:</span> {assignment.class_name || assignment.class_display}</p>
              <p><span className="font-bold">Subject:</span> {assignment.subject_name}</p>
              <p><span className="font-bold">Teacher:</span> {assignment.teacher_name}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50">
            {deleting && <ButtonSpinner />} Remove Assignment
          </button>
        </div>
      </div>
    </div>
  );
};


function TeacherAssignment() {
  const { getAuthHeaders, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gradeLevelsInfo, setGradeLevelsInfo] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const abortControllers = useRef({});

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchWithTimeout = useCallback(async (url, options, timeout = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('Request timeout');
      throw error;
    }
  }, []);

  // ── Fetch helpers (now accept optional year) ──
  const fetchAcademicYears = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/academic-years/`, { headers: getAuthHeaders() });
      if (data?.success) {
        setAcademicYears(data.data);
        const current = data.data.find(y => y.is_current);
        const defaultYear = current ? current.year_code : (data.data[0]?.year_code || '');
        setAcademicYear(defaultYear);
        return defaultYear;
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
      setAcademicYears([]);
    }
    return '';
  };

  const fetchTeachers = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/qualified-teachers/`, { headers: getAuthHeaders() });
      if (data?.success) setTeachers(data.data || []);
    } catch (error) {
      setTeachers([]);
    }
  };

  const fetchClasses = async (year) => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/available-classes/?academic_year=${year}`, { headers: getAuthHeaders() });
      if (data?.success) setClasses(data.data || []);
    } catch (error) {
      setClasses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/subjects-by-grade/`, { headers: getAuthHeaders() });
      if (data?.success) setSubjects(data.data || []);
    } catch (error) {
      setSubjects([]);
    }
  };

  const fetchAssignments = async () => {
    if (!academicYear) return;
    try {
      let url = `${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/?academic_year=${academicYear}`;
      if (selectedGradeLevel !== 'all') url += `&grade_level=${selectedGradeLevel}`;
      if (selectedDepartment) url += `&department=${selectedDepartment}`;
      
      const data = await fetchWithTimeout(url, { headers: getAuthHeaders() });
      if (data?.success) setAssignments(data.data || []);
    } catch (error) {
      setAssignments([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/departments/`, { headers: getAuthHeaders() });
      if (data?.success) setDepartments(data.data || []);
    } catch (error) {
      setDepartments([]);
    }
  };

  const fetchGradeLevelsInfo = async () => {
    try {
      const data = await fetchWithTimeout(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/grade-levels-info/`, { headers: getAuthHeaders() });
      if (data?.success) setGradeLevelsInfo(data.data);
    } catch (error) { /* ignore */ }
  };

  // ── Main initialisation: fetch academic years first, then the rest ──
  const initializeData = async () => {
    setLoadingData(true);
    try {
      // 1️⃣ Get academic years and pick default
      const defaultYear = await fetchAcademicYears();
      // 2️⃣ Fetch remaining data in parallel (classes needs the year)
      await Promise.all([
        fetchTeachers(),
        fetchClasses(defaultYear || academicYear),   // use the year we just determined
        fetchSubjects(),
        fetchDepartments(),
        fetchGradeLevelsInfo(),
      ]);
      // assignments will be fetched by the effect below once academicYear state is set
    } catch (error) {
      addToast('error', 'Failed to load initial data');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      addToast('error', 'Please login to access teacher assignments');
      setLoadingData(false);
      return;
    }
    initializeData();
    return () => {
      Object.values(abortControllers.current).forEach(controller => controller.abort());
    };
  }, [isAuthenticated, authLoading]);

  // ── Fetch assignments whenever academicYear or filters change (no loadingData guard) ──
  useEffect(() => {
    if (academicYear && isAuthenticated) {
      fetchAssignments();
    }
  }, [academicYear, selectedGradeLevel, selectedDepartment]);

  // ── Handlers (CRUD) unchanged ──
  const handleCreateAssignment = async (formData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          class_id: formData.class_id,
          subject_id: formData.subject_id,
          teacher_id: formData.teacher_id,
          academic_year: formData.academic_year,
          periods_per_week: formData.periods_per_week,
          is_compulsory: formData.is_compulsory
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Teacher assigned successfully');
        setShowAssignmentModal(false);
        fetchAssignments();   // refresh list
      } else {
        addToast('error', data.message || 'Failed to assign teacher');
      }
    } catch (error) {
      addToast('error', 'Network error - could not create assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAssignment = async (formData) => {
    setSaving(true);
    const { id, class_id, subject_id, teacher_id, periods_per_week, is_compulsory, academic_year, original_class_id, original_subject_id } = formData;
    if (class_id !== original_class_id || subject_id !== original_subject_id) {
      try {
        const delRes = await fetch(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/${id}/delete/`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const delData = await delRes.json();
        if (!delData.success) {
          addToast('error', delData.message || 'Failed to update assignment (delete step failed)');
          setSaving(false);
          return;
        }
        const createRes = await fetch(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/create/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ class_id, subject_id, teacher_id, academic_year, periods_per_week, is_compulsory })
        });
        const createData = await createRes.json();
        if (createData.success) {
          addToast('success', 'Assignment updated successfully');
          setShowAssignmentModal(false);
          setEditingAssignment(null);
          fetchAssignments();
        } else {
          addToast('error', createData.message || 'Failed to create new assignment after deleting');
        }
      } catch (error) {
        addToast('error', 'Network error during update');
      } finally {
        setSaving(false);
      }
      return;
    }
    // Plain update
    try {
      const response = await fetch(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/${id}/update/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ teacher_id, periods_per_week, is_compulsory, academic_year })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assignment updated successfully');
        setShowAssignmentModal(false);
        setEditingAssignment(null);
        fetchAssignments();
      } else {
        addToast('error', data.message || 'Failed to update assignment');
      }
    } catch (error) {
      addToast('error', 'Network error - could not update assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!selectedAssignment) return;
    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/deputyadmin/teacher-assignments/assignments/${selectedAssignment.id}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Assignment removed successfully');
        setShowDeleteModal(false);
        setSelectedAssignment(null);
        fetchAssignments();
      } else {
        addToast('error', data.message || 'Failed to remove assignment');
      }
    } catch (error) {
      addToast('error', 'Network error - could not delete assignment');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleModalSave = (formData) => {
    if (formData.id) {
      handleUpdateAssignment(formData);
    } else {
      handleCreateAssignment(formData);
    }
  };

  const handleModalClose = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  // ── Filtering & Pagination ──
  const filteredAssignments = useMemo(() => {
    if (!searchTerm) return assignments;
    const term = searchTerm.toLowerCase();
    return assignments.filter(a =>
      (a.class_name || '').toLowerCase().includes(term) ||
      (a.class_display || '').toLowerCase().includes(term) ||
      (a.subject_name || '').toLowerCase().includes(term) ||
      (a.teacher_name || '').toLowerCase().includes(term) ||
      (a.teacher_specialization || '').toLowerCase().includes(term)
    );
  }, [assignments, searchTerm]);

  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAssignments.slice(start, start + itemsPerPage);
  }, [filteredAssignments, currentPage]);

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  // ── Render ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-green-700 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access teacher assignments</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium rounded hover:bg-green-800">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}

      {loadingData && <GlobalSpinner />}

      {/* Header (unchanged) */}
      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Teacher-Class Assignment</h1>
            <p className="text-green-100 mt-1">Assign qualified teachers to classes based on specialization and department</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAssignmentModal(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded border border-blue-700 hover:bg-blue-700">
              <Plus className="h-4 w-4 inline mr-2" /> New Assignment
            </button>
            <button onClick={initializeData} disabled={loadingData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded border border-blue-700 hover:bg-blue-700 disabled:opacity-50">
              <RefreshCw className="h-4 w-4 inline mr-2" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Grade Level Info Cards (unchanged) */}
        {gradeLevelsInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><GraduationCap className="h-5 w-5 text-green-700" /></div>
                <div><h3 className="font-bold text-gray-900">Early Years</h3><p className="text-xs text-gray-500">PP1 - PP2</p></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Teachers with PP category qualification</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><School className="h-5 w-5 text-blue-700" /></div>
                <div><h3 className="font-bold text-gray-900">Primary</h3><p className="text-xs text-gray-500">Grade 1 - Grade 6</p></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Teachers with EP or PP category qualification</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Target className="h-5 w-5 text-purple-700" /></div>
                <div><h3 className="font-bold text-gray-900">Junior Secondary</h3><p className="text-xs text-gray-500">Grade 7 - Grade 9</p></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Teachers with JSS category qualification</p>
            </div>
          </div>
        )}

        {/* Filters Bar (unchanged, except that the Apply button now calls fetchAssignments directly) */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Grade Level</label>
              <select value={selectedGradeLevel} onChange={(e) => setSelectedGradeLevel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="all">All Levels</option>
                <option value="early">Early Years (PP1-PP2)</option>
                <option value="primary">Primary (G1-G6)</option>
                <option value="junior">Junior Secondary (G7-G9)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="">All Departments</option>
                {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Academic Year</label>
              <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                {academicYears.map(yr => (
                  <option key={yr.id} value={yr.year_code}>{yr.year_code} {yr.is_current ? '(Current)' : ''}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => { setCurrentPage(1); fetchAssignments(); }} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
              <Filter className="h-4 w-4 inline mr-1" /> Apply Filters
            </button>
          </div>
        </div>

        {/* Assignments Table (unchanged) */}
        {loadingData ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center"><Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" /><p className="mt-4 text-gray-600">Loading assignments...</p></div>
        ) : paginatedAssignments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-600">No teacher assignments found</p>
            <button onClick={() => setShowAssignmentModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
              <Plus className="h-4 w-4 inline mr-1" /> Create First Assignment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Class & Stream</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Teacher & Specialization</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Periods/Week</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssignments.map(assignment => (
                  <tr key={assignment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{assignment.class_name || assignment.class_display}</div>
                      <div className="text-xs text-gray-500">{assignment.stream ? `Stream: ${assignment.stream}` : 'No stream'}</div>
                      <div className="text-xs text-gray-400 mt-1">Grade Level: {assignment.class_numeric_level}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <SubjectIcon subjectName={assignment.subject_name} />
                        <span className="font-medium text-gray-900">{assignment.subject_name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{assignment.subject_code}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{assignment.teacher_name || 'Not Assigned'}</div>
                      <div className="text-xs text-gray-600">{assignment.teacher_code}</div>
                      <div className="text-xs text-purple-600 mt-1">{assignment.teacher_specialization && `Specialization: ${assignment.teacher_specialization}`}</div>
                      <div className="text-xs text-blue-600">{assignment.teacher_category && `Category: ${assignment.teacher_category}`}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{assignment.periods_per_week} periods</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded ${assignment.is_compulsory ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {assignment.is_compulsory ? 'Compulsory' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEditClick(assignment)} className="text-blue-600 hover:text-blue-800" title="Edit Assignment">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setSelectedAssignment(assignment); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800" title="Remove Assignment">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (unchanged) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Summary Stats (unchanged) */}
        {assignments.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-600 flex justify-between items-center flex-wrap gap-2">
            <span>Total Assignments: {assignments.length}</span>
            <div className="flex gap-4">
              <span><span className="font-bold">{classes.length}</span> Classes</span>
              <span><span className="font-bold">{teachers.filter(t => t.teacher_category_name !== 'N/A').length}</span> Teachers</span>
              <span><span className="font-bold">{subjects.length}</span> Subjects</span>
            </div>
          </div>
        )}
      </div>

      {/* Modals (unchanged) */}
      {showAssignmentModal && (
        <AssignmentModal 
          isOpen={showAssignmentModal}
          onClose={handleModalClose}
          onSave={handleModalSave}
          classes={classes}
          subjects={subjects}
          teachers={teachers}
          academicYears={academicYears}
          saving={saving}
          editData={editingAssignment}
        />
      )}
      
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => { setShowDeleteModal(false); setSelectedAssignment(null); }} 
        onConfirm={handleDeleteAssignment} 
        assignment={selectedAssignment} 
        deleting={deleting} 
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight { 
            from { transform: translateX(100%); opacity: 0; } 
            to { transform: translateX(0); opacity: 1; } 
          }
          .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        `
      }} />
    </div>
  );
}

export default TeacherAssignment;