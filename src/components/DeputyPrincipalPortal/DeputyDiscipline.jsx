/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  AlertTriangle, CheckCircle, Search, Plus, Trash2, FileText,
  Target, UserX, MessageSquare, Star, X, Loader2, RefreshCw,
  ChevronLeft, ChevronRight, BarChart3, Tag
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  const bgColors = { success: "border-l-green-600", error: "border-l-red-600", info: "border-l-blue-600", warning: "border-l-yellow-600" };
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertTriangle className="h-5 w-5 text-red-600" />,
    info: <FileText className="h-5 w-5 text-blue-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  };
  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border-l-4 ${bgColors[type]} border border-gray-300 shadow-lg p-4 min-w-[320px] animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Warning" : "Information"}</p>
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", loading = false }) => {
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmClass = "bg-red-600 hover:bg-red-700", loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white border border-gray-400 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100"><h3 className="text-md font-bold text-gray-900">{title}</h3></div>
        <div className="p-6"><p className="text-sm text-gray-800">{message}</p></div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-white text-sm font-bold border border-transparent disabled:opacity-50 ${confirmClass}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}{confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentSelector = ({ value, onChange, apiRequest, label = "Student *" }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLoadingClasses(true);
    apiRequest("/api/deputyadmin/discipline/classes/")
      .then((data) => { if (data.success) setClasses(data.data || []); })
      .catch(() => {})
      .finally(() => setLoadingClasses(false));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingStudents(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append("search", search.trim());
        if (selectedClass) params.append("class_id", selectedClass);
        const data = await apiRequest(`/api/deputyadmin/discipline/students/?${params}`);
        if (data.success) setStudents(data.data || []);
      } catch (e) { console.error("Error fetching students:", e); }
      finally { setLoadingStudents(false); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedClass]);

  const handleSelect = (e) => {
    const id = e.target.value;
    const student = students.find((s) => s.id === id) || null;
    setSelectedStudent(student);
    onChange(id);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Filter by Class</label>
        <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={selectedClass}
          onChange={(e) => { setSelectedClass(e.target.value); onChange(""); setSelectedStudent(null); }} disabled={loadingClasses}>
          <option value="">{loadingClasses ? "Loading classes…" : "All Classes"}</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input type="text" placeholder="Search by name or admission no…"
            className="w-full pl-9 pr-4 py-2 border border-gray-400 text-sm bg-white rounded"
            value={search} onChange={(e) => { setSearch(e.target.value); onChange(""); setSelectedStudent(null); }} />
          {loadingStudents && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
        </div>
        <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={value} onChange={handleSelect}>
          <option value="">{loadingStudents ? "Searching…" : students.length === 0 ? "No students found" : "— Select a student —"}</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.full_name} ({s.admission_number}) — {s.class_name}</option>
          ))}
        </select>
      </div>
      {selectedStudent && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-300 rounded text-sm">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-green-800 font-medium">{selectedStudent.full_name} · {selectedStudent.class_name} · {selectedStudent.admission_number}</span>
          <button type="button" className="ml-auto text-green-500 hover:text-green-700"
            onClick={() => { setSelectedStudent(null); onChange(""); setSearch(""); }}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const Discipline = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("cases");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: "" });
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState({ isOpen: false, id: null, name: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });

  const [cases, setCases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conductRecords, setConductRecords] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [stats, setStats] = useState({ totalCases: 0, activeCases: 0, resolvedCases: 0, totalInterventions: 0, activeSuspensions: 0, totalCounseling: 0 });

  const [caseForm, setCaseForm] = useState({ student_id: "", category_id: "", description: "", location: "" });
  const [sessionForm, setSessionForm] = useState({ student_id: "", session_type: "Personal Counseling", session_date: "", session_time: "", notes: "" });
  const [interventionForm, setInterventionForm] = useState({ program_name: "", program_type: "Behavioral", description: "", duration_weeks: 4, facilitator: "", start_date: "" });
  const [categoryForm, setCategoryForm] = useState({ category_name: "", severity_level: "Medium", default_points: 5 });

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5500);
  };

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const headers = { ...getAuthHeaders() };
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers, ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  }, [getAuthHeaders]);

  const fetchCases = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterSeverity !== "all") params.append("severity", filterSeverity);
      params.append("page", pagination.page);
      params.append("page_size", pagination.pageSize);
      const data = await apiRequest(`/api/deputyadmin/discipline/cases/?${params}`);
      if (data.success) {
        setCases(data.data || []);
        setPagination((prev) => ({ ...prev, total: data.pagination?.total || 0, totalPages: data.pagination?.total_pages || 0 }));
      }
    } catch { showToast("Failed to load cases", "error"); }
  }, [searchTerm, filterStatus, filterSeverity, pagination.page, pagination.pageSize, apiRequest]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/categories/");
      if (data.success) setCategories(data.data || []);
    } catch (err) { console.error("Categories:", err); }
  }, [apiRequest]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/conduct/");
      if (data.success) setConductRecords(data.data || []);
    } catch (err) { console.error(err); }
  }, [apiRequest]);

  const fetchInterventions = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/interventions/");
      if (data.success) setInterventions(data.data || []);
    } catch (err) { console.error(err); }
  }, [apiRequest]);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/sessions/");
      if (data.success) setSessions(data.data || []);
    } catch (err) { console.error(err); }
  }, [apiRequest]);

  const fetchSuspensions = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/suspensions/");
      if (data.success) setSuspensions(data.data || []);
    } catch (err) { console.error(err); }
  }, [apiRequest]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/stats/");
      if (data.success) setStats(data.data);
    } catch (err) { console.error(err); }
  }, [apiRequest]);

  const refreshAllData = async () => {
    setRefreshing(true);
    await Promise.all([fetchCases(), fetchCategories(), fetchConductRecords(), fetchInterventions(), fetchSessions(), fetchSuspensions(), fetchStats()]);
    setRefreshing(false);
    showToast("Data refreshed", "success");
  };

  const handleCreateCase = async () => {
    if (!caseForm.student_id || !caseForm.category_id || !caseForm.description) {
      showToast("Please select a student, category and fill in the description", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        student: caseForm.student_id,
        category: caseForm.category_id,
        description: caseForm.description,
        location: caseForm.location,
        incident_date: new Date().toISOString().split("T")[0],
      };
      const data = await apiRequest("/api/deputyadmin/discipline/cases/create/", { method: "POST", body: JSON.stringify(payload) });
      if (data.success) {
        showToast("Case created successfully", "success");
        setShowCaseModal(false);
        setCaseForm({ student_id: "", category_id: "", description: "", location: "" });
        fetchCases(); fetchStats();
      }
    } catch (err) { showToast(err.message || "Failed to create case", "error"); }
    finally { setLoading(false); }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.category_name || !categoryForm.severity_level) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/categories/create/", { method: "POST", body: JSON.stringify(categoryForm) });
      if (data.success) {
        showToast("Category created successfully", "success");
        setShowCategoryModal(false);
        setCategoryForm({ category_name: "", severity_level: "Medium", default_points: 5 });
        fetchCategories();
      }
    } catch (err) { showToast(err.message || "Failed to create category", "error"); }
    finally { setLoading(false); }
  };

  const handleDeleteCategory = async () => {
    setLoading(true);
    try {
      // FIXED: Use the standard REST destroy URL (no /delete/ suffix)
      const data = await apiRequest(`/api/deputyadmin/discipline/categories/${deleteCategoryConfirm.id}/`, { method: "DELETE" });
      if (data.success) {
        showToast("Category deleted", "success");
        fetchCategories();
      }
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    } finally {
      setLoading(false);
      setDeleteCategoryConfirm({ isOpen: false, id: null, name: "" });
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.student_id || !sessionForm.session_date) {
      showToast("Please select a student and session date", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        student: sessionForm.student_id,
        session_type: sessionForm.session_type,
        session_date: sessionForm.session_date,
        session_time: sessionForm.session_time,
        notes: sessionForm.notes,
      };
      const data = await apiRequest("/api/deputyadmin/discipline/sessions/create/", { method: "POST", body: JSON.stringify(payload) });
      if (data.success) {
        showToast("Session scheduled successfully", "success");
        setShowSessionModal(false);
        setSessionForm({ student_id: "", session_type: "Personal Counseling", session_date: "", session_time: "", notes: "" });
        fetchSessions(); fetchStats();
      }
    } catch (err) { showToast(err.message || "Failed to create session", "error"); }
    finally { setLoading(false); }
  };

  const handleCreateIntervention = async () => {
    if (!interventionForm.program_name || !interventionForm.start_date) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/api/deputyadmin/discipline/interventions/create/", { method: "POST", body: JSON.stringify(interventionForm) });
      if (data.success) {
        showToast("Intervention program created", "success");
        setShowInterventionModal(false);
        setInterventionForm({ program_name: "", program_type: "Behavioral", description: "", duration_weeks: 4, facilitator: "", start_date: "" });
        fetchInterventions(); fetchStats();
      }
    } catch (err) { showToast(err.message || "Failed to create intervention", "error"); }
    finally { setLoading(false); }
  };

  const handleDeleteCase = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/deputyadmin/discipline/cases/${deleteConfirm.id}/delete/`, { method: "DELETE" });
      if (data.success) { showToast("Case deleted", "success"); fetchCases(); fetchStats(); }
    } catch (err) { showToast(err.message || "Failed to delete", "error"); }
    finally { setLoading(false); setDeleteConfirm({ isOpen: false, id: null, name: "" }); }
  };

  const handleDeleteSuspension = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/deputyadmin/discipline/cases/${caseId}/resolve/`, { method: "PUT" });
      if (data.success) { showToast("Case resolved", "success"); fetchCases(); fetchStats(); }
    } catch (err) { showToast(err.message || "Failed to resolve", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) refreshAllData(); }, [isAuthenticated]);
  useEffect(() => { if (isAuthenticated) fetchCases(); }, [searchTerm, filterStatus, filterSeverity, pagination.page]);

  const getSeverityColor = (s) => ({ High: "bg-red-100 text-red-800 border-red-200", Medium: "bg-yellow-100 text-yellow-800 border-yellow-200", Low: "bg-green-100 text-green-800 border-green-200", Critical: "bg-purple-100 text-purple-800 border-purple-200" }[s] || "bg-gray-100 text-gray-800 border-gray-200");
  const getStatusColor = (s) => ({ "Under Investigation": "bg-orange-100 text-orange-800 border-orange-200", "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-200", Resolved: "bg-green-100 text-green-800 border-green-200", Closed: "bg-gray-100 text-gray-800 border-gray-200", Scheduled: "bg-blue-100 text-blue-800 border-blue-200", "In Progress": "bg-purple-100 text-purple-800 border-purple-200", Active: "bg-green-100 text-green-800 border-green-200", Reported: "bg-orange-100 text-orange-800 border-orange-200" }[s] || "bg-gray-100 text-gray-800 border-gray-200");
  const getConductBadge = (g) => ({ A: "bg-green-100 text-green-800 border-green-200", B: "bg-blue-100 text-blue-800 border-blue-200", C: "bg-yellow-100 text-yellow-800 border-yellow-200", D: "bg-orange-100 text-orange-800 border-orange-200", F: "bg-red-100 text-red-800 border-red-200" }[g] || "bg-gray-100 text-gray-800 border-gray-200");

  const tabs = [
    { id: "cases", name: "Discipline Cases", icon: <AlertTriangle size={16} />, count: stats.activeCases },
    { id: "conduct", name: "Conduct Records", icon: <Star size={16} />, count: conductRecords.length },
    { id: "interventions", name: "Interventions", icon: <Target size={16} />, count: stats.totalInterventions },
    { id: "counseling", name: "Counseling", icon: <MessageSquare size={16} />, count: stats.totalCounseling },
    { id: "suspensions", name: "Suspensions", icon: <UserX size={16} />, count: stats.activeSuspensions },
    { id: "categories", name: "Categories", icon: <Tag size={16} /> },
    { id: "reports", name: "Reports & Analytics", icon: <BarChart3 size={16} /> },
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
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in { animation: slideIn 0.3s ease-out; }`}</style>

      {toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />)}

      <ConfirmModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteCase} title="Delete Case" message={`Delete case "${deleteConfirm.name}"? This action cannot be undone.`} loading={loading} />

      <ConfirmModal
        isOpen={deleteCategoryConfirm.isOpen}
        onClose={() => setDeleteCategoryConfirm({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Delete category "${deleteCategoryConfirm.name}"? This cannot be undone.`}
        loading={loading}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Discipline Management</h1>
            <p className="text-green-100 mt-1">Track cases, interventions, counseling, and suspensions</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={refreshAllData} disabled={refreshing} className="px-4 py-2 bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 flex items-center gap-2 rounded">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => setShowCategoryModal(true)} className="px-4 py-2 bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 flex items-center gap-2 rounded">
              <Plus className="h-4 w-4" /> New Category
            </button>
            <button onClick={() => setShowCaseModal(true)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 flex items-center gap-2 rounded">
              <Plus className="h-4 w-4" /> New Case
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total Cases", value: stats.totalCases, color: "text-gray-900" },
            { label: "Active Cases", value: stats.activeCases, color: "text-orange-600" },
            { label: "Resolved", value: stats.resolvedCases, color: "text-green-600" },
            { label: "Interventions", value: stats.totalInterventions, color: "text-purple-600" },
            { label: "Active Suspensions", value: stats.activeSuspensions, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-300 p-4 text-center rounded">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300">
            <nav className="flex flex-wrap gap-1 px-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition ${activeTab === tab.id ? "border-b-2 border-green-700 text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
                  {tab.icon}<span>{tab.name}</span>
                  {tab.count !== undefined && <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">{tab.count}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {refreshing && <LoadingSpinner />}

            {/* Cases Tab */}
            {activeTab === "cases" && !refreshing && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input type="text" placeholder="Search cases..." className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm bg-white rounded"
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <select className="px-4 py-2 border border-gray-400 text-sm bg-white rounded" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="Reported">Reported</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-400 text-sm bg-white rounded" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                    <option value="all">All Severity</option>
                    <option value="Critical">Critical</option>
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
                          {["Case ID", "Student", "Category", "Date", "Severity", "Status", "Points", "Actions"].map(h => (
                            <th key={h} className={`px-4 py-3 text-left font-bold text-gray-700 ${h === "Actions" ? "text-center" : ""}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cases.map((case_) => (
                          <tr key={case_.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-green-700">{case_.incident_code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{case_.student_name}<div className="text-xs text-gray-500">{case_.grade}</div></td>
                            <td className="px-4 py-3">{case_.category_name}</td>
                            <td className="px-4 py-3">{case_.incident_date}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${getSeverityColor(case_.severity)}`}>{case_.severity}</span></td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(case_.status)}`}>{case_.status}</span></td>
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
                    <div className="text-sm text-gray-500">Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries</div>
                    <div className="flex gap-2">
                      <button onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 1} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50 rounded"><ChevronLeft className="h-4 w-4" /></button>
                      <span className="px-3 py-1 text-sm bg-gray-100 border border-gray-400 rounded">Page {pagination.page} of {pagination.totalPages}</span>
                      <button onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))} disabled={pagination.page === pagination.totalPages} className="px-3 py-1 border border-gray-400 text-sm disabled:opacity-50 rounded"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conduct Records Tab */}
            {activeTab === "conduct" && !refreshing && (
              <div className="overflow-x-auto">
                {conductRecords.length === 0 ? (
                  <div className="text-center py-12"><Star className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No conduct records found</p></div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        {["Student", "Grade", "Conduct Grade", "Merits", "Demerits", "Status"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {conductRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{record.student_name}</td>
                          <td className="px-4 py-3">{record.grade}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${getConductBadge(record.conduct_grade)}`}>{record.conduct_grade}</span></td>
                          <td className="px-4 py-3 text-green-600 font-bold">{record.merits}</td>
                          <td className="px-4 py-3 text-red-600 font-bold">{record.demerits}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(record.status)}`}>{record.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Interventions Tab */}
            {activeTab === "interventions" && !refreshing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventions.length === 0 ? (
                  <div className="col-span-2 text-center py-12"><Target className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No intervention programs found</p></div>
                ) : interventions.map((program) => (
                  <div key={program.id} className="bg-gray-50 border border-gray-300 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div><h3 className="font-bold text-gray-900">{program.program_name}</h3><p className="text-sm text-gray-500">{program.program_type}</p></div>
                      <span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(program.status)}`}>{program.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Students:</span><span className="font-medium">{program.enrolled_count || 0}</span>
                      <span className="text-gray-500">Facilitator:</span><span className="font-medium">{program.facilitator}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{program.progress_percentage || 0}%</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${program.progress_percentage || 0}%` }}></div></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowInterventionModal(true)} className="border-2 border-dashed border-gray-300 p-4 text-center hover:border-green-500 hover:bg-green-50 transition rounded">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Create New Intervention</p>
                </button>
              </div>
            )}

            {/* Counseling Tab */}
            {activeTab === "counseling" && !refreshing && (
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-12"><MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No counseling sessions found</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="bg-gray-50 border border-gray-300 p-4 flex justify-between items-center rounded">
                        <div>
                          <h3 className="font-bold text-gray-900">{session.student_name}</h3>
                          <p className="text-sm text-gray-500">{session.session_type} with {session.counselor_name}</p>
                          <p className="text-xs text-gray-400">{session.session_date} at {session.session_time}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(session.status)}`}>{session.status}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowSessionModal(true)} className="w-full border-2 border-dashed border-gray-300 p-4 text-center hover:border-green-500 hover:bg-green-50 transition rounded">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Schedule New Session</p>
                </button>
              </div>
            )}

            {/* Suspensions Tab */}
            {activeTab === "suspensions" && !refreshing && (
              <div className="overflow-x-auto">
                {suspensions.length === 0 ? (
                  <div className="text-center py-12"><UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-500">No suspensions found</p></div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        {["Student", "Reason", "Duration", "Type", "Status"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {suspensions.map((sus) => (
                        <tr key={sus.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{sus.student_name}<div className="text-xs text-gray-500">{sus.grade}</div></td>
                          <td className="px-4 py-3">{sus.reason}</td>
                          <td className="px-4 py-3">{sus.start_date} to {sus.end_date}<div className="text-xs">{sus.total_days} days</div></td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${sus.suspension_type === "Out-of-School" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{sus.suspension_type}</span></td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(sus.status)}`}>{sus.status}</span></td>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {suspensions.map((sus) => (
                          <tr key={sus.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{sus.student_name}<div className="text-xs text-gray-500">{sus.grade}</div></td>
                            <td className="px-4 py-3">{sus.reason}</td>
                            <td className="px-4 py-3">
                              {sus.start_date ? `${sus.start_date} to ${sus.end_date}` : "—"}
                              {sus.total_days > 0 && <div className="text-xs">{sus.total_days} days</div>}
                            </td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium border rounded ${sus.suspension_type === "Out-of-School" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{sus.suspension_type}</span></td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(sus.status)}`}>
                                {sus.status === 'Pending' && <Clock className="h-3 w-3 inline mr-1" />}
                                {sus.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {sus.status === 'Pending' ? (
                                  <>
                                    <button onClick={() => openApproveSuspension(sus)} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700" title="Approve"><CheckCircle className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => setDeleteSuspensionConfirm({ isOpen: true, id: sus.id, name: sus.student_name })} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Revoke"><Trash2 className="h-3.5 w-3.5" /></button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => { setEditSuspensionData(sus); setShowEditSuspensionModal(true); }} className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"><Edit2 className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => setDeleteSuspensionConfirm({ isOpen: true, id: sus.id, name: sus.student_name })} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"><Trash2 className="h-3.5 w-3.5" /></button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && !refreshing && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{categories.length} categories found</p>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800 rounded flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> New Category
                  </button>
                </div>

                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No categories defined yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          {["Code", "Category Name", "Severity", "Default Points", "Active", "Actions"].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-green-700">{cat.category_code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{cat.category_name}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium border rounded ${getSeverityColor(cat.severity_level)}`}>
                                {cat.severity_level}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold">{cat.default_points}</td>
                            <td className="px-4 py-3">
                              {cat.is_active ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setDeleteCategoryConfirm({ isOpen: true, id: cat.id, name: cat.category_name })}
                                className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                                title="Delete category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && !refreshing && (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Reports & Analytics coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Create Case Modal ── */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCaseModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full max-h-[90vh] flex flex-col rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">New Discipline Case</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <StudentSelector value={caseForm.student_id} onChange={(id) => setCaseForm({ ...caseForm, student_id: id })} apiRequest={apiRequest} />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-gray-700">Category *</label>
                  <button type="button" onClick={() => setShowCategoryModal(true)} className="text-xs text-green-700 hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add new
                  </button>
                </div>
                <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={caseForm.category_id}
                  onChange={(e) => setCaseForm({ ...caseForm, category_id: e.target.value })}>
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.category_name} ({c.severity_level}) — {c.default_points} pts</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                <textarea rows="3" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="Describe the incident…"
                  value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="e.g. Classroom 3B, Playground…"
                  value={caseForm.location} onChange={(e) => setCaseForm({ ...caseForm, location: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b">
              <button onClick={() => setShowCaseModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded">Cancel</button>
              <button onClick={handleCreateCase} disabled={loading || !caseForm.student_id || !caseForm.category_id || !caseForm.description}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 rounded">
                {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Create Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Category Modal ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCategoryModal(false)}>
          <div className="bg-white border border-gray-400 max-w-md w-full flex flex-col rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">New Discipline Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="e.g. Fighting, Bullying, Truancy…"
                  value={categoryForm.category_name} onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Severity Level *</label>
                <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={categoryForm.severity_level}
                  onChange={(e) => setCategoryForm({ ...categoryForm, severity_level: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Default Points</label>
                <input type="number" min="1" max="100" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                  value={categoryForm.default_points} onChange={(e) => setCategoryForm({ ...categoryForm, default_points: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b">
              <button onClick={() => setShowCategoryModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded">Cancel</button>
              <button onClick={handleCreateCategory} disabled={loading || !categoryForm.category_name}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 rounded">
                {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Session Modal ── */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowSessionModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full max-h-[90vh] flex flex-col rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">Schedule Counseling Session</h3>
              <button onClick={() => setShowSessionModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <StudentSelector value={sessionForm.student_id} onChange={(id) => setSessionForm({ ...sessionForm, student_id: id })} apiRequest={apiRequest} />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Session Type</label>
                <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={sessionForm.session_type}
                  onChange={(e) => setSessionForm({ ...sessionForm, session_type: e.target.value })}>
                  <option>Academic Guidance</option>
                  <option>Personal Counseling</option>
                  <option>Career Counseling</option>
                  <option>Crisis Intervention</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date *</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                    value={sessionForm.session_date} onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                  <input type="time" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                    value={sessionForm.session_time} onChange={(e) => setSessionForm({ ...sessionForm, session_time: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                <textarea rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="Any additional notes…"
                  value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b">
              <button onClick={() => setShowSessionModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded">Cancel</button>
              <button onClick={handleCreateSession} disabled={loading || !sessionForm.student_id || !sessionForm.session_date}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 rounded">
                {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Intervention Modal ── */}
      {showInterventionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowInterventionModal(false)}>
          <div className="bg-white border border-gray-400 max-w-lg w-full max-h-[90vh] flex flex-col rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">Create Intervention Program</h3>
              <button onClick={() => setShowInterventionModal(false)} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Program Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="e.g. Behavioral Improvement Programme"
                  value={interventionForm.program_name} onChange={(e) => setInterventionForm({ ...interventionForm, program_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" value={interventionForm.program_type}
                  onChange={(e) => setInterventionForm({ ...interventionForm, program_type: e.target.value })}>
                  <option>Behavioral</option><option>Academic</option><option>Social</option><option>Counseling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="Brief description…"
                  value={interventionForm.description} onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Duration (weeks)</label>
                  <input type="number" min="1" max="52" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                    value={interventionForm.duration_weeks} onChange={(e) => setInterventionForm({ ...interventionForm, duration_weeks: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Date *</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded"
                    value={interventionForm.start_date} onChange={(e) => setInterventionForm({ ...interventionForm, start_date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Facilitator</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white rounded" placeholder="Name of the facilitator…"
                  value={interventionForm.facilitator} onChange={(e) => setInterventionForm({ ...interventionForm, facilitator: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b">
              <button onClick={() => setShowInterventionModal(false)} className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded">Cancel</button>
              <button onClick={handleCreateIntervention} disabled={loading || !interventionForm.program_name || !interventionForm.start_date}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800 disabled:opacity-50 rounded">
                {loading && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}Create Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discipline;