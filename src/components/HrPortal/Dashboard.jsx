/* eslint-disable no-unused-vars */
// HRDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Users, Building, UserPlus, UserCheck, GraduationCap,
  TrendingUp, AlertCircle, Loader2, CheckCircle, Info, X,
  BarChart3, PieChart, RefreshCw, Briefcase, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ==================== COMPONENTS ====================

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  
  const bgColors = { success: 'border-l-green-600', error: 'border-l-red-600', info: 'border-l-blue-600' };
  const icons = { success: <CheckCircle className="h-5 w-5 text-green-600" />, error: <AlertCircle className="h-5 w-5 text-red-600" />, info: <Info className="h-5 w-5 text-blue-600" /> };
  
  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border-l-4 ${bgColors[type]} border border-gray-300 shadow-lg p-4 min-w-[320px] animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information'}</p>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-700" /></div>
);

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

const HRDashboard = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [staffStats, setStaffStats] = useState(null);
  const [deptStats, setDeptStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffByCategory, setStaffByCategory] = useState([]);
  const [jssDeptData, setJssDeptData] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  
  const apiRequest = useCallback(async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }, [getAuthHeaders]);
  
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch staff stats
      const staffStatsRes = await apiRequest('/api/hr/staff/stats/');
      if (staffStatsRes.success) setStaffStats(staffStatsRes.data);
      
      // Fetch department stats
      const deptStatsRes = await apiRequest('/api/hr/departments/stats/');
      if (deptStatsRes.success) setDeptStats(deptStatsRes.data);
      
      // Fetch all departments
      const deptsRes = await apiRequest('/api/hr/departments/');
      if (deptsRes.success) setDepartments(deptsRes.data);
     
      
      // Prepare staff by category data for pie chart
      if (staffStatsRes.success) {
        setStaffByCategory([
          { name: 'JSS Teachers', value: staffStatsRes.data.jss, color: '#8B5CF6' },
          { name: 'Primary (EP)', value: staffStatsRes.data.primary, color: '#3B82F6' },
          { name: 'Early Years (PP)', value: staffStatsRes.data.earlyYears, color: '#10B981' }
        ]);
      }
      
      // Prepare JSS department data for bar chart
      if (staffStatsRes.success) {
        setJssDeptData([
          { name: 'STEM', staff: staffStatsRes.data.stem, color: '#F97316' },
          { name: 'Humanities', staff: staffStatsRes.data.humanities, color: '#14B8A6' },
          { name: 'Languages', staff: staffStatsRes.data.languages, color: '#EC4899' },
          { name: 'Technical', staff: staffStatsRes.data.technical, color: '#6366F1' }
        ]);
      }
      
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);
  
  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showToast('Dashboard refreshed', 'success');
  };
  
  useEffect(() => {
    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated, fetchDashboardData]);
  
  // Prepare department staff distribution data
  const deptDistributionData = departments.map(dept => ({
    name: dept.department_name,
    staff: dept.staff_count,
    type: dept.department_type
  })).sort((a, b) => b.staff - a.staff).slice(0, 8);
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access HR Dashboard</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">Go to Login</a>
        </div>
      </div>
    );
  }
  
  if (loading) return <div className="p-6"><LoadingSpinner /></div>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
      
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">HR Dashboard</h1>
            <p className="text-green-100 mt-1">Staff and Department Analytics</p>
          </div>
          <button onClick={refreshData} disabled={refreshing} className="px-4 py-2 bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 flex items-center gap-2 rounded-lg">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Staff" value={staffStats?.total || 0} icon={Users} color="bg-green-600" />
          <StatCard title="Active Staff" value={staffStats?.active || 0} icon={UserCheck} color="bg-blue-600" />
          <StatCard title="Departments" value={deptStats?.total || 0} icon={Building} color="bg-purple-600" />
          <StatCard title="JSS Teachers" value={staffStats?.jss || 0} icon={GraduationCap} color="bg-orange-600" />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff by Category - Pie Chart */}
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-4">Staff by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={staffByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {staffByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          
          {/* JSS Department Distribution - Bar Chart */}
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-4">JSS Department Staff Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jssDeptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="staff" fill="#F97316" radius={[4, 4, 0, 0]}>
                  {jssDeptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Department Staff Distribution - Horizontal Bar Chart */}
        <div className="bg-white border border-gray-300 rounded-lg p-5">
          <h3 className="font-bold text-gray-900 mb-4">Department Staff Distribution</h3>
          {deptDistributionData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No department data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={deptDistributionData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="staff" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                  {deptDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Academic Departments</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{deptStats?.academic || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Staff: {deptStats?.staff_in_academic || 0}</p>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Sports Departments</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{deptStats?.sports || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Staff: {deptStats?.staff_in_sports || 0}</p>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <Building className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Administrative</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{deptStats?.administrative || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Staff: {deptStats?.staff_in_administrative || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
