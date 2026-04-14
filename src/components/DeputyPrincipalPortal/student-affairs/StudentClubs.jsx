import React, { useState } from 'react';
import {
  Award, Users, Calendar, Eye, Edit2,
  Plus, Download, Star, TrendingUp
} from 'lucide-react';

const StudentClubs = () => {
  const clubs = [
    {
      id: 1,
      name: 'Debate Club',
      category: 'Academic',
      members: 45,
      president: 'Emma Thompson',
      meetingDay: 'Wednesdays',
      meetingTime: '3:00 PM',
      status: 'Active',
      achievements: ['Regional Champions 2023', 'Best Speaker Award']
    },
    {
      id: 2,
      name: 'Robotics Club',
      category: 'STEM',
      members: 32,
      president: 'James Wilson',
      meetingDay: 'Fridays',
      meetingTime: '4:00 PM',
      status: 'Active',
      achievements: ['National Competition Finalists']
    },
    {
      id: 3,
      name: 'Art Club',
      category: 'Arts',
      members: 28,
      president: 'Sophia Lee',
      meetingDay: 'Tuesdays',
      meetingTime: '2:30 PM',
      status: 'Active',
      achievements: ['Annual Exhibition', 'Community Mural Project']
    },
    {
      id: 4,
      name: 'Music Society',
      category: 'Arts',
      members: 56,
      president: 'Michael Brown',
      meetingDay: 'Thursdays',
      meetingTime: '3:30 PM',
      status: 'Active',
      achievements: ['Spring Concert', 'Inter-school Competition Winners']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Club</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Clubs</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Award size={24} className="text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">24</p>
          <p className="text-sm text-gray-600">Active Clubs</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Users size={24} className="text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">856</p>
          <p className="text-sm text-gray-600">Total Members</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Star size={24} className="text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-sm text-gray-600">Awards This Year</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <TrendingUp size={24} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">15%</p>
          <p className="text-sm text-gray-600">Growth Rate</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{club.name}</h3>
                  <p className="text-sm text-gray-500">{club.category}</p>
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

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">President</p>
                <p className="text-sm font-medium text-gray-800">{club.president}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Members</p>
                <p className="text-sm font-medium text-gray-800">{club.members}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Meeting</p>
                <p className="text-sm font-medium text-gray-800">{club.meetingDay}, {club.meetingTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{club.status}</span>
              </div>
            </div>

            {club.achievements.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Achievements</p>
                <div className="flex flex-wrap gap-1">
                  {club.achievements.map((achievement, idx) => (
                    <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClubs;