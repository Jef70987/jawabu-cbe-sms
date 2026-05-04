import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import MLMonitoringPanel from "../CommonService/MLMonitoringPanel";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Users, UserCheck, DollarSign, Activity,
  Bell, Download, MoreVertical, RefreshCw,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PrincipalDashboard = () => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();

  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const monitoringToken = getAuthHeaders()?.Authorization || null;
  const canViewMonitoring = [
    "admin",
    "administrator",
    "registrar",
    "principal",
    "staff",
    "teacher",
    "deputy_principal",
    "hr_manager",
  ].includes(String(user?.role || "").toLowerCase());

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

  const fetchAll = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const [statsRes, perfRes, actRes] = await Promise.all([
          apiRequest("/api/principal/dashboard/stats/"),
          apiRequest("/api/principal/dashboard/performance/"),
          apiRequest("/api/principal/dashboard/activities/"),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (perfRes.success) setPerformance(perfRes.data);
        if (actRes.success) setActivities(actRes.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest]
  );

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated, fetchAll]);

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Please log in to view the dashboard.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
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
      <div className="flex justify-between items-center bg-green-700 rounded-l p-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Principal's Dashboard</h1>
          <p className="text-white mt-1">Welcome back</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchAll(true)}
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
          {
            label: "Total Students",
            value: stats?.total_students?.toLocaleString() ?? "—",
            icon: <Users className="text-blue-600" size={24} />,
            bg: "bg-blue-100",
          },
          {
            label: "Teaching Staff",
            value: stats?.total_staff?.toLocaleString() ?? "—",
            icon: <UserCheck className="text-green-600" size={24} />,
            bg: "bg-green-100",
          },
          {
            label: "Monthly Revenue",
            value:
              stats?.monthly_revenue != null
                ? `KES ${(stats.monthly_revenue / 1000).toFixed(1)}K`
                : "—",
            icon: <DollarSign className="text-purple-600" size={24} />,
            bg: "bg-purple-100",
          },
          {
            label: "Attendance Rate",
            value: stats?.attendance_rate != null ? `${stats.attendance_rate}%` : "—",
            icon: <Activity className="text-yellow-600" size={24} />,
            bg: "bg-yellow-100",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <MLMonitoringPanel token={monitoringToken} canViewMonitoring={canViewMonitoring} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Revenue (KES)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalDashboard;
