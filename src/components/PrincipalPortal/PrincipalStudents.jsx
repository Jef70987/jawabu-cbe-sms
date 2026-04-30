import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Authentication/AuthContext";
import {
  Users, GraduationCap, Search, Download, Eye,
  Mail, ChevronLeft, ChevronRight, AlertTriangle,
  Phone, MapPin, X, RefreshCw,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-800",
  Probation: "bg-orange-100 text-orange-800",
  "At Risk": "bg-red-100 text-red-800",
};

const initials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

const PrincipalStudents = () => {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({});
  const [meta, setMeta] = useState({ total: 0, page: 1, page_size: 50, total_pages: 1 });
  const [filterOptions, setFilterOptions] = useState({ classes: [] });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const fetchStudents = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page, page_size: 50 });
        if (search) params.set("search", search);
        if (classId) params.set("class_id", classId);
        if (statusFilter) params.set("status", statusFilter);

        const res = await apiRequest(`/api/principal/students/?${params}`);
        if (res.success) {
          setStudents(res.data);
          setSummary(res.summary || {});
          setMeta(res.meta);
          if (res.filters) setFilterOptions(res.filters);
        }
      } catch (err) {
        setError(err.message || "Failed to load students.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest, search, classId, statusFilter, page]
  );

  useEffect(() => {
    if (isAuthenticated) fetchStudents();
  }, [isAuthenticated, fetchStudents]);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const openModal = async (studentId) => {
    setShowModal(true);
    setModalLoading(true);
    setSelectedStudent(null);
    try {
      const res = await apiRequest(`/api/principal/students/${studentId}/`);
      if (res.success) setSelectedStudent(res.data);
    } catch {
      setSelectedStudent(null);
    } finally {
      setModalLoading(false);
    }
  };

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Please log in.</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-700 p-4 rounded-l">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Management</h1>
          <p className="text-white mt-1">All students in the system</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchStudents(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition"
          >
            <RefreshCw size={18} className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: summary.total, color: "text-gray-800", bg: "bg-blue-100", icon: <Users className="text-blue-600" size={20} /> },
          { label: "Active Students", value: summary.active, color: "text-green-600", bg: "bg-green-100", icon: <GraduationCap className="text-green-600" size={20} /> },
          { label: "On Probation", value: summary.probation, color: "text-orange-600", bg: "bg-orange-100", icon: <AlertTriangle className="text-orange-600" size={20} /> },
          { label: "At Risk", value: summary.at_risk, color: "text-red-600", bg: "bg-red-100", icon: <AlertTriangle className="text-red-600" size={20} /> },
        ].map((card) => (
          <div key={card.label} className="bg-gray-200 rounded-l border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value ?? "—"}
                </p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search name, admission no, guardian..."
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
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-500 border-b border-blue-200">
              <tr>
                {["Student", "Adm No", "Grade", "Guardian", "Contact", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {initials(student.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.admission_no}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{student.guardian_name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.guardian_phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[student.status] || "bg-gray-100 text-gray-700"}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openModal(student.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={15} className="text-gray-600" />
                        </button>
                        
                      </div>
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

      {/* Student Detail Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setShowModal(false); setSelectedStudent(null); }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button
                onClick={() => { setShowModal(false); setSelectedStudent(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {modalLoading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : !selectedStudent ? (
              <p className="text-red-500 text-center py-8">Could not load student details.</p>
            ) : (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {initials(`${selectedStudent.first_name} ${selectedStudent.last_name}`)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedStudent.first_name} {selectedStudent.middle_name || ""} {selectedStudent.last_name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {selectedStudent.admission_no} •{" "}
                      {selectedStudent.current_class?.class_name || "—"}
                    </p>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedStudent.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Personal</h4>
                    <p className="text-sm text-gray-600">Gender: {selectedStudent.gender}</p>
                    <p className="text-sm text-gray-600">DOB: {selectedStudent.date_of_birth || "—"}</p>
                    <p className="text-sm text-gray-600">Nationality: {selectedStudent.nationality || "—"}</p>
                    <p className="text-sm text-gray-600">UPI: {selectedStudent.upi_number || "—"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Guardian</h4>
                    <p className="text-sm text-gray-600">Name: {selectedStudent.guardian_name || "—"}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone size={12} /> {selectedStudent.guardian_phone || "—"}
                    </p>
                    <p className="text-sm text-gray-600">Relation: {selectedStudent.guardian_relation || "—"}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> {selectedStudent.address || "—"}
                    </p>
                  </div>
                </div>

                {/* Medical */}
                {(selectedStudent.medical_conditions || selectedStudent.allergies) && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="font-semibold text-red-700 mb-1 text-sm">Medical Notes</h4>
                    {selectedStudent.medical_conditions && (
                      <p className="text-sm text-gray-700">
                        Conditions: {selectedStudent.medical_conditions}
                      </p>
                    )}
                    {selectedStudent.allergies && (
                      <p className="text-sm text-gray-700">Allergies: {selectedStudent.allergies}</p>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalStudents;