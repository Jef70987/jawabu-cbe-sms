/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiCalendar,
  FiUsers,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiPercent,
  FiTarget,
  FiLogOut
} from "react-icons/fi";
import { useAuth } from '../Authentication/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Session Expired Modal
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fetch wrapper with error handling
const fetchData = async (url, headers) => {
  try {
    const response = await fetch(url, { headers });
    if (response.status === 401) {
      return { success: false, error: 'Unauthorized', status: 401 };
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return { success: false, error: error.message, data: null };
  }
};

const Dashboard = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState({
    stats: false,
    transactions: false,
    charts: false
  });
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    total_collected: 0,
    today_collection: 0,
    pending_collections: 0,
    overdue_payments: 0,
    collection_rate: 0,
    avg_transaction: 0,
    active_invoices: 0,
    monthly_target: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [dailyCollection, setDailyCollection] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

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

  useEffect(() => {
    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 1200000);
    return () => clearInterval(timeInterval);
  }, []);
  
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
    
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      setError("");
      
      const headers = getAuthHeaders();
      
      // Calculate date range for daily collection (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      // Fetch all dashboard data in parallel
      const [
        statsResult,
        transactionsResult,
        methodsResult,
        dailyResult,
        topStudentsResult
      ] = await Promise.all([
        fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/stats/`, headers),
        fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/?limit=10`, headers),
        fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/payment-methods-stats/`, headers),
        fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/daily-collection/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, headers),
        fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/top-students/?limit=5`, headers)
      ]);

      // Handle session expiration
      if (statsResult.status === 401 || transactionsResult.status === 401 || 
          methodsResult.status === 401 || dailyResult.status === 401 || topStudentsResult.status === 401) {
        handleApiError({ status: 401 });
        return;
      }

      // Process transaction statistics
      if (statsResult.success && statsResult.data) {
        const stats = statsResult.data.data || statsResult.data;
        setDashboardStats({
          total_collected: stats.total_collected || 0,
          today_collection: stats.today_collection || 0,
          pending_collections: stats.pending_collections || 0,
          overdue_payments: stats.overdue_payments || 0,
          collection_rate: stats.collection_rate || 0,
          avg_transaction: stats.avg_transaction || 0,
          active_invoices: stats.active_invoices || 0,
          monthly_target: stats.monthly_target || 1000000
        });
      } else {
        // Fallback to calculating from transactions
        await calculateStatsFromTransactions();
      }

      // Process recent transactions
      if (transactionsResult.success && transactionsResult.data) {
        const transactions = transactionsResult.data.data || transactionsResult.data;
        setRecentTransactions(Array.isArray(transactions) ? transactions.slice(0, 8) : []);
      }

      // Process payment methods
      if (methodsResult.success && methodsResult.data) {
        const methods = methodsResult.data.data || methodsResult.data;
        setPaymentMethods(Array.isArray(methods) ? methods : []);
      }

      // Process daily collection
      if (dailyResult.success && dailyResult.data) {
        const daily = dailyResult.data.data || dailyResult.data;
        setDailyCollection(Array.isArray(daily) ? daily.slice(-15) : []);
      }

      // Process top students
      if (topStudentsResult.success && topStudentsResult.data) {
        const students = topStudentsResult.data.data || topStudentsResult.data;
        setTopStudents(Array.isArray(students) ? students : []);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fallback: Calculate stats from transactions if stats endpoint not available
  const calculateStatsFromTransactions = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await fetchData(`${API_BASE_URL}/api/accountant/fees/transactions/?limit=1000`, headers);
      if (res.success && res.data) {
        const transactions = res.data.data || res.data;
        const total_collected = transactions
          .filter(t => t.status === 'COMPLETED')
          .reduce((sum, t) => sum + (t.amount_kes || 0), 0);
        const today = new Date().toISOString().split('T')[0];
        const today_collection = transactions
          .filter(t => t.status === 'COMPLETED' && t.payment_date?.split('T')[0] === today)
          .reduce((sum, t) => sum + (t.amount_kes || 0), 0);
        
        setDashboardStats(prev => ({
          ...prev,
          total_collected,
          today_collection,
          collection_rate: total_collected > 0 ? 75 : 0
        }));
      }
    } catch (err) {
      console.error("Error calculating stats:", err);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      fetchDashboardData();
    }
    
    const interval = setInterval(() => {
      if (isAuthenticated) fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refreshKey, isAuthenticated]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-KE', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPaymentMethodBadge = (method) => {
    const styles = {
      CASH: "bg-green-100 text-green-800 border border-green-200",
      MPESA: "bg-blue-100 text-blue-800 border border-blue-200",
      BANK_TRANSFER: "bg-purple-100 text-purple-800 border border-purple-200",
      CHEQUE: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      CREDIT_CARD: "bg-red-100 text-red-800 border border-red-200",
      BANK_DEPOSIT: "bg-cyan-100 text-cyan-800 border border-cyan-200",
      OTHER: "bg-gray-100 text-gray-800 border border-gray-200"
    };
    return `px-2 py-1 rounded text-xs font-medium ${styles[method] || "bg-gray-100 text-gray-800"}`;
  };

  // Chart data configurations
  const dailyCollectionChart = {
    labels: dailyCollection.map(item => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Collection (KES)",
        data: dailyCollection.map(item => item.total_amount || 0),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const paymentMethodsChart = {
    labels: paymentMethods.map(item => item.payment_mode),
    datasets: [
      {
        data: paymentMethods.map(item => item.total_amount || 0),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(20, 184, 166, 0.8)'
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12 } }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: function(value) { return 'KES ' + value.toLocaleString(); } }
      },
      x: { grid: { display: false } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { size: 11 }, padding: 15 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Calculate progress towards monthly target
  const monthlyProgress = dashboardStats.monthly_target > 0 
    ? Math.min(100, (dashboardStats.total_collected / dashboardStats.monthly_target) * 100)
    : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Please login to access the accountant dashboard</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Accountant Dashboard</h1>
          <p className="text-gray-600 mt-1">Financial overview and transaction monitoring</p>
          {user && <p className="text-xs text-gray-400 mt-1">{user.first_name} {user.last_name} • {user.role}</p>}
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{currentDate}</p>
            <p className="text-lg font-bold text-blue-600">{currentTime}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              disabled={loading.stats}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={loading.stats ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-2">Total Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.total_collected)}</p>
              <p className="text-xs opacity-80 mt-2">{dashboardStats.collection_rate}% collection rate</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg"><FiDollarSign className="text-xl" /></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-2">Today's Collection</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.today_collection)}</p>
              <p className="text-xs opacity-80 mt-2">Real-time update</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg"><FiCalendar className="text-xl" /></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-2">Pending Collections</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.pending_collections)}</p>
              <p className="text-xs opacity-80 mt-2">{dashboardStats.active_invoices} active invoices</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg"><FiAlertCircle className="text-xl" /></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-2">Overdue Payments</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.overdue_payments)}</p>
              <p className="text-xs opacity-80 mt-2">Requires follow-up</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg"><FiAlertCircle className="text-xl" /></div>
          </div>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Collection Target</h3>
          <FiTarget className="text-gray-400" />
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress: {monthlyProgress.toFixed(1)}%</span>
            <span>{formatCurrency(dashboardStats.total_collected)} / {formatCurrency(dashboardStats.monthly_target)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${monthlyProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Daily Collection Trend</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500"><FiFilter size={14} /><span>Last 15 days</span></div>
          </div>
          <div className="h-72">
            {dailyCollection.length > 0 ? (
              <Line data={dailyCollectionChart} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-center">
                <div><FiCalendar className="mx-auto text-4xl mb-2" /><p>No daily collection data available</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Payment Methods Distribution</h3>
            <span className="text-sm text-gray-500">By amount collected</span>
          </div>
          <div className="h-72">
            {paymentMethods.length > 0 ? (
              <Pie data={paymentMethodsChart} options={pieOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-center">
                <div><FiCreditCard className="mx-auto text-4xl mb-2" /><p>No payment data available</p></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Student</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Method</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Date</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3"><p className="font-medium">{transaction.first_name} {transaction.last_name}</p><p className="text-xs text-gray-500">{transaction.admission_no}</p></td>
                    <td className="px-5 py-3"><p className="font-bold">{formatCurrency(transaction.amount_kes)}</p></td>
                    <td className="px-5 py-3"><span className={getPaymentMethodBadge(transaction.payment_mode)}>{transaction.payment_mode}</span></td>
                    <td className="px-5 py-3"><p className="text-sm">{formatDate(transaction.payment_date)}</p></td>
                    <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : transaction.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' : transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{transaction.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentTransactions.length === 0 && <div className="text-center py-8"><FiCreditCard className="mx-auto text-gray-400 text-3xl mb-2" /><p className="text-gray-500">No transactions found</p></div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-800">Top Paying Students</h3><FiUsers className="text-gray-400" /></div>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.student_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">{index + 1}</div><div><p className="font-medium">{student.first_name} {student.last_name}</p><p className="text-xs text-gray-500">{student.admission_no}</p></div></div>
                  <div className="text-right"><p className="font-bold">{formatCurrency(student.total_paid)}</p><p className="text-xs text-gray-500">{student.transaction_count} payment{student.transaction_count !== 1 ? 's' : ''}</p></div>
                </div>
              ))}
              {topStudents.length === 0 && <div className="text-center py-4 text-gray-500">No student data available</div>}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3"><div className="flex items-center gap-2 mb-1"><FiDollarSign /> <p className="text-sm opacity-90">Avg Transaction</p></div><p className="text-2xl font-bold">{formatCurrency(dashboardStats.avg_transaction)}</p></div>
              <div className="bg-white/10 rounded-lg p-3"><div className="flex items-center gap-2 mb-1"><FiCalendar /> <p className="text-sm opacity-90">Active Invoices</p></div><p className="text-2xl font-bold">{dashboardStats.active_invoices}</p></div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"><div className="flex items-center gap-2 text-red-600 font-medium"><FiAlertCircle /> Error loading dashboard data: {error}</div></div>}

      {loading.stats && <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 shadow-2xl"><div className="flex items-center gap-3"><FiRefreshCw className="animate-spin text-blue-600" /><p className="text-gray-700 font-medium">Loading dashboard data...</p></div></div></div>}

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500"><p>Accountant Dashboard • School ERP System • Data updates every 30 seconds</p></div>
    </div>
  );
};

export default Dashboard;