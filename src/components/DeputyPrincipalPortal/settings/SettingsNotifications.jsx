import React, { useState } from 'react';
import {
  Bell, Mail, Phone, MessageSquare,
  Calendar, Clock, AlertTriangle, CheckCircle,
  Save, RefreshCw, CheckCheck, Settings
} from 'lucide-react';

const SettingsNotifications = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [notifications, setNotifications] = useState({
    email: {
      newCases: true,
      caseUpdates: true,
      hearingReminders: true,
      appealSubmissions: true,
      weeklyDigest: true,
      monthlyReport: true,
      systemUpdates: false
    },
    sms: {
      urgentAlerts: true,
      hearingReminders: false,
      appealDecisions: true
    },
    push: {
      newCases: true,
      caseUpdates: true,
      hearingReminders: true,
      urgentAlerts: true
    }
  });

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: '22:00',
    end: '07:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
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
          <h1 className="text-3xl font-bold text-gray-800">Notification Settings</h1>
          <p className="text-gray-600 mt-1">Configure how you receive alerts and updates</p>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Email Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">New Case Filed</span>
              <input
                type="checkbox"
                checked={notifications.email.newCases}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, newCases: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Case Status Updates</span>
              <input
                type="checkbox"
                checked={notifications.email.caseUpdates}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, caseUpdates: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Hearing Reminders</span>
              <input
                type="checkbox"
                checked={notifications.email.hearingReminders}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, hearingReminders: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Appeal Submissions</span>
              <input
                type="checkbox"
                checked={notifications.email.appealSubmissions}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, appealSubmissions: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Weekly Digest</span>
              <input
                type="checkbox"
                checked={notifications.email.weeklyDigest}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, weeklyDigest: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Monthly Report</span>
              <input
                type="checkbox"
                checked={notifications.email.monthlyReport}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, monthlyReport: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">SMS Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Urgent Alerts</span>
              <input
                type="checkbox"
                checked={notifications.sms.urgentAlerts}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, urgentAlerts: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Hearing Reminders</span>
              <input
                type="checkbox"
                checked={notifications.sms.hearingReminders}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, hearingReminders: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Appeal Decisions</span>
              <input
                type="checkbox"
                checked={notifications.sms.appealDecisions}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, appealDecisions: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">SMS charges may apply based on your mobile plan</p>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Push Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">New Case Filed</span>
              <input
                type="checkbox"
                checked={notifications.push.newCases}
                onChange={(e) => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, newCases: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Case Status Updates</span>
              <input
                type="checkbox"
                checked={notifications.push.caseUpdates}
                onChange={(e) => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, caseUpdates: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Hearing Reminders</span>
              <input
                type="checkbox"
                checked={notifications.push.hearingReminders}
                onChange={(e) => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, hearingReminders: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Urgent Alerts</span>
              <input
                type="checkbox"
                checked={notifications.push.urgentAlerts}
                onChange={(e) => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, urgentAlerts: e.target.checked }
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Quiet Hours Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock size={20} className="text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Quiet Hours</h2>
        </div>
        
        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Enable Quiet Hours</span>
            <p className="text-xs text-gray-500">Mute notifications during specified hours</p>
          </div>
          <input
            type="checkbox"
            checked={quietHours.enabled}
            onChange={(e) => setQuietHours({...quietHours, enabled: e.target.checked})}
            className="w-5 h-5 text-purple-600 rounded"
          />
        </label>

        {quietHours.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={quietHours.start}
                onChange={(e) => setQuietHours({...quietHours, start: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuietHours({...quietHours, end: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Notification Preview</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New High Severity Case</p>
              <p className="text-xs text-gray-500">James Wilson - Physical Altercation</p>
            </div>
            <span className="text-xs text-gray-400">Just now</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Hearing Reminder</p>
              <p className="text-xs text-gray-500">Michael Brown - Tomorrow at 10:00 AM</p>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNotifications;