/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
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
  Shield,
  ChevronDown,
  ChevronUp,
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

// ── EXAM TYPE LABELS ──────────────────────────────────────────────────────────
const EXAM_TYPE_LABELS = {
  cba:      'CBA',
  sba:      'SBA',
  cat:      'CAT',
  end_term: 'End of Term',
  mock:     'Mock',
  kpsea:    'KPSEA',
  kjsea:    'KJSEA',
};

const GRADE_COLORS = {
  EE:  'bg-green-100 text-green-700 border-green-200',
  EE1: 'bg-green-100 text-green-700 border-green-200',
  EE2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ME:  'bg-blue-100 text-blue-700 border-blue-200',
  ME1: 'bg-blue-100 text-blue-700 border-blue-200',
  ME2: 'bg-sky-100 text-sky-700 border-sky-200',
  AE:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  AE1: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  AE2: 'bg-amber-100 text-amber-700 border-amber-200',
  BE:  'bg-red-100 text-red-700 border-red-200',
  BE1: 'bg-red-100 text-red-700 border-red-200',
  BE2: 'bg-rose-100 text-rose-700 border-rose-200',
};

// ── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bgColor = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-500' };
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

// ── SESSION EXPIRED ───────────────────────────────────────────────────────────
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
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }) => {
  const colorClasses = {
    blue:   { iconBg: 'bg-blue-100',   text: 'text-blue-600' },
    green:  { iconBg: 'bg-green-100',  text: 'text-green-600' },
    red:    { iconBg: 'bg-red-100',    text: 'text-red-600' },
    orange: { iconBg: 'bg-orange-100', text: 'text-orange-600' },
  };
  const colors = colorClasses[color] || colorClasses.blue;
  return (
    <div onClick={onClick} className="bg-white border border-gray-300 p-4 hover:shadow-md transition-all cursor-pointer">
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

// ── INFO CARD ─────────────────────────────────────────────────────────────────
const InfoCard = ({ title, icon: Icon, children }) => (
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

// ── EXAM RESULT CARD ──────────────────────────────────────────────────────────
// Shows one published exam with expandable subject breakdown.
const ExamResultCard = ({ exam }) => {
  const [expanded, setExpanded] = useState(false);
  const gradeColor = GRADE_COLORS[exam.overall_grade] || 'bg-gray-100 text-gray-700 border-gray-200';
  const typeLabel  = EXAM_TYPE_LABELS[exam.exam_type] || exam.exam_type;

  return (
    <div className="border border-gray-200 rounded mb-3 last:mb-0 overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 truncate">{exam.exam_title}</span>
            <span className="px-1.5 py-0.5 text-xs bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full shrink-0">
              {typeLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-500">
            <span>Term {exam.term} · {exam.academic_year}</span>
            <span>{exam.subjects_count} subject{exam.subjects_count !== 1 ? 's' : ''}</span>
            <span>Avg: <strong className="text-gray-700">{exam.average_percentage}%</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className={`px-2 py-0.5 text-xs font-bold border rounded-full ${gradeColor}`}>
            {exam.overall_grade || '—'}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-gray-500" />
            : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {/* Expandable subject rows */}
      {expanded && (
        <div className="divide-y divide-gray-100">
          {exam.subjects.map((s, idx) => {
            const sg = GRADE_COLORS[s.grade] || 'bg-gray-100 text-gray-700 border-gray-200';
            return (
              <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{s.subject}</p>
                  {s.remarks && <p className="text-xs text-gray-400 truncate mt-0.5">{s.remarks}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-sm font-semibold text-gray-700">{s.percentage}%</span>
                  <span className={`px-2 py-0.5 text-xs font-medium border rounded-full ${sg}`}>
                    {s.grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── ATTENDANCE ITEM ───────────────────────────────────────────────────────────
const AttendanceItem = ({ date, status, subject }) => {
  const statusColors = {
    Present: 'bg-green-100 text-green-700 border-green-200',
    Absent:  'bg-red-100 text-red-700 border-red-200',
    Late:    'bg-yellow-100 text-yellow-700 border-yellow-200',
    Excused: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  const statusIcons = {
    Present: <CheckCircle className="w-3 h-3" />,
    Absent:  <XCircle className="w-3 h-3" />,
    Late:    <Clock className="w-3 h-3" />,
    Excused: <FileText className="w-3 h-3" />,
  };
  const formatDate = d => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : 'N/A';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{subject}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDate(date)}</p>
      </div>
      <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium border ${statusColors[status]} self-start sm:self-center rounded-full`}>
        {statusIcons[status]} {status}
      </span>
    </div>
  );
};

// ── DISCIPLINE ITEM ───────────────────────────────────────────────────────────
const DisciplineItem = ({ date, incident, points, status }) => {
  const formatDate = d => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : 'N/A';
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

// ── FEE ITEM ──────────────────────────────────────────────────────────────────
const FeeItem = ({ description, amount, dueDate, status }) => {
  const statusColors = {
    Paid:    'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Partial: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  const formatCurrency = a => `KES ${parseFloat(a).toLocaleString()}`;
  const formatDate = d => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : 'N/A';
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

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [loading,             setLoading]             = useState(true);
  const [studentProfile,      setStudentProfile]      = useState(null);
  const [feeSummary,          setFeeSummary]          = useState(null);
  const [recentAttendance,    setRecentAttendance]    = useState([]);
  const [disciplineRecords,   setDisciplineRecords]   = useState([]);
  const [recentExams,         setRecentExams]         = useState([]);   // ← replaces academicPerformance
  const [feeBreakdown,        setFeeBreakdown]        = useState([]);
  const [attendanceSummary,   setAttendanceSummary]   = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [toasts,              setToasts]              = useState([]);
  const [showSessionExpired,  setShowSessionExpired]  = useState(false);
  const [currentTime,         setCurrentTime]         = useState(new Date());
  const [greeting,            setGreeting]            = useState('');

  const COLORS = ['#108529', '#d42424', '#F59E0B', '#1636d6'];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now);
      const h = now.getHours();
      setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const handleApiError = useCallback((error) => {
    if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
      setShowSessionExpired(true);
    }
  }, []);

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = '/login';
  };

  const formatCurrency = amount => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatTime = date =>
    date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    setLoading(true);
    try {
      // ── Profile ──────────────────────────────────────────────────────────
      const profileRes = await fetch(`${API_BASE_URL}/api/student/profile/`, { headers: getAuthHeaders() });
      if (profileRes.status === 401) { handleApiError({ status: 401 }); setLoading(false); return; }
      if (profileRes.ok) {
        const d = await profileRes.json();
        if (d.success) setStudentProfile(d.data);
      }

      // ── Fees ─────────────────────────────────────────────────────────────
      const feeRes = await fetch(`${API_BASE_URL}/api/student/dashboard/fees/summary/`, { headers: getAuthHeaders() });
      if (feeRes.ok) {
        const d = await feeRes.json();
        if (d.success && d.data) {
          setFeeSummary(d.data);
          const totalFees = parseFloat(d.data.total_fees) || 0;
          const totalPaid = parseFloat(d.data.total_paid) || 0;
          const overdueAmount = parseFloat(d.data.overdue_amount) || 0;
          const pendingAmount = totalFees - totalPaid;
          const breakdown = [];
          if (totalFees > 0) {
            breakdown.push({ name: 'Paid', value: totalPaid });
            if (pendingAmount > 0) breakdown.push({ name: 'Pending', value: pendingAmount });
            if (overdueAmount > 0) breakdown.push({ name: 'Overdue', value: overdueAmount });
          }
          setFeeBreakdown(breakdown.length ? breakdown : [{ name: 'No Fee Data', value: 1 }]);
        }
      }

      // ── Attendance ────────────────────────────────────────────────────────
      const attRes = await fetch(`${API_BASE_URL}/api/student/attendance/recent/?limit=5`, { headers: getAuthHeaders() });
      if (attRes.ok) {
        const d = await attRes.json();
        if (d.success) {
          setRecentAttendance(d.data || []);
          const summary = { present: 0, absent: 0, late: 0, total: d.data?.length || 0 };
          (d.data || []).forEach(r => {
            if (r.attendance_status === 'Present') summary.present++;
            else if (r.attendance_status === 'Absent') summary.absent++;
            else if (r.attendance_status === 'Late') summary.late++;
          });
          setAttendanceSummary(summary);
        }
      }

      // ── Discipline ────────────────────────────────────────────────────────
      const discRes = await fetch(`${API_BASE_URL}/api/student/discipline/`, { headers: getAuthHeaders() });
      if (discRes.ok) {
        const d = await discRes.json();
        if (d.success) setDisciplineRecords(d.data || []);
      }

      // ── Recent published exams ────────────────────────────────────────────
      // Uses the new endpoint that returns per-exam cards (not per-subject aggregates)
      const examRes = await fetch(
        `${API_BASE_URL}/api/student/exams/published/recent/?limit=10`,
        { headers: getAuthHeaders() }
      );
      if (examRes.ok) {
        const d = await examRes.json();
        if (d.success) setRecentExams(d.data || []);
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, isAuthenticated, showToast]);

  const refreshData = () => { fetchDashboardData(); showToast('Dashboard refreshed', 'success'); };
  const navigateTo = path => { window.location.href = path; };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') fetchDashboardData();
    else setLoading(false);
  }, [fetchDashboardData, isAuthenticated, user?.role]);

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
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type}
          onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <div className="p-6 w-full max-w-full">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="bg-green-700 p-6 mb-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {greeting}, {studentProfile?.first_name || user?.first_name || 'Student'}!
                  </h1>
                  <p className="text-green-100 mt-1">Welcome to your Student Dashboard</p>
                </div>
                <button onClick={refreshData}
                  className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium border border-gray-200">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-green-100">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
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
            {/* ── Stat Cards ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Fees"
                value={formatCurrency(feeSummary?.total_fees || 0)}
                icon={DollarSign} color="blue"
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
                icon={Calendar} color="blue"
                subtitle={`${attendanceSummary.present}/${attendanceSummary.total} days present`}
              />
              <StatCard
                title="Discipline Points"
                value={disciplineRecords.reduce((s, d) => s + (d.points_awarded || 0), 0)}
                icon={Award}
                color={disciplineRecords.reduce((s, d) => s + (d.points_awarded || 0), 0) > 0 ? 'red' : 'green'}
                subtitle={disciplineRecords.reduce((s, d) => s + (d.points_awarded || 0), 0) > 0 ? 'Demerit points' : 'Clean record'}
              />
            </div>

            {/* ── Fee Chart + Recent Exams ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Fee Breakdown Chart */}
              <InfoCard title="Fee Breakdown" icon={PieChartIcon}>
                {feeBreakdown.length > 0 && feeBreakdown[0]?.name !== 'No Fee Data' ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={feeBreakdown} cx="50%" cy="50%" labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100} dataKey="value">
                        {feeBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={v => formatCurrency(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No fee data available</p>
                  </div>
                )}
              </InfoCard>

              {/* ── Recent Published Exams ───────────────────────────────────── */}
              {/* Each exam is a collapsible card showing all subjects + grades */}
              <InfoCard title="Recent Exam Results" icon={Target}>
                {recentExams.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto pr-1">
                    {recentExams.map(exam => (
                      <ExamResultCard key={exam.exam_id} exam={exam} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No published exam results yet</p>
                  </div>
                )}
                {recentExams.length > 0 && (
                  <button onClick={() => navigateTo('/student/results')}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View Full Results <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </InfoCard>
            </div>

            {/* ── Attendance + Discipline ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Recent Attendance" icon={Calendar}>
                {recentAttendance.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {recentAttendance.map((record, idx) => (
                      <AttendanceItem key={idx}
                        date={record.date || record.session?.session_date}
                        status={record.attendance_status}
                        subject={record.subject_name || 'General'} />
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
                      <DisciplineItem key={idx}
                        date={record.incident_date}
                        incident={record.description || record.incident_type || 'Disciplinary action'}
                        points={record.points_awarded || 0}
                        status={record.status || 'Recorded'} />
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

            {/* ── Recent Fee Transactions ──────────────────────────────────────── */}
            {feeSummary?.recent_transactions?.length > 0 && (
              <div className="mb-8">
                <InfoCard title="Recent Fee Transactions" icon={DollarSign}>
                  <div className="max-h-64 overflow-y-auto">
                    {feeSummary.recent_transactions.slice(0, 5).map((t, idx) => (
                      <FeeItem key={idx}
                        description={t.description || t.payment_for || 'Fee Payment'}
                        amount={t.amount}
                        dueDate={t.payment_date || t.date}
                        status={t.status || (t.amount > 0 ? 'Paid' : 'Pending')} />
                    ))}
                  </div>
                  {feeSummary.recent_transactions.length > 5 && (
                    <button onClick={() => navigateTo('/student/fees')}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      View All Transactions <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </InfoCard>
              </div>
            )}

            {/* ── Quick Links ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { path: '/student/fees',       icon: DollarSign, label: 'Fee Details' },
                { path: '/student/attendance',  icon: Calendar,   label: 'Attendance' },
                { path: '/student/results',     icon: BookOpen,   label: 'Results' },
                { path: '/student/profile',     icon: User,       label: 'Profile' },
              ].map(({ path, icon: Icon, label }) => (
                <button key={path} onClick={() => navigateTo(path)}
                  className="p-4 bg-white border border-gray-300 hover:bg-gray-50 transition-all text-center">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                </button>
              ))}
            </div>

            {/* ── Footer ──────────────────────────────────────────────────────── */}
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
