import React, { useState } from 'react';
import {
  FileText, Download, Eye, Printer, Award, TrendingUp, Users,
  DollarSign, GraduationCap, BookOpen, Plus
} from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ReportsAnnual = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const annualReports = [
    {
      id: 'ANN001',
      name: 'Annual Report 2023 - Full Version',
      year: '2023',
      generated: '2024-01-15',
      format: 'PDF',
      size: '5.8 MB',
      status: 'Final',
      downloads: 245,
      description: 'Complete annual institutional report including all departments'
    },
    {
      id: 'ANN002',
      name: 'Annual Report 2023 - Executive Summary',
      year: '2023',
      generated: '2024-01-20',
      format: 'PDF',
      size: '1.2 MB',
      status: 'Final',
      downloads: 189,
      description: 'Executive summary of key achievements and metrics'
    },
    {
      id: 'ANN003',
      name: 'Annual Report 2022 - Full Version',
      year: '2022',
      generated: '2023-01-15',
      format: 'PDF',
      size: '5.6 MB',
      status: 'Final',
      downloads: 178,
      description: 'Complete annual institutional report for 2022'
    }
  ];

  const yearlyTrends = [
    { year: '2019', students: 2100, graduates: 480, revenue: 4.2, satisfaction: 86 },
    { year: '2020', students: 2250, graduates: 495, revenue: 4.4, satisfaction: 87 },
    { year: '2021', students: 2350, graduates: 510, revenue: 4.6, satisfaction: 88 },
    { year: '2022', students: 2420, graduates: 525, revenue: 4.8, satisfaction: 89 },
    { year: '2023', students: 2450, graduates: 540, revenue: 5.0, satisfaction: 90 }
  ];

  const annualStats = {
    enrollmentGrowth: '+16.7%',
    graduationRate: '96.5%',
    revenueGrowth: '+19%',
    satisfactionScore: '90%'
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Annual Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive yearly institutional reports</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2023">2023 Reports</option>
            <option value="2022">2022 Reports</option>
            <option value="2021">2021 Reports</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Archive</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Enrollment Growth</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{annualStats.enrollmentGrowth}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Graduation Rate</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{annualStats.graduationRate}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <GraduationCap className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Revenue Growth</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{annualStats.revenueGrowth}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Satisfaction Score</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{annualStats.satisfactionScore}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Award className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* 5-Year Trend Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">5-Year Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yearlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Total Students" />
            <Line yAxisId="left" type="monotone" dataKey="graduates" stroke="#10B981" strokeWidth={2} name="Graduates" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} name="Revenue (Million $)" />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#8B5CF6" strokeWidth={2} name="Satisfaction %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Available Annual Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {annualReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FileText size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2 text-xs text-gray-500">
                      <span>Year: {report.year}</span>
                      <span>Generated: {report.generated}</span>
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                      <span>{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Printer size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnnual;