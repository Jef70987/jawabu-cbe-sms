import React, { useState, useEffect } from 'react';
import { 
  Save, X, Search, Filter, Target, Award, Users,
  AlertCircle, CheckCircle, Loader2, RefreshCw, Download
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COMPETENCIES = [
  { id: 1, name: 'Communication and Collaboration', code: 'CC', description: 'Ability to share ideas clearly and work effectively in groups' },
  { id: 2, name: 'Critical Thinking and Problem Solving', code: 'CT', description: 'Using logic to evaluate situations and find creative solutions' },
  { id: 3, name: 'Creativity and Imagination', code: 'CI', description: 'Thinking outside the box and producing original ideas' },
  { id: 4, name: 'Citizenship', code: 'CZ', description: 'Understanding role in community and social responsibility' },
  { id: 5, name: 'Digital Literacy', code: 'DL', description: 'Ability to use technology safely and effectively' },
  { id: 6, name: 'Learning to Learn', code: 'LL', description: 'Being a self-driven, lifelong learner' },
  { id: 7, name: 'Self-Efficacy', code: 'SE', description: 'Self-belief to carry out tasks independently' }
];

const RATING_SCALE = [
  { value: 4, label: 'Exceeding Expectations (EE)', description: 'Always demonstrates and leads others', color: 'bg-green-100 text-green-800' },
  { value: 3, label: 'Meeting Expectations (ME)', description: 'Consistently demonstrates the competency', color: 'bg-blue-100 text-blue-800' },
  { value: 2, label: 'Approaching Expectations (AE)', description: 'Sometimes demonstrates with prompting', color: 'bg-yellow-100 text-yellow-800' },
  { value: 1, label: 'Below Expectations (BE)', description: 'Rarely demonstrates; needs intervention', color: 'bg-red-100 text-red-800' }
];

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

function CompetencyMatrix() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access competency matrix');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mock students data
      setStudents([
        { id: 1, admission_no: 'ADM001', first_name: 'John', last_name: 'Mwangi' },
        { id: 2, admission_no: 'ADM002', first_name: 'Mary', last_name: 'Wanjiku' },
        { id: 3, admission_no: 'ADM003', first_name: 'James', last_name: 'Otieno' },
        { id: 4, admission_no: 'ADM004', first_name: 'Sarah', last_name: 'Achieng' },
        { id: 5, admission_no: 'ADM005', first_name: 'David', last_name: 'Kiprop' }
      ]);
      
      // Mock existing ratings
      const mockRatings = {};
      for (let i = 1; i <= 5; i++) {
        mockRatings[i] = {};
        for (let j = 1; j <= 7; j++) {
          mockRatings[i][j] = Math.floor(Math.random() * 4) + 1;
        }
      }
      setRatings(mockRatings);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRating = (studentId, competencyId, value) => {
    setRatings(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [competencyId]: parseInt(value)
      }
    }));
  };

  const saveAllRatings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/competencies/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          class_id: selectedClass,
          term: selectedTerm,
          ratings: ratings
        })
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'All competency ratings saved successfully');
      } else {
        addNotification('error', data.error || 'Failed to save ratings');
      }
    } catch (error) {
      console.error('Error saving ratings:', error);
      addNotification('error', 'Failed to save ratings');
    } finally {
      setSaving(false);
    }
  };

  const exportToExcel = () => {
    const exportData = students.map(student => {
      const row = {
        'Admission No': student.admission_no,
        'Student Name': `${student.first_name} ${student.last_name}`
      };
      COMPETENCIES.forEach(comp => {
        row[comp.code] = ratings[student.id]?.[comp.id] || '';
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Competency_Ratings');
    XLSX.writeFile(workbook, `competency_ratings_${new Date().toISOString().split('T')[0]}.xlsx`);
    addNotification('success', 'Export completed');
  };

  const getRatingColor = (value) => {
    const rating = RATING_SCALE.find(r => r.value === value);
    return rating?.color || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access competency matrix</p>
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
          <h1 className="text-2xl font-bold text-white">Competency Matrix</h1>
          <p className="text-purple-100 mt-1">Rate students on the 7 Core Competencies (1-4 scale)</p>
        </div>
      </div>

      <div className="mx-auto p-6">
        {/* Controls */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="">Choose Class</option>
                <option value="7A">Grade 7A</option>
                <option value="7B">Grade 7B</option>
                <option value="8A">Grade 8A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Term</label>
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
                <Download className="h-4 w-4 inline mr-2" />
                Export
              </button>
              <button onClick={saveAllRatings} disabled={saving} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Save className="h-4 w-4 inline mr-2" />}
                Save All
              </button>
            </div>
          </div>
        </div>

        {/* Rating Scale Legend */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Rating Scale (1-4)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RATING_SCALE.map(scale => (
              <div key={scale.value} className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-bold ${scale.color}`}>{scale.value}</span>
                <span className="text-xs text-gray-600">{scale.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competency Matrix Table */}
        {selectedClass && students.length > 0 && (
          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-3 text-left font-bold text-gray-700 sticky left-0 bg-gray-100">Student</th>
                    {COMPETENCIES.map(comp => (
                      <th key={comp.id} className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 min-w-[120px]">
                        {comp.code}
                        <p className="text-xs font-normal text-gray-500 mt-1">{comp.name}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={COMPETENCIES.length + 1} className="border border-gray-300 px-4 py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
                      </td>
                    </tr>
                  ) : (
                    students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-3 sticky left-0 bg-white font-medium">
                          {student.first_name} {student.last_name}
                          <p className="text-xs text-gray-500">{student.admission_no}</p>
                        </td>
                        {COMPETENCIES.map(comp => (
                          <td key={comp.id} className="border border-gray-300 px-3 py-3 text-center">
                            <select 
                              value={ratings[student.id]?.[comp.id] || ''}
                              onChange={(e) => updateRating(student.id, comp.id, e.target.value)}
                              className={`w-16 px-2 py-1 text-center border text-sm ${getRatingColor(ratings[student.id]?.[comp.id])}`}
                            >
                              <option value="">-</option>
                              {RATING_SCALE.map(scale => (
                                <option key={scale.value} value={scale.value}>{scale.value}</option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedClass && students.length === 0 && !isLoading && (
          <div className="bg-white border border-gray-300 p-12 text-center text-gray-400">
            No students found for this class
          </div>
        )}

        {!selectedClass && (
          <div className="bg-white border border-gray-300 p-12 text-center text-gray-400">
            Select a class to begin rating competencies
          </div>
        )}
      </div>
    </div>
  );
}

export default CompetencyMatrix;