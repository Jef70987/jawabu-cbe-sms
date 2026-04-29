/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RefreshCw, X, Loader2, AlertCircle, CheckCircle,
  Search, ChevronDown, ChevronUp, Grid, Users, BookOpen,
  Camera, Link2, Trophy, Shield, Eye, Download, Printer,
  Target, Award, Star, TrendingUp, BarChart3
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Toast Notification
const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  const styles = { success: 'bg-green-600 text-white', error: 'bg-red-600 text-white', warning: 'bg-yellow-500 text-white' };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${styles[type] || 'bg-blue-600 text-white'} animate-slide-in-right`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4 text-white/80 hover:text-white"><X className="h-4 w-4" /></button>
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

// Competency Level Colors
const LEVEL_CONFIG = {
  5: { label: 'EE', name: 'Exceeding Expectations', color: 'bg-green-600', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', score: 90 },
  4: { label: 'ME', name: 'Meeting Expectations', color: 'bg-blue-600', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', score: 75 },
  3: { label: 'AE', name: 'Approaching Expectations', color: 'bg-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', score: 60 },
  2: { label: 'BE', name: 'Below Expectations', color: 'bg-orange-600', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', score: 40 },
  1: { label: 'WB', name: 'Well Below Expectations', color: 'bg-red-600', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', score: 20 }
};

const getLevelFromScore = (score) => {
  if (score === null || score === undefined) return null;
  if (score >= 90) return LEVEL_CONFIG[5];
  if (score >= 75) return LEVEL_CONFIG[4];
  if (score >= 60) return LEVEL_CONFIG[3];
  if (score >= 40) return LEVEL_CONFIG[2];
  return LEVEL_CONFIG[1];
};

const HeatmapCell = ({ student, competency, data, onUpdate, onEvidence }) => {
  const level = data?.level ? LEVEL_CONFIG[data.level] : null;
  const cellColor = level ? level.color : 'bg-gray-200';
  
  return (
    <div className="relative group">
      <button
        onClick={() => onUpdate(student, competency, data)}
        className={`w-12 h-12 rounded-lg transition-all duration-200 ${cellColor} flex flex-col items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105`}
      >
        {level ? (
          <>
            <span className="text-white font-bold text-sm">{level.label}</span>
            <span className="text-white text-xs opacity-80">{data.level}</span>
          </>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </button>
      {data?.evidence_count > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onEvidence(student, competency, data); }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center shadow-md hover:bg-purple-600"
        >
          <Link2 className="h-3 w-3" />
        </button>
      )}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1">
        {student.first_name} {student.last_name}<br />
        {level ? `${level.name} (${level.label})` : 'Not assessed'}
      </div>
    </div>
  );
};

const StudentRadarChart = ({ student, competencies }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getAverageScore = () => {
    let total = 0, count = 0;
    Object.values(competencies).forEach(c => {
      if (c?.score) { total += c.score; count++; }
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  };
  
  const avgScore = getAverageScore();
  const avgLevel = getLevelFromScore(parseFloat(avgScore));
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{student.first_name} {student.last_name}</h3>
          <p className="text-xs text-gray-500">Admission: {student.admission_no}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-700">{avgScore}%</div>
          {avgLevel && <div className="text-xs text-green-600">{avgLevel.label} - {avgLevel.name}</div>}
        </div>
      </div>
      <div className="space-y-3">
        {Object.entries(competencies).map(([compId, compData]) => {
          const level = compData?.level ? LEVEL_CONFIG[compData.level] : null;
          return (
            <div key={compId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700">{compData?.name || compId}</span>
                <span className={level?.text || 'text-gray-500'}>{level?.label || '-'} ({compData?.score || 0}%)</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className={`${level?.color || 'bg-gray-400'} h-2 rounded-full`} style={{ width: `${compData?.score || 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setExpanded(!expanded)} className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800">
        {expanded ? 'Show Less' : 'Show Details'}
      </button>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong className="text-gray-800">Strengths:</strong> {Object.values(competencies).filter(c => c?.level >= 4).map(c => c?.name).join(', ') || 'None identified'}</p>
            <p><strong className="text-gray-800">Areas for Improvement:</strong> {Object.values(competencies).filter(c => c?.level <= 2 && c?.level).map(c => c?.name).join(', ') || 'None identified'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const LevelSelector = ({ currentLevel, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Competency Level</h3>
        <div className="space-y-2">
          {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
            <button
              key={level}
              onClick={() => onSelect(parseInt(level), config.score)}
              className={`w-full p-3 rounded-lg text-left flex justify-between items-center ${config.bg} ${config.text} hover:opacity-80 transition-all`}
            >
              <div>
                <span className="font-bold">{config.label}</span>
                <p className="text-xs">{config.name}</p>
              </div>
              <span className="text-sm font-medium">{config.score}%</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
      </div>
    </div>
  );
};

const EvidenceModal = ({ isOpen, onClose, student, competency, evidence, onSave }) => {
  const [formData, setFormData] = useState({ description: '', evidence_type: 'observation', date: new Date().toISOString().split('T')[0], notes: '' });
  
  useEffect(() => {
    if (evidence) setFormData({ description: evidence.description || '', evidence_type: evidence.evidence_type || 'observation', date: evidence.date || new Date().toISOString().split('T')[0], notes: evidence.notes || '' });
  }, [evidence]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Link Evidence</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Student</label><p className="text-gray-900">{student?.first_name} {student?.last_name}</p></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Competency</label><p className="text-gray-900">{competency?.name}</p></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Describe the evidence..." /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Evidence Type</label><select value={formData.evidence_type} onChange={(e) => setFormData({...formData, evidence_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="observation">Observation</option><option value="project">Project Work</option><option value="portfolio">Portfolio</option><option value="presentation">Presentation</option><option value="test">Assessment</option></select></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Additional notes..." /></div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg"><Link2 className="h-4 w-4 inline mr-1" /> Link Evidence</button>
        </div>
      </div>
    </div>
  );
};

function CompetencyMatrix() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [coreCompetencies, setCoreCompetencies] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [competencyData, setCompetencyData] = useState({});
  const [evidenceData, setEvidenceData] = useState({});
  const [classAverages, setClassAverages] = useState({});
  const [viewMode, setViewMode] = useState('heatmap');
  const [filterCompetency, setFilterCompetency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState({ classes: true, students: true, data: true });
  const [toasts, setToasts] = useState([]);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [selectedCompetencyData, setSelectedCompetencyData] = useState(null);
  const [saving, setSaving] = useState(false);

  const addToast = (type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000); };

  useEffect(() => { if (isAuthenticated) fetchInitialData(); }, [isAuthenticated]);
  useEffect(() => { if (selectedClass) { fetchStudents(); fetchCompetencyData(); } }, [selectedClass]);
  useEffect(() => { if (selectedClass && students.length > 0) fetchCompetencyData(); }, [selectedSubject]);

  const fetchInitialData = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try { await Promise.all([fetchClasses(), fetchCoreCompetencies(), fetchSubjects()]); } 
    catch (error) { addToast('error', 'Failed to load data'); } 
    finally { setLoading(prev => ({ ...prev, classes: false })); }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/classes/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) { setClasses(data.data); if (data.data.length > 0 && !selectedClass) setSelectedClass(data.data[0]); }
      else addToast('error', data.message || 'Failed to load classes');
    } catch (error) { addToast('error', 'Network error loading classes'); }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/subjects/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) { setSubjects(data.data); if (data.data.length > 0 && !selectedSubject) setSelectedSubject(data.data[0]); }
    } catch (error) { console.error('Error fetching subjects:', error); }
  };

  const fetchCoreCompetencies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/core/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) setCoreCompetencies(data.data);
    } catch (error) { console.error('Error fetching core competencies:', error); }
  };

  const fetchStudents = async () => {
    if (!selectedClass?.id) return;
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/students/${selectedClass.id}/`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) setStudents(data.data);
      else setStudents([]);
    } catch (error) { addToast('error', 'Failed to load students'); setStudents([]); }
    finally { setLoading(prev => ({ ...prev, students: false })); }
  };

  const fetchCompetencyData = async () => {
    if (!selectedClass?.id) return;
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const url = `${API_BASE_URL}/api/teacher/competency/matrix/retrieve/?class_id=${selectedClass.id}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data) {
        setCompetencyData(data.data.competencies || {});
        setEvidenceData(data.data.evidence || {});
        setClassAverages(data.data.class_averages || {});
      }
    } catch (error) { console.error('Error fetching competency data:', error); }
    finally { setLoading(prev => ({ ...prev, data: false })); }
  };

  const handleUpdateCompetency = async (student, competency, level, score) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/matrix/update/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ student_id: student.id, competency_id: competency.id, level, score, subject_id: selectedSubject?.id })
      });
      const data = await response.json();
      if (data.success) {
        addToast('success', `Updated ${competency.name} to ${LEVEL_CONFIG[level]?.label}`);
        await fetchCompetencyData();
      } else addToast('error', data.error || 'Update failed');
    } catch (error) { addToast('error', 'Failed to update competency'); }
    finally { setSaving(false); setShowLevelSelector(false); }
  };

  const handleSaveEvidence = async (evidenceData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competency/evidence/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...evidenceData, student_id: selectedStudent.id, competency_id: selectedCompetency.id })
      });
      const data = await response.json();
      if (data.success) { addToast('success', 'Evidence linked successfully'); setShowEvidenceModal(false); await fetchCompetencyData(); }
      else addToast('error', data.error || 'Failed to link evidence');
    } catch (error) { addToast('error', 'Failed to save evidence'); }
    finally { setSaving(false); }
  };

  const filteredStudents = students.filter(s => `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isAuthenticated) {
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="text-center"><AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2><p className="text-gray-600 mb-4">Please login to access competency matrix</p><a href="/login" className="px-6 py-3 bg-green-700 text-white font-medium rounded-lg inline-block">Go to Login</a></div></div>);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts.map(toast => (<Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />))}
      {(loading.classes || loading.students || loading.data || saving) && <GlobalSpinner />}

      <div className="bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div><h1 className="text-2xl font-bold text-white">Competency Matrix</h1><p className="text-green-100 mt-1">7 Core Competencies | Heatmap Visualization | Evidence Tracking</p></div>
          <div className="flex gap-3">
            <button onClick={() => setViewMode('heatmap')} className={`px-3 py-2 text-sm rounded-lg ${viewMode === 'heatmap' ? 'bg-white text-green-700' : 'bg-green-600 text-white'}`}><Grid className="h-4 w-4 inline mr-1" /> Heatmap</button>
            <button onClick={() => setViewMode('student_detail')} className={`px-3 py-2 text-sm rounded-lg ${viewMode === 'student_detail' ? 'bg-white text-green-700' : 'bg-green-600 text-white'}`}><Users className="h-4 w-4 inline mr-1" /> Student View</button>
            <button onClick={fetchCompetencyData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"><RefreshCw className="h-4 w-4 inline mr-2" /> Refresh</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label><select value={selectedClass?.id || ''} onChange={(e) => setSelectedClass(classes.find(c => c.id === e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">{classes.map(cls => (<option key={cls.id} value={cls.id}>{cls.class_name} {cls.is_class_teacher ? '(Your Class)' : ''}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Filter Competency</label><select value={filterCompetency} onChange={(e) => setFilterCompetency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="all">All Competencies</option>{coreCompetencies.map(comp => (<option key={comp.id} value={comp.id}>{comp.name}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Search Student</label><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search by name or admission..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" /></div></div>
          </div>
        </div>

        {viewMode === 'heatmap' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[200px_repeat(7,1fr)]">
                <div className="bg-gray-50 border-b border-r border-gray-200 p-3 font-bold text-gray-900 sticky left-0 bg-gray-50">Student</div>
                {coreCompetencies.map(comp => (<div key={comp.id} className="bg-gray-50 border-b border-gray-200 p-3 text-center"><div className="font-bold text-gray-900 text-sm">{comp.code}</div><div className="text-xs text-gray-500 truncate">{comp.name}</div><div className="text-xs font-bold text-green-600 mt-1">Avg: {classAverages[comp.id] || 0}%</div></div>))}
                {filteredStudents.map(student => (<React.Fragment key={student.id}><div className="border-b border-r border-gray-200 p-3 sticky left-0 bg-white font-medium">{student.first_name} {student.last_name}<div className="text-xs text-gray-500">{student.admission_no}</div></div>{coreCompetencies.map(comp => { const data = competencyData[student.id]?.[comp.id] || {}; return (<div key={comp.id} className="border-b border-gray-200 p-2 text-center"><HeatmapCell student={student} competency={comp} data={data} onUpdate={(s, c, d) => { setSelectedStudent(s); setSelectedCompetency(c); setSelectedCompetencyData(d); setShowLevelSelector(true); }} onEvidence={(s, c, d) => { setSelectedStudent(s); setSelectedCompetency(c); setShowEvidenceModal(true); }} /></div>); })}</React.Fragment>))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'student_detail' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => {
              const studentCompetencies = {};
              coreCompetencies.forEach(comp => { studentCompetencies[comp.id] = { ...(competencyData[student.id]?.[comp.id] || {}), name: comp.name }; });
              return <StudentRadarChart key={student.id} student={student} competencies={studentCompetencies} />;
            })}
          </div>
        )}

        <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap gap-3">{Object.entries(LEVEL_CONFIG).map(([level, config]) => (<div key={level} className="flex items-center gap-1"><div className={`w-3 h-3 rounded ${config.color}`} /><span className="text-xs">{config.label} - {config.name}</span></div>))}</div>
        </div>
      </div>

      {showLevelSelector && selectedStudent && selectedCompetency && (<LevelSelector currentLevel={selectedCompetencyData?.level} onSelect={(level, score) => handleUpdateCompetency(selectedStudent, selectedCompetency, level, score)} onClose={() => setShowLevelSelector(false)} />)}
      {showEvidenceModal && selectedStudent && selectedCompetency && (<EvidenceModal isOpen={showEvidenceModal} onClose={() => setShowEvidenceModal(false)} student={selectedStudent} competency={selectedCompetency} evidence={null} onSave={handleSaveEvidence} />)}
      
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }`}</style>
    </div>
  );
}

export default CompetencyMatrix;