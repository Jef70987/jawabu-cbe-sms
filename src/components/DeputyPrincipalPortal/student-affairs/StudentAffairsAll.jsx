import React, { useState } from 'react';
import {
  Search, Filter, Download, Eye, Edit2,
  Mail, Phone, MoreVertical, UserCheck,
  UserX, Award, AlertCircle, Star
} from 'lucide-react';

const StudentAffairsAll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Emma Thompson',
      grade: '10B',
      age: 16,
      gender: 'Female',
      parentName: 'Robert Thompson',
      parentPhone: '+1 234-567-8901',
      parentEmail: 'r.thompson@email.com',
      attendance: 95,
      conduct: 'A',
      status: 'Active',
      clubs: ['Debate Club', 'Student Council'],
      achievements: ['Honor Roll', 'Perfect Attendance']
    },
    {
      id: 2,
      name: 'James Wilson',
      grade: '11A',
      age: 17,
      gender: 'Male',
      parentName: 'Sarah Wilson',
      parentPhone: '+1 234-567-8902',
      parentEmail: 's.wilson@email.com',
      attendance: 82,
      conduct: 'C',
      status: 'Active',
      clubs: ['Basketball Team'],
      achievements: []
    },
    {
      id: 3,
      name: 'Sophia Lee',
      grade: '9C',
      age: 15,
      gender: 'Female',
      parentName: 'David Lee',
      parentPhone: '+1 234-567-8903',
      parentEmail: 'd.lee@email.com',
      attendance: 98,
      conduct: 'A',
      status: 'Active',
      clubs: ['Art Club', 'Volunteer Group'],
      achievements: ['Art Competition Winner']
    },
    {
      id: 4,
      name: 'Michael Brown',
      grade: '12C',
      age: 18,
      gender: 'Male',
      parentName: 'Lisa Brown',
      parentPhone: '+1 234-567-8904',
      parentEmail: 'l.brown@email.com',
      attendance: 75,
      conduct: 'D',
      status: 'Probation',
      clubs: [],
      achievements: []
    }
  ];

  const getConductColor = (conduct) => {
    switch(conduct) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(s =>
    (filterGrade === 'all' || s.grade === filterGrade) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by student name or parent..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
        >
          <option value="all">All Grades</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
          <option>Grade 11</option>
          <option>Grade 12</option>
        </select>
        <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
          <Filter size={18} className="text-gray-600" />
          <span>More Filters</span>
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
          <Download size={18} />
          <span>Export List</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent/Guardian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conduct</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">Age: {student.age}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{student.grade}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{student.parentName}</p>
                    <p className="text-sm text-gray-500">{student.parentPhone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${student.attendance >= 90 ? 'text-green-600' : student.attendance >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.attendance}%
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${student.attendance}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConductColor(student.conduct)}`}>
                    {student.conduct}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Mail size={16} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAffairsAll;