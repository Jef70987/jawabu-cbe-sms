import React, { useState } from 'react';
import {
  Users, Phone, Mail, Calendar, Star,
  Eye, Edit2, MoreVertical, Plus,
  Search, Filter, Download, Award,
  Clock, MessageSquare, UserCheck
} from 'lucide-react';

const CounselingCounselors = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const counselors = [
    {
      id: 'C001',
      name: 'Dr. Sarah Wilson',
      title: 'Senior Counselor',
      specialization: 'Academic & Career Counseling',
      email: 's.wilson@school.edu',
      phone: '+1 234-567-8901',
      office: 'Room 101',
      schedule: 'Mon-Fri, 9:00 AM - 5:00 PM',
      students: 28,
      rating: 4.9,
      sessions: 145,
      status: 'Active'
    },
    {
      id: 'C002',
      name: 'Mr. Robert Brown',
      title: 'Behavioral Counselor',
      specialization: 'Behavioral & Anger Management',
      email: 'r.brown@school.edu',
      phone: '+1 234-567-8902',
      office: 'Room 102',
      schedule: 'Mon-Thu, 8:00 AM - 4:00 PM',
      students: 22,
      rating: 4.8,
      sessions: 98,
      status: 'Active'
    },
    {
      id: 'C003',
      name: 'Ms. Jennifer Thompson',
      title: 'Youth Counselor',
      specialization: 'Personal & Social Counseling',
      email: 'j.thompson@school.edu',
      phone: '+1 234-567-8903',
      office: 'Room 103',
      schedule: 'Tue-Sat, 10:00 AM - 6:00 PM',
      students: 18,
      rating: 4.7,
      sessions: 76,
      status: 'Active'
    }
  ];

  const filteredCounselors = counselors.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header .*/}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counselors</h1>
          <p className="text-gray-600 mt-1">Manage counseling staff and their availability</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export List</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Add Counselor</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Counselors</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active Counselors</p>
          <p className="text-2xl font-bold text-green-600">6</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Students per Counselor</p>
          <p className="text-2xl font-bold text-purple-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg Satisfaction</p>
          <p className="text-2xl font-bold text-yellow-600">4.8</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>All Specializations</option>
            <option>Academic Counseling</option>
            <option>Behavioral Counseling</option>
            <option>Personal Counseling</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCounselors.map((counselor) => (
          <div key={counselor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserCheck size={32} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{counselor.name}</h3>
                    <p className="text-sm text-purple-600">{counselor.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">{counselor.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Specialization</p>
                <p className="text-gray-800">{counselor.specialization}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{counselor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{counselor.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Office: {counselor.office}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{counselor.schedule}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="text-lg font-semibold text-gray-800">{counselor.students}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sessions</p>
                    <p className="text-lg font-semibold text-gray-800">{counselor.sessions}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {counselor.status}
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  View Schedule
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageSquare size={16} className="text-gray-600" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounselingCounselors;