/* eslint-disable no-unused-vars */
// DepartmentManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Plus, Search, Edit2, Trash2, RefreshCw, Save, AlertCircle, Loader2,
  CheckCircle, Info, X, Eye, Users, BookOpen, Target, Award, Building,
  ChevronDown, Filter, Shield, Globe, Heart, Briefcase, Calendar, UserCheck, Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Component
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

// Department Card Component for Drag-and-Drop Interface
const DepartmentCard = ({ department, onAssign, onViewDetails, onRemoveStaff, onSetPrimary }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const staffData = JSON.parse(e.dataTransfer.getData('application/json'));
      onAssign(staffData, department);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };
  
  return (
    <div 
      className={`bg-white border-2 transition-all ${isDragOver ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-lg overflow-hidden`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-300 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900">{department.department_name}</h3>
          <p className="text-xs text-gray-500">{department.department_code}</p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium border border-green-200 rounded-full">
          {department.staff_count || department.staff_assignments?.length || 0} Members
        </span>
      </div>
      
      <div className="p-3 max-h-64 overflow-y-auto">
        {!department.staff_assignments || department.staff_assignments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">Drop staff here to assign</p>
        ) : (
          <div className="space-y-2">
            {department.staff_assignments.map(assignment => (
              <div 
                key={assignment.id} 
                className="bg-gray-50 border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => onViewDetails(assignment.staff || assignment)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {assignment.staff?.first_name || assignment.first_name} {assignment.staff?.last_name || assignment.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{assignment.staff?.designation || assignment.designation}</p>
                    {assignment.teaching_subjects && assignment.teaching_subjects.length > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Subjects: {assignment.teaching_subjects.slice(0, 2).map(s => s.area_name).join(', ')}
                        {assignment.teaching_subjects.length > 2 && '...'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-1.5 py-0.5 text-xs font-medium border rounded ${assignment.role === 'head' ? 'bg-purple-100 text-purple-800 border-purple-200' : assignment.role === 'deputy_head' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {assignment.role === 'head' ? 'HOD' : assignment.role === 'deputy_head' ? 'Deputy' : 'Member'}
                    </span>
                    {assignment.is_primary && <span className="text-xs text-green-600">Primary</span>}
                    <div className="flex gap-1 mt-1">
                      {!assignment.is_primary && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onSetPrimary(assignment.id, assignment.staff?.first_name); }}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Set as Primary"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveStaff(assignment.id, assignment.staff?.first_name, department.department_name); }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remove from Department"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-between text-xs">
        <button onClick={() => onViewDetails(department)} className="text-blue-600 hover:text-blue-800">View Details</button>
        <span className="text-gray-400">Drop zone active</span>
      </div>
    </div>
  );
};

// Staff Draggable Item
const DraggableStaffItem = ({ staff, onDragStart }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(staff));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(staff);
  };
  
  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="bg-white border border-gray-300 p-3 rounded-lg cursor-move hover:shadow-md transition-shadow hover:border-green-400"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-green-700">{staff.first_name?.[0]}{staff.last_name?.[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{staff.first_name} {staff.last_name}</p>
          <p className="text-xs text-gray-500 truncate">{staff.designation}</p>
          <p className="text-xs font-mono text-green-600">{staff.teacher_code}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-1.5 py-0.5 text-xs font-medium border rounded ${
            staff.teacher_category_code === 'JSS' ? 'bg-purple-100 text-purple-800 border-purple-200' : 
            staff.teacher_category_code === 'EP' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
            'bg-green-100 text-green-800 border-green-200'
          }`}>
            {staff.teacher_category_code || 'N/A'}
          </span>
          {staff.primary_department && <span className="text-xs text-gray-400 mt-1">{staff.primary_department}</span>}
        </div>
      </div>
    </div>
  );
};

// Main Component
const DepartmentManagement = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [departments, setDepartments] = useState([]);
  const [unassignedStaff, setUnassignedStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [formMode, setFormMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [dragStaff, setDragStaff] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    department_code: '', department_name: '', department_type: 'Academic', description: '', is_active: true
  });
  
  const [errors, setErrors] = useState({});
  
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  
  // API Request Helper
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
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }, [getAuthHeaders]);
  
  // Fetch Departments with Staff Assignments
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      
      const data = await apiRequest(`/api/hr/departments/?${params}`);
      
      if (data.success) {
        setDepartments(data.data || []);
      }
    } catch (err) {
      showToast('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiRequest, selectedType]);
  
  // Fetch Unassigned Staff
  const fetchUnassignedStaff = useCallback(async () => {
    try {
      const data = await apiRequest('/api/hr/staff/unassigned/');
      if (data.success) {
        setUnassignedStaff(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching unassigned staff:', err);
    }
  }, [apiRequest]);
  
  // Create Department
  const handleCreateDepartment = async () => {
    if (!formData.department_code || !formData.department_name) {
      showToast('Department code and name are required', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/hr/departments/create/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (data.success) {
        showToast(`Department ${data.data.department_name} created successfully`, 'success');
        setShowForm(false);
        resetForm();
        fetchDepartments();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create department', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Update Department
  const handleUpdateDepartment = async () => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/departments/update/${selectedDepartment.id}/`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      if (data.success) {
        showToast('Department updated successfully', 'success');
        setShowForm(false);
        resetForm();
        fetchDepartments();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update department', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Delete Department
  const handleDeleteDepartment = async () => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/departments/delete/${deleteConfirm.id}/`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        showToast(`Department ${deleteConfirm.name} deleted`, 'success');
        fetchDepartments();
        fetchUnassignedStaff();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete department', 'error');
    } finally {
      setSubmitting(false);
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };
  
  // Assign Staff to Department via Drop
  const handleAssignStaff = async (staff, department) => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/${staff.id}/assign-department/`, {
        method: 'POST',
        body: JSON.stringify({
          department_id: department.id,
          role: 'member',
          is_primary: department.staff_assignments?.length === 0
        })
      });
      
      if (data.success) {
        showToast(`${staff.first_name} ${staff.last_name} assigned to ${department.department_name}`, 'success');
        fetchDepartments();
        fetchUnassignedStaff();
      } else {
        showToast(data.error || 'Assignment failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Remove Staff from Department
  const handleRemoveFromDepartment = async (assignmentId, staffName, deptName) => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/assignments/${assignmentId}/remove/`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        showToast(`${staffName} removed from ${deptName}`, 'success');
        fetchDepartments();
        fetchUnassignedStaff();
      } else {
        showToast(data.error || 'Failed to remove', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Set Primary Department
  const handleSetPrimary = async (assignmentId, staffName) => {
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/hr/staff/assignments/${assignmentId}/set-primary/`, {
        method: 'PUT'
      });
      
      if (data.success) {
        showToast(`${staffName}'s primary department updated`, 'success');
        fetchDepartments();
      } else {
        showToast(data.error || 'Failed to update', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update primary department', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData({ department_code: '', department_name: '', department_type: 'Academic', description: '', is_active: true });
    setErrors({});
    setSelectedDepartment(null);
    setFormMode('create');
  };
  
  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setFormMode('edit');
    setFormData({
      department_code: dept.department_code || '',
      department_name: dept.department_name || '',
      department_type: dept.department_type || 'Academic',
      description: dept.description || '',
      is_active: dept.is_active !== undefined ? dept.is_active : true
    });
    setShowForm(true);
  };
  
  const handleViewDepartment = (dept) => {
    setSelectedDepartment(dept);
    setShowDepartmentDetails(true);
  };
  
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowStaffDetails(true);
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments();
      fetchUnassignedStaff();
    }
  }, [isAuthenticated, fetchDepartments, fetchUnassignedStaff]);
  
  // Filter unassigned staff by search
  const filteredUnassignedStaff = unassignedStaff.filter(staff => 
    `${staff.first_name} ${staff.last_name} ${staff.teacher_code} ${staff.designation}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Department type colors
  const getTypeBadge = (type) => {
    const colors = {
      Academic: 'bg-blue-100 text-blue-800 border-blue-200',
      Sports: 'bg-green-100 text-green-800 border-green-200',
      Administrative: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access department management</p>
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
        onConfirm={handleDeleteDepartment} 
        title="Delete Department" 
        message={`Delete "${deleteConfirm.name}"? This will remove all staff assignments.`} 
        loading={submitting} 
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Department Management</h1>
            <p className="text-green-100 mt-1">Map staff to academic departments following the 2026 rationalized curriculum</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Department
            </button>
            <button onClick={() => { fetchDepartments(); fetchUnassignedStaff(); }} className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Department Type Filter */}
      <div className="px-6 mb-6">
        <div className="bg-white border border-gray-300 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search staff to assign..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm bg-white"
              />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-2 border border-gray-400 text-sm bg-white min-w-[160px]">
              <option value="all">All Departments</option>
              <option value="Academic">Academic Departments</option>
              <option value="Sports">Sports Departments</option>
              <option value="Administrative">Administrative Departments</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1"><Info className="h-3 w-3" /> Drag and drop staff cards onto department cards to assign them</p>
        </div>
      </div>
      
      {/* Drag-and-Drop Interface */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Unassigned Staff */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-300">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users className="h-4 w-4" /> Unassigned Staff</h3>
                <p className="text-xs text-gray-500">Drag cards to assign to departments</p>
              </div>
              <div className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading ? (
                  <LoadingSpinner />
                ) : filteredUnassignedStaff.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No unassigned staff found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredUnassignedStaff.map(staff => (
                      <DraggableStaffItem key={staff.id} staff={staff} onDragStart={setDragStaff} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Department Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : departments.length === 0 ? (
              <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No departments found. Click "Add Department" to create one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map(dept => (
                  <DepartmentCard 
                    key={dept.id} 
                    department={dept} 
                    onAssign={handleAssignStaff}
                    onViewDetails={handleViewDepartment}
                    onRemoveStaff={handleRemoveFromDepartment}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Department Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">{formMode === 'create' ? 'Create New Department' : 'Edit Department'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); formMode === 'create' ? handleCreateDepartment() : handleUpdateDepartment(); }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department Code *</label>
                  <input 
                    type="text" 
                    value={formData.department_code} 
                    onChange={(e) => setFormData({...formData, department_code: e.target.value.toUpperCase()})} 
                    className="w-full px-3 py-2 border border-gray-400 text-sm bg-white font-mono"
                    placeholder="e.g., STEM, HUM, LANG, TECH"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier for the department</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department Name *</label>
                  <input 
                    type="text" 
                    value={formData.department_name} 
                    onChange={(e) => setFormData({...formData, department_name: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                    placeholder="e.g., STEM Department, Humanities Department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department Type</label>
                  <select value={formData.department_type} onChange={(e) => setFormData({...formData, department_type: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    rows="3" 
                    className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                    placeholder="Describe the department's focus and subjects..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="h-4 w-4 text-green-600 border-gray-300" />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Department is active</label>
                </div>
                
                {/* Department Guidelines for JSS */}
                {formData.department_type === 'Academic' && (
                  <div className="p-3 bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-700"><strong>JSS Department Guidelines:</strong></p>
                    <ul className="text-xs text-blue-600 mt-1 space-y-0.5 list-disc list-inside">
                      <li>STEM: Mathematics, Integrated Science, Agriculture & Nutrition, Health Education</li>
                      <li>Humanities: Social Studies, Religious Education, Life Skills</li>
                      <li>Languages: English, Kiswahili, Foreign Languages</li>
                      <li>Technical & Creative Arts: Pre-Technical Studies, Creative Arts, Sports & PE</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}{formMode === 'create' ? 'Create Department' : 'Update Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Department Details Modal */}
      {showDepartmentDetails && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDepartmentDetails(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">{selectedDepartment.department_name}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setShowDepartmentDetails(false); handleEdit(selectedDepartment); }} className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700"><Edit2 className="h-3 w-3 inline mr-1" /> Edit</button>
                <button onClick={() => setShowDepartmentDetails(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-300">
                <div><p className="text-xs text-gray-500">Department Code</p><p className="font-mono font-bold text-green-700">{selectedDepartment.department_code}</p></div>
                <div><p className="text-xs text-gray-500">Department Type</p><p><span className={`px-2 py-0.5 text-xs font-medium border ${getTypeBadge(selectedDepartment.department_type)}`}>{selectedDepartment.department_type}</span></p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500">Description</p><p className="text-sm">{selectedDepartment.description || 'No description provided'}</p></div>
              </div>
              
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Department Members ({selectedDepartment.staff_assignments?.length || 0})</h4>
              {!selectedDepartment.staff_assignments || selectedDepartment.staff_assignments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No staff assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {selectedDepartment.staff_assignments.map(assignment => (
                    <div key={assignment.id} className="bg-gray-50 border border-gray-300 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {assignment.staff?.first_name || assignment.first_name} {assignment.staff?.last_name || assignment.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{assignment.staff?.designation || assignment.designation}</p>
                        <p className="text-xs font-mono text-green-600">{assignment.staff?.teacher_code || assignment.teacher_code}</p>
                        {assignment.teaching_subjects && assignment.teaching_subjects.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">Subjects: {assignment.teaching_subjects.map(s => s.area_name).join(', ')}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 text-xs font-medium border rounded ${assignment.role === 'head' ? 'bg-purple-100 text-purple-800' : assignment.role === 'deputy_head' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {assignment.role === 'head' ? 'Head of Department' : assignment.role === 'deputy_head' ? 'Deputy Head' : 'Member'}
                        </span>
                        {assignment.is_primary && <p className="text-xs text-green-600 mt-1">Primary Department</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end">
              <button onClick={() => setShowDepartmentDetails(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Staff Details Modal (quick view) */}
      {showStaffDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowStaffDetails(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Staff Details</h3>
              <button onClick={() => setShowStaffDetails(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-700">{selectedStaff.first_name?.[0]}{selectedStaff.last_name?.[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedStaff.first_name} {selectedStaff.last_name}</h4>
                  <p className="text-sm text-gray-500">{selectedStaff.designation}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Teacher Code:</span> <code className="font-mono text-green-700">{selectedStaff.teacher_code}</code></p>
                <p><span className="text-gray-500">Email:</span> {selectedStaff.personal_email}</p>
                <p><span className="text-gray-500">Phone:</span> {selectedStaff.personal_phone}</p>
                <p><span className="text-gray-500">Category:</span> {selectedStaff.teacher_category_code} - {selectedStaff.teacher_category_name}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end">
              <button onClick={() => setShowStaffDetails(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
