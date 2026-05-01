/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileText, Printer, TrendingUp, Users, 
  BarChart3, AlertCircle, CheckCircle, X, Loader2,
  Eye, RefreshCw, Upload, GraduationCap, Download
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// JSS SCALE (Grades 7-9) - 8 Level KNEC Achievement Scale
const JSS_SCALE = {
  EE1: { min: 90, max: 100, points: 8, label: 'Exceptional', color: 'bg-purple-100 text-purple-800', borderColor: 'border-purple-500', bgProgress: 'bg-purple-600' },
  EE2: { min: 75, max: 89, points: 7, label: 'Very Good', color: 'bg-green-100 text-green-800', borderColor: 'border-green-500', bgProgress: 'bg-green-600' },
  ME1: { min: 58, max: 74, points: 6, label: 'Good', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-500', bgProgress: 'bg-blue-600' },
  ME2: { min: 41, max: 57, points: 5, label: 'Fair', color: 'bg-cyan-100 text-cyan-800', borderColor: 'border-cyan-500', bgProgress: 'bg-cyan-600' },
  AE1: { min: 31, max: 40, points: 4, label: 'Needs Improvement', color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-500', bgProgress: 'bg-yellow-600' },
  AE2: { min: 21, max: 30, points: 3, label: 'Below Average', color: 'bg-orange-100 text-orange-800', borderColor: 'border-orange-500', bgProgress: 'bg-orange-600' },
  BE1: { min: 11, max: 20, points: 2, label: 'Well Below Average', color: 'bg-red-100 text-red-800', borderColor: 'border-red-500', bgProgress: 'bg-red-600' },
  BE2: { min: 0, max: 10, points: 1, label: 'Minimal', color: 'bg-red-200 text-red-900', borderColor: 'border-red-700', bgProgress: 'bg-red-700' }
};

const getAchievementLevel = (percentage) => {
  if (percentage === null || percentage === undefined) return null;
  for (const [key, level] of Object.entries(JSS_SCALE)) {
    if (percentage >= level.min && percentage <= level.max) return { ...level, code: key };
  }
  return { ...JSS_SCALE.BE2, code: 'BE2' };
};

// Progress Bar Component
const ProgressBar = ({ percentage, label }) => {
  const level = getAchievementLevel(percentage);
  const width = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${level?.bgProgress || 'bg-blue-600'}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// Circular Ribbon Component for Competencies
const CircularRibbon = ({ percentage, label, code, assessed }) => {
  const level = getAchievementLevel(percentage);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  if (!assessed) {
    return (
      <div className="flex flex-col items-center p-3">
        <div className="relative w-24 h-24">
          <div className="w-full h-full rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">N/A</span>
          </div>
        </div>
        <p className="text-xs font-medium text-gray-700 mt-2 text-center">{label}</p>
        <p className="text-xs text-gray-400">{code}</p>
      </div>
    );
  }
  
  const getRingColor = () => {
    if (percentage >= 90) return 'stroke-purple-600';
    if (percentage >= 75) return 'stroke-green-600';
    if (percentage >= 58) return 'stroke-blue-600';
    if (percentage >= 41) return 'stroke-cyan-600';
    if (percentage >= 31) return 'stroke-yellow-600';
    if (percentage >= 21) return 'stroke-orange-600';
    if (percentage >= 11) return 'stroke-red-600';
    return 'stroke-red-700';
  };
  
  return (
    <div className="flex flex-col items-center p-3">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={getRingColor()}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${level?.color.split(' ')[1] || 'text-blue-600'}`}>{percentage}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-700 mt-2 text-center">{label}</p>
      <p className="text-xs text-gray-500">{code}</p>
      {level && (
        <span className={`text-xs px-2 py-0.5 rounded mt-1 ${level.color}`}>
          {level.code}
        </span>
      )}
    </div>
  );
};

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(() => onClose?.(), 300); }, 5000);
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
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 rounded shadow-lg ${styles[type]}`}>
      <div className="flex items-start">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />}
        <div className="flex-1">
          <p className="text-sm font-semibold">{type === 'success' ? 'Success' : 'Error'}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }} className="ml-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    <p className="mt-3 text-gray-600 text-sm">{message}</p>
  </div>
);

function ResultsReporting() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [bulkGeneration, setBulkGeneration] = useState({
    examId: '',
    classIds: [],
    fileFormat: 'pdf'
  });
  
  const [allResults, setAllResults] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_results: 0,
    average_score: 0,
    pass_rate: 0,
    total_students: 0,
    grade_distribution: {},
    top_performers: [],
    subject_performance: [],
    class_performance: []
  });

  const printRef = useRef();

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && selectedExam) {
      fetchExamResults();
      fetchAnalytics();
    }
  }, [selectedExam, selectedClass, selectedSubject, isAuthenticated]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [examsRes, classesRes, studentsRes, subjectsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/exams/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/students/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/registrar/resultsreport/subjects/`, { headers: getAuthHeaders() })
      ]);

      const examsData = await examsRes.json();
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const subjectsData = await subjectsRes.json();

      if (examsData.success) setExams(examsData.data || []);
      if (classesData.success) setClasses(classesData.data || []);
      if (studentsData.success) setStudents(studentsData.data || []);
      if (subjectsData.success) setSubjects(subjectsData.data || []);
    } catch (error) {
      addNotification('error', 'Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExamResults = async () => {
    if (!selectedExam) return;
    
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/`;
      const params = new URLSearchParams();
      params.append('exam_id', selectedExam);
      if (selectedClass) params.append('class_id', selectedClass);
      if (selectedSubject) params.append('subject', selectedSubject);
      url += `?${params.toString()}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        const enrichedResults = (data.data || []).map(result => {
          const examInfo = exams.find(e => e.id === result.exam_id);
          return {
            ...result,
            exam_type: examInfo?.exam_type,
            exam_title: examInfo?.title,
            total_marks: examInfo?.total_marks
          };
        });
        setAllResults(enrichedResults);
      }
    } catch (error) {
      addNotification('error', 'Failed to fetch results');
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedExam) return;
    
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/analytics/`;
      const params = new URLSearchParams();
      params.append('exam_id', selectedExam);
      if (selectedClass) params.append('class_id', selectedClass);
      if (selectedSubject) params.append('subject', selectedSubject);
      url += `?${params.toString()}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setAnalytics(data.data);
    } catch (error) {
      addNotification('error', 'Failed to fetch analytics');
    }
  };

  const fetchStudentCompetencies = async (studentId) => {
    try {
      const termRes = await fetch(`${API_BASE_URL}/api/registrar/academic/terms/?is_current=true`, { headers: getAuthHeaders() });
      const termData = await termRes.json();
      let termId = null;
      let academicYearId = null;
      
      if (termData.success && termData.data && termData.data.length > 0) {
        termId = termData.data[0].id;
        academicYearId = termData.data[0].academic_year?.id;
      }
      
      const coreCompRes = await fetch(`${API_BASE_URL}/api/registrar/academic/core-competencies/`, { headers: getAuthHeaders() });
      const coreCompData = await coreCompRes.json();
      const coreCompetencies = coreCompData.success ? coreCompData.data : [];
      
      let url = `${API_BASE_URL}/api/registrar/academic/student-portfolios/?student=${studentId}`;
      if (termId) url += `&term=${termId}`;
      if (academicYearId) url += `&academic_year=${academicYearId}`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      
      const competencyMap = new Map();
      
      if (data.success && data.data) {
        data.data.forEach(portfolio => {
          if (portfolio.core_competency) {
            competencyMap.set(portfolio.core_competency.id, {
              score: portfolio.percentage,
              level: portfolio.sub_level,
              level_label: portfolio.rating,
              comment: portfolio.teacher_comment
            });
          }
        });
      }
      
      return coreCompetencies.map(comp => ({
        id: comp.id,
        name: comp.name,
        code: comp.code,
        ...competencyMap.get(comp.id),
        assessed: competencyMap.has(comp.id)
      }));
      
    } catch (error) {
      console.error('Failed to fetch competencies:', error);
      return [];
    }
  };

  const getSBAScores = (studentId) => {
    const sbaResults = allResults.filter(r => 
      r.student_id === studentId && 
      (r.exam_type === 'Classroom-Based Assessment (CBA)' || 
       r.exam_type === 'School-Based Assessment (SBA)' || 
       r.exam_type === 'Continuous Assessment Test (CAT)')
    );
    
    if (sbaResults.length === 0) return [];
    
    return sbaResults.map(r => ({
      exam_id: r.exam_id,
      exam_title: r.exam_title,
      subject: r.subject || 'General',
      score: r.percentage || 0,
      marks: r.marks_obtained || 0,
      total_marks: r.total_marks
    }));
  };

  const getAverageSBAScore = (studentId, subjectName = null) => {
    let sbaResults = allResults.filter(r => 
      r.student_id === studentId && 
      (r.exam_type === 'Classroom-Based Assessment (CBA)' || 
       r.exam_type === 'School-Based Assessment (SBA)' || 
       r.exam_type === 'Continuous Assessment Test (CAT)')
    );
    
    if (subjectName && subjectName !== 'General') {
      sbaResults = sbaResults.filter(r => r.subject === subjectName);
    }
    
    if (sbaResults.length === 0) return null;
    const avg = sbaResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / sbaResults.length;
    return Math.round(avg);
  };

  const getSummativeScoresForSelectedExam = (studentId) => {
    const examResults = allResults.filter(r => 
      r.student_id === studentId && 
      r.exam_id === selectedExam
    );
    
    const subjectScores = {};
    examResults.forEach(r => {
      if (r.subject && r.subject !== 'General' && r.subject !== '' && r.subject !== null) {
        subjectScores[r.subject] = {
          score: r.percentage || 0,
          marks_obtained: r.marks_obtained || 0,
          exam_id: r.exam_id,
          exam_title: r.exam_title
        };
      }
    });
    
    return subjectScores;
  };

  const calculateWeightedScore = (sbaScore, examScore) => {
    if (sbaScore === null && examScore === null) return null;
    if (sbaScore === null) return examScore;
    if (examScore === null) return sbaScore;
    return Math.round((sbaScore * 0.4) + (examScore * 0.6));
  };

  const fetchStudentReport = async (student) => {
    setSelectedStudent(student);
    setIsGenerating(true);
    try {
      const selectedExamObj = exams.find(e => e.id === selectedExam);
      if (!selectedExamObj) {
        addNotification('error', 'Please select an exam first');
        setIsGenerating(false);
        return;
      }
      
      const examSubjects = selectedExamObj.subjects || [];
      const sbaScores = getSBAScores(student.id);
      const avgSbaScore = getAverageSBAScore(student.id);
      const summativeScores = getSummativeScoresForSelectedExam(student.id);
      
      let subjectsList = [];
      
      if (examSubjects.length > 0) {
        subjectsList = examSubjects.map(subjectName => {
          const examScoreData = summativeScores[subjectName];
          const examScore = examScoreData ? examScoreData.score : null;
          const subjectSbaScore = getAverageSBAScore(student.id, subjectName) || avgSbaScore;
          const weightedTotal = calculateWeightedScore(subjectSbaScore, examScore);
          const level = getAchievementLevel(weightedTotal);
          
          return {
            subject: subjectName,
            sba_score: subjectSbaScore,
            exam_score: examScore,
            exam_marks: examScoreData?.marks_obtained || null,
            exam_id: examScoreData?.exam_id,
            total: weightedTotal,
            level: level,
            grade_code: level?.code,
            has_result: examScore !== null
          };
        });
      } else {
        subjectsList = Object.keys(summativeScores).map(subjectName => {
          const examScoreData = summativeScores[subjectName];
          const examScore = examScoreData ? examScoreData.score : null;
          const subjectSbaScore = getAverageSBAScore(student.id, subjectName) || avgSbaScore;
          const weightedTotal = calculateWeightedScore(subjectSbaScore, examScore);
          const level = getAchievementLevel(weightedTotal);
          
          return {
            subject: subjectName,
            sba_score: subjectSbaScore,
            exam_score: examScore,
            exam_marks: examScoreData?.marks_obtained || null,
            exam_id: examScoreData?.exam_id,
            total: weightedTotal,
            level: level,
            grade_code: level?.code,
            has_result: examScore !== null
          };
        });
      }
      
      const subjectsWithResults = subjectsList.filter(s => s.has_result);
      const totalScore = subjectsWithResults.reduce((sum, s) => sum + (s.total || 0), 0);
      const overallAvg = subjectsWithResults.length > 0 ? Math.round(totalScore / subjectsWithResults.length) : (avgSbaScore || 0);
      const overallLevel = getAchievementLevel(overallAvg);
      
      const competencies = await fetchStudentCompetencies(student.id);
      
      const report = {
        student: {
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          admission_no: student.admission_no,
          upi_number: student.upi_number || 'N/A',
          gender: student.gender || 'N/A',
          class_name: classes.find(c => c.id === student.current_class)?.class_name || 'N/A'
        },
        exam: {
          id: selectedExamObj?.id,
          title: selectedExamObj?.title || 'Assessment',
          academic_year: selectedExamObj?.academic_year || new Date().getFullYear(),
          term: selectedExamObj?.term || 'Term 2',
          grade_level: selectedExamObj?.grade_level || 7,
          total_marks: selectedExamObj?.total_marks || 100,
          subjects: selectedExamObj?.subjects || []
        },
        sba_scores: sbaScores,
        avg_sba_score: avgSbaScore,
        subjects: subjectsList,
        summary: {
          average_score: overallAvg,
          level: overallLevel,
          grade_code: overallLevel?.code,
          grade_label: overallLevel?.label,
          total_subjects: subjectsList.length,
          subjects_with_results: subjectsWithResults.length
        },
        competencies: competencies
      };
      
      setStudentReport(report);
      setShowReportModal(true);
    } catch (error) {
      addNotification('error', 'Failed to fetch student report');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkReports = async () => {
    if (!bulkGeneration.examId || bulkGeneration.classIds.length === 0) {
      addNotification('warning', 'Please select exam and at least one class');
      return;
    }
    
    setUploading(true);
    addNotification('info', `Generating reports for ${bulkGeneration.classIds.length} class(es)...`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/resultsreport/bulk-generate/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          exam_id: bulkGeneration.examId,
          class_ids: bulkGeneration.classIds
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.reports) {
        if (bulkGeneration.fileFormat === 'excel') {
          const exportData = [];
          data.data.reports.forEach(report => {
            report.subjects.forEach(subject => {
              exportData.push({
                'Student Name': report.student_name,
                'Admission No': report.admission_no,
                'Class': report.class_name,
                'Exam': report.exam_title,
                'Subject': subject.subject,
                'SBA Score': subject.sba_score || 'N/A',
                'Exam Score': `${subject.summative_score}%`,
                'Total Score': `${subject.total}%`,
                'Grade': subject.grade
              });
            });
          });
          
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk Reports');
          XLSX.writeFile(workbook, `bulk_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
          addNotification('success', 'Excel file downloaded');
        } else {
          let allReportsHtml = '';
          for (const report of data.data.reports) {
            const overallLevel = getAchievementLevel(report.average_score || 0);
            
            allReportsHtml += `
              <div class="report-card" style="page-break-after: always; font-family: Arial, sans-serif;">
                <!-- School Header -->
                <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000;">
                  <div style="font-size: 24px; font-weight: bold;">JAWABU SCHOOL</div>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">Striving For Excellence</div>
                  <div style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0;">COMPETENCY-BASED EDUCATION (CBE) ASSESSMENT REPORT</div>
                  <div style="font-size: 11px; color: #666;">KNEC-Compliant Junior Secondary School (JSS) Report Card</div>
                </div>

                <!-- Student Biodata -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 12px; background: #f5f5f5; margin-bottom: 20px; border: 1px solid #ddd;">
                  <div><div style="font-size: 10px; font-weight: bold; color: #666;">Full Name</div><div style="font-size: 13px; font-weight: bold;">${report.student_name}</div></div>
                  <div><div style="font-size: 10px; font-weight: bold; color: #666;">Admission No</div><div style="font-size: 13px; font-weight: bold;">${report.admission_no}</div></div>
                  <div><div style="font-size: 10px; font-weight: bold; color: #666;">Class</div><div style="font-size: 13px;">${report.class_name}</div></div>
                  <div><div style="font-size: 10px; font-weight: bold; color: #666;">Exam</div><div style="font-size: 13px;">${report.exam_title}</div></div>
                  <div><div style="font-size: 10px; font-weight: bold; color: #666;">Year & Term</div><div style="font-size: 13px;">${new Date().getFullYear()} - Term 2</div></div>
                </div>

                <!-- SBA Scores Section -->
                ${report.sba_scores && report.sba_scores.length > 0 ? `
                <div style="margin-bottom: 20px; padding: 12px; background: #eff6ff; border: 1px solid #bfdbfe;">
                  <div style="font-size: 13px; font-weight: bold; color: #1e40af; margin-bottom: 10px;">School-Based Assessment (SBA) / CAT Scores (40% Weight)</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${report.sba_scores.map(sba => `
                      <div style="background: white; padding: 6px 12px; border: 1px solid #93c5fd;">
                        <span style="font-weight: 500;">${sba.exam_title}:</span>
                        <span style="font-weight: bold; color: #166534;">${sba.score}%</span>
                        <span style="font-size: 11px; color: #666;">(${sba.marks}/${sba.total_marks || 100})</span>
                      </div>
                    `).join('')}
                    ${report.avg_sba_score ? `
                      <div style="background: #dcfce7; padding: 6px 12px; border: 1px solid #86efac;">
                        <span style="font-weight: 500;">Average SBA:</span>
                        <span style="font-weight: bold; color: #166534;">${report.avg_sba_score}%</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                ` : ''}

                <!-- Summative Academic Analysis -->
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Summative Tracking Analysis (40/60 Rule)</div>
                  <div style="font-size: 11px; color: #666; margin-bottom: 8px;">SBA (School-Based Assessment): 40% | Summative (End of Term): 60% = Total Score (100%)</div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #f3f4f6;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Learning Area</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">SBA (40%)</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Summative (60%)</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Total (100%)</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${report.subjects.map(subject => {
                        const level = getAchievementLevel(subject.total);
                        return `
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${subject.subject}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${subject.sba_score || '-'}%</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${subject.summative_score}%</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>${subject.total}%</strong></td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                              <span style="background: ${level?.color?.replace('bg-', '').replace('text-', '') || '#e5e7eb'}; padding: 2px 8px; font-size: 11px; font-weight: bold;">
                                ${level?.code || subject.grade || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                    <tfoot>
                      <tr style="background-color: #f9fafb; font-weight: bold;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Overall Average</td>
                        <td colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 16px;">${report.average_score || 0}%</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                          <span style="background: ${overallLevel?.color?.replace('bg-', '').replace('text-', '') || '#e5e7eb'}; padding: 2px 8px; font-size: 11px; font-weight: bold;">
                            ${overallLevel?.code || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Career Pathway Recommendation -->
                <div style="margin-bottom: 20px; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
                  <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">Career Pathway Recommendation (Grade 9 → 10)</div>
                  <div style="font-size: 12px; font-weight: bold;">
                    ${(report.average_score || 0) >= 75 ? 'STEM Pathway Recommended' : 
                      (report.average_score || 0) >= 58 ? 'Social Sciences Pathway Recommended' : 
                      'Arts & Sports Science Pathway Recommended'}
                  </div>
                  <div style="font-size: 10px; color: #666; margin-top: 4px;">
                    Based on performance analysis: ${report.average_score || 0}% overall average
                  </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; font-size: 9px; color: #999; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
                  This is a system-generated KNEC-compliant report card.<br>
                  Jawabu E-School Genesis System - CBE Assessment Platform
                </div>
              </div>
            `;
          }
          
          const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Bulk CBE Report Cards</title>
              <style>
                @media print {
                  body { margin: 0; padding: 0; }
                  .report-card { page-break-after: always; }
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; padding: 20px; background: white; }
              </style>
            </head>
            <body>${allReportsHtml}</body>
            </html>
          `;
          
          const blob = new Blob([fullHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bulk_reports_${new Date().toISOString().split('T')[0]}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          addNotification('success', 'HTML report generated. Use Ctrl+P to save as PDF.');
        }
      } else {
        addNotification('error', data.error || 'Failed to generate reports');
      }
    } catch (error) {
      addNotification('error', 'Failed to generate bulk reports');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile || !bulkGeneration.examId) {
      addNotification('warning', 'Please select exam and file');
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('exam_id', bulkGeneration.examId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/resultsreport/bulk-upload/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification('success', `Uploaded ${data.saved_count} results successfully`);
        setShowBulkImportModal(false);
        setUploadFile(null);
        fetchExamResults();
        fetchAnalytics();
      } else {
        addNotification('error', data.error || 'Failed to upload results');
      }
    } catch (error) {
      addNotification('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('report-content')?.innerHTML || '';
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Report Card</title>
          <style>
            @media print { body { margin: 0; padding: 0; } }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; background: white; }
            .report-container { max-width: 210mm; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="report-container">${printContent}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const clearFilters = () => {
    setSelectedExam('');
    setSelectedClass('');
    setSelectedSubject('');
  };

  const downloadTemplate = () => {
    const template = [
      { student_id: 'ADM001', subject: 'Mathematics', score: 85 },
      { student_id: 'ADM001', subject: 'English', score: 78 }
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'cbe_results_template.xlsx');
    addNotification('success', 'Template downloaded');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access the results reporting system</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 inline-block">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))} />
      ))}

      {/* Header */}
      <div className="mb-6 bg-green-700 p-5 rounded">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">KNEC-Compliant Report Card System</h1>
            <p className="text-green-100 mt-1">Competency-Based Education (CBE) Assessment Reporting</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulkImportModal(true)} className="px-4 py-2 bg-white text-green-700 text-sm font-medium rounded hover:bg-gray-100">
              <Upload className="h-4 w-4 inline mr-2" /> Bulk Import
            </button>
            <button onClick={fetchInitialData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 inline mr-2" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1 border-b border-gray-300 pb-3">
        {[
          { id: 'analytics', label: 'School Analytics', icon: BarChart3 },
          { id: 'students', label: 'Student Reports', icon: GraduationCap },
          { id: 'bulk', label: 'Bulk Generation', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4 inline mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Exam / Assessment</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 rounded bg-white">
              <option value="">Select an Exam</option>
              {exams.filter(e => e.status === 'published' || e.status === 'archived').map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title} ({exam.exam_type})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Grade / Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 rounded bg-white">
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Learning Area</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-400 rounded bg-white">
              <option value="">All Subjects</option>
              {subjects.map((subj, index) => (
                <option key={index} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800 font-bold">Clear All Filters</button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        !selectedExam ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-yellow-800">No Exam Selected</h3>
            <p className="text-yellow-700 mt-2">Please select an exam from the filter above to view analytics.</p>
          </div>
        ) : isLoading ? (
          <LoadingSpinner message="Loading analytics data..." />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Average Score', value: `${Math.round(analytics.average_score)}%`, icon: TrendingUp },
                { label: 'Pass Rate', value: `${Math.round(analytics.pass_rate)}%`, icon: CheckCircle },
                { label: 'Total Students', value: analytics.total_students, icon: Users },
                { label: 'Total Results', value: analytics.total_results, icon: FileText }
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-gray-300 rounded p-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">{stat.label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p></div>
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><stat.icon className="h-5 w-5 text-gray-600" /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grade Distribution */}
            <div className="bg-white border border-gray-300 rounded mb-5">
              <div className="border-b border-gray-300 px-5 py-3 bg-gray-50"><h2 className="text-md font-bold text-gray-900">Performance Level Distribution (JSS 8-Point Scale)</h2></div>
              <div className="p-5">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {Object.entries(JSS_SCALE).map(([key, level]) => (
                    <div key={key} className="text-center p-2 border border-gray-300 rounded">
                      <div className={`${level.color} px-2 py-1 font-bold text-sm rounded`}>{key}</div>
                      <p className="text-lg font-bold text-gray-800 mt-1">{analytics.grade_distribution?.[key] || 0}</p>
                      <p className="text-xs text-gray-500">{level.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white border border-gray-300 rounded mb-5">
              <div className="border-b border-gray-300 px-5 py-3 bg-gray-50"><h2 className="text-md font-bold text-gray-900">Top Performing Students</h2></div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr className="border-b border-gray-300"><th className="px-4 py-2 text-left font-bold">Student Name</th><th className="px-4 py-2 text-left font-bold">Admission No</th><th className="px-4 py-2 text-center font-bold">Average Score</th><th className="px-4 py-2 text-center font-bold">Performance Level</th></tr></thead>
                  <tbody>
                    {analytics.top_performers?.map((student, idx) => {
                      const level = getAchievementLevel(student.average_score);
                      return (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-2">{student.name}</td>
                          <td className="px-4 py-2">{student.admission_no}</td>
                          <td className="px-4 py-2 text-center font-bold text-green-700">{Math.round(student.average_score)}%</td>
                          <td className="px-4 py-2 text-center"><span className={`px-2 py-1 text-xs font-bold rounded ${level?.color || 'bg-gray-100'}`}>{level?.code || 'ME1'} - {level?.label || 'Good'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {/* Student Reports Tab */}
      {activeTab === 'students' && (
        !selectedExam ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-yellow-800">No Exam Selected</h3>
            <p className="text-yellow-700 mt-2">Please select an exam from the filter above to generate student reports.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded">
            <div className="border-b border-gray-300 px-5 py-3 bg-gray-50">
              <h2 className="text-md font-bold text-gray-900">Individual Student Reports</h2>
              <p className="text-xs text-gray-500 mt-1">Generate KNEC-Compliant CBE Report Card with 40% SBA + 60% Summative weighting</p>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-2 text-left font-bold">Admission No</th>
                    <th className="px-4 py-2 text-left font-bold">Student Name</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell font-bold">UPI Number</th>
                    <th className="px-4 py-2 text-left hidden sm:table-cell font-bold">Class</th>
                    <th className="px-4 py-2 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-4 py-12 text-center"><Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" /></td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-12 text-center text-gray-400">No students found</td></tr>
                  ) : (
                    students.filter(s => !selectedClass || s.current_class === selectedClass).map(student => (
                      <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-xs">{student.admission_no}</td>
                        <td className="px-4 py-2 font-medium">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-2 hidden md:table-cell text-xs">{student.upi_number || 'N/A'}</td>
                        <td className="px-4 py-2 hidden sm:table-cell">{classes.find(c => c.id === student.current_class)?.class_name || 'N/A'}</td>
                        <td className="px-4 py-2 text-center">
                          <button 
                            onClick={() => fetchStudentReport(student)} 
                            disabled={isGenerating}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400"
                          >
                            {isGenerating && selectedStudent?.id === student.id ? (
                              <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                            ) : (
                              <Eye className="h-3 w-3 inline mr-1" />
                            )}
                            Generate Report
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Bulk Generation Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white border border-gray-300 rounded p-5">
          <h2 className="text-md font-bold text-gray-900 mb-2">Bulk Report Card Generation</h2>
          <p className="text-sm text-gray-600 mb-5">Generate KNEC-compliant CBE report cards for multiple students</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Assessment Period</label>
              <select 
                value={bulkGeneration.examId}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
              >
                <option value="">Select Exam/Term</option>
                {exams.filter(e => e.status === 'published' || e.status === 'archived').map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.title} ({exam.exam_type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Classes (Ctrl/Cmd + Click)</label>
              <select 
                multiple 
                value={bulkGeneration.classIds}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, classIds: Array.from(e.target.selectedOptions, opt => opt.value) })}
                className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white h-28"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Download Format</label>
              <select 
                value={bulkGeneration.fileFormat}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, fileFormat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
              >
                <option value="pdf">PDF (Printable HTML - Save as PDF)</option>
                <option value="excel">Excel Spreadsheet (.xlsx)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">PDF generates complete CBE report cards with all sections</p>
            </div>
          </div>
          
          <div className="mt-5 flex justify-end">
            <button 
              onClick={generateBulkReports} 
              disabled={uploading || !bulkGeneration.examId || bulkGeneration.classIds.length === 0}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Download className="h-4 w-4 inline mr-2" />}
              Generate & Download Reports
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBulkImportModal(false)}>
          <div className="bg-white max-w-md w-full mx-4 border border-gray-400 rounded" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-300 bg-gray-50 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">Bulk Import Results</h3>
              <button onClick={() => setShowBulkImportModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
                <select 
                  value={bulkGeneration.examId}
                  onChange={(e) => setBulkGeneration({ ...bulkGeneration, examId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
                >
                  <option value="">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Excel/CSV File</label>
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Format: student_id, subject, score</p>
              </div>
              <button onClick={downloadTemplate} className="text-sm text-blue-600 hover:text-blue-800 font-bold">Download Template</button>
            </div>
            <div className="px-5 py-3 border-t border-gray-300 bg-gray-50 flex justify-end gap-2 rounded-b">
              <button onClick={() => setShowBulkImportModal(false)} className="px-4 py-2 border border-gray-400 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleBulkUpload} disabled={uploading} className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 disabled:opacity-50">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : <Upload className="h-4 w-4 inline mr-1" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && studentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-auto border border-gray-400 rounded" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-300 px-5 py-3 flex justify-between items-center no-print z-10 rounded-t">
              <h3 className="text-md font-bold text-gray-900">KNEC-Compliant CBE Report Card - JSS (8-Point Scale)</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700">
                  <Printer className="h-3 w-3 inline mr-1" /> Print / Save as PDF
                </button>
                <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
              </div>
            </div>
            
            <div id="report-content" ref={printRef} className="p-6 bg-white">
              {/* School Header */}
              <div className="text-center mb-6 pb-3 border-b-2 border-gray-900">
                <h1 className="text-2xl font-bold text-gray-900 uppercase">JAWABU ACADEMY</h1>
                <p className="text-sm text-gray-600 italic">Excellence in Education</p>
                <p className="text-xs text-gray-500 mt-2 font-bold">COMPETENCY-BASED EDUCATION (CBE) ASSESSMENT REPORT</p>
                <p className="text-xs text-gray-500">KNEC-Compliant Junior Secondary School (JSS) Report Card</p>
              </div>

              {/* Student Biodata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 border border-gray-300 mb-5 rounded">
                <div><p className="text-xs text-gray-500 font-bold uppercase">Full Name</p><p className="font-bold text-gray-900">{studentReport.student.name}</p></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">UPI Number</p><p className="font-bold text-gray-900">{studentReport.student.upi_number}</p></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Grade/Class</p><p className="font-bold text-gray-900">{studentReport.student.class_name}</p></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Admission No</p><p className="font-bold text-gray-900">{studentReport.student.admission_no}</p></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Year & Term</p><p className="font-bold text-gray-900">{studentReport.exam.academic_year} - {studentReport.exam.term}</p></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Gender</p><p className="font-bold text-gray-900">{studentReport.student.gender}</p></div>
              </div>

              {/* SBA Scores Section */}
              {studentReport.sba_scores && studentReport.sba_scores.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">School-Based Assessment (SBA) / CAT Scores (40% Weight)</h3>
                  <div className="flex flex-wrap gap-3">
                    {studentReport.sba_scores.map((sba, idx) => (
                      <div key={idx} className="bg-white px-3 py-1 rounded border border-blue-300">
                        <span className="font-medium">{sba.exam_title}:</span>
                        <span className="ml-1 font-bold text-green-700">{sba.score}%</span>
                        <span className="text-xs text-gray-500 ml-1">({sba.marks}/{sba.total_marks || 100})</span>
                      </div>
                    ))}
                    {studentReport.avg_sba_score && (
                      <div className="bg-green-100 px-3 py-1 rounded border border-green-300">
                        <span className="font-medium">Average SBA:</span>
                        <span className="ml-1 font-bold text-green-800">{studentReport.avg_sba_score}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summative Academic Analysis */}
              <div className="mb-5">
                <h3 className="text-md font-bold text-gray-800 mb-2">Summative Tracking Analysis (40/60 Rule)</h3>
                <p className="text-xs text-gray-500 mb-2">SBA (School-Based Assessment): 40% | Summative (End of Term): 60% = Total Score (100%)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">Learning Area</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold">SBA Score (40%)</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold">Summative Score (60%)</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold">Total (100%)</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold">Achievement Level</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">Teacher's Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentReport.subjects.map((subject, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium">{subject.subject}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">{subject.sba_score !== null ? `${subject.sba_score}%` : '-'}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">{subject.exam_score !== null ? `${subject.exam_score}%` : '-'}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-bold">{subject.total !== null ? `${subject.total}%` : '-'}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {subject.level && (
                              <span className={`px-2 py-1 text-xs font-bold rounded ${subject.level.color}`}>
                                {subject.grade_code} - {subject.level.label}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-600">
                            {subject.exam_score ? 'Satisfactory progress' : 'Not yet assessed'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-bold">
                        <td className="border border-gray-300 px-3 py-2">Overall Average</td>
                        <td colSpan="2" className="border border-gray-300 px-3 py-2 text-center">-</td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-lg">{studentReport.summary.average_score}%</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${studentReport.summary.level?.color}`}>
                            {studentReport.summary.grade_code} - {studentReport.summary.level?.label}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Core Competencies with Circular Ribbons */}
              {studentReport.competencies && studentReport.competencies.length > 0 && (
                <div className="mb-5 border border-gray-300 rounded p-4">
                  <h3 className="text-md font-bold text-gray-800 mb-3">Core Competencies Assessment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {studentReport.competencies.map(comp => (
                      <CircularRibbon
                        key={comp.id}
                        percentage={comp.score || 0}
                        label={comp.name}
                        code={comp.code}
                        assessed={comp.assessed}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bars for Subject Performance */}
              <div className="mb-5 border border-gray-300 rounded p-4">
                <h3 className="text-md font-bold text-gray-800 mb-3">Subject Performance Summary</h3>
                {studentReport.subjects.map((subject, idx) => (
                  <ProgressBar
                    key={idx}
                    percentage={subject.total || 0}
                    label={subject.subject}
                  />
                ))}
              </div>

              {/* Career Pathway Recommendation */}
              <div className="mb-5 p-4 bg-gray-50 border border-gray-300 rounded">
                <h3 className="text-md font-bold text-gray-800 mb-2">Career Pathway Recommendation (Grade 9 → 10)</h3>
                <p className="text-sm font-bold text-gray-900">
                  {studentReport.summary.average_score >= 75 ? 'STEM Pathway Recommended' : 
                   studentReport.summary.average_score >= 58 ? 'Social Sciences Pathway Recommended' : 
                   'Arts & Sports Science Pathway Recommended'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Based on performance analysis: {studentReport.summary.average_score}% overall average
                </p>
              </div>

              {/* Teacher's Remarks with Color Border */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 border-l-4 ${
                studentReport.summary.average_score >= 75 ? 'border-l-green-500' :
                studentReport.summary.average_score >= 58 ? 'border-l-blue-500' :
                studentReport.summary.average_score >= 41 ? 'border-l-yellow-500' : 'border-l-red-500'
              } pl-4`}>
                <div className="border border-gray-300 rounded p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Class Teacher's Comment</h3>
                  <p className="text-sm text-gray-700">Student has shown consistent effort throughout the term.</p>
                </div>
                <div className="border border-gray-300 rounded p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Principal's Comment</h3>
                  <p className="text-sm text-gray-700">Satisfactory performance. Keep up the good work.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 pt-3 border-t border-gray-300">
                <p>This is a system-generated KNEC-compliant report card.</p>
                <p>Jawabu E-School Genesis System - CBE Assessment Platform</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsReporting;