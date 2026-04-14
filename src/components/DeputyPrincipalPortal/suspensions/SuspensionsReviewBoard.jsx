import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Eye, Edit2,
  Plus, CheckCircle, XCircle, Search,
  Filter, Download, MessageSquare, FileText,
  Award, Shield, UserCheck
} from 'lucide-react';

const SuspensionsReviewBoard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const reviewBoardMeetings = [
    {
      id: 'RB001',
      date: '2024-04-05',
      time: '10:00 AM',
      cases: [
        { id: 'SUS003', student: 'Michael Brown', grade: '12C', reason: 'Academic Dishonesty' },
        { id: 'SUS001', student: 'James Wilson', grade: '11A', reason: 'Physical Altercation' }
      ],
      boardMembers: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis'],
      status: 'Scheduled',
      room: 'Conference Room A'
    },
    {
      id: 'RB002',
      date: '2024-04-08',
      time: '2:00 PM',
      cases: [
        { id: 'SUS005', student: 'Emily Davis', grade: '9D', reason: 'Bullying' }
      ],
      boardMembers: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis'],
      status: 'Scheduled',
      room: 'Conference Room B'
    }
  ];

  const pastMeetings = [
    {
      id: 'RB003',
      date: '2024-03-28',
      time: '11:00 AM',
      cases: 2,
      outcomes: ['Appeal Denied', 'Suspension Reduced'],
      boardMembers: ['Dr. Martinez', 'Ms. Thompson'],
      status: 'Completed'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Review Board</h1>
          <p className="text-gray-600 mt-1">Manage suspension review board meetings and decisions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Schedule</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming Meetings</p>
          <p className="text-2xl font-bold text-blue-600">4</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Cases to Review</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Board Members</p>
          <p className="text-2xl font-bold text-purple-600">5</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Resolved Cases</p>
          <p className="text-2xl font-bold text-green-600">28</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Meetings
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Meetings
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Board Members
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {reviewBoardMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Calendar size={20} className="text-purple-600" />
                        <h3 className="font-semibold text-gray-800">Review Board Meeting</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium text-gray-800">{meeting.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium text-gray-800">{meeting.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-800">{meeting.room}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Cases</p>
                          <p className="text-sm font-medium text-purple-600">{meeting.cases.length} cases</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Cases for Review:</p>
                        <div className="space-y-2">
                          {meeting.cases.map((case_, idx) => (
                            <div key={idx} className="bg-white p-2 rounded-lg flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{case_.student}</p>
                                <p className="text-xs text-gray-500">Grade {case_.grade} - {case_.reason}</p>
                              </div>
                              <button className="px-2 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded">
                                View Details
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Board Members:</p>
                        <div className="flex flex-wrap gap-2">
                          {meeting.boardMembers.map((member, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600">
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        Manage Meeting
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <h3 className="font-semibold text-gray-800">Review Board Meeting</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Completed</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium text-gray-800">{meeting.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium text-gray-800">{meeting.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Cases Reviewed</p>
                          <p className="text-sm font-medium text-green-600">{meeting.cases}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Outcomes:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {meeting.outcomes.map((outcome, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600">
                              {outcome}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg">
                      <FileText size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Dr. Sarah Martinez', role: 'Chairperson', title: 'Deputy Principal', since: '2022' },
                  { name: 'Ms. Jennifer Thompson', role: 'Member', title: 'Head of Discipline', since: '2021' },
                  { name: 'Mr. Robert Davis', role: 'Member', title: 'Senior Teacher', since: '2023' },
                  { name: 'Dr. Emily Wilson', role: 'Member', title: 'Counselor', since: '2022' },
                  { name: 'Prof. Michael Chen', role: 'Member', title: 'Parent Representative', since: '2023' }
                ].map((member, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserCheck size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{member.name}</h4>
                        <p className="text-sm text-purple-600">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{member.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Member since {member.since}</p>
                  </div>
                ))}
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                + Add Board Member
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Guidelines */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-2">Review Board Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Shield size={16} className="text-purple-600 mt-0.5" />
            <span className="text-gray-600">Meetings held weekly on Thursdays at 10:00 AM</span>
          </div>
          <div className="flex items-start space-x-2">
            <Award size={16} className="text-purple-600 mt-0.5" />
            <span className="text-gray-600">Majority vote required for decisions</span>
          </div>
          <div className="flex items-start space-x-2">
            <Clock size={16} className="text-purple-600 mt-0.5" />
            <span className="text-gray-600">Decisions documented within 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensionsReviewBoard;