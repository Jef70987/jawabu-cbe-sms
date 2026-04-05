import React, { useState } from 'react';
import {
  Users, GraduationCap, Calendar, Download,
  PieChart, BarChart3, Filter, Eye,
  TrendingUp, TrendingDown, UserCheck, UserX
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const StatisticsDemographics = () => {
  const [filterGrade, setFilterGrade] = useState('all');

  const gradeDistribution = [
    { grade: 'Grade 9', students: 620, percentage: 25.3, cases: 28, rate: 4.5 },
    { grade: 'Grade 10', students: 590, percentage: 24.1, cases: 35, rate: 5.9 },
    { grade: 'Grade 11', students: 580, percentage: 23.7, cases: 42, rate: 7.2 },
    { grade: 'Grade 12', students: 660, percentage: 26.9, cases: 51, rate: 7.7 }
  ];

  const genderDistribution = [
    { name: 'Male', students: 1350, percentage: 55.1, cases: 98, rate: 7.3, color: '#3B82F6' },
    { name: 'Female', students: 1100, percentage: 44.9, cases: 58, rate: 5.3, color: '#EC4899' }
  ];

  const ageDistribution = [
    { age: '14', students: 280, cases: 12, rate: 4.3 },
    { age: '15', students: 590, cases: 28, rate: 4.7 },
    { age: '16', students: 620, cases: 35, rate: 5.6 },
    { age: '17', students: 580, cases: 42, rate: 7.2 },
    { age: '18', students: 380, cases: 39, rate: 10.3 }
  ];

  const sectionComparison = [
    { section: 'A', students: 210, cases: 18, rate: 8.6 },
    { section: 'B', students: 205, cases: 22, rate: 10.7 },
    { section: 'C', students: 208, cases: 20, rate: 9.6 },
    { section: 'D', students: 212, cases: 24, rate: 11.3 }
  ];

  const demographicRadar = [
    { subject: 'Grade 9', rate: 4.5, avg: 6.2, fullMark: 15 },
    { subject: 'Grade 10', rate: 5.9, avg: 6.2, fullMark: 15 },
    { subject: 'Grade 11', rate: 7.2, avg: 6.2, fullMark: 15 },
    { subject: 'Grade 12', rate: 7.7, avg: 6.2, fullMark: 15 }
  ];

  const COLORS = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Demographic Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze discipline patterns across student demographics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Demographics</span>
          </button>
        </div>
      </div>

      {/* Key Demographic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">2,450</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Across 4 grades</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Students Involved</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">892</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <UserCheck className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">36.4% of student body</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Male Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">55.1%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">7.3% case rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Female Students</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">44.9%</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Users className="text-pink-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">5.3% case rate</p>
        </div>
      </div>

      {/* Grade Level Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Level Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="students" fill="#3B82F6" name="Students" />
              <Bar yAxisId="right" dataKey="cases" fill="#EF4444" name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="students"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Age Distribution & Section Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Age Distribution & Case Rate</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cases</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ageDistribution.map((age, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{age.age} years</td>
                    <td className="px-4 py-3 text-gray-600">{age.students}</td>
                    <td className="px-4 py-3 text-gray-600">{age.cases}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${age.rate > 7 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {age.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Section Comparison (Grade 10)</h2>
          <div className="space-y-4">
            {sectionComparison.map((section, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Section {section.section}</span>
                  <span className="text-gray-600">{section.cases} cases / {section.students} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${section.rate * 10}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Case rate: {section.rate}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Level Case Rate Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={demographicRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 15]} />
            <Radar name="Current Rate" dataKey="rate" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            <Radar name="School Average" dataKey="avg" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">High Risk Groups</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Grade 12 students (7.7% case rate)</li>
            <li>• 18-year-olds (10.3% case rate)</li>
            <li>• Section D (11.3% case rate)</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Low Risk Groups</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Grade 9 students (4.5% case rate)</li>
            <li>• Female students (5.3% case rate)</li>
            <li>• 14-year-olds (4.3% case rate)</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Target interventions for Grade 12</li>
            <li>• Review Section D disciplinary policies</li>
            <li>• Enhanced support for male students</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDemographics;