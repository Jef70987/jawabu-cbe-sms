import React, { useState } from 'react';
import {
  FileText, Plus, Search, Filter, Download,
  Eye, Edit2, MoreVertical, CheckCircle,
  AlertCircle, Clock, Users, Target,
  Calendar, UserCheck, TrendingUp
} from 'lucide-react';

const InterventionsBehaviorPlans = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const behaviorPlans = [
    {
      id: 'BP001',
      student: 'James Wilson',
      grade: '11A',
      startDate: '2024-03-15',
      endDate: '2024-05-15',
      type: 'Individual',
      goals: ['Reduce classroom disruptions', 'Improve peer interactions'],
      strategies: ['Positive reinforcement', 'Daily check-ins', 'Cool-down corner'],
      progress: 65,
      status: 'Active',
      counselor: 'Dr. Martinez',
      reviewDate: '2024-04-15'
    },
    {
      id: 'BP002',
      student: 'Michael Brown',
      grade: '12C',
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      type: 'Intensive',
      goals: ['Anger management', 'Conflict resolution skills'],
      strategies: ['Weekly counseling', 'Behavior tracking', 'Parent involvement'],
      progress: 45,
      status: 'Active',
      counselor: 'Mr. Brown',
      reviewDate: '2024-04-05'
    },
    {
      id: 'BP003',
      student: 'Sarah Chen',
      grade: '10B',
      startDate: '2024-02-15',
      endDate: '2024-04-15',
      type: 'Individual',
      goals: ['Improve attendance', 'Complete assignments on time'],
      strategies: ['Attendance contract', 'Homework log', 'Weekly rewards'],
      progress: 85,
      status: 'Completed',
      counselor: 'Ms. Thompson',
      reviewDate: '2024-04-01'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredPlans = behaviorPlans.filter(plan =>
    (activeTab === 'all' || plan.status === activeTab) &&
    (plan.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     plan.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Behavior Plans</h1>
          <p className="text-gray-600 mt-1">Create and manage student behavior intervention plans</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Plans</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Behavior Plan</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Plans</p>
          <p className="text-2xl font-bold text-green-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Completed Plans</p>
          <p className="text-2xl font-bold text-blue-600">56</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-purple-600">78%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-orange-600">8</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Plans
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed Plans
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Plans
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by student name or plan ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Individual</option>
              <option>Group</option>
              <option>Intensive</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={18} className="text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FileText size={18} className="text-purple-600" />
                      <span className="font-mono text-sm font-medium text-gray-500">{plan.id}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mt-1">{plan.student}</h3>
                    <p className="text-sm text-gray-600">Grade {plan.grade} • {plan.type} Plan</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Goals:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {plan.goals.map((goal, idx) => (
                      <li key={idx}>{goal}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Strategies:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {plan.strategies.map((strategy, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600">
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium text-gray-800">{plan.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium text-gray-800">{plan.endDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Counselor</p>
                    <p className="text-sm font-medium text-gray-800">{plan.counselor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Review</p>
                    <p className="text-sm font-medium text-purple-600">{plan.reviewDate}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-800">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(plan.progress)}`}
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    Update Progress
                  </button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-white">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-white">
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionsBehaviorPlans;