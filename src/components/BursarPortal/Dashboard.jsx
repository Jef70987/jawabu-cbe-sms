/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  RefreshCw,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
  X,
  Loader2,
  Info
} from 'lucide-react';

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

  const icon = {
    success: <CheckCircle className="text-white" size={18} />,
    error: <AlertCircle className="text-white" size={18} />,
    info: <Info className="text-white" size={18} />,
    warning: <AlertCircle className="text-white" size={18} />
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white border border-gray-600 p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 border border-white/30">{icon[type]}</div>
            <div>
              <p className="font-bold capitalize">{type}</p>
              <p className="text-sm text-white/90 mt-1">{message}</p>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
            <X size={16} />
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

const BursarDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    paidStudents: 0,
    pendingStudents: 0,
    totalRevenue: 0,
    todayCollections: 0,
    recentPayments: [],
    paymentMethods: {},
    stats: {}
  });

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
    window.location.href = '/logout';
  };

  const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
    
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes} ${ampm}`);
  };

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/stats/`, {
        headers: getAuthHeaders()
      });
      if (statsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const statsData = await statsRes.json();
      
      const paymentsRes = await fetch(`${API_BASE_URL}/api/bursar/transactions/recent/?limit=5`, {
        headers: getAuthHeaders()
      });
      if (paymentsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const paymentsData = await paymentsRes.json();
      
      const methodsRes = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/payment-methods-stats/`, {
        headers: getAuthHeaders()
      });
      if (methodsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const methodsData = await methodsRes.json();
      
      const studentsRes = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders()
      });
      if (studentsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const studentsData = await studentsRes.json();
      
      const stats = statsData.success ? statsData.data : {};
      const recentPayments = paymentsData.success ? paymentsData.data : [];
      const paymentMethodsList = methodsData.success ? methodsData.data : [];
      
      const methodData = {};
      let totalAmount = paymentMethodsList.reduce((sum, method) => sum + parseFloat(method.total_amount || 0), 0);
      paymentMethodsList.forEach(method => {
        const percentage = totalAmount > 0 ? Math.round((parseFloat(method.total_amount) / totalAmount) * 100) : 0;
        methodData[method.payment_mode] = percentage;
      });
      
      const totalStudents = studentsData.success ? studentsData.data.length : 0;
      
      const today = new Date().toISOString().split('T')[0];
      const todayCollections = recentPayments
        .filter(p => p.payment_date?.split('T')[0] === today)
        .reduce((sum, p) => sum + parseFloat(p.amount_kes || 0), 0);
      
      setDashboardData({
        totalStudents,
        paidStudents: stats.completed_count || 0,
        pendingStudents: stats.pending_count || 0,
        totalRevenue: stats.total_collected || 0,
        todayCollections,
        recentPayments,
        paymentMethods: methodData,
        stats
      });
      
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 60000);
    
    if (isAuthenticated) {
      fetchDashboardData();
    }
    
    return () => clearInterval(timeInterval);
  }, [isAuthenticated, timeFrame]);

  const formatCurrency = (amount) => {
    return `KSh ${parseFloat(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Please login to access the bursar dashboard</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  if (isLoading && dashboardData.totalStudents === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`}</style>
      
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 border border-green-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user?.first_name || user?.username || 'Bursar'}</h1>
              <p className="text-green-100 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                <strong>Role:</strong> <span className="ml-1">{user?.role || 'Bursar'}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-green-100">
              <Calendar className="w-5 h-5" />
              <p className="font-medium">{currentDate}</p>
            </div>
            <div className="flex items-center justify-end gap-2 text-green-200 mt-1">
              <Clock className="w-5 h-5" />
              <p>{currentTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-300 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Total Students</h3>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 border border-blue-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              <span>Active students enrolled</span>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(dashboardData.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 border border-green-200 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              <span>Total collections to date</span>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Today's Collections</h3>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(dashboardData.todayCollections)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 border border-purple-200 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Collections for {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Transactions</h3>
                <p className="text-2xl font-bold text-orange-700">{dashboardData.stats.total_transactions || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 border border-orange-200 flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center gap-3">
              <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-green-600" /><span>{dashboardData.stats.completed_count || 0} completed</span></div>
              <div className="flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-yellow-600" /><span>{dashboardData.stats.pending_count || 0} pending</span></div>
            </div>
          </div>
        </div>

        {/* Charts and Data Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Recent Payments */}
          <div className="xl:col-span-2 bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Recent Payments</h3>
              <button onClick={() => window.location.href = '/bursar/payments'} className="text-sm text-blue-600 hover:text-blue-800">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Student</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Method</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentPayments.length > 0 ? (
                    dashboardData.recentPayments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-medium text-gray-900">{payment.first_name} {payment.last_name}</div>
                          <div className="text-xs text-gray-500">{payment.admission_no}</div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 font-bold text-green-700">{formatCurrency(payment.amount_kes)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium border ${payment.payment_mode === 'MPESA' ? 'bg-green-100 text-green-800 border-green-300' : payment.payment_mode === 'CASH' ? 'bg-blue-100 text-blue-800 border-blue-300' : payment.payment_mode === 'BANK_TRANSFER' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}>
                            {payment.payment_mode}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium border ${payment.status === 'VERIFIED' ? 'bg-green-100 text-green-800 border-green-300' : payment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 border-blue-300' : payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">No recent payments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h3 className="font-bold text-gray-900">Payment Methods Distribution</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {Object.entries(dashboardData.paymentMethods).length > 0 ? (
                  Object.entries(dashboardData.paymentMethods).map(([method, percentage]) => (
                    <div key={method} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{method}</span>
                        <span className="text-gray-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2">
                        <div className={`h-2 ${method === 'MPESA' ? 'bg-green-600' : method === 'CASH' ? 'bg-blue-600' : method === 'BANK_TRANSFER' ? 'bg-purple-600' : 'bg-yellow-600'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">No payment method data available</div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-300">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transactions:</span>
                    <span className="font-medium">{dashboardData.stats.total_transactions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Unique Students:</span>
                    <span className="font-medium">{dashboardData.stats.unique_students || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Transaction:</span>
                    <span className="font-medium">{formatCurrency(dashboardData.stats.average_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-300 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Collection Efficiency</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {dashboardData.totalStudents > 0 ? Math.round((dashboardData.paidStudents / dashboardData.totalStudents) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600">Fee collection rate</p>
              <div className="mt-4 w-full bg-gray-200 h-2">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${dashboardData.totalStudents > 0 ? Math.round((dashboardData.paidStudents / dashboardData.totalStudents) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5">
            <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Last Sync</span>
                <span className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Data Version</span>
                <span className="text-sm text-gray-600">v2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">System Status</span>
                <span className="text-sm text-green-600 flex items-center"><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span> Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BursarDashboard;