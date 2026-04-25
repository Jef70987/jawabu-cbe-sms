/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Search, Filter,
  Plus, Eye, Edit2, Trash2, Download, FileText, Calendar,
  Users, TrendingUp, TrendingDown, BarChart3, PieChart,
  Target, Award, UserX, Mail, Phone, MessageSquare,
  Star, MinusCircle, MoreVertical, X, Loader2, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;

  const bgColors = { success: 'border-l-green-600', error: 'border-l-red-600', info: 'border-l-blue-600', warning: 'border-l-yellow-600' };
  const icons = { success: <CheckCircle className="h-5 w-5 text-green-600" />, error: <AlertTriangle className="h-5 w-5 text-red-600" />, info: <FileText className="h-5 w-5 text-blue-600" />, warning: <AlertTriangle className="h-5 w-5 text-yellow-600" /> };

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border-l-4 ${bgColors[type]} border border-gray-300 shadow-lg p-4 min-w-[320px] animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Information'}</p>
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100"><h3 className="text-md font-bold text-gray-900">{title}</h3></div>
        <div className="p-6"><p className="text-sm text-gray-800">{message}</p></div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}{confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Discipline = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('cases');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });

  // Data states
  const [cases, setCases] = useState([]);
  const [conductRecords, setConductRecords] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0, activeCases: 0, resolvedCases: 0,
    totalInterventions: 0, activeSuspensions: 0,
    totalCounseling: 0
  });
  
  // Form states
  const [caseForm, setCaseForm] = useState({
    student_id: '', category_id: '', description: '', location: '', severity: 'Medium'
  });
  const [sessionForm, setSessionForm] = useState({
    student_id: '', session_type: 'Personal Counseling', session_date: '', session_time: '', notes: ''
  });
  const [interventionForm, setInterventionForm] = useState({
    program_name: '', program_type: 'Behavioral', description: '', duration_weeks: 4, facilitator: '', start_date: ''
  });

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const apiRequest = async (endpoint, options = {}) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...defaultOptions, ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  // Fetch all data
  const fetchCases = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterSeverity !== 'all') params.append('severity', filterSeverity);
      params.append('page', pagination.page);
      params.append('page_size', pagination.pageSize);
      
      const data = await apiRequest(`/api/discipline/cases/?${params}`);
      if (data.success) {
        setCases(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.total_pages || 0
        }));
      }
    } catch (err) {
      showToast('Failed to load cases', 'error');
    }
  }, [searchTerm, filterStatus, filterSeverity, pagination.page, pagination.pageSize]);

  const fetchConductRecords = useCallback(async () => {
    try {
      const data = await apiRequest('/api/discipline/conduct/');
      if (data.success) setConductRecords(data.data || []);
    } catch (err) {
      console.error('Error fetching conduct records:', err);
    }
  }, []);

  const fetchInterventions = useCallback(async () => {
    try {
      const data = await apiRequest('/api/discipline/interventions/');
      if (data.success) setInterventions(data.data || []);
    } catch (err) {
      console.error('Error fetching interventions:', err);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await apiRequest('/api/discipline/sessions/');
      if (data.success) setSessions(data.data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, []);

  const fetchSuspensions = useCallback(async () => {
    try {
      const data = await apiRequest('/api/discipline/suspensions/');
      if (data.success) setSuspensions(data.data || []);
    } catch (err) {
      console.error('Error fetching suspensions:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest('/api/discipline/stats/');
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const refreshAllData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchCases(), fetchConductRecords(), fetchInterventions(),
      fetchSessions(), fetchSuspensions(), fetchStats()
    ]);
    setRefreshing(false);
    showToast('Data refreshed', 'success');
  };

  // Create operations
  const handleCreateCase = async () => {
    if (!caseForm.student_id || !caseForm.description) {
      showToast('Please fill required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/api/discipline/cases/create/', {
        method: 'POST',
        body: JSON.stringify(caseForm)
      });
      if (data.success) {
        showToast('Case created successfully', 'success');
        setShowCaseModal(false);
        setCaseForm({ student_id: '', category_id: '', description: '', location: '', severity: 'Medium' });
        fetchCases();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create case', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.student_id || !sessionForm.session_date) {
      showToast('Please fill required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/api/discipline/sessions/create/', {
        method: 'POST',
        body: JSON.stringify(sessionForm)
      });
      if (data.success) {
        showToast('Session scheduled successfully', 'success');
        setShowSessionModal(false);
        setSessionForm({ student_id: '', session_type: 'Personal Counseling', session_date: '', session_time: '', notes: '' });
        fetchSessions();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntervention = async () => {
    if (!interventionForm.program_name || !interventionForm.start_date) {
      showToast('Please fill required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/api/discipline/interventions/create/', {
        method: 'POST',
        body: JSON.stringify(interventionForm)
      });
      if (data.success) {
        showToast('Intervention program created', 'success');
        setShowInterventionModal(false);
        setInterventionForm({ program_name: '', program_type: 'Behavioral', description: '', duration_weeks: 4, facilitator: '', start_date: '' });
        fetchInterventions();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create intervention', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete operations
  const handleDeleteCase = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/discipline/cases/${deleteConfirm.id}/delete/`, { method: 'DELETE' });
      if (data.success) {
        showToast('Case deleted', 'success');
        fetchCases();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };

  const handleResolveCase = async (caseId) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/discipline/cases/${caseId}/resolve/`, { method: 'PUT' });
      if (data.success) {
        showToast('Case resolved', 'success');
        fetchCases();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to resolve', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  const tabs = [
    { id: 'cases', name: 'Discipline Cases', icon: <AlertTriangle size={16} />, count: stats.activeCases },
    { id: 'conduct', name: 'Conduct Records', icon: <Star size={16} />, count: conductRecords.length },
    { id: 'interventions', name: 'Interventions', icon: <Target size={16} />, count: stats.totalInterventions },
    { id: 'counseling', name: 'Counseling', icon: <MessageSquare size={16} />, count: stats.totalCounseling },
    { id: 'suspensions', name: 'Suspensions', icon: <UserX size={16} />, count: stats.activeSuspensions },
    { id: 'reports', name: 'Reports & Analytics', icon: <BarChart3 size={16} /> },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Investigation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConductBadge = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access discipline management</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">Go to Login</a>
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
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>

      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />)}

      <ConfirmModal 
        isOpen={deleteConfirm.isOpen} 
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteCase} 
        title="Delete Case" 
        message={`Delete "${deleteConfirm.name}"? This action cannot be undone.`} 
        loading={loading} 
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Discipline Management</h1>
            <p className="text-green-100 mt-1">Track cases, conduct records, interventions, and counseling</p>
          </div>
          <div className="flex gap-3">
            <button onClick={refreshAllData} disabled={refreshing} className="px-4 py-2 bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 flex items-center gap-2 rounded">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => { setShowCaseModal(true); }} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 flex items-center gap-2 rounded">
              <Plus className="h-4 w-4" /> New Case
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
            <p className="text-xs text-gray-500">Total Cases</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.activeCases}</p>
            <p className="text-xs text-gray-500">Active Cases</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.resolvedCases}</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalInterventions}</p>
            <p className="text-xs text-gray-500">Interventions</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.activeSuspensions}</p>
            <p className="text-xs text-gray-500">Active Suspensions</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 mt-6">
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300">
            <nav className="flex flex-wrap gap-1 px-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-green-700 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                  {tab.count !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Loading State */}
            {refreshing && <LoadingSpinner />}

            {/* Cases Tab */}
            {activeTab === 'cases' && !refreshing && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input type="text" placeholder="Search cases..." className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <select className="px-4 py-2 border border-gray-400 text-sm bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-400 text-sm bg-white" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                    <option value="all">All Severity</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {cases.length === 0 ? (
                  <div className="text-center py-12"><AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No cases found</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Case ID</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Student</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Offense</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Severity</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Points</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cases.map((case_) => (
                          <tr key={case_.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-green-700">{case_.incident_code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{case_.student_name}<div className="text-xs text-gray-500">Grade {case_.grade}</div></td>
                            <td className="px-4 py-3">{case_.category_name}</td>
                            <td className="px-4 py-3">{case_.incident_date}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getSeverityColor(case_.severity)}`}>{case_.severity}</span></td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(case_.status)}`}>{case_.status}</span></td>
                            <td className="px-4 py-3 font-bold">{case_.points_awarded}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleResolveCase(case_.id)} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700" title="Resolve"><CheckCircle className="h-3.5 w-3.5" /></button>
                                <button onClick={() => setDeleteConfirm({ isOpen: true, id: case_.id, name: case_.incident_code })} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries</div>
                    <div className="flex gap-2">
                      <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 1} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                      <span className="px-3 py-1 text-sm bg-gray-100 border border-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                      <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={pagination.page === pagination.totalPages} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conduct Records Tab */}
            {activeTab === 'conduct' && !refreshing && (
              <div className="overflow-x-auto">
                {conductRecords.length === 0 ? (
                  <div className="text-center py-12"><Star className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No conduct records found</p></div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Student</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Conduct Grade</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Merits</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Demerits</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                      {conductRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{record.student_name}</td>
                          <td className="px-4 py-3">{record.grade}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getConductBadge(record.conduct_grade)}`}>{record.conduct_grade}</span></td>
                          <td className="px-4 py-3 text-green-600 font-bold">{record.merits}</td>
                          <td className="px-4 py-3 text-red-600 font-bold">{record.demerits}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(record.status)}`}>{record.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Interventions Tab */}
            {activeTab === 'interventions' && !refreshing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventions.length === 0 ? (
                  <div className="col-span-2 text-center py-12"><Target className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No intervention programs found</p></div>
                ) : (
                  interventions.map((program) => (
                    <div key={program.id} className="bg-gray-50 border border-gray-300 p-4">
                      <div className="flex justify-between items-start">
                        <div><h3 className="font-bold text-gray-900">{program.program_name}</h3><p className="text-sm text-gray-500">{program.program_type}</p></div>
                        <span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(program.status)}`}>{program.status}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><span className="text-gray-500">Students:</span><span className="font-medium">{program.enrolled_count || 0}</span><span className="text-gray-500">Facilitator:</span><span className="font-medium">{program.facilitator}</span></div>
                      <div className="mt-3"><div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{program.progress_percentage || 0}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${program.progress_percentage || 0}%` }}></div></div></div>
                    </div>
                  ))
                )}
                <button onClick={() => setShowInterventionModal(true)} className="border-2 border-dashed border-gray-300 p-4 text-center hover:border-green-500 hover:bg-green-50 transition">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Create New Intervention</p>
                </button>
              </div>
            )}

            {/* Counseling Tab */}
            {activeTab === 'counseling' && !refreshing && (
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-12"><MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No counseling sessions found</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="bg-gray-50 border border-gray-300 p-4 flex justify-between items-center">
                        <div><h3 className="font-bold text-gray-900">{session.student_name}</h3><p className="text-sm text-gray-500">{session.session_type} with {session.counselor_name}</p><p className="text-xs text-gray-400">{session.session_date} at {session.session_time}</p></div>
                        <span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(session.status)}`}>{session.status}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowSessionModal(true)} className="w-full border-2 border-dashed border-gray-300 p-4 text-center hover:border-green-500 hover:bg-green-50 transition">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Schedule New Session</p>
                </button>
              </div>
            )}

            {/* Suspensions Tab */}
            {activeTab === 'suspensions' && !refreshing && (
              <div className="overflow-x-auto">
                {suspensions.length === 0 ? (
                  <div className="text-center py-12"><UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No suspensions found</p></div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Student</th><th className="px-4 py-3 text-left font-bold text-gray-700">Reason</th><th className="px-4 py-3 text-left font-bold text-gray-700">Duration</th><th className="px-4 py-3 text-left font-bold text-gray-700">Type</th><th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                      {suspensions.map((sus) => (
                        <tr key={sus.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{sus.student_name}<div className="text-xs text-gray-500">Grade {sus.grade}</div></td>
                          <td className="px-4 py-3">{sus.reason}</td>
                          <td className="px-4 py-3">{sus.start_date} to {sus.end_date}<div className="text-xs">{sus.total_days} days</div></td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${sus.suspension_type === 'Out-of-School' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{sus.suspension_type}</span></td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(sus.status)}`}>{sus.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Reports Tab - Coming Soon */}
            {activeTab === 'reports' && !refreshing && (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Reports & Analytics coming soon</p>
                <p className="text-sm text-gray-400 mt-2">Detailed charts and statistics will be available here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Case Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCaseModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">New Discipline Case</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Student ID *</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={caseForm.student_id} onChange={(e) => setCaseForm({...caseForm, student_id: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Description *</label><textarea rows="3" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={caseForm.description} onChange={(e) => setCaseForm({...caseForm, description: e.target.value})}></textarea></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Location</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={caseForm.location} onChange={(e) => setCaseForm({...caseForm, location: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Severity</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={caseForm.severity} onChange={(e) => setCaseForm({...caseForm, severity: e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select></div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCaseModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateCase} disabled={loading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Create Case</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowSessionModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Schedule Counseling Session</h3>
              <button onClick={() => setShowSessionModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Student ID *</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={sessionForm.student_id} onChange={(e) => setSessionForm({...sessionForm, student_id: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Session Type</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={sessionForm.session_type} onChange={(e) => setSessionForm({...sessionForm, session_type: e.target.value})}><option>Academic Guidance</option><option>Personal Counseling</option><option>Career Counseling</option><option>Crisis Intervention</option></select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Date *</label><input type="date" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={sessionForm.session_date} onChange={(e) => setSessionForm({...sessionForm, session_date: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Time</label><input type="time" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={sessionForm.session_time} onChange={(e) => setSessionForm({...sessionForm, session_time: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Notes</label><textarea rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={sessionForm.notes} onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}></textarea></div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowSessionModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateSession} disabled={loading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Schedule Session</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Intervention Modal */}
      {showInterventionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowInterventionModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Create Intervention Program</h3>
              <button onClick={() => setShowInterventionModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Program Name *</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.program_name} onChange={(e) => setInterventionForm({...interventionForm, program_name: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Type</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.program_type} onChange={(e) => setInterventionForm({...interventionForm, program_type: e.target.value})}><option>Behavioral</option><option>Academic</option><option>Social</option><option>Counseling</option></select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.description} onChange={(e) => setInterventionForm({...interventionForm, description: e.target.value})}></textarea></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Duration (weeks)</label><input type="number" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.duration_weeks} onChange={(e) => setInterventionForm({...interventionForm, duration_weeks: parseInt(e.target.value)})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Facilitator</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.facilitator} onChange={(e) => setInterventionForm({...interventionForm, facilitator: e.target.value})} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Start Date *</label><input type="date" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" value={interventionForm.start_date} onChange={(e) => setInterventionForm({...interventionForm, start_date: e.target.value})} /></div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowInterventionModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateIntervention} disabled={loading} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Create Program</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discipline;