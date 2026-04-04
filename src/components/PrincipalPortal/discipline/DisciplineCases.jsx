import React, { useState } from 'react';
import {
  Gavel, AlertTriangle, CheckCircle, Clock,
  Search, Filter, Download, Eye, Edit2,
  MoreVertical, MessageSquare, Calendar,
  FileText, Users, Award, XCircle
} from 'lucide-react';

const DisciplineCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const cases = [
    {
      id: 'DC001',
      student: 'James Wilson',
      grade: '11A',
      offense: 'Physical Altercation',
      date: '2024-04-01',
      severity: 'High',
      status: 'Under Investigation',
      reportedBy: 'Ms. Thompson',
      assignedTo: 'Dr. Martinez',
      actions: ['Parents notified', 'Witness statements taken'],
      lastUpdated: '2024-04-02',
      description: 'Student involved in physical altercation during lunch break'
    },
    {
      id: 'DC002',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      date: '2024-03-30',
      severity: 'Medium',
      status: 'Pending Review',
      reportedBy: 'Mr. Davis',
      assignedTo: 'Ms. Thompson',
      actions: ['Attendance record flagged', 'Parent meeting scheduled'],
      lastUpdated: '2024-04-01',
      description: 'Multiple unexcused absences this month'
    },
    {
      id: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      date: '2024-03-28',
      severity: 'High',
      status: 'Hearing Scheduled',
      reportedBy: 'Prof. Johnson',
      assignedTo: 'Dr. Martinez',
      actions: ['Academic committee notified', 'Hearing set for 04/05'],
      lastUpdated: '2024-03-29',
      description: 'Plagiarism in final term paper'
    },
    {
      id: 'DC004',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Uniform Violation',
      date: '2024-03-27',
      severity: 'Low',
      status: 'Resolved',
      reportedBy: 'Ms. Thompson',
      assignedTo: 'Ms. Thompson',
      actions: ['Warning issued', 'Parent notified'],
      lastUpdated: '2024-03-28',
      description: 'Repeated uniform code violations'
    },
    {
      id: 'DC005',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      date: '2024-03-26',
      severity: 'Medium',
      status: 'Under Investigation',
      reportedBy: 'Mr. Thompson',
      assignedTo: 'Dr. Martinez',
      actions: ['CCTV review', 'Restitution discussion'],
      lastUpdated: '2024-03-27',
      description: 'Damaged school property in science lab'
    }
  ];

  const stats = {
    total: 156,
    active: 42,
    resolved: 98,
    pending: 16,
    highSeverity: 28,
    mediumSeverity: 45,
    lowSeverity: 83
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Investigation': return 'bg-red-100 text-red-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Hearing Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Under Investigation': return <AlertTriangle size={14} className="text-red-500" />;
      case 'Pending Review': return <Clock size={14} className="text-yellow-500" />;
      case 'Hearing Scheduled': return <Calendar size={14} className="text-blue-500" />;
      case 'Resolved': return <CheckCircle size={14} className="text-green-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  const filteredCases = cases.filter(c =>
    (filterSeverity === 'all' || c.severity === filterSeverity) &&
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.offense.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Cases</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all disciplinary cases</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Cases</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileText size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Gavel className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This academic year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.active}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Require attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Resolved Cases</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">63% resolution rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Severity</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.highSeverity}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Need immediate attention</p>
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
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offense</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{case_.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{case_.student}</p>
                      <p className="text-xs text-gray-500">Grade {case_.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{case_.offense}</td>
                  <td className="px-6 py-4 text-gray-600">{case_.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(case_.severity)}`}>
                      {case_.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(case_.status)}
                      <span className="text-sm text-gray-700">{case_.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{case_.assignedTo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedCase(case_);
                          setShowDetailsModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit2 size={16} className="text-gray-600" />
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

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {filteredCases.length} of {cases.length} entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {showDetailsModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Case Details - {selectedCase.id}</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
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
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Current Status</p>
                      <p className="text-xs text-gray-500">{selectedCase.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action .Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Update Case
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Schedule Hearing
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Contact Deputy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplineCases;