import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, Search,
  Eye, Printer, Mail, DollarSign, TrendingUp,
  PieChart, BarChart3, Wallet, CreditCard, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const ReportsFinancial = () => {
  const financialReports = [
    {
      id: 'FIN001',
      name: 'Annual Financial Statement 2023',
      type: 'Annual',
      generated: '2024-01-15',
      format: 'PDF',
      size: '3.2 MB',
      status: 'Final',
      downloads: 156,
      description: 'Complete financial statement for fiscal year 2023'
    },
    {
      id: 'FIN002',
      name: 'Q1 Budget vs Actual Report',
      type: 'Budget',
      generated: '2024-04-01',
      format: 'Excel',
      size: '1.8 MB',
      status: 'Final',
      downloads: 89,
      description: 'Budget performance analysis for Q1 2024'
    },
    {
      id: 'FIN003',
      name: 'Revenue Analysis Report',
      type: 'Revenue',
      generated: '2024-03-28',
      format: 'PDF',
      size: '2.1 MB',
      status: 'Final',
      downloads: 67,
      description: 'Detailed revenue stream analysis'
    },
    {
      id: 'FIN004',
      name: 'Expense Breakdown Report',
      type: 'Expense',
      generated: '2024-03-25',
      format: 'PDF',
      size: '1.9 MB',
      status: 'Final',
      downloads: 78,
      description: 'Comprehensive expense category analysis'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850, expenses: 720, profit: 130 },
    { month: 'Feb', revenue: 860, expenses: 730, profit: 130 },
    { month: 'Mar', revenue: 855, expenses: 740, profit: 115 },
    { month: 'Apr', revenue: 870, expenses: 750, profit: 120 },
    { month: 'May', revenue: 865, expenses: 760, profit: 105 },
    { month: 'Jun', revenue: 890, expenses: 780, profit: 110 }
  ];

  const expenseCategories = [
    { name: 'Salaries', amount: 1200, percentage: 30.6, color: '#3B82F6' },
    { name: 'Facilities', amount: 850, percentage: 21.7, color: '#10B981' },
    { name: 'Operational', amount: 650, percentage: 16.6, color: '#F59E0B' },
    { name: 'Equipment', amount: 580, percentage: 14.8, color: '#8B5CF6' },
    { name: 'Activities', amount: 350, percentage: 8.9, color: '#EF4444' },
    { name: 'Development', amount: 290, percentage: 7.4, color: '#EC4899' }
  ];

  const reportStats = {
    totalReports: 32,
    generatedThisMonth: 8,
    totalDownloads: 892,
    financialHealth: 'Strong'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * 1000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage financial reports and analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-gray-800">{reportStats.totalReports}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">{reportStats.generatedThisMonth}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-blue-600">{reportStats.totalDownloads}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Financial Health</p>
          <p className="text-2xl font-bold text-green-600">{reportStats.financialHealth}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue & Expense Trends (in $K)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Categories & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Expense Categories</h2>
          <div className="space-y-4">
            {expenseCategories.map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-medium text-gray-800">{formatCurrency(category.amount)} ({category.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Revenue</span>
              <span className="font-semibold text-green-600">$4.85M</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Expenses</span>
              <span className="font-semibold text-red-600">$3.92M</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Net Income</span>
              <span className="font-semibold text-blue-600">$930K</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Budget Utilization</span>
              <span className="font-semibold text-orange-600">78.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports .List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {financialReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Generated: {report.generated}</span>
                      <span className="text-xs text-gray-500">Format: {report.format}</span>
                      <span className="text-xs text-gray-500">Size: {report.size}</span>
                      <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Printer size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsFinancial;