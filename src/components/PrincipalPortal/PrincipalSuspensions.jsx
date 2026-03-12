import React, { useState } from 'react';
import {
  UserX, Calendar, Clock, AlertTriangle, CheckCircle,
  Search, Filter, Download, Eye, MoreVertical,
  FileText, Mail, Phone, TrendingUp, PieChart,
  BarChart3, Users, Award, XCircle, MessageSquare
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const PrincipalSuspensions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSuspension, setSelectedSuspension] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Suspension Statistics
  const suspensionStats = {
    totalSuspensions: 45,
    activeSuspensions: 12,
    inSchool: 5,
    outOfSchool: 7,
    completed: 28,
    appealed: 4,
    avgDuration: '4.5 days',
    repeatOffenders: 8
  };

  // Monthly Suspension Trends
  const monthlyTrends = [
    { month: 'Jan', inSchool: 4, outOfSchool: 5, total: 9 },
    { month: 'Feb', inSchool: 3, outOfSchool: 6, total: 9 },
    { month: 'Mar', inSchool: 5, outOfSchool: 7, total: 12 },
    { month: 'Apr', inSchool: 4, outOfSchool: 5, total: 9 },
    { month: 'May', inSchool: 6, outOfSchool: 8, total: 14 },
    { month: 'Jun', inSchool: 5, outOfSchool: 9, total: 14 },
  ];

  // Suspension Reasons Distribution
  const reasonDistribution = [
    { name: 'Physical Altercation', value: 18, color: '#EF4444' },
    { name: 'Bullying', value: 12, color: '#F59E0B' },
    { name: 'Academic Dishonesty', value: 8, color: '#3B82F6' },
    { name: 'Disruptive Behavior', value: 7, color: '#8B5CF6' },
    { name: 'Truancy', value: 5, color: '#10B981' },
    { name: 'Other', value: 4, color: '#6B7280' },
  ];

  // Grade Level Distribution
  const gradeDistribution = [
    { grade: 'Grade 9', count: 8, percentage: '18%' },
    { grade: 'Grade 10', count: 12, percentage: '27%' },
    { grade: 'Grade 11', count: 14, percentage: '31%' },
    { grade: 'Grade 12', count: 11, percentage: '24%' },
  ];

  // Active Suspensions Data
  const activeSuspensions = [
    {
      id: 'SUS001',
      student: 'James Wilson',
      grade: '11A',
      reason: 'Physical altercation with another student',
      type: 'Out-of-School',
      startDate: '2024-03-10',
      endDate: '2024-03-17',
      duration: '7 days',
      status: 'Active',
      assignedBy: 'Dr. Martinez',
      reviewedBy: 'Principal',
      appeal: false,
      parentNotified: true,
      progress: 60
    },
    {
      id: 'SUS002',
      student: 'Sarah Chen',
      grade: '10B',
      reason: 'Repeated truancy',
      type: 'In-School',
      startDate: '2024-03-12',
      endDate: '2024-03-14',
      duration: '3 days',
      status: 'Active',
      assignedBy: 'Ms. Thompson',
      reviewedBy: 'Deputy Principal',
      appeal: false,
      parentNotified: true,
      progress: 70
    },
    {
      id: 'SUS003',
      student: 'Michael Brown',
      grade: '12C',
      reason: 'Academic dishonesty',
      type: 'Out-of-School',
      startDate: '2024-03-13',
      endDate: '2024-03-20',
      duration: '7 days',
      status: 'Active',
      assignedBy: 'Prof. Johnson',
      reviewedBy: 'Principal',
      appeal: true,
      parentNotified: true,
      progress: 40
    },
    {
      id: 'SUS004',
      student: 'Emily Davis',
      grade: '9D',
      reason: 'Cyberbullying',
      type: 'Out-of-School',
      startDate: '2024-03-14',
      endDate: '2024-03-21',
      duration: '7 days',
      status: 'Active',
      assignedBy: 'Dr. Martinez',
      reviewedBy: 'Principal',
      appeal: false,
      parentNotified: true,
      progress: 30
    },
  ];

  // Completed Suspensions
  const completedSuspensions = [
    {
      id: 'SUS005',
      student: 'David Lee',
      grade: '11B',
      reason: 'Vandalism',
      type: 'Out-of-School',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      duration: '5 days',
      status: 'Completed',
      assignedBy: 'Ms. Thompson',
      outcome: 'Successful',
      followUp: 'Monthly check-ins'
    },
    {
      id: 'SUS006',
      student: 'Lisa Wong',
      grade: '10A',
      reason: 'Disruptive behavior',
      type: 'In-School',
      startDate: '2024-02-28',
      endDate: '2024-03-01',
      duration: '2 days',
      status: 'Completed',
      assignedBy: 'Dr. Martinez',
      outcome: 'Successful',
      followUp: 'None'
    },
  ];

  // Appeals Data
  const appeals = [
    {
      id: 'AP001',
      student: 'Michael Brown',
      grade: '12C',
      originalCase: 'SUS003',
      appealDate: '2024-03-14',
      reason: 'Disputing evidence',
      status: 'Under Review',
      submittedBy: 'Parent'
    },
    {
      id: 'AP002',
      student: 'Robert Johnson',
      grade: '10C',
      originalCase: 'SUS007',
      appealDate: '2024-03-13',
      reason: 'New evidence',
      status: 'Hearing Scheduled',
      submittedBy: 'Student'
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={16} /> },
    { id: 'active', name: 'Active Suspensions', icon: <AlertTriangle size={16} /> },
    { id: 'completed', name: 'Completed', icon: <CheckCircle size={16} /> },
    { id: 'appeals', name: 'Appeals', icon: <FileText size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> },
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'In-School': return 'bg-yellow-100 text-yellow-800';
      case 'Out-of-School': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#6B7280'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suspensions Management</h1>
          <p className="text-gray-600 mt-1">Oversee all student suspensions and appeals</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>Generate Summary</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Suspensions</p>
              <p className="text-2xl font-bold text-gray-800">{suspensionStats.totalSuspensions}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <UserX size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">This academic year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-orange-600">{suspensionStats.activeSuspensions}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{suspensionStats.outOfSchool} out-of-school</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{suspensionStats.completed}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">62% resolution rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Appeals</p>
              <p className="text-2xl font-bold text-purple-600">{suspensionStats.appealed}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Need review</p>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">In-School Suspensions</p>
          <p className="text-lg font-semibold text-yellow-600">{suspensionStats.inSchool}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Out-of-School</p>
          <p className="text-lg font-semibold text-red-600">{suspensionStats.outOfSchool}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Avg Duration</p>
          <p className="text-lg font-semibold text-gray-800">{suspensionStats.avgDuration}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500">Repeat Offenders</p>
          <p className="text-lg font-semibold text-red-600">{suspensionStats.repeatOffenders}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Monthly Suspension Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="inSchool" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="outOfSchool" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Reasons Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Suspension Reasons</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={reasonDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reasonDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Suspensions by Grade</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {gradeDistribution.map((grade, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{grade.grade}</p>
                      <p className="text-2xl font-bold text-gray-800">{grade.count}</p>
                      <p className="text-xs text-blue-600">{grade.percentage} of total</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Suspensions Tab */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search suspensions..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="In-School">In-School</option>
                  <option value="Out-of-School">Out-of-School</option>
                </select>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                  <Filter size={18} className="text-gray-600" />
                  <span>More Filters</span>
                </button>
              </div>

              {/* Active Suspensions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appeal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeSuspensions.map((susp) => (
                      <tr key={susp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{susp.student}</p>
                            <p className="text-xs text-gray-500">Grade {susp.grade}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700">{susp.reason}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(susp.type)}`}>
                            {susp.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-gray-800">{susp.startDate} - {susp.endDate}</p>
                            <p className="text-xs text-gray-500">{susp.duration}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">{susp.progress}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${susp.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {susp.appeal ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Pending</span>
                          ) : (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedSuspension(susp);
                                setShowDetailsModal(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <MessageSquare size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Completed Suspensions Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedSuspensions.map((susp) => (
                  <div key={susp.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{susp.student}</h4>
                        <p className="text-sm text-gray-600">Grade {susp.grade}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {susp.outcome}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{susp.reason}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600">{susp.startDate} - {susp.endDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(susp.type)}`}>
                        {susp.type}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Follow-up:</span> {susp.followUp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appeals Tab */}
          {activeTab === 'appeals' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{appeal.student}</h4>
                        <p className="text-sm text-gray-600">Grade {appeal.grade}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appeal.status)}`}>
                        {appeal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Original Case:</span> {appeal.originalCase}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reason:</span> {appeal.reason}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Submitted by: {appeal.submittedBy} on {appeal.appealDate}</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Review Appeal
                      </button>
                      <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-100">
                        View Case
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">15%</p>
                  <p className="text-sm text-blue-700">Increase this month</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">4.2</p>
                  <p className="text-sm text-green-700">Avg days suspended</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">67%</p>
                  <p className="text-sm text-yellow-700">Out-of-school rate</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">82%</p>
                  <p className="text-sm text-purple-700">Parent notification</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Suspension Rate by Grade</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suspension Details Modal */}
      {showDetailsModal && selectedSuspension && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Suspension Details - {selectedSuspension.id}</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Student Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedSuspension.student}</h3>
                    <p className="text-sm text-gray-600">Grade {selectedSuspension.grade}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(selectedSuspension.type)}`}>
                    {selectedSuspension.type}
                  </span>
                </div>
              </div>

              {/* Suspension Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-800">{selectedSuspension.startDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="font-medium text-gray-800">{selectedSuspension.endDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">{selectedSuspension.duration}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Assigned By</p>
                  <p className="font-medium text-gray-800">{selectedSuspension.assignedBy}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-gray-800">{selectedSuspension.reason}</p>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Progress</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 bg-blue-500 rounded-full"
                        style={{ width: `${selectedSuspension.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">{selectedSuspension.progress}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Review Case
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Contact Deputy
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalSuspensions;