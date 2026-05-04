/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  FileText,
  Printer,
  TrendingUp,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Eye,
  RefreshCw,
  Upload,
  GraduationCap,
  Download,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// JSS SCALE (Grades 7-9) - 8 Level KNEC Achievement Scale
const JSS_SCALE = {
  EE1: {
    min: 90,
    max: 100,
    points: 8,
    label: "Exceptional",
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-500",
    bgProgress: "bg-purple-600",
  },
  EE2: {
    min: 75,
    max: 89,
    points: 7,
    label: "Very Good",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-500",
    bgProgress: "bg-green-600",
  },
  ME1: {
    min: 58,
    max: 74,
    points: 6,
    label: "Good",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-500",
    bgProgress: "bg-blue-600",
  },
  ME2: {
    min: 41,
    max: 57,
    points: 5,
    label: "Fair",
    color: "bg-cyan-100 text-cyan-800",
    borderColor: "border-cyan-500",
    bgProgress: "bg-cyan-600",
  },
  AE1: {
    min: 31,
    max: 40,
    points: 4,
    label: "Needs Improvement",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-500",
    bgProgress: "bg-yellow-600",
  },
  AE2: {
    min: 21,
    max: 30,
    points: 3,
    label: "Below Average",
    color: "bg-orange-100 text-orange-800",
    borderColor: "border-orange-500",
    bgProgress: "bg-orange-600",
  },
  BE1: {
    min: 11,
    max: 20,
    points: 2,
    label: "Well Below Average",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-500",
    bgProgress: "bg-red-600",
  },
  BE2: {
    min: 0,
    max: 10,
    points: 1,
    label: "Minimal",
    color: "bg-red-200 text-red-900",
    borderColor: "border-red-700",
    bgProgress: "bg-red-700",
  },
};

const getAchievementLevel = (percentage) => {
  if (percentage === null || percentage === undefined) return null;
  for (const [key, level] of Object.entries(JSS_SCALE)) {
    if (percentage >= level.min && percentage <= level.max)
      return { ...level, code: key };
  }
  return { ...JSS_SCALE.BE2, code: "BE2" };
};

// ── Weighted display helpers ───────────────────────────────────────────────────
// Returns the SBA contribution (raw_sba × 0.40), formatted to 2 dp
const sbaWeighted = (sba_score) =>
  sba_score !== null && sba_score !== undefined
    ? (sba_score * 0.4).toFixed(2)
    : "0.00";

// Returns the summative contribution (raw_summative × 0.60), formatted to 2 dp
const summativeWeighted = (summative_score) =>
  (summative_score * 0.6).toFixed(2);

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
          className={`h-2 rounded-full ${level?.bgProgress || "bg-blue-600"}`}
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
        <p className="text-xs font-medium text-gray-700 mt-2 text-center">
          {label}
        </p>
        <p className="text-xs text-gray-400">{code}</p>
      </div>
    );
  }

  const getRingColor = () => {
    if (percentage >= 90) return "stroke-purple-600";
    if (percentage >= 75) return "stroke-green-600";
    if (percentage >= 58) return "stroke-blue-600";
    if (percentage >= 41) return "stroke-cyan-600";
    if (percentage >= 31) return "stroke-yellow-600";
    if (percentage >= 21) return "stroke-orange-600";
    if (percentage >= 11) return "stroke-red-600";
    return "stroke-red-700";
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
          <span
            className={`text-lg font-bold ${level?.color.split(" ")[1] || "text-blue-600"}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-700 mt-2 text-center">
        {label}
      </p>
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
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!visible) return null;
  const styles = {
    success: "bg-green-50 border-green-300 text-green-800",
    error: "bg-red-50 border-red-300 text-red-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };
  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 rounded shadow-lg ${styles[type]}`}
    >
      <div className="flex items-start">
        {type === "success" && (
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
        )}
        {type === "error" && (
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {type === "success"
              ? "Success"
              : type === "error"
                ? "Error"
                : type === "warning"
                  ? "Warning"
                  : "Info"}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
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
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedClass, setSelectedClass] = useState("");

  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [bulkGeneration, setBulkGeneration] = useState({
    classIds: [],
    fileFormat: "pdf",
    examId: "",
  });

  const [analytics, setAnalytics] = useState({
    total_results: 0,
    average_score: 0,
    pass_rate: 0,
    total_students: 0,
    grade_distribution: {},
    top_performers: [],
    subject_performance: [],
    class_performance: [],
  });

  const printRef = useRef();

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setNotifications((prev) => prev.filter((n) => n.id !== id)),
      5000,
    );
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchAnalytics();
  }, [selectedClass, isAuthenticated]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [classesRes, studentsRes, examsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/classes/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/students/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/exams/`, {
          headers: getAuthHeaders(),
        }),
      ]);
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const examsData = await examsRes.json();

      if (classesData.success) setClasses(classesData.data || []);
      if (studentsData.success) setStudents(studentsData.data || []);
      if (examsData.success) setExams(examsData.data || []);
    } catch (error) {
      addNotification("error", "Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      let url = `${API_BASE_URL}/api/registrar/resultsreport/analytics/`;
      const params = new URLSearchParams();
      if (selectedClass) params.append("class_id", selectedClass);
      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setAnalytics(data.data);
    } catch (error) {
      addNotification("error", "Failed to fetch analytics");
    }
  };

  const fetchStudentCompetencies = async (studentId) => {
    try {
      const termRes = await fetch(
        `${API_BASE_URL}/api/registrar/academic/terms/?is_current=true`,
        { headers: getAuthHeaders() },
      );
      const termData = await termRes.json();
      let termId = null,
        academicYearId = null;
      if (termData.success && termData.data?.length > 0) {
        termId = termData.data[0].id;
        academicYearId = termData.data[0].academic_year?.id;
      }
      const coreCompRes = await fetch(
        `${API_BASE_URL}/api/registrar/academic/core-competencies/`,
        { headers: getAuthHeaders() },
      );
      const coreCompData = await coreCompRes.json();
      const coreCompetencies = coreCompData.success ? coreCompData.data : [];

      let url = `${API_BASE_URL}/api/registrar/academic/student-portfolios/?student=${studentId}`;
      if (termId) url += `&term=${termId}`;
      if (academicYearId) url += `&academic_year=${academicYearId}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();

      const competencyMap = new Map();
      if (data.success && data.data) {
        data.data.forEach((portfolio) => {
          if (portfolio.core_competency) {
            competencyMap.set(portfolio.core_competency.id, {
              score: portfolio.percentage,
              level: portfolio.sub_level,
              level_label: portfolio.rating,
              comment: portfolio.teacher_comment,
            });
          }
        });
      }
      return coreCompetencies.map((comp) => ({
        id: comp.id,
        name: comp.name,
        code: comp.code,
        ...competencyMap.get(comp.id),
        assessed: competencyMap.has(comp.id),
      }));
    } catch (error) {
      console.error("Failed to fetch competencies:", error);
      return [];
    }
  };

  const fetchStudentReport = async (student) => {
    setSelectedStudent(student);
    setIsGenerating(true);
    try {
      const [reportRes, competencies] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/registrar/resultsreport/student/${student.id}/`,
          { headers: getAuthHeaders() },
        ),
        fetchStudentCompetencies(student.id),
      ]);

      const reportData = await reportRes.json();
      if (!reportData.success) {
        addNotification("error", reportData.error || "Failed to fetch report");
        return;
      }

      const d = reportData.data;

      const allTotals = d.exams.flatMap((e) => e.subjects.map((s) => s.total));
      const overallAvg =
        allTotals.length > 0
          ? Math.round(
              (allTotals.reduce((a, b) => a + b, 0) / allTotals.length) * 100,
            ) / 100
          : 0;
      const overallLevel = getAchievementLevel(overallAvg);

      setStudentReport({
        student: d.student,
        sba_results: d.sba_results,
        avg_sba_score: d.avg_sba_score,
        per_subject_sba: d.per_subject_sba || {},
        exams: d.exams,
        summary: {
          average_score: overallAvg,
          level: overallLevel,
          grade_code: overallLevel?.code,
          grade_label: overallLevel?.label,
        },
        competencies,
      });
      setShowReportModal(true);
    } catch (error) {
      addNotification("error", "Failed to fetch student report");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkReports = async () => {
    if (bulkGeneration.classIds.length === 0) {
      addNotification("warning", "Please select at least one class");
      return;
    }
    setUploading(true);
    addNotification(
      "info",
      `Generating reports for ${bulkGeneration.classIds.length} class(es)...`,
    );
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/resultsreport/bulk-generate/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ class_ids: bulkGeneration.classIds }),
        },
      );
      const data = await response.json();

      if (data.success && data.data.reports) {
        if (bulkGeneration.fileFormat === "excel") {
          const exportData = [];
          data.data.reports.forEach((report) => {
            report.exams.forEach((exam) => {
              exam.subjects.forEach((subject) => {
                exportData.push({
                  "Student Name": report.student_name,
                  "Admission No": report.admission_no,
                  Class: report.class_name,
                  Exam: exam.exam_title,
                  Term: exam.term,
                  "Academic Year": exam.academic_year,
                  Subject: subject.subject,
                  // Show weighted contributions in the Excel export too
                  "SBA × 40%": sbaWeighted(subject.sba_score),
                  "Summative × 60%": summativeWeighted(subject.summative_score),
                  "Total Score": subject.total,
                  Grade: subject.grade,
                });
              });
            });
          });
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Reports");
          XLSX.writeFile(
            workbook,
            `bulk_reports_${new Date().toISOString().split("T")[0]}.xlsx`,
          );
          addNotification("success", "Excel file downloaded");
        } else {
          let allReportsHtml = "";
          for (const report of data.data.reports) {
            const allTotals = report.exams.flatMap((e) =>
              e.subjects.map((s) => s.total),
            );
            const overallAvg =
              allTotals.length > 0
                ? Math.round(
                    (allTotals.reduce((a, b) => a + b, 0) /
                      allTotals.length) *
                      100,
                  ) / 100
                : 0;
            const overallLevel = getAchievementLevel(overallAvg);

            const examsHtml = report.exams
              .map((exam) => {
                const examTotals = exam.subjects.map((s) => s.total);
                const examAvg =
                  examTotals.length > 0
                    ? Math.round(
                        (examTotals.reduce((a, b) => a + b, 0) /
                          examTotals.length) *
                          100,
                      ) / 100
                    : 0;
                return `
                <div style="margin-bottom:16px;">
                  <div style="font-size:12px;font-weight:bold;color:#1e40af;margin-bottom:6px;padding:4px 8px;background:#eff6ff;border-left:3px solid #3b82f6;">
                    ${exam.exam_title} — Term ${exam.term}, ${exam.academic_year}
                  </div>
                  <table style="width:100%;border-collapse:collapse;font-size:11px;">
                    <thead>
                      <tr style="background:#f3f4f6;">
                        <th style="border:1px solid #ddd;padding:6px 8px;text-align:left;">Learning Area</th>
                        <th style="border:1px solid #ddd;padding:6px 8px;text-align:center;">SBA × 40%</th>
                        <th style="border:1px solid #ddd;padding:6px 8px;text-align:center;">Summative × 60%</th>
                        <th style="border:1px solid #ddd;padding:6px 8px;text-align:center;">Total (= sum)</th>
                        <th style="border:1px solid #ddd;padding:6px 8px;text-align:center;">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${exam.subjects
                        .map(
                          (s) => `
                        <tr>
                          <td style="border:1px solid #ddd;padding:6px 8px;">${s.subject}</td>
                          <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">
                            ${s.sba_score !== null && s.sba_score !== undefined
                              ? (s.sba_score * 0.4).toFixed(2)
                              : '<span style="color:#aaa;font-style:italic;">0.00</span>'}
                          </td>
                          <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">${(s.summative_score * 0.6).toFixed(2)}</td>
                          <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;font-weight:bold;">${s.total}</td>
                          <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;font-weight:bold;">${s.grade}</td>
                        </tr>
                      `,
                        )
                        .join("")}
                      <tr style="background:#f9fafb;font-weight:bold;">
                        <td style="border:1px solid #ddd;padding:6px 8px;">Exam Average</td>
                        <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">—</td>
                        <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">—</td>
                        <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">${examAvg}</td>
                        <td style="border:1px solid #ddd;padding:6px 8px;text-align:center;">${getAchievementLevel(examAvg)?.code || ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              `;
              })
              .join("");

            allReportsHtml += `
              <div style="page-break-after:always;font-family:Arial,sans-serif;padding:20px;">
                <div style="text-align:center;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #000;">
                  <div style="font-size:22px;font-weight:bold;">JAWABU SCHOOL</div>
                  <div style="font-size:11px;color:#666;margin-top:2px;">Striving For Excellence</div>
                  <div style="font-size:13px;font-weight:bold;margin-top:10px;">COMPETENCY-BASED EDUCATION (CBE) ASSESSMENT REPORT</div>
                  <div style="font-size:10px;color:#666;">KNEC-Compliant Junior Secondary School (JSS) Report Card</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:10px;background:#f5f5f5;margin-bottom:16px;border:1px solid #ddd;">
                  <div><div style="font-size:9px;font-weight:bold;color:#666;">Full Name</div><div style="font-size:13px;font-weight:bold;">${report.student_name}</div></div>
                  <div><div style="font-size:9px;font-weight:bold;color:#666;">Admission No</div><div style="font-size:13px;">${report.admission_no}</div></div>
                  <div><div style="font-size:9px;font-weight:bold;color:#666;">Class</div><div style="font-size:13px;">${report.class_name}</div></div>
                  <div><div style="font-size:9px;font-weight:bold;color:#666;">UPI Number</div><div style="font-size:13px;">${report.upi_number}</div></div>
                  <div><div style="font-size:9px;font-weight:bold;color:#666;">Gender</div><div style="font-size:13px;">${report.gender}</div></div>
                </div>
                <div style="margin-bottom:16px;">
                  <div style="font-size:13px;font-weight:bold;margin-bottom:10px;">Summative Results (All Exams)</div>
                  ${examsHtml}
                </div>
                <div style="padding:10px;background:#f9fafb;border:1px solid #e5e7eb;margin-bottom:16px;">
                  <div style="font-size:12px;font-weight:bold;">Overall Average: ${overallAvg} — ${overallLevel?.code || "N/A"} (${overallLevel?.label || ""})</div>
                  <div style="font-size:11px;color:#666;margin-top:4px;">
                    ${overallAvg >= 75 ? "STEM Pathway Recommended" : overallAvg >= 58 ? "Social Sciences Pathway Recommended" : "Arts & Sports Science Pathway Recommended"}
                  </div>
                </div>
                <div style="text-align:center;font-size:9px;color:#999;padding-top:8px;border-top:1px solid #ddd;">
                  System-generated KNEC-compliant report — Jawabu E-School Genesis CBE Platform
                </div>
              </div>
            `;
          }

          const fullHtml = `<!DOCTYPE html><html><head><title>Bulk CBE Report Cards</title>
            <style>@media print{body{margin:0;padding:0;}.report{page-break-after:always;}}
            *{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:white;}</style>
            </head><body>${allReportsHtml}</body></html>`;

          const blob = new Blob([fullHtml], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `bulk_reports_${new Date().toISOString().split("T")[0]}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          addNotification(
            "success",
            "HTML report generated. Open and use Ctrl+P to save as PDF.",
          );
        }
      } else {
        addNotification("error", data.error || "Failed to generate reports");
      }
    } catch (error) {
      addNotification("error", "Failed to generate bulk reports");
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile || !bulkGeneration.examId) {
      addNotification("warning", "Please select exam and file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("exam_id", bulkGeneration.examId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/resultsreport/bulk-upload/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Uploaded ${data.saved_count} results successfully`,
        );
        setShowBulkImportModal(false);
        setUploadFile(null);
        fetchAnalytics();
      } else {
        addNotification("error", data.error || "Failed to upload results");
      }
    } catch (error) {
      addNotification("error", "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent =
      document.getElementById("report-content")?.innerHTML || "";
    printWindow.document.write(`
      <html><head><title>Student Report Card</title>
      <style>@media print{body{margin:0;padding:0;}}*{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:Arial,sans-serif;padding:20px;background:white;}
      .report-container{max-width:210mm;margin:0 auto;}</style>
      </head><body><div class="report-container">${printContent}</div>
      <script>window.print();</script></body></html>`);
    printWindow.document.close();
  };

  const downloadTemplate = () => {
    const template = [
      { student_id: "ADM001", subject: "Mathematics", score: 85 },
      { student_id: "ADM001", subject: "English", score: 78 },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "cbe_results_template.xlsx");
    addNotification("success", "Template downloaded");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to access the results reporting system
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const filteredStudents = students.filter(
    (s) => !selectedClass || s.current_class === selectedClass,
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id),
            )
          }
        />
      ))}

      {/* Header */}
      <div className="mb-6 bg-green-700 p-5 rounded">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              KNEC-Compliant Report Card System
            </h1>
            <p className="text-green-100 mt-1">
              Competency-Based Education (CBE) Assessment Reporting
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkImportModal(true)}
              className="px-4 py-2 bg-white text-green-700 text-sm font-medium rounded hover:bg-gray-100"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Bulk Import
            </button>
            <button
              onClick={fetchInitialData}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1 border-b border-gray-300 pb-3">
        {[
          { id: "analytics", label: "School Analytics", icon: BarChart3 },
          { id: "students", label: "Student Reports", icon: GraduationCap },
          { id: "bulk", label: "Bulk Generation", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
          >
            <tab.icon className="h-4 w-4 inline mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Class filter */}
      <div className="bg-white border border-gray-300 rounded p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Grade / Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-400 rounded bg-white"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSelectedClass("")}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* ── Analytics Tab ──────────────────────────────────────────────────────── */}
      {activeTab === "analytics" &&
        (isLoading ? (
          <LoadingSpinner message="Loading analytics data..." />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              {[
                {
                  label: "Average Score",
                  value: `${Math.round(analytics.average_score)}%`,
                  icon: TrendingUp,
                },
                {
                  label: "Pass Rate",
                  value: `${Math.round(analytics.pass_rate)}%`,
                  icon: CheckCircle,
                },
                {
                  label: "Total Students",
                  value: analytics.total_students,
                  icon: Users,
                },
                {
                  label: "Total Results",
                  value: analytics.total_results,
                  icon: FileText,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-300 rounded p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-300 rounded mb-5">
              <div className="border-b border-gray-300 px-5 py-3 bg-gray-50">
                <h2 className="text-md font-bold text-gray-900">
                  Performance Level Distribution (JSS 8-Point Scale)
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {Object.entries(JSS_SCALE).map(([key, level]) => (
                    <div
                      key={key}
                      className="text-center p-2 border border-gray-300 rounded"
                    >
                      <div
                        className={`${level.color} px-2 py-1 font-bold text-sm rounded`}
                      >
                        {key}
                      </div>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {analytics.grade_distribution?.[key] || 0}
                      </p>
                      <p className="text-xs text-gray-500">{level.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded mb-5">
              <div className="border-b border-gray-300 px-5 py-3 bg-gray-50">
                <h2 className="text-md font-bold text-gray-900">
                  Top Performing Students
                </h2>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-300">
                      <th className="px-4 py-2 text-left font-bold">
                        Student Name
                      </th>
                      <th className="px-4 py-2 text-left font-bold">
                        Admission No
                      </th>
                      <th className="px-4 py-2 text-center font-bold">
                        Average Score
                      </th>
                      <th className="px-4 py-2 text-center font-bold">
                        Performance Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.top_performers?.map((student, idx) => {
                      const level = getAchievementLevel(student.average_score);
                      return (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">{student.name}</td>
                          <td className="px-4 py-2">{student.admission_no}</td>
                          <td className="px-4 py-2 text-center font-bold text-green-700">
                            {Math.round(student.average_score)}%
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded ${level?.color || "bg-gray-100"}`}
                            >
                              {level?.code || "ME1"} - {level?.label || "Good"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

      {/* ── Student Reports Tab ───────────────────────────────────────────────── */}
      {activeTab === "students" && (
        <div className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 px-5 py-3 bg-gray-50">
            <h2 className="text-md font-bold text-gray-900">
              Individual Student Reports
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Full report card: per-subject SBA avg × 40% + summative × 60% =
              Total. Subjects with no SBA count 0 for the 40% component.
            </p>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-2 text-left font-bold">
                    Admission No
                  </th>
                  <th className="px-4 py-2 text-left font-bold">
                    Student Name
                  </th>
                  <th className="px-4 py-2 text-left hidden md:table-cell font-bold">
                    UPI Number
                  </th>
                  <th className="px-4 py-2 text-left hidden sm:table-cell font-bold">
                    Class
                  </th>
                  <th className="px-4 py-2 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 font-mono text-xs">
                        {student.admission_no}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell text-xs">
                        {student.upi_number || "N/A"}
                      </td>
                      <td className="px-4 py-2 hidden sm:table-cell">
                        {classes.find((c) => c.id === student.current_class)
                          ?.class_name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => fetchStudentReport(student)}
                          disabled={isGenerating}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400"
                        >
                          {isGenerating &&
                          selectedStudent?.id === student.id ? (
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
      )}

      {/* ── Bulk Generation Tab ───────────────────────────────────────────────── */}
      {activeTab === "bulk" && (
        <div className="bg-white border border-gray-300 rounded p-5">
          <h2 className="text-md font-bold text-gray-900 mb-2">
            Bulk Report Card Generation
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            Generate full CBE report cards (per-subject SBA + all summative
            exams) for multiple students at once
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Classes (Ctrl/Cmd + Click)
              </label>
              <select
                multiple
                value={bulkGeneration.classIds}
                onChange={(e) =>
                  setBulkGeneration({
                    ...bulkGeneration,
                    classIds: Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value,
                    ),
                  })
                }
                className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white h-28"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Download Format
              </label>
              <select
                value={bulkGeneration.fileFormat}
                onChange={(e) =>
                  setBulkGeneration({
                    ...bulkGeneration,
                    fileFormat: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
              >
                <option value="pdf">PDF (Printable HTML — save as PDF)</option>
                <option value="excel">Excel Spreadsheet (.xlsx)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                PDF generates complete CBE report cards with all exam sections
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={generateBulkReports}
              disabled={uploading || bulkGeneration.classIds.length === 0}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                <Download className="h-4 w-4 inline mr-2" />
              )}
              Generate & Download Reports
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk Import Modal ─────────────────────────────────────────────────── */}
      {showBulkImportModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBulkImportModal(false)}
        >
          <div
            className="bg-white max-w-md w-full mx-4 border border-gray-400 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-gray-300 bg-gray-50 flex justify-between items-center rounded-t">
              <h3 className="text-md font-bold text-gray-900">
                Bulk Import Results
              </h3>
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Exam
                </label>
                <select
                  value={bulkGeneration.examId}
                  onChange={(e) =>
                    setBulkGeneration({
                      ...bulkGeneration,
                      examId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
                >
                  <option value="">Select Exam</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Upload Excel/CSV File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: student_id, subject, score
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="text-sm text-blue-600 hover:text-blue-800 font-bold"
              >
                Download Template
              </button>
            </div>
            <div className="px-5 py-3 border-t border-gray-300 bg-gray-50 flex justify-end gap-2 rounded-b">
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="px-4 py-2 border border-gray-400 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                ) : (
                  <Upload className="h-4 w-4 inline mr-1" />
                )}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Student Report Modal ──────────────────────────────────────────────── */}
      {showReportModal && studentReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-white max-w-5xl w-full max-h-[90vh] overflow-auto border border-gray-400 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-300 px-5 py-3 flex justify-between items-center z-10 rounded-t">
              <h3 className="text-md font-bold text-gray-900">
                KNEC-Compliant CBE Report Card — Full History
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700"
                >
                  <Printer className="h-3 w-3 inline mr-1" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div id="report-content" ref={printRef} className="p-6 bg-white">
              {/* School Header */}
              <div className="text-center mb-6 pb-3 border-b-2 border-gray-900">
                <h1 className="text-2xl font-bold text-gray-900 uppercase">
                  JAWABU ACADEMY
                </h1>
                <p className="text-sm text-gray-600 italic">
                  Excellence in Education
                </p>
                <p className="text-xs text-gray-500 mt-2 font-bold">
                  COMPETENCY-BASED EDUCATION (CBE) ASSESSMENT REPORT
                </p>
                <p className="text-xs text-gray-500">
                  KNEC-Compliant Junior Secondary School (JSS) Report Card
                </p>
              </div>

              {/* Student Biodata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 border border-gray-300 mb-5 rounded">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Full Name
                  </p>
                  <p className="font-bold text-gray-900">
                    {studentReport.student.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    UPI Number
                  </p>
                  <p className="font-bold text-gray-900">
                    {studentReport.student.upi_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Grade / Class
                  </p>
                  <p className="font-bold text-gray-900">
                    {studentReport.student.class_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Admission No
                  </p>
                  <p className="font-bold text-gray-900">
                    {studentReport.student.admission_no}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Gender
                  </p>
                  <p className="font-bold text-gray-900">
                    {studentReport.student.gender}
                  </p>
                </div>
                
              </div>

              

              {/* Summative Results per Exam */}
              {studentReport.exams && studentReport.exams.length > 0 ? (
                <div className="mb-5">
                  <h3 className="text-md font-bold text-gray-800 mb-3">
                    Summative Tracking Analysis — All Exams (40/60 Rule)
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    SBA × 40% + Summative × 60% = Total. The two weighted
                    columns always add up to the Total. Subjects with no SBA
                    show 0.00 for the 40% component.
                  </p>
                  {studentReport.exams.map((exam, examIdx) => (
                    <div
                      key={examIdx}
                      className="mb-5 border border-gray-200 rounded overflow-hidden"
                    >
                      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
                        <span>{exam.exam_title}</span>
                        <span className="text-blue-200 text-xs font-normal">
                          Term {exam.term} · {exam.academic_year} ·{" "}
                          {exam.exam_type}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                                Learning Area
                              </th>
                              {/* ── CHANGED: headers now state the weighted contribution ── */}
                              <th className="border border-gray-300 px-3 py-2 text-center font-bold">
                                SBA × 40%
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-center font-bold">
                                Summative × 60%
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-center font-bold">
                                Total (= sum)
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-center font-bold">
                                Achievement Level
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                                Remark
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {exam.subjects.map((subject, idx) => {
                              const level = getAchievementLevel(subject.total);
                              return (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-3 py-2 font-medium">
                                    {subject.subject}
                                  </td>

                                  {/* ── CHANGED: display raw_sba × 0.40, or 0.00 if no SBA ── */}
                                  <td className="border border-gray-300 px-3 py-2 text-center">
                                    {subject.sba_score !== null &&
                                    subject.sba_score !== undefined ? (
                                      <span className="font-medium">
                                        {sbaWeighted(subject.sba_score)}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic text-xs">
                                        0.00
                                      </span>
                                    )}
                                  </td>

                                  {/* ── CHANGED: display raw_summative × 0.60 ── */}
                                  <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                                    {summativeWeighted(subject.summative_score)}
                                  </td>

                                  <td className="border border-gray-300 px-3 py-2 text-center font-bold text-lg">
                                    {subject.total}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-center">
                                    {level && (
                                      <span
                                        className={`px-2 py-1 text-xs font-bold rounded ${level.color}`}
                                      >
                                        {subject.grade_code} —{" "}
                                        {subject.grade_label}
                                      </span>
                                    )}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-gray-500 text-xs">
                                    { subject.total >= 58 ? (
                                      "Satisfactory progress"
                                    ) : subject.total >= 41 ? (
                                      "Needs more effort"
                                    ) : (
                                      "Requires intervention"
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-100 font-bold">
                              <td className="border border-gray-300 px-3 py-2">
                                Exam Average
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center text-gray-400">
                                —
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center text-gray-400">
                                —
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center text-lg text-blue-700">
                                {exam.summary.average_score}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center">
                                <span
                                  className={`px-2 py-1 text-xs font-bold rounded ${getAchievementLevel(exam.summary.average_score)?.color || "bg-gray-100"}`}
                                >
                                  {exam.summary.grade_code} —{" "}
                                  {exam.summary.grade_label}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-3 py-2"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  No summative exam results found for this student yet.
                </div>
              )}

              {/* Subject Progress Summary (across all exams) */}
              {studentReport.exams &&
                studentReport.exams.length > 0 &&
                (() => {
                  const subjectMap = {};
                  studentReport.exams.forEach((exam) => {
                    exam.subjects.forEach((s) => {
                      if (!subjectMap[s.subject]) subjectMap[s.subject] = [];
                      if (s.total !== null) subjectMap[s.subject].push(s.total);
                    });
                  });
                  return (
                    <div className="mb-5 border border-gray-300 rounded p-4">
                      <h3 className="text-md font-bold text-gray-800 mb-3">
                        Subject Performance Summary (All-Time Average)
                      </h3>
                      {Object.entries(subjectMap).map(([subj, totals]) => {
                        const avg = Math.round(
                          totals.reduce((a, b) => a + b, 0) / totals.length,
                        );
                        return (
                          <ProgressBar
                            key={subj}
                            percentage={avg}
                            label={subj}
                          />
                        );
                      })}
                    </div>
                  );
                })()}

              {/* Core Competencies */}
              {studentReport.competencies &&
                studentReport.competencies.length > 0 && (
                  <div className="mb-5 border border-gray-300 rounded p-4">
                    <h3 className="text-md font-bold text-gray-800 mb-3">
                      Core Competencies Assessment
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {studentReport.competencies.map((comp) => (
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

              {/* Overall Summary + Career Pathway */}
              <div
                className={`mb-5 p-4 border-l-4 rounded ${
                  studentReport.summary.average_score >= 75
                    ? "border-l-green-500 bg-green-50"
                    : studentReport.summary.average_score >= 58
                      ? "border-l-blue-500 bg-blue-50"
                      : studentReport.summary.average_score >= 41
                        ? "border-l-yellow-500 bg-yellow-50"
                        : "border-l-red-500 bg-red-50"
                }`}
              >
                <h3 className="text-md font-bold text-gray-800 mb-1">
                  Overall Summary
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  {studentReport.summary.average_score}
                  <span
                    className={`ml-3 text-sm px-2 py-1 rounded ${studentReport.summary.level?.color || "bg-gray-100"}`}
                  >
                    {studentReport.summary.grade_code} —{" "}
                    {studentReport.summary.grade_label}
                  </span>
                </p>
                <p className="text-sm font-bold text-gray-700 mt-2">
                  Career Pathway:{" "}
                  {studentReport.summary.average_score >= 75
                    ? "STEM Pathway Recommended"
                    : studentReport.summary.average_score >= 58
                      ? "Social Sciences Pathway Recommended"
                      : "Arts & Sports Science Pathway Recommended"}
                </p>
              </div>

              {/* Teacher / Principal Comments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="border border-gray-300 rounded p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    Class Teacher's Comment
                  </h3>
                  <p className="text-sm text-gray-700">
                    Student has shown consistent effort throughout the term.
                  </p>
                </div>
                <div className="border border-gray-300 rounded p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    Principal's Comment
                  </h3>
                  <p className="text-sm text-gray-700">
                    Satisfactory performance. Keep up the good work.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 pt-3 border-t border-gray-300">
                <p>This is a system-generated KNEC-compliant report card.</p>
                <p>Jawabu E-School Genesis System — CBE Assessment Platform</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsReporting;