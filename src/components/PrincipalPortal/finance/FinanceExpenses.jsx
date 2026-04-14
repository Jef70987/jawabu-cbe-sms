import React, { useState } from 'react';
import {
  TrendingDown, Calendar, Download, Eye,
  PieChart, BarChart3, CreditCard, AlertCircle,
  ArrowDownRight, ArrowUpRight, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const FinanceExpenses = () => {
  const [timeframe, setTimeframe] = useState('year');

  const expenseStats = {
    totalExpenses: 3920000,
    projectedExpenses: 4100000,
    growthRate: 5.8,
    budgetVariance: -120000,
    savingsOpportunities: 250000
  };

  const monthlyExpenses = [
    { month: 'Jan', salaries: 980, facilities: 380, equipment: 220, utilities: 140 },
    { month: 'Feb', salaries: 990, facilities: 385, equipment: 225, utilities: 142 },
    { month: 'Mar', salaries: 985, facilities: 390, equipment: 230, utilities: 145 },
    { month: 'Apr', salaries: 1000, facilities: 395, equipment: 235, utilities: 148 },
    { month: 'May', salaries: 995, facilities: 400, equipment: 240, utilities: 150 },
    { month: 'Jun', salaries: 1010, facilities: 405, equipment: 245, utilities: 152 }
  ];

  const expenseCategories = [
    { name: 'Salaries & Benefits', amount: 1200000, percentage: 30.6, trend: '+4.2%', color: '#3B82F6' },
    { name: 'Facilities & Maintenance', amount: 850000, percentage: 21.7, trend: '+3.5%', color: '#10B981' },
    { name: 'Operational Costs', amount: 650000, percentage: 16.6, trend: '+2.8%', color: '#F59E0B' },
    { name: 'Equipment & Supplies', amount: 580000, percentage: 14.8, trend: '+5.1%', color: '#8B5CF6' },
    { name: 'Student Activities', amount: 350000, percentage: 8.9, trend: '+1.5%', color: '#EF4444' },
    { name: 'Professional Development', amount: 290000, percentage: 7.4, trend: '+6.2%', color: '#EC4899' }
  ];

  const quarterlyComparison = [
    { quarter: 'Q1', actual: 950, budget: 920, variance: 30 },
    { quarter: 'Q2', actual: 980, budget: 940, variance: 40 },
    { quarter: 'Q3', actual: 960, budget: 950, variance: 10 },
    { quarter: 'Q4', actual: 1030, budget: 980, variance: 50 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and optimize institutional expenses</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Expense Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(expenseStats.totalExpenses)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">↑ 5.8% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Projected Expenses</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(expenseStats.projectedExpenses)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingDown className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">4.6% above budget</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Budget Variance</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(expenseStats.budgetVariance)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">Over budget</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Savings Opportunities</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(expenseStats.savingsOpportunities)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Identified savings</p>
        </div>
      </div>

      {/* Monthly Expense Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Expense Breakdown (in $K)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="salaries" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Salaries" />
            <Area type="monotone" dataKey="facilities" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Facilities" />
            <Area type="monotone" dataKey="equipment" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Equipment" />
            <Area type="monotone" dataKey="utilities" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Utilities" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Categories & Quarterly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Expense Categories</h2>
          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">{formatCurrency(category.amount)}</span>
                    <span className="text-xs text-red-600">{category.trend}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.percentage}% of total</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quarterly Budget vs Actual (in $K)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quarterlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
              <Bar dataKey="actual" fill="#EF4444" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">⚠️ Q4 expenses exceeded budget by $50K - Review needed</p>
          </div>
        </div>
      </div>

      {/* Cost Optimization Opportunities */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Cost Optimization Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-800">Energy Efficiency</p>
            <p className="text-sm text-gray-600 mt-1">Potential savings: $45K/year</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">Review →</button>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-800">Bulk Purchasing</p>
            <p className="text-sm text-gray-600 mt-1">Potential savings: $35K/year</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">Review →</button>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-800">Vendor Negotiation</p>
            <p className="text-sm text-gray-600 mt-1">Potential savings: $25K/year</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">Review →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceExpenses;