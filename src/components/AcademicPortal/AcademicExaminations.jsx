import React, { useState } from 'react';
import {
  ClipboardList, Calendar, Clock, Users,
  FileText, Plus, Download, Eye, Edit2,
  CheckCircle, AlertCircle, Search, Filter,
  Printer, Mail, MoreVertical, BarChart3
} from 'lucide-react';

const AcademicExaminations = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const exams = [
    {
      id: 'EXAM001',
      name: 'Mid-Term Examinations',
      type: 'Mid-Term',
      startDate: '2024-04-15',
      endDate: '2024-04-20',
      subjects: 12,
      students: 2450,
      venues: 25,
      status: 'Upcoming',
      invigilators: 48
    },
    {
      id: 'EXAM002',
      name: 'Final Examinations',
      type: 'Final',
      startDate: '2024-06-10',
      endDate: '2024-06-25',
      subjects: 18,
      students: 2450,
      venues: 30,
      status: 'Scheduled',
      invigilators: 60
    },
    {
      id: 'EXAM003',
      name: 'Quarterly Assessments',
      type: 'Quarterly',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      subjects: 8,
      students: 2200,
      venues: 20,
      status: 'Completed',
      invigilators: 40
    }
  ];

  const examSchedule = [
    { date: '2024-04-15', subject: 'Mathematics', time: '9:00 AM - 12:00 PM', venue: 'Main Hall', grade: '11A-11C' },
    { date: '2024-04-15', subject: 'English', time: '2:00 PM - 5:00 PM', venue: 'Main Hall', grade: '10A-10D' },
    { date: '2024-04-16', subject: 'Physics', time: '9:00 AM - 12:00 PM', venue: 'Science Block', grade: '12A-12C' },
    { date: '2024-04-16', subject: 'Chemistry', time: '2:00 PM - 5:00 PM', venue: 'Science Block', grade: '11A-11C' },
  ];

  const tabs = [
    { id: 'schedule', name: 'Exam Schedule', icon: <Calendar size={16} /> },
    { id: 'registration', name: 'Registration', icon: <Users size={16} /> },
    { id: 'invigilation', name: 'Invigilation', icon: <Users size={16} /> },
    { id: 'results', name: 'Results Processing', icon: <BarChart3 size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Examination Management</h1>
          <p className="text-gray-600 mt-1">Schedule, manage, and process examinations</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Schedule</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Plus size={18} />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Upcoming Exams</p>
          <p className="text-2xl font-bold text-orange-600">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Subjects</p>
          <p className="text-2xl font-bold text-gray-800">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Registered Students</p>
          <p className="text-2xl font-bold text-blue-600">2,450</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Examination Venues</p>
          <p className="text-2xl font-bold text-purple-600">30</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Invigilators</p>
          <p className="text-2xl font-bold text-green-600">60</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Examinations</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  />
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <Filter size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{exam.name}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.type}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.startDate} - {exam.endDate}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.subjects}</td>
                        <td className="px-4 py-3 text-gray-600">{exam.students}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            exam.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {exam.status}
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
                              <Printer size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Detailed Schedule - Mid-Term Examinations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Venue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {examSchedule.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                          <td className="px-4 py-2 font-medium text-gray-800">{item.subject}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.time}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.venue}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would go here */}
        </div>
      </div>
    </div>
  );
};

export default AcademicExaminations;