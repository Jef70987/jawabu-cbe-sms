import React, { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock,
  TrendingUp, TrendingDown, MinusCircle,
  Eye, Edit2, MoreVertical, Search, Filter
} from 'lucide-react';

const StudentConduct = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const conductRecords = [
    {
      id: 1,
      student: 'Emma Thompson',
      grade: '10B',
      conductGrade: 'A',
      demerits: 0,
      merits: 15,
      incidents: [],
      trend: 'improving',
      remarks: 'Excellent behavior, class prefect'
    },
    {
      id: 2,
      student: 'James Wilson',
      grade: '11A',
      conductGrade: 'C',
      demerits: 8,
      merits: 3,
      incidents: [
        { date: '2024-03-10', type: 'Late to class', demerits: 2 },
        { date: '2024-03-08', type: 'Disruptive behavior', demerits: 3 }
      ],
      trend: 'declining',
      remarks: 'Needs improvement, multiple warnings'
    },
    {
      id: 3,
      student: 'Sophia Lee',
      grade: '9C',
      conductGrade: 'A',
      demerits: 0,
      merits: 12,
      incidents: [],
      trend: 'stable',
      remarks: 'Model student'
    },
    {
      id: 4,
      student: 'Michael Brown',
      grade: '12C',
      conductGrade: 'D',
      demerits: 15,
      merits: 1,
      incidents: [
        { date: '2024-03-12', type: 'Fighting', demerits: 5 },
        { date: '2024-03-09', type: 'Disrespect', demerits: 4 }
      ],
      trend: 'declining',
      remarks: 'On probation'
    }
  ];

  const getConductBadgeColor = (grade) => {
    switch(grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp size={16} className="text-green-500" />;
      case 'declining': return <TrendingDown size={16} className="text-red-500" />;
      case 'stable': return <MinusCircle size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  const filteredRecords = conductRecords.filter(r =>
    r.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Excellent Conduct (A)</p>
          <p className="text-2xl font-bold text-green-600">245</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Needs Improvement</p>
          <p className="text-2xl font-bold text-orange-600">89</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Demerits</p>
          <p className="text-2xl font-bold text-red-600">1,245</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Merits</p>
          <p className="text-2xl font-bold text-blue-600">3,567</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg">
          <option>All Grades</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
          <option>Grade 11</option>
          <option>Grade 12</option>
        </select>
      </div>

      {/* Conduct Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conduct Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demerits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{record.student}</td>
                <td className="px-6 py-4 text-gray-600">{record.grade}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConductBadgeColor(record.conductGrade)}`}>
                    {record.conductGrade}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={16} className="text-green-500" />
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
                    <span className="text-sm capitalize">{record.trend}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentConduct;