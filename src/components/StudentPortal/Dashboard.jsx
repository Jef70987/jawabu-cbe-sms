/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  User,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Settings,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Activity,
  FileText,
  Users,
  PieChart as PieChartIcon,
  Eye,
  Download,
  Building,
  Heart,
  Shield,
  Menu,
  X
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
    <div className="fixed top-4 right-4 left-4 md:left-auto z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white rounded-lg shadow-xl p-4 max-w-md mx-auto md:mx-0`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold capitalize text-sm md:text-base">{type}</p>
            <p className="text-xs md:text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white shrink-0">
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-4 py-2 md:px-6 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm md:text-base">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }) => {
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
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1 break-words">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform shrink-0`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, icon: Icon, color, children }) => {
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
    <div className={`bg-white rounded-xl shadow-sm border ${colorClasses[color]} p-4 md:p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 md:p-2 rounded-lg ${bgColorClasses[color]}`}>
          <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${color}-600`} />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Attendance Item Component
const AttendanceItem = ({ date, status, subject }) => {
  const statusColors = {
    Present: 'bg-green-100 text-green-800',
    Absent: 'bg-red-100 text-red-800',
    Late: 'bg-yellow-100 text-yellow-800',
    Excused: 'bg-blue-100 text-blue-800'
  };

  const statusIcons = {
    Present: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />,
    Absent: <XCircle className="w-3 h-3 md:w-4 md:h-4" />,
    Late: <Clock className="w-3 h-3 md:w-4 md:h-4" />,
    Excused: <FileText className="w-3 h-3 md:w-4 md:h-4" />
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{subject}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDate(date)}</p>
      </div>
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} self-start sm:self-center`}>
        {statusIcons[status]}
        {status}
      </span>
    </div>
  );
};

// Discipline Item Component
const DisciplineItem = ({ date, incident, points, status }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{incident}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDate(date)}</p>
      </div>
      <div className="text-left sm:text-right">
        <span className={`text-sm font-semibold ${points > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {points > 0 ? `+${points}` : points}
        </span>
        <p className="text-xs text-gray-400 mt-0.5">{status}</p>
      </div>
    </div>
  );
};

// Fee Item Component
const FeeItem = ({ description, amount, dueDate, status }) => {
  const statusColors = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800',
    Partial: 'bg-blue-100 text-blue-800'
  };

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{description}</p>
        <p className="text-xs text-gray-500 mt-0.5">Due: {formatDate(dueDate)}</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</p>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

// Performance Item Component
const PerformanceItem = ({ subject, score, grade, trend }) => {
  const gradeColors = {
    'Exceeding': 'bg-green-100 text-green-800',
    'Meeting': 'bg-blue-100 text-blue-800',
    'Approaching': 'bg-yellow-100 text-yellow-800',
    'Below': 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{subject}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-sm font-semibold text-gray-900">{score}%</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${gradeColors[grade]}`}>
          {grade}
        </span>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [feeSummary, setFeeSummary] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [disciplineRecords, setDisciplineRecords] = useState([]);
  const [academicPerformance, setAcademicPerformance] = useState([]);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch Student Dashboard Data from Student Portal Endpoints
  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // 1. Fetch student profile
      const profileRes = await fetch(`${API_BASE_URL}/api/student/profile/`, {
        headers: getAuthHeaders()
      });
      
      if (profileRes.status === 401) { 
        handleApiError({ status: 401 }); 
        setLoading(false);
        return; 
      }
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success) {
          setStudentProfile(profileData.data);
        }
      }
      
      // 2. Fetch fee summary
      const feeRes = await fetch(`${API_BASE_URL}/api/student/fees/summary/`, {
        headers: getAuthHeaders()
      });
      
      if (feeRes.ok) {
        const feeData = await feeRes.json();
        if (feeData.success) {
          setFeeSummary(feeData.data);
          
          // Calculate fee breakdown for chart
          if (feeData.data) {
            const breakdown = [
              { name: 'Paid', value: parseFloat(feeData.data.total_paid) || 0 },
              { name: 'Pending', value: parseFloat(feeData.data.total_fees) - (parseFloat(feeData.data.total_paid) || 0) },
              { name: 'Overdue', value: parseFloat(feeData.data.overdue_amount) || 0 }
            ];
            setFeeBreakdown(breakdown.filter(item => item.value > 0));
          }
        }
      }
      
      // 3. Fetch recent attendance
      const attendanceRes = await fetch(`${API_BASE_URL}/api/student/attendance/recent/?limit=5`, {
        headers: getAuthHeaders()
      });
      
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        if (attendanceData.success) {
          setRecentAttendance(attendanceData.data || []);
          
          // Calculate attendance summary
          const summary = { present: 0, absent: 0, late: 0, total: attendanceData.data?.length || 0 };
          (attendanceData.data || []).forEach(record => {
            if (record.attendance_status === 'Present') summary.present++;
            else if (record.attendance_status === 'Absent') summary.absent++;
            else if (record.attendance_status === 'Late') summary.late++;
          });
          setAttendanceSummary(summary);
        }
      }
      
      // 4. Fetch discipline records
      const disciplineRes = await fetch(`${API_BASE_URL}/api/student/discipline/`, {
        headers: getAuthHeaders()
      });
      
      if (disciplineRes.ok) {
        const disciplineData = await disciplineRes.json();
        if (disciplineData.success) {
          setDisciplineRecords(disciplineData.data || []);
        }
      }
      
      // 5. Fetch academic performance
      const performanceRes = await fetch(`${API_BASE_URL}/api/student/performance/current/`, {
        headers: getAuthHeaders()
      });
      
      if (performanceRes.ok) {
        const performanceData = await performanceRes.json();
        if (performanceData.success) {
          setAcademicPerformance(performanceData.data || []);
        }
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
    if (isAuthenticated && user?.role === 'student') {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Please login to access your dashboard</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg text-sm md:text-base">Go to Login</a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">This portal is only for students.</p>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Please use your student account to access this page.</p>
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
        
        @media (max-width: 640px) {
          .recharts-wrapper {
            margin: 0 auto;
          }
          .recharts-default-legend {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
          }
        }
      `}</style>
      
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <div className="p-3 md:p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                {greeting}, {studentProfile?.first_name || user?.first_name || 'Student'}!
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Welcome to your Student Dashboard
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-500">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{currentTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Clock className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                <span className="text-xs md:text-sm">{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3 mt-3 md:mt-0">
              <button 
                onClick={refreshData}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 md:h-12 md:w-12 text-blue-600" />
          </div>
        ) : (
          <>
            {/* Student Profile Card - Mobile Optimized */}
            {studentProfile && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="text-xl md:text-3xl font-bold text-white">
                        {studentProfile.first_name?.[0]}{studentProfile.last_name?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-2xl font-bold truncate">{studentProfile.first_name} {studentProfile.last_name}</h2>
                      <p className="text-blue-100 text-xs md:text-sm mt-0.5 truncate">Admission: {studentProfile.admission_no}</p>
                      <div className="flex flex-wrap gap-2 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="truncate">{studentProfile.current_class?.class_name || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="truncate">Stream: {studentProfile.stream || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="bg-white/20 rounded-lg p-2 md:p-3 text-center">
                      <p className="text-xs md:text-sm">Academic Status</p>
                      <p className="text-base md:text-xl font-bold">{studentProfile.status || 'Active'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards Row - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
              <StatCard
                title="Total Fees"
                value={formatCurrency(feeSummary?.total_fees || 0)}
                icon={DollarSign}
                color="blue"
                subtitle={`Paid: ${formatCurrency(feeSummary?.total_paid || 0)}`}
              />
              <StatCard
                title="Balance"
                value={formatCurrency(feeSummary?.balance || 0)}
                icon={CreditCard}
                color={feeSummary?.balance > 0 ? 'orange' : 'green'}
                subtitle={feeSummary?.balance > 0 ? 'Pending' : 'Fully Paid'}
              />
              <StatCard
                title="Attendance"
                value={`${attendanceSummary.total > 0 ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) : 0}%`}
                icon={Calendar}
                color="purple"
                subtitle={`${attendanceSummary.present}/${attendanceSummary.total} days`}
              />
              <StatCard
                title="Discipline"
                value={disciplineRecords.reduce((sum, d) => sum + (d.points_awarded || 0), 0)}
                icon={Award}
                color="amber"
                subtitle="Total points"
              />
            </div>

            {/* Main Content Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
              {/* Fee Breakdown Chart */}
              <InfoCard title="Fee Breakdown" icon={PieChartIcon} color="blue">
                {feeBreakdown.length > 0 ? (
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={feeBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => window.innerWidth < 640 ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={window.innerWidth < 640 ? 60 : 80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {feeBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No fee data available</p>
                  </div>
                )}
              </InfoCard>

              {/* Academic Performance */}
              <InfoCard title="Academic Performance" icon={Target} color="green">
                {academicPerformance.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {academicPerformance.map((subject, idx) => (
                      <PerformanceItem
                        key={idx}
                        subject={subject.learning_area || subject.name}
                        score={subject.score || subject.percentage}
                        grade={subject.grade || subject.rating}
                        trend={subject.trend}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No performance data available</p>
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Recent Attendance and Discipline - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
              {/* Recent Attendance */}
              <InfoCard title="Recent Attendance" icon={Calendar} color="purple">
                {recentAttendance.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {recentAttendance.map((record, idx) => (
                      <AttendanceItem
                        key={idx}
                        date={record.date || record.session?.session_date}
                        status={record.attendance_status}
                        subject={record.subject_name || 'General'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No attendance records found</p>
                  </div>
                )}
              </InfoCard>

              {/* Discipline Records */}
              <InfoCard title="Discipline Records" icon={Shield} color="orange">
                {disciplineRecords.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {disciplineRecords.map((record, idx) => (
                      <DisciplineItem
                        key={idx}
                        date={record.incident_date}
                        incident={record.description}
                        points={record.points_awarded}
                        status={record.status}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No discipline records found</p>
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Recent Fee Transactions - Responsive */}
            {feeSummary?.recent_transactions?.length > 0 && (
              <div className="mb-4 md:mb-8">
                <InfoCard title="Recent Fee Transactions" icon={DollarSign} color="cyan">
                  <div className="max-h-64 overflow-y-auto">
                    {feeSummary.recent_transactions.slice(0, 5).map((transaction, idx) => (
                      <FeeItem
                        key={idx}
                        description={transaction.description || 'Fee Payment'}
                        amount={transaction.amount}
                        dueDate={transaction.payment_date}
                        status={transaction.status}
                      />
                    ))}
                  </div>
                  {feeSummary.recent_transactions.length > 5 && (
                    <button className="mt-4 text-xs md:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      View All Transactions <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  )}
                </InfoCard>
              </div>
            )}

            {/* Quick Links - Mobile Optimized Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <button 
                onClick={() => navigateTo('/student/fees')}
                className="p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-center group"
              >
                <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs md:text-sm font-medium text-gray-700">Fee Details</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/attendance')}
                className="p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-center group"
              >
                <Calendar className="w-5 h-5 md:w-8 md:h-8 text-green-600 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs md:text-sm font-medium text-gray-700">Attendance</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/results')}
                className="p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-center group"
              >
                <BookOpen className="w-5 h-5 md:w-8 md:h-8 text-purple-600 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs md:text-sm font-medium text-gray-700">Results</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/profile')}
                className="p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-center group"
              >
                <User className="w-5 h-5 md:w-8 md:h-8 text-orange-600 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs md:text-sm font-medium text-gray-700">Profile</p>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
              <p>© {new Date().getFullYear()} School Management System. All rights reserved.</p>
              <p className="mt-1 truncate">Student Portal | {studentProfile?.first_name} {studentProfile?.last_name}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;