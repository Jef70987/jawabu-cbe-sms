/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  FileText,
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  LogOut,
  X,
  Loader2,
  Info,
  Printer
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
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500'
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
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
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

const Report = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const reportTypes = [
    { id: 'financial', name: 'Financial Summary', icon: <DollarSign className="w-5 h-5" />, description: 'Revenue, transactions, and collection metrics' },
    { id: 'collection', name: 'Fee Collection', icon: <CreditCard className="w-5 h-5" />, description: 'Transaction collection summary' },
    { id: 'transactions', name: 'All Transactions', icon: <FileText className="w-5 h-5" />, description: 'Complete transaction history' }
  ];

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleApiError = (error) => {
    if (error?.status === 401) setShowSessionExpired(true);
  };

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = '/logout';
  };

  // Fetch data from backend
  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Fetch transactions and stats from existing endpoints
      const params = new URLSearchParams();
      params.append('start_date', dateRange.startDate);
      params.append('end_date', dateRange.endDate);
      
      const [transactionsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/bursar/records/transactions/?${params}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/bursar/records/transactions/stats/?${params}`, { headers: getAuthHeaders() })
      ]);

      if (transactionsRes.status === 401) { handleApiError({ status: 401 }); return; }

      const transactionsData = await transactionsRes.json();
      const statsData = await statsRes.json();

      if (transactionsData.success) setTransactions(transactionsData.data || []);
      if (statsData.success) setStats(statsData.data);

      generateReportData(transactionsData.data, statsData.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load report data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate report data based on selection
  const generateReportData = (transactionsList, statsData) => {
    const totalRevenue = statsData?.total_collected || 0;
    const totalTransactions = statsData?.total_transactions || 0;
    const avgTransaction = statsData?.average_amount || 0;
    const uniqueStudents = statsData?.unique_students || 0;

    const filteredTransactions = transactionsList || [];

    // Calculate payment methods from transaction data
    const paymentMethods = {};
    filteredTransactions.forEach(t => {
      paymentMethods[t.payment_mode] = (paymentMethods[t.payment_mode] || 0) + t.amount_kes;
    });

    // Calculate daily totals
    const dailyTotals = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.payment_date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + t.amount_kes;
    });

    const report = {
      financial: {
        title: 'Financial Summary Report',
        metrics: [
          { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'green' },
          { label: 'Total Transactions', value: totalTransactions.toLocaleString(), icon: <FileText className="w-5 h-5" />, color: 'blue' },
          { label: 'Average Transaction', value: `KSh ${Math.round(avgTransaction).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
          { label: 'Unique Students', value: uniqueStudents.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'orange' }
        ],
        charts: [
          { title: 'Daily Revenue Trend', type: 'line', data: Object.entries(dailyTotals).slice(-14).map(([date, amount]) => ({ date: formatDate(date), amount })) },
          { title: 'Payment Methods', type: 'pie', data: Object.entries(paymentMethods).map(([method, amount]) => ({ name: method, value: amount })) }
        ],
        transactions: filteredTransactions.slice(0, 10)
      },
      collection: {
        title: 'Fee Collection Report',
        metrics: [
          { label: 'Total Collected', value: `KSh ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'green' },
          { label: 'Daily Average', value: `KSh ${Math.round(totalRevenue / (filteredTransactions.length || 1)).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'blue' },
          { label: 'Transactions', value: filteredTransactions.length.toLocaleString(), icon: <CreditCard className="w-5 h-5" />, color: 'purple' },
          { label: 'Collection Days', value: Object.keys(dailyTotals).length.toString(), icon: <Calendar className="w-5 h-5" />, color: 'orange' }
        ],
        charts: [
          { title: 'Daily Collections', type: 'bar', data: Object.entries(dailyTotals).slice(-14).map(([date, amount]) => ({ date: formatDate(date), amount })) }
        ],
        transactions: filteredTransactions.slice(0, 10)
      },
      transactions: {
        title: 'All Transactions Report',
        metrics: [
          { label: 'Total Amount', value: `KSh ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'green' },
          { label: 'Total Transactions', value: totalTransactions.toLocaleString(), icon: <FileText className="w-5 h-5" />, color: 'blue' },
          { label: 'Completed', value: filteredTransactions.filter(t => t.status === 'Completed').length.toLocaleString(), icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
          { label: 'Pending', value: filteredTransactions.filter(t => t.status === 'Pending').length.toLocaleString(), icon: <AlertCircle className="w-5 h-5" />, color: 'yellow' }
        ],
        transactions: filteredTransactions.slice(0, 20)
      }
    };

    setReportData(report[selectedReport]);
  };

  const formatCurrency = (amount) => `KSh ${(amount || 0).toLocaleString()}`;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      let content = '';
      let mimeType = '';
      let fileName = `${selectedReport}_report_${dateRange.startDate}_to_${dateRange.endDate}`;

      if (format === 'csv') {
        if (reportData?.transactions) {
          const headers = ['Student', 'Admission No', 'Amount', 'Date', 'Method', 'Status'];
          const rows = reportData.transactions.map(t => [
            `${t.first_name} ${t.last_name}`,
            t.admission_no,
            t.amount_kes,
            formatDate(t.payment_date),
            t.payment_mode,
            t.status
          ]);
          content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        } else {
          const headers = ['Metric', 'Value'];
          const rows = reportData?.metrics?.map(m => [m.label, m.value]) || [];
          content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }
        mimeType = 'text/csv';
        fileName += '.csv';
      } else if (format === 'json') {
        content = JSON.stringify(reportData, null, 2);
        mimeType = 'application/json';
        fileName += '.json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`${format.toUpperCase()} exported successfully!`, 'success');
    } catch (error) {
      if (error){
        showToast('Export failed', 'error');
      }
      
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, dateRange, selectedReport]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold">Authentication Required</h2><p className="text-gray-600 mt-2">Please login to access reports</p><a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Login</a></div>
      </div>
    );
  }

  const currentReport = reportData || { metrics: [], charts: [], title: 'Loading...', description: 'Fetching data...', transactions: [] };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600 mt-1">Generate and analyze comprehensive financial reports</p>
              {user && <p className="text-xs text-gray-400 mt-1">{user.first_name} {user.last_name} • {user.role}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={fetchAllData} disabled={isLoading} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Types</h2>
              <div className="space-y-2">
                {reportTypes.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${selectedReport === report.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`p-2 rounded-lg ${selectedReport === report.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{report.icon}</div>
                    <div className="text-left"><p className="font-medium">{report.name}</p><p className="text-xs text-gray-500">{report.description}</p></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date Range</h3>
              <div className="space-y-3">
                <div><label className="block text-xs text-gray-500 mb-1">From Date</label><input type="date" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">To Date</label><input type="date" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => setDateRange({ startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] })} className="px-2 py-1 text-xs border rounded-lg hover:bg-gray-50">Today</button>
                  <button onClick={() => { const d = new Date(); d.setDate(d.getDate() - 7); setDateRange({ startDate: d.toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }); }} className="px-2 py-1 text-xs border rounded-lg hover:bg-gray-50">Last 7 Days</button>
                  <button onClick={() => { const d = new Date(); d.setDate(d.getDate() - 30); setDateRange({ startDate: d.toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }); }} className="px-2 py-1 text-xs border rounded-lg hover:bg-gray-50">Last 30 Days</button>
                  <button onClick={() => { const d = new Date(); d.setMonth(d.getMonth() - 1); setDateRange({ startDate: d.toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }); }} className="px-2 py-1 text-xs border rounded-lg hover:bg-gray-50">Last Month</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Export Options</h3>
              <div className="space-y-2">
                <button onClick={() => handleExport('csv')} disabled={isExporting || !reportData} className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-between"><span>Export as CSV</span><Download className="w-4 h-4" /></button>
                <button onClick={() => handleExport('json')} disabled={isExporting || !reportData} className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-between"><span>Export as JSON</span><Download className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div><h2 className="text-xl font-bold text-gray-800">{currentReport.title}</h2><p className="text-gray-500 text-sm mt-1">{currentReport.description}</p><div className="flex items-center gap-2 mt-3 text-sm text-gray-500"><Calendar className="w-4 h-4" /><span>{formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</span></div></div>
                <button onClick={fetchAllData} disabled={isLoading} className="p-2 text-gray-400 hover:text-gray-600"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentReport.metrics?.map((metric, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3"><div className={`p-2 rounded-lg bg-${metric.color}-50 text-${metric.color}-600`}>{metric.icon}</div></div>
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            {currentReport.charts?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Visual Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentReport.charts.map((chart, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">{chart.title}</h4>
                      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                        {chart.type === 'line' && chart.data?.length > 0 ? (
                          <div className="w-full px-2">
                            <div className="space-y-2">
                              {chart.data.slice(-5).map((item, i) => (
                                <div key={i}><div className="flex justify-between text-xs mb-1"><span>{item.date}</span><span>KSh {item.amount.toLocaleString()}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (item.amount / Math.max(...chart.data.map(d => d.amount))) * 100)}%` }}></div></div></div>
                              ))}
                            </div>
                          </div>
                        ) : chart.type === 'pie' && chart.data?.length > 0 ? (
                          <div className="space-y-2 w-full px-4">
                            {chart.data.map((item, i) => {
                              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                              const total = chart.data.reduce((sum, d) => sum + d.value, 0);
                              const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
                              return (<div key={i}><div className="flex justify-between text-sm mb-1"><span>{item.name}</span><span>{percent}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`${colors[i % colors.length]} h-2 rounded-full`} style={{ width: `${percent}%` }}></div></div></div>);
                            })}
                          </div>
                        ) : (<p className="text-gray-400">No data available</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Table */}
            {currentReport.transactions?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Transaction Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Admission No</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentReport.transactions.map((t, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{t.first_name} {t.last_name}</td>
                          <td className="px-6 py-4 text-sm">{t.admission_no}</td>
                          <td className="px-6 py-4 text-right font-semibold text-green-600">{formatCurrency(t.amount_kes)}</td>
                          <td className="px-6 py-4 text-sm">{formatDate(t.payment_date)}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${t.payment_mode === 'MPESA' ? 'bg-green-100 text-green-800' : t.payment_mode === 'CASH' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{t.payment_mode}</span></td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${t.status === 'Completed' ? 'bg-green-100 text-green-800' : t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-gray-500">Loading report data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;