import React, { useState } from 'react';
import {
  Globe, Moon, Sun, Monitor, Calendar,
  Clock, Save, RefreshCw, CheckCircle,
  Languages, Type, Layout, Eye
} from 'lucide-react';

const SettingsPreferences = () => {
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [preferences, setPreferences] = useState({
    appearance: {
      theme: 'light',
      compactMode: false,
      sidebarCollapsed: false,
      animations: true
    },
    language: {
      primary: 'English',
      secondary: 'Spanish',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      timezone: 'America/New_York'
    },
    display: {
      itemsPerPage: 25,
      defaultView: 'grid',
      showThumbnails: true,
      denseMode: false
    },
    accessibility: {
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false
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
          <h1 className="text-3xl font-bold text-gray-800">Preferences</h1>
          <p className="text-gray-600 mt-1">Customize your dashboard appearance and behavior</p>
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
              Preferences saved
            </span>
          )}
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Save size={18} />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layout size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPreferences({...preferences, appearance: {...preferences.appearance, theme: 'light'}})}
                  className={`p-3 rounded-lg border-2 transition ${
                    preferences.appearance.theme === 'light' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Sun size={20} className="mx-auto mb-1" />
                  <p className="text-xs">Light</p>
                </button>
                <button
                  onClick={() => setPreferences({...preferences, appearance: {...preferences.appearance, theme: 'dark'}})}
                  className={`p-3 rounded-lg border-2 transition ${
                    preferences.appearance.theme === 'dark' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Moon size={20} className="mx-auto mb-1" />
                  <p className="text-xs">Dark</p>
                </button>
                <button
                  onClick={() => setPreferences({...preferences, appearance: {...preferences.appearance, theme: 'system'}})}
                  className={`p-3 rounded-lg border-2 transition ${
                    preferences.appearance.theme === 'system' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Monitor size={20} className="mx-auto mb-1" />
                  <p className="text-xs">System</p>
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                <p className="text-xs text-gray-500">Reduce spacing and padding</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.appearance.compactMode}
                onChange={(e) => setPreferences({
                  ...preferences,
                  appearance: {...preferences.appearance, compactMode: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Animations</span>
                <p className="text-xs text-gray-500">Enable UI animations and transitions</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.appearance.animations}
                onChange={(e) => setPreferences({
                  ...preferences,
                  appearance: {...preferences.appearance, animations: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Language & Regional Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Language & Region</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
              <select
                value={preferences.language.primary}
                onChange={(e) => setPreferences({
                  ...preferences,
                  language: {...preferences.language, primary: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Language</label>
              <select
                value={preferences.language.secondary}
                onChange={(e) => setPreferences({
                  ...preferences,
                  language: {...preferences.language, secondary: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>None</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={preferences.language.dateFormat}
                onChange={(e) => setPreferences({
                  ...preferences,
                  language: {...preferences.language, dateFormat: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select
                value={preferences.language.timeFormat}
                onChange={(e) => setPreferences({
                  ...preferences,
                  language: {...preferences.language, timeFormat: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>12-hour (12:00 PM)</option>
                <option>24-hour (13:00)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
              <select
                value={preferences.language.timezone}
                onChange={(e) => setPreferences({
                  ...preferences,
                  language: {...preferences.language, timezone: e.target.value}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>America/New_York (EST)</option>
                <option>America/Chicago (CST)</option>
                <option>America/Denver (MST)</option>
                <option>America/Los_Angeles (PST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Display Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
              <select
                value={preferences.display.itemsPerPage}
                onChange={(e) => setPreferences({
                  ...preferences,
                  display: {...preferences.display, itemsPerPage: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default View</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPreferences({
                    ...preferences,
                    display: {...preferences.display, defaultView: 'grid'}
                  })}
                  className={`p-3 rounded-lg border-2 transition ${
                    preferences.display.defaultView === 'grid' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <Layout size={20} className="mx-auto mb-1" />
                  <p className="text-xs">Grid View</p>
                </button>
                <button
                  onClick={() => setPreferences({
                    ...preferences,
                    display: {...preferences.display, defaultView: 'list'}
                  })}
                  className={`p-3 rounded-lg border-2 transition ${
                    preferences.display.defaultView === 'list' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <Type size={20} className="mx-auto mb-1" />
                  <p className="text-xs">List View</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye size={20} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Accessibility</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
                <p className="text-xs text-gray-500">Increase color contrast for better visibility</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={(e) => setPreferences({
                  ...preferences,
                  accessibility: {...preferences.accessibility, highContrast: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <div className="flex space-x-2">
                {['small', 'medium', 'large', 'x-large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreferences({
                      ...preferences,
                      accessibility: {...preferences.accessibility, fontSize: size}
                    })}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      preferences.accessibility.fontSize === size 
                        ? 'border-purple-500 bg-purple-50 text-purple-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs capitalize">{size}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Reduced Motion</span>
                <p className="text-xs text-gray-500">Minimize animations and transitions</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.accessibility.reducedMotion}
                onChange={(e) => setPreferences({
                  ...preferences,
                  accessibility: {...preferences.accessibility, reducedMotion: e.target.checked}
                })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium">Card Preview</p>
            <p className="text-xs text-gray-500 mt-1">Sample card with your settings</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium">List Item Preview</p>
            <p className="text-xs text-gray-500 mt-1">Sample list item appearance</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium">Table Preview</p>
            <p className="text-xs text-gray-500 mt-1">Sample table with current density</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPreferences;