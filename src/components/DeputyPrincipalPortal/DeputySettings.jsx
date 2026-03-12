import React, { useState } from 'react';
import {
  Settings, User, Bell, Shield, Lock, Globe,
  Mail, Phone, Save, Moon, Sun, Volume2,
  Eye, EyeOff, Key, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Upload, Download
} from 'lucide-react';

const DeputySettings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    profile: {
      name: 'Dr. Sarah Martinez',
      email: 's.martinez@school.edu',
      phone: '+1 234-567-8900',
      department: 'Deputy Principal',
      office: 'Room 205',
      avatar: null
    },
    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      caseUpdates: true,
      hearingReminders: true,
      weeklyReports: true,
      urgentAlerts: true,
      parentContacts: false
    },
    // System Preferences
    preferences: {
      theme: 'light',
      language: 'English',
      timezone: 'EST',
      dateFormat: 'MM/DD/YYYY',
      itemsPerPage: 20
    },
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      ipRestriction: false
    },
    // Discipline Settings
    disciplineSettings: {
      autoEscalate: true,
      requireApproval: true,
      maxWarningsBeforeSuspension: 3,
      suspensionReviewDays: 5,
      notifyPrincipalOnHighSeverity: true,
      allowStudentAppeal: true
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'preferences', name: 'Preferences', icon: <Globe size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> },
    { id: 'discipline', name: 'Discipline Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and system settings</p>
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
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
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
                      <span className="text-sm text-gray-700">Case Updates</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.caseUpdates}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, caseUpdates: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Weekly Reports</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, weeklyReports: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
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
                      <span className="text-sm text-gray-700">Hearing Reminders</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.hearingReminders}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, hearingReminders: e.target.checked }
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
                  <option value="20">20</option>
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
                </div>
              </div>
            </div>
          )}

          {/* Discipline Settings */}
          {activeTab === 'discipline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Auto-escalate Cases</span>
                      <p className="text-xs text-gray-500">Automatically escalate unresolved cases</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.disciplineSettings.autoEscalate}
                      onChange={(e) => setSettings({
                        ...settings,
                        disciplineSettings: { ...settings.disciplineSettings, autoEscalate: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Require Approval</span>
                      <p className="text-xs text-gray-500">Require approval for suspensions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.disciplineSettings.requireApproval}
                      onChange={(e) => setSettings({
                        ...settings,
                        disciplineSettings: { ...settings.disciplineSettings, requireApproval: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Student Appeal</span>
                      <p className="text-xs text-gray-500">Students can appeal decisions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.disciplineSettings.allowStudentAppeal}
                      onChange={(e) => setSettings({
                        ...settings,
                        disciplineSettings: { ...settings.disciplineSettings, allowStudentAppeal: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Warnings Before Suspension
                    </label>
                    <input
                      type="number"
                      value={settings.disciplineSettings.maxWarningsBeforeSuspension}
                      onChange={(e) => setSettings({
                        ...settings,
                        disciplineSettings: { ...settings.disciplineSettings, maxWarningsBeforeSuspension: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suspension Review Days
                    </label>
                    <input
                      type="number"
                      value={settings.disciplineSettings.suspensionReviewDays}
                      onChange={(e) => setSettings({
                        ...settings,
                        disciplineSettings: { ...settings.disciplineSettings, suspensionReviewDays: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
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
    </div>
  );
};

export default DeputySettings;