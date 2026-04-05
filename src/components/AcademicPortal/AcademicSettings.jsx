import React, { useState } from 'react';
import {
  Settings, User, Bell, Shield, Globe,
  Save, Key, RefreshCw, CheckCircle,
  GraduationCap, BookOpen, Calendar,
  Clock, Users, Award, FileText
} from 'lucide-react';

const AcademicSettings = () => {
  const [activeTab, setActiveTab] = useState('academic');
  const [saveStatus, setSaveStatus] = useState(null);

  const [settings, setSettings] = useState({
    academic: {
      currentYear: '2023-2024',
      currentSemester: 'Spring',
      gradingSystem: 'Letter Grade',
      passGrade: 'D',
      attendanceThreshold: 90,
      allowGradeAppeals: true
    },
    grading: {
      scale: '4.0',
      aRange: '90-100',
      bRange: '80-89',
      cRange: '70-79',
      dRange: '60-69',
      fRange: '0-59'
    },
    exam: {
      examWeight: 60,
      assignmentWeight: 20,
      quizWeight: 10,
      attendanceWeight: 10,
      autoPublishResults: false,
      resultApprovalRequired: true
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      examReminders: true,
      resultNotifications: true
    }
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'academic', name: 'Academic Settings', icon: <GraduationCap size={16} /> },
    { id: 'grading', name: 'Grading System', icon: <Award size={16} /> },
    { id: 'exam', name: 'Exam Settings', icon: <FileText size={16} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={16} /> },
    { id: 'preferences', name: 'Preferences', icon: <Globe size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Academic Settings</h1>
          <p className="text-gray-600 mt-1">Configure academic policies and system preferences</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Academic Settings Tab */}
          {activeTab === 'academic' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <select
                  value={settings.academic.currentYear}
                  onChange={(e) => setSettings({
                    ...settings,
                    academic: { ...settings.academic, currentYear: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>2023-2024</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                <select
                  value={settings.academic.currentSemester}
                  onChange={(e) => setSettings({
                    ...settings,
                    academic: { ...settings.academic, currentSemester: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>Fall</option>
                  <option>Spring</option>
                  <option>Summer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grading System</label>
                <select
                  value={settings.academic.gradingSystem}
                  onChange={(e) => setSettings({
                    ...settings,
                    academic: { ...settings.academic, gradingSystem: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>Letter Grade (A-F)</option>
                  <option>Percentage</option>
                  <option>GPA (4.0 Scale)</option>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.academic.allowGradeAppeals}
                    onChange={(e) => setSettings({
                      ...settings,
                      academic: { ...settings.academic, allowGradeAppeals: e.target.checked }
                    })}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow Grade Appeals</span>
                </label>
              </div>
            </div>
          )}

          {/* Grading System Tab */}
          {activeTab === 'grading' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA Scale</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>4.0 Scale</option>
                  <option>5.0 Scale</option>
                  <option>10.0 Scale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">A Grade Range</label>
                <input type="text" value="90-100" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">B Grade Range</label>
                <input type="text" value="80-89" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">C Grade Range</label>
                <input type="text" value="70-79" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">D Grade Range</label>
                <input type="text" value="60-69" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">F Grade Range</label>
                <input type="text" value="0-59" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
          )}

          {/* Exam Settings Tab */}
          {activeTab === 'exam' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Weight (%)</label>
                  <input type="number" value={settings.exam.examWeight} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Weight (%)</label>
                  <input type="number" value={settings.exam.assignmentWeight} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Weight (%)</label>
                  <input type="number" value={settings.exam.quizWeight} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Weight (%)</label>
                  <input type="number" value={settings.exam.attendanceWeight} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={settings.exam.autoPublishResults} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Auto-publish results</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={settings.exam.resultApprovalRequired} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Require approval before publishing</span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email Alerts</span>
                  <p className="text-xs text-gray-500">Receive email notifications</p>
                </div>
                <input type="checkbox" checked={settings.notifications.emailAlerts} className="w-5 h-5 text-green-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                  <p className="text-xs text-gray-500">Receive SMS notifications</p>
                </div>
                <input type="checkbox" checked={settings.notifications.smsAlerts} className="w-5 h-5 text-green-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Exam Reminders</span>
                  <p className="text-xs text-gray-500">Get reminders before exams</p>
                </div>
                <input type="checkbox" checked={settings.notifications.examReminders} className="w-5 h-5 text-green-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Result Notifications</span>
                  <p className="text-xs text-gray-500">Get notified when results are published</p>
                </div>
                <input type="checkbox" checked={settings.notifications.resultNotifications} className="w-5 h-5 text-green-600 rounded" />
              </label>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Eastern Time</option>
                  <option>Central Time</option>
                  <option>Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicSettings;