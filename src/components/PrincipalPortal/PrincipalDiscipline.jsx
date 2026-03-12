import React, { useState } from 'react';
import {
  Gavel, AlertTriangle, Users, Search, Filter, Download,
  Eye, MoreVertical, Calendar, Clock, CheckCircle, XCircle,
  TrendingUp, PieChart, BarChart3, FileText, MessageSquare,
  UserX, Award, Bell, Shield, ChevronDown, Star
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const PrincipalDiscipline = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Statistics Data
  const disciplineStats = {
    totalCases: 156,
    activeCases: 42,
    resolvedCases: 98,
    pendingReview: 16,
    highSeverity: 12,
    mediumSeverity: 28,
    lowSeverity: 116,
    suspensionsActive: 8,
    appealsPending: 5,
    avgResolutionTime: '5.2 days',
    repeatOffenders: 23
  };

  // Monthly Trends Data
  const monthlyTrends = [
    { month: 'Jan', cases: 28, resolved: 24, suspensions: 4 },
    { month: 'Feb', cases: 32, resolved: 28, suspensions: 5 },
    { month: 'Mar', cases: 35, resolved: 30, suspensions: 6 },
    { month: 'Apr', cases: 30, resolved: 32, suspensions: 4 },
    { month: 'May', cases: 38, resolved: 35, suspensions: 7 },
    { month: 'Jun', cases: 42, resolved: 38, suspensions: 8 },
  ];

  // Offense Categories Data
  const offenseCategories = [
    { name: 'Bullying', value: 45, color: '#EF4444' },
    { name: 'Truancy', value: 38, color: '#F59E0B' },
    { name: 'Disruption', value: 32, color: '#3B82F6' },
    { name: 'Academic Dishonesty', value: 18, color: '#8B5CF6' },
    { name: 'Uniform Violation', value: 15, color: '#10B981' },
    { name: 'Other', value: 8, color: '#6B7280' },
  ];

  // Department-wise Distribution
  const departmentCases = [
    { department: 'Grade 9', cases: 28, severity: 'Medium' },
    { department: 'Grade 10', cases: 35, severity: 'High' },
    { department: 'Grade 11', cases: 42, severity: 'High' },
    { department: 'Grade 12', cases: 51, severity: 'Medium' },
  ];

  // Recent Cases Data
  const recentCases = [
    {
      id: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Physical Altercation',
      description: 'Involved in a fight during lunch break',
      date: '2024-03-15',
      reportedBy: 'Ms. Thompson',
      severity: 'High',
      status: 'Under Investigation',
      assignedTo: 'Dr. Martinez',
      actions: ['Parents notified', 'Witness statements taken'],
      lastUpdated: '2024-03-16'
    },
    {
      id: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      description: 'Skipped 8 classes this month',
      date: '2024-03-14',
      reportedBy: 'Mr. Davis',
      severity: 'Medium',
      status: 'Pending Review',
      assignedTo: 'Ms. Thompson',
      actions: ['Attendance review scheduled'],
      lastUpdated: '2024-03-15'
    },
    {
      id: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      description: 'Plagiarism in final term paper',
      date: '2024-03-13',
      reportedBy: 'Prof. Johnson',
      severity: 'High',
      status: 'Hearing Scheduled',
      assignedTo: 'Dr. Martinez',
      actions: ['Academic committee notified', 'Hearing set for 03/20'],
      lastUpdated: '2024-03-14'
    },
    {
      id: 'DC004',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Cyberbullying',
      description: 'Inappropriate messages sent via social media',
      date: '2024-03-12',
      reportedBy: 'Counselor Wilson',
      severity: 'High',
      status: 'Investigation',
      assignedTo: 'Dr. Martinez',
      actions: ['Social media evidence collected', 'Parents meeting scheduled'],
      lastUpdated: '2024-03-13'
    },
    {
      id: 'DC005',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      description: 'Damaged school property',
      date: '2024-03-11',
      reportedBy: 'Mr. Thompson',
      severity: 'Medium',
      status: 'Resolved',
      assignedTo: 'Ms. Thompson',
      actions: ['Restitution made', 'Community service assigned'],
      lastUpdated: '2024-03-15'
    },
  ];

  // Appeals Data
  const pendingAppeals = [
    {
      id: 'AP001',
      student: 'Robert Johnson',
      grade: '10C',
      originalCase: 'DC008',
      appealDate: '2024-03-14',
      reason: 'Disputing evidence',
      status: 'Under Review'
    },
    {
      id: 'AP002',
      student: 'Lisa Wong',
      grade: '12A',
      originalCase: 'DC012',
      appealDate: '2024-03-13',
      reason: 'New evidence submitted',
      status: 'Hearing Scheduled'
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={16} /> },
    { id: 'cases', name: 'All Cases', icon: <Gavel size={16} /> },
    { id: 'appeals', name: 'Appeals', icon: <Shield size={16} /> },
    { id: 'statistics', name: 'Statistics', icon: <BarChart3 size={16} /> },
    { id: 'trends', name: 'Trends', icon: <TrendingUp size={16} /> },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle size={16} className="text-green-500" />;
      case 'Under Investigation': return <AlertTriangle size={16} className="text-red-500" />;
      case 'Pending Review': return <Clock size={16} className="text-yellow-500" />;
      case 'Hearing Scheduled': return <Calendar size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const filteredCases = recentCases.filter(c => 
    (filterStatus === 'all' || c.status === filterStatus) &&
    (filterSeverity === 'all' || c.severity === filterSeverity) &&
    (c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.offense.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Management</h1>
          <p className="text-gray-600 mt-1">Principal's Oversight - Monitor and manage all disciplinary matters</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-800">{disciplineStats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Gavel size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">This academic year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-orange-600">{disciplineStats.activeCases}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{disciplineStats.highSeverity} high severity</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{disciplineStats.resolvedCases}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">63% resolution rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspensions</p>
              <p className="text-2xl font-bold text-red-600">{disciplineStats.suspensionsActive}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <UserX size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Active suspensions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appeals</p>
              <p className="text-2xl font-bold text-purple-600">{disciplineStats.appealsPending}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Shield size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Pending review</p>
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
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Monthly Case Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="suspensions" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Offense Categories Pie Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Offense Categories</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={offenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {offenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Summary */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Cases by Grade Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {departmentCases.map((dept, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{dept.department}</p>
                      <p className="text-2xl font-bold text-gray-800">{dept.cases}</p>
                      <p className="text-xs text-gray-500">Severity: {dept.severity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left">
                  <Shield size={24} className="text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Review Appeals</h4>
                  <p className="text-sm text-gray-600">{disciplineStats.appealsPending} appeals pending</p>
                </button>
                <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-left">
                  <AlertTriangle size={24} className="text-orange-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">High Severity Cases</h4>
                  <p className="text-sm text-gray-600">{disciplineStats.highSeverity} need attention</p>
                </button>
                <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-left">
                  <FileText size={24} className="text-green-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Monthly Report</h4>
                  <p className="text-sm text-gray-600">Generate discipline summary</p>
                </button>
              </div>
            </div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search cases by student, ID, or offense..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Hearing Scheduled">Hearing Scheduled</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="w-48">
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="all">All Severity</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                  <Filter size={18} className="text-gray-600" />
                  <span>More Filters</span>
                </button>
              </div>

              {/* Cases Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{case_.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{case_.student}</p>
                            <p className="text-xs text-gray-500">Grade {case_.grade}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-800">{case_.offense}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{case_.description}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{case_.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(case_.severity)}`}>
                            {case_.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(case_.status)}
                            <span className="text-xs text-gray-700">{case_.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{case_.assignedTo}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedCase(case_);
                                setShowCaseModal(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-lg"
                              title="View Details"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg" title="Message">
                              <MessageSquare size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg" title="More">
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

          {/* Appeals Tab */}
          {activeTab === 'appeals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pending Appeals</h3>
              <div className="space-y-4">
                {pendingAppeals.map((appeal) => (
                  <div key={appeal.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Shield size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{appeal.student} - Grade {appeal.grade}</p>
                        <p className="text-sm text-gray-600">Original Case: {appeal.originalCase}</p>
                        <p className="text-xs text-gray-500">Reason: {appeal.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {appeal.status}
                      </span>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{disciplineStats.avgResolutionTime}</p>
                  <p className="text-sm text-gray-600">Avg. Resolution Time</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-orange-600">{disciplineStats.repeatOffenders}</p>
                  <p className="text-sm text-gray-600">Repeat Offenders</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-gray-600">Case Closure Rate</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-gray-600">Avg. Cases/Month</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Severity Distribution</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">High Severity</span>
                      <span className="font-medium text-gray-800">{disciplineStats.highSeverity} cases</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(disciplineStats.highSeverity / disciplineStats.totalCases) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Medium Severity</span>
                      <span className="font-medium text-gray-800">{disciplineStats.mediumSeverity} cases</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(disciplineStats.mediumSeverity / disciplineStats.totalCases) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Low Severity</span>
                      <span className="font-medium text-gray-800">{disciplineStats.lowSeverity} cases</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(disciplineStats.lowSeverity / disciplineStats.totalCases) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">6-Month Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cases" fill="#3B82F6" />
                    <Bar dataKey="resolved" fill="#10B981" />
                    <Bar dataKey="suspensions" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <TrendingUp size={16} className="text-red-500 mr-2" />
                      Cases increased by 15% this quarter
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      Resolution rate improved by 8%
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      Bullying cases peak in March
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Star size={16} className="text-blue-500 mr-2" />
                      Increase anti-bullying programs
                    </li>
                    <li className="flex items-center">
                      <Star size={16} className="text-blue-500 mr-2" />
                      Review truancy prevention strategies
                    </li>
                    <li className="flex items-center">
                      <Star size={16} className="text-blue-500 mr-2" />
                      Enhance counselor availability
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Modal */}
      {showCaseModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Case Details - {selectedCase.id}</h2>
              <button 
                onClick={() => setShowCaseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Case Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    selectedCase.severity === 'High' ? 'bg-red-100' :
                    selectedCase.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <Gavel size={24} className={
                      selectedCase.severity === 'High' ? 'text-red-600' :
                      selectedCase.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    } />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedCase.offense}</h3>
                    <p className="text-sm text-gray-600">Reported on {selectedCase.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedCase.severity)}`}>
                  {selectedCase.severity} Severity
                </span>
              </div>

              {/* Student Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Student Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{selectedCase.student}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium text-gray-800">{selectedCase.grade}</p>
                  </div>
                </div>
              </div>

              {/* Case Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Case Details</h4>
                <p className="text-gray-700">{selectedCase.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="font-medium text-gray-800">{selectedCase.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium text-gray-800">{selectedCase.assignedTo}</p>
                  </div>
                </div>
              </div>

              {/* Actions Taken */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Actions Taken</h4>
                <ul className="space-y-2">
                  {selectedCase.actions.map((action, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Status Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Case Created</p>
                      <p className="text-xs text-gray-500">{selectedCase.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Last Updated</p>
                      <p className="text-xs text-gray-500">{selectedCase.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Update Case
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Schedule Hearing
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Contact Deputy
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  View Full History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDiscipline;