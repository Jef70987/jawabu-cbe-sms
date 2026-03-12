import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Mail, Phone, UserPlus, 
  MoreVertical, Edit2, Trash2, Award, Clock 
} from 'lucide-react';

const PrincipalStaff = () => {
  const [staff, setStaff] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson',
      position: 'Head of Science Department',
      department: 'Science',
      email: 's.johnson@school.edu',
      phone: '+1 234-567-8901',
      status: 'Active',
      joinDate: '2018-09-01',
      qualifications: 'PhD in Physics',
      performance: 'Excellent'
    },
    { 
      id: 2, 
      name: 'Prof. Michael Chen',
      position: 'Senior Lecturer',
      department: 'Mathematics',
      email: 'm.chen@school.edu',
      phone: '+1 234-567-8902',
      status: 'Active',
      joinDate: '2019-08-15',
      qualifications: 'MSc in Mathematics',
      performance: 'Good'
    },
    { 
      id: 3, 
      name: 'Ms. Emily Williams',
      position: 'Department Head',
      department: 'English',
      email: 'e.williams@school.edu',
      phone: '+1 234-567-8903',
      status: 'On Leave',
      joinDate: '2017-01-10',
      qualifications: 'MA in English Literature',
      performance: 'Excellent'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = ['Science', 'Mathematics', 'English', 'Arts', 'Commerce', 'Technology'];

  const filteredStaff = staff.filter(s => 
    (selectedDepartment === 'all' || s.department === selectedDepartment) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty and administrative staff</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition shadow-sm"
        >
          <UserPlus size={18} />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-2xl font-bold text-gray-800">186</p>
          <p className="text-xs text-green-600 mt-1">↑ 12 new this year</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Teaching Staff</p>
          <p className="text-2xl font-bold text-gray-800">142</p>
          <p className="text-xs text-gray-500 mt-1">76% of total</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Administrative</p>
          <p className="text-2xl font-bold text-gray-800">44</p>
          <p className="text-xs text-gray-500 mt-1">24% of total</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold text-orange-600">8</p>
          <p className="text-xs text-gray-500 mt-1">4% of staff</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search staff by name or position..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {member.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center text-gray-600">
                        <Mail size={14} className="mr-2" /> {member.email}
                      </p>
                      <p className="text-sm flex items-center text-gray-600">
                        <Phone size={14} className="mr-2" /> {member.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.performance === 'Excellent' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {member.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                        <Award size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition">
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
          <p className="text-sm text-gray-600">Showing 1 to 3 of 186 entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Add Staff Modal (Simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Staff Member</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              <input type="text" placeholder="Position" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option>Select Department</option>
                {departments.map(dept => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Staff
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalStaff;