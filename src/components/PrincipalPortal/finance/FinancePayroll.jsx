import React, { useState } from 'react';
import {
  Users, DollarSign, Calendar, Download,
  Eye, Edit2, Search, Filter, Plus,
  TrendingUp, TrendingDown, UserCheck, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

const FinancePayroll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const payrollStats = {
    totalPayroll: 1200000,
    averageSalary: 64516,
    totalStaff: 186,
    monthlyPayroll: 100000,
    benefits: 180000,
    payrollTax: 120000
  };

  const departmentPayroll = [
    { department: 'Teaching Faculty', staff: 142, total: 950000, average: 6690, percentage: 79 },
    { department: 'Administration', staff: 28, total: 180000, average: 6429, percentage: 15 },
    { department: 'Support Staff', staff: 16, total: 70000, average: 4375, percentage: 6 }
  ];

  const monthlyPayroll = [
    { month: 'Jan', payroll: 980, benefits: 145, taxes: 98 },
    { month: 'Feb', payroll: 990, benefits: 148, taxes: 99 },
    { month: 'Mar', payroll: 985, benefits: 147, taxes: 98 },
    { month: 'Apr', payroll: 1000, benefits: 150, taxes: 100 },
    { month: 'May', payroll: 995, benefits: 149, taxes: 99 },
    { month: 'Jun', payroll: 1010, benefits: 152, taxes: 101 }
  ];

  const staff = [
    { id: 1, name: 'Dr. Robert Chen', position: 'Head of Mathematics', department: 'Teaching Faculty', salary: 85000, status: 'Active' },
    { id: 2, name: 'Prof. Sarah Johnson', position: 'Head of Science', department: 'Teaching Faculty', salary: 82000, status: 'Active' },
    { id: 3, name: 'Ms. Jennifer Thompson', position: 'Senior English Teacher', department: 'Teaching Faculty', salary: 75000, status: 'Active' },
    { id: 4, name: 'Mr. Michael Davis', position: 'Administrative Coordinator', department: 'Administration', salary: 65000, status: 'Active' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredStaff = staff.filter(staff =>
    (selectedDepartment === 'all' || staff.department === selectedDepartment) &&
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage staff salaries, benefits, and payroll processing</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Payroll</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Payroll Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Annual Payroll</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(payrollStats.totalPayroll)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 4.2% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{payrollStats.totalStaff}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Full-time employees</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average Salary</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(payrollStats.averageSalary)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 3.5% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Monthly Payroll</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(payrollStats.monthlyPayroll)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payroll Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Payroll Trends (in $K)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyPayroll}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="payroll" stroke="#3B82F6" strokeWidth={2} name="Base Payroll" />
            <Line type="monotone" dataKey="benefits" stroke="#10B981" strokeWidth={2} name="Benefits" />
            <Line type="monotone" dataKey="taxes" stroke="#F59E0B" strokeWidth={2} name="Payroll Taxes" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Payroll Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Department Payroll Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departmentPayroll.map((dept, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800">{dept.department}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(dept.total)}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">{dept.staff} staff members</p>
                <p className="text-sm text-gray-600">Average: {formatCurrency(dept.average)}</p>
                <p className="text-sm text-gray-600">{dept.percentage}% of total payroll</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${dept.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Salary Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Staff Salary Details</h2>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option>Teaching Faculty</option>
              <option>Administration</option>
              <option>Support Staff</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{staff.name}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.position}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.department}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{formatCurrency(staff.salary)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(staff.salary / 12)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{staff.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Benefits Cost</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(payrollStats.benefits)}</p>
          <p className="text-xs text-gray-500">15% of total payroll</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Payroll Taxes</p>
          <p className="text-xl font-bold text-orange-600">{formatCurrency(payrollStats.payrollTax)}</p>
          <p className="text-xs text-gray-500">10% of total payroll</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Next Payroll Date</p>
          <p className="text-xl font-bold text-blue-600">April 15, 2024</p>
          <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">Schedule →</button>
        </div>
      </div>
    </div>
  );
};

export default FinancePayroll;