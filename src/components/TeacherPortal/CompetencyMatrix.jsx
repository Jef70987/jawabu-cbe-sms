/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Target, Users, RefreshCw, Download, Upload, FileText,
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Grid, List, Eye, Edit2, Link2, Camera, FileImage,
  CheckCircle, XCircle, AlertCircle, Loader2,
  TrendingUp, BarChart3, PieChart, Activity,
  Award, Star, Trophy, Zap, Flame, Shield,
  UserCheck, BookOpen, GraduationCap, Settings,
  Printer, Share2, Mail, Phone, MapPin, Calendar,
  Clock, ArrowUpDown, Maximize2, Minimize2
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// The 7 Core Competencies (KICD 2026)
const CORE_COMPETENCIES = [
  { id: 'comm_collab', name: 'Communication and Collaboration', code: 'CC', description: 'Express ideas clearly and work effectively with others' },
  { id: 'self_efficacy', name: 'Self-efficacy', code: 'SE', description: 'Belief in own abilities and capacity to achieve goals' },
  { id: 'critical_thinking', name: 'Critical Thinking and Problem Solving', code: 'CT', description: 'Analyze situations and develop effective solutions' },
  { id: 'creativity', name: 'Creativity and Imagination', code: 'CI', description: 'Generate innovative ideas and think outside the box' },
  { id: 'citizenship', name: 'Citizenship', code: 'CZ', description: 'Demonstrate national values and global awareness' },
  { id: 'digital_literacy', name: 'Digital Literacy', code: 'DL', description: 'Use technology effectively and responsibly' },
  { id: 'learning_to_learn', name: 'Learning to Learn', code: 'LL', description: 'Take ownership of personal learning journey' }
];

// PCI (Pertinent & Contemporary Issues)
const PCI_ISSUES = [
  { id: 'environment', name: 'Environmental Education', code: 'ENV' },
  { id: 'financial', name: 'Financial Literacy', code: 'FIN' },
  { id: 'health', name: 'Health Education', code: 'HLT' },
  { id: 'peace', name: 'Peace Education', code: 'PCE' },
  { id: 'gender', name: 'Gender Issues', code: 'GDR' },
  { id: 'child_rights', name: 'Child Rights', code: 'CHR' }
];

// Competency Level Definitions (1-5 scale)
const COMPETENCY_LEVELS = [
  { level: 5, label: 'EE', name: 'Exceeding Expectations', color: 'bg-green-600', textColor: 'text-green-800', bgColor: 'bg-green-100', borderColor: 'border-green-300', score: 90 },
  { level: 4, label: 'ME', name: 'Meeting Expectations', color: 'bg-blue-600', textColor: 'text-blue-800', bgColor: 'bg-blue-100', borderColor: 'border-blue-300', score: 75 },
  { level: 3, label: 'AE', name: 'Approaching Expectations', color: 'bg-yellow-600', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300', score: 60 },
  { level: 2, label: 'BE', name: 'Below Expectations', color: 'bg-orange-600', textColor: 'text-orange-800', bgColor: 'bg-orange-100', borderColor: 'border-orange-300', score: 40 },
  { level: 1, label: 'WB', name: 'Well Below Expectations', color: 'bg-red-600', textColor: 'text-red-800', bgColor: 'bg-red-100', borderColor: 'border-red-300', score: 20 }
];

// Get competency level from score
const getCompetencyLevel = (score) => {
  if (score === null || score === undefined) return null;
  if (score >= 90) return COMPETENCY_LEVELS[0];
  if (score >= 75) return COMPETENCY_LEVELS[1];
  if (score >= 60) return COMPETENCY_LEVELS[2];
  if (score >= 40) return COMPETENCY_LEVELS[3];
  return COMPETENCY_LEVELS[4];
};

// Toast Notification
const Toast = ({ type, message, onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getStyles()} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => onClose?.()} className="ml-4 text-white/80 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ButtonSpinner = () => <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />;

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
      <Loader2 className="h-10 w-10 text-green-700 animate-spin mb-3" />
      <p className="text-gray-700 font-medium">Loading competency data...</p>
    </div>
  </div>
);

// Evidence Modal
const EvidenceModal = ({ isOpen, onClose, student, competency, evidence, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    evidenceType: 'observation',
    date: new Date().toISOString().split('T')[0],
    file: null,
    notes: ''
  });

  useEffect(() => {
    if (evidence) {
      setFormData({
        description: evidence.description || '',
        evidenceType: evidence.evidenceType || 'observation',
        date: evidence.date || new Date().toISOString().split('T')[0],
        file: null,
        notes: evidence.notes || ''
      });
    }
  }, [evidence]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Link Evidence</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Student</label>
            <p className="text-gray-900 font-medium">{student?.first_name} {student?.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Competency</label>
            <p className="text-gray-900 font-medium">{competency?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Describe the evidence (e.g., 'Student led group discussion on environmental conservation')"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Type</label>
            <select
              value={formData.evidenceType}
              onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            >
              <option value="observation">Classroom Observation</option>
              <option value="project">Project Work</option>
              <option value="portfolio">Portfolio Entry</option>
              <option value="presentation">Presentation</option>
              <option value="test">Assessment Result</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload File (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              className="w-full text-sm"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teacher Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Additional observations or comments..."
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium">
            <Link2 className="h-4 w-4 inline mr-1" /> Link Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

// Heatmap Cell Component
const HeatmapCell = ({ student, competency, level, onClick, onEvidenceClick, evidenceCount, isClassTeacher }) => {
  const getCellColor = () => {
    if (!level) return 'bg-gray-100';
    switch (level.level) {
      case 5: return 'bg-green-500 hover:bg-green-600';
      case 4: return 'bg-blue-500 hover:bg-blue-600';
      case 3: return 'bg-yellow-500 hover:bg-yellow-600';
      case 2: return 'bg-orange-500 hover:bg-orange-600';
      case 1: return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-lg transition-all duration-200 ${getCellColor()} flex flex-col items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105`}
      >
        {level ? (
          <>
            <span className="text-white font-bold text-sm">{level.label}</span>
            <span className="text-white text-xs opacity-80">{level.level}</span>
          </>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </button>
      {evidenceCount > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onEvidenceClick(); }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center shadow-md hover:bg-purple-600"
          title={`${evidenceCount} evidence item(s)`}
        >
          <Link2 className="h-3 w-3" />
        </button>
      )}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          {student.first_name} {student.last_name}<br />
          {level ? `${level.name} (${level.label})` : 'Not assessed'}
          {evidenceCount > 0 && ` • ${evidenceCount} evidence(s)`}
        </div>
      </div>
    </div>
  );
};

// Individual Student Radar Chart Component
const StudentRadarChart = ({ student, competencies }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAverageScore = () => {
    let total = 0;
    let count = 0;
    CORE_COMPETENCIES.forEach(comp => {
      const score = competencies[comp.id]?.score;
      if (score) {
        total += score;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  };

  const getStrengthAreas = () => {
    const strengths = [];
    CORE_COMPETENCIES.forEach(comp => {
      const level = competencies[comp.id]?.level;
      if (level >= 4) {
        strengths.push(comp.name);
      }
    });
    return strengths;
  };

  const getWeaknessAreas = () => {
    const weaknesses = [];
    CORE_COMPETENCIES.forEach(comp => {
      const level = competencies[comp.id]?.level;
      if (level <= 2 && level) {
        weaknesses.push(comp.name);
      }
    });
    return weaknesses;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{student.first_name} {student.last_name}</h3>
          <p className="text-xs text-gray-500">Assessment No: {student.assessment_number || student.admission_no}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-700">{getAverageScore()}%</div>
          <div className="text-xs text-gray-500">Overall Competency</div>
        </div>
      </div>

      {/* Simplified Radar/Bar Chart for Competencies */}
      <div className="space-y-3 mb-4">
        {CORE_COMPETENCIES.map(comp => {
          const level = competencies[comp.id]?.level;
          const score = competencies[comp.id]?.score || 0;
          const levelInfo = getCompetencyLevel(score);
          return (
            <div key={comp.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700">{comp.name}</span>
                <span className={`font-medium ${levelInfo?.textColor}`}>
                  {levelInfo?.label} ({levelInfo?.level})
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`${levelInfo?.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
      >
        {showDetails ? 'Show Less' : 'Show Detailed Analysis'}
      </button>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {getStrengthAreas().length > 0 && (
            <div>
              <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Strength Areas
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                {getStrengthAreas().map(area => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          {getWeaknessAreas().length > 0 && (
            <div>
              <p className="text-xs font-bold text-orange-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Areas for Improvement
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                {getWeaknessAreas().map(area => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-gray-700">Suggested Interventions:</p>
            <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
              {getWeaknessAreas().map(area => (
                <li key={area}>Provide additional activities focusing on {area.toLowerCase()}</li>
              ))}
              {getWeaknessAreas().length === 0 && (
                <li>Continue challenging the student with extension activities</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// PCI Tracker Component
const PCITracker = ({ student, pciScores, onUpdate }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Shield className="h-4 w-4 text-purple-600" />
        PCI Tracker (Pertinent & Contemporary Issues)
      </h4>
      <div className="space-y-2">
        {PCI_ISSUES.map(issue => (
          <div key={issue.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{issue.name}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => onUpdate(issue.id, level)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                    pciScores?.[issue.id] === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function CompetencyMatrix() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  
  // State
  const [viewMode, setViewMode] = useState('heatmap'); // heatmap, student_detail, subject_matrix
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [competencyData, setCompetencyData] = useState({});
  const [evidenceData, setEvidenceData] = useState({});
  const [pciData, setPciData] = useState({});
  const [loading, setLoading] = useState({ classes: true, students: true, data: true });
  const [toasts, setToasts] = useState([]);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [selectedStudentForEvidence, setSelectedStudentForEvidence] = useState(null);
  const [filterCompetency, setFilterCompetency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClassTeacher, setIsClassTeacher] = useState(true); // Determines edit permissions

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('error', 'Please login to access competency matrix');
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading({ classes: true, students: true, data: true });
    try {
      await Promise.all([
        fetchClasses(),
        fetchSubjects(),
        fetchCompetencyData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load competency data');
    } finally {
      setLoading({ classes: false, students: false, data: false });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-classes/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
        if (data.data.length > 0 && !selectedClass) {
          setSelectedClass(data.data[0]);
          await fetchClassStudents(data.data[0].id);
        }
      } else {
        const mockClasses = [
          { id: 1, class_name: 'Grade 7A', stream: 'A', students: 42, grade: 7, isClassTeacher: true },
          { id: 2, class_name: 'Grade 7B', stream: 'B', students: 40, grade: 7, isClassTeacher: false },
          { id: 3, class_name: 'Grade 8A', stream: 'A', students: 44, grade: 8, isClassTeacher: true }
        ];
        setClasses(mockClasses);
        setSelectedClass(mockClasses[0]);
        setIsClassTeacher(mockClasses[0].isClassTeacher);
        await fetchClassStudents(mockClasses[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/my-subjects/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
        if (data.data.length > 0 && !selectedSubject) {
          setSelectedSubject(data.data[0]);
        }
      } else {
        const mockSubjects = [
          { id: 1, name: 'Mathematics', code: 'MAT' },
          { id: 2, name: 'English', code: 'ENG' },
          { id: 3, name: 'Integrated Science', code: 'SCI' }
        ];
        setSubjects(mockSubjects);
        setSelectedSubject(mockSubjects[0]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchClassStudents = async (classId) => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/class-students/${classId}/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        const mockStudents = Array.from({ length: 42 }, (_, i) => ({
          id: i + 1,
          admission_no: `JSS7${String(i + 1).padStart(3, '0')}`,
          assessment_number: `KNEC${String(i + 1).padStart(8, '0')}`,
          first_name: ['James', 'Mary', 'Peter', 'Grace', 'John', 'Jane', 'Michael', 'Sarah', 'David', 'Esther'][i % 10],
          last_name: ['Mwangi', 'Wanjiku', 'Omondi', 'Njeri', 'Kipchoge', 'Akinyi', 'Otieno', 'Chebet', 'Kamau', 'Wambui'][i % 10],
          gender: i % 2 === 0 ? 'M' : 'F'
        }));
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchCompetencyData = async () => {
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency-matrix/?class=${selectedClass?.id}&subject=${selectedSubject?.id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setCompetencyData(data.competencies);
        setEvidenceData(data.evidence);
        setPciData(data.pci);
      } else {
        // Mock competency data
        const mockCompetencyData = {};
        const mockEvidenceData = {};
        students.forEach(student => {
          mockCompetencyData[student.id] = {};
          CORE_COMPETENCIES.forEach(comp => {
            const score = Math.floor(Math.random() * 100);
            mockCompetencyData[student.id][comp.id] = {
              score,
              level: getCompetencyLevel(score),
              lastUpdated: new Date().toISOString(),
              updatedBy: 'Teacher'
            };
          });
          // Random evidence
          if (Math.random() > 0.7) {
            mockEvidenceData[student.id] = {
              [CORE_COMPETENCIES[Math.floor(Math.random() * CORE_COMPETENCIES.length)].id]: [
                { id: 1, description: 'Demonstrated excellent collaboration during group project', date: '2024-03-15', type: 'observation' }
              ]
            };
          }
        });
        setCompetencyData(mockCompetencyData);
        setEvidenceData(mockEvidenceData);
      }
    } catch (error) {
      console.error('Error fetching competency data:', error);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  const handleCompetencyUpdate = async (studentId, competencyId, level) => {
    if (!isClassTeacher && viewMode !== 'subject_matrix') {
      addToast('warning', 'You can only update competencies for your subject areas');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency-matrix/update/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          studentId,
          competencyId,
          level: level.level,
          score: level.score,
          subjectId: viewMode === 'subject_matrix' ? selectedSubject?.id : null
        })
      });
      const data = await response.json();
      if (data.success) {
        setCompetencyData(prev => ({
          ...prev,
          [studentId]: {
            ...prev[studentId],
            [competencyId]: {
              score: level.score,
              level,
              lastUpdated: new Date().toISOString(),
              updatedBy: user?.first_name
            }
          }
        }));
        addToast('success', `Updated ${CORE_COMPETENCIES.find(c => c.id === competencyId)?.name} competency`);
      } else {
        addToast('error', data.error || 'Failed to update competency');
      }
    } catch (error) {
      console.error('Error updating competency:', error);
      addToast('error', 'Failed to update competency');
    }
  };

  const handleEvidenceSave = async (evidence) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency-matrix/evidence/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          studentId: selectedStudentForEvidence?.id,
          competencyId: selectedCompetency?.id,
          ...evidence
        })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', 'Evidence linked successfully');
        setShowEvidenceModal(false);
        await fetchCompetencyData();
      } else {
        addToast('error', data.error || 'Failed to link evidence');
      }
    } catch (error) {
      console.error('Error saving evidence:', error);
      addToast('error', 'Failed to save evidence');
    }
  };

  const handlePCIUpdate = async (studentId, issueId, level) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency-matrix/pci/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ studentId, issueId, level })
      });
      const data = await response.json();
      if (data.success) {
        setPciData(prev => ({
          ...prev,
          [studentId]: {
            ...prev[studentId],
            [issueId]: level
          }
        }));
        addToast('success', 'PCI score updated');
      }
    } catch (error) {
      console.error('Error updating PCI:', error);
    }
  };

  const getClassAverages = () => {
    const averages = {};
    CORE_COMPETENCIES.forEach(comp => {
      let total = 0;
      let count = 0;
      students.forEach(student => {
        const score = competencyData[student.id]?.[comp.id]?.score;
        if (score) {
          total += score;
          count++;
        }
      });
      averages[comp.id] = count > 0 ? (total / count).toFixed(1) : 0;
    });
    return averages;
  };

  const getClassWeaknessAreas = () => {
    const weaknesses = [];
    const averages = getClassAverages();
    CORE_COMPETENCIES.forEach(comp => {
      if (averages[comp.id] < 60) {
        weaknesses.push(comp);
      }
    });
    return weaknesses;
  };

  const classAverages = getClassAverages();
  const classWeaknesses = getClassWeaknessAreas();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access competency matrix</p>
          <a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      {(loading.classes || loading.students || loading.data) && <GlobalSpinner />}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Competency Matrix</h1>
              <p className="text-green-100 mt-1">Track 7 Core Competencies | Heatmap Visualization | Evidence Linking</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-2 text-sm border ${viewMode === 'heatmap' ? 'bg-white text-green-700' : 'bg-green-600 text-white border-green-500'}`}
              >
                <Grid className="h-4 w-4 inline mr-1" /> Heatmap
              </button>
              <button
                onClick={() => setViewMode('student_detail')}
                className={`px-3 py-2 text-sm border ${viewMode === 'student_detail' ? 'bg-white text-green-700' : 'bg-green-600 text-white border-green-500'}`}
              >
                <Users className="h-4 w-4 inline mr-1" /> Student View
              </button>
              {!isClassTeacher && (
                <button
                  onClick={() => setViewMode('subject_matrix')}
                  className={`px-3 py-2 text-sm border ${viewMode === 'subject_matrix' ? 'bg-white text-green-700' : 'bg-green-600 text-white border-green-500'}`}
                >
                  <BookOpen className="h-4 w-4 inline mr-1" /> Subject Matrix
                </button>
              )}
              <button onClick={fetchCompetencyData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Filters */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const newClass = classes.find(c => c.id === parseInt(e.target.value));
                  setSelectedClass(newClass);
                  setIsClassTeacher(newClass?.isClassTeacher || false);
                  fetchClassStudents(newClass.id);
                }}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} {cls.isClassTeacher ? '(Your Class)' : '(Subject Only)'}
                  </option>
                ))}
              </select>
            </div>
            {viewMode === 'subject_matrix' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubject?.id || ''}
                  onChange={(e) => setSelectedSubject(subjects.find(s => s.id === parseInt(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Filter Competency</label>
              <select
                value={filterCompetency}
                onChange={(e) => setFilterCompetency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm bg-white"
              >
                <option value="all">All Competencies</option>
                {CORE_COMPETENCIES.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or admission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Class Insights Alert */}
        {classWeaknesses.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-800">Class Skill Gap Alert</p>
                <p className="text-sm text-yellow-700">
                  The whole class is struggling with: <strong>{classWeaknesses.map(c => c.name).join(', ')}</strong>
                </p>
                <p className="text-xs text-yellow-600 mt-1">Suggested intervention: Incorporate more activities focused on these competencies.</p>
              </div>
            </div>
          </div>
        )}

        {/* View: Heatmap */}
        {viewMode === 'heatmap' && (
          <div className="bg-white border border-gray-300 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[200px_repeat(7,1fr)]">
                {/* Header Row */}
                <div className="bg-gray-100 border-b border-r border-gray-300 p-3 font-bold text-gray-900 sticky left-0 bg-gray-100">
                  Student
                </div>
                {CORE_COMPETENCIES.map(comp => (
                  <div key={comp.id} className="bg-gray-100 border-b border-gray-300 p-3 text-center">
                    <div className="font-bold text-gray-900 text-sm">{comp.code}</div>
                    <div className="text-xs text-gray-500">{comp.name.substring(0, 20)}</div>
                    <div className="text-xs font-bold text-green-600 mt-1">
                      Class Avg: {classAverages[comp.id]}%
                    </div>
                  </div>
                ))}

                {/* Data Rows */}
                {students.filter(s => 
                  `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(student => (
                  <React.Fragment key={student.id}>
                    <div className="border-b border-r border-gray-300 p-3 sticky left-0 bg-white font-medium">
                      {student.first_name} {student.last_name}
                      <div className="text-xs text-gray-500">{student.assessment_number || student.admission_no}</div>
                    </div>
                    {CORE_COMPETENCIES.map(comp => {
                      const data = competencyData[student.id]?.[comp.id];
                      const level = data?.level;
                      const evidenceCount = evidenceData[student.id]?.[comp.id]?.length || 0;
                      return (
                        <div key={comp.id} className="border-b border-gray-300 p-2 text-center">
                          <HeatmapCell
                            student={student}
                            competency={comp}
                            level={level}
                            evidenceCount={evidenceCount}
                            isClassTeacher={isClassTeacher}
                            onClick={() => {
                              if (isClassTeacher || viewMode === 'subject_matrix') {
                                const newLevel = COMPETENCY_LEVELS.find(l => l.level === ((level?.level || 0) % 5) + 1);
                                handleCompetencyUpdate(student.id, comp.id, newLevel);
                              }
                            }}
                            onEvidenceClick={() => {
                              setSelectedStudentForEvidence(student);
                              setSelectedCompetency(comp);
                              setSelectedEvidence(evidenceData[student.id]?.[comp.id]?.[0]);
                              setShowEvidenceModal(true);
                            }}
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View: Student Detail */}
        {viewMode === 'student_detail' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.filter(s => 
              `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(student => (
              <StudentRadarChart
                key={student.id}
                student={student}
                competencies={competencyData[student.id] || {}}
              />
            ))}
          </div>
        )}

        {/* View: Subject Matrix (for subject teachers) */}
        {viewMode === 'subject_matrix' && !isClassTeacher && (
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h3 className="font-bold text-gray-900">
                Subject Matrix: {selectedSubject?.name} - {selectedClass?.class_name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                You can only assess competencies demonstrated during your lessons
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Student</th>
                    {CORE_COMPETENCIES.map(comp => (
                      <th key={comp.id} className="px-4 py-3 text-center font-bold text-gray-700">
                        {comp.code}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => 
                    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(student => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-gray-500">{student.assessment_number || student.admission_no}</div>
                      </td>
                      {CORE_COMPETENCIES.map(comp => {
                        const data = competencyData[student.id]?.[comp.id];
                        const level = data?.level;
                        return (
                          <td key={comp.id} className="px-4 py-3 text-center">
                            <select
                              value={level?.level || ''}
                              onChange={(e) => {
                                const newLevel = COMPETENCY_LEVELS.find(l => l.level === parseInt(e.target.value));
                                handleCompetencyUpdate(student.id, comp.id, newLevel);
                              }}
                              className={`px-2 py-1 text-xs rounded border ${
                                level?.bgColor || 'bg-gray-100'
                              } border-gray-300`}
                            >
                              <option value="">Not Assessed</option>
                              {COMPETENCY_LEVELS.map(l => (
                                <option key={l.level} value={l.level}>
                                  {l.label} - {l.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentForEvidence(student);
                            setSelectedCompetency(null);
                            setShowEvidenceModal(true);
                          }}
                          className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                        >
                          <Camera className="h-3 w-3 inline mr-1" />
                          Add Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PCI Tracker Section (Class Teacher only) */}
        {isClassTeacher && viewMode === 'heatmap' && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-4">PCI Tracker (Pertinent & Contemporary Issues)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.slice(0, 6).map(student => (
                <PCITracker
                  key={student.id}
                  student={student}
                  pciScores={pciData[student.id] || {}}
                  onUpdate={(issueId, level) => handlePCIUpdate(student.id, issueId, level)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary Footer */}
        <div className="mt-6 p-3 bg-gray-100 border border-gray-300 text-sm text-gray-600 flex justify-between items-center">
          <div className="flex gap-4">
            <span><span className="font-bold text-green-700">🟢 EE</span> Exceeding (90-100%)</span>
            <span><span className="font-bold text-blue-700">🔵 ME</span> Meeting (75-89%)</span>
            <span><span className="font-bold text-yellow-700">🟡 AE</span> Approaching (60-74%)</span>
            <span><span className="font-bold text-orange-700">🟠 BE</span> Below (40-59%)</span>
            <span><span className="font-bold text-red-700">🔴 WB</span> Well Below (0-39%)</span>
          </div>
          <div className="flex gap-4">
            <button className="text-blue-600 hover:text-blue-800">
              <Download className="h-4 w-4 inline mr-1" /> Export Report
            </button>
            <button className="text-green-600 hover:text-green-800">
              <Printer className="h-4 w-4 inline mr-1" /> Print Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => { setShowEvidenceModal(false); setSelectedEvidence(null); setSelectedStudentForEvidence(null); setSelectedCompetency(null); }}
        student={selectedStudentForEvidence}
        competency={selectedCompetency}
        evidence={selectedEvidence}
        onSave={handleEvidenceSave}
      />

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CompetencyMatrix;