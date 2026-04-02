import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Gavel, AlertTriangle, CheckCircle, Clock,
  FileText, Plus, Search, Filter,
  TrendingUp, BarChart3, Calendar, Users
} from 'lucide-react';

const DeputyDiscipline = () => {
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const subTabs = [
    { id: 'overview', name: 'Overview', path: '/deputy/discipline', icon: <BarChart3 size={16} /> },
    { id: 'cases', name: 'All Cases', path: '/deputy/discipline/cases', icon: <FileText size={16} /> },
    { id: 'new', name: 'New Case', path: '/deputy/discipline/new', icon: <Plus size={16} /> },
    { id: 'active', name: 'Active Cases', path: '/deputy/discipline/active', icon: <AlertTriangle size={16} /> },
    { id: 'hearings', name: 'Hearings', path: '/deputy/discipline/hearings', icon: <Calendar size={16} /> },
    { id: 'appeals', name: 'Appeals', path: '/deputy/discipline/appeals', icon: <Gavel size={16} /> },
    { id: 'resolved', name: 'Resolved', path: '/deputy/discipline/resolved', icon: <CheckCircle size={16} /> }
  ];

  const disciplineStats = {
    totalCases: 156,
    activeCases: 42,
    resolvedCases: 98,
    pendingReview: 16,
    highSeverity: 12,
    hearingsThisWeek: 8,
    appealsPending: 5
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Management</h1>
          <p className="text-gray-600 mt-1">Manage disciplinary cases, hearings, and appeals</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <Link to="/deputy/discipline/new">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
              <Plus size={18} />
              <span>New Case</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This academic year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{disciplineStats.activeCases}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">Require attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolved Cases</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{disciplineStats.resolvedCases}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">63% resolution rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Appeals</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{disciplineStats.appealsPending}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Gavel className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Need review</p>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500">High Severity Cases</p>
          <p className="text-lg font-semibold text-red-600">{disciplineStats.highSeverity}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500">Hearings This Week</p>
          <p className="text-lg font-semibold text-blue-600">{disciplineStats.hearingsThisWeek}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500">Pending Review</p>
          <p className="text-lg font-semibold text-yellow-600">{disciplineStats.pendingReview}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500">Avg Resolution Time</p>
          <p className="text-lg font-semibold text-purple-600">5.2 days</p>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {subTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  location.pathname === tab.path || (tab.id === 'overview' && location.pathname === '/deputy/discipline')
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Content based on current route */}
          {location.pathname === '/deputy/discipline' || location.pathname === '/deputy/discipline/overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions Card */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                  <p className="text-purple-100 mb-4">Manage disciplinary cases efficiently</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/deputy/discipline/new">
                      <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition">
                        + New Case
                      </button>
                    </Link>
                    <Link to="/deputy/discipline/hearings">
                      <button className="w-full px-4 py-2 bg-white/20 border border-white rounded-lg hover:bg-white/30 transition">
                        Schedule Hearing
                      </button>
                    </Link>
                    <Link to="/deputy/discipline/appeals">
                      <button className="w-full px-4 py-2 bg-white/20 border border-white rounded-lg hover:bg-white/30 transition">
                        Review Appeals
                      </button>
                    </Link>
                    <Link to="/deputy/discipline/resolved">
                      <button className="w-full px-4 py-2 bg-white/20 border border-white rounded-lg hover:bg-white/30 transition">
                        View Resolved
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertTriangle size={16} className="text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">New case filed</p>
                        <p className="text-xs text-gray-500">James Wilson - Physical Altercation</p>
                      </div>
                      <span className="text-xs text-gray-400">5 min ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Case resolved</p>
                        <p className="text-xs text-gray-500">Emily Davis - Uniform violation</p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Hearing scheduled</p>
                        <p className="text-xs text-gray-500">Michael Brown - April 5, 2024</p>
                      </div>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Hearings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Upcoming Hearings</h3>
                  <Link to="/deputy/discipline/hearings" className="text-sm text-purple-600 hover:text-purple-700">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Michael Brown - Academic Dishonesty</p>
                      <p className="text-sm text-gray-600">Grade 12C</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">April 5, 2024</p>
                      <p className="text-xs text-gray-500">10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Emily Davis - Bullying</p>
                      <p className="text-sm text-gray-600">Grade 9D</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">April 6, 2024</p>
                      <p className="text-xs text-gray-500">2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discipline Guidelines */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Disciplinary Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                    <span className="text-gray-600">First offense: Warning & Counseling</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
                    <span className="text-gray-600">Second offense: Detention & Parent Meeting</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                    <span className="text-gray-600">Third offense: Suspension & Review Board</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeputyDiscipline;