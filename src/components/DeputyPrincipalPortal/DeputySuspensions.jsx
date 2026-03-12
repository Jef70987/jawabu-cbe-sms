import React, { useState } from 'react';
import {
  UserX, Calendar, Clock, AlertTriangle, CheckCircle,
  XCircle, FileText, Mail, Phone, Search, Filter,
  Download, MoreVertical, Eye, Edit2
} from 'lucide-react';

const DeputySuspensions = () => {
  const [suspensions, setSuspensions] = useState([
    {
      id: 'SUS001',
      student: 'James Wilson',
      grade: '11A',
      reason: 'Physical altercation with another student',
      startDate: '2024-03-10',
      endDate: '2024-03-17',
      days: 7,
      type: 'Out-of-School',
      status: 'Active',
      assignedBy: 'Dr. Martinez',
      parentNotified: true
    },
    {
      id: 'SUS002',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Repeated disciplinary infractions',
      startDate: '2024-03-12',
      endDate: '2024-03-14',
      days: 3,
      type: 'In-School',
      status: 'Active',
      assignedBy: 'Ms. Thompson',
      parentNotified: true
    },
    {
      id: 'SUS003',
      student: 'David Lee',
      grade: '11B',
      reason: 'Academic dishonesty',
      startDate: '2024-03-05',
      endDate: '2024-03-09',
      days: 5,
      type: 'Out-of-School',
      status: 'Completed',
      assignedBy: 'Prof. Johnson',
      parentNotified: true
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suspensions Management</h1>
          <p className="text-gray-600 mt-1">Track and manage student suspensions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>New Suspension</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Suspensions</p>
          <p className="text-2xl font-bold text-orange-600">5</p>
          <p className="text-xs text-gray-500">2 in-school, 3 out-of-school</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-xs text-gray-500">↓ 2 from last month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Average Duration</p>
          <p className="text-2xl font-bold text-gray-800">4.5</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Repeated Offenders</p>
          <p className="text-2xl font-bold text-red-600">3</p>
          <p className="text-xs text-gray-500">Need intervention</p>
        </div>
      </div>

      {/* Suspensions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search suspensions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Status</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>In-School</option>
              <option>Out-of-School</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suspensions.map(sus => (
              <tr key={sus.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{sus.student}</p>
                    <p className="text-sm text-gray-500">Grade {sus.grade}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 max-w-[200px] truncate">{sus.reason}</p>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{sus.startDate} - {sus.endDate}</p>
                    <p className="text-xs text-gray-500">{sus.days} days</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    sus.type === 'Out-of-School' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sus.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    sus.status === 'Active' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {sus.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Mail size={16} className="text-gray-600" />
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
  );
};

export default DeputySuspensions;