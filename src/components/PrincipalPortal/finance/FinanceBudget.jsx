import React, { useState } from 'react';
import {
  Target, PieChart, TrendingUp, TrendingDown,
  Download, Eye, Edit2, Plus, Search,
  Filter, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

const FinanceBudget = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const budgetData = {
    totalBudget: 5200000,
    allocated: 4082000,
    spent: 3200000,
    remaining: 882000,
    utilizationRate: 78.5
  };

  const departmentBudgets = [
    { department: 'Academics', allocated: 1850000, spent: 1450000, remaining: 400000, utilization: 78 },
    { department: 'Administration', allocated: 850000, spent: 680000, remaining: 170000, utilization: 80 },
    { department: 'Facilities', allocated: 1200000, spent: 950000, remaining: 250000, utilization: 79 },
    { department: 'Student Services', allocated: 650000, spent: 510000, remaining: 140000, utilization: 78 },
    { department: 'Technology', allocated: 450000, spent: 350000, remaining: 100000, utilization: 78 },
    { department: 'Sports & Activities', allocated: 350000, spent: 260000, remaining: 90000, utilization: 74 }
  ];

  const monthlyBudget = [
    { month: 'Jul', budget: 420, actual: 380, variance: 40 },
    { month: 'Aug', budget: 430, actual: 395, variance: 35 },
    { month: 'Sep', budget: 440, actual: 410, variance: 30 },
    { month: 'Oct', budget: 435, actual: 405, variance: 30 },
    { month: 'Nov', budget: 445, actual: 420, variance: 25 },
    { month: 'Dec', budget: 450, actual: 430, variance: 20 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Budget Management</h1>
          <p className="text-gray-600 mt-1">Plan, track, and manage institutional budget</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">FY 2024</option>
            <option value="2023">FY 2023</option>
            <option value="2022">FY 2022</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Budget</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Budget</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(budgetData.totalBudget)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Allocated</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(budgetData.allocated)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Spent to Date</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(budgetData.spent)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingDown className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{budgetData.utilizationRate}% utilized</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Remaining</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(budgetData.remaining)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget vs Actual */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Budget vs Actual (in $K)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyBudget}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="#3B82F6" strokeWidth={2} name="Budget" />
            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Budget Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Department Budget Allocation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentBudgets.map((dept, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{dept.department}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(dept.allocated)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(dept.spent)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(dept.remaining)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{dept.utilization}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${dept.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dept.utilization >= 80 ? 'bg-green-100 text-green-800' :
                      dept.utilization >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.utilization >= 80 ? 'On Track' : dept.utilization >= 70 ? 'Caution' : 'Behind'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget. Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Budget Highlights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Variance</span>
              <span className="font-semibold text-green-600">+$180K (Favorable)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Largest Department</span>
              <span className="font-semibold text-gray-800">Academics ($1.85M)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Highest Utilization</span>
              <span className="font-semibold text-blue-600">Administration (80%)</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Budget Recommendations</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5" />
              <span>Increase Technology budget by 10% for digital transformation</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
              <span>Review Facilities spending for cost optimization</span>
            </li>
            <li className="flex items-start space-x-2">
              <TrendingUp size={16} className="text-blue-500 mt-0.5" />
              <span>Allocate additional funds to Student Services</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinanceBudget;