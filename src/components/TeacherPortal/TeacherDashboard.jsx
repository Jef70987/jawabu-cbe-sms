import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  BookOpen, Users, Target, User, Loader2, AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TeacherDashboard = () => {
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [activeAssessments, setActiveAssessments] = useState([]);
  const [error, setError] = useState(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      ...options,
    });
    if (res.status === 401) {
      logout();
      return null;
    }
    return res.json();
  };

  const fetchTeacherDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch(`${API_BASE_URL}/api/teacher/academic/teacher-dashboard/`);

      if (response?.success) {
        setTeacherData(response.data.teacherData);
        setAssignedClasses(response.data.assignedClasses);
        setActiveAssessments(response.data.activeAssessments);
      } else {
        throw new Error(response?.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeacherDashboardData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6" role="main">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6" role="alert">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchTeacherDashboardData}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6" role="main" aria-label="Teacher Dashboard">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {teacherData?.name}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {teacherData?.staffId}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {teacherData?.department}
          </span>
        </div>
      </header>

      {/* Stats Overview - Matches your screenshot design */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Assigned Classes */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <BookOpen className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{assignedClasses.length}</span>
            <span className="text-sm text-gray-600">Assigned Classes</span>
          </div>
        </div>

        {/* Active Assessments */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <Target className="w-6 h-6 text-green-800" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{activeAssessments.length}</span>
            <span className="text-sm text-gray-600">Active Assessments</span>
          </div>
        </div>

        {/* Total Students - Exact match to your screenshot */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-purple-800" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">
              {assignedClasses.reduce((acc, cls) => acc + cls.students, 0)}
            </span>
            <span className="text-sm text-gray-600">Total Students</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Classes */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Classes</h2>
          <div className="space-y-4">
            {assignedClasses.map((cls) => (
              <article key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{cls.className}</h3>
                  {cls.stream && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {cls.stream}
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="text-gray-900 font-medium">{cls.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subjects:</span>
                    <span className="text-gray-900 font-medium">{cls.subjects.join(', ')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Enter Marks
                  </button>
                </div>
              </article>
            ))}
            {assignedClasses.length === 0 && (
              <p className="text-gray-500 text-center py-8">No classes assigned yet.</p>
            )}
          </div>
        </section>

        {/* Active Assessments */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Assessments</h2>
          <div className="space-y-4">
            {activeAssessments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active assessments at the moment.</p>
            ) : (
              activeAssessments.map((assessment) => (
                <article key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                  {/* Will be populated later */}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;