/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Plus,
  Search,
  X,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Phone,
  Mail,
  Briefcase,
  UserCheck,
  UserX,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle,
  Info,
  User,
  Calendar,
  Building,
  MapPin,
  IdCard,
  GraduationCap,
  Users,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Award,
  Heart,
  FileText,
  Clock,
  CreditCard,
  Shield,
  Globe,
  Home,
  Flag,
  Smartphone,
  Lock,
  EyeOff
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
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-l-green-600 border border-gray-300 shadow-lg p-4 min-w-[320px]">
      <div className="flex items-start gap-3">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
        {type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information'}</p>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-green-700" />
  </div>
);

// Stats Card
const StatsCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white border border-gray-300 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
          </p>
        )}
      </div>
      <div className="p-3 bg-green-100 border border-green-200">
        <Icon className="h-6 w-6 text-green-700" />
      </div>
    </div>
  </div>
);

// Form Section Component
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-gray-300 mb-6">
    <div className="px-5 py-3 border-b border-gray-300 bg-gray-50 flex items-center gap-2">
      <Icon className="h-5 w-5 text-green-700" />
      <h3 className="font-bold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// Form Field Component
const FormField = ({ label, required, error, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

// Success Modal
const SuccessModal = ({ isOpen, onClose, teacherCode, staffName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4 text-center">
        <div className="px-6 py-6">
          <div className="h-16 w-16 bg-green-100 border border-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-700" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Staff Created Successfully!</h3>
          <p className="text-sm text-gray-600 mb-4">
            {staffName} has been added to the system.
          </p>
          <div className="bg-gray-100 border border-gray-300 p-4 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Teacher Code</p>
            <p className="text-2xl font-bold text-green-700 font-mono">{teacherCode}</p>
            <p className="text-xs text-gray-500 mt-2">Use this code for timetabling and identification</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Staff Details Modal
const StaffDetailsModal = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
          <h3 className="text-md font-bold text-gray-900">Staff Profile</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6 pb-4 border-b border-gray-300">
            <div className="h-20 w-20 bg-green-100 border border-green-300 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-700">{staff.first_name?.[0]}{staff.last_name?.[0]}</span>
            </div>
            <div className="ml-5">
              <h2 className="text-xl font-bold text-gray-900">{staff.first_name} {staff.last_name}</h2>
              <div className="flex gap-3 mt-1">
                <span className="text-sm text-gray-600">{staff.teacher_code || staff.staff_id}</span>
                <span className={`px-2 py-0.5 text-xs font-medium border ${staff.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                  {staff.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{staff.designation}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 flex items-center gap-2">
                <User className="h-4 w-4" /> Personal Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium">{staff.personal_email}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-medium">{staff.personal_phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">National ID:</span><span className="font-medium">{staff.national_id}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date of Birth:</span><span className="font-medium">{staff.date_of_birth}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Gender:</span><span className="font-medium">{staff.gender}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Address:</span><span className="font-medium">{staff.permanent_address || 'N/A'}</span></div>
              </div>
            </div>
            
            {/* Employment Information */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Employment
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Employment Type:</span><span className="font-medium">{staff.employment_type}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Employment Date:</span><span className="font-medium">{staff.employment_date}</span></div>
                {staff.contract_end_date && <div className="flex justify-between"><span className="text-gray-600">Contract End:</span><span className="font-medium">{staff.contract_end_date}</span></div>}
                <div className="flex justify-between"><span className="text-gray-600">Designation:</span><span className="font-medium">{staff.designation}</span></div>
              </div>
            </div>
            
            {/* CBE Categorization */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 flex items-center gap-2">
                <Target className="h-4 w-4" /> CBE Categorization
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium">{staff.teacher_category?.code || 'N/A'} - {staff.teacher_category?.name || ''}</span></div>
                {staff.jss_department && <div className="flex justify-between"><span className="text-gray-600">JSS Department:</span><span className="font-medium">{staff.jss_department?.name}</span></div>}
                {staff.assigned_grade_level && <div className="flex justify-between"><span className="text-gray-600">Assigned Grade:</span><span className="font-medium">{staff.assigned_grade_level?.name}</span></div>}
              </div>
            </div>
            
            {/* Qualifications */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 flex items-center gap-2">
                <Award className="h-4 w-4" /> Qualifications
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Highest Qualification:</span><span className="font-medium">{staff.highest_qualification || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Specialization:</span><span className="font-medium">{staff.specialization || 'N/A'}</span></div>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact */}
          {staff.emergency_contact && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4" /> Emergency Contact
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Name:</span> {staff.emergency_contact_name || 'N/A'}</div>
                <div><span className="text-gray-600">Phone:</span> {staff.emergency_contact || 'N/A'}</div>
                <div><span className="text-gray-600">Relation:</span> {staff.emergency_relation || 'N/A'}</div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-300">
            <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [staff, setStaff] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jssDepartments, setJssDepartments] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaffCode, setNewStaffCode] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [currentStep, setCurrentStep] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [stats, setStats] = useState({ total: 0, active: 0, teachers: 0, jss: 0, pp: 0, early: 0 });
  const [errors, setErrors] = useState({});
  
  // Form Data
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Male',
    national_id: '',
    personal_email: '',
    personal_phone: '',
    permanent_address: '',
    city: '',
    
    // Employment
    employment_type: 'Permanent',
    employment_date: '',
    contract_end_date: '',
    designation: '',
    
    // CBE Categorization
    teacher_category: '',
    jss_department: '',
    assigned_grade_level: '',
    
    // Qualifications
    highest_qualification: '',
    specialization: '',
    university: '',
    year_of_graduation: '',
    
    // Emergency
    emergency_contact_name: '',
    emergency_contact: '',
    emergency_relation: '',
  });

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.personal_email) newErrors.personal_email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.personal_email)) newErrors.personal_email = 'Email is invalid';
      if (!formData.personal_phone) newErrors.personal_phone = 'Phone is required';
      if (!formData.national_id) newErrors.national_id = 'National ID is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    }
    
    if (currentStep === 2) {
      if (!formData.designation) newErrors.designation = 'Designation is required';
    }
    
    if (currentStep === 3) {
      if (!formData.teacher_category) newErrors.teacher_category = 'Teacher category is required';
      const selectedCat = categories.find(c => c.id === formData.teacher_category);
      if (selectedCat?.code === 'JSS' && !formData.jss_department) {
        newErrors.jss_department = 'JSS department is required';
      }
      if ((selectedCat?.code === 'PP' || selectedCat?.code === 'EP') && !formData.assigned_grade_level) {
        newErrors.assigned_grade_level = 'Grade level assignment is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Fetch data
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/?${params}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.data || []);
        // Calculate stats
        const staffList = data.data || [];
        setStats({
          total: staffList.length,
          active: staffList.filter(s => s.status === 'Active').length,
          teachers: staffList.filter(s => s.teacher_category).length,
          jss: staffList.filter(s => s.teacher_category?.code === 'JSS').length,
          pp: staffList.filter(s => s.teacher_category?.code === 'PP').length,
          early: staffList.filter(s => s.teacher_category?.code === 'EP').length,
        });
      }
    } catch (err) {
      showToast('Failed to load staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/teacher-categories/`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchJSSDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/jss-departments/`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setJssDepartments(data.data);
    } catch (err) {
      console.error('Error fetching JSS departments:', err);
    }
  };

  const fetchGradeLevels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrar/academic/grade-levels/`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setGradeLevels(data.data);
    } catch (err) {
      console.error('Error fetching grade levels:', err);
    }
  };

  // Create Staff
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    
    try {
      const submitData = { ...formData };
      if (!submitData.teacher_category) delete submitData.teacher_category;
      if (!submitData.jss_department) delete submitData.jss_department;
      if (!submitData.assigned_grade_level) delete submitData.assigned_grade_level;
      
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setNewStaffCode(data.data.teacher_code);
        setNewStaffName(`${data.data.first_name} ${data.data.last_name}`);
        setShowForm(false);
        setShowSuccess(true);
        resetForm();
        fetchStaff();
      } else {
        showToast(data.error || 'Creation failed', 'error');
      }
    } catch (err) {
      showToast('Failed to create staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/delete/${deleteConfirm.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Staff member ${deleteConfirm.name} deleted`, 'success');
        fetchStaff();
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Failed to delete staff', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', middle_name: '', last_name: '', date_of_birth: '', gender: 'Male',
      national_id: '', personal_email: '', personal_phone: '', permanent_address: '', city: '',
      employment_type: 'Permanent', employment_date: '', contract_end_date: '', designation: '',
      teacher_category: '', jss_department: '', assigned_grade_level: '',
      highest_qualification: '', specialization: '', university: '', year_of_graduation: '',
      emergency_contact_name: '', emergency_contact: '', emergency_relation: ''
    });
    setErrors({});
    setCurrentStep(1);
    setSelectedStaff(null);
    setFormMode('create');
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
      city: staffMember.city || '',
      employment_type: staffMember.employment_type || 'Permanent',
      employment_date: staffMember.employment_date || '',
      contract_end_date: staffMember.contract_end_date || '',
      designation: staffMember.designation || '',
      teacher_category: staffMember.teacher_category?.id || '',
      jss_department: staffMember.jss_department?.id || '',
      assigned_grade_level: staffMember.assigned_grade_level?.id || '',
      highest_qualification: staffMember.highest_qualification || '',
      specialization: staffMember.specialization || '',
      university: staffMember.university || '',
      year_of_graduation: staffMember.year_of_graduation || '',
      emergency_contact_name: staffMember.emergency_contact_name || '',
      emergency_contact: staffMember.emergency_contact || '',
      emergency_relation: staffMember.emergency_relation || '',
    });
    setShowForm(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const submitData = { ...formData };
      if (!submitData.teacher_category) delete submitData.teacher_category;
      if (!submitData.jss_department) delete submitData.jss_department;
      if (!submitData.assigned_grade_level) delete submitData.assigned_grade_level;
      
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/update/${selectedStaff.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast('Staff updated successfully', 'success');
        setShowForm(false);
        resetForm();
        fetchStaff();
      } else {
        showToast(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Failed to update staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStaff();
      fetchCategories();
      fetchJSSDepartments();
      fetchGradeLevels();
    }
  }, [isAuthenticated, searchTerm]);

  const selectedCategory = categories.find(c => c.id === formData.teacher_category);
  const isJSS = selectedCategory?.code === 'JSS';
  const isPPorEarly = selectedCategory?.code === 'PP' || selectedCategory?.code === 'EP';

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
    <div className="min-h-screen bg-gray-50 p-6">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${deleteConfirm.name}? This action cannot be undone.`}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        teacherCode={newStaffCode}
        staffName={newStaffName}
      />

      <StaffDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        staff={selectedStaff}
      />

      {/* Header */}
      <div className="bg-green-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Staff Management</h1>
            <p className="text-green-100 mt-1">Manage teachers and administrative staff with CBE categorization</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
              <UserPlus className="h-4 w-4 inline mr-2" />
              Add Staff
            </button>
            <button onClick={fetchStaff} className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatsCard title="Total Staff" value={stats.total} icon={Users} />
        <StatsCard title="Active" value={stats.active} icon={UserCheck} trend="up" trendValue="12%" />
        <StatsCard title="Teachers" value={stats.teachers} icon={GraduationCap} />
        <StatsCard title="JSS Teachers" value={stats.jss} icon={Target} />
        <StatsCard title="PP Teachers" value={stats.pp} icon={BookOpen} />
        <StatsCard title="Early Primary" value={stats.early} icon={Users} />
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-300 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, staff ID, or teacher code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm bg-white"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No staff members found</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-4 px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800">
              <Plus className="h-4 w-4 inline mr-1" />
              Add First Staff Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Staff Details</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Teacher Code</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Assignment</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Contact</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-bold text-gray-900">{member.first_name} {member.last_name}</div>
                      <div className="text-xs text-gray-500">{member.staff_id}</div>
                      <div className="text-xs text-gray-400 mt-1">{member.designation || 'N/A'}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <code className="text-sm font-mono font-bold text-green-700">{member.teacher_code || 'N/A'}</code>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-xs font-medium border border-gray-300">
                        {member.teacher_category?.code || 'N/A'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{member.teacher_category?.name || ''}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {member.jss_department ? (
                        <span className="text-sm">{member.jss_department?.name}</span>
                      ) : member.assigned_grade_level ? (
                        <span className="text-sm">{member.assigned_grade_level?.name}</span>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center text-xs mb-1"><Mail className="h-3 w-3 mr-1 text-gray-400" />{member.personal_email || 'N/A'}</div>
                      <div className="flex items-center text-xs"><Phone className="h-3 w-3 mr-1 text-gray-400" />{member.personal_phone || 'N/A'}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium border ${member.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setSelectedStaff(member); setShowDetails(true); }} className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700" title="View Details">
                          <Eye className="h-3 w-3 inline" />
                        </button>
                        <button onClick={() => handleEdit(member)} className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium border border-yellow-700 hover:bg-yellow-700" title="Edit">
                          <Edit2 className="h-3 w-3 inline" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ isOpen: true, id: member.id, name: `${member.first_name} ${member.last_name}` })} className="px-2 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700" title="Delete">
                          <Trash2 className="h-3 w-3 inline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Multi-Step Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white border border-gray-400 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">{formMode === 'create' ? 'Onboard New Staff Member' : 'Edit Staff Member'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            
            {/* Step Indicator */}
            <div className="px-6 pt-4 border-b border-gray-300">
              <div className="flex items-center justify-between">
                {['Personal Info', 'Employment', 'CBE Category', 'Qualifications'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep === index + 1 ? 'border-green-700 bg-green-700 text-white' : currentStep > index + 1 ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                      {currentStep > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < 3 && <div className={`w-12 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Personal Info</span>
                <span>Employment</span>
                <span>CBE Category</span>
                <span>Qualifications</span>
              </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); formMode === 'create' ? handleSubmit() : handleUpdate(); }}>
              <div className="p-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <FormSection title="Personal Information" icon={User}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="First Name" required error={errors.first_name}>
                        <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Middle Name">
                        <input type="text" value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Last Name" required error={errors.last_name}>
                        <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Date of Birth" required error={errors.date_of_birth}>
                        <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Gender">
                        <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </FormField>
                      <FormField label="National ID" required error={errors.national_id}>
                        <input type="text" value={formData.national_id} onChange={(e) => setFormData({...formData, national_id: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Email" required error={errors.personal_email}>
                        <input type="email" value={formData.personal_email} onChange={(e) => setFormData({...formData, personal_email: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Phone" required error={errors.personal_phone}>
                        <input type="tel" value={formData.personal_phone} onChange={(e) => setFormData({...formData, personal_phone: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="City">
                        <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Address">
                          <textarea value={formData.permanent_address} onChange={(e) => setFormData({...formData, permanent_address: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                        </FormField>
                      </div>
                    </div>
                  </FormSection>
                )}

                {/* Step 2: Employment Details */}
                {currentStep === 2 && (
                  <>
                    <FormSection title="Employment Information" icon={Briefcase}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Designation" required error={errors.designation}>
                          <input type="text" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="e.g., Senior Teacher, Head of Department" />
                        </FormField>
                        <FormField label="Employment Type">
                          <select value={formData.employment_type} onChange={(e) => setFormData({...formData, employment_type: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                            <option value="Probation">Probation</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Intern">Intern</option>
                          </select>
                        </FormField>
                        <FormField label="Employment Date">
                          <input type="date" value={formData.employment_date} onChange={(e) => setFormData({...formData, employment_date: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                        </FormField>
                        <FormField label="Contract End Date">
                          <input type="date" value={formData.contract_end_date} onChange={(e) => setFormData({...formData, contract_end_date: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                        </FormField>
                      </div>
                    </FormSection>

                    <FormSection title="Emergency Contact" icon={Heart}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Emergency Contact Name">
                          <input type="text" value={formData.emergency_contact_name} onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                        </FormField>
                        <FormField label="Emergency Contact Phone">
                          <input type="tel" value={formData.emergency_contact} onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                        </FormField>
                        <FormField label="Relation">
                          <input type="text" value={formData.emergency_relation} onChange={(e) => setFormData({...formData, emergency_relation: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="e.g., Spouse, Parent, Sibling" />
                        </FormField>
                      </div>
                    </FormSection>
                  </>
                )}

                {/* Step 3: CBE Categorization */}
                {currentStep === 3 && (
                  <FormSection title="CBE Teacher Categorization" icon={Target}>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField label="Teacher Category" required error={errors.teacher_category}>
                        <select 
                          value={formData.teacher_category} 
                          onChange={(e) => setFormData({...formData, teacher_category: e.target.value, jss_department: '', assigned_grade_level: ''})} 
                          className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                        >
                          <option value="">Select Teacher Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.code} - {cat.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {isJSS && "JSS teachers specialize in specific departments (STEM, Humanities, etc.)"}
                          {isPPorEarly && "PP and Early Primary teachers handle all activities for their assigned grade level"}
                          {!selectedCategory && "Select a category to determine assignment type"}
                        </p>
                      </FormField>

                      {isJSS && (
                        <FormField label="JSS Department" required error={errors.jss_department}>
                          <select value={formData.jss_department} onChange={(e) => setFormData({...formData, jss_department: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                            <option value="">Select Department</option>
                            {jssDepartments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                          </select>
                          <p className="text-xs text-green-600 mt-1">JSS teachers will be assigned to specific learning areas within this department</p>
                        </FormField>
                      )}

                      {isPPorEarly && (
                        <FormField label="Assigned Grade Level" required error={errors.assigned_grade_level}>
                          <select value={formData.assigned_grade_level} onChange={(e) => setFormData({...formData, assigned_grade_level: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                            <option value="">Select Grade Level</option>
                            {gradeLevels.map(grade => (
                              <option key={grade.id} value={grade.id}>{grade.name}</option>
                            ))}
                          </select>
                          <p className="text-xs text-green-600 mt-1">PP and Early Primary teachers handle all activities for this specific cohort</p>
                        </FormField>
                      )}
                    </div>
                    
                    {formMode === 'create' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-700">
                          <strong>Note:</strong> Teacher code will be automatically generated based on category (e.g., PP001, EP001, JSS001) and cannot be changed.
                        </p>
                      </div>
                    )}
                  </FormSection>
                )}

                {/* Step 4: Qualifications */}
                {currentStep === 4 && (
                  <FormSection title="Qualifications & Professional Details" icon={Award}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Highest Qualification">
                        <select value={formData.highest_qualification} onChange={(e) => setFormData({...formData, highest_qualification: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white">
                          <option value="">Select Qualification</option>
                          <option value="PhD">PhD</option>
                          <option value="Master's">Master's Degree</option>
                          <option value="Bachelor's">Bachelor's Degree</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Certificate">Certificate</option>
                          <option value="KCSE">KCSE</option>
                        </select>
                      </FormField>
                      <FormField label="University/Institution">
                        <input type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" />
                      </FormField>
                      <FormField label="Year of Graduation">
                        <input type="number" value={formData.year_of_graduation} onChange={(e) => setFormData({...formData, year_of_graduation: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" min="1950" max={new Date().getFullYear()} />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Specialization">
                          <textarea value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="e.g., Mathematics and Science, Early Childhood Development, Special Needs Education" />
                        </FormField>
                      </div>
                    </div>
                  </FormSection>
                )}
              </div>

              {/* Form Navigation */}
              <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-between">
                <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4 inline mr-1" /> Previous
                </button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                  {currentStep < 4 ? (
                    <button type="button" onClick={nextStep} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">
                      Next <ChevronRight className="h-4 w-4 inline ml-1" />
                    </button>
                  ) : (
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Save className="h-4 w-4 inline mr-2" />}
                      {formMode === 'create' ? 'Create Staff' : 'Update Staff'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;