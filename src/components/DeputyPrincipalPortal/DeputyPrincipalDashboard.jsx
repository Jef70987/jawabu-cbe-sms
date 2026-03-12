import React, { useState } from 'react';
import {
  Gavel, AlertTriangle, Users, BookOpen, Clock, CheckCircle,
  XCircle, TrendingUp, Calendar, MessageSquare, FileText,
  MoreVertical, Search, Filter, UserX, UserCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

const DeputyPrincipalDashboard = () => {
  const [disciplineStats, setDisciplineStats] = useState({
    activeCases: 24,
    resolvedToday: 8,
    pendingReview: 12,
    suspensions: 5,
    counselingSessions: 18,
    repeatOffenders: 7
  });

  const weeklyCases = [
    { day: 'Mon', minor: 5, major: 2, resolved: 4 },
    { day: 'Tue', minor: 7, major: 3, resolved: 6 },
    { day: 'Wed', minor: 4, major: 1, resolved: 5 },
    { day: 'Thu', minor: 8, major: 4, resolved: 7 },
    { day: 'Fri', minor: 6, major: 2, resolved: 8 },
  ];

  const offenseTypes = [
    { name: 'Truancy', value: 35, color: '#3B82F6' },
    { name: 'Bullying', value: 25, color: '#EF4444' },
    { name: 'Disruption', value: 20, color: '#F59E0B' },
    { name: 'Uniform', value: 15, color: '#10B981' },
    { name: 'Other', value: 5, color: '#8B5CF6' },
  ];

  const recentCases = [
    { 
      id: 1, 
      student: 'James Wilson',
      grade: '11A',
      offense: 'Bullying',
      date: '2024-03-15',
      severity: 'High',
      status: 'Investigation',
      assignedTo: 'Dr. Martinez'
    },
    { 
      id: 2, 
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      date: '2024-03-15',
      severity: 'Medium',
      status: 'Pending Review',
      assignedTo: 'Ms. Thompson'
    },
    { 
      id: 3, 
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Class Disruption',
      date: '2024-03-14',
      severity: 'Low',
      status: 'Resolved',
      assignedTo: 'Dr. Martinez'
    },
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Deputy Principal Dashboard</h1>
          <p className="text-gray-600 mt-1">Discipline & Student Affairs Overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar size={18} className="text-gray-600" />
            <span>Mar 15, 2024</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.activeCases}</p>
              <p className="text-sm text-orange-600 mt-2">↑ 4 from yesterday</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Gavel className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.resolvedToday}</p>
              <p className="text-sm text-green-600 mt-2">↑ 2 from yesterday</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Suspensions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.suspensions}</p>
              <p className="text-sm text-red-600 mt-2">3 pending review</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <UserX className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Counseling Sessions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{disciplineStats.counselingSessions}</p>
              <p className="text-sm text-blue-600 mt-2">8 scheduled today</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Cases Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Discipline Cases</h2>
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
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

        {/* Offense Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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

      {/* Recent Cases and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Discipline Cases</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentCases.map((case_) => (
              <div key={case_.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      case_.severity === 'High' ? 'bg-red-100' :
                      case_.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <AlertTriangle size={16} className={
                        case_.severity === 'High' ? 'text-red-600' :
                        case_.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      } />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{case_.student} • Grade {case_.grade}</p>
                      <p className="text-sm text-gray-600">{case_.offense}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    case_.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    case_.status === 'Investigation' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {case_.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{case_.date}</span>
                    <span className="text-gray-500">Assigned: {case_.assignedTo}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Counseling Schedule */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-16 text-sm font-medium text-gray-600">9:00 AM</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Disciplinary Hearing - J. Wilson</p>
                  <p className="text-xs text-gray-500">Room 204</p>
                </div>
              </div>
              <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-16 text-sm font-medium text-gray-600">11:00 AM</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Counseling Session - S. Chen</p>
                  <p className="text-xs text-gray-500">Counseling Office</p>
                </div>
              </div>
              <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-16 text-sm font-medium text-gray-600">2:00 PM</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Staff Meeting - Discipline Review</p>
                  <p className="text-xs text-gray-500">Conference Room</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeputyPrincipalDashboard;