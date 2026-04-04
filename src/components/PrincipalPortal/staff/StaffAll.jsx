import React, { useState } from 'react';
import {
  Users, Search, Filter, Download, Eye,
  Edit2, MoreVertical, Mail, Phone,
  UserCheck, UserX, Calendar, Award,
  TrendingUp, Plus, MessageSquare
} from 'lucide-react';

const StaffAll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const allStaff = [
    {
      id: 'STF001',
      name: 'Dr. Robert Chen',
      position: 'Head of Mathematics',
      department: 'Mathematics',
      email: 'r.chen@school.edu',
      phone: '+1 234-567-8901',
      joinDate: '2018-08-15',
      status: 'Active',
      performance: 'Excellent',
      attendance: 98,
      qualifications: 'PhD in Mathematics'
    },
    {
      id: 'STF002',
      name: 'Prof. Sarah Johnson',
      position: 'Head of Science',
      department: 'Science',
      email: 's.johnson@school.edu',
      phone: '+1 234-567-8902',
      joinDate: '2019-07-10',
      status: 'Active',
      performance: 'Excellent',
      attendance: 96,
      qualifications: 'PhD in Physics'
    },
    {
      id: 'STF003',
      name: 'Ms. Jennifer Thompson',
      position: 'Senior English Teacher',
      department: 'English',
      email: 'j.thompson@school.edu',
      phone: '+1 234-567-8903',
      joinDate: '2017-09-01',
      status: 'Active',
      performance: 'Good',
      attendance: 94,
      qualifications: 'MA in English Literature'
    },
    {
      id: 'STF004',
      name: 'Mr. Michael Davis',
      position: 'Administrative Coordinator',
      department: 'Administration',
      email: 'm.davis@school.edu',
      phone: '+1 234-567-8904',
      joinDate: '2020-01-15',
      status: 'Active',
      performance: 'Good',
      attendance: 92,
      qualifications: 'MBA'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case 'Excellent': return 'bg-purple-100 text-purple-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Needs Improvement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff = allStaff.filter(staff =>
    (filterDepartment === 'all' || staff.department === filterDepartment) &&
    (filterStatus === 'all' || staff.status === filterStatus) &&
    (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Staff</h1>
          <p className="text-gray-600 mt-1">Complete staff directory and management</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Staff List</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-2xl font-bold text-gray-800">186</p>
          <p className="text-xs text-green-600">↑ 12 new this year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Teaching Staff</p>
          <p className="text-2xl font-bold text-blue-600">142</p>
          <p className="text-xs text-gray-500">76% of total</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Administrative</p>
          <p className="text-2xl font-bold text-purple-600">44</p>
          <p className="text-xs text-gray-500">24% of total</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Staff</p>
          <p className="text-2xl font-bold text-green-600">178</p>
          <p className="text-xs text-green-600">96% active rate</p>
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
                placeholder="Search by name, position, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>Arts</option>
              <option>Commerce</option>
              <option>Technology</option>
              <option>Administration</option>
            </select>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{staff.name}</p>
                        <p className="text-sm text-gray-500">ID: {staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{staff.position}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {staff.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center text-gray-600">
                        <Mail size={14} className="mr-2" /> {staff.email}
                      </p>
                      <p className="text-sm flex items-center text-gray-600">
                        <Phone size={14} className="mr-2" /> {staff.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getPerformanceColor(staff.performance)}`}>
                      {staff.performance}
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
                        <MessageSquare size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination. */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {filteredStaff.length} of {allStaff.length} entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAll;