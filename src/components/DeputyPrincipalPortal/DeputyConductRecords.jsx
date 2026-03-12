import React, { useState } from 'react';
import {
  ClipboardList, AlertTriangle, CheckCircle, XCircle,
  Clock, Search, Filter, Download, MoreVertical,
  Eye, Edit2, UserX, Calendar, Award, TrendingUp,
  TrendingDown, MinusCircle, Star
} from 'lucide-react';

const DeputyConductRecords = () => {
  const [conductRecords, setConductRecords] = useState([
    {
      id: 'CR001',
      student: 'Emma Thompson',
      grade: '10B',
      conductGrade: 'A',
      demerits: 0,
      merits: 15,
      incidents: [],
      lastUpdated: '2024-03-15',
      trend: 'improving',
      remarks: 'Excellent behavior, class prefect'
    },
    {
      id: 'CR002',
      student: 'James Wilson',
      grade: '11A',
      conductGrade: 'C',
      demerits: 8,
      merits: 3,
      incidents: [
        { date: '2024-03-10', type: 'Late to class', demerits: 2 },
        { date: '2024-03-08', type: 'Disruptive behavior', demerits: 3 },
        { date: '2024-03-05', type: 'Uniform violation', demerits: 1 }
      ],
      lastUpdated: '2024-03-14',
      trend: 'declining',
      remarks: 'Needs improvement, multiple warnings'
    },
    {
      id: 'CR003',
      student: 'Sophia Lee',
      grade: '9C',
      conductGrade: 'A',
      demerits: 0,
      merits: 12,
      incidents: [],
      lastUpdated: '2024-03-15',
      trend: 'stable',
      remarks: 'Model student, helps others'
    },
    {
      id: 'CR004',
      student: 'Michael Brown',
      grade: '12C',
      conductGrade: 'D',
      demerits: 15,
      merits: 1,
      incidents: [
        { date: '2024-03-12', type: 'Fighting', demerits: 5 },
        { date: '2024-03-09', type: 'Disrespect to teacher', demerits: 4 },
        { date: '2024-03-07', type: 'Skipping class', demerits: 3 },
        { date: '2024-03-04', type: 'Vandalism', demerits: 3 }
      ],
      lastUpdated: '2024-03-13',
      trend: 'declining',
      remarks: 'On probation, multiple serious incidents'
    },
    {
      id: 'CR005',
      student: 'Olivia Martinez',
      grade: '11B',
      conductGrade: 'B',
      demerits: 3,
      merits: 8,
      incidents: [
        { date: '2024-03-11', type: 'Late submission', demerits: 1 },
        { date: '2024-03-02', type: 'Phone use in class', demerits: 2 }
      ],
      lastUpdated: '2024-03-14',
      trend: 'improving',
      remarks: 'Generally good, minor issues'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterTrend, setFilterTrend] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredRecords = conductRecords.filter(record => 
    (filterGrade === 'all' || record.grade === filterGrade) &&
    (filterTrend === 'all' || record.trend === filterTrend) &&
    (record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getConductBadgeColor = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'declining':
        return <TrendingDown size={16} className="text-red-500" />;
      case 'stable':
        return <MinusCircle size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'improving': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      case 'stable': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Conduct Records</h1>
          <p className="text-gray-600 mt-1">Track merit, demerit points and conduct grades</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <ClipboardList size={18} />
            <span>Add Conduct Record</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-gray-800">856</p>
          <p className="text-xs text-gray-500">All students</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Excellent (A)</p>
          <p className="text-2xl font-bold text-green-600">245</p>
          <p className="text-xs text-green-500">28.6% of students</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Needs Improvement</p>
          <p className="text-2xl font-bold text-orange-600">89</p>
          <p className="text-xs text-orange-500">Conduct D or F</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Demerits</p>
          <p className="text-2xl font-bold text-red-600">1,245</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Merits</p>
          <p className="text-2xl font-bold text-blue-600">3,567</p>
          <p className="text-xs text-gray-500">This month</p>
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
                placeholder="Search by student name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="all">All Grades</option>
              <option value="9A">9A</option>
              <option value="9B">9B</option>
              <option value="9C">9C</option>
              <option value="10A">10A</option>
              <option value="10B">10B</option>
              <option value="10C">10C</option>
              <option value="11A">11A</option>
              <option value="11B">11B</option>
              <option value="12A">12A</option>
              <option value="12B">12B</option>
              <option value="12C">12C</option>
            </select>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterTrend}
              onChange={(e) => setFilterTrend(e.target.value)}
            >
              <option value="all">All Trends</option>
              <option value="improving">Improving</option>
              <option value="stable">Stable</option>
              <option value="declining">Declining</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Conduct Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conduct Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demerits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {record.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{record.student}</p>
                        <p className="text-xs text-gray-500">ID: {record.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {record.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConductBadgeColor(record.conductGrade)}`}>
                      {record.conductGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Award size={16} className="text-blue-500" />
                      <span className="font-medium text-gray-800">{record.merits}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <AlertTriangle size={16} className="text-red-500" />
                      <span className="font-medium text-gray-800">{record.demerits}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(record.trend)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getTrendColor(record.trend)}`}>
                        {record.trend.charAt(0).toUpperCase() + record.trend.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetailsModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="Add Merit">
                        <Star size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition" title="Add Demerit">
                        <AlertTriangle size={16} className="text-orange-600" />
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
          <p className="text-sm text-gray-600">Showing 1 to {filteredRecords.length} of {conductRecords.length} entries</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Conduct Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Conduct Record Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedRecord.student.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedRecord.student}</h3>
                  <p className="text-gray-600">Grade {selectedRecord.grade} • Record ID: {selectedRecord.id}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConductBadgeColor(selectedRecord.conductGrade)}`}>
                      Conduct: {selectedRecord.conductGrade}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getTrendColor(selectedRecord.trend)}`}>
                      {selectedRecord.trend.charAt(0).toUpperCase() + selectedRecord.trend.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Merit/Demerit Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Merits</p>
                      <p className="text-3xl font-bold text-blue-700">{selectedRecord.merits}</p>
                    </div>
                    <Star size={32} className="text-blue-500" />
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Total Demerits</p>
                      <p className="text-3xl font-bold text-red-700">{selectedRecord.demerits}</p>
                    </div>
                    <AlertTriangle size={32} className="text-red-500" />
                  </div>
                </div>
              </div>

              {/* Incident History */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Incident History</h4>
                {selectedRecord.incidents && selectedRecord.incidents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRecord.incidents.map((incident, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-red-100 rounded-full">
                            <AlertTriangle size={14} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{incident.type}</p>
                            <p className="text-xs text-gray-500">{incident.date}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          -{incident.demerits} demerits
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">No incidents recorded</p>
                )}
              </div>

              {/* Remarks */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Remarks</h4>
                <p className="text-gray-700">{selectedRecord.remarks}</p>
                <p className="text-xs text-gray-500 mt-2">Last updated: {selectedRecord.lastUpdated}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Merit
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Add Demerit
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Schedule Meeting
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Contact Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeputyConductRecords;