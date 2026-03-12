import React, { useState } from 'react';
import {
  Target, Users, Heart, BookOpen, Calendar,
  Clock, CheckCircle, AlertTriangle, Plus,
  Search, Filter, Eye, Edit2, MoreVertical,
  UserPlus, MessageSquare, FileText, Award,
  TrendingUp, Star, Shield, UserCheck
} from 'lucide-react';

const DeputyInterventions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Intervention Programs Data
  const interventionPrograms = [
    {
      id: 'INT001',
      name: 'Behavior Improvement Program',
      type: 'Behavioral',
      students: 12,
      duration: '8 weeks',
      startDate: '2024-03-01',
      endDate: '2024-04-26',
      status: 'Active',
      progress: 65,
      facilitator: 'Dr. Wilson',
      sessions: 16,
      completed: 10,
      success: '82%'
    },
    {
      id: 'INT002',
      name: 'Academic Support Group',
      type: 'Academic',
      students: 8,
      duration: '12 weeks',
      startDate: '2024-02-15',
      endDate: '2024-05-10',
      status: 'Active',
      progress: 45,
      facilitator: 'Ms. Thompson',
      sessions: 24,
      completed: 11,
      success: '75%'
    },
    {
      id: 'INT003',
      name: 'Conflict Resolution Workshop',
      type: 'Social',
      students: 15,
      duration: '4 weeks',
      startDate: '2024-03-10',
      endDate: '2024-04-07',
      status: 'Active',
      progress: 30,
      facilitator: 'Dr. Martinez',
      sessions: 8,
      completed: 2,
      success: '90%'
    },
    {
      id: 'INT004',
      name: 'Anger Management Program',
      type: 'Behavioral',
      students: 6,
      duration: '6 weeks',
      startDate: '2024-03-15',
      endDate: '2024-04-26',
      status: 'Scheduled',
      progress: 0,
      facilitator: 'Dr. Wilson',
      sessions: 12,
      completed: 0,
      success: null
    },
  ];

  // Individual Intervention Plans
  const interventionPlans = [
    {
      id: 'IP001',
      student: 'James Wilson',
      grade: '11A',
      program: 'Behavior Improvement Program',
      startDate: '2024-03-01',
      goals: ['Reduce classroom disruptions', 'Improve peer interactions'],
      progress: 70,
      nextSession: '2024-03-18',
      status: 'On Track',
      notes: 'Showing improvement in self-regulation'
    },
    {
      id: 'IP002',
      student: 'Sarah Chen',
      grade: '10B',
      program: 'Academic Support Group',
      startDate: '2024-02-15',
      goals: ['Improve math grades', 'Complete homework consistently'],
      progress: 50,
      nextSession: '2024-03-19',
      status: 'Needs Attention',
      notes: 'Struggling with algebra concepts'
    },
    {
      id: 'IP003',
      student: 'Michael Brown',
      grade: '12C',
      program: 'Conflict Resolution',
      startDate: '2024-03-10',
      goals: ['Learn de-escalation techniques', 'Improve communication'],
      progress: 40,
      nextSession: '2024-03-20',
      status: 'On Track',
      notes: 'Good participation in workshops'
    },
    {
      id: 'IP004',
      student: 'Emily Davis',
      grade: '9D',
      program: 'Anger Management',
      startDate: '2024-03-15',
      goals: ['Identify triggers', 'Develop coping strategies'],
      progress: 15,
      nextSession: '2024-03-21',
      status: 'Just Started',
      notes: 'Initial assessment completed'
    },
  ];

  // Intervention Outcomes Data
  const outcomes = [
    {
      student: 'Robert Johnson',
      program: 'Behavior Improvement',
      startDate: '2024-01-15',
      endDate: '2024-03-10',
      outcome: 'Successful',
      improvements: ['No new incidents', 'Improved attendance'],
      followUp: 'Monthly check-ins'
    },
    {
      student: 'Lisa Wong',
      program: 'Academic Support',
      startDate: '2024-01-08',
      endDate: '2024-03-01',
      outcome: 'Successful',
      improvements: ['Grades improved from D to C', 'Homework completion up 80%'],
      followUp: 'Weekly tutoring'
    },
    {
      student: 'David Lee',
      program: 'Conflict Resolution',
      startDate: '2024-01-20',
      endDate: '2024-03-05',
      outcome: 'Partially Successful',
      improvements: ['Better communication', 'One minor incident'],
      followUp: 'Continued monitoring'
    },
  ];

  const tabs = [
    { id: 'active', name: 'Active Interventions', icon: <Target size={16} /> },
    { id: 'plans', name: 'Individual Plans', icon: <FileText size={16} /> },
    { id: 'outcomes', name: 'Outcomes', icon: <Award size={16} /> },
    { id: 'resources', name: 'Resources', icon: <BookOpen size={16} /> },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Interventions</h1>
          <p className="text-gray-600 mt-1">Manage student intervention programs and track progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <FileText size={18} className="text-gray-600" />
            <span>Reports</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Plus size={18} />
            <span>New Intervention</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students Enrolled</p>
              <p className="text-2xl font-bold text-blue-600">86</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">82%</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Need Attention</p>
              <p className="text-2xl font-bold text-orange-600">15</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
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
                    ? 'border-purple-500 text-purple-600'
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
          {/* Active Interventions Tab */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search programs..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>All Types</option>
                  <option>Behavioral</option>
                  <option>Academic</option>
                  <option>Social</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Programs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventionPrograms.map((program) => (
                  <div key={program.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{program.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Type: {program.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Students</p>
                        <p className="text-sm font-medium text-gray-800">{program.students}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-800">{program.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Facilitator</p>
                        <p className="text-sm font-medium text-gray-800">{program.facilitator}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                        <p className="text-sm font-medium text-gray-800">{program.success || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-800">{program.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(program.progress)}`}
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedIntervention(program);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 hover:bg-white rounded-lg"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-white rounded-lg">
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-white rounded-lg">
                          <MessageSquare size={16} className="text-gray-600" />
                        </button>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Plans Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Session</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {interventionPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{plan.student}</p>
                            <p className="text-xs text-gray-500">Grade {plan.grade}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plan.program}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plan.startDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">{plan.progress}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(plan.progress)}`}
                                style={{ width: `${plan.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plan.nextSession}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            plan.status === 'On Track' ? 'bg-green-100 text-green-800' :
                            plan.status === 'Needs Attention' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <Edit2 size={16} className="text-gray-600" />
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

          {/* Outcomes Tab */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-sm text-green-700">Successful Interventions</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                  <p className="text-sm text-yellow-700">Partially Successful</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">4</p>
                  <p className="text-sm text-red-700">Needs Revision</p>
                </div>
              </div>

              <div className="space-y-4">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{outcome.student}</h4>
                        <p className="text-sm text-gray-600">{outcome.program}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        outcome.outcome === 'Successful' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {outcome.outcome}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Improvements:</p>
                      <ul className="mt-1 space-y-1">
                        {outcome.improvements.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle size={14} className="text-green-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Follow-up:</span> {outcome.followUp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <BookOpen size={32} className="mx-auto text-blue-600 mb-2" />
                  <p className="font-semibold text-gray-800">Intervention Guides</p>
                  <p className="text-sm text-gray-600">12 resources</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Heart size={32} className="mx-auto text-green-600 mb-2" />
                  <p className="font-semibold text-gray-800">Counseling Materials</p>
                  <p className="text-sm text-gray-600">8 resources</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Award size={32} className="mx-auto text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-800">Success Stories</p>
                  <p className="text-sm text-gray-600">15 case studies</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Intervention Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Intervention</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Behavioral</option>
                  <option>Academic</option>
                  <option>Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilitator</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Create Program
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyInterventions;