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

// Toast Notification Component
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
    success: 'bg-gradient-to-r from-emerald-500 to-green-500',
    error: 'bg-gradient-to-r from-rose-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500'
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
      <div className={`${bgColor[type]} text-white rounded-lg shadow-xl p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">{icon[type]}</div>
            <div>
              <p className="font-semibold capitalize">{type}</p>
              <p className="text-sm text-white/90 mt-1">{message}</p>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10">
            <X size={16} />
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
  
  // Dashboard data
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

  // Update date and time
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Fetch transaction statistics
      const statsRes = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/stats/`, {
        headers: getAuthHeaders()
      });
      if (statsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const statsData = await statsRes.json();
      
      // Fetch recent payments
      const paymentsRes = await fetch(`${API_BASE_URL}/api/bursar/transactions/recent/?limit=5`, {
        headers: getAuthHeaders()
      });
      if (paymentsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const paymentsData = await paymentsRes.json();
      
      // Fetch payment methods stats
      const methodsRes = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/payment-methods-stats/`, {
        headers: getAuthHeaders()
      });
      if (methodsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const methodsData = await methodsRes.json();
      
      // Fetch total students
      const studentsRes = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders()
      });
      if (studentsRes.status === 401) { handleApiError({ status: 401 }); return; }
      const studentsData = await studentsRes.json();
      
      const stats = statsData.success ? statsData.data : {};
      const recentPayments = paymentsData.success ? paymentsData.data : [];
      const paymentMethodsList = methodsData.success ? methodsData.data : [];
      
      // Calculate payment method percentages
      const methodData = {};
      let totalAmount = paymentMethodsList.reduce((sum, method) => sum + parseFloat(method.total_amount || 0), 0);
      paymentMethodsList.forEach(method => {
        const percentage = totalAmount > 0 ? Math.round((parseFloat(method.total_amount) / totalAmount) * 100) : 0;
        methodData[method.payment_mode] = percentage;
      });
      
      const totalStudents = studentsData.success ? studentsData.data.length : 0;
      
      // Calculate today's collections
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

  // Initialize
  useEffect(() => {
    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 60000);
    
    if (isAuthenticated) {
      fetchDashboardData();
    }
    
    return () => clearInterval(timeInterval);
  }, [isAuthenticated, timeFrame]);

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${parseFloat(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold">Authentication Required</h2><p className="text-gray-600 mt-2">Please login to access the bursar dashboard</p><a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Login</a></div>
      </div>
    );
  }

  if (isLoading && dashboardData.totalStudents === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center"><Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" /><p className="text-lg text-gray-600">Loading dashboard data...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full">
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`}</style>
      
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}

      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome, {user?.first_name || user?.username || 'Bursar'}</h1>
                <p className="text-gray-600 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <strong>Role:</strong> {user?.role || 'Bursar'}
                </p>
              </div>
            </div>
            <div className="text-right w-full md:w-auto">
              <div className="flex items-center justify-end space-x-2 text-gray-700">
                <Calendar className="w-5 h-5" />
                <p className="font-medium text-sm md:text-base">{currentDate}</p>
              </div>
              <div className="flex items-center justify-end space-x-2 text-gray-600 mt-1">
                <Clock className="w-5 h-5" />
                <p className="text-sm md:text-base">{currentTime}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 md:px-6 py-4 md:py-6">
        {/* Controls */}
        <div className="w-full mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* <select 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select> */}
        </div>

        {/* Stats Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-semibold mb-2">Total Students</h3><p className="text-2xl md:text-3xl font-bold">{dashboardData.totalStudents.toLocaleString()}</p></div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"><Users className="w-6 h-6" /></div>
            </div>
            <div className="mt-4 text-sm opacity-90"><div className="flex items-center"><TrendingUp className="w-4 h-4 mr-1" /><span>Active students enrolled</span></div></div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-semibold mb-2">Total Revenue</h3><p className="text-2xl md:text-3xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</p></div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"><DollarSign className="w-6 h-6" /></div>
            </div>
            <div className="mt-4 text-sm opacity-90"><div className="flex items-center"><TrendingUp className="w-4 h-4 mr-1" /><span>Total collections to date</span></div></div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-semibold mb-2">Today's Collections</h3><p className="text-2xl md:text-3xl font-bold">{formatCurrency(dashboardData.todayCollections)}</p></div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"><CreditCard className="w-6 h-6" /></div>
            </div>
            <div className="mt-4 text-sm opacity-90"><div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /><span>Collections for {new Date().toLocaleDateString()}</span></div></div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-semibold mb-2">Transactions</h3><p className="text-2xl md:text-3xl font-bold">{dashboardData.stats.total_transactions || 0}</p></div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"><FileText className="w-6 h-6" /></div>
            </div>
            <div className="mt-4 text-sm opacity-90"><div className="flex items-center space-x-2"><div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /><span>{dashboardData.stats.completed_count || 0} completed</span></div><div className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" /><span>{dashboardData.stats.pending_count || 0} pending</span></div></div></div>
          </div>
        </div>

        {/* Charts and Data Section */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Recent Payments */}
          <div className="xl:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
              <button onClick={() => window.location.href = '/bursar/payments'} className="text-sm text-blue-600 hover:text-blue-800">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Method</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentPayments.length > 0 ? (
                    dashboardData.recentPayments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4"><div><div className="font-medium text-gray-900">{payment.first_name} {payment.last_name}</div><div className="text-sm text-gray-500">{payment.admission_no}</div></div></td>
                        <td className="px-4 py-4"><div className="font-semibold text-green-600">{formatCurrency(payment.amount_kes)}</div></td>
                        <td className="px-4 py-4 text-sm text-gray-900">{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.payment_mode === 'MPESA' ? 'bg-green-100 text-green-800' : payment.payment_mode === 'CASH' ? 'bg-blue-100 text-blue-800' : payment.payment_mode === 'BANK_TRANSFER' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>{payment.payment_mode}</span></td>
                        <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : payment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{payment.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No recent payments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods Distribution</h3>
            <div className="space-y-4 w-full">
              {Object.entries(dashboardData.paymentMethods).length > 0 ? (
                Object.entries(dashboardData.paymentMethods).map(([method, percentage]) => (
                  <div key={method} className="space-y-2 w-full">
                    <div className="flex justify-between text-sm w-full"><span className="font-medium text-gray-700">{method}</span><span className="text-gray-600">{percentage}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${method === 'MPESA' ? 'bg-green-500' : method === 'CASH' ? 'bg-blue-500' : method === 'BANK_TRANSFER' ? 'bg-purple-500' : 'bg-yellow-500'}`} style={{ width: `${percentage}%` }}></div></div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No payment method data available</div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Total Transactions:</span><span className="font-medium">{dashboardData.stats.total_transactions || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Unique Students:</span><span className="font-medium">{dashboardData.stats.unique_students || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Avg Transaction:</span><span className="font-medium">{formatCurrency(dashboardData.stats.average_amount)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collection Efficiency */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Collection Efficiency</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{dashboardData.totalStudents > 0 ? Math.round((dashboardData.paidStudents / dashboardData.totalStudents) * 100) : 0}%</div>
              <p className="text-sm text-gray-600">Fee collection rate</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${dashboardData.totalStudents > 0 ? Math.round((dashboardData.paidStudents / dashboardData.totalStudents) * 100) : 0}%` }}></div></div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-gray-700">Last Sync</span><span className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-700">Data Version</span><span className="text-sm text-gray-600">v1.0</span></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => window.location.href = '/bursar/payment'} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between"><span className="font-medium text-gray-700">Process Payment</span><span className="text-blue-600">→</span></button>
              <button onClick={() => window.location.href = '/bursar/records'} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between"><span className="font-medium text-gray-700">View Records</span><span className="text-blue-600">→</span></button>
              <button onClick={() => window.location.href = '/bursar/fee-structures'} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between"><span className="font-medium text-gray-700">Fee Structures</span><span className="text-blue-600">→</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BursarDashboard;