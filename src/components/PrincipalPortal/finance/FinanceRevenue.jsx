import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Calendar, Download,
  PieChart, BarChart3, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const FinanceRevenue = () => {
  const [timeframe, setTimeframe] = useState('year');

  const revenueStats = {
    totalRevenue: 4850000,
    projectedRevenue: 5100000,
    growthRate: 8.5,
    collectionRate: 94.2,
    outstanding: 285000
  };

  const monthlyRevenue = [
    { month: 'Jan', tuition: 720, fees: 85, grants: 120, donations: 45 },
    { month: 'Feb', tuition: 730, fees: 88, grants: 120, donations: 42 },
    { month: 'Mar', tuition: 725, fees: 86, grants: 120, donations: 48 },
    { month: 'Apr', tuition: 740, fees: 90, grants: 130, donations: 50 },
    { month: 'May', tuition: 735, fees: 88, grants: 130, donations: 52 },
    { month: 'Jun', tuition: 750, fees: 92, grants: 140, donations: 55 }
  ];

  const revenueSources = [
    { name: 'Tuition Fees', amount: 2850000, percentage: 58.8, growth: '+8.2%' },
    { name: 'Government Grants', amount: 950000, percentage: 19.6, growth: '+5.5%' },
    { name: 'Activity Fees', amount: 450000, percentage: 9.3, growth: '+3.1%' },
    { name: 'Donations', amount: 350000, percentage: 7.2, growth: '+12.4%' },
    { name: 'Other Income', amount: 250000, percentage: 5.1, growth: '+2.8%' }
  ];

  const quarterlyRevenue = [
    { quarter: 'Q1', revenue: 1250, target: 1200 },
    { quarter: 'Q2', revenue: 1320, target: 1250 },
    { quarter: 'Q3', revenue: 1280, target: 1300 },
    { quarter: 'Q4', revenue: 1350, target: 1320 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Revenue Management</h1>
          <p className="text-gray-600 mt-1">Track and analyze institutional revenue streams</p>
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

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(revenueStats.totalRevenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 8.5% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Projected Revenue</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(revenueStats.projectedRevenue)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 5.2% growth expected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Collection Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{revenueStats.collectionRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Wallet className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Above industry average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(revenueStats.outstanding)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <CreditCard className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">Needs attention</p>
        </div>
      </div>

      {/* Monthly Revenue Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Revenue Breakdown (in $K)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tuition" stackId="a" fill="#3B82F6" name="Tuition" />
            <Bar dataKey="fees" stackId="a" fill="#10B981" name="Fees" />
            <Bar dataKey="grants" stackId="a" fill="#F59E0B" name="Grants" />
            <Bar dataKey="donations" stackId="a" fill="#8B5CF6" name="Donations" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Sources & Quarterly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Revenue Sources</h2>
          <div className="space-y-4">
            {revenueSources.map((source, index) => (
              <div key={source.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">{source.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">{formatCurrency(source.amount)}</span>
                    <span className="text-xs text-green-600">{source.growth}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{source.percentage}% of total</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quarterly Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={quarterlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Actual Revenue" />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} name="Target" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue .Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-600" />
            <h4 className="font-semibold text-gray-800">Fastest Growing</h4>
          </div>
          <p className="text-lg font-bold text-green-600 mt-2">Donations (+12.4%)</p>
          <p className="text-xs text-gray-600">Increased community support</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Wallet size={20} className="text-blue-600" />
            <h4 className="font-semibold text-gray-800">Largest Source</h4>
          </div>
          <p className="text-lg font-bold text-blue-600 mt-2">Tuition Fees (58.8%)</p>
          <p className="text-xs text-gray-600">$2.85M annual revenue</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-purple-600" />
            <h4 className="font-semibold text-gray-800">Revenue Projection</h4>
          </div>
          <p className="text-lg font-bold text-purple-600 mt-2">$5.1M for FY2024</p>
          <p className="text-xs text-gray-600">5.2% growth expected</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceRevenue;