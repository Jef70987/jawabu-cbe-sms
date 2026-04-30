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
  ChevronRight,
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  FileText,
  Users,
  PieChart as PieChartIcon,
  Shield
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white border border-gray-600 p-4 min-w-[280px] max-w-md`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-bold capitalize">{type}</p>
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

const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white border border-gray-400 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-lg font-bold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-300 p-4 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1 break-words">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2 ${colors.iconBg} shrink-0 rounded-full`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white border border-gray-300 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-100 rounded-full">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const AttendanceItem = ({ date, status, subject }) => {
  const statusColors = {
    Present: 'bg-green-100 text-green-700 border-green-200',
    Absent: 'bg-red-100 text-red-700 border-red-200',
    Late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Excused: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const statusIcons = {
    Present: <CheckCircle className="w-3 h-3" />,
    Absent: <XCircle className="w-3 h-3" />,
    Late: <Clock className="w-3 h-3" />,
    Excused: <FileText className="w-3 h-3" />
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
      <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium border ${statusColors[status]} self-start sm:self-center rounded-full`}>
        {statusIcons[status]}
        {status}
      </span>
    </div>
  );
};

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
          {points > 0 ? `-${points}` : `+${Math.abs(points)}`}
        </span>
        <p className="text-xs text-gray-400 mt-0.5">{status}</p>
      </div>
    </div>
  );
};

const FeeItem = ({ description, amount, dueDate, status }) => {
  const statusColors = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Partial: 'bg-blue-100 text-blue-700 border-blue-200'
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
        <span className={`inline-block px-2 py-0.5 text-xs font-medium border mt-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const PerformanceItem = ({ subject, score, grade, trend }) => {
  const gradeColors = {
    'Exceeding': 'bg-green-100 text-green-700 border-green-200',
    'Meeting': 'bg-blue-100 text-blue-700 border-blue-200',
    'Approaching': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Below': 'bg-red-100 text-red-700 border-red-200',
    'EE': 'bg-green-100 text-green-700 border-green-200',
    'ME': 'bg-blue-100 text-blue-700 border-blue-200',
    'AE': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'BE': 'bg-red-100 text-red-700 border-red-200'
  };

  const displayGrade = grade || (score >= 80 ? 'Exceeding' : score >= 65 ? 'Meeting' : score >= 50 ? 'Approaching' : 'Below');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{subject}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-sm font-semibold text-gray-900">{score}%</span>
        <span className={`px-2 py-0.5 text-xs font-medium border rounded-full ${gradeColors[displayGrade]}`}>
          {displayGrade}
        </span>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600 shrink-0" />}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
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

  const COLORS = ['#108529', '#d42424', '#F59E0B', '#1636d6'];

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
    return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
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
      
      const feeRes = await fetch(`${API_BASE_URL}/api/student/dashboard/fees/summary/`, {
        headers: getAuthHeaders()
      });
      
      if (feeRes.ok) {
        const feeData = await feeRes.json();
        if (feeData.success) {
          setFeeSummary(feeData.data);
          
          if (feeData.data) {
            const totalFees = parseFloat(feeData.data.total_fees) || 0;
            const totalPaid = parseFloat(feeData.data.total_paid) || 0;
            const overdueAmount = parseFloat(feeData.data.overdue_amount) || 0;
            const pendingAmount = totalFees - totalPaid;
            
            const breakdown = [];
            
            if (totalFees > 0) {
              breakdown.push({ name: 'Paid', value: totalPaid });
              if (pendingAmount > 0) breakdown.push({ name: 'Pending', value: pendingAmount });
              if (overdueAmount > 0) breakdown.push({ name: 'Overdue', value: overdueAmount });
            }
            
            if (breakdown.length === 0) {
              breakdown.push({ name: 'No Fee Data', value: 1 });
            }
            
            setFeeBreakdown(breakdown);
          }
        }
      }
      
      const attendanceRes = await fetch(`${API_BASE_URL}/api/student/attendance/recent/?limit=5`, {
        headers: getAuthHeaders()
      });
      
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        if (attendanceData.success) {
          setRecentAttendance(attendanceData.data || []);
          
          const summary = { present: 0, absent: 0, late: 0, total: attendanceData.data?.length || 0 };
          (attendanceData.data || []).forEach(record => {
            if (record.attendance_status === 'Present') summary.present++;
            else if (record.attendance_status === 'Absent') summary.absent++;
            else if (record.attendance_status === 'Late') summary.late++;
          });
          setAttendanceSummary(summary);
        }
      }
      
      const disciplineRes = await fetch(`${API_BASE_URL}/api/student/discipline/`, {
        headers: getAuthHeaders()
      });
      
      if (disciplineRes.ok) {
        const disciplineData = await disciplineRes.json();
        if (disciplineData.success) {
          setDisciplineRecords(disciplineData.data || []);
        }
      }
      
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

  const refreshData = () => {
    fetchDashboardData();
    showToast('Dashboard refreshed', 'success');
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

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
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please login to access your dashboard</p>
          <a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">This portal is only for students.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <div className="p-6 w-full max-w-full">
        {/* Header Card - Green-700 background */}
        <div className="bg-green-700 p-6 mb-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {greeting}, {studentProfile?.first_name || user?.first_name || 'Student'}!
                  </h1>
                  <p className="text-green-100 mt-1">
                    Welcome to your Student Dashboard
                  </p>
                </div>
                <button 
                  onClick={refreshData}
                  className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium border border-gray-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-green-100">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
            
            {/* Student Profile Mini Card - Rounded profile picture */}
            {studentProfile && (
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200">
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {studentProfile.first_name?.[0]}{studentProfile.last_name?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{studentProfile.first_name} {studentProfile.last_name}</p>
                  <p className="text-xs text-gray-500 truncate">Adm: {studentProfile.admission_no}</p>
                  <p className="text-xs text-green-600 truncate">Class {studentProfile.current_class_name || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : (
          <>
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                subtitle={feeSummary?.balance > 0 ? 'Pending Payment' : 'Fully Paid'}
              />
              <StatCard
                title="Attendance"
                value={`${attendanceSummary.total > 0 ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) : 0}%`}
                icon={Calendar}
                color="blue"
                subtitle={`${attendanceSummary.present}/${attendanceSummary.total} days present`}
              />
              <StatCard
                title="Discipline Points"
                value={disciplineRecords.reduce((sum, d) => sum + (d.points_awarded || 0), 0)}
                icon={Award}
                color={disciplineRecords.reduce((sum, d) => sum + (d.points_awarded || 0), 0) > 0 ? 'red' : 'green'}
                subtitle={disciplineRecords.reduce((sum, d) => sum + (d.points_awarded || 0), 0) > 0 ? 'Demerit points' : 'Clean record'}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Fee Breakdown Chart */}
              <InfoCard title="Fee Breakdown" icon={PieChartIcon}>
                {feeBreakdown.length > 0 && feeBreakdown[0]?.name !== 'No Fee Data' ? (
                  <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={feeBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {feeBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No fee data available</p>
                  </div>
                )}
              </InfoCard>

              {/* Academic Performance */}
              <InfoCard title="Academic Performance" icon={Target}>
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

            {/* Recent Attendance and Discipline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Recent Attendance" icon={Calendar}>
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

              <InfoCard title="Discipline Records" icon={Shield}>
                {disciplineRecords.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {disciplineRecords.map((record, idx) => (
                      <DisciplineItem
                        key={idx}
                        date={record.incident_date}
                        incident={record.description || record.incident_type || 'Disciplinary action'}
                        points={record.points_awarded || 0}
                        status={record.status || 'Recorded'}
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

            {/* Recent Fee Transactions */}
            {feeSummary?.recent_transactions?.length > 0 && (
              <div className="mb-8">
                <InfoCard title="Recent Fee Transactions" icon={DollarSign}>
                  <div className="max-h-64 overflow-y-auto">
                    {feeSummary.recent_transactions.slice(0, 5).map((transaction, idx) => (
                      <FeeItem
                        key={idx}
                        description={transaction.description || transaction.payment_for || 'Fee Payment'}
                        amount={transaction.amount}
                        dueDate={transaction.payment_date || transaction.date}
                        status={transaction.status || (transaction.amount > 0 ? 'Paid' : 'Pending')}
                      />
                    ))}
                  </div>
                  {feeSummary.recent_transactions.length > 5 && (
                    <button 
                      onClick={() => navigateTo('/student/fees')}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View All Transactions <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </InfoCard>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => navigateTo('/student/fees')}
                className="p-4 bg-white border border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Fee Details</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/attendance')}
                className="p-4 bg-white border border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Attendance</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/results')}
                className="p-4 bg-white border border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Results</p>
              </button>
              <button 
                onClick={() => navigateTo('/student/profile')}
                className="p-4 bg-white border border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Profile</p>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Jawabu Academy. All rights reserved.</p>
              <p className="mt-1">Student Portal | {studentProfile?.first_name} {studentProfile?.last_name}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;