import React, { useState } from 'react';
import {
  Search, Filter, Plus, AlertTriangle, CheckCircle, XCircle,
  Clock, UserX, FileText, MessageSquare, Calendar, Download,
  MoreVertical, Edit2, Trash2, Eye
} from 'lucide-react';

const DeputyDiscipline = () => {
  const [cases, setCases] = useState([
    {
      id: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Bullying',
      description: 'Repeated verbal harassment of fellow student',
      date: '2024-03-15',
      reportedBy: 'Ms. Thompson',
      severity: 'High',
      status: 'Investigation',
      actions: ['Parent notified', 'Witness statements collected']
    },
    {
      id: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      description: 'Skipped 5 classes this week',
      date: '2024-03-15',
      reportedBy: 'Mr. Davis',
      severity: 'Medium',
      status: 'Pending Review',
      actions: ['Attendance record flagged']
    },
    {
      id: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Class Disruption',
      description: 'Repeated interruptions during lessons',
      date: '2024-03-14',
      reportedBy: 'Dr. Martinez',
      severity: 'Low',
      status: 'Resolved',
      actions: ['Verbal warning issued', 'Parent meeting scheduled']
    },
    {
      id: 'DC004',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Uniform Violation',
      description: 'Repeated dress code violations',
      date: '2024-03-14',
      reportedBy: 'Ms. Thompson',
      severity: 'Low',
      status: 'Resolved',
      actions: ['Uniform provided', 'Warning issued']
    },
    {
      id: 'DC005',
      student: 'David Lee',
      grade: '11B',
      offense: 'Academic Dishonesty',
      description: 'Plagiarism in term paper',
      date: '2024-03-13',
      reportedBy: 'Prof. Johnson',
      severity: 'High',
      status: 'Investigation',
      actions: ['Paper confiscated', 'Academic committee notified']
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredCases = cases.filter(c => 
    (filterStatus === 'all' || c.status === filterStatus) &&
    (filterSeverity === 'all' || c.severity === filterSeverity) &&
    (c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.offense.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      case 'Investigation': return <AlertTriangle size={16} className="text-red-500" />;
      case 'Pending Review': return <Clock size={16} className="text-yellow-500" />;
      case 'Resolved': return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Management</h1>
          <p className="text-gray-600 mt-1">Track and manage disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => {
              setSelectedCase(null);
              setShowCaseModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">156</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-orange-600">24</p>
          <p className="text-xs text-orange-500 mt-1">+6 from last week</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">118</p>
          <p className="text-xs text-green-500 mt-1">75% resolution rate</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">High Severity</p>
          <p className="text-2xl font-bold text-red-600">8</p>
          <p className="text-xs text-red-500 mt-1">Require attention</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Suspensions</p>
          <p className="text-2xl font-bold text-purple-600">5</p>
          <p className="text-xs text-purple-500 mt-1">2 pending review</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by student name, case ID, or offense..."
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
              <option value="Investigation">Investigation</option>
              <option value="Pending Review">Pending Review</option>
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
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offense</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900">{case_.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{case_.student}</p>
                      <p className="text-sm text-gray-500">Grade {case_.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-800">{case_.offense}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{case_.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{case_.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(case_.severity)}`}>
                      {case_.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(case_.status)}
                      <span className="text-sm text-gray-700">{case_.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedCase(case_);
                          setShowCaseModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="Edit">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="More">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {filteredCases.length} of {cases.length} entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedCase ? 'Case Details' : 'New Discipline Case'}
              </h2>
              <button 
                onClick={() => setShowCaseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            {selectedCase ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Case ID</p>
                    <p className="font-medium text-gray-800">{selectedCase.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Reported</p>
                    <p className="font-medium text-gray-800">{selectedCase.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-medium text-gray-800">{selectedCase.student} (Grade {selectedCase.grade})</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="font-medium text-gray-800">{selectedCase.reportedBy}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Offense</p>
                  <p className="font-medium text-gray-800">{selectedCase.offense}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedCase.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Actions Taken</p>
                  <ul className="space-y-2">
                    {selectedCase.actions.map((action, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Update Case
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Schedule Hearing
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Contact Parent
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option>Select Grade</option>
                      <option>9A</option>
                      <option>9B</option>
                      <option>10A</option>
                      <option>10B</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offense Type</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                    <option>Select Offense</option>
                    <option>Bullying</option>
                    <option>Truancy</option>
                    <option>Disruption</option>
                    <option>Academic Dishonesty</option>
                    <option>Uniform Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option>Select Severity</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Case
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCaseModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyDiscipline;