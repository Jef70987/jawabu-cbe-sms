/* eslint-disable no-unused-vars */
// src/components/Student/Profile.jsx

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, Heart, Users, 
  GraduationCap, Globe, Home, Camera, Edit2, Check, X, 
  Loader2, AlertCircle, Lock, Eye, EyeOff, LogOut,
  Briefcase, FileText, Activity, BookOpen, Award, ChevronRight,
  Building, Shield
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${styles[type]} text-white rounded-lg shadow-lg p-4 min-w-[280px] max-w-md`}>
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium capitalize text-sm">{type}</p>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Session Expired Modal
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
          <button 
            onClick={onLogout}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Log In Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Editable Field Component - Only for allowed editable fields
const EditableField = ({ label, value, icon: Icon, onSave, fieldName, type = 'text', required = false, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (required && !editValue.trim()) {
      setError(`${label} is required`);
      return;
    }
    
    setIsSaving(true);
    setError('');
    try {
      await onSave(fieldName, editValue);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    setError('');
  };

  if (!editable) {
    return (
      <div className="py-3 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-gray-900 mt-1 break-words">{value || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group py-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          {isEditing ? (
            <div className="mt-1">
              {type === 'textarea' ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  autoFocus
                />
              ) : (
                <input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              )}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 mt-1 break-words">{value || <span className="text-gray-400">Not provided</span>}</p>
          )}
        </div>
        {!isEditing && editable && (
          <button 
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-all flex-shrink-0"
          >
            <Edit2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, icon: Icon, children, color = 'blue' }) => {
  const colorClasses = {
    blue: 'border-l-4 border-l-blue-500',
    green: 'border-l-4 border-l-green-500',
    purple: 'border-l-4 border-l-purple-500',
    orange: 'border-l-4 border-l-orange-500',
    pink: 'border-l-4 border-l-pink-500',
    teal: 'border-l-4 border-l-teal-500'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${colorClasses[color]} overflow-hidden`}>
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${color}-500`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Stat Badge Component
const StatBadge = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colorClasses[color]}`}>
      <Icon className="w-5 h-5" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </div>
  );
};

// Password Change Modal
const PasswordModal = ({ isOpen, onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function StudentProfile() {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  const [student, setStudent] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleApiError = (error) => {
    if (error?.status === 401) {
      setShowSessionExpired(true);
    }
  };

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch student profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/student/profile/`, {
        headers: getAuthHeaders()
      });

      if (profileResponse.status === 401) {
        handleApiError({ status: 401 });
        setLoading(false);
        return;
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setStudent(profileData.data);
        }
      }

      // Fetch user account info
      const userResponse = await fetch(`${API_BASE_URL}/api/student/profile/user/`, {
        headers: getAuthHeaders()
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success) {
          setUserAccount(userData.data);
        }
      }

    } catch (err) {
      console.error('Error fetching profile:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (fieldName, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile/update/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [fieldName]: value })
      });

      if (response.status === 401) {
        handleApiError({ status: 401 });
        throw new Error('Session expired');
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStudent(data.data);
          showToast(`${fieldName.replace('_', ' ')} updated successfully`, 'success');
          return data;
        } else {
          throw new Error(data.error || 'Update failed');
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile/change-password/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Password changed successfully. Please log in again.', 'success');
        setTimeout(() => handleLogout(), 2000);
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a JPEG or PNG image', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be less than 2MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile/image/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStudent(prev => ({ ...prev, photo_url: data.data.image_url }));
        showToast('Profile picture updated successfully', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to students</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
        onChangePassword={handleChangePassword}
      />

      {/* Full Width Layout - No max-width constraint */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your personal information</p>
        </div>

        {/* Profile Header - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {student?.photo_url ? (
                    <img 
                      src={student.photo_url} 
                      alt={student.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {student?.first_name?.[0]}{student?.last_name?.[0]}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-blue-600" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center md:text-left text-white flex-1">
                <h2 className="text-2xl md:text-3xl font-bold">{student?.full_name}</h2>
                <p className="text-blue-100 mt-1">Admission Number: {student?.admission_no}</p>
                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                    <GraduationCap size={16} />
                    <span className="text-sm">Class {student?.current_class_name || 'Not Assigned'}</span>
                  </div>
                  {student?.stream && (
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                      <Users size={16} />
                      <span className="text-sm">Stream {student.stream}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                    <Award size={16} />
                    <span className="text-sm">Roll No: {student?.roll_number || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <Lock size={16} />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Grid - Full Width 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 - Personal & Contact */}
          <div className="space-y-8">
            {/* Personal Information */}
            <InfoCard title="Personal Information" icon={User} color="blue">
              <EditableField
                label="First Name"
                value={student?.first_name}
                icon={User}
                onSave={updateField}
                fieldName="first_name"
                required
                editable={true}
              />
              <EditableField
                label="Middle Name"
                value={student?.middle_name}
                icon={User}
                onSave={updateField}
                fieldName="middle_name"
                editable={true}
              />
              <EditableField
                label="Last Name"
                value={student?.last_name}
                icon={User}
                onSave={updateField}
                fieldName="last_name"
                required
                editable={true}
              />
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</p>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(student?.date_of_birth)}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.gender || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.nationality || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <EditableField
                label="Religion"
                value={student?.religion}
                icon={Heart}
                onSave={updateField}
                fieldName="religion"
                editable={true}
              />
              <EditableField
                label="Blood Group"
                value={student?.blood_group}
                icon={Activity}
                onSave={updateField}
                fieldName="blood_group"
                editable={true}
              />
            </InfoCard>

            {/* Contact Information - Editable */}
            <InfoCard title="Contact Information" icon={Mail} color="green">
              <EditableField
                label="Phone Number"
                value={student?.phone}
                icon={Phone}
                onSave={updateField}
                fieldName="phone"
                type="tel"
                editable={true}
              />
              <EditableField
                label="Email Address"
                value={student?.email}
                icon={Mail}
                onSave={updateField}
                fieldName="email"
                type="email"
                editable={true}
              />
              <EditableField
                label="Physical Address"
                value={student?.address}
                icon={Home}
                onSave={updateField}
                fieldName="address"
                type="textarea"
                editable={true}
              />
              <EditableField
                label="City"
                value={student?.city}
                icon={MapPin}
                onSave={updateField}
                fieldName="city"
                editable={true}
              />
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.country || 'Kenya'}</p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Column 2 - Guardian & Medical */}
          <div className="space-y-8">
            {/* Guardian Information - Not Editable */}
            <InfoCard title="Guardian Information" icon={Users} color="purple">
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guardian Name</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.guardian_name || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Relation</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.guardian_relation || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guardian Phone</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.guardian_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guardian Email</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.guardian_email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guardian Address</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.guardian_address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Medical Information - Editable */}
            <InfoCard title="Medical Information" icon={Heart} color="pink">
              <EditableField
                label="Medical Conditions"
                value={student?.medical_conditions}
                icon={FileText}
                onSave={updateField}
                fieldName="medical_conditions"
                type="textarea"
                editable={true}
              />
              <EditableField
                label="Allergies"
                value={student?.allergies}
                icon={AlertCircle}
                onSave={updateField}
                fieldName="allergies"
                type="textarea"
                editable={true}
              />
              <EditableField
                label="Medication"
                value={student?.medication}
                icon={Activity}
                onSave={updateField}
                fieldName="medication"
                type="textarea"
                editable={true}
              />
              <EditableField
                label="Emergency Contact"
                value={student?.emergency_contact}
                icon={Phone}
                onSave={updateField}
                fieldName="emergency_contact"
                type="tel"
                editable={true}
              />
              <EditableField
                label="Emergency Contact Name"
                value={student?.emergency_contact_name}
                icon={User}
                onSave={updateField}
                fieldName="emergency_contact_name"
                editable={true}
              />
            </InfoCard>
          </div>

          {/* Column 3 - Parent & Account Information */}
          <div className="space-y-8">
            {/* Father's Information - Not Editable */}
            <InfoCard title="Father's Information" icon={User} color="teal">
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.father_name || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.father_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.father_email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupation</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.father_occupation || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Mother's Information - Not Editable */}
            <InfoCard title="Mother's Information" icon={User} color="orange">
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.mother_name || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.mother_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.mother_email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupation</p>
                    <p className="text-sm text-gray-900 mt-1">{student?.mother_occupation || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Account Information - From User Table, Not Editable */}
            <InfoCard title="Account Information" icon={Shield} color="blue">
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</p>
                    <p className="text-sm text-gray-900 mt-1">{userAccount?.username || user?.username || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Email</p>
                    <p className="text-sm text-gray-900 mt-1">{userAccount?.email || user?.email || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Phone</p>
                    <p className="text-sm text-gray-900 mt-1">{userAccount?.phone || user?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Academic Status */}
            <InfoCard title="Academic Status" icon={BookOpen} color="green">
              <div className="grid grid-cols-2 gap-4">
                <StatBadge 
                  label="Admission Date" 
                  value={formatDate(student?.admission_date)}
                  icon={Calendar}
                  color="blue"
                />
                <StatBadge 
                  label="Admission Type" 
                  value={student?.admission_type || 'Regular'}
                  icon={FileText}
                  color="green"
                />
                <StatBadge 
                  label="Student Status" 
                  value={student?.status || 'Active'}
                  icon={Activity}
                  color="purple"
                />
                <StatBadge 
                  label="Student ID" 
                  value={student?.student_uid?.slice(0, 8) || 'N/A'}
                  icon={Award}
                  color="orange"
                />
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Jawabu School Management System. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Profile information last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}