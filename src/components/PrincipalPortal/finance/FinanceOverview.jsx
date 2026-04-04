import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  Download, Eye, BarChart3, PieChart,
  Wallet, CreditCard, Banknote, PiggyBank,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const FinanceOverview = () => {
  const [timeframe, setTimeframe] = useState('year');

  const financialStats = {
    totalRevenue: 4850000,
    totalExpenses: 3920000,
    netIncome: 930000,
    budgetUtilization: 78.5,
    payrollExpenses: 1200000,
    operationalExpenses: 1800000,
    capitalExpenses: 920000,
    reserveFunds: 1500000
  };

  const revenueData = [
    { month: 'Jan', revenue: 850, expenses: 720, profit: 130 },
    { month: 'Feb', revenue: 860, expenses: 730, profit: 130 },
    { month: 'Mar', revenue: 855, expenses: 740, profit: 115 },
    { month: 'Apr', revenue: 870, expenses: 750, profit: 120 },
    { month: 'May', revenue: 865, expenses: 760, profit: 105 },
    { month: 'Jun', revenue: 890, expenses: 780, profit: 110 }
  ];

  const expenseBreakdown = [
    { name: 'Salaries', value: 1200, color: '#3B82F6' },
    { name: 'Facilities', value: 450, color: '#10B981' },
    { name: 'Equipment', value: 280, color: '#F59E0B' },
    { name: 'Utilities', value: 180, color: '#EF4444' },
    { name: 'Activities', value: 220, color: '#8B5CF6' }
  ];

  const revenueSources = [
    { name: 'Tuition', value: 2850, percentage: 58.8 },
    { name: 'Grants', value: 950, percentage: 19.6 },
    { name: 'Activities', value: 450, percentage: 9.3 },
    { name: 'Donations', value: 350, percentage: 7.2 },
    { name: 'Other', value: 250, percentage: 5.1 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Overview</h1>
          <p className="text-gray-600 mt-1">Monitor revenue, expenses, and budget allocation</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Last 30 days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(financialStats.totalRevenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center mt-2">
            <ArrowUpRight size={16} className="mr-1" /> +12.5% from last year
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(financialStats.totalExpenses)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 flex items-center mt-2">
            <ArrowDownRight size={16} className="mr-1" /> +8.3% from last year
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Net Income</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(financialStats.netIncome)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center mt-2">
            <ArrowUpRight size={16} className="mr-1" /> +15.2% from last year
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{financialStats.budgetUtilization}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <PieChart className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">Within target range</p>
        </div>
      </div>

      {/* Revenue & Expense Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Revenue & Expense Trends</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">Monthly</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Quarterly</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}K`} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Breakdown & Revenue Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}K`} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium ml-auto">${item.value}K</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Revenue Sources</h2>
          <div className="space-y-4">
            {revenueSources.map((source, index) => (
              <div key={source.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{source.name}</span>
                  <span className="font-medium text-gray-800">${source.value}K ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial .Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">Payroll Expenses</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(financialStats.payrollExpenses)}</p>
          <p className="text-xs text-blue-100 mt-1">31% of total expenses</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-green-100 text-sm">Operational Expenses</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(financialStats.operationalExpenses)}</p>
          <p className="text-xs text-green-100 mt-1">46% of total expenses</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Reserve Funds</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(financialStats.reserveFunds)}</p>
          <p className="text-xs text-purple-100 mt-1">6 months operating expenses</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;