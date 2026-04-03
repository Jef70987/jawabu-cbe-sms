import React, { useState } from 'react';
import {
  Shield, Lock, Key, Fingerprint,
  Smartphone, Mail, AlertTriangle,
  Save, RefreshCw, CheckCircle,
  Eye, EyeOff, LogOut, History,
  Users, Globe, Clock
} from 'lucide-react';

const SettingsSecurity = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAlerts: true,
    ipRestriction: false,
    passwordExpiry: 90,
    rememberMe: false,
    allowedIPs: ['192.168.1.0/24', '10.0.0.0/8']
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const loginHistory = [
    { date: '2024-04-02 08:30:00', ip: '192.168.1.1', device: 'Chrome on Windows', location: 'Main Office', status: 'Successful' },
    { date: '2024-04-01 17:15:00', ip: '192.168.1.1', device: 'Chrome on Windows', location: 'Main Office', status: 'Successful' },
    { date: '2024-03-31 09:00:00', ip: '10.0.0.5', device: 'Safari on iPhone', location: 'Remote', status: 'Successful' },
    { date: '2024-03-30 22:30:00', ip: '203.0.113.45', device: 'Unknown', location: 'Unknown', status: 'Failed' }
  ];

  const activeSessions = [
    { device: 'Windows PC - Chrome', location: 'Main Office', lastActive: '2024-04-02 08:30:00', current: true },
    { device: 'iPhone - Safari', location: 'Remote', lastActive: '2024-04-01 09:00:00', current: false }
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Security Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account security and authentication</p>
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
              Security settings saved
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
        {/* Security Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock size={20} className="text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with numbers and symbols</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </form>
          </div>

          {/* Security Options */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Security Options</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Two-Factor Authentication (2FA)</span>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={security.twoFactorAuth}
                  onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Login Alerts</span>
                  <p className="text-xs text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">IP Restriction</span>
                  <p className="text-xs text-gray-500">Restrict access to specific IP addresses</p>
                </div>
                <input
                  type="checkbox"
                  checked={security.ipRestriction}
                  onChange={(e) => setSecurity({...security, ipRestriction: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              {security.ipRestriction && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed IP Addresses</label>
                  <textarea
                    rows={3}
                    value={security.allowedIPs.join('\n')}
                    onChange={(e) => setSecurity({...security, allowedIPs: e.target.value.split('\n')})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter IP addresses (one per line)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter IP addresses or CIDR ranges (e.g., 192.168.1.0/24)</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="5"
                  max="120"
                />
                <p className="text-xs text-gray-500 mt-1">Auto logout after period of inactivity</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                <input
                  type="number"
                  value={security.passwordExpiry}
                  onChange={(e) => setSecurity({...security, passwordExpiry: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="30"
                  max="365"
                />
                <p className="text-xs text-gray-500 mt-1">Force password change after specified days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security Status */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Security Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">2FA Status</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Password Change</span>
                <span className="text-sm font-medium text-gray-800">45 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              View All Sessions
            </button>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Active Sessions</h3>
            <div className="space-y-3">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Smartphone size={16} className="text-gray-500" />
                      <span className="text-sm font-medium">{session.device}</span>
                      {session.current && (
                        <span className="text-xs bg-green-100 text-green-800 px-1.5 rounded-full">Current</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{session.location} • Last active: {session.lastActive}</p>
                  </div>
                  {!session.current && (
                    <button className="text-xs text-red-600 hover:text-red-700">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Login Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Login Activity</h3>
              <History size={16} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {loginHistory.map((login, idx) => (
                <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{login.date}</p>
                    <span className={`text-xs ${
                      login.status === 'Successful' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {login.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{login.device} • {login.location}</p>
                  <p className="text-xs text-gray-400">IP: {login.ip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="font-semibold text-red-800">Danger Zone</h3>
            </div>
            <button className="w-full px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-100 transition">
              Deactivate Account
            </button>
            <p className="text-xs text-red-600 mt-2">This action cannot be undone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;