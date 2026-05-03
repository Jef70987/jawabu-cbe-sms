/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  Search,
  Download,
  Printer,
  RefreshCw,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-600",
  };
  if (!isVisible) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`${styles[type]} text-white shadow-lg p-4 min-w-[280px] max-w-md`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium capitalize text-sm">{type}</p>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Session Expired
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Your session has expired. Please log in again to continue.
          </p>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Log In Again
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children, color = "blue" }) => (
  <div className="bg-white border border-gray-300 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 text-${color}-600`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatBadge = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border ${colorClasses[color]}`}
    >
      <Icon className="w-5 h-5" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </div>
  );
};

const FeeStructure = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({
    academic_year: "",
    term: "",
    class_id: "",
    is_active: "all",
  });

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000,
    );
  };

  const handleApiError = (error) => {
    if (error?.status === 401) setShowSessionExpired(true);
  };
  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = "/login";
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [yearsRes, classesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/academic/academic-years/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, {
          headers: getAuthHeaders(),
        }),
      ]);
      if (yearsRes.status === 401 || classesRes.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const [yearsData, classesData] = await Promise.all([
        yearsRes.json(),
        classesRes.json(),
      ]);
      if (yearsData.success)
        setAcademicYears(yearsData.data.map((y) => y.year_code));
      if (classesData.success) setClasses(classesData.data || []);
    } catch {
      /* silent */
    }
  }, [getAuthHeaders]);

  const fetchFeeStructures = useCallback(async (activeFilters) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilters.academic_year)
        params.append("academic_year", activeFilters.academic_year);
      if (activeFilters.term && activeFilters.term !== "all")
        params.append("term", activeFilters.term);
      if (activeFilters.class_id) params.append("class_id", activeFilters.class_id);
      if (activeFilters.is_active !== "all")
        params.append("is_active", activeFilters.is_active);

      const res = await fetch(
        `${API_BASE_URL}/api/accountant/fees/structures/?${params}`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setFeeStructures(data.data || []);
        setError(null);
      } else {
        setError(data.error || "Failed to load fee structures");
        showToast(data.error || "Failed to load", "error");
      }
    } catch {
      setError("Failed to load fee structures");
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  const fetchStructureDetails = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/accountant/fees/structures/${id}/`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSelectedStructure(data.data);
        setShowDetailModal(true);
      } else showToast(data.error || "Failed to load details", "error");
    } catch {
      showToast("Failed to load structure details", "error");
    }
  };

  const toggleRow = (id) => {
    const next = new Set(expandedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRows(next);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFilterOptions();
      fetchFeeStructures(filters);
    }
  }, [fetchFeeStructures, fetchFilterOptions, filters, isAuthenticated]);

  const clearFilters = () =>
    setFilters({ academic_year: "", term: "", class_id: "", is_active: "all" });

  const exportCSV = () => {
    if (!filteredStructures.length) {
      showToast("No data to export", "warning");
      return;
    }
    const headers = [
      "Academic Year",
      "Term",
      "Class",
      "Category",
      "Amount (KES)",
      "Due Date",
      "Frequency",
      "Status",
    ];
    const rows = filteredStructures.map((s) =>
      [
        s.academic_year,
        s.term,
        s.class_name,
        s.category_name,
        s.amount,
        new Date(s.due_date).toLocaleDateString(),
        s.frequency,
        s.is_active ? "Active" : "Inactive",
      ].join(","),
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fee_structures_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Exported as CSV", "success");
  };

  const formatCurrency = (amount) =>
    `KSh ${parseFloat(amount || 0).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filteredStructures = feeStructures.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      s.class_name?.toLowerCase().includes(q) ||
      s.category_name?.toLowerCase().includes(q) ||
      s.academic_year?.toLowerCase().includes(q) ||
      s.term?.toLowerCase().includes(q)
    );
  });

  const totalAmount = filteredStructures.reduce(
    (sum, s) => sum + parseFloat(s.amount || 0),
    0,
  );
  const activeCount = feeStructures.filter((s) => s.is_active).length;
  const uniqueClasses = [...new Set(feeStructures.map((s) => s.class_name))]
    .length;
  const uniqueCategories = [
    ...new Set(feeStructures.map((s) => s.category_name)),
  ].length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <a
            href="/login"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onLogout={handleLogout}
      />
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t2) => t2.id !== t.id))
          }
        />
      ))}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 bg-green-700 p-6 rounded-l">
          <h1 className="text-3xl font-bold text-white">
            Fee Structure Management
          </h1>
          <p className="text-white mt-1">
            View fee structures configured by the accounting department
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBadge
            label="Total Structures"
            value={feeStructures.length}
            icon={FileText}
            color="blue"
          />
          <StatBadge
            label="Active Structures"
            value={activeCount}
            icon={TrendingUp}
            color="green"
          />
          <StatBadge
            label="Unique Classes"
            value={uniqueClasses}
            icon={Building}
            color="purple"
          />
          <StatBadge
            label="Categories"
            value={uniqueCategories}
            icon={Users}
            color="orange"
          />
        </div>

        {/* Layout: table + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <div className="bg-white border border-gray-300 overflow-hidden">
              <div
                className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                <h3 className="text-base font-semibold text-gray-900">
                  Filter Structures
                </h3>
                <button className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  {showFilters ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
              </div>
              {showFilters && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Academic Year
                    </label>
                    <select
                      value={filters.academic_year}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          academic_year: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Years</option>
                      {academicYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Term
                    </label>
                    <select
                      value={filters.term}
                      onChange={(e) =>
                        setFilters({ ...filters, term: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Terms</option>
                      {["Term 1", "Term 2", "Term 3"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Class
                    </label>
                    <select
                      value={filters.class_id}
                      onChange={(e) =>
                        setFilters({ ...filters, class_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Classes</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Status
                    </label>
                    <select
                      value={filters.is_active}
                      onChange={(e) =>
                        setFilters({ ...filters, is_active: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        clearFilters();
                        setTimeout(fetchFeeStructures, 100);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => {
                        fetchFeeStructures(filters);
                        setShowFilters(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search & Actions */}
            <div className="bg-white border border-gray-300 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by class, category, year, or term..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchFeeStructures}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={exportCSV}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="bg-white border border-gray-300 p-12 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">Loading fee structures...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white border border-gray-300 p-12 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold mb-3">{error}</p>
                <button
                  onClick={fetchFeeStructures}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredStructures.length === 0 ? (
              <div className="bg-white border border-gray-300 p-12 text-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold mb-1">
                  No fee structures found
                </p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Year & Term
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Class & Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Payment Terms
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStructures.map((s) => (
                        <React.Fragment key={s.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900 text-sm">
                                {s.academic_year}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {s.term}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                Due: {new Date(s.due_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900 text-sm">
                                {s.class_name}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {s.category_name}
                              </div>
                              {s.category_code && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {s.category_code}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-green-700">
                                {formatCurrency(s.amount)}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {s.frequency}
                              </div>
                            </td>
                            <td className="px-6 py-4 space-y-1">
                              {s.installment_allowed && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                                  Installments: {s.max_installments}
                                </span>
                              )}
                              {s.discount_allowed && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 ml-1">
                                  Discount: {s.max_discount_percentage}%
                                </span>
                              )}
                              <div className="text-xs text-gray-400">
                                Late: {s.late_fee_percentage}% after{" "}
                                {s.late_fee_after_days}d
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium ${s.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {s.is_active ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleRow(s.id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  {expandedRows.has(s.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => fetchStructureDetails(s.id)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expandedRows.has(s.id) && (
                            <tr className="bg-gray-50 border-t border-gray-100">
                              <td colSpan="6" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                      Payment Info
                                    </p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          GL Account
                                        </span>
                                        <span className="font-medium">
                                          {s.gl_account_code || "Not set"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          Mandatory
                                        </span>
                                        <span
                                          className={`font-medium ${s.is_mandatory ? "text-green-600" : "text-yellow-600"}`}
                                        >
                                          {s.is_mandatory ? "Yes" : "No"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                      Created By
                                    </p>
                                    <div className="text-gray-900">
                                      {s.created_by_name || "System"}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {new Date(s.created_at).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                      Quick Actions
                                    </p>
                                    <button
                                      onClick={() =>
                                        fetchStructureDetails(s.id)
                                      }
                                      className="px-3 py-1.5 bg-blue-600 text-white text-xs hover:bg-blue-700"
                                    >
                                      View Full Details
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan="2"
                          className="px-6 py-4 text-sm font-semibold text-gray-700"
                        >
                          {filteredStructures.length} structure(s)
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-700">
                            {formatCurrency(totalAmount)}
                          </span>
                        </td>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-xs text-gray-500 text-right"
                        >
                          Avg:{" "}
                          {filteredStructures.length > 0
                            ? formatCurrency(
                                totalAmount / filteredStructures.length,
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <InfoCard title="Payment Channels" icon={DollarSign} color="green">
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center font-bold text-green-700 flex-shrink-0">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">MPESA</p>
                    <p className="text-xs text-gray-500">
                      Account: Admission No
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center font-bold text-blue-700 flex-shrink-0">
                    K
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      KCB Bank
                    </p>
                    <p className="text-xs text-gray-500">Acc: 1234567890</p>
                    <p className="text-xs text-gray-400">Jawabu School</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Quick Stats" icon={TrendingUp} color="blue">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    Active Structures
                  </span>
                  <span className="font-bold text-blue-600">{activeCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      feeStructures.reduce(
                        (sum, s) => sum + parseFloat(s.amount || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Unique Classes</span>
                  <span className="font-bold text-purple-600">
                    {uniqueClasses}
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="System Info" icon={FileText} color="blue">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Sync</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Version</span>
                  <span className="font-medium text-gray-900">v1.0</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={fetchFeeStructures}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh Data
                  </button>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Jawabu School Management System.
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStructure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Fee Structure Details
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedStructure.class_name} ·{" "}
                  {selectedStructure.category_name}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Basic Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Academic Year</span>
                    <span className="font-semibold">
                      {selectedStructure.academic_year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Term</span>
                    <span className="font-semibold">
                      {selectedStructure.term}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Class</span>
                    <span className="font-semibold">
                      {selectedStructure.class_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold">
                      {selectedStructure.category_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Financial Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-green-700 text-base">
                      {formatCurrency(selectedStructure.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span className="font-semibold">
                      {new Date(
                        selectedStructure.due_date,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency</span>
                    <span className="font-semibold">
                      {selectedStructure.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium ${selectedStructure.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {selectedStructure.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Payment Terms
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-1">
                      Installment
                    </div>
                    <div
                      className={`font-semibold ${selectedStructure.installment_allowed ? "text-green-600" : "text-red-500"}`}
                    >
                      {selectedStructure.installment_allowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </div>
                    {selectedStructure.installment_allowed && (
                      <div className="text-xs text-gray-400 mt-1">
                        Max: {selectedStructure.max_installments}
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-1">Discount</div>
                    <div
                      className={`font-semibold ${selectedStructure.discount_allowed ? "text-green-600" : "text-red-500"}`}
                    >
                      {selectedStructure.discount_allowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </div>
                    {selectedStructure.discount_allowed && (
                      <div className="text-xs text-gray-400 mt-1">
                        Max: {selectedStructure.max_discount_percentage}%
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-1">Late Fee</div>
                    <div className="font-semibold text-orange-600">
                      {selectedStructure.late_fee_percentage}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      After {selectedStructure.late_fee_after_days} days
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 bg-gray-50 border border-gray-200 p-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Audit Info
                </h4>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created By</span>
                      <span className="font-semibold">
                        {selectedStructure.created_by_name || "System"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created At</span>
                      <span className="font-semibold">
                        {new Date(
                          selectedStructure.created_at,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">
                      {selectedStructure.description ||
                        "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;
