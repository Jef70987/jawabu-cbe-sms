import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function StudentManagement() {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({ targetClassId: '' });
  const [selectedTransferStudents, setSelectedTransferStudents] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
    boarding: 0,
    day: 0,
    earlyYears: 0,
    lowerPrimary: 0,
    upperPrimary: 0,
    junior: 0
  });

  // Filter options
  const statuses = ['Active', 'Inactive', 'Graduated', 'Transferred'];
  const genders = ['Male', 'Female'];
  const transportModes = ['School Bus', 'Private', 'Walker', 'Other'];

  // Map class names to CBC levels
  const getClassLevel = (className) => {
    if (!className) return null;
    const name = className.toLowerCase();
    
    if (name.includes('pre-primary') || name.includes('pp1') || name.includes('pp2') || name === 'pp1' || name === 'pp2') {
      return 'earlyYears';
    }
    if (name.includes('grade 1') || name.includes('grade1') || name === '1' ||
        name.includes('grade 2') || name.includes('grade2') || name === '2' ||
        name.includes('grade 3') || name.includes('grade3') || name === '3') {
      return 'lowerPrimary';
    }
    if (name.includes('grade 4') || name.includes('grade4') || name === '4' ||
        name.includes('grade 5') || name.includes('grade5') || name === '5' ||
        name.includes('grade 6') || name.includes('grade6') || name === '6') {
      return 'upperPrimary';
    }
    if (name.includes('grade 7') || name.includes('grade7') || name === '7' ||
        name.includes('grade 8') || name.includes('grade8') || name === '8' ||
        name.includes('grade 9') || name.includes('grade9') || name === '9') {
      return 'junior';
    }
    return null;
  };

  // Notification component
  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const getStyles = () => {
      switch (type) {
        case 'success': return 'bg-green-50 border-green-400 text-green-800';
        case 'error': return 'bg-red-50 border-red-400 text-red-800';
        case 'warning': return 'bg-yellow-50 border-yellow-400 text-yellow-800';
        default: return 'bg-blue-50 border-blue-400 text-blue-800';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'success': return '✓';
        case 'error': return '✗';
        case 'warning': return '⚠';
        default: return 'ℹ';
      }
    };

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 rounded-lg shadow-lg animate-slide-in ${getStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{getIcon()}</span>
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        </div>
      </div>
    );
  };

  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const studentsRes = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders()
      });
      const studentsData = await studentsRes.json();
      if (studentsData.success) {
        setStudents(studentsData.data);
      } else if (studentsData.error === 'Unauthorized' || studentsData.code === 'token_not_valid') {
        addNotification('error', 'Session expired. Please login again.');
        logout();
        return;
      }

      const classesRes = await fetch(`${API_BASE_URL}/api/registrar/classes/`, {
        headers: getAuthHeaders()
      });
      const classesData = await classesRes.json();
      if (classesData.success) {
        setClasses(classesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, getAuthHeaders, logout]);

  const updateStats = useCallback((studentsData) => {
    const total = studentsData.length;
    const active = studentsData.filter(s => s.status === 'Active').length;
    const male = studentsData.filter(s => s.gender === 'Male').length;
    const female = studentsData.filter(s => s.gender === 'Female').length;
    const boarding = studentsData.filter(s => s.is_boarding === true).length;
    const day = studentsData.filter(s => s.is_boarding === false).length;

    let earlyYears = 0;
    let lowerPrimary = 0;
    let upperPrimary = 0;
    let junior = 0;

    studentsData.forEach(student => {
      const classObj = classes.find(c => c.id == student.current_class);
      const className = classObj?.class_name || '';
      const level = getClassLevel(className);
      
      switch (level) {
        case 'earlyYears': earlyYears++; break;
        case 'lowerPrimary': lowerPrimary++; break;
        case 'upperPrimary': upperPrimary++; break;
        case 'junior': junior++; break;
        default:
          if (className) {
            const name = className.toLowerCase();
            if (name.includes('pp') || name.includes('pre-primary')) earlyYears++;
            else if (name.includes('grade 1') || name.includes('grade 2') || name.includes('grade 3') || name === '1' || name === '2' || name === '3') lowerPrimary++;
            else if (name.includes('grade 4') || name.includes('grade 5') || name.includes('grade 6') || name === '4' || name === '5' || name === '6') upperPrimary++;
            else if (name.includes('grade 7') || name.includes('grade 8') || name.includes('grade 9') || name === '7' || name === '8' || name === '9') junior++;
          }
          break;
      }
    });

    setStats({ total, active, male, female, boarding, day, earlyYears, lowerPrimary, upperPrimary, junior });
  }, [classes]);

  const applyFilters = useCallback(() => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.first_name?.toLowerCase().includes(term) ||
        s.last_name?.toLowerCase().includes(term) ||
        s.admission_no?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.upi_number?.toLowerCase().includes(term) ||
        s.knec_number?.toLowerCase().includes(term) ||
        s.guardian_phone?.includes(term)
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(s => s.current_class == selectedClass);
    }

    if (selectedStatus) {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    if (selectedGender) {
      filtered = filtered.filter(s => s.gender === selectedGender);
    }

    if (selectedBoarding === 'Boarding') {
      filtered = filtered.filter(s => s.is_boarding === true);
    } else if (selectedBoarding === 'Day') {
      filtered = filtered.filter(s => s.is_boarding === false);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedStatus, selectedGender, selectedBoarding, students]);

  // Fetch data
  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access student management');
      return;
    }
    fetchData();
  }, [addNotification, fetchData, isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (students.length > 0 && classes.length > 0) {
      updateStats(students);
    }
  }, [classes, students, updateStats]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedStatus('');
    setSelectedGender('');
    setSelectedBoarding('');
  };

  const getPaginatedStudents = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const getClassById = (id) => {
    const classItem = classes.find(c => c.id == id);
    return classItem ? classItem.class_name : id;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Graduated': return 'bg-blue-100 text-blue-800';
      case 'Transferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const editStudent = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      id: student.id,
      admission_no: student.admission_no,
      upi_number: student.upi_number || '',
      knec_number: student.knec_number || '',
      birth_certificate_no: student.birth_certificate_no || '',
      first_name: student.first_name,
      middle_name: student.middle_name || '',
      last_name: student.last_name,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      nationality: student.nationality || 'Kenyan',
      phone: student.phone || '',
      email: student.email || '',
      current_class: student.current_class,
      admission_date: student.admission_date,
      status: student.status,
      guardian_name: student.guardian_name,
      guardian_phone: student.guardian_phone,
      is_boarding: student.is_boarding || false,
      mode_of_transport: student.mode_of_transport || '',
      address: student.address || '',
      guardian_relation: student.guardian_relation || ''
    });
    setShowEditModal(true);
  };

  const confirmDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const deleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/delete/${selectedStudent.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Student ${selectedStudent.first_name} ${selectedStudent.last_name} has been deleted.`);
        await fetchData();
        setShowDeleteModal(false);
        setSelectedStudent(null);
      } else {
        addNotification('error', data.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      addNotification('error', 'Failed to delete student.');
    }
  };

  const updateStudent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/update/${editFormData.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editFormData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Student ${editFormData.first_name} ${editFormData.last_name} has been updated.`);
        await fetchData();
        setShowEditModal(false);
      } else {
        addNotification('error', data.error || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      addNotification('error', 'Failed to update student.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = (studentId, newStatus) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStudent || !pendingStatus) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/update/${selectedStudent.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: pendingStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('success', `Status changed to ${pendingStatus} for ${selectedStudent.first_name} ${selectedStudent.last_name}`);
        await fetchData();
        setShowStatusModal(false);
        setSelectedStudent(null);
        setPendingStatus(null);
      } else {
        addNotification('error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      addNotification('error', 'Failed to update status.');
    }
  };

  // Transfer functionality
  const toggleStudentForTransfer = (studentId) => {
    if (selectedTransferStudents.includes(studentId)) {
      setSelectedTransferStudents(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedTransferStudents(prev => [...prev, studentId]);
    }
  };

  const openTransferConfirm = () => {
    if (selectedTransferStudents.length === 0) {
      addNotification('error', 'Please select at least one student to transfer.');
      return;
    }
    if (!transferData.targetClassId) {
      addNotification('error', 'Please select a target class.');
      return;
    }
    setShowTransferConfirmModal(true);
  };

  const confirmTransfer = async () => {
    try {
      const updatePromises = selectedTransferStudents.map(studentId =>
        fetch(`${API_BASE_URL}/api/registrar/students/update/${studentId}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ current_class: transferData.targetClassId })
        })
      );

      await Promise.all(updatePromises);
      
      addNotification('success', `Successfully transferred ${selectedTransferStudents.length} student(s)!`);
      setShowTransferModal(false);
      setShowTransferConfirmModal(false);
      setSelectedTransferStudents([]);
      setTransferData({ targetClassId: '' });
      await fetchData();
    } catch (error) {
      console.error('Error transferring students:', error);
      addNotification('error', 'Failed to transfer students.');
    }
  };

  const exportToCSV = () => {
    try {
      const exportData = filteredStudents.map(student => ({
        'Admission No': student.admission_no,
        'UPI Number': student.upi_number || '',
        'KNEC Number': student.knec_number || '',
        'Birth Certificate No': student.birth_certificate_no || '',
        'First Name': student.first_name,
        'Middle Name': student.middle_name || '',
        'Last Name': student.last_name,
        'Gender': student.gender,
        'Nationality': student.nationality || 'Kenyan',
        'Phone': student.phone || '',
        'Email': student.email || '',
        'Class': getClassById(student.current_class),
        'Admission Date': student.admission_date,
        'Status': student.status,
        'Guardian Name': student.guardian_name,
        'Guardian Phone': student.guardian_phone,
        'Residence': student.is_boarding ? 'Boarding' : 'Day Scholar',
        'Mode of Transport': student.mode_of_transport || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
      XLSX.writeFile(workbook, `students_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      addNotification('success', `Exported ${exportData.length} students successfully`);
    } catch (error) {
      console.error('Error exporting:', error);
      addNotification('error', 'Failed to export data.');
    }
  };

  // Session check - if not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 md:h-8 md:w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-4">Authentication Required</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Please login to access student management</p>
          <a href="/login" className="mt-6 inline-block px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors">
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

      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 p-4 bg-green-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Student Management</h1>
              <p className="text-sm text-white mt-1">Manage and view all registered students</p>
              {user && (
                <p className="text-xs text-white mt-1">
                  Logged in as: <span className="font-medium">{user.first_name} {user.last_name}</span> ({user.role})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowTransferModal(true)} 
                className="px-5 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded"
              >
                Transfer Students
              </button>
              <button 
                onClick={exportToCSV} 
                className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 rounded"
              >
                Export CSV
              </button>
              <button 
                onClick={fetchData} 
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? '...' : stats.total}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-700">{isLoading ? '...' : stats.active}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Boys</p>
            <p className="text-2xl font-bold text-blue-700">{isLoading ? '...' : stats.male}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Girls</p>
            <p className="text-2xl font-bold text-pink-700">{isLoading ? '...' : stats.female}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Boarding</p>
            <p className="text-2xl font-bold text-purple-700">{isLoading ? '...' : stats.boarding}</p>
          </div>
          <div className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-xs text-gray-600">Day Scholar</p>
            <p className="text-2xl font-bold text-orange-700">{isLoading ? '...' : stats.day}</p>
          </div>
        </div>

        {/* CBC Level Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-100 border border-blue-300 p-3 text-center rounded">
            <p className="text-xs text-blue-800 font-bold">Early Years (EYE)</p>
            <p className="text-xs text-blue-600">PP1 & PP2</p>
            <p className="text-2xl font-bold text-blue-900">{stats.earlyYears}</p>
          </div>
          <div className="bg-green-100 border border-green-300 p-3 text-center rounded">
            <p className="text-xs text-green-800 font-bold">Lower Primary</p>
            <p className="text-xs text-green-600">Grade 1-3</p>
            <p className="text-2xl font-bold text-green-900">{stats.lowerPrimary}</p>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 p-3 text-center rounded">
            <p className="text-xs text-yellow-800 font-bold">Upper Primary</p>
            <p className="text-xs text-yellow-600">Grade 4-6</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.upperPrimary}</p>
          </div>
          <div className="bg-purple-100 border border-purple-300 p-3 text-center rounded">
            <p className="text-xs text-purple-800 font-bold">Junior Secondary (JSS)</p>
            <p className="text-xs text-purple-600">Grade 7-9</p>
            <p className="text-2xl font-bold text-purple-900">{stats.junior}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-300 p-4 mb-6 rounded">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, UPI, KNEC..." 
                className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
              <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                <option value="">All Genders</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Residence</label>
              <select value={selectedBoarding} onChange={(e) => setSelectedBoarding(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                <option value="">All</option>
                <option value="Boarding">Boarding</option>
                <option value="Day">Day Scholar</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={clearFilters} className="text-xs text-blue-700 hover:text-blue-900 font-bold">Clear All Filters</button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-300 overflow-hidden rounded">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100">Admission No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100">Student Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden md:table-cell">Class</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden lg:table-cell">Residence</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-100 hidden sm:table-cell">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-xs font-bold text-gray-700 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-500">Loading students...</td>
                  </tr>
                ) : getPaginatedStudents().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-500">No students found</td>
                  </tr>
                ) : (
                  getPaginatedStudents().map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <p className="font-mono text-xs text-gray-700">{student.admission_no}</p>
                        <p className="text-xs text-gray-500 hidden sm:block">{student.upi_number}</p>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 border border-gray-400 flex items-center justify-center rounded">
                            <span className="text-gray-800 font-bold text-xs">{student.first_name?.charAt(0)}{student.last_name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{student.first_name} {student.last_name}</p>
                            <p className="text-xs text-gray-500 hidden sm:block">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-gray-700">
                        {getClassById(student.current_class)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 hidden lg:table-cell">
                        {student.is_boarding ? (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium border border-purple-300 rounded">Boarding</span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium border border-green-300 rounded">Day</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 hidden sm:table-cell">
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-bold border rounded cursor-pointer ${getStatusClass(student.status)}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => viewStudent(student)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700 rounded">View</button>
                          <button onClick={() => editStudent(student)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700 rounded">Edit</button>
                          <button onClick={() => confirmDelete(student)} className="px-3 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700 rounded">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-300 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded">
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Student Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 border border-gray-400 flex items-center justify-center rounded">
                  <span className="text-gray-800 font-bold text-xl">{selectedStudent.first_name?.charAt(0)}{selectedStudent.last_name?.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}</h4>
                  <p className="text-gray-600 text-sm font-mono">{selectedStudent.admission_no}</p>
                </div>
              </div>

              <div className="mb-5 p-4 bg-blue-100 border border-blue-300 rounded">
                <h5 className="text-sm font-bold text-blue-900 mb-3">Government Identifiers (NEMIS Compliance)</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-gray-700">UPI Number:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.upi_number || 'Not provided'}</span></div>
                  <div><span className="text-gray-700">KNEC Number:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.knec_number || 'Not provided'}</span></div>
                  <div><span className="text-gray-700">Birth Certificate:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.birth_certificate_no || 'Not provided'}</span></div>
                </div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Personal Information</h5>
              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div><span className="text-gray-600">Date of Birth:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.date_of_birth}</span></div>
                <div><span className="text-gray-600">Gender:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.gender}</span></div>
                <div><span className="text-gray-600">Nationality:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.nationality || 'Kenyan'}</span></div>
                <div><span className="text-gray-600">Class:</span> <span className="font-bold text-gray-900 ml-2">{getClassById(selectedStudent.current_class)}</span></div>
                <div><span className="text-gray-600">Phone:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.phone}</span></div>
                <div><span className="text-gray-600">Email:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.email}</span></div>
                <div><span className="text-gray-600">Admission Date:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.admission_date}</span></div>
                <div><span className="text-gray-600">Status:</span> <span className={`px-2 py-0.5 text-xs font-bold ml-2 rounded ${getStatusClass(selectedStudent.status)}`}>{selectedStudent.status}</span></div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Logistics</h5>
              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div><span className="text-gray-600">Residence:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.is_boarding ? 'Boarding' : 'Day Scholar'}</span></div>
                <div><span className="text-gray-600">Transport Mode:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.mode_of_transport || 'Not specified'}</span></div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Guardian Information</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-600">Guardian Name:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.guardian_name}</span></div>
                <div><span className="text-gray-600">Guardian Phone:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.guardian_phone}</span></div>
                <div><span className="text-gray-600">Guardian Relation:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.guardian_relation || 'Not specified'}</span></div>
                <div><span className="text-gray-600">Address:</span> <span className="font-bold text-gray-900 ml-2">{selectedStudent.address || 'Not specified'}</span></div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-5 p-4 bg-blue-100 border border-blue-300 rounded">
                <h5 className="text-sm font-bold text-blue-900 mb-3">NEMIS Compliance (Government Identifiers)</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">UPI Number</label>
                    <input type="text" name="upi_number" value={editFormData.upi_number} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" placeholder="e.g., UPI2024001234" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">KNEC Number</label>
                    <input type="text" name="knec_number" value={editFormData.knec_number} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" placeholder="e.g., KNEC2024012345" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Birth Certificate No.</label>
                    <input type="text" name="birth_certificate_no" value={editFormData.birth_certificate_no} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" placeholder="e.g., BC12345678" />
                  </div>
                </div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Personal Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">First Name</label><input type="text" name="first_name" value={editFormData.first_name} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Middle Name</label><input type="text" name="middle_name" value={editFormData.middle_name} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label><input type="text" name="last_name" value={editFormData.last_name} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label><input type="date" name="date_of_birth" value={editFormData.date_of_birth} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={editFormData.gender} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Nationality</label><input type="text" name="nationality" value={editFormData.nationality} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Phone</label><input type="tel" name="phone" value={editFormData.phone} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Email</label><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Academic Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <select name="current_class" value={editFormData.current_class} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Admission Date</label><input type="date" name="admission_date" value={editFormData.admission_date} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select name="status" value={editFormData.status} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Logistics</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Residence</label>
                  <select name="is_boarding" value={editFormData.is_boarding} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                    <option value={true}>Boarding</option>
                    <option value={false}>Day Scholar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mode of Transport</label>
                  <select name="mode_of_transport" value={editFormData.mode_of_transport} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded">
                    <option value="">Select</option>
                    {transportModes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <h5 className="text-sm font-bold text-gray-800 mb-3">Guardian Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Guardian Name</label><input type="text" name="guardian_name" value={editFormData.guardian_name} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Guardian Phone</label><input type="tel" name="guardian_phone" value={editFormData.guardian_phone} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Guardian Relation</label><input type="text" name="guardian_relation" value={editFormData.guardian_relation} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" placeholder="Father, Mother, Guardian" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Address</label><textarea name="address" value={editFormData.address} onChange={handleEditChange} rows="2" className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded" /></div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={updateStudent} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100">
              <h3 className="text-md font-bold text-red-700">Confirm Delete</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800">Are you sure you want to delete <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>?</p>
              <p className="text-xs text-gray-600 mt-2">This action cannot be undone. All associated records will be removed.</p>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={deleteStudent} className="px-4 py-2 bg-red-600 text-white text-sm font-medium border border-red-700 hover:bg-red-700 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusModal && selectedStudent && pendingStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowStatusModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100">
              <h3 className="text-md font-bold text-gray-900">Confirm Status Change</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800">
                Are you sure you want to change status of <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong> 
                from <strong className="text-yellow-600">{selectedStudent.status}</strong> to <strong className="text-blue-600">{pendingStatus}</strong>?
              </p>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={confirmStatusChange} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded">Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTransferModal(false)}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Transfer Students</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5">
              <div className="bg-blue-50 border border-blue-300 rounded p-4 mb-5">
                <p className="text-sm text-blue-800">Select students to transfer and choose their new class.</p>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Class *</label>
                <select
                  value={transferData.targetClassId}
                  onChange={(e) => setTransferData({...transferData, targetClassId: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                >
                  <option value="">Select Target Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                  ))}
                </select>
              </div>

              <div className="border border-gray-300 rounded overflow-hidden mb-5">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                  <span className="text-sm font-bold">Select Students ({selectedTransferStudents.length} selected)</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTransferStudents.length === filteredStudents.length) {
                        setSelectedTransferStudents([]);
                      } else {
                        setSelectedTransferStudents(filteredStudents.map(s => s.id));
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {selectedTransferStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No students found</div>
                  ) : (
                    filteredStudents.map(student => (
                      <div key={student.id} className="flex items-center px-4 py-2 border-b border-gray-200 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedTransferStudents.includes(student.id)}
                          onChange={() => toggleStudentForTransfer(student.id)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-sm">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-gray-500">Adm: {student.admission_no} | Class: {getClassById(student.current_class)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded">
                  Cancel
                </button>
                <button
                  onClick={openTransferConfirm}
                  disabled={selectedTransferStudents.length === 0 || !transferData.targetClassId}
                  className={`px-4 py-2 text-white text-sm font-medium rounded ${selectedTransferStudents.length === 0 || !transferData.targetClassId ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} border border-purple-700`}
                >
                  Transfer {selectedTransferStudents.length} Student(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Confirmation Modal */}
      {showTransferConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTransferConfirmModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100">
              <h3 className="text-md font-bold text-gray-900">Confirm Transfer</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800">
                Are you sure you want to transfer <strong>{selectedTransferStudents.length} student(s)</strong> to <strong>{getClassById(transferData.targetClassId)}</strong>?
              </p>
              <p className="text-xs text-gray-600 mt-2">This will update their current class assignment.</p>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowTransferConfirmModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={confirmTransfer} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded">Confirm Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
