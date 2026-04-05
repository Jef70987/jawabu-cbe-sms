import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar,
  Camera, Save, Key, Shield, Award,
  Edit2, CheckCircle, XCircle, RefreshCw
} from 'lucide-react';

const SettingsProfile = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: 'Dr. Sarah Martinez',
    title: 'Deputy Principal',
    email: 's.martinez@school.edu',
    phone: '+1 234-567-8900',
    alternatePhone: '+1 234-567-8901',
    office: 'Room 205',
    department: 'Discipline & Student Affairs',
    joinDate: '2020-08-15',
    employeeId: 'DP-2020-001',
    bio: 'Experienced educator with over 15 years in student affairs and discipline management. Committed to creating a safe and supportive learning environment.',
    qualifications: [
      'PhD in Educational Leadership',
      'Masters in Counseling Psychology',
      'Certificate in Conflict Resolution'
    ],
    languages: ['English', 'Spanish'],
    emergencyContact: {
      name: 'John Martinez',
      relationship: 'Spouse',
      phone: '+1 234-567-8999'
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and professional details</p>
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
              Profile updated successfully
            </span>
          )}
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">{profile.fullName}</h2>
            <p className="text-purple-600">{profile.title}</p>
            <div className="mt-3 flex justify-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Verified</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="text-sm font-medium text-gray-800">{profile.employeeId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Join Date</p>
                  <p className="text-sm font-medium text-gray-800">{profile.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Years of Service</p>
                  <p className="text-sm font-medium text-gray-800">4 years</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Role Level</p>
                  <p className="text-sm font-medium text-purple-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Phone size={18} className="text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <input
                  type="tel"
                  value={profile.alternatePhone}
                  onChange={(e) => setProfile({...profile, alternatePhone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office/Room</label>
                <input
                  type="text"
                  value={profile.office}
                  onChange={(e) => setProfile({...profile, office: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <div className="space-y-2">
                  {profile.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-gray-700">{qual}</span>
                    </div>
                  ))}
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    + Add Qualification
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {lang}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-purple-500">
                    + Add Language
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={profile.emergencyContact.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={profile.emergencyContact.relationship}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.emergencyContact.phone}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Change Password Button */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Key size={16} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Update Password
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsProfile;