import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Eye, FileText, Target, CheckSquare,
  AlertCircle, CheckCircle, X, Loader2, ChevronDown, ChevronUp,
  Mail, Phone, Calendar, Award, TrendingUp, Download,RefreshCw 
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

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

function ClassProfile() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedStudent, setExpandedStudent] = useState(null);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access class profile');
      return;
    }
    fetchClassData();
  }, [isAuthenticated]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedGender, selectedStatus]);

  const fetchClassData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setClassInfo(data.classInfo);
        setStudents(data.students);
        setFilteredStudents(data.students);
      } else {
        // Mock data
        setClassInfo({
          id: 1,
          name: 'Grade 7A',
          stream: 'A',
          classTeacher: 'Mr. John Otieno',
          academicYear: '2024',
          term: 'Term 1',
          totalStudents: 44,
          boys: 23,
          girls: 21
        });
        setStudents([
          { id: 1, admission_no: 'ADM001', first_name: 'John', last_name: 'Mwangi', gender: 'Male', upi_number: 'UPI001', status: 'Active', email: 'john@example.com', phone: '0712345678', guardian_name: 'Peter Mwangi', guardian_phone: '0723456789', average_score: 78, grade: 'B' },
          { id: 2, admission_no: 'ADM002', first_name: 'Mary', last_name: 'Wanjiku', gender: 'Female', upi_number: 'UPI002', status: 'Active', email: 'mary@example.com', phone: '0723456789', guardian_name: 'James Wanjiku', guardian_phone: '0734567890', average_score: 85, grade: 'A' },
          { id: 3, admission_no: 'ADM003', first_name: 'James', last_name: 'Otieno', gender: 'Male', upi_number: 'UPI003', status: 'Active', email: 'james@example.com', phone: '0734567890', guardian_name: 'Paul Otieno', guardian_phone: '0745678901', average_score: 62, grade: 'C' },
          { id: 4, admission_no: 'ADM004', first_name: 'Sarah', last_name: 'Achieng', gender: 'Female', upi_number: 'UPI004', status: 'Inactive', email: 'sarah@example.com', phone: '0745678901', guardian_name: 'Michael Achieng', guardian_phone: '0756789012', average_score: 45, grade: 'D' },
          { id: 5, admission_no: 'ADM005', first_name: 'David', last_name: 'Kiprop', gender: 'Male', upi_number: 'UPI005', status: 'Active', email: 'david@example.com', phone: '0756789012', guardian_name: 'Joseph Kiprop', guardian_phone: '0767890123', average_score: 91, grade: 'A' }
        ]);
        setFilteredStudents([
          { id: 1, admission_no: 'ADM001', first_name: 'John', last_name: 'Mwangi', gender: 'Male', upi_number: 'UPI001', status: 'Active', email: 'john@example.com', phone: '0712345678', guardian_name: 'Peter Mwangi', guardian_phone: '0723456789', average_score: 78, grade: 'B' },
          { id: 2, admission_no: 'ADM002', first_name: 'Mary', last_name: 'Wanjiku', gender: 'Female', upi_number: 'UPI002', status: 'Active', email: 'mary@example.com', phone: '0723456789', guardian_name: 'James Wanjiku', guardian_phone: '0734567890', average_score: 85, grade: 'A' },
          { id: 3, admission_no: 'ADM003', first_name: 'James', last_name: 'Otieno', gender: 'Male', upi_number: 'UPI003', status: 'Active', email: 'james@example.com', phone: '0734567890', guardian_name: 'Paul Otieno', guardian_phone: '0745678901', average_score: 62, grade: 'C' },
          { id: 4, admission_no: 'ADM004', first_name: 'Sarah', last_name: 'Achieng', gender: 'Female', upi_number: 'UPI004', status: 'Inactive', email: 'sarah@example.com', phone: '0745678901', guardian_name: 'Michael Achieng', guardian_phone: '0756789012', average_score: 45, grade: 'D' },
          { id: 5, admission_no: 'ADM005', first_name: 'David', last_name: 'Kiprop', gender: 'Male', upi_number: 'UPI005', status: 'Active', email: 'david@example.com', phone: '0756789012', guardian_name: 'Joseph Kiprop', guardian_phone: '0767890123', average_score: 91, grade: 'A' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
      addNotification('error', 'Failed to load class data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.first_name?.toLowerCase().includes(term) ||
        s.last_name?.toLowerCase().includes(term) ||
        s.admission_no?.toLowerCase().includes(term) ||
        s.upi_number?.toLowerCase().includes(term)
      );
    }

    if (selectedGender) {
      filtered = filtered.filter(s => s.gender === selectedGender);
    }

    if (selectedStatus) {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGender('');
    setSelectedStatus('');
  };

  const getPaginatedStudents = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const exportToExcel = () => {
    const exportData = filteredStudents.map(s => ({
      'Admission No': s.admission_no,
      'UPI Number': s.upi_number,
      'First Name': s.first_name,
      'Last Name': s.last_name,
      'Gender': s.gender,
      'Email': s.email,
      'Phone': s.phone,
      'Guardian Name': s.guardian_name,
      'Guardian Phone': s.guardian_phone,
      'Status': s.status,
      'Average Score': s.average_score,
      'Grade': s.grade
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Class_Students');
    XLSX.writeFile(workbook, `class_${classInfo?.name}_students.xlsx`);
    addNotification('success', 'Export completed successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access class profile</p>
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

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className=" mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Class Profile</h1>
              <p className="text-blue-100 mt-1">{classInfo?.name} - {classInfo?.classTeacher}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                <Download className="h-4 w-4 inline mr-2" />
                Export
              </button>
              <button onClick={fetchClassData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Class Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{classInfo?.totalStudents}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-sm text-gray-600">Boys</p>
            <p className="text-2xl font-bold text-blue-700">{classInfo?.boys}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-sm text-gray-600">Girls</p>
            <p className="text-2xl font-bold text-pink-700">{classInfo?.girls}</p>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-green-700">
              {Math.round(students.reduce((sum, s) => sum + (s.average_score || 0), 0) / students.length)}%
            </p>
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
                placeholder="Search by name, admission..." 
                className="w-full px-3 py-2 text-sm border border-gray-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
              <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 bg-white">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={clearFilters} className="text-xs text-blue-700 hover:text-blue-900 font-bold">Clear All Filters</button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Admission No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 hidden md:table-cell">UPI Number</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 hidden sm:table-cell">Avg Score</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 hidden sm:table-cell">Grade</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    </td>
                  </tr>
                ) : getPaginatedStudents().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-12 text-center text-gray-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  getPaginatedStudents().map(student => (
                    <React.Fragment key={student.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                        <td className="border border-gray-300 px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                        <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-xs">{student.upi_number}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center hidden sm:table-cell font-bold">{student.average_score}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center hidden sm:table-cell">
                          <span className={`px-2 py-1 text-xs font-bold ${getGradeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700"
                            >
                              <Eye className="h-3 w-3 inline" />
                            </button>
                            <Link to={`/teacher/student-portfolio/${student.id}`} className="px-2 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700">
                              Portfolio
                            </Link>
                            <Link to={`/teacher/student-remarks/${student.id}`} className="px-2 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700">
                              Remarks
                            </Link>
                          </div>
                        </td>
                      </tr>
                      {expandedStudent === student.id && (
                        <tr>
                          <td colSpan="6" className="border border-gray-300 p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs font-bold text-gray-700">Contact Information</p>
                                <p className="text-sm mt-1">📧 {student.email}</p>
                                <p className="text-sm">📞 {student.phone}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-700">Guardian Information</p>
                                <p className="text-sm mt-1">👨‍👩‍👧 {student.guardian_name}</p>
                                <p className="text-sm">📞 {student.guardian_phone}</p>
                              </div>
                              <div className="flex gap-2 items-start">
                                <Link to={`/teacher/mark-entry?student=${student.id}`} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                                  Enter Marks
                                </Link>
                                <Link to={`/teacher/competency-matrix?student=${student.id}`} className="px-3 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700">
                                  Rate Competencies
                                </Link>
                                <Link to={`/teacher/evidence-vault?student=${student.id}`} className="px-3 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700">
                                  Upload Evidence
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
    </div>
  );
}

export default ClassProfile;