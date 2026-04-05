import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function StudentManagement() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState({ students: true, classes: true });
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({ targetClassId: '' });
  const [selectedTransferStudents, setSelectedTransferStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    archivedStudents: 0,
    studentsByClass: {}
  });

  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const getStyles = () => {
      switch (type) {
        case 'success': return 'bg-green-50 border-green-200 text-green-800';
        case 'error': return 'bg-red-50 border-red-200 text-red-800';
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default: return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md w-full rounded-lg border p-4 shadow-lg ${getStyles()}`}>
        <div className="flex items-start">
          <div className="flex-1"><p className="text-sm">{message}</p></div>
          <button onClick={onClose} className="ml-4"><i className="fas fa-times"></i></button>
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
      addNotification('error', 'Please login to access student management');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedClass, selectedStatus]);

  const fetchData = async () => {
    try {
      setLoading({ students: true, classes: true });

      const studentsRes = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders()
      });
      const studentsData = await studentsRes.json();
      if (studentsData.success) {
        setStudents(studentsData.data);
        setFilteredStudents(studentsData.data.filter(s => !s.archived));
        calculateStats(studentsData.data);
      }

      const classesRes = await fetch(`${API_BASE_URL}/api/registrar/classes/`, {
        headers: getAuthHeaders()
      });
      const classesData = await classesRes.json();
      if (classesData.success) setClasses(classesData.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to connect to backend server');
    } finally {
      setLoading({ students: false, classes: false });
    }
  };

  const calculateStats = (studentsData) => {
    const totalStudents = studentsData.filter(s => !s.archived).length;
    const activeStudents = studentsData.filter(s => s.status === 'Active' && !s.archived).length;
    const maleStudents = studentsData.filter(s => s.gender === 'Male' && !s.archived).length;
    const femaleStudents = studentsData.filter(s => s.gender === 'Female' && !s.archived).length;
    const archivedStudents = studentsData.filter(s => s.archived === true).length;

    const studentsByClass = {};
    studentsData.forEach(student => {
      const classId = student.current_class;
      if (classId && !student.archived) {
        if (!studentsByClass[classId]) {
          studentsByClass[classId] = {
            count: 0,
            className: classes.find(c => c.id == classId)?.class_name || 'Unknown'
          };
        }
        studentsByClass[classId].count++;
      }
    });

    setStats({ totalStudents, activeStudents, maleStudents, femaleStudents, archivedStudents, studentsByClass });
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.first_name?.toLowerCase().includes(term) ||
        student.last_name?.toLowerCase().includes(term) ||
        student.admission_no?.toLowerCase().includes(term) ||
        student.guardian_phone?.includes(term) ||
        student.phone?.includes(term)
      );
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.current_class == selectedClass);
    }

    if (selectedStatus === 'archived') {
      filtered = filtered.filter(student => student.archived === true);
    } else if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        student => !student.archived && student.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    } else {
      filtered = filtered.filter(student => !student.archived);
    }

    setFilteredStudents(filtered);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      first_name: student.first_name,
      middle_name: student.middle_name || '',
      last_name: student.last_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      phone: student.phone,
      email: student.email || '',
      address: student.address,
      current_class: student.current_class,
      current_section: student.current_section || '',
      roll_number: student.roll_number,
      status: student.status,
      guardian_name: student.guardian_name,
      guardian_phone: student.guardian_phone,
      guardian_relation: student.guardian_relation,
      emergency_contact: student.emergency_contact,
      emergency_contact_name: student.emergency_contact_name
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/update/${selectedStudent.id}/`,
        { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(editFormData) }
      );
      const data = await response.json();
      if (data.success) {
        addNotification('success', `Student ${data.data.first_name} ${data.data.last_name} updated successfully!`);
        await fetchData();
        setShowEditModal(false);
      } else {
        addNotification('error', data.error || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      addNotification('error', 'Failed to update student. Please try again.');
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/update/${studentId}/`,
        { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status: newStatus }) }
      );
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Status updated successfully!');
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      addNotification('error', 'Failed to update status.');
    }
  };

  const handleArchiveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to archive this student? This action can be reversed.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/delete/${studentId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Student archived successfully!');
        await fetchData();
      } else {
        addNotification('error', data.error || 'Failed to archive student');
      }
    } catch (error) {
      console.error('Error archiving student:', error);
      addNotification('error', 'Failed to archive student.');
    }
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = filteredStudents.map(student => ({
        'Admission No': student.admission_no,
        'Full Name': `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim(),
        'Gender': student.gender,
        'Date of Birth': student.date_of_birth,
        'Class': classes.find(c => c.id == student.current_class)?.class_name || 'Not assigned',
        'Section': student.current_section || 'N/A',
        'Roll Number': student.roll_number || 'N/A',
        'Phone': student.phone || 'N/A',
        'Email': student.email || 'N/A',
        'Guardian Name': student.guardian_name,
        'Guardian Phone': student.guardian_phone,
        'Guardian Relation': student.guardian_relation,
        'Emergency Contact': student.emergency_contact,
        'Status': student.status,
        'Archived': student.archived ? 'Yes' : 'No',
        'Admission Date': student.admission_date,
        'Address': student.address,
        'City': student.city,
        'Medical Conditions': student.medical_conditions || 'None',
        'Allergies': student.allergies || 'None'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
      XLSX.writeFile(workbook, `students_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      addNotification('success', `Exported ${exportData.length} students to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      addNotification('error', 'Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const toggleStudentForTransfer = (studentId) => {
    if (selectedTransferStudents.includes(studentId)) {
      setSelectedTransferStudents(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedTransferStudents(prev => [...prev, studentId]);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (selectedTransferStudents.length === 0) {
      addNotification('error', 'Please select at least one student to transfer.');
      return;
    }
    if (!transferData.targetClassId) {
      addNotification('error', 'Please select a target class.');
      return;
    }
    if (!window.confirm(`Transfer ${selectedTransferStudents.length} student(s) to the selected class?`)) return;

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
      setSelectedTransferStudents([]);
      setTransferData({ targetClassId: '' });
      await fetchData();
    } catch (error) {
      console.error('Error transferring students:', error);
      addNotification('error', 'Failed to transfer students. Please try again.');
    }
  };

  const animationStyle = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
  `;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <style>{animationStyle}</style>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access student management</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 inline-block">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{animationStyle}</style>

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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600 mt-1">Manage student records, classes, and transfers</p>
              {user && (
                <p className="text-sm text-gray-500 mt-2">
                  Logged in as: <span className="font-medium">{user.first_name} {user.last_name}</span> ({user.role})
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToExcel}
                disabled={exportLoading}
                className={`px-4 py-2 ${exportLoading ? 'bg-green-500' : 'bg-green-600'} text-white rounded-lg hover:bg-green-700 flex items-center`}
              >
                {exportLoading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Exporting...</>
                ) : (
                  <><i className="fas fa-file-excel mr-2"></i>Export to Excel</>
                )}
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                disabled={students.length === 0}
                className={`px-4 py-2 ${students.length === 0 ? 'bg-gray-400' : 'bg-purple-600'} text-white rounded-lg hover:bg-purple-700 flex items-center`}
              >
                <i className="fas fa-exchange-alt mr-2"></i>Transfer Students
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: 'fa-users', bg: 'bg-blue-100', color: 'text-blue-600' },
            { label: 'Active Students', value: stats.activeStudents, icon: 'fa-user-check', bg: 'bg-green-100', color: 'text-green-600' },
            { label: 'Male Students', value: stats.maleStudents, icon: 'fa-male', bg: 'bg-amber-100', color: 'text-amber-600' },
            { label: 'Female Students', value: stats.femaleStudents, icon: 'fa-female', bg: 'bg-pink-100', color: 'text-pink-600' },
            { label: 'Archived', value: stats.archivedStudents, icon: 'fa-archive', bg: 'bg-gray-100', color: 'text-gray-600' },
          ].map(({ label, value, icon, bg, color }) => (
            <div key={label} className="bg-white rounded-xl shadow border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {loading.students ? '...' : value}
                  </p>
                </div>
                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${icon} ${color} text-2xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="mb-8 bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name, admission no, or phone..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name} ({cls.class_code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
                <option value="Suspended">Suspended</option>
                <option value="Withdrawn">Withdrawn</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  <i className="fas fa-list mr-2"></i>List View
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  <i className="fas fa-th-large mr-2"></i>Grid View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Count Summary */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''} Found
            {selectedStatus === 'archived' && <span className="ml-2 text-sm text-gray-500">(Archived)</span>}
          </h3>
          <div className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} total students
          </div>
        </div>

        {/* Student List/Grid */}
        {loading.students ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <i className="fas fa-users text-gray-300 text-5xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700">No students found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class & Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className={`hover:bg-gray-50 ${student.archived ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i className={`fas fa-${student.gender?.toLowerCase() === 'male' ? 'male' : 'female'} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{student.first_name} {student.last_name}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Adm: {student.admission_no}</div>
                              <div>DOB: {student.date_of_birth}</div>
                              <div>Admitted: {new Date(student.admission_date).toLocaleDateString()}</div>
                            </div>
                            {student.archived && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Archived</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div><span className="text-sm text-gray-600">Class:</span> <span className="font-medium">{classes.find(c => c.id == student.current_class)?.class_name || 'Not assigned'}</span></div>
                          <div><span className="text-sm text-gray-600">Section:</span> <span>{student.current_section || 'N/A'}</span></div>
                          <div><span className="text-sm text-gray-600">Roll:</span> <span>{student.roll_number || 'N/A'}</span></div>
                          <div><span className="text-sm text-gray-600">Phone:</span> <span>{student.phone || 'N/A'}</span></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div><span className="text-sm text-gray-600">Guardian:</span> <span className="font-medium">{student.guardian_name}</span></div>
                          <div><span className="text-sm text-gray-600">Phone:</span> <span>{student.guardian_phone}</span></div>
                          <div><span className="text-sm text-gray-600">Relation:</span> <span>{student.guardian_relation}</span></div>
                          <div><span className="text-sm text-gray-600">Emergency:</span> <span>{student.emergency_contact}</span></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.archived ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Archived</span>
                        ) : (
                          <select
                            value={student.status}
                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              student.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                              student.status === 'Inactive' ? 'bg-red-100 text-red-800 border-red-200' :
                              student.status === 'Graduated' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              student.status === 'Suspended' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Graduated">Graduated</option>
                            <option value="Transferred">Transferred</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Withdrawn">Withdrawn</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewStudentDetails(student)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
                          >
                            <i className="fas fa-eye mr-1"></i>View
                          </button>
                          {!student.archived && (
                            <>
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100"
                              >
                                <i className="fas fa-edit mr-1"></i>Edit
                              </button>
                              <button
                                onClick={() => handleArchiveStudent(student.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                              >
                                <i className="fas fa-archive mr-1"></i>Archive
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div key={student.id} className={`bg-white rounded-xl shadow border border-gray-200 overflow-hidden ${student.archived ? 'opacity-60' : ''}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <i className={`fas fa-${student.gender?.toLowerCase() === 'male' ? 'male' : 'female'} text-blue-600 text-2xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{student.first_name} {student.last_name}</h4>
                        <p className="text-sm text-gray-600">{student.admission_no}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.archived ? 'bg-gray-200 text-gray-600' :
                      student.status === 'Active' ? 'bg-green-100 text-green-800' :
                      student.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.archived ? 'Archived' : student.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Class:</span>
                      <span className="font-medium">{classes.find(c => c.id == student.current_class)?.class_name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date of Birth:</span>
                      <span>{student.date_of_birth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Guardian:</span>
                      <span className="font-medium">{student.guardian_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Guardian Phone:</span>
                      <span>{student.guardian_phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Admission Date:</span>
                      <span>{new Date(student.admission_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewStudentDetails(student)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      <i className="fas fa-eye mr-2"></i>View Details
                    </button>
                    {!student.archived && (
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 text-sm font-medium"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <i className={`fas fa-${selectedStudent.gender?.toLowerCase() === 'male' ? 'male' : 'female'} text-blue-600 text-3xl`}></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
                      </h4>
                      <p className="text-gray-600">{selectedStudent.admission_no}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedStudent.archived ? 'bg-gray-200 text-gray-600' :
                          selectedStudent.status === 'Active' ? 'bg-green-100 text-green-800' :
                          selectedStudent.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedStudent.archived ? 'Archived' : selectedStudent.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          <i className="fas fa-calendar-alt mr-1"></i>
                          Admitted: {new Date(selectedStudent.admission_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Personal Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Date of Birth', selectedStudent.date_of_birth],
                        ['Gender', selectedStudent.gender],
                        ['Nationality', selectedStudent.nationality],
                        ['Religion', selectedStudent.religion || 'Not specified'],
                        ['Blood Group', selectedStudent.blood_group || 'Not specified'],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Academic Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Current Class', classes.find(c => c.id == selectedStudent.current_class)?.class_name || 'Not assigned'],
                        ['Section', selectedStudent.current_section || 'N/A'],
                        ['Stream', selectedStudent.stream || 'N/A'],
                        ['Roll Number', selectedStudent.roll_number || 'N/A'],
                        ['Admission Type', selectedStudent.admission_type],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span className="font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Contact Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Address', selectedStudent.address],
                        ['City', selectedStudent.city],
                        ['Country', selectedStudent.country],
                        ['Phone', selectedStudent.phone || 'N/A'],
                        ['Email', selectedStudent.email || 'N/A'],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span className="text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Guardian Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Guardian Name', selectedStudent.guardian_name],
                        ['Relationship', selectedStudent.guardian_relation],
                        ['Guardian Phone', selectedStudent.guardian_phone],
                        ['Guardian Email', selectedStudent.guardian_email || 'N/A'],
                        ['Emergency Contact', `${selectedStudent.emergency_contact_name} (${selectedStudent.emergency_contact})`],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Medical Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Medical Conditions', selectedStudent.medical_conditions || 'None'],
                        ['Allergies', selectedStudent.allergies || 'None'],
                        ['Medication', selectedStudent.medication || 'None'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <span className="text-sm text-gray-600 block mb-1">{label}:</span>
                          <p className="text-gray-800">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Previous School Information</h5>
                    <div className="space-y-2">
                      {[
                        ['Previous School', selectedStudent.previous_school || 'N/A'],
                        ['Previous Class', selectedStudent.previous_class || 'N/A'],
                        ['Transfer Certificate No', selectedStudent.transfer_certificate_no || 'N/A'],
                        ['Expected Graduation', selectedStudent.expected_graduation_date || 'N/A'],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              {!selectedStudent.archived && (
                <button
                  onClick={() => { setShowStudentModal(false); handleEditStudent(selectedStudent); }}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                >
                  <i className="fas fa-edit mr-2"></i>Edit Student
                </button>
              )}
              <button
                onClick={() => setShowStudentModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', name: 'first_name', type: 'text', required: true },
                    { label: 'Middle Name', name: 'middle_name', type: 'text' },
                    { label: 'Last Name', name: 'last_name', type: 'text', required: true },
                    { label: 'Date of Birth', name: 'date_of_birth', type: 'date', required: true },
                    { label: 'Phone Number', name: 'phone', type: 'tel' },
                    { label: 'Email Address', name: 'email', type: 'email' },
                    { label: 'Section', name: 'current_section', type: 'text', placeholder: 'e.g., A, B, C' },
                    { label: 'Roll Number', name: 'roll_number', type: 'number' },
                    { label: 'Guardian Name', name: 'guardian_name', type: 'text' },
                    { label: 'Guardian Phone', name: 'guardian_phone', type: 'tel' },
                    { label: 'Emergency Contact', name: 'emergency_contact', type: 'tel' },
                    { label: 'Emergency Contact Name', name: 'emergency_contact_name', type: 'text' },
                  ].map(({ label, name, type, required, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={editFormData[name] || ''}
                        onChange={handleEditInputChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={required}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                    <select name="gender" value={editFormData.gender} onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Class</label>
                    <select name="current_class" value={editFormData.current_class} onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.class_name} ({cls.class_code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select name="status" value={editFormData.status} onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Relation</label>
                    <select name="guardian_relation" value={editFormData.guardian_relation} onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Relation</option>
                      {['Father','Mother','Brother','Sister','Uncle','Aunt','Grandfather','Grandmother','Other'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea name="address" value={editFormData.address || ''} onChange={handleEditInputChange}
                      rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center">
                    <i className="fas fa-save mr-2"></i>Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Students Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Transfer Students</h3>
              <button onClick={() => { setShowTransferModal(false); setSelectedTransferStudents([]); }}
                className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <form onSubmit={handleTransferSubmit}>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                    <i className="fas fa-info-circle text-blue-500 text-xl mr-3"></i>
                    <div>
                      <p className="text-blue-700 font-medium">Transfer Instructions</p>
                      <p className="text-blue-600 text-sm mt-1">Select students to transfer and choose their new class.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Class <span className="text-red-500">*</span></label>
                    <select
                      value={transferData.targetClassId}
                      onChange={(e) => setTransferData({ ...transferData, targetClassId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Target Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.class_name} ({cls.class_code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">
                        Select Students to Transfer ({selectedTransferStudents.length} selected)
                      </h4>
                      <button type="button"
                        onClick={() => {
                          const active = filteredStudents.filter(s => !s.archived);
                          setSelectedTransferStudents(
                            selectedTransferStudents.length === active.length ? [] : active.map(s => s.id)
                          );
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedTransferStudents.length === filteredStudents.filter(s => !s.archived).length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                      {filteredStudents.filter(s => !s.archived).length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No active students found.</div>
                      ) : (
                        filteredStudents.filter(s => !s.archived).map(student => (
                          <div key={student.id} className="flex items-center px-4 py-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedTransferStudents.includes(student.id)}
                              onChange={() => toggleStudentForTransfer(student.id)}
                              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3 flex-1">
                              <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-4">Adm: {student.admission_no}</span>
                                <span>Class: {classes.find(c => c.id == student.current_class)?.class_name || 'Not assigned'}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button type="button"
                    onClick={() => { setShowTransferModal(false); setSelectedTransferStudents([]); }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit"
                    disabled={selectedTransferStudents.length === 0 || !transferData.targetClassId}
                    className={`px-8 py-3 ${selectedTransferStudents.length === 0 || !transferData.targetClassId ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg font-medium flex items-center`}>
                    <i className="fas fa-exchange-alt mr-2"></i>
                    Transfer {selectedTransferStudents.length} Student{selectedTransferStudents.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;