import React, { useState } from 'react';
import {
  Settings, Database, Cloud, Shield, Bell,
  RefreshCw, Save, CheckCircle, AlertCircle,
  Download, Upload, Clock, Users, Globe,
  Lock, Server, HardDrive, Wifi
} from 'lucide-react';

const SettingsSystem = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const [systemSettings, setSystemSettings] = useState({
    general: {
      systemName: 'School Management System',
      version: '2.1.0',
      environment: 'Production',
      debugMode: false,
      maintenanceMode: false
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'Daily',
      backupTime: '02:00',
      retentionPeriod: 30,
      backupLocation: '/backups/school-system/'
    },
    database: {
      autoOptimize: true,
      backupBeforeUpdate: true,
      logRetention: 90,
      queryLogging: false
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      maxUploadSize: 10
    },
    logging: {
      errorLogging: true,
      auditLogging: true,
      userActivityLogging: true,
      apiLogging: false
    },
    integrations: {
      emailEnabled: true,
      smsEnabled: false,
      paymentGateway: 'Stripe',
      calendarSync: true
    }
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleBackup = () => {
    alert('Backup initiated successfully!');
    setShowBackupModal(false);
  };

  const handleRestore = () => {
    alert('System restore completed!');
    setShowRestoreModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
              <input
                type="text"
                value={systemSettings.general.systemName}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  general: {...systemSettings.general, systemName: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select
                value={systemSettings.general.environment}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  general: {...systemSettings.general, environment: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Version</label>
              <input
                type="text"
                value={systemSettings.general.version}
                readOnly
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
              />
            </div>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Debug Mode</span>
                <p className="text-xs text-gray-500">Enable detailed error logging</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.general.debugMode}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  general: {...systemSettings.general, debugMode: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                <p className="text-xs text-gray-500">Temporarily disable system access</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.general.maintenanceMode}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  general: {...systemSettings.general, maintenanceMode: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Backup Settings</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Auto Backup</span>
                <p className="text-xs text-gray-500">Automatically backup system data</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.backup.autoBackup}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  backup: {...systemSettings.backup, autoBackup: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            {systemSettings.backup.autoBackup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                  <select
                    value={systemSettings.backup.backupFrequency}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      backup: {...systemSettings.backup, backupFrequency: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Time</label>
                  <input
                    type="time"
                    value={systemSettings.backup.backupTime}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      backup: {...systemSettings.backup, backupTime: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
                  <input
                    type="number"
                    value={systemSettings.backup.retentionPeriod}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      backup: {...systemSettings.backup, retentionPeriod: parseInt(e.target.value)}
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="1"
                    max="365"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setShowBackupModal(true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Backup Now</span>
              </button>
              <button 
                onClick={() => setShowRestoreModal(true)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Upload size={16} />
                <span>Restore Backup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Database Settings</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Auto Optimize</span>
                <p className="text-xs text-gray-500">Automatically optimize database tables</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.database.autoOptimize}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  database: {...systemSettings.database, autoOptimize: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Backup Before Update</span>
                <p className="text-xs text-gray-500">Create backup before system updates</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.database.backupBeforeUpdate}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  database: {...systemSettings.database, backupBeforeUpdate: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Retention (days)</label>
              <input
                type="number"
                value={systemSettings.database.logRetention}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  database: {...systemSettings.database, logRetention: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="30"
                max="365"
              />
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Server size={20} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Performance Settings</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Cache Enabled</span>
                <p className="text-xs text-gray-500">Enable system caching for better performance</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.performance.cacheEnabled}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  performance: {...systemSettings.performance, cacheEnabled: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            {systemSettings.performance.cacheEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cache Duration (seconds)</label>
                <input
                  type="number"
                  value={systemSettings.performance.cacheDuration}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    performance: {...systemSettings.performance, cacheDuration: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="60"
                  max="86400"
                />
              </div>
            )}

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Compression Enabled</span>
                <p className="text-xs text-gray-500">Enable response compression</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.performance.compressionEnabled}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  performance: {...systemSettings.performance, compressionEnabled: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Upload Size (MB)</label>
              <input
                type="number"
                value={systemSettings.performance.maxUploadSize}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  performance: {...systemSettings.performance, maxUploadSize: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Logging Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Logging Settings</h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Error Logging</span>
                <p className="text-xs text-gray-500">Log system errors and exceptions</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.logging.errorLogging}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  logging: {...systemSettings.logging, errorLogging: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Audit Logging</span>
                <p className="text-xs text-gray-500">Track all system changes</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.logging.auditLogging}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  logging: {...systemSettings.logging, auditLogging: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">User Activity Logging</span>
                <p className="text-xs text-gray-500">Track user actions and activities</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.logging.userActivityLogging}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  logging: {...systemSettings.logging, userActivityLogging: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Cloud size={20} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Integration Settings</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Email Service</span>
                <p className="text-xs text-gray-500">Enable email notifications</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.integrations.emailEnabled}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  integrations: {...systemSettings.integrations, emailEnabled: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">SMS Service</span>
                <p className="text-xs text-gray-500">Enable SMS notifications</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.integrations.smsEnabled}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  integrations: {...systemSettings.integrations, smsEnabled: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
              <select
                value={systemSettings.integrations.paymentGateway}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  integrations: {...systemSettings.integrations, paymentGateway: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Square</option>
                <option>None</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Calendar Sync</span>
                <p className="text-xs text-gray-500">Sync with external calendars</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.integrations.calendarSync}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  integrations: {...systemSettings.integrations, calendarSync: e.target.checked}
                })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">Database</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">Cache Server</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">Storage</p>
              <p className="text-xs text-gray-500">45% Used</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">API Status</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          </div>
        </div>
      </div>

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
              <button 
                onClick={handleBackup}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
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

      {/* Restore. Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Restore from Backup</h2>
            <p className="text-yellow-600 text-sm mb-4">⚠️ Warning: This will overwrite current data. This action cannot be undone.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Backup File</label>
              <input type="file" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={handleRestore}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Restore Now
              </button>
              <button 
                onClick={() => setShowRestoreModal(false)}
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

export default SettingsSystem;