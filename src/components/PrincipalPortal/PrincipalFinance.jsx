import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, TrendingUp, Download, Search,
  ChevronLeft, ChevronRight, RefreshCw,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_COLORS = {
  Paid: "bg-green-100 text-green-800",
  Partial: "bg-yellow-100 text-yellow-800",
  Unpaid: "bg-red-100 text-red-800",
};

const PrincipalFinance = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [overview, setOverview] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, page_size: 50, total_pages: 1 });
  const [filterOptions, setFilterOptions] = useState({ classes: [], terms: [] });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [termId, setTermId] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const apiRequest = useCallback(
    async (endpoint) => {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { ...getAuthHeaders() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    [getAuthHeaders]
  );

  // Fetch static overview data
  const fetchStatic = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const [overviewRes, trendRes, txRes] = await Promise.all([
          apiRequest("/api/principal/finance/overview/"),
          apiRequest("/api/principal/finance/revenue-trend/"),
          apiRequest("/api/principal/finance/recent-transactions/"),
        ]);
        if (overviewRes.success) setOverview(overviewRes.data);
        if (trendRes.success) setRevenueTrend(trendRes.data);
        if (txRes.success) setTransactions(txRes.data);
      } catch (err) {
        setError(err.message || "Failed to load financial data.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest]
  );

  // Fetch student fee table
  const fetchStudents = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({ page, page_size: 50 });
      if (search) params.set("search", search);
      if (classId) params.set("class_id", classId);
      if (termId) params.set("term_id", termId);
      const res = await apiRequest(`/api/principal/finance/students-fees/?${params}`);
      if (res.success) {
        setStudents(res.data);
        setMeta(res.meta);
        if (res.filters) setFilterOptions(res.filters);
      }
    } catch (err) {
      setError(err.message || "Failed to load student fee data.");
    } finally {
      setTableLoading(false);
    }
  }, [apiRequest, search, classId, termId, page]);

  useEffect(() => {
    if (isAuthenticated) fetchStatic();
  }, [isAuthenticated, fetchStatic]);

  useEffect(() => {
    if (isAuthenticated) fetchStudents();
  }, [isAuthenticated, fetchStudents]);

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Please log in.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading financial data...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const totalRevenue = overview?.total_revenue ?? 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center rounde-l bg-green-700 p-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
          <p className="text-green-200 mt-1">Monitor revenue, student fees and transactions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchStatic(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition"
          >
            <RefreshCw size={18} className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
         
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-200 rounded-l p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue Collected</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                KES {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-l p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students with Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {meta.total.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-l p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Transactions</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{transactions.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="tuition" fill="#3B82F6" name="Tuition Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Fee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Fee Summary</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search student or admission no..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={classId}
              onChange={(e) => { setClassId(e.target.value); setPage(1); }}
            >
              <option value="">All Classes</option>
              {filterOptions.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name} ({c.class_code})
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={termId}
              onChange={(e) => { setTermId(e.target.value); setPage(1); }}
            >
              <option value="">All Terms</option>
              {filterOptions.terms.map((t) => (
                <option key={t.id} value={t.id}>{t.term_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Student", "Adm No", "Grade", "Billed (KES)", "Paid (KES)", "Balance (KES)", "Status", "Term Breakdown"].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">No students found.</td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-4 text-gray-600">{s.admission_no}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {s.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{s.total_billed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{s.total_paid.toLocaleString()}</td>
                    <td className={`px-6 py-4 font-medium ${s.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {s.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[s.payment_status] || "bg-gray-100 text-gray-800"}`}>
                        {s.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 space-y-0.5">
                      {s.term_breakdown.length === 0
                        ? "—"
                        : s.term_breakdown.map((tb) => (
                            <div key={tb.term_id || tb.term_name}>
                              <span className="font-medium text-gray-700">{tb.term_name}:</span>{" "}
                              Paid {tb.paid.toLocaleString()} / {tb.billed.toLocaleString()}
                            </div>
                          ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {Math.min((meta.page - 1) * meta.page_size + 1, meta.total)}–
            {Math.min(meta.page * meta.page_size, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="p-1.5 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700">
              Page {meta.page} of {meta.total_pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
              disabled={meta.page >= meta.total_pages}
              className="p-1.5 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {["Description", "Date", "Amount (KES)", "Method", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No transactions.</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.description}</td>
                    <td className="px-4 py-3 text-gray-600">{t.date}</td>
                    <td className="px-4 py-3 font-medium text-green-600">
                      +{Number(t.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.payment_mode}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrincipalFinance;