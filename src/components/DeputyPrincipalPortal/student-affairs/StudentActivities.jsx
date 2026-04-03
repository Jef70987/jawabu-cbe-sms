import React, { useState } from 'react';
import {
  Calendar, Clock, Users, MapPin,
  Eye, Edit2, Plus, Download,
  CheckCircle, AlertCircle, Filter
} from 'lucide-react';

const StudentActivities = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const activities = [
    {
      id: 1,
      name: 'Spring Festival',
      type: 'Cultural',
      date: '2024-04-15',
      time: '2:00 PM - 6:00 PM',
      location: 'School Grounds',
      participants: 450,
      status: 'Upcoming',
      organizer: 'Student Council'
    },
    {
      id: 2,
      name: 'Science Fair',
      type: 'Academic',
      date: '2024-04-20',
      time: '9:00 AM - 4:00 PM',
      location: 'Science Block',
      participants: 120,
      status: 'Upcoming',
      organizer: 'Science Department'
    },
    {
      id: 3,
      name: 'Sports Day',
      type: 'Sports',
      date: '2024-04-25',
      time: '8:00 AM - 5:00 PM',
      location: 'Sports Field',
      participants: 800,
      status: 'Upcoming',
      organizer: 'Sports Department'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>New Activity</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Calendar</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'upcoming' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'past' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
          >
            Past Activities
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-purple-600">32</p>
          <p className="text-sm text-gray-600">Activities This Month</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-green-600">2,450</p>
          <p className="text-sm text-gray-600">Total Participants</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-blue-600">85%</p>
          <p className="text-sm text-gray-600">Participation Rate</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-orange-600">12</p>
          <p className="text-sm text-gray-600">Departments Involved</p>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{activity.type}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.participants} participants</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Organized by: {activity.organizer}</p>
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
    </div>
  );
};

export default StudentActivities;