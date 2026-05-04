/* eslint-disable no-unused-vars */
// StaffManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Plus, Search, Edit2, Trash2, UserPlus, RefreshCw, Phone, Mail,
  Briefcase, UserCheck, UserX, Save, AlertCircle, Loader2, CheckCircle,
  Info, User, Calendar, Building, MapPin, IdCard, GraduationCap,
  Users, BookOpen, Target, ChevronLeft, ChevronRight, Award, Heart,
  X, Eye, Download, Filter, ChevronDown, Layers, Zap, Shield, Globe, Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  
  const bgColors = { success: 'border-l-green-600', error: 'border-l-red-600', info: 'border-l-blue-600' };
  const icons = { success: <CheckCircle className="h-5 w-5 text-green-600" />, error: <AlertCircle className="h-5 w-5 text-red-600" />, info: <Info className="h-5 w-5 text-blue-600" /> };
  
  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border-l-4 ${bgColors[type]} border border-gray-300 shadow-lg p-4 min-w-[320px] animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information'}</p>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-700" /></div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100"><h3 className="text-md font-bold text-gray-900">{title}</h3></div>
        <div className="p-6"><p className="text-sm text-gray-800">{message}</p></div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}{confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const { getAuthHeaders, isAuthenticated, user } = useAuth();
  
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [jssDepartments, setJssDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDepartmentAssignment, setShowDepartmentAssignment] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [formMode, setFormMode] = useState('create');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  
  const [stats, setStats] = useState({
    total: 0, active: 0, onLeave: 0,
    jss: 0, primary: 0, earlyYears: 0,
    stem: 0, humanities: 0, languages: 0, technical: 0
  });
  
  // Form Data - NO EMERGENCY CONTACT FIELDS
  const [formData, setFormData] = useState({
    first_name: '', middle_name: '', last_name: '', date_of_birth: '', gender: 'Male',
    national_id: '', personal_email: '', personal_phone: '', permanent_address: '',
    employment_type: 'Permanent', employment_date: new Date().toISOString().split('T')[0], 
    contract_end_date: '', designation: '', teacher_category: '', jss_department: '',
    assigned_grade_level: '', admin_department: '', highest_qualification: '',
    specialization: ''
  });
  
  const [deptAssignment, setDeptAssignment] = useState({
    department_id: '', role: 'member', teaching_subjects: [], is_primary: true
  });
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(typeof data.error === 'object' ? JSON.stringify(data.error) : (data.error || 'Request failed'));
    }
    
    return data;
  }, [getAuthHeaders]);
  
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
      params.append('page', pagination.page);
      params.append('page_size', pagination.pageSize);
      
      const data = await apiRequest(`/api/hr/staff/?${params}`);
      
      if (data.success) {
        setStaff(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.total_pages || 0
        }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to load staff', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiRequest, pagination.page, pagination.pageSize, searchTerm, selectedCategory, selectedDepartment]);
  
  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest('/api/hr/staff/stats/');
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [apiRequest]);
  
  const fetchLookupData = useCallback(async () => {
    try {
      const [categoriesRes, departmentsRes, gradeLevelsRes, jssDeptsRes] = await Promise.all([
        apiRequest('/api/hr/teacher-categories/'),
        apiRequest('/api/hr/departments/'),
        apiRequest('/api/hr/grade-levels/'),
        apiRequest('/api/hr/jss-departments/')
      ]);
      
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (departmentsRes.success) setDepartments(departmentsRes.data);
      if (gradeLevelsRes.success) setGradeLevels(gradeLevelsRes.data);
      if (jssDeptsRes.success) setJssDepartments(jssDeptsRes.data);
    } catch (err) {
      console.error('Error fetching lookup data:', err);
      showToast('Failed to load form data', 'error');
    }
  }, [apiRequest]);
  
  const fetchStaffAssignments = async (staffId) => {
    try {
      const data = await apiRequest(`/api/hr/staff/${staffId}/assignments/`);
      if (data.success && selectedStaff) {
        setSelectedStaff(prev => ({ ...prev, department_assignments: data.data }));
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };
  
  const handleAssignDepartment = async () => {
    if (!deptAssignment.department_id) {
      showToast('Please select a department', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/${selectedStaff.id}/assign-department/`, {
        method: 'POST',
        body: JSON.stringify(deptAssignment)
      });
      
      if (data.success) {
        showToast(`Staff assigned to ${data.data.department_name} successfully`, 'success');
        setShowDepartmentAssignment(false);
        await fetchStaffAssignments(selectedStaff.id);
        setDeptAssignment({ department_id: '', role: 'member', teaching_subjects: [], is_primary: true });
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign department', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRemoveAssignment = async (assignmentId) => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/assignments/${assignmentId}/remove/`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        showToast('Department assignment removed', 'success');
        await fetchStaffAssignments(selectedStaff.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSetPrimary = async (assignmentId) => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/assignments/${assignmentId}/set-primary/`, {
        method: 'PUT'
      });
      
      if (data.success) {
        showToast('Primary department updated', 'success');
        await fetchStaffAssignments(selectedStaff.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update primary department', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name required';
    if (!formData.last_name) newErrors.last_name = 'Last name required';
    if (!formData.personal_email) newErrors.personal_email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.personal_email)) newErrors.personal_email = 'Invalid email';
    if (!formData.personal_phone) newErrors.personal_phone = 'Phone required';
    if (!formData.national_id) newErrors.national_id = 'National ID required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth required';
    if (!formData.designation) newErrors.designation = 'Designation required';
    if (!formData.teacher_category) newErrors.teacher_category = 'Teacher category required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const resetForm = () => {
    setFormData({
      first_name: '', middle_name: '', last_name: '', date_of_birth: '', gender: 'Male',
      national_id: '', personal_email: '', personal_phone: '', permanent_address: '',
      employment_type: 'Permanent', employment_date: new Date().toISOString().split('T')[0],
      contract_end_date: '', designation: '', teacher_category: '', jss_department: '',
      assigned_grade_level: '', admin_department: '', highest_qualification: '',
      specialization: ''
    });
    setErrors({});
    setSelectedStaff(null);
    setFormMode('create');
  };
  
  const handleCreateStaff = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/hr/staff/create/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (data.success) {
        showToast(`Staff ${data.data.first_name} ${data.data.last_name} created successfully`, 'success');
        setShowForm(false);
        resetForm();
        fetchStaff();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateStaff = async () => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/update/${selectedStaff.id}/`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      if (data.success) {
        showToast('Staff updated successfully', 'success');
        setShowForm(false);
        resetForm();
        fetchStaff();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteStaff = async () => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/delete/${deleteConfirm.id}/`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        showToast(`Staff ${deleteConfirm.name} deleted`, 'success');
        fetchStaff();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete staff', 'error');
    } finally {
      setSubmitting(false);
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };
  
  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormMode('edit');
    setFormData({
      first_name: staffMember.first_name || '',
      middle_name: staffMember.middle_name || '',
      last_name: staffMember.last_name || '',
      date_of_birth: staffMember.date_of_birth || '',
      gender: staffMember.gender || 'Male',
      national_id: staffMember.national_id || '',
      personal_email: staffMember.personal_email || '',
      personal_phone: staffMember.personal_phone || '',
      permanent_address: staffMember.permanent_address || '',
      employment_type: staffMember.employment_type || 'Permanent',
      employment_date: staffMember.employment_date || '',
      contract_end_date: staffMember.contract_end_date || '',
      designation: staffMember.designation || '',
      teacher_category: staffMember.teacher_category?.id || '',
      jss_department: staffMember.jss_department?.id || '',
      assigned_grade_level: staffMember.assigned_grade_level?.id || '',
      admin_department: staffMember.admin_department?.id || '',
      highest_qualification: staffMember.highest_qualification || '',
      specialization: staffMember.specialization || '',
    });
    setShowForm(true);
  };
  
  const handleViewDetails = async (staffMember) => {
    try {
      const data = await apiRequest(`/api/hr/staff/${staffMember.id}/`);
      if (data.success) {
        setSelectedStaff(data.data);
        await fetchStaffAssignments(staffMember.id);
        setShowDetails(true);
      }
    } catch (err) {
      showToast('Failed to load staff details', 'error');
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchStaff();
      fetchStats();
      fetchLookupData();
    }
  }, [fetchLookupData, fetchStaff, fetchStats, isAuthenticated]);
  
  const getCategoryBadge = (category) => {
    const styles = {
      JSS: 'bg-purple-100 text-purple-800 border-purple-200',
      EP: 'bg-blue-100 text-blue-800 border-blue-200',
      PP: 'bg-green-100 text-green-800 border-green-200'
    };
    const code = category?.code || '';
    return styles[code] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access staff management</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">Go to Login</a>
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
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
      
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}
      
      <ConfirmModal 
        isOpen={deleteConfirm.isOpen} 
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteStaff} 
        title="Delete Staff Member" 
        message={`Delete ${deleteConfirm.name}? This cannot be undone.`} 
        loading={submitting} 
      />
      
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Staff Management</h1>
            <p className="text-green-100 mt-1">Manage teachers and administrative staff with department mapping for the 2026 curriculum</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add Staff
            </button>
            <button onClick={() => { fetchStaff(); fetchStats(); }} className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Total Staff</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-2xl font-bold text-green-700">{stats.active}</p><p className="text-xs text-gray-500">Active</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-2xl font-bold text-purple-700">{stats.jss}</p><p className="text-xs text-gray-500">JSS Teachers</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-2xl font-bold text-blue-700">{stats.primary}</p><p className="text-xs text-gray-500">Primary</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-2xl font-bold text-green-700">{stats.earlyYears}</p><p className="text-xs text-gray-500">Early Years</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-xl font-bold text-orange-700">{stats.stem}</p><p className="text-xs text-gray-500">STEM Dept</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-xl font-bold text-teal-700">{stats.humanities}</p><p className="text-xs text-gray-500">Humanities</p></div>
          <div className="bg-white border border-gray-300 p-4 text-center"><p className="text-xl font-bold text-pink-700">{stats.languages}</p><p className="text-xs text-gray-500">Languages</p></div>
        </div>
      </div>
      
      <div className="px-6 mb-6">
        <div className="bg-white border border-gray-300 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search by name, email, staff ID, or teacher code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm bg-white" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-400 text-sm bg-white min-w-[160px]">
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.code}>{cat.code} - {cat.name}</option>)}
            </select>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-4 py-2 border border-gray-400 text-sm bg-white min-w-[180px]">
              <option value="all">All Departments</option>
              {departments.filter(d => d.department_type === 'Academic').map(dept => <option key={dept.id} value={dept.id}>{dept.department_name}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="bg-white border border-gray-300 overflow-hidden">
          {loading ? <LoadingSpinner /> : staff.length === 0 ? (
            <div className="text-center py-12"><UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No staff members found</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Staff</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Primary Dept</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{member.full_name}</div>
                        <div className="text-xs text-gray-500">{member.designation || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3"><code className="text-sm font-mono font-bold text-green-700">{member.teacher_code || member.staff_id}</code></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getCategoryBadge({ code: member.teacher_category_code })}`}>{member.teacher_category_code || 'N/A'}</span></td>
                      <td className="px-4 py-3">{member.primary_department ? <span className="text-sm">{member.primary_department}</span> : <span className="text-gray-400 text-xs">Not assigned</span>}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-xs mb-1"><Mail className="h-3 w-3 mr-1 text-gray-400" />{member.personal_email?.split('@')[0]}@...</div>
                        <div className="flex items-center text-xs"><Phone className="h-3 w-3 mr-1 text-gray-400" />{member.personal_phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium border ${member.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleViewDetails(member)} className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700" title="View"><Eye className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleEdit(member)} className="p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeleteConfirm({ isOpen: true, id: member.id, name: member.full_name })} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-300 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries</div>
              <div className="flex gap-2">
                <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 1} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><ChevronLeft className="h-4 w-4" /></button>
                <span className="px-3 py-1 text-sm bg-gray-100 border border-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={pagination.page === pagination.totalPages} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Staff Form Modal - WITHOUT Emergency Contact Fields */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">{formMode === 'create' ? 'Add New Staff Member' : 'Edit Staff Member'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); formMode === 'create' ? handleCreateStaff() : handleUpdateStaff(); }}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label><input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className={`w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Last Name *</label><input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className={`w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Middle Name</label><input type="text" value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Email *</label><input type="email" value={formData.personal_email} onChange={(e) => setFormData({...formData, personal_email: e.target.value})} className={`w-full px-3 py-2 border ${errors.personal_email ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.personal_email && <p className="text-xs text-red-500 mt-1">{errors.personal_email}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label><input type="tel" value={formData.personal_phone} onChange={(e) => setFormData({...formData, personal_phone: e.target.value})} className={`w-full px-3 py-2 border ${errors.personal_phone ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.personal_phone && <p className="text-xs text-red-500 mt-1">{errors.personal_phone}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">National ID *</label><input type="text" value={formData.national_id} onChange={(e) => setFormData({...formData, national_id: e.target.value})} className={`w-full px-3 py-2 border ${errors.national_id ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.national_id && <p className="text-xs text-red-500 mt-1">{errors.national_id}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth *</label><input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className={`w-full px-3 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} />{errors.date_of_birth && <p className="text-xs text-red-500 mt-1">{errors.date_of_birth}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option>Male</option><option>Female</option></select></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Designation *</label><input type="text" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className={`w-full px-3 py-2 border ${errors.designation ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`} placeholder="e.g., Senior Teacher, HOD" />{errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation}</p>}</div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Teacher Category *</label>
                    <select value={formData.teacher_category} onChange={(e) => { const catId = e.target.value; setFormData({ ...formData, teacher_category: catId, jss_department: '', assigned_grade_level: '' }); }} className={`w-full px-3 py-2 border ${errors.teacher_category ? 'border-red-500' : 'border-gray-400'} text-sm bg-white`}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.code} - {cat.name}</option>)}
                    </select>
                    {errors.teacher_category && <p className="text-xs text-red-500 mt-1">{errors.teacher_category}</p>}
                  </div>
                  
                  {formData.teacher_category && categories.find(c => c.id === formData.teacher_category)?.code === 'JSS' && (
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">JSS Department</label>
                      <select value={formData.jss_department} onChange={(e) => setFormData({...formData, jss_department: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                        <option value="">Select Department</option>
                        {jssDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                      </select>
                    </div>
                  )}
                  
                  {formData.teacher_category && ['PP', 'EP'].includes(categories.find(c => c.id === formData.teacher_category)?.code) && (
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Assigned Grade Level</label>
                      <select value={formData.assigned_grade_level} onChange={(e) => setFormData({...formData, assigned_grade_level: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                        <option value="">Select Grade Level</option>
                        {gradeLevels.map(grade => <option key={grade.id} value={grade.id}>{grade.name}</option>)}
                      </select>
                    </div>
                  )}
                  
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Employment Type</label><select value={formData.employment_type} onChange={(e) => setFormData({...formData, employment_type: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option>Permanent</option><option>Contract</option><option>Probation</option><option>Part-time</option><option>Intern</option></select></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Employment Date</label><input type="date" value={formData.employment_date} onChange={(e) => setFormData({...formData, employment_date: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Contract End Date</label><input type="date" value={formData.contract_end_date} onChange={(e) => setFormData({...formData, contract_end_date: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Highest Qualification</label><input type="text" value={formData.highest_qualification} onChange={(e) => setFormData({...formData, highest_qualification: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Specialization</label><input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1">Address</label><textarea value={formData.permanent_address} onChange={(e) => setFormData({...formData, permanent_address: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}{formMode === 'create' ? 'Create Staff' : 'Update Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Staff Details Modal */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDetails(false)}>
          <div className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">Staff Profile: {selectedStaff.full_name}</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-300">
                <div className="h-16 w-16 bg-green-100 border border-green-300 rounded-full flex items-center justify-center"><span className="text-xl font-bold text-green-700">{selectedStaff.first_name?.[0]}{selectedStaff.last_name?.[0]}</span></div>
                <div><h2 className="text-xl font-bold text-gray-900">{selectedStaff.full_name}</h2><div className="flex gap-3 mt-1"><code className="text-sm font-mono text-green-700">{selectedStaff.teacher_code || selectedStaff.staff_id}</code><span className={`px-2 py-0.5 text-xs font-medium border ${selectedStaff.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>{selectedStaff.status}</span></div></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1"><User className="h-4 w-4" /> Personal</h4><div className="space-y-1 text-sm"><p><span className="text-gray-500">Email:</span> {selectedStaff.personal_email}</p><p><span className="text-gray-500">Phone:</span> {selectedStaff.personal_phone}</p><p><span className="text-gray-500">National ID:</span> {selectedStaff.national_id}</p><p><span className="text-gray-500">DOB:</span> {selectedStaff.date_of_birth}</p></div></div>
                  <div><h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1"><Briefcase className="h-4 w-4" /> Employment</h4><div className="space-y-1 text-sm"><p><span className="text-gray-500">Type:</span> {selectedStaff.employment_type}</p><p><span className="text-gray-500">Designation:</span> {selectedStaff.designation}</p><p><span className="text-gray-500">Started:</span> {selectedStaff.employment_date}</p></div></div>
                  <div><h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1"><Target className="h-4 w-4" /> CBE Category</h4><div className="space-y-1 text-sm"><p><span className="text-gray-500">Category:</span> {selectedStaff.teacher_category?.code} - {selectedStaff.teacher_category?.name}</p><p><span className="text-gray-500">Teacher Code:</span> <code className="font-mono">{selectedStaff.teacher_code}</code></p>{selectedStaff.jss_department && <p><span className="text-gray-500">JSS Dept:</span> {selectedStaff.jss_department.name}</p>}{selectedStaff.assigned_grade_level && <p><span className="text-gray-500">Grade Level:</span> {selectedStaff.assigned_grade_level.name}</p>}</div></div>
                  <div><h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1"><Award className="h-4 w-4" /> Qualifications</h4><div className="space-y-1 text-sm"><p><span className="text-gray-500">Highest:</span> {selectedStaff.highest_qualification || 'N/A'}</p><p><span className="text-gray-500">Specialization:</span> {selectedStaff.specialization || 'N/A'}</p></div></div>
                </div>
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Building className="h-4 w-4" /> Department Assignments</h4>
                  <button onClick={() => { setDeptAssignment({ department_id: '', role: 'member', teaching_subjects: [], is_primary: true }); setShowDepartmentAssignment(true); }} className="mb-3 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 flex items-center gap-1"><Plus className="h-3 w-3" /> Assign Department</button>
                  {!selectedStaff.department_assignments?.length ? <p className="text-sm text-gray-500 text-center py-4">No department assignments yet</p> : selectedStaff.department_assignments.map(assignment => (
                    <div key={assignment.id} className="bg-gray-50 border border-gray-300 p-3 mb-2 flex justify-between items-center">
                      <div><div className="flex items-center gap-2"><span className="font-bold text-gray-900">{assignment.department_name}</span>{assignment.is_primary && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium border border-green-200">Primary</span>}<span className={`px-2 py-0.5 text-xs font-medium border ${assignment.role === 'head' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>{assignment.role === 'head' ? 'HOD' : assignment.role === 'deputy_head' ? 'Deputy HOD' : 'Member'}</span></div></div>
                      <div className="flex gap-2">{!assignment.is_primary && <button onClick={() => handleSetPrimary(assignment.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Set as Primary"><Star className="h-3.5 w-3.5" /></button>}<button onClick={() => handleRemoveAssignment(assignment.id)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Remove"><Trash2 className="h-3.5 w-3.5" /></button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end"><button onClick={() => setShowDetails(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button></div>
          </div>
        </div>
      )}
      
      {/* Department Assignment Modal */}
      {showDepartmentAssignment && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDepartmentAssignment(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center"><h3 className="text-md font-bold text-gray-900">Assign to Department</h3><button onClick={() => setShowDepartmentAssignment(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Department *</label><select value={deptAssignment.department_id} onChange={(e) => setDeptAssignment({...deptAssignment, department_id: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Department</option>{departments.filter(d => d.department_type === 'Academic').map(dept => <option key={dept.id} value={dept.id}>{dept.department_name}</option>)}</select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Role</label><select value={deptAssignment.role} onChange={(e) => setDeptAssignment({...deptAssignment, role: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="member">Member</option><option value="deputy_head">Deputy Head of Department</option><option value="head">Head of Department</option></select></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="is_primary" checked={deptAssignment.is_primary} onChange={(e) => setDeptAssignment({...deptAssignment, is_primary: e.target.checked})} className="h-4 w-4 text-green-600 border-gray-300" /><label htmlFor="is_primary" className="text-sm text-gray-700">Set as primary department</label></div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3"><button onClick={() => setShowDepartmentAssignment(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button><button onClick={handleAssignDepartment} disabled={submitting} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Assign</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
