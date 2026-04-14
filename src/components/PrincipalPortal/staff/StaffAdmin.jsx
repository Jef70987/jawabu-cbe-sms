import React, { useState } from 'react';
import {
  Users, Building, Search, Filter, Download,
  Eye, Edit2, MoreVertical, Mail, Phone,
  Calendar, Award, Clock, Shield, UserCheck
} from 'lucide-react';

const StaffAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const adminStaff = [
    {
      id: 'ADM001',
      name: 'Mr. Michael Davis',
      role: 'Administrative Coordinator',
      department: 'Administration',
      email: 'm.davis@school.edu',
      phone: '+1 234-567-8901',
      joinDate: '2020-01-15',
      responsibilities: ['Staff scheduling', 'Meeting coordination', 'Records management'],
      performance: 'Excellent',
      status: 'Active'
    },
    {
      id: 'ADM002',
      name: 'Ms. Lisa Wong',
      role: 'HR Manager',
      department: 'Human Resources',
      email: 'l.wong@school.edu',
      phone: '+1 234-567-8902',
      joinDate: '2019-03-10',
      responsibilities: ['Recruitment', 'Employee relations', 'Payroll coordination'],
      performance: 'Good',
      status: 'Active'
    },
    {
      id: 'ADM003',
      name: 'Mr. David Chen',
      role: 'Finance Officer',
      department: 'Finance',
      email: 'd.chen@school.edu',
      phone: '+1 234-567-8903',
      joinDate: '2021-06-20',
      responsibilities: ['Budget management', 'Financial reporting', 'Procurement'],
      performance: 'Good',
      status: 'Active'
    }
  ];

  const filteredAdmin = adminStaff.filter(admin =>
    (filterRole === 'all' || admin.role === filterRole) &&
    (admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Administrative Staff</h1>
          <p className="text-gray-600 mt-1">Manage administrative and support staff</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Admin List</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <UserCheck size={18} />
            <span>Add Admin Staff</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Admin Staff</p>
          <p className="text-2xl font-bold text-purple-600">44</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Departments</p>
          <p className="text-2xl font-bold text-gray-800">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Management Level</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-xs text-gray-500">Senior positions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Tenure</p>
          <p className="text-2xl font-bold text-green-600">4.5</p>
          <p className="text-xs text-gray-500">years</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search admin staff..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option>Administrative Coordinator</option>
            <option>HR Manager</option>
            <option>Finance Officer</option>
            <option>IT Support</option>
            <option>Facilities Manager</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmin.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{admin.name}</p>
                        <p className="text-xs text-gray-500">ID: {admin.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{admin.role}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.department}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center text-gray-600">
                        <Mail size={14} className="mr-2" /> {admin.email}
                      </p>
                      <p className="text-sm flex items-center text-gray-600">
                        <Phone size={14} className="mr-2" /> {admin.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{admin.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {admin.status}
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
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffAdmin;