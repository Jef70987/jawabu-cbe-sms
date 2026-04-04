import React, { useState } from 'react';
import {
  Gavel, AlertTriangle, Scale, Clock,
  Users, FileText, Bell, Shield,
  Save, RefreshCw, CheckCircle,
  TrendingUp, AlertCircle
} from 'lucide-react';

const SettingsDiscipline = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [disciplineSettings, setDisciplineSettings] = useState({
    caseManagement: {
      autoAssignCases: true,
      requireApproval: true,
      escalationThreshold: 3,
      autoEscalate: true,
      caseRetentionDays: 365
    },
    severityLevels: {
      high: { daysToResolve: 3, requireHearing: true, notifyPrincipal: true },
      medium: { daysToResolve: 7, requireHearing: false, notifyPrincipal: false },
      low: { daysToResolve: 14, requireHearing: false, notifyPrincipal: false }
    },
    suspensions: {
      maxInSchoolDays: 10,
      maxOutSchoolDays: 20,
      requireBoardReview: true,
      appealWindowDays: 5,
      automaticNotification: true
    },
    appeals: {
      reviewDays: 7,
      requireHearing: true,
      allowStudentRepresentation: true,
      decisionTimeoutDays: 3
    },
    notifications: {
      notifyParents: true,
      notifyTeachers: true,
      notifyPrincipal: true,
      notifyCounselors: true
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
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discipline Settings</h1>
          <p className="text-gray-600 mt-1">Configure disciplinary policies and procedures</p>
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
              Discipline settings saved
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Management Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Case Management</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Auto-assign Cases</span>
                <p className="text-xs text-gray-500">Automatically assign cases to available staff</p>
              </div>
              <input
                type="checkbox"
                checked={disciplineSettings.caseManagement.autoAssignCases}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  caseManagement: {...disciplineSettings.caseManagement, autoAssignCases: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Require Approval</span>
                <p className="text-xs text-gray-500">Require approval before case resolution</p>
              </div>
              <input
                type="checkbox"
                checked={disciplineSettings.caseManagement.requireApproval}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  caseManagement: {...disciplineSettings.caseManagement, requireApproval: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Auto-escalate Cases</span>
                <p className="text-xs text-gray-500">Escalate unresolved cases after threshold</p>
              </div>
              <input
                type="checkbox"
                checked={disciplineSettings.caseManagement.autoEscalate}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  caseManagement: {...disciplineSettings.caseManagement, autoEscalate: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escalation Threshold (days)</label>
              <input
                type="number"
                value={disciplineSettings.caseManagement.escalationThreshold}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  caseManagement: {...disciplineSettings.caseManagement, escalationThreshold: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Retention (days)</label>
              <input
                type="number"
                value={disciplineSettings.caseManagement.caseRetentionDays}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  caseManagement: {...disciplineSettings.caseManagement, caseRetentionDays: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="30"
                max="730"
              />
            </div>
          </div>
        </div>

        {/* Severity Levels */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Severity Levels</h2>
          </div>
          
          <div className="space-y-6">
            {/* High Severity */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-semibold text-red-800 mb-3">High Severity</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days to Resolve</label>
                  <input
                    type="number"
                    value={disciplineSettings.severityLevels.high.daysToResolve}
                    onChange={(e) => setDisciplineSettings({
                      ...disciplineSettings,
                      severityLevels: {
                        ...disciplineSettings.severityLevels,
                        high: {...disciplineSettings.severityLevels.high, daysToResolve: parseInt(e.target.value)}
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="1"
                    max="10"
                  />
                </div>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Require Hearing</span>
                  <input
                    type="checkbox"
                    checked={disciplineSettings.severityLevels.high.requireHearing}
                    onChange={(e) => setDisciplineSettings({
                      ...disciplineSettings,
                      severityLevels: {
                        ...disciplineSettings.severityLevels,
                        high: {...disciplineSettings.severityLevels.high, requireHearing: e.target.checked}
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Notify Principal</span>
                  <input
                    type="checkbox"
                    checked={disciplineSettings.severityLevels.high.notifyPrincipal}
                    onChange={(e) => setDisciplineSettings({
                      ...disciplineSettings,
                      severityLevels: {
                        ...disciplineSettings.severityLevels,
                        high: {...disciplineSettings.severityLevels.high, notifyPrincipal: e.target.checked}
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Medium Severity */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h3 className="font-semibold text-yellow-800 mb-3">Medium Severity</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days to Resolve</label>
                  <input
                    type="number"
                    value={disciplineSettings.severityLevels.medium.daysToResolve}
                    onChange={(e) => setDisciplineSettings({
                      ...disciplineSettings,
                      severityLevels: {
                        ...disciplineSettings.severityLevels,
                        medium: {...disciplineSettings.severityLevels.medium, daysToResolve: parseInt(e.target.value)}
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="1"
                    max="20"
                  />
                </div>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Require Hearing</span>
                  <input
                    type="checkbox"
                    checked={disciplineSettings.severityLevels.medium.requireHearing}
                    onChange={(e) => setDisciplineSettings({
                      ...disciplineSettings,
                      severityLevels: {
                        ...disciplineSettings.severityLevels,
                        medium: {...disciplineSettings.severityLevels.medium, requireHearing: e.target.checked}
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Low Severity */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-3">Low Severity</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days to Resolve</label>
                <input
                  type="number"
                  value={disciplineSettings.severityLevels.low.daysToResolve}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    severityLevels: {
                      ...disciplineSettings.severityLevels,
                      low: {...disciplineSettings.severityLevels.low, daysToResolve: parseInt(e.target.value)}
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Suspension Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Gavel size={20} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Suspension Policies</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max In-School Suspension (days)</label>
              <input
                type="number"
                value={disciplineSettings.suspensions.maxInSchoolDays}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  suspensions: {...disciplineSettings.suspensions, maxInSchoolDays: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Out-of-School Suspension (days)</label>
              <input
                type="number"
                value={disciplineSettings.suspensions.maxOutSchoolDays}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  suspensions: {...disciplineSettings.suspensions, maxOutSchoolDays: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="30"
              />
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Require Board Review</span>
                <p className="text-xs text-gray-500">Review by discipline board required</p>
              </div>
              <input
                type="checkbox"
                checked={disciplineSettings.suspensions.requireBoardReview}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  suspensions: {...disciplineSettings.suspensions, requireBoardReview: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Window (days)</label>
              <input
                type="number"
                value={disciplineSettings.suspensions.appealWindowDays}
                onChange={(e) => setDisciplineSettings({
                  ...disciplineSettings,
                  suspensions: {...disciplineSettings.suspensions, appealWindowDays: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="14"
              />
            </div>
          </div>
        </div>

        {/* Appeals & Notifications */}
        <div className="space-y-6">
          {/* Appeals Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale size={20} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Appeals Process</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Period (days)</label>
                <input
                  type="number"
                  value={disciplineSettings.appeals.reviewDays}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    appeals: {...disciplineSettings.appeals, reviewDays: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="1"
                  max="30"
                />
              </div>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Require Hearing</span>
                  <p className="text-xs text-gray-500">Mandatory hearing for appeals</p>
                </div>
                <input
                  type="checkbox"
                  checked={disciplineSettings.appeals.requireHearing}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    appeals: {...disciplineSettings.appeals, requireHearing: e.target.checked}
                  })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Decision Timeout (days)</label>
                <input
                  type="number"
                  value={disciplineSettings.appeals.decisionTimeoutDays}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    appeals: {...disciplineSettings.appeals, decisionTimeoutDays: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="1"
                  max="14"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell size={20} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Notification Recipients</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Notify Parents</span>
                <input
                  type="checkbox"
                  checked={disciplineSettings.notifications.notifyParents}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    notifications: {...disciplineSettings.notifications, notifyParents: e.target.checked}
                  })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Notify Teachers</span>
                <input
                  type="checkbox"
                  checked={disciplineSettings.notifications.notifyTeachers}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    notifications: {...disciplineSettings.notifications, notifyTeachers: e.target.checked}
                  })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Notify Principal</span>
                <input
                  type="checkbox"
                  checked={disciplineSettings.notifications.notifyPrincipal}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    notifications: {...disciplineSettings.notifications, notifyPrincipal: e.target.checked}
                  })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Notify Counselors</span>
                <input
                  type="checkbox"
                  checked={disciplineSettings.notifications.notifyCounselors}
                  onChange={(e) => setDisciplineSettings({
                    ...disciplineSettings,
                    notifications: {...disciplineSettings.notifications, notifyCounselors: e.target.checked}
                  })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Current Policy Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Case Resolution Targets</p>
            <p className="font-medium text-gray-800">High: 3 days | Medium: 7 days | Low: 14 days</p>
          </div>
          <div>
            <p className="text-gray-600">Suspension Limits</p>
            <p className="font-medium text-gray-800">In-School: 10 days | Out-of-School: 20 days</p>
          </div>
          <div>
            <p className="text-gray-600">Appeal Timeline</p>
            <p className="font-medium text-gray-800">Review: 7 days | Decision: 3 days</p>
          </div>
          <div>
            <p className="text-gray-600">Case Retention</p>
            <p className="font-medium text-gray-800">{disciplineSettings.caseManagement.caseRetentionDays} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDiscipline;