import React, { useState } from 'react';
import {
  Save, XCircle, User, Calendar, AlertTriangle,
  FileText, Mail, Phone, Upload, Plus
} from 'lucide-react';

const DisciplineNewCase = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    offense: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    severity: 'Medium',
    reportedBy: '',
    evidence: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Case submitted:', formData);
    // Add your submission logic here
    alert('Case created successfully!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">New Discipline Case</h1>
          <p className="text-gray-600 mt-1">Create a new disciplinary case record</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <XCircle size={18} className="text-gray-600" />
            <span>Cancel</span>
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700"
          >
            <Save size={18} />
            <span>Save Case</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Case Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" /> Student Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                placeholder="Enter student's full name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade *</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Grade</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>

            {/* Offense Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle size={16} className="inline mr-1" /> Offense Type *
              </label>
              <select
                name="offense"
                value={formData.offense}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Offense</option>
                <option>Physical Altercation</option>
                <option>Bullying</option>
                <option>Truancy</option>
                <option>Academic Dishonesty</option>
                <option>Disruptive Behavior</option>
                <option>Uniform Violation</option>
                <option>Vandalism</option>
                <option>Cyberbullying</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Low">Low - Minor Infraction</option>
                <option value="Medium">Medium - Moderate Infraction</option>
                <option value="High">High - Serious Infraction</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" /> Incident Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Reported By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-1" /> Reported By *
              </label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                required
                placeholder="Name of reporting staff"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Provide detailed description of the incident..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          {/* Evidence Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload size={16} className="inline mr-1" /> Evidence Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag and drop files here, or click to select</p>
              <p className="text-xs text-gray-400 mt-1">PDF, Images, Documents up to 10MB</p>
              <button type="button" className="mt-3 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Parent/Guardian Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" /> Parent Name
              </label>
              <input
                type="text"
                placeholder="Enter parent/guardian name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" /> Email
              </label>
              <input
                type="email"
                placeholder="parent@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234-567-8900"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button type="button" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            Save as Draft
          </button>
          <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Create Case
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisciplineNewCase;