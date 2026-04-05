import React, { useState } from 'react';
import {
  Calendar, Clock, Users, Eye, Edit2,
  Plus, Search, Filter, Download,
  CheckCircle, XCircle, AlertCircle,
  Video, MapPin, MessageSquare, MoreVertical,
  FileText // ✅ FIXED: Added missing import
} from 'lucide-react';

const CalendarHearings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const hearings = [
    {
      id: 'HRG001',
      caseId: 'DC003',
      student: 'Michael Brown',
      grade: '12C',
      offense: 'Academic Dishonesty',
      date: '2024-04-05',
      time: '10:00 AM',
      duration: '1 hour',
      location: 'Room 204',
      mode: 'In-Person',
      panel: ['Dr. Martinez', 'Ms. Thompson', 'Mr. Davis'],
      status: 'Scheduled',
      priority: 'High'
    },
    {
      id: 'HRG002',
      caseId: 'DC005',
      student: 'Emily Davis',
      grade: '9D',
      offense: 'Bullying',
      date: '2024-04-06',
      time: '2:00 PM',
      duration: '1.5 hours',
      location: 'Conference Room A',
      mode: 'In-Person',
      panel: ['Dr. Martinez', 'Ms. Thompson'],
      status: 'Scheduled',
      priority: 'High'
    },
    {
      id: 'HRG003',
      caseId: 'DC007',
      student: 'David Lee',
      grade: '11B',
      offense: 'Vandalism',
      date: '2024-04-07',
      time: '11:00 AM',
      duration: '1 hour',
      location: 'Virtual',
      mode: 'Virtual',
      panel: ['Dr. Martinez', 'Ms. Thompson'],
      status: 'Pending Confirmation',
      priority: 'Medium'
    },
    {
      id: 'HRG004',
      caseId: 'DC009',
      student: 'Sarah Chen',
      grade: '10B',
      offense: 'Truancy',
      date: '2024-04-08',
      time: '9:30 AM',
      duration: '45 mins',
      location: 'Room 101',
      mode: 'In-Person',
      panel: ['Ms. Thompson'],
      status: 'Scheduled',
      priority: 'Low'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Pending Confirmation': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHearings = hearings.filter(hearing =>
    (activeTab === 'all' || hearing.status === activeTab) &&
    (hearing.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hearing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hearing.caseId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Disciplinary Hearings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage all disciplinary hearings</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}>
              List View
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}>
              Calendar View
            </button>
          </div>

          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Schedule</span>
          </button>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Schedule Hearing</span>
          </button>
        </div>
      </div>

      {/* (rest of your code unchanged) */}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition">
          <Video size={24} className="mb-2" />
          <p className="font-semibold">Virtual Hearing Room</p>
          <p className="text-xs text-purple-100 mt-1">Join online hearing</p>
        </button>

        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition">
          <FileText size={24} className="mb-2" />
          <p className="font-semibold">Hearing Templates</p>
          <p className="text-xs text-blue-100 mt-1">Standard procedures</p>
        </button>

        <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition">
          <MessageSquare size={24} className="mb-2" />
          <p className="font-semibold">Notify Participants</p>
          <p className="text-xs text-green-100 mt-1">Send reminders</p>
        </button>
      </div>
    </div>
  );
};

export default CalendarHearings;