import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Award, Star,
  Search, Filter, Download, Eye,
  BarChart3, PieChart, Users, GraduationCap,
  FileText   // ✅ FIXED: added missing import
} from 'lucide-react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const StudentsPerformance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const performanceData = [
    { grade: 'Grade 9', average: 85, target: 85 },
    { grade: 'Grade 10', average: 87, target: 86 },
    { grade: 'Grade 11', average: 86, target: 87 },
    { grade: 'Grade 12', average: 88, target: 88 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', score: 87, passRate: 92, topScore: 100 },
    { subject: 'English', score: 91, passRate: 96, topScore: 99 },
    { subject: 'Science', score: 89, passRate: 94, topScore: 98 },
    { subject: 'History', score: 86, passRate: 90, topScore: 97 },
    { subject: 'Arts', score: 94, passRate: 98, topScore: 100 }
  ];

  const topStudents = [
    { name: 'Emma Thompson', grade: '10B', gpa: 4.0, achievements: 'Honor Roll, Science Fair' },
    { name: 'Sophia Lee', grade: '9C', gpa: 3.9, achievements: 'Art Competition Winner' },
    { name: 'Olivia Martinez', grade: '11B', gpa: 3.8, achievements: 'Debate Champion' }
  ];

  const performanceStats = {
    averageGPA: 3.42,
    passRate: 94.2,
    distinctionCount: 245,
    improvementRate: 8.5
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Performance</h1>
          <p className="text-gray-600 mt-1">Monitor academic performance and progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} />
            <span>Export Report</span>
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} /> {/* ✅ FIXED */}
            <span>Generate Report Cards</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Average GPA" value={performanceStats.averageGPA} />
        <Stat title="Pass Rate" value={`${performanceStats.passRate}%`} />
        <Stat title="Distinctions" value={performanceStats.distinctionCount} />
        <Stat title="Improvement Rate" value={`${performanceStats.improvementRate}%`} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">Grade Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#3B82F6" />
            <Bar dataKey="target" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {subjectPerformance.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-lg text-center border">
            <p className="font-semibold">{s.subject}</p>
            <p className="text-xl font-bold">{s.score}%</p>
            <p className="text-sm">Pass: {s.passRate}%</p>
          </div>
        ))}
      </div>

      {/* Top Students */}
      <div className="bg-blue-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-3">Top Students</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {topStudents.map((s, i) => (
            <div key={i} className="bg-white/20 p-3 rounded-lg">
              <p>{s.name}</p>
              <p className="text-sm">{s.grade}</p>
              <p>GPA: {s.gpa}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* Small reusable component */
const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl border">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default StudentsPerformance;