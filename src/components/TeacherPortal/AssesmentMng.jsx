/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, X, Trash2, Edit2, Eye, Target, BookOpen,
  Layers, ChevronDown, ChevronRight, AlertCircle, CheckCircle,
  Loader2, RefreshCw, FileText, Clock, Calendar, Users, Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles[type]} border p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

function AssessmentBuilder() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [curriculum, setCurriculum] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStrand, setSelectedStrand] = useState('');
  const [selectedSubStrand, setSelectedSubStrand] = useState('');
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [assessment, setAssessment] = useState({
    title: '',
    type: 'sba',
    class_id: '',
    subject: '',
    date: '',
    duration: 60,
    total_marks: 50,
    description: '',
    learning_outcomes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [expandedStrands, setExpandedStrands] = useState({});

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access assessment builder');
      return;
    }
    fetchCurriculum();
  }, [isAuthenticated]);

  const fetchCurriculum = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/curriculum/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setCurriculum(data.data);
      } else {
        // Mock curriculum data
        setCurriculum([
          {
            gradeId: 'g7',
            name: 'Grade 7',
            subjects: [
              {
                id: 1,
                name: 'Mathematics',
                code: 'MATH',
                strands: [
                  {
                    id: 101,
                    name: 'Numbers',
                    subStrands: [
                      { id: 1001, name: 'Integers', outcomes: ['Identify positive and negative integers', 'Perform operations with integers'] },
                      { id: 1002, name: 'Fractions', outcomes: ['Simplify fractions', 'Add and subtract fractions'] }
                    ]
                  },
                  {
                    id: 102,
                    name: 'Algebra',
                    subStrands: [
                      { id: 1003, name: 'Linear Equations', outcomes: ['Solve linear equations', 'Formulate equations from word problems'] }
                    ]
                  }
                ]
              },
              {
                id: 2,
                name: 'Integrated Science',
                code: 'SCI',
                strands: [
                  {
                    id: 201,
                    name: 'Human Health',
                    subStrands: [
                      { id: 2001, name: 'Respiratory System', outcomes: ['Identify parts of the respiratory system', 'Explain the breathing process'] }
                    ]
                  }
                ]
              }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching curriculum:', error);
      addNotification('error', 'Failed to load curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStrandExpanded = (strandId) => {
    setExpandedStrands(prev => ({ ...prev, [strandId]: !prev[strandId] }));
  };

  const toggleOutcomeSelection = (outcome) => {
    if (selectedOutcomes.includes(outcome)) {
      setSelectedOutcomes(selectedOutcomes.filter(o => o !== outcome));
    } else {
      setSelectedOutcomes([...selectedOutcomes, outcome]);
    }
  };

  const saveAssessment = async () => {
    if (!assessment.title || !assessment.subject) {
      addNotification('warning', 'Please fill in all required fields');
      return;
    }

    assessment.learning_outcomes = selectedOutcomes;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/assessments/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assessment)
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Assessment created successfully');
        // Reset form
        setAssessment({
          title: '',
          type: 'sba',
          class_id: '',
          subject: '',
          date: '',
          duration: 60,
          total_marks: 50,
          description: '',
          learning_outcomes: []
        });
        setSelectedOutcomes([]);
        setSelectedSubject('');
        setSelectedStrand('');
        setSelectedSubStrand('');
      } else {
        addNotification('error', data.error || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      addNotification('error', 'Failed to save assessment');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access assessment builder</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const currentGradeData = curriculum.find(g => g.gradeId === selectedGrade);
  const subjects = currentGradeData?.subjects || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className=" mx-auto">
          <h1 className="text-2xl font-bold text-white">Assessment Builder</h1>
          <p className="text-blue-100 mt-1">Create assessments linked to curriculum learning outcomes</p>
        </div>
      </div>

      <div className="mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assessment Form */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Assessment Details</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Title *</label>
                <input 
                  type="text" 
                  value={assessment.title}
                  onChange={(e) => setAssessment({...assessment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., End of Term Mathematics Examination"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Type</label>
                <select 
                  value={assessment.type}
                  onChange={(e) => setAssessment({...assessment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="sba">School-Based Assessment (SBA) - 40%</option>
                  <option value="summative">Summative Assessment - 60%</option>
                  <option value="cat">Continuous Assessment Test (CAT)</option>
                  <option value="project">Project/Portfolio</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Grade Level *</label>
                <select 
                  value={selectedGrade}
                  onChange={(e) => { setSelectedGrade(e.target.value); setSelectedSubject(''); }}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Grade</option>
                  <option value="g7">Grade 7</option>
                  <option value="g8">Grade 8</option>
                  <option value="g9">Grade 9</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject *</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setAssessment({...assessment, subject: e.target.value}); }}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  disabled={!selectedGrade}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={assessment.date}
                    onChange={(e) => setAssessment({...assessment, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Duration (minutes)</label>
                  <input 
                    type="number" 
                    value={assessment.duration}
                    onChange={(e) => setAssessment({...assessment, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Total Marks</label>
                <input 
                  type="number" 
                  value={assessment.total_marks}
                  onChange={(e) => setAssessment({...assessment, total_marks: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description/Instructions</label>
                <textarea 
                  value={assessment.description}
                  onChange={(e) => setAssessment({...assessment, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="Enter assessment instructions or description..."
                />
              </div>
            </div>
          </div>

          {/* Curriculum Browser */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Link Learning Outcomes</h2>
              <p className="text-xs text-gray-600 mt-0.5">Select outcomes that this assessment measures</p>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                </div>
              ) : !selectedSubject ? (
                <div className="text-center py-8 text-gray-400">
                  Select a subject to view curriculum strands
                </div>
              ) : (
                subjects.filter(s => s.name === selectedSubject).map(subject => (
                  <div key={subject.id}>
                    {subject.strands.map(strand => (
                      <div key={strand.id} className="mb-3 border border-gray-200">
                        <div 
                          className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                          onClick={() => toggleStrandExpanded(strand.id)}
                        >
                          <span className="font-medium text-gray-800">{strand.name}</span>
                          {expandedStrands[strand.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                        {expandedStrands[strand.id] && (
                          <div className="p-3">
                            {strand.subStrands.map(subStrand => (
                              <div key={subStrand.id} className="mb-3">
                                <p className="text-sm font-bold text-gray-700 mb-2">{subStrand.name}</p>
                                <div className="space-y-2 ml-4">
                                  {subStrand.outcomes.map((outcome, idx) => (
                                    <label key={idx} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1">
                                      <input 
                                        type="checkbox" 
                                        checked={selectedOutcomes.includes(outcome)}
                                        onChange={() => toggleOutcomeSelection(outcome)}
                                        className="mt-0.5"
                                      />
                                      <span className="text-sm text-gray-700">{outcome}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Outcomes Summary */}
        {selectedOutcomes.length > 0 && (
          <div className="mt-6 bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Selected Learning Outcomes ({selectedOutcomes.length})</h2>
            </div>
            <div className="p-4">
              <ul className="list-disc list-inside space-y-1">
                {selectedOutcomes.map((outcome, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={saveAssessment} className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800">
            <Save className="h-4 w-4 inline mr-2" />
            Create Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentBuilder;