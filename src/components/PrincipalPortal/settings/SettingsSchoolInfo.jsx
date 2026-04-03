import React, { useState } from 'react';
import {
  Building, MapPin, Phone, Mail, Globe,
  Calendar, Users, Award, BookOpen,
  Save, RefreshCw, CheckCircle, Edit2,
  Upload, Image as ImageIcon
} from 'lucide-react';

const SettingsSchoolInfo = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Springfield High School',
    motto: 'Excellence in Education',
    established: '1985',
    type: 'Public High School',
    principal: 'Dr. John Smith',
    vicePrincipal: 'Dr. Sarah Martinez',
    address: '123 Education Lane, Springfield, IL 62701',
    phone: '+1 234-567-8000',
    email: 'info@springfield.edu',
    website: 'www.springfield.edu',
    accreditation: 'AdvancED Accredited',
    gradesOffered: '9-12',
    studentCount: 2450,
    staffCount: 186,
    campusSize: '25 acres',
    mission: 'To provide a nurturing environment that fosters academic excellence, personal growth, and community responsibility.',
    vision: 'To be a premier institution recognized for innovation, leadership, and student success.',
    colors: ['Blue', 'White'],
    mascot: 'Tigers',
    schoolHours: '8:00 AM - 3:00 PM'
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">School Information</h1>
          <p className="text-gray-600 mt-1">Manage school profile and institutional details</p>
        </div>
        <div className="flex items-center space-x-3">
          {saveStatus === 'saving' && (
            <span className="text-sm text-gray-500 flex items-center">
              <RefreshCw size={16} className="animate-spin mr-2" />
              Saving...
            </span>
          )}
          {saveStatus === 'success' && (
            <span className="text-sm text-green-600 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              School info updated successfully
            </span>
          )}
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Logo & Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
              SHS
            </div>
            <button className="mt-3 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 flex items-center justify-center space-x-2 mx-auto">
              <Upload size={16} />
              <span>Upload Logo</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-blue-500" />
                  <span className="text-gray-600">Total Students</span>
                </div>
                <span className="font-semibold text-gray-800">{schoolInfo.studentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-green-500" />
                  <span className="text-gray-600">Total Staff</span>
                </div>
                <span className="font-semibold text-gray-800">{schoolInfo.staffCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} className="text-purple-500" />
                  <span className="text-gray-600">Grades Offered</span>
                </div>
                <span className="font-semibold text-gray-800">{schoolInfo.gradesOffered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-yellow-500" />
                  <span className="text-gray-600">Accreditation</span>
                </div>
                <span className="font-semibold text-gray-800">AdvancED</span>
              </div>
            </div>
          </div>
        </div>

        {/* School Details Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={schoolInfo.name}
                  onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
                <input
                  type="text"
                  value={schoolInfo.motto}
                  onChange={(e) => setSchoolInfo({...schoolInfo, motto: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                <input
                  type="text"
                  value={schoolInfo.established}
                  onChange={(e) => setSchoolInfo({...schoolInfo, established: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                <input
                  type="text"
                  value={schoolInfo.type}
                  onChange={(e) => setSchoolInfo({...schoolInfo, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mascot</label>
                <input
                  type="text"
                  value={schoolInfo.mascot}
                  onChange={(e) => setSchoolInfo({...schoolInfo, mascot: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} className="inline mr-1" /> Address
                </label>
                <textarea
                  rows={2}
                  value={schoolInfo.address}
                  onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={schoolInfo.phone}
                    onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={schoolInfo.email}
                    onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe size={16} className="inline mr-1" /> Website
                  </label>
                  <input
                    type="text"
                    value={schoolInfo.website}
                    onChange={(e) => setSchoolInfo({...schoolInfo, website: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={16} className="inline mr-1" /> School Hours
                  </label>
                  <input
                    type="text"
                    value={schoolInfo.schoolHours}
                    onChange={(e) => setSchoolInfo({...schoolInfo, schoolHours: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Vision</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  value={schoolInfo.mission}
                  onChange={(e) => setSchoolInfo({...schoolInfo, mission: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={schoolInfo.vision}
                  onChange={(e) => setSchoolInfo({...schoolInfo, vision: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Leadership */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">School Leadership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Principal</label>
                <input
                  type="text"
                  value={schoolInfo.principal}
                  onChange={(e) => setSchoolInfo({...schoolInfo, principal: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vice Principal</label>
                <input
                  type="text"
                  value={schoolInfo.vicePrincipal}
                  onChange={(e) => setSchoolInfo({...schoolInfo, vicePrincipal: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSchoolInfo;