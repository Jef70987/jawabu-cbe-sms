import React, { useState } from 'react';
import {
  Star, Users, Calendar, Mail, Phone,
  Eye, Edit2, Plus, Award, Crown
} from 'lucide-react';

const StudentLeaders = () => {
  const leaders = [
    {
      id: 1,
      name: 'Emma Thompson',
      position: 'Student Council President',
      grade: '10B',
      term: '2024',
      email: 'emma.thompson@school.edu',
      phone: '+1 234-567-8901',
      responsibilities: ['Lead council meetings', 'Student voice representative'],
      achievements: ['Leadership Award 2023', 'Honor Roll']
    },
    {
      id: 2,
      name: 'James Wilson',
      position: 'Vice President',
      grade: '11A',
      term: '2024',
      email: 'james.wilson@school.edu',
      phone: '+1 234-567-8902',
      responsibilities: ['Assist President', 'Committee coordination'],
      achievements: ['Student Leadership Certificate']
    },
    {
      id: 3,
      name: 'Sophia Lee',
      position: 'Secretary',
      grade: '9C',
      term: '2024',
      email: 'sophia.lee@school.edu',
      phone: '+1 234-567-8903',
      responsibilities: ['Meeting minutes', 'Communication management'],
      achievements: ['Excellence in Communication']
    },
    {
      id: 4,
      name: 'Michael Brown',
      position: 'Treasurer',
      grade: '12C',
      term: '2024',
      email: 'michael.brown@school.edu',
      phone: '+1 234-567-8904',
      responsibilities: ['Budget management', 'Fundraising coordination'],
      achievements: ['Financial Management Award']
    }
  ];

  const positions = [
    { title: 'President', count: 1, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Vice President', count: 1, color: 'bg-blue-100 text-blue-800' },
    { title: 'Secretary', count: 1, color: 'bg-green-100 text-green-800' },
    { title: 'Treasurer', count: 1, color: 'bg-purple-100 text-purple-800' },
    { title: 'Class Representatives', count: 12, color: 'bg-orange-100 text-orange-800' },
    { title: 'Club Presidents', count: 24, color: 'bg-pink-100 text-pink-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Add Leader</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Crown size={18} className="text-gray-600" />
            <span>Leadership Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Crown size={24} className="text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">36</p>
          <p className="text-sm text-gray-600">Total Leaders</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Star size={24} className="text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-sm text-gray-600">Positions Filled</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Users size={24} className="text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">45%</p>
          <p className="text-sm text-gray-600">Student Participation</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Award size={24} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">28</p>
          <p className="text-sm text-gray-600">Leadership Awards</p>
        </div>
      </div>

      {/* Position Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Leadership Positions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {positions.map((pos, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{pos.title}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${pos.color}`}>{pos.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaders List */}
      <div className="space-y-4">
        {leaders.map((leader) => (
          <div key={leader.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-800">{leader.name}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{leader.position}</span>
                    <span className="text-xs text-gray-500">Grade {leader.grade}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Term: {leader.term}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Mail size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-600">{leader.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-600">{leader.phone}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">Responsibilities:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600">
                      {leader.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">Achievements:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {leader.achievements.map((ach, idx) => (
                        <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leadership Quote */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <Crown size={32} className="mb-3" />
        <p className="text-lg font-semibold">"Leadership is not about being in charge. It's about taking care of those in your charge."</p>
        <p className="text-purple-100 mt-2">- Student Leadership Program 2024</p>
      </div>
    </div>
  );
};

export default StudentLeaders;