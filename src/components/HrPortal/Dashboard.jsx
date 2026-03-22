/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Settings,
  DollarSign,
  Umbrella,
  HandCoins,
  Activity,
  Building,
  Award,
  PieChart as PieChartIcon,
  ChevronRight,
  Users2,
  Banknote,
  Clock as ClockIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Percent
} from 'lucide-react';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white rounded-lg shadow-xl p-4 min-w-[320px]`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold capitalize">{type}</p>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
            <AlertCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Session Expired Modal
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <LogOut className="h-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, onClick, trend, trendValue }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600',
    pink: 'bg-pink-50 text-pink-600'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Data Card Component
const DataCard = ({ title, icon: Icon, color, children, viewAllLink }) => {
  const colorClasses = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    orange: 'border-orange-200',
    pink: 'border-pink-200'
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    pink: 'bg-pink-50'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bgColorClasses[color]}`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {viewAllLink && (
          <button 
            onClick={() => window.location.href = viewAllLink}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// Leave Item Component
const LeaveItem = ({ staffName, leaveType, startDate, endDate, status }) => {
  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
    Cancelled: 'bg-gray-100 text-gray-800'
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{staffName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{leaveType}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(startDate)} - {formatDate(endDate)}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

// Loan Item Component
const LoanItem = ({ staffName, loanType, amount, status, appliedDate }) => {
  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Disbursed: 'bg-blue-100 text-blue-800',
    Active: 'bg-purple-100 text-purple-800',
    Settled: 'bg-gray-100 text-gray-800'
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{staffName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{loanType} - {formatCurrency(amount)}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(appliedDate)}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

const HrDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [staffStats, setStaffStats] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [employmentTypeData, setEmploymentTypeData] = useState([]);
  const [monthlyHires, setMonthlyHires] = useState([]);
  const [monthlyPayroll, setMonthlyPayroll] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  // Update greeting and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper Functions
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleApiError = (error) => {
    if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
      setShowSessionExpired(true);
    }
  };

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = '/login';
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Fetch Dashboard Data from Backend
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // 1. Fetch staff statistics
      const statsRes = await fetch(`${API_BASE_URL}/api/hr/staff/stats/`, {
        headers: getAuthHeaders()
      });
      
      if (statsRes.status === 401) { 
        handleApiError({ status: 401 }); 
        setLoading(false);
        return; 
      }
      
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStaffStats(statsData.data);
      }
      
      // 2. Fetch all staff for department distribution
      const staffRes = await fetch(`${API_BASE_URL}/api/hr/staff/?limit=100`, {
        headers: getAuthHeaders()
      });
      
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        if (staffData.success && staffData.data) {
          setAllStaff(staffData.data);
          
          // Calculate department distribution
          const deptMap = new Map();
          const employmentMap = new Map();
          
          staffData.data.forEach(staff => {
            // Department distribution
            const dept = staff.department || 'Other';
            deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
            
            // Employment type distribution
            const empType = staff.employment_type || 'Other';
            employmentMap.set(empType, (employmentMap.get(empType) || 0) + 1);
          });
          
          const deptData = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value }));
          const empData = Array.from(employmentMap.entries()).map(([name, value]) => ({ name, value }));
          
          setDepartmentData(deptData);
          setEmploymentTypeData(empData);
          
          // Generate monthly hires data (last 6 months based on employment dates)
          const months = [];
          const hiresCount = {};
          
          // Get last 6 months
          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleDateString('en-KE', { month: 'short' });
            months.push(monthName);
            hiresCount[monthName] = 0;
          }
          
          // Count hires per month from actual data
          staffData.data.forEach(staff => {
            if (staff.employment_date) {
              const hireDate = new Date(staff.employment_date);
              const hireMonth = hireDate.toLocaleDateString('en-KE', { month: 'short' });
              if (months.includes(hireMonth)) {
                hiresCount[hireMonth] = (hiresCount[hireMonth] || 0) + 1;
              }
            }
          });
          
          const hiresData = months.map(month => ({
            month,
            hires: hiresCount[month] || 0
          }));
          setMonthlyHires(hiresData);
          
          // Generate monthly payroll trend from actual salary data
          const payrollByMonth = {};
          months.forEach(month => payrollByMonth[month] = 0);
          
          staffData.data.forEach(staff => {
            if (staff.employment_date && staff.basic_salary) {
              const hireDate = new Date(staff.employment_date);
              const hireMonth = hireDate.toLocaleDateString('en-KE', { month: 'short' });
              if (months.includes(hireMonth)) {
                payrollByMonth[hireMonth] += parseFloat(staff.basic_salary) || 0;
              }
            }
          });
          
          const payrollData = months.map(month => ({
            month,
            amount: payrollByMonth[month] || 0
          }));
          setMonthlyPayroll(payrollData);
        }
      }
      
      // 3. Fetch recent leave requests
      try {
        if (allStaff.length > 0) {
          const leavesPromises = allStaff.slice(0, 10).map(async (staff) => {
            const leavesRes = await fetch(`${API_BASE_URL}/api/hr/staff/${staff.id}/leaves/?limit=2`, {
              headers: getAuthHeaders()
            });
            if (leavesRes.ok) {
              const leavesData = await leavesRes.json();
              if (leavesData.success && leavesData.data) {
                return leavesData.data.map(leave => ({
                  ...leave,
                  staffName: `${staff.first_name} ${staff.last_name}`,
                  staffId: staff.staff_id
                }));
              }
            }
            return [];
          });
          
          const allLeaves = await Promise.all(leavesPromises);
          const flattenedLeaves = allLeaves.flat();
          const sortedLeaves = flattenedLeaves.sort((a, b) => 
            new Date(b.applied_date) - new Date(a.applied_date)
          ).slice(0, 5);
          
          setRecentLeaves(sortedLeaves);
        }
      } catch (err) {
        console.log('Could not fetch recent leaves:', err);
      }
      
      // 4. Fetch recent loan applications
      try {
        if (allStaff.length > 0) {
          const loansPromises = allStaff.slice(0, 10).map(async (staff) => {
            const loansRes = await fetch(`${API_BASE_URL}/api/hr/staff/${staff.id}/loans/?limit=2`, {
              headers: getAuthHeaders()
            });
            if (loansRes.ok) {
              const loansData = await loansRes.json();
              if (loansData.success && loansData.data) {
                return loansData.data.map(loan => ({
                  ...loan,
                  staffName: `${staff.first_name} ${staff.last_name}`,
                  staffId: staff.staff_id
                }));
              }
            }
            return [];
          });
          
          const allLoans = await Promise.all(loansPromises);
          const flattenedLoans = allLoans.flat();
          const sortedLoans = flattenedLoans.sort((a, b) => 
            new Date(b.applied_date) - new Date(a.applied_date)
          ).slice(0, 5);
          
          setRecentLoans(sortedLoans);
        }
      } catch (err) {
        console.log('Could not fetch recent loans:', err);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = () => {
    fetchDashboardData();
    showToast('Dashboard refreshed', 'success');
  };

  // Navigation handlers
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please login to access the HR dashboard</p>
          <a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
      
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <div className="p-4 md:p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {greeting}, {user?.first_name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                HR Management Dashboard - Complete Staff Overview
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button 
                onClick={refreshData}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button 
                onClick={() => navigateTo('/settings')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : (
          <>
            {/* Stats Cards Row - Comprehensive Staff Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Staff"
                value={staffStats?.total_staff?.toLocaleString() || '0'}
                icon={Users}
                color="blue"
                onClick={() => navigateTo('/staff')}
                trend="up"
                trendValue="+5% vs last month"
              />
              <StatCard
                title="Active Staff"
                value={staffStats?.active_staff?.toLocaleString() || '0'}
                icon={UserCheck}
                color="green"
                onClick={() => navigateTo('/staff?status=Active')}
                trend="up"
                trendValue="+3% vs last month"
              />
              <StatCard
                title="On Leave"
                value={((staffStats?.total_staff || 0) - (staffStats?.active_staff || 0)).toLocaleString()}
                icon={Umbrella}
                color="orange"
                onClick={() => navigateTo('/staff/leaves')}
                trend="down"
                trendValue="-2% vs last month"
              />
              <StatCard
                title="Departments"
                value={departmentData.length || '0'}
                icon={Building}
                color="purple"
                onClick={() => navigateTo('/staff?group=department')}
              />
            </div>

            {/* Second Row - Financial Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Monthly Payroll"
                value={formatCurrency(staffStats?.total_monthly_salary || 0)}
                icon={DollarSign}
                color="cyan"
                onClick={() => navigateTo('/staff/payroll')}
                trend="up"
                trendValue="+8% vs last month"
              />
              <StatCard
                title="Average Salary"
                value={staffStats?.total_staff ? formatCurrency(staffStats.total_monthly_salary / staffStats.total_staff) : 'KES 0'}
                icon={Banknote}
                color="pink"
                onClick={() => navigateTo('/staff/payroll')}
              />
              <StatCard
                title="Pending Leaves"
                value={recentLeaves.filter(l => l.status === 'Pending').length}
                icon={ClockIcon}
                color="amber"
                onClick={() => navigateTo('/staff/leaves?status=Pending')}
              />
              <StatCard
                title="Active Loans"
                value={recentLoans.filter(l => l.status === 'Active' || l.status === 'Disbursed').length}
                icon={HandCoins}
                color="red"
                onClick={() => navigateTo('/staff/loans?status=Active')}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Department Distribution - Pie Chart */}
              <DataCard title="Department Distribution" icon={PieChartIcon} color="blue">
                {departmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No department data available</p>
                  </div>
                )}
              </DataCard>

              {/* Employment Type Distribution - Pie Chart */}
              <DataCard title="Employment Type Distribution" icon={Users2} color="green">
                {employmentTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={employmentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {employmentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No employment type data available</p>
                  </div>
                )}
              </DataCard>
            </div>

            {/* Line Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Hires Trend - Line Chart */}
              <DataCard title="Monthly Hires Trend" icon={TrendingUp} color="purple">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyHires}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hires" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </DataCard>

              {/* Monthly Payroll Trend - Area Chart */}
              <DataCard title="Monthly Payroll Trend" icon={DollarSign} color="orange">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyPayroll}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `KES ${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area type="monotone" dataKey="amount" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </DataCard>
            </div>

            {/* Staff Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900">Staff Overview</h3>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Active Rate</span>
                      <span className="font-bold text-blue-900">
                        {staffStats?.total_staff ? Math.round((staffStats.active_staff / staffStats.total_staff) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 rounded-full h-2" 
                        style={{ width: `${staffStats?.total_staff ? (staffStats.active_staff / staffStats.total_staff) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Teaching Staff</span>
                    <span className="font-bold text-blue-900">{staffStats?.teachers || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Admin Staff</span>
                    <span className="font-bold text-blue-900">{staffStats?.admin_staff || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Support Staff</span>
                    <span className="font-bold text-blue-900">
                      {(staffStats?.total_staff || 0) - (staffStats?.teachers || 0) - (staffStats?.admin_staff || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900">Leave Summary</h3>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">On Leave Today</span>
                    <span className="font-bold text-green-900">
                      {recentLeaves.filter(l => 
                        l.status === 'Approved' && 
                        new Date(l.start_date) <= new Date() && 
                        new Date(l.end_date) >= new Date()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Pending Requests</span>
                    <span className="font-bold text-green-900">
                      {recentLeaves.filter(l => l.status === 'Pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Approved This Month</span>
                    <span className="font-bold text-green-900">
                      {recentLeaves.filter(l => 
                        l.status === 'Approved' && 
                        new Date(l.applied_date).getMonth() === new Date().getMonth()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Total Leave Days Used</span>
                    <span className="font-bold text-green-900">
                      {recentLeaves.reduce((sum, l) => sum + (l.total_days || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-900">Loan Summary</h3>
                  <HandCoins className="w-8 h-8 text-purple-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-800">Active Loans</span>
                    <span className="font-bold text-purple-900">
                      {recentLoans.filter(l => l.status === 'Active' || l.status === 'Disbursed').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-800">Pending Applications</span>
                    <span className="font-bold text-purple-900">
                      {recentLoans.filter(l => l.status === 'Pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-800">Total Disbursed</span>
                    <span className="font-bold text-purple-900">
                      {formatCurrency(
                        recentLoans
                          .filter(l => l.status === 'Disbursed' || l.status === 'Active')
                          .reduce((sum, l) => sum + (parseFloat(l.loan_amount) || 0), 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-800">Avg Loan Amount</span>
                    <span className="font-bold text-purple-900">
                      {formatCurrency(
                        recentLoans.length > 0 
                          ? recentLoans.reduce((sum, l) => sum + (parseFloat(l.loan_amount) || 0), 0) / recentLoans.length 
                          : 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leave Requests */}
              <DataCard 
                title="Recent Leave Requests" 
                icon={Umbrella} 
                color="blue"
                viewAllLink="/staff/leaves"
              >
                {recentLeaves.length === 0 ? (
                  <div className="text-center py-8">
                    <Umbrella className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recent leave requests</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {recentLeaves.map(leave => (
                      <LeaveItem
                        key={leave.id}
                        staffName={leave.staffName}
                        leaveType={leave.leave_type}
                        startDate={leave.start_date}
                        endDate={leave.end_date}
                        status={leave.status}
                      />
                    ))}
                  </div>
                )}
              </DataCard>

              {/* Recent Loan Applications */}
              <DataCard 
                title="Recent Loan Applications" 
                icon={HandCoins} 
                color="purple"
                viewAllLink="/staff/loans"
              >
                {recentLoans.length === 0 ? (
                  <div className="text-center py-8">
                    <HandCoins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recent loan applications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {recentLoans.map(loan => (
                      <LoanItem
                        key={loan.id}
                        staffName={loan.staffName}
                        loanType={loan.loan_type}
                        amount={loan.loan_amount}
                        status={loan.status}
                        appliedDate={loan.applied_date}
                      />
                    ))}
                  </div>
                )}
              </DataCard>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} HR Management System. All rights reserved.</p>
              <p className="mt-1">Logged in as: {user?.first_name} {user?.last_name} ({user?.role})</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HrDashboard;