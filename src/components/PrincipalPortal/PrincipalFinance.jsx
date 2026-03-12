import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Download, Calendar,
  Filter, PieChart as PieChartIcon, BarChart3, CreditCard,
  Wallet, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const PrincipalFinance = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  
  const revenueData = [
    { month: 'Jan', tuition: 850000, activities: 120000, grants: 200000, other: 50000 },
    { month: 'Feb', tuition: 860000, activities: 115000, grants: 200000, other: 45000 },
    { month: 'Mar', tuition: 855000, activities: 130000, grants: 200000, other: 55000 },
    { month: 'Apr', tuition: 870000, activities: 125000, grants: 250000, other: 60000 },
    { month: 'May', tuition: 865000, activities: 140000, grants: 250000, other: 58000 },
    { month: 'Jun', tuition: 890000, activities: 135000, grants: 300000, other: 65000 },
  ];

  const expenseData = [
    { category: 'Salaries', amount: 1200000, color: '#3B82F6' },
    { category: 'Facilities', amount: 450000, color: '#10B981' },
    { category: 'Equipment', amount: 280000, color: '#F59E0B' },
    { category: 'Utilities', amount: 180000, color: '#EF4444' },
    { category: 'Activities', amount: 220000, color: '#8B5CF6' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Tuition Payment - Spring Semester', amount: 450000, type: 'income', date: '2024-03-15', status: 'completed' },
    { id: 2, description: 'Staff Salaries - March', amount: -320000, type: 'expense', date: '2024-03-14', status: 'completed' },
    { id: 3, description: 'Government Grant', amount: 300000, type: 'income', date: '2024-03-13', status: 'completed' },
    { id: 4, description: 'Lab Equipment Purchase', amount: -85000, type: 'expense', date: '2024-03-12', status: 'pending' },
    { id: 5, description: 'Sports Activities Fund', amount: -45000, type: 'expense', date: '2024-03-11', status: 'completed' },
  ];

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
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>2024</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">$4.85M</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight size={16} className="mr-1" /> +12.5% from last year
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">$3.92M</p>
              <p className="text-sm text-red-600 flex items-center mt-2">
                <ArrowDownRight size={16} className="mr-1" /> +8.3% from last year
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">$930K</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight size={16} className="mr-1" /> +15.2% from last year
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">78.5%</p>
              <p className="text-sm text-orange-600 flex items-center mt-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span> Within target
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <PieChartIcon className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Breakdown</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 text-sm rounded-lg transition ${
                  timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeframe('quarterly')}
                className={`px-3 py-1 text-sm rounded-lg transition ${
                  timeframe === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Quarterly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tuition" fill="#3B82F6" stackId="a" />
              <Bar dataKey="activities" fill="#10B981" stackId="a" />
              <Bar dataKey="grants" fill="#F59E0B" stackId="a" />
              <Bar dataKey="other" fill="#8B5CF6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Expense Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {expenseData.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <span className="font-medium text-gray-800">${(item.amount / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? 
                          <ArrowUpRight size={16} className="text-green-600" /> : 
                          <ArrowDownRight size={16} className="text-red-600" />
                        }
                      </div>
                      <span className="font-medium text-gray-800">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{transaction.date}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
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

export default PrincipalFinance;