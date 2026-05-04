/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Search, Download, Printer, RefreshCw, Eye, FileText,
  Calendar, DollarSign, TrendingUp, Users, ChevronDown,
  ChevronUp, AlertCircle, X, Loader2, LogOut
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const styles = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' };
  if (!isVisible) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`${styles[type]} text-white shadow-lg p-4 min-w-[280px] max-w-md`}>
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium capitalize text-sm">{type}</p>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>
      </div>
    </div>
  );
};

const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
          <button onClick={onLogout} className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
            <LogOut size={18} /> Log In Again
          </button>
        </div>
      </div>
    </div>
  );
};


const StatBadge = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border ${colorClasses[color]}`}>
      <Icon className="w-5 h-5" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </div>
  );
};

const PaymentRecords = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    start_date: '', end_date: '', status: 'all', payment_mode: 'all', search_term: ''
  });

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleApiError = (error) => {
    if (error?.status === 401) setShowSessionExpired(true);
  };

  const handleLogout = () => { setShowSessionExpired(false); logout(); window.location.href = '/login'; };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.payment_mode !== 'all') params.append('payment_mode', filters.payment_mode);
      params.append('limit', '100');

      const res = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/?${params}`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) { setTransactions(data.data || []); setError(null); }
      else { setError(data.error || 'Failed to load transactions'); showToast(data.error || 'Failed to load', 'error'); }
    } catch { setError('Failed to load transactions'); showToast('Network error', 'error'); }
    finally { setLoading(false); }
  }, [filters, getAuthHeaders]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      const res = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/stats/?${params}`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch { /* silent */ }
  }, [filters.start_date, filters.end_date, getAuthHeaders]);

  const fetchTransactionDetails = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bursar/records/transactions/${id}/`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) { setSelectedTransaction(data.data); setShowDetailModal(true); }
      else showToast(data.error || 'Failed to load details', 'error');
    } catch { showToast('Failed to load transaction details', 'error'); }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];
    if (filters.search_term) {
      const q = filters.search_term.toLowerCase();
      filtered = filtered.filter(t =>
        t.transaction_no?.toLowerCase().includes(q) ||
        t.first_name?.toLowerCase().includes(q) ||
        t.last_name?.toLowerCase().includes(q) ||
        t.admission_no?.toLowerCase().includes(q)
      );
    }
    if (filters.status !== 'all') filtered = filtered.filter(t => t.status === filters.status);
    if (filters.payment_mode !== 'all') filtered = filtered.filter(t => t.payment_mode === filters.payment_mode);
    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  useEffect(() => { if (isAuthenticated) { fetchTransactions(); fetchStats(); } }, [fetchStats, fetchTransactions, isAuthenticated]);
  useEffect(() => { applyFilters(); }, [applyFilters]);

  const clearFilters = () => setFilters({ start_date: '', end_date: '', status: 'all', payment_mode: 'all', search_term: '' });

  const applyFiltersAndRefresh = () => { fetchTransactions(); fetchStats(); setShowFilters(false); };

  const exportCSV = () => {
    if (!filteredTransactions.length) { showToast('No data to export', 'warning'); return; }
    const headers = ['Transaction No', 'Student Name', 'Admission No', 'Amount (KES)', 'Date', 'Payment Method', 'Reference', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.transaction_no, `${t.first_name} ${t.last_name}`, t.admission_no, t.amount_kes,
      new Date(t.payment_date).toLocaleDateString(), t.payment_mode, t.payment_reference || 'N/A', t.status
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    window.URL.revokeObjectURL(url);
    showToast('Exported as CSV', 'success');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const formatCurrency = (amount) => `KSh ${parseFloat(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getStatusColor = (s) => {
    switch (s) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVERSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (m) => {
    switch (m) {
      case 'MPESA': return 'bg-green-100 text-green-700 border border-green-200';
      case 'CASH': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'BANK_TRANSFER': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'CHEQUE': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please login to access payment records</p>
          <a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 bg-green-700 p-6 rounded-l">
          <h1 className="text-3xl font-bold text-white">Payment Records</h1>
          <p className="text-white mt-1">View and manage all student fee payment transactions</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBadge label="Total Collected" value={formatCurrency(stats.total_collected)} icon={DollarSign} color="green" />
            <StatBadge label="Total Transactions" value={stats.total_transactions || 0} icon={FileText} color="blue" />
            <StatBadge label="Unique Students" value={stats.unique_students || 0} icon={Users} color="purple" />
            <StatBadge label="Average Amount" value={formatCurrency(stats.average_amount)} icon={TrendingUp} color="orange" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-300 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
            <h3 className="text-base font-semibold text-gray-900">Filter Transactions</h3>
            <button className="flex items-center gap-1 text-blue-600 text-sm font-medium">
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
          {showFilters && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Start Date</label>
                <input type="date" value={filters.start_date} onChange={e => setFilters({ ...filters, start_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">End Date</label>
                <input type="date" value={filters.end_date} onChange={e => setFilters({ ...filters, end_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</label>
                <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                  <option value="all">All Status</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVERSED">Reversed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Method</label>
                <select value={filters.payment_mode} onChange={e => setFilters({ ...filters, payment_mode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                  <option value="all">All Methods</option>
                  <option value="MPESA">MPESA</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
                <button onClick={clearFilters} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">Clear Filters</button>
                <button onClick={applyFiltersAndRefresh} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm">Apply Filters</button>
              </div>
            </div>
          )}
        </div>

        {/* Search & Actions */}
        <div className="bg-white border border-gray-300 px-6 py-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search_term}
                onChange={e => setFilters({ ...filters, search_term: e.target.value })}
                placeholder="Search by transaction no, student name, or admission number..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { fetchTransactions(); fetchStats(); }} disabled={loading} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </button>
              <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-gray-300 p-12 flex items-center justify-center">
            <div className="text-center"><Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-3" /><p className="text-gray-600">Loading transactions...</p></div>
          </div>
        ) : error ? (
          <div className="bg-white border border-gray-300 p-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold mb-3">{error}</p>
            <button onClick={fetchTransactions} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm">Try Again</button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white border border-gray-300 p-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold mb-1">No transactions found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{t.transaction_no}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{formatDate(t.payment_date)} at {formatTime(t.payment_date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{t.first_name} {t.last_name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{t.admission_no}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-700">{formatCurrency(t.amount_kes)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getMethodColor(t.payment_mode)}`}>{t.payment_mode}</span>
                        {t.payment_reference && <div className="text-xs text-gray-500 mt-1">Ref: {t.payment_reference}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getStatusColor(t.status)}`}>{t.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => fetchTransactionDetails(t.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-sm font-semibold text-gray-700">{filteredTransactions.length} transaction(s)</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-700">{formatCurrency(filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount_kes || 0), 0))}</span>
                    </td>
                    <td colSpan="3" className="px-6 py-4 text-xs text-gray-500 text-right">Total of filtered results</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Jawabu School Management System. All rights reserved.</p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selectedTransaction.transaction_no}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Transaction Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Transaction No</span><span className="font-semibold">{selectedTransaction.transaction_no}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{formatDate(selectedTransaction.payment_date)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{formatTime(selectedTransaction.payment_date)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><span className={`px-2 py-1 text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>{selectedTransaction.status}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Financial Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-green-700 text-base">{formatCurrency(selectedTransaction.amount_kes)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Method</span><span className={`px-2 py-1 text-xs font-medium ${getMethodColor(selectedTransaction.payment_mode)}`}>{selectedTransaction.payment_mode}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-semibold">{selectedTransaction.payment_reference || 'N/A'}</span></div>
                  {selectedTransaction.mobile_money_no && (
                    <div className="flex justify-between"><span className="text-gray-500">M-PESA No</span><span className="font-semibold">{selectedTransaction.mobile_money_no}</span></div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Student Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{selectedTransaction.first_name} {selectedTransaction.last_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Admission No</span><span className="font-semibold">{selectedTransaction.admission_no}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Audit Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Collected By</span><span className="font-semibold">{selectedTransaction.collected_by_name || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Verified At</span><span className="font-semibold">{selectedTransaction.verified_at ? formatDate(selectedTransaction.verified_at) : 'Not verified'}</span></div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecords;
