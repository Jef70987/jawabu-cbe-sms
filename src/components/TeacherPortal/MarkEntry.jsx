/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Save, X, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Loader2, RefreshCw, Download,
  FileText, TrendingUp, Users, BookOpen
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import * as XLSX from 'xlsx';

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

function MarkEntryGrid() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [assessment, setAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scaleType, setScaleType] = useState('percentage'); // percentage or 4-point

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access mark entry');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedAssessment) {
      fetchStudentsAndMarks();
    }
  }, [selectedAssessment]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch assessments
      const assessmentsRes = await fetch(`${API_BASE_URL}/api/teacher/assessments/`, {
        headers: getAuthHeaders()
      });
      const assessmentsData = await assessmentsRes.json();
      if (assessmentsData.success) {
        setAssessments(assessmentsData.data);
      } else {
        setAssessments([
          { id: 1, title: 'Mathematics CAT 1', subject: 'Mathematics', class: 'Grade 7A', type: 'sba', total_marks: 50, date: '2024-03-15' },
          { id: 2, title: 'Science Project', subject: 'Integrated Science', class: 'Grade 7A', type: 'project', total_marks: 100, date: '2024-03-10' },
          { id: 3, title: 'End of Term Exam', subject: 'Mathematics', class: 'Grade 7A', type: 'summative', total_marks: 100, date: '2024-04-01' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsAndMarks = async () => {
    const assessmentData = assessments.find(a => a.id == selectedAssessment);
    setAssessment(assessmentData);
    
    // Mock students data
    setStudents([
      { id: 1, admission_no: 'ADM001', first_name: 'John', last_name: 'Mwangi' },
      { id: 2, admission_no: 'ADM002', first_name: 'Mary', last_name: 'Wanjiku' },
      { id: 3, admission_no: 'ADM003', first_name: 'James', last_name: 'Otieno' },
      { id: 4, admission_no: 'ADM004', first_name: 'Sarah', last_name: 'Achieng' },
      { id: 5, admission_no: 'ADM005', first_name: 'David', last_name: 'Kiprop' }
    ]);
    
    // Mock existing marks
    setMarks({
      1: { score: 78, remarks: 'Good work' },
      2: { score: 85, remarks: 'Excellent' },
      3: { score: 62, remarks: 'Satisfactory' },
      4: { score: 45, remarks: 'Needs improvement' },
      5: { score: 91, remarks: 'Outstanding' }
    });
  };

  const updateMark = (studentId, field, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === 'score' ? parseInt(value) || 0 : value
      }
    }));
  };

  const saveAllMarks = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/marks/bulk/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          assessment_id: selectedAssessment,
          marks: marks
        })
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'All marks saved successfully');
      } else {
        addNotification('error', data.error || 'Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      addNotification('error', 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const exportToExcel = () => {
    const exportData = students.map(student => ({
      'Admission No': student.admission_no,
      'Student Name': `${student.first_name} ${student.last_name}`,
      'Score': marks[student.id]?.score || '',
      'Remarks': marks[student.id]?.remarks || '',
      'Assessment': assessment?.title,
      'Total Marks': assessment?.total_marks,
      'Percentage': marks[student.id]?.score ? ((marks[student.id].score / assessment?.total_marks) * 100).toFixed(1) : ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks');
    XLSX.writeFile(workbook, `marks_${assessment?.title}_${new Date().toISOString().split('T')[0]}.xlsx`);
    addNotification('success', 'Export completed');
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access mark entry</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className=" mx-auto">
          <h1 className="text-2xl font-bold text-white">Mark Entry Grid</h1>
          <p className="text-blue-100 mt-1">Enter and manage student assessment scores</p>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Assessment Selector */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Assessment</label>
              <select 
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">Choose Assessment</option>
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>{a.title} - {a.class} ({a.date})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Scale Type</label>
              <select 
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="percentage">Percentage (0-100%)</option>
                <option value="4-point">4-Point Scale (1-4)</option>
                <option value="8-point">8-Point Scale (1-8)</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                <Download className="h-4 w-4 inline mr-2" />
                Export
              </button>
              <button onClick={saveAllMarks} disabled={saving || !selectedAssessment} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Save className="h-4 w-4 inline mr-2" />}
                Save All
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Info */}
        {assessment && (
          <div className="bg-blue-50 border border-blue-300 p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-blue-600">Assessment Title</p>
                <p className="font-bold text-blue-900">{assessment.title}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Subject</p>
                <p className="font-bold text-blue-900">{assessment.subject}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Total Marks</p>
                <p className="font-bold text-blue-900">{assessment.total_marks}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Date</p>
                <p className="font-bold text-blue-900">{assessment.date}</p>
              </div>
            </div>
          </div>
        )}

        {/* Marks Grid */}
        {selectedAssessment && students.length > 0 && (
          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">#</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Admission No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Score / {assessment?.total_marks}</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Percentage</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const studentMark = marks[student.id] || { score: '', remarks: '' };
                    const percentage = studentMark.score ? ((studentMark.score / assessment?.total_marks) * 100).toFixed(1) : '';
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-center">{idx + 1}</td>
                        <td className="border border-gray-300 px-4 py-3 font-mono text-xs">{student.admission_no}</td>
                        <td className="border border-gray-300 px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input 
                            type="number" 
                            value={studentMark.score || ''}
                            onChange={(e) => updateMark(student.id, 'score', e.target.value)}
                            className={`w-24 px-2 py-1 text-center border ${studentMark.score ? getScoreColor(studentMark.score, assessment?.total_marks) : 'border-gray-300'} text-sm bg-white`}
                            min="0"
                            max={assessment?.total_marks}
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-bold">
                          {percentage}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input 
                            type="text" 
                            value={studentMark.remarks || ''}
                            onChange={(e) => updateMark(student.id, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 text-sm bg-white"
                            placeholder="Add remark..."
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedAssessment && students.length === 0 && (
          <div className="bg-white border border-gray-300 p-12 text-center text-gray-400">
            No students found for this assessment
          </div>
        )}

        {!selectedAssessment && (
          <div className="bg-white border border-gray-300 p-12 text-center text-gray-400">
            Select an assessment to begin marking
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkEntryGrid;