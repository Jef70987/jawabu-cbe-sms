import React, { useState, useEffect, useCallback } from 'react';
import {
  Gavel, AlertTriangle, Users, CheckCircle,
  Calendar, MessageSquare, FileText, UserX, UserCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DeputyPrincipalDashboard = () => {
  const { getAuthHeaders } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reusable authenticated fetch (mirrors your Discipline component)
  const apiRequest = useCallback(async (endpoint) => {
    const headers = { ...getAuthHeaders() };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }, [getAuthHeaders]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiRequest('/api/deputyadmin/discipline/dashboard/');
        if (data.success) {
          setDashboardData(data.data);
        } else {
          setError('Failed to load dashboard data.');
        }
      } catch (err) {
        setError(err.message || 'Network error while fetching dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [apiRequest]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error or no data state
  if (error || !dashboardData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Dashboard Error</p>
          <p className="text-gray-600">{error || 'No data available.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, weeklyCases, offenseTypes, recentCases} = dashboardData;
  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-700 rounded-l p-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Deputy Principal Dashboard</h1>
          <p className="text-white mt-1">Discipline & Student Affairs Overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>{todayDate}</span>
          </button>
          
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Cases', value: stats.activeCases, sub: 'Current open cases', icon: Gavel, bg: 'bg-orange-100', text: 'text-orange-600' },
          { label: 'Resolved Today', value: stats.resolvedToday, sub: "Today's closures", icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' },
          { label: 'Suspensions', value: stats.suspensions, sub: 'Active suspensions', icon: UserX, bg: 'bg-red-100', text: 'text-red-600' },
          { label: 'Counseling Today', value: stats.counselingSessions, sub: 'Sessions scheduled', icon: Users, bg: 'bg-blue-100', text: 'text-blue-600' },
        ].map((card) => (
          <div key={card.label} className="bg-gray-200 rounded-l  border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                <p className="text-sm text-gray-500 mt-2">{card.sub}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>
                <card.icon className={card.text} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Cases */}
        <div className="lg:col-span-2 bg-white rounded-l p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Discipline Cases</h2>
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm" disabled>
              <option>This Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyCases}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="minor" fill="#3B82F6" name="Minor Offenses" />
              <Bar dataKey="major" fill="#EF4444" name="Major Offenses" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Offense Types */}
        <div className="bg-white rounded-l p-6 border border-gray-400">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Offense Types</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={offenseTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {offenseTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {offenseTypes.map((type) => (
              <div key={type.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                <span className="text-sm text-gray-600">{type.name}: {type.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Cases + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-l p-6 border border-red-200 border-size-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Discipline Cases</h2>
          </div>
          <div className="space-y-4">
            {recentCases.map((c) => (
              <div key={c.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      c.severity === 'High' ? 'bg-red-100' :
                      c.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <AlertTriangle size={16} className={
                        c.severity === 'High' ? 'text-red-600' :
                        c.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      } />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {c.student?.first_name} {c.student?.last_name} • Grade {c.student?.current_class?.name || '?'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {c.offense_description || c.category?.category_name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    c.status === 'Investigation' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{c.incident_date}</span>
                    <span className="text-gray-500">
                      Assigned: {c.reported_by?.first_name} {c.reported_by?.last_name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentCases.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent cases found.</p>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex flex-col items-center">
                <FileText size={20} className="mb-1" />
                <span className="text-sm">New Case</span>
              </button>
              <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex flex-col items-center">
                <Calendar size={20} className="mb-1" />
                <span className="text-sm">Schedule Hearing</span>
              </button>
              <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex flex-col items-center">
                <MessageSquare size={20} className="mb-1" />
                <span className="text-sm">Counseling</span>
              </button>
              <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition flex flex-col items-center">
                <UserCheck size={20} className="mb-1" />
                <span className="text-sm">Follow-up</span>
              </button>
            </div>
          </div> */}

          {/* Today's Schedule */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {todaySchedule.map((event, idx) => (
                <div key={idx} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-16 text-sm font-medium text-gray-600">{event.time}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
              {todaySchedule.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-2">No events scheduled for today.</p>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DeputyPrincipalDashboard;