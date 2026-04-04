import React, { useState } from 'react';
import {
  GraduationCap, Calendar, Users, Award,
  Download, Eye, TrendingUp, CheckCircle,
  Star, Trophy, Target, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const StudentsGraduation = () => {
  const graduationData = [
    { year: '2020', graduates: 480, graduationRate: 94, collegeEnrolled: 410 },
    { year: '2021', graduates: 495, graduationRate: 95, collegeEnrolled: 425 },
    { year: '2022', graduates: 510, graduationRate: 96, collegeEnrolled: 445 },
    { year: '2023', graduates: 525, graduationRate: 96.5, collegeEnrolled: 460 },
    { year: '2024', graduates: 540, graduationRate: 97, collegeEnrolled: 485 }
  ];

  const collegeDestinations = [
    { name: 'University of Technology', students: 145, percentage: 30 },
    { name: 'State University', students: 120, percentage: 25 },
    { name: 'Liberal Arts College', students: 85, percentage: 18 },
    { name: 'Community College', students: 65, percentage: 13 },
    { name: 'Private University', students: 45, percentage: 9 },
    { name: 'Out of State', students: 25, percentage: 5 }
  ];

  const currentGraduates = {
    total: 540,
    honors: 85,
    distinction: 120,
    collegeBound: 485,
    employment: 35,
    gapYear: 20
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Graduation Management</h1>
          <p className="text-gray-600 mt-1">Track graduation rates and post-graduation outcomes</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Calendar size={18} />
            <span>Plan Ceremony</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Graduates (2024)</p>
          <p className="text-2xl font-bold text-blue-600">{currentGraduates.total}</p>
          <p className="text-xs text-green-600">↑ 15 from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Graduation Rate</p>
          <p className="text-2xl font-bold text-green-600">97%</p>
          <p className="text-xs text-green-600">↑ 0.5% from last year</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Honors Graduates</p>
          <p className="text-2xl font-bold text-purple-600">{currentGraduates.honors}</p>
          <p className="text-xs text-gray-500">15.7% of class</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">College Enrollment</p>
          <p className="text-2xl font-bold text-orange-600">{currentGraduates.collegeBound}</p>
          <p className="text-xs text-green-600">89.8% of graduates</p>
        </div>
      </div>

      {/* Graduation Rate Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Graduation Trends (5-Year)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graduationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="graduates" stroke="#3B82F6" strokeWidth={2} name="Number of Graduates" />
            <Line type="monotone" dataKey="graduationRate" stroke="#10B981" strokeWidth={2} name="Graduation Rate %" />
            <Line type="monotone" dataKey="collegeEnrolled" stroke="#F59E0B" strokeWidth={2} name="College Enrolled" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* College Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">College Destinations</h2>
          <div className="space-y-4">
            {collegeDestinations.map((college, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{college.name}</span>
                  <span className="text-gray-600">{college.students} students ({college.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${college.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Post-Graduation Outcomes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">College Enrollment</span>
              <span className="font-semibold text-blue-600">{currentGraduates.collegeBound} (89.8%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Direct Employment</span>
              <span className="font-semibold text-green-600">{currentGraduates.employment} (6.5%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Gap Year</span>
              <span className="font-semibold text-orange-600">{currentGraduates.gapYear} (3.7%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Scholarships Awarded</span>
              <span className="font-semibold text-purple-600">245</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Achievers */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Top Graduates - Class of 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Valedictorian</p>
            <p className="text-lg font-bold">Emma Thompson</p>
            <p className="text-sm text-blue-100">GPA: 4.0</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Salutatorian</p>
            <p className="text-lg font-bold">Sophia Lee</p>
            <p className="text-sm text-blue-100">GPA: 3.98</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold">Leadership Award</p>
            <p className="text-lg font-bold">Olivia Martinez</p>
            <p className="text-sm text-blue-100">Student Council President</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Award size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-sm font-medium text-gray-800">Scholarship Value</p>
          <p className="text-xl font-bold text-green-600">$2.5M</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <Trophy size={24} className="mx-auto text-blue-600 mb-2" />
          <p className="text-sm font-medium text-gray-800">Academic Awards</p>
          <p className="text-xl font-bold text-blue-600">156</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <Target size={24} className="mx-auto text-purple-600 mb-2" />
          <p className="text-sm font-medium text-gray-800">College Acceptance</p>
          <p className="text-xl font-bold text-purple-600">92.3%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <Star size={24} className="mx-auto text-orange-600 mb-2" />
          <p className="text-sm font-medium text-gray-800">AP Scholars</p>
          <p className="text-xl font-bold text-orange-600">98</p>
        </div>
      </div>
    </div>
  );
};

export default StudentsGraduation;