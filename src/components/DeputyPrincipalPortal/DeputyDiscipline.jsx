/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Search, Filter,
  Plus, Eye, Edit2, Trash2, Download, FileText, Calendar,
  Users, TrendingUp, TrendingDown, BarChart3, PieChart,
  Target, Award, UserX, Mail, Phone, MessageSquare,
  Star, MinusCircle, MoreVertical, X, Loader2
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

  const bgColors = { success: 'border-l-green-600', error: 'border-l-red-600', info: 'border-l-blue-600' };
  const icons = { success: <CheckCircle className="h-5 w-5 text-green-600" />, error: <AlertTriangle className="h-5 w-5 text-red-600" />, info: <FileText className="h-5 w-5 text-blue-600" /> };

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border-l-4 ${bgColors[type]} border border-gray-300 shadow-lg p-4 min-w-[320px] animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information'}</p>
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
  const [toasts, setToasts] = useState([]);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Mock data - will be replaced with API calls
  const [cases, setCases] = useState([
    { id: 'DC001', student: 'James Wilson', grade: '11A', offense: 'Bullying', description: 'Repeated verbal harassment', date: '2024-03-15', reportedBy: 'Ms. Thompson', severity: 'High', status: 'Under Investigation', points: 10 },
    { id: 'DC002', student: 'Sarah Chen', grade: '10B', offense: 'Truancy', description: 'Skipped 5 classes', date: '2024-03-15', reportedBy: 'Mr. Davis', severity: 'Medium', status: 'Pending Review', points: 5 },
    { id: 'DC003', student: 'Michael Brown', grade: '12C', offense: 'Disruption', description: 'Repeated interruptions', date: '2024-03-14', reportedBy: 'Dr. Martinez', severity: 'Low', status: 'Resolved', points: 3 },
  ]);

  const [conductRecords, setConductRecords] = useState([
    { id: 'CR001', student: 'Emma Thompson', grade: '10B', conductGrade: 'A', merits: 15, demerits: 0, status: 'Excellent', trend: 'up' },
    { id: 'CR002', student: 'James Wilson', grade: '11A', conductGrade: 'C', merits: 3, demerits: 8, status: 'Warning', trend: 'down' },
    { id: 'CR003', student: 'Michael Brown', grade: '12C', conductGrade: 'D', merits: 1, demerits: 15, status: 'Probation', trend: 'down' },
  ]);

  const [interventions, setInterventions] = useState([
    { id: 'INT001', name: 'Behavior Improvement Program', type: 'Behavioral', students: 12, progress: 65, status: 'Active', facilitator: 'Dr. Wilson' },
    { id: 'INT002', name: 'Academic Support Group', type: 'Academic', students: 8, progress: 45, status: 'Active', facilitator: 'Ms. Thompson' },
  ]);

  const [sessions, setSessions] = useState([
    { id: 'CS001', student: 'Emma Thompson', counselor: 'Dr. Sarah Wilson', type: 'Academic Guidance', date: '2024-03-15', status: 'Scheduled' },
    { id: 'CS002', student: 'Alex Johnson', counselor: 'Mr. Robert Brown', type: 'Personal Counseling', date: '2024-03-15', status: 'In Progress' },
  ]);

  const [suspensions, setSuspensions] = useState([
    { id: 'SUS001', student: 'James Wilson', grade: '11A', reason: 'Physical altercation', startDate: '2024-03-10', endDate: '2024-03-17', days: 7, type: 'Out-of-School', status: 'Active' },
  ]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const tabs = [
    { id: 'cases', name: 'Discipline Cases', icon: <AlertTriangle size={16} /> },
    { id: 'conduct', name: 'Conduct Records', icon: <Star size={16} /> },
    { id: 'interventions', name: 'Interventions', icon: <Target size={16} /> },
    { id: 'counseling', name: 'Counseling', icon: <MessageSquare size={16} /> },
    { id: 'suspensions', name: 'Suspensions', icon: <UserX size={16} /> },
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

  // Chart data
  const monthlyTrends = [
    { month: 'Jan', cases: 28, resolved: 24 },
    { month: 'Feb', cases: 32, resolved: 28 },
    { month: 'Mar', cases: 35, resolved: 30 },
    { month: 'Apr', cases: 30, resolved: 32 },
    { month: 'May', cases: 38, resolved: 35 },
    { month: 'Jun', cases: 42, resolved: 38 },
  ];

  const offenseDistribution = [
    { name: 'Bullying', value: 45, color: '#EF4444' },
    { name: 'Truancy', value: 38, color: '#F59E0B' },
    { name: 'Disruption', value: 32, color: '#3B82F6' },
    { name: 'Academic', value: 18, color: '#8B5CF6' },
    { name: 'Other', value: 23, color: '#6B7280' },
  ];

  const severityDistribution = [
    { name: 'High', value: 28, color: '#EF4444' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Low', value: 83, color: '#10B981' },
  ];

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

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Discipline Management</h1>
            <p className="text-green-100 mt-1">Track cases, conduct records, interventions, and counseling</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 flex items-center gap-2 rounded">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={() => { setSelectedCase(null); setShowCaseModal(true); }} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 flex items-center gap-2 rounded">
              <Plus className="h-4 w-4" /> New Case
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500">Total Cases</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">42</p>
            <p className="text-xs text-gray-500">Active Cases</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">98</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">24</p>
            <p className="text-xs text-gray-500">Interventions</p>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <p className="text-2xl font-bold text-red-600">5</p>
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
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Cases Tab */}
            {activeTab === 'cases' && (
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
                          <td className="px-4 py-3 font-mono text-green-700">{case_.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{case_.student}<div className="text-xs text-gray-500">Grade {case_.grade}</div></td>
                          <td className="px-4 py-3">{case_.offense}</td>
                          <td className="px-4 py-3">{case_.date}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getSeverityColor(case_.severity)}`}>{case_.severity}</span></td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(case_.status)}`}>{case_.status}</span></td>
                          <td className="px-4 py-3 font-bold">{case_.points}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"><Eye className="h-3.5 w-3.5" /></button>
                              <button className="p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"><Edit2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Conduct Records Tab */}
            {activeTab === 'conduct' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Student</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Conduct Grade</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Merits</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Demerits</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {conductRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{record.student}</td>
                        <td className="px-4 py-3">{record.grade}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getConductBadge(record.conductGrade)}`}>{record.conductGrade}</span></td>
                        <td className="px-4 py-3 text-green-600 font-bold">{record.merits}</td>
                        <td className="px-4 py-3 text-red-600 font-bold">{record.demerits}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(record.status)}`}>{record.status}</span></td>
                        <td className="px-4 py-3 text-center"><button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"><Eye className="h-3.5 w-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Interventions Tab */}
            {activeTab === 'interventions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventions.map((program) => (
                  <div key={program.id} className="bg-gray-50 border border-gray-300 p-4">
                    <div className="flex justify-between items-start">
                      <div><h3 className="font-bold text-gray-900">{program.name}</h3><p className="text-sm text-gray-500">{program.type}</p></div>
                      <span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(program.status)}`}>{program.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><span className="text-gray-500">Students:</span><span className="font-medium">{program.students}</span><span className="text-gray-500">Facilitator:</span><span className="font-medium">{program.facilitator}</span></div>
                    <div className="mt-3"><div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{program.progress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${program.progress}%` }}></div></div></div>
                  </div>
                ))}
              </div>
            )}

            {/* Counseling Tab */}
            {activeTab === 'counseling' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-gray-50 border border-gray-300 p-4 flex justify-between items-center">
                      <div><h3 className="font-bold text-gray-900">{session.student}</h3><p className="text-sm text-gray-500">{session.type} with {session.counselor}</p><p className="text-xs text-gray-400">{session.date}</p></div>
                      <span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(session.status)}`}>{session.status}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 border border-gray-300 p-4 text-center"><button className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">Schedule New Session</button></div>
              </div>
            )}

            {/* Suspensions Tab */}
            {activeTab === 'suspensions' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-gray-100 border-b border-gray-300"><th className="px-4 py-3 text-left font-bold text-gray-700">Student</th><th className="px-4 py-3 text-left font-bold text-gray-700">Reason</th><th className="px-4 py-3 text-left font-bold text-gray-700">Duration</th><th className="px-4 py-3 text-left font-bold text-gray-700">Type</th><th className="px-4 py-3 text-left font-bold text-gray-700">Status</th><th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th></tr></thead>
                  <tbody>{suspensions.map((sus) => (<tr key={sus.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{sus.student}<div className="text-xs text-gray-500">Grade {sus.grade}</div></td><td className="px-4 py-3">{sus.reason}</td><td className="px-4 py-3">{sus.startDate} to {sus.endDate}<div className="text-xs">{sus.days} days</div></td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${sus.type === 'Out-of-School' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{sus.type}</span></td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border ${getStatusColor(sus.status)}`}>{sus.status}</span></td><td className="px-4 py-3 text-center"><button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"><Eye className="h-3.5 w-3.5" /></button></td></tr>))}</tbody>
                </table>
              </div>
            )}

            {/* Reports & Analytics Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 border border-gray-300 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Monthly Case Trends</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} /><Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} /></LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Offense Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RePieChart><Pie data={offenseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{offenseDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Severity Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={severityDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" radius={[4, 4, 0, 0]}>{severityDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-3"><div className="flex justify-between"><span className="text-gray-600">Resolution Rate</span><span className="font-bold text-green-600">78%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div></div><div className="flex justify-between"><span className="text-gray-600">Avg Resolution Time</span><span className="font-bold text-blue-600">5.2 days</span></div><div className="flex justify-between"><span className="text-gray-600">Repeat Offenders</span><span className="font-bold text-orange-600">23</span></div></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCaseModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">{selectedCase ? 'Edit Case' : 'New Discipline Case'}</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 mb-1">Student</label><input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Grade</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option>9A</option><option>10B</option><option>11A</option><option>12C</option></select></div></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Offense Type</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option>Bullying</option><option>Truancy</option><option>Disruption</option><option>Academic Dishonesty</option></select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea rows="3" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"></textarea></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 mb-1">Severity</label><select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Points</label><input type="number" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">Create Case</button><button type="button" onClick={() => setShowCaseModal(false)} className="flex-1 px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discipline;