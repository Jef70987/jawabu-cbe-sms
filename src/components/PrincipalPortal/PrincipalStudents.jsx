import React, { useState } from 'react';
import {
  Users, GraduationCap, Search, Filter, Download,
  Eye, Edit2, MoreVertical, Mail, Phone, MapPin,
  Calendar, Award, AlertTriangle, TrendingUp,
  UserPlus, FileText, Star, Clock
} from 'lucide-react';

const PrincipalStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const students = [
    {
      id: 1,
      name: 'Emma Thompson',
      grade: '10B',
      age: 16,
      gender: 'Female',
      address: '123 Main St, Springfield',
      parentName: 'Robert Thompson',
      parentPhone: '+1 234-567-8901',
      parentEmail: 'r.thompson@email.com',
      attendance: 95,
      gpa: 3.8,
      status: 'Active',
      conduct: 'Excellent',
      achievements: ['Honor Roll', 'Science Fair Winner'],
      warnings: 0
    },
    {
      id: 2,
      name: 'James Wilson',
      grade: '11A',
      age: 17,
      gender: 'Male',
      address: '456 Oak Ave, Springfield',
      parentName: 'Sarah Wilson',
      parentPhone: '+1 234-567-8902',
      parentEmail: 's.wilson@email.com',
      attendance: 82,
      gpa: 2.5,
      status: 'Probation',
      conduct: 'Needs Improvement',
      achievements: [],
      warnings: 2
    },
    {
      id: 3,
      name: 'Sophia Lee',
      grade: '9C',
      age: 15,
      gender: 'Female',
      address: '789 Pine Rd, Springfield',
      parentName: 'David Lee',
      parentPhone: '+1 234-567-8903',
      parentEmail: 'd.lee@email.com',
      attendance: 98,
      gpa: 4.0,
      status: 'Active',
      conduct: 'Excellent',
      achievements: ['Art Competition Winner', 'Perfect Attendance'],
      warnings: 0
    },
    {
      id: 4,
      name: 'Michael Brown',
      grade: '12C',
      age: 18,
      gender: 'Male',
      address: '321 Elm St, Springfield',
      parentName: 'Lisa Brown',
      parentPhone: '+1 234-567-8904',
      parentEmail: 'l.brown@email.com',
      attendance: 75,
      gpa: 2.0,
      status: 'At Risk',
      conduct: 'Poor',
      achievements: [],
      warnings: 3
    },
    {
      id: 5,
      name: 'Olivia Martinez',
      grade: '11B',
      age: 16,
      gender: 'Female',
      address: '654 Cedar Ln, Springfield',
      parentName: 'Carlos Martinez',
      parentPhone: '+1 234-567-8905',
      parentEmail: 'c.martinez@email.com',
      attendance: 96,
      gpa: 3.9,
      status: 'Active',
      conduct: 'Good',
      achievements: ['Debate Club President'],
      warnings: 0
    },
  ];

  const stats = {
    totalStudents: 2450,
    activeStudents: 2380,
    atRisk: 45,
    probation: 25,
    honorRoll: 520,
    averageAttendance: 94.2,
    averageGPA: 3.4
  };

  const filteredStudents = students.filter(s => 
    (filterGrade === 'all' || s.grade === filterGrade) &&
    (filterStatus === 'all' || s.status === filterStatus) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Probation': return 'bg-orange-100 text-orange-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 2.5) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of student body and individual records</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export List</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <UserPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">↑ 124 from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeStudents}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <GraduationCap className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">97.1% of total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average GPA</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageGPA}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">↑ 0.2 from last semester</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk Students</p>
              <p className="text-2xl font-bold text-red-600">{stats.atRisk}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Need intervention</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by student name or parent..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="all">All Grades</option>
              <option value="9A">9A</option>
              <option value="9B">9B</option>
              <option value="9C">9C</option>
              <option value="10A">10A</option>
              <option value="10B">10B</option>
              <option value="10C">10C</option>
              <option value="11A">11A</option>
              <option value="11B">11B</option>
              <option value="12A">12A</option>
              <option value="12B">12B</option>
              <option value="12C">12C</option>
            </select>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent/Guardian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">Age: {student.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{student.parentName}</p>
                      <p className="text-sm text-gray-500">{student.parentPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        student.attendance >= 90 ? 'text-green-600' :
                        student.attendance >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.attendance}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendance >= 90 ? 'bg-green-500' :
                            student.attendance >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${getGPAColor(student.gpa)}`}>
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                    {student.warnings > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                        {student.warnings}W
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowStudentModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="Edit">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="Contact">
                        <Mail size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="More">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {filteredStudents.length} of {students.length} entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button 
                onClick={() => setShowStudentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Header */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-gray-600">Grade {selectedStudent.grade} • Age {selectedStudent.age}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedStudent.status)}`}>
                      {selectedStudent.status}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {selectedStudent.conduct}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center text-sm text-gray-600">
                      <Mail size={16} className="mr-2" /> {selectedStudent.parentEmail}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2" /> {selectedStudent.parentPhone}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2" /> {selectedStudent.address}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Academic Info</h4>
                  <div className="space-y-2">
                    <p className="flex items-center text-sm text-gray-600">
                      <GraduationCap size={16} className="mr-2" /> GPA: {selectedStudent.gpa.toFixed(1)}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" /> Attendance: {selectedStudent.attendance}%
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <AlertTriangle size={16} className="mr-2" /> Warnings: {selectedStudent.warnings}
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Achievements</h4>
                {selectedStudent.achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.achievements.map((achievement, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                        <Star size={12} className="mr-1" /> {achievement}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No achievements recorded</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Full Record
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Contact Parent
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Schedule Meeting
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Add Warning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalStudents;