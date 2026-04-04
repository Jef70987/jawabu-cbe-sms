import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Users, Shield, Heart, Calendar, Award,
  Star, TrendingUp, Clock, CheckCircle,
  AlertCircle, Download, Plus, Filter
} from 'lucide-react';

const DeputyStudentAffairs = () => {
  const location = useLocation();

  const subTabs = [
    { id: 'overview', name: 'Overview', path: '/deputy/student-affairs', icon: <Users size={16} /> },
    { id: 'all', name: 'All Students', path: '/deputy/student-affairs/all', icon: <Users size={16} /> },
    { id: 'conduct', name: 'Student Conduct', path: '/deputy/student-affairs/conduct', icon: <Shield size={16} /> },
    { id: 'welfare', name: 'Welfare', path: '/deputy/student-affairs/welfare', icon: <Heart size={16} /> },
    { id: 'activities', name: 'Activities', path: '/deputy/student-affairs/activities', icon: <Calendar size={16} /> },
    { id: 'clubs', name: 'Clubs & Societies', path: '/deputy/student-affairs/clubs', icon: <Award size={16} /> },
    { id: 'leaders', name: 'Student Leaders', path: '/deputy/student-affairs/leaders', icon: <Star size={16} /> }
  ];

  const studentStats = {
    totalStudents: 2450,
    activeStudents: 2380,
    onProbation: 45,
    honorRoll: 520,
    clubsCount: 24,
    studentLeaders: 36,
    welfareCases: 18,
    activitiesThisMonth: 32
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Affairs</h1>
          <p className="text-gray-600 mt-1">Manage student welfare, conduct, and activities</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{studentStats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Honor Roll</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{studentStats.honorRoll}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">21% of student body</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Clubs</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{studentStats.clubsCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Student organizations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Student Leaders</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{studentStats.studentLeaders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Leadership positions</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">On Probation</p>
          <p className="text-2xl font-bold text-orange-600">{studentStats.onProbation}</p>
          <p className="text-xs text-gray-500">Need monitoring</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Welfare Cases</p>
          <p className="text-2xl font-bold text-red-600">{studentStats.welfareCases}</p>
          <p className="text-xs text-gray-500">Active cases</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Activities This Month</p>
          <p className="text-2xl font-bold text-blue-600">{studentStats.activitiesThisMonth}</p>
          <p className="text-xs text-green-500">↑ 5 from last month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Students</p>
          <p className="text-2xl font-bold text-green-600">{studentStats.activeStudents}</p>
          <p className="text-xs text-gray-500">97% of total</p>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  location.pathname === tab.path || (tab.id === 'overview' && location.pathname === '/deputy/student-affairs')
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
          {/* Overview Content */}
          {(location.pathname === '/deputy/student-affairs' || location.pathname === '/deputy/student-affairs/overview') ? (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Student Affairs Overview</h3>
                  <p className="text-purple-100 mb-4">Monitor student welfare and development</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-purple-100">Student Satisfaction</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-sm text-purple-100">Activity Participation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Updates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">New club approved</p>
                        <p className="text-xs text-gray-500">Robotics Club established</p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Student council election</p>
                        <p className="text-xs text-gray-500">Nominations open</p>
                      </div>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/deputy/student-affairs/all">
                  <button className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left">
                    <Users size={24} className="text-blue-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">View All Students</h4>
                    <p className="text-sm text-gray-600">Access complete student directory</p>
                  </button>
                </Link>
                <Link to="/deputy/student-affairs/conduct">
                  <button className="w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-left">
                    <Shield size={24} className="text-green-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">Student Conduct</h4>
                    <p className="text-sm text-gray-600">Review conduct records</p>
                  </button>
                </Link>
                <Link to="/deputy/student-affairs/welfare">
                  <button className="w-full p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-left">
                    <Heart size={24} className="text-orange-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">Student Welfare</h4>
                    <p className="text-sm text-gray-600">Support services and counseling</p>
                  </button>
                </Link>
              </div>

              {/* Upcoming Activities */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Upcoming Activities</h3>
                  <Link to="/deputy/student-affairs/activities" className="text-sm text-purple-600 hover:text-purple-700">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Spring Festival</p>
                      <p className="text-sm text-gray-600">Cultural celebration</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">April 15, 2024</p>
                      <p className="text-xs text-gray-500">2:00 PM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Leadership Workshop</p>
                      <p className="text-sm text-gray-600">Student leaders training</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">April 18, 2024</p>
                      <p className="text-xs text-gray-500">9:00 AM - 12:00 PM</p>
                    </div>
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

export default DeputyStudentAffairs;