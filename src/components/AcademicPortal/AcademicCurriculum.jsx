import React, { useState } from 'react';
import {
  BookOpen, Plus, Edit2, Trash2, Eye, Search,
  Filter, Download, ChevronDown, ChevronRight,
  Layers, FileText, CheckCircle, AlertCircle,
  Clock, Users, Award, Calendar
} from 'lucide-react';

const AcademicCurriculum = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [expandedSections, setExpandedSections] = useState({});

  // Curriculum Structure Data
  const curriculumStructure = [
    {
      id: 1,
      grade: 'Grade 9',
      subjects: [
        { name: 'Mathematics', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'English', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'Science', hours: 4, compulsory: true, credits: 1.0 },
        { name: 'Social Studies', hours: 3, compulsory: true, credits: 0.5 },
        { name: 'Physical Education', hours: 2, compulsory: true, credits: 0.5 },
        { name: 'Art', hours: 2, compulsory: false, credits: 0.5 }
      ]
    },
    {
      id: 2,
      grade: 'Grade 10',
      subjects: [
        { name: 'Mathematics', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'English', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'Physics', hours: 4, compulsory: true, credits: 1.0 },
        { name: 'Chemistry', hours: 4, compulsory: true, credits: 1.0 },
        { name: 'History', hours: 3, compulsory: true, credits: 0.5 },
        { name: 'Computer Science', hours: 3, compulsory: false, credits: 0.5 }
      ]
    },
    {
      id: 3,
      grade: 'Grade 11',
      subjects: [
        { name: 'Advanced Mathematics', hours: 6, compulsory: true, credits: 1.0 },
        { name: 'English Literature', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'Physics', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Chemistry', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Biology', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Economics', hours: 4, compulsory: false, credits: 0.5 }
      ]
    },
    {
      id: 4,
      grade: 'Grade 12',
      subjects: [
        { name: 'Advanced Mathematics', hours: 6, compulsory: true, credits: 1.0 },
        { name: 'English Literature', hours: 5, compulsory: true, credits: 1.0 },
        { name: 'Physics', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Chemistry', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Biology', hours: 5, compulsory: false, credits: 1.0 },
        { name: 'Business Studies', hours: 4, compulsory: false, credits: 0.5 }
      ]
    }
  ];

  // Learning Outcomes Data
  const learningOutcomes = [
    {
      subject: 'Mathematics',
      outcomes: [
        'Apply mathematical concepts to real-world problems',
        'Demonstrate proficiency in algebra and calculus',
        'Analyze data using statistical methods'
      ]
    },
    {
      subject: 'Science',
      outcomes: [
        'Conduct scientific investigations',
        'Understand scientific principles and theories',
        'Apply critical thinking to scientific problems'
      ]
    }
  ];

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const tabs = [
    { id: 'structure', name: 'Curriculum Structure', icon: <Layers size={16} /> },
    { id: 'standards', name: 'Standards Alignment', icon: <Award size={16} /> },
    { id: 'outcomes', name: 'Learning Outcomes', icon: <FileText size={16} /> },
    { id: 'mapping', name: 'Subject Mapping', icon: <BookOpen size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Curriculum Management</h1>
          <p className="text-gray-600 mt-1">Manage academic curriculum, standards, and learning outcomes</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Curriculum</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Plus size={18} />
            <span>New Subject</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-800">86</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compulsory Subjects</p>
              <p className="text-2xl font-bold text-green-600">42</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Electives</p>
              <p className="text-2xl font-bold text-orange-600">44</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertCircle size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Grades</p>
              <p className="text-2xl font-bold text-purple-600">4</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Curriculum Structure Tab */}
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search subjects..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Grades</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  Export Structure
                </button>
              </div>

              {curriculumStructure.map((grade) => (
                <div key={grade.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(grade.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <GraduationCap size={18} className="text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{grade.grade}</h3>
                      <span className="text-sm text-gray-500">{grade.subjects.length} subjects</span>
                    </div>
                    {expandedSections[grade.id] ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSections[grade.id] && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours/Week</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {grade.subjects.map((subject, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-800">{subject.name}</td>
                              <td className="px-4 py-3 text-gray-600">{subject.hours} hours</td>
                              <td className="px-4 py-3 text-gray-600">{subject.credits}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  subject.compulsory ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {subject.compulsory ? 'Compulsory' : 'Elective'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                                    <Eye size={16} className="text-gray-600" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                                    <Edit2 size={16} className="text-gray-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Learning Outcomes Tab */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6">
              {learningOutcomes.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">{item.subject}</h3>
                  <ul className="space-y-2">
                    {item.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">
                    + Add Outcome
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Standards Alignment Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <Award size={48} className="mx-auto text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">Curriculum Standards Alignment</h3>
                <p className="text-gray-600 mt-2">All curriculum aligned with national education standards</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-gray-500">Common Core Aligned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">100%</p>
                    <p className="text-xs text-gray-500">State Standards</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subject Mapping Tab */}
          {activeTab === 'mapping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Core Subjects</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
                  <p className="text-sm text-gray-500">Mathematics, Science, English, etc.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Electives</h3>
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-sm text-gray-500">Arts, Music, Computer Science, etc.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">AP Courses</h3>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-500">Advanced Placement courses</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicCurriculum;