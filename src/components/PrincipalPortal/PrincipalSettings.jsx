import React, { useState } from 'react';
import {
  Settings, User, Bell, Shield, Lock, Globe,
  Mail, Phone, Save, Moon, Sun, Volume2,
  Eye, EyeOff, Key, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Upload, Download,
  Building2, Users, Calendar, Clock
} from 'lucide-react';

const PrincipalSettings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    profile: {
      name: 'Dr. John Smith',
      title: 'Principal',
      email: 'j.smith@school.edu',
      phone: '+1 234-567-8900',
      department: 'Administration',
      office: 'Room 101',
      avatar: null
    },
    // School Information
    school: {
      name: 'Springfield High School',
      address: '123 Education Lane, Springfield',
      phone: '+1 234-567-8000',
      email: 'info@springfield.edu',
      website: 'www.springfield.edu',
      motto: 'Excellence in Education',
      founded: '1985',
      principal: 'Dr. John Smith'
    },
    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      systemUpdates: true,
      reportReminders: true,
      meetingReminders: true,
      urgentAlerts: true,
      weeklyDigest: true
    },
    // System Preferences
    preferences: {
      theme: 'light',
      language: 'English',
      timezone: 'EST',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      itemsPerPage: 25
    },
    // Security Settings
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      loginAlerts: true,
      ipRestriction: false,
      passwordExpiry: 90
    },
    // Academic Settings
    academic: {
      gradingSystem: 'Letter Grade',
      academicYear: '2023-2024',
      semester: 'Spring',
      passGrade: 'D',
      attendanceThreshold: 90,
      allowGradeAppeals: true
    },
    // System Settings
    system: {
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
      backupFrequency: 'Daily',
      retentionPeriod: 30
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'school', name: 'School Info', icon: <Building2 size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'preferences', name: 'Preferences', icon: <Globe size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> },
    { id: 'academic', name: 'Academic', icon: <GraduationCap size={18} /> },
    { id: 'system', name: 'System', icon: <Settings size={18} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and institutional settings</p>
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
              Settings saved successfully
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

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {settings.profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.profile.title}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={settings.profile.department}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Office/Room</label>
                  <input
                    type="text"
                    value={settings.profile.office}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, office: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Key size={16} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          )}

          {/* School Information */}
          {activeTab === 'school' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={settings.school.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={settings.school.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, address: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.school.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.school.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    value={settings.school.website}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, website: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motto</label>
                  <input
                    type="text"
                    value={settings.school.motto}
                    onChange={(e) => setSettings({
                      ...settings,
                      school: { ...settings.school, motto: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded</label>
                  <input
                    type="text"
                    value={settings.school.founded}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Principal</label>
                  <input
                    type="text"
                    value={settings.school.principal}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Email Alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailAlerts}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, emailAlerts: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">System Updates</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemUpdates}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, systemUpdates: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Report Reminders</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.reportReminders}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, reportReminders: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Weekly Digest</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyDigest}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, weeklyDigest: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">SMS & Urgent Alerts</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">SMS Alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsAlerts}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, smsAlerts: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Meeting Reminders</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.meetingReminders}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, meetingReminders: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Urgent Alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.urgentAlerts}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, urgentAlerts: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, theme: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, timezone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, dateFormat: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select
                  value={settings.preferences.timeFormat}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, timeFormat: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                <select
                  value={settings.preferences.itemsPerPage}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, itemsPerPage: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Login Alerts</span>
                      <p className="text-xs text-gray-500">Get notified of new logins</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="5"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="30"
                      max="365"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Settings */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grading System</label>
                  <select
                    value={settings.academic.gradingSystem}
                    onChange={(e) => setSettings({
                      ...settings,
                      academic: { ...settings.academic, gradingSystem: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Letter Grade">Letter Grade (A-F)</option>
                    <option value="Percentage">Percentage</option>
                    <option value="GPA">GPA (4.0 Scale)</option>
                    <option value="Pass/Fail">Pass/Fail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={settings.academic.academicYear}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                  <select
                    value={settings.academic.semester}
                    onChange={(e) => setSettings({
                      ...settings,
                      academic: { ...settings.academic, semester: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Pass Grade</label>
                  <select
                    value={settings.academic.passGrade}
                    onChange={(e) => setSettings({
                      ...settings,
                      academic: { ...settings.academic, passGrade: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Threshold (%)</label>
                  <input
                    type="number"
                    value={settings.academic.attendanceThreshold}
                    onChange={(e) => setSettings({
                      ...settings,
                      academic: { ...settings.academic, attendanceThreshold: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Allow Grade Appeals</span>
                    <input
                      type="checkbox"
                      checked={settings.academic.allowGradeAppeals}
                      onChange={(e) => setSettings({
                        ...settings,
                        academic: { ...settings.academic, allowGradeAppeals: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                      <p className="text-xs text-gray-500">Temporarily disable system access</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Debug Mode</span>
                      <p className="text-xs text-gray-500">Enable debugging features</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, debugMode: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Auto Backup</span>
                      <p className="text-xs text-gray-500">Automatic system backup</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.autoBackup}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, autoBackup: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  {settings.system.autoBackup && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) => setSettings({
                            ...settings,
                            system: { ...settings.system, backupFrequency: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Hourly">Hourly</option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                        <input
                          type="number"
                          value={settings.system.retentionPeriod}
                          onChange={(e) => setSettings({
                            ...settings,
                            system: { ...settings.system, retentionPeriod: parseInt(e.target.value) }
                          })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="365"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  onClick={() => setShowBackupModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Backup Now</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <RefreshCw size={16} />
                  <span>Restore from Backup</span>
                </button>
              </div>
            </div>
          )}
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
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create System Backup</h2>
            <p className="text-gray-600 mb-4">This will create a complete backup of all system data including student records, staff information, and settings.</p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm text-gray-700">Include Student Records</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm text-gray-700">Include Staff Data</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm text-gray-700">Include System Settings</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Include Audit Logs</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Start Backup
              </button>
              <button 
                onClick={() => setShowBackupModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalSettings;