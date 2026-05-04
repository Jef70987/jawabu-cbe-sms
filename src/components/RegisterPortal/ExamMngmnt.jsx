/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EXAM_STATUS = {
  draft: {
    value: "draft",
    label: "Draft",
    color: "bg-gray-100 text-gray-800",
    next: ["scheduled", "cancelled"],
  },
  scheduled: {
    value: "scheduled",
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800",
    next: ["live", "cancelled"],
  },
  live: {
    value: "live",
    label: "Live",
    color: "bg-green-100 text-green-800",
    next: ["marking", "cancelled"],
  },
  marking: {
    value: "marking",
    label: "Marking",
    color: "bg-yellow-100 text-yellow-800",
    next: ["moderation", "published"],
  },
  moderation: {
    value: "moderation",
    label: "Moderation",
    color: "bg-purple-100 text-purple-800",
    next: ["published"],
  },
  published: {
    value: "published",
    label: "Published",
    color: "bg-indigo-100 text-indigo-800",
    next: ["archived"],
  },
  archived: {
    value: "archived",
    label: "Archived",
    color: "bg-gray-100 text-gray-800",
    next: [],
  },
  cancelled: {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    next: [],
  },
};

const EXAM_TYPES = [
  { value: "cba", label: "Classroom-Based Assessment (CBA)" },
  { value: "sba", label: "School-Based Assessment (SBA)" },
  { value: "cat", label: "Continuous Assessment Test (CAT)" },
  { value: "end_term", label: "End of Term Exam" },
  { value: "mock", label: "Mock Exam" },
  { value: "kpsea", label: "KPSEA (Grade 6)" },
  { value: "kjsea", label: "KJSEA (Grade 9)" },
];

// Statuses in which the "Assign Markers" button is visible
const MARKER_VISIBLE_STATUSES = new Set([
  "scheduled",
  "live",
  "marking",
  "moderation",
  "published",
]);

// ── Filter exam types based on selected grade level ──────────────────────────
const getAvailableExamTypes = (gradeLevelId, gradeLevels) => {
  const gradeObj = gradeLevels.find(
    (gl) => String(gl.id) === String(gradeLevelId),
  );

  let numericGrade = null;
  if (gradeObj) {
    // Parse "Grade 6" / "Grade 9" from name — NOT gl.level which counts PP1/PP2
    const raw = gradeObj.display_name || gradeObj.name || "";
    const match = raw.match(/grade\s*(\d+)/i);
    if (match) numericGrade = parseInt(match[1], 10);
  }

  let available = EXAM_TYPES.filter(
    (t) => !["kpsea", "kjsea"].includes(t.value),
  );
  if (numericGrade === 6)
    available.push(EXAM_TYPES.find((t) => t.value === "kpsea"));
  if (numericGrade === 9)
    available.push(EXAM_TYPES.find((t) => t.value === "kjsea"));
  return available;
};

function ExamManagement() {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [scheduleFilterDate, setScheduleFilterDate] = useState("");
  const [scheduleFilterSubject, setScheduleFilterSubject] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [scheduleCurrentPage, setScheduleCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [showExamModal, setShowExamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [markingData, setMarkingData] = useState({});
  const [moderationData, setModerationData] = useState({});
  const [permissions, setPermissions] = useState({
    schoolWide: false,
    gradeLevels: {},
    subjectTeachers: {},
    autoPublish: false,
    requireModeration: true,
  });
  const [scheduledLock, setScheduledLock] = useState({
    enabled: false,
    lockUntil: "",
  });

  // ── Notification component ────────────────────────────────────────────────
  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }, [onClose]);
    const styles = {
      success: "bg-green-50 border-green-400 text-green-800",
      error: "bg-red-50 border-red-400 text-red-800",
      warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
      info: "bg-blue-50 border-blue-400 text-blue-800",
    };
    return (
      <div
        className={`fixed top-4 right-4 z-50 max-w-md w-full border p-4 bg-white shadow-lg animate-slide-in ${styles[type]}`}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };
  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification("error", "Please login to access exam management");
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [exams, searchTerm, selectedStatus, selectedExamType]);
  useEffect(() => {
    applyScheduleFilters();
  }, [
    allSchedules,
    scheduleSearchTerm,
    scheduleFilterDate,
    scheduleFilterSubject,
  ]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        examsRes,
        classesRes,
        teachersRes,
        subjectsRes,
        gradeLevelsRes,
        schedulesRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/exams/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/classes/teachers/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/classes/subjects/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/exams/grade-levels/`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/registrar/exams/all-schedules/`, {
          headers: getAuthHeaders(),
        }),
      ]);

      const examsData = await examsRes.json();
      if (examsData.success) {
        const examsWithMarkers = await Promise.all(
          (examsData.data || []).map(async (exam) => {
            const markersRes = await fetch(
              `${API_BASE_URL}/api/registrar/exams/getmarkers/${exam.id}/`,
              { headers: getAuthHeaders() },
            );
            const markersData = await markersRes.json();
            return {
              ...exam,
              markers: markersData.success ? markersData.data : [],
            };
          }),
        );
        setExams(examsWithMarkers);
      }

      const classesData = await classesRes.json();
      if (classesData.success) setClasses(classesData.data || []);

      const teachersData = await teachersRes.json();
      if (teachersData.success) setTeachers(teachersData.data || []);

      const subjectsData = await subjectsRes.json();
      if (subjectsData.success) setSubjects(subjectsData.data || []);

      const gradeLevelsData = await gradeLevelsRes.json();
      if (gradeLevelsData.success) setGradeLevels(gradeLevelsData.data || []);

      const schedulesData = await schedulesRes.json();
      if (schedulesData.success) setAllSchedules(schedulesData.data || []);
    } catch {
      addNotification("error", "Failed to connect to backend server");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Filters ───────────────────────────────────────────────────────────────
  const applyFilters = () => {
    let filtered = [...exams];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title?.toLowerCase().includes(t) ||
          e.exam_code?.toLowerCase().includes(t),
      );
    }
    if (selectedStatus)
      filtered = filtered.filter((e) => e.status === selectedStatus);
    if (selectedExamType)
      filtered = filtered.filter((e) => e.exam_type === selectedExamType);
    setFilteredExams(filtered);
    setCurrentPage(1);
  };

  const applyScheduleFilters = () => {
    let filtered = [...allSchedules];
    if (scheduleSearchTerm) {
      const t = scheduleSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.exam_title?.toLowerCase().includes(t) ||
          s.exam_code?.toLowerCase().includes(t) ||
          s.subject?.toLowerCase().includes(t),
      );
    }
    if (scheduleFilterDate)
      filtered = filtered.filter((s) => s.date === scheduleFilterDate);
    if (scheduleFilterSubject)
      filtered = filtered.filter((s) => s.subject === scheduleFilterSubject);
    setFilteredSchedules(filtered);
    setScheduleCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedExamType("");
  };
  const clearScheduleFilters = () => {
    setScheduleSearchTerm("");
    setScheduleFilterDate("");
    setScheduleFilterSubject("");
  };

  // ── Pagination ─────────────────────────────────────────────────────────────
  const getPaginatedItems = () => {
    const s = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(s, s + itemsPerPage);
  };
  const getPaginatedSchedules = () => {
    const s = (scheduleCurrentPage - 1) * itemsPerPage;
    return filteredSchedules.slice(s, s + itemsPerPage);
  };
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const scheduleTotalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getExamSchedules = (exam) =>
    allSchedules.filter((s) => String(s.exam_id) === String(exam.id));
  const examHasSchedules = (exam) => getExamSchedules(exam).length > 0;
  const canEdit = (status) => status === "draft" || status === "scheduled";

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const createExam = () => {
    setSelectedExam(null);
    setEditFormData({
      exam_code: "",
      title: "",
      exam_type: "",
      academic_year: new Date().getFullYear(),
      term: 1,
      grade_level: "",
      start_date: "",
      end_date: "",
      duration_minutes: 180,
      total_marks: 100,
      passing_marks: 50,
      status: "draft",
      instructions: "",
      subjects: [],
      classes: [],
      marking_scheme: "",
      weighting: {},
      room_allocation: [],
      invigilators: [],
    });
    setShowExamModal(true);
  };

  const editExam = (exam) => {
    setSelectedExam(exam);
    setEditFormData({
      id: exam.id,
      exam_code: exam.exam_code,
      title: exam.title,
      exam_type: exam.exam_type,
      academic_year: exam.academic_year,
      term: exam.term,
      grade_level: exam.grade_level,
      start_date: exam.start_date || "",
      end_date: exam.end_date || "",
      duration_minutes: exam.duration_minutes,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      status: exam.status,
      instructions: exam.instructions || "",
      subjects: exam.subjects || [],
      classes: exam.classes || [],
      marking_scheme: exam.marking_scheme || "",
      weighting: exam.weighting || {},
      room_allocation: exam.room_allocation || [],
      invigilators: exam.invigilators || [],
    });
    setShowExamModal(true);
  };

  const saveExam = async () => {
    try {
      const url = selectedExam
        ? `${API_BASE_URL}/api/registrar/exams/update/${selectedExam.id}/`
        : `${API_BASE_URL}/api/registrar/exams/create/`;
      const method = selectedExam ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (data.success) {
        addNotification(
          "success",
          `Exam ${selectedExam ? "updated" : "created"} successfully!`,
        );
        await fetchData();
        setShowExamModal(false);
      } else {
        addNotification(
          "error",
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || "Failed to save exam",
        );
      }
    } catch {
      addNotification("error", "Failed to save exam.");
    }
  };

  const updateExamStatus = async (examId, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/update/${examId}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification(
          "success",
          `Status updated to ${EXAM_STATUS[newStatus]?.label || newStatus}`,
        );
        await fetchData();
      } else {
        addNotification(
          "error",
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || "Failed to update status",
        );
      }
    } catch {
      addNotification("error", "Failed to update status.");
    }
  };

  const openScheduleModal = (exam) => {
    setSelectedExam(exam);
    const existing = getExamSchedules(exam).map((s) => ({
      subject: s.subject || "",
      date: typeof s.date === "string" ? s.date : "",
      start_time: typeof s.start_time === "string" ? s.start_time : "",
      end_time: typeof s.end_time === "string" ? s.end_time : "",
      room: s.room || "",
      invigilator: s.invigilator || "",
    }));
    setSchedules(existing.length > 0 ? existing : []);
    setShowScheduleModal(true);
  };

  const saveSchedule = async () => {
    const formatted = schedules.map((s) => ({
      subject: s.subject,
      date: s.date,
      start_time: s.start_time,
      end_time: s.end_time,
      room: s.room || "",
      invigilator: s.invigilator || null,
      class_id: selectedExam.classes?.[0] || "",
    }));
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/schedule/${selectedExam.id}/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ schedules: formatted }),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Schedule saved successfully");
        setShowScheduleModal(false);
        await fetchData();
      } else {
        addNotification("error", data.error || "Failed to save schedule");
      }
    } catch {
      addNotification("error", "Failed to save schedule.");
    }
  };

  const openMarkingModal = (exam) => {
    const fullExam = exams.find((e) => e.id === exam.id) || exam;
    setSelectedExam(fullExam);
    const initial = {};
    (fullExam.subjects || []).forEach((subject) => {
      const assigned = (fullExam.markers || [])
        .filter((m) => m.subject === subject)
        .map((m) => String(m.id));
      initial[subject] = assigned;
    });
    setMarkingData(initial);
    setShowMarkingModal(true);
  };

  const assignMarkers = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/markers/${selectedExam.id}/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(markingData),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Markers assigned successfully");
        setShowMarkingModal(false);
        await fetchData();
      } else {
        addNotification("error", data.error || "Failed to assign markers");
      }
    } catch {
      addNotification("error", "Failed to assign markers.");
    }
  };

  const openModerationModal = (exam) => {
    setSelectedExam(exam);
    setModerationData({});
    setShowModerationModal(true);
  };

  const submitModeration = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/moderate/${selectedExam.id}/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(moderationData),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Moderation completed successfully");
        setShowModerationModal(false);
        await fetchData();
      } else {
        addNotification("error", data.error || "Failed to submit moderation");
      }
    } catch {
      addNotification("error", "Failed to submit moderation.");
    }
  };

  const openPermissionModal = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/permissions/global/`,
        { headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (data.success && data.data) {
        setPermissions({
          schoolWide: data.data.school_wide_mark_uploading || false,
          gradeLevels: data.data.grade_level_permissions || {},
          subjectTeachers: data.data.subject_teacher_permissions || {},
          autoPublish: data.data.auto_publish || false,
          requireModeration:
            data.data.require_moderation !== undefined
              ? data.data.require_moderation
              : true,
        });
        setScheduledLock({
          enabled: data.data.lock_enabled || false,
          lockUntil: data.data.lock_until || "",
        });
      }
    } catch {
      /* ignore */
    }
    setShowPermissionModal(true);
  };

  const savePermissions = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/permissions/global/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ permissions, scheduledLock }),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Permissions updated successfully");
        setShowPermissionModal(false);
      } else {
        addNotification("error", data.error || "Failed to save permissions");
      }
    } catch {
      addNotification("error", "Failed to save permissions.");
    }
  };

  const deleteExam = async (exam) => {
    if (!window.confirm(`Are you sure you want to delete ${exam.title}?`))
      return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/exams/delete/${exam.id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", `Exam "${exam.title}" deleted`);
        await fetchData();
      } else {
        addNotification("error", data.error || "Failed to delete exam");
      }
    } catch {
      addNotification("error", "Failed to delete exam.");
    }
  };

  // ── Exports ────────────────────────────────────────────────────────────────
  const exportToCSV = () => {
    try {
      const rows = filteredExams.map((e) => ({
        "Exam Code": e.exam_code,
        Title: e.title,
        Type:
          EXAM_TYPES.find((t) => t.value === e.exam_type)?.label || e.exam_type,
        Year: e.academic_year,
        Term: e.term,
        "Start Date": e.start_date,
        "End Date": e.end_date,
        "Duration (min)": e.duration_minutes,
        "Total Marks": e.total_marks,
        "Passing Marks": e.passing_marks,
        Status: EXAM_STATUS[e.status]?.label || e.status,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Exams");
      XLSX.writeFile(
        wb,
        `exams_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      addNotification("success", `Exported ${rows.length} exams`);
    } catch {
      addNotification("error", "Failed to export.");
    }
  };

  const exportSchedulesToCSV = () => {
    try {
      const rows = filteredSchedules.map((s) => ({
        "Exam Code": s.exam_code,
        "Exam Title": s.exam_title,
        Subject: s.subject,
        Date: s.date,
        "Start Time": s.start_time,
        "End Time": s.end_time,
        Room: s.room || "N/A",
        Invigilator: s.invigilator_name || "Not Assigned",
        "Exam Status": EXAM_STATUS[s.exam_status]?.label || s.exam_status,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Schedules");
      XLSX.writeFile(
        wb,
        `exam_schedules_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      addNotification("success", `Exported ${rows.length} schedules`);
    } catch {
      addNotification("error", "Failed to export schedules.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Authentication Required
          </h2>
          <p className="text-gray-600 mt-2">
            Please login to access exam management
          </p>
          <a
            href="/login"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 hover:bg-blue-700 rounded"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .tab-active { border-bottom: 2px solid #1e40af; color: #1e40af; font-weight: 600; }
      `}</style>

      {notifications.map((n) => (
        <Notification
          key={n.id}
          type={n.type}
          message={n.message}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 bg-green-700 rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Examination Management
              </h1>
              <p className="text-sm text-white mt-1">
                Enterprise control tower for CBC/CBE examinations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openPermissionModal}
                className="px-5 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded"
              >
                Global Permissions
              </button>
              {activeTab === "exams" ? (
                <button
                  onClick={exportToCSV}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 rounded"
                >
                  Export CSV
                </button>
              ) : (
                <button
                  onClick={exportSchedulesToCSV}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700 rounded"
                >
                  Export Schedules
                </button>
              )}
              {activeTab === "exams" && (
                <button
                  onClick={createExam}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded"
                >
                  Create Exam
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("exams")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "exams" ? "tab-active text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
            >
              Exams
            </button>
            <button
              onClick={() => setActiveTab("schedules")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "schedules" ? "tab-active text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
            >
              Exam Schedules
              {allSchedules.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {allSchedules.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "exams" ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              {[
                {
                  label: "Total Exams",
                  count: exams.length,
                  color: "text-gray-900",
                },
                {
                  label: "Draft",
                  count: exams.filter((e) => e.status === "draft").length,
                  color: "text-gray-900",
                },
                {
                  label: "Scheduled",
                  count: exams.filter((e) => e.status === "scheduled").length,
                  color: "text-blue-700",
                },
                {
                  label: "Live",
                  count: exams.filter((e) => e.status === "live").length,
                  color: "text-green-700",
                },
                {
                  label: "Marking",
                  count: exams.filter((e) => e.status === "marking").length,
                  color: "text-yellow-700",
                },
                {
                  label: "Moderation",
                  count: exams.filter((e) => e.status === "moderation").length,
                  color: "text-purple-700",
                },
                {
                  label: "Published",
                  count: exams.filter((e) => e.status === "published").length,
                  color: "text-indigo-700",
                },
                {
                  label: "Archived",
                  count: exams.filter((e) => e.status === "archived").length,
                  color: "text-gray-700",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-300 p-3 rounded"
                >
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-300 p-4 mb-6 rounded">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by code or title..."
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="">All Status</option>
                    {Object.values(EXAM_STATUS).map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="">All Types</option>
                    {EXAM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Exams Table */}
            <div className="bg-white border border-gray-300 overflow-hidden rounded">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700">
                        Exam Code
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700">
                        Title
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 hidden md:table-cell">
                        Type
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 hidden lg:table-cell">
                        Period
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 hidden sm:table-cell">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="border border-gray-300 px-4 py-12 text-center text-gray-500"
                        >
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                            Loading exams...
                          </div>
                        </td>
                      </tr>
                    ) : getPaginatedItems().length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="border border-gray-300 px-4 py-12 text-center text-gray-500"
                        >
                          No exams found
                        </td>
                      </tr>
                    ) : (
                      getPaginatedItems().map((exam) => {
                        const status = EXAM_STATUS[exam.status] || {
                          label: exam.status || "Unknown",
                          color: "bg-gray-100 text-gray-800",
                          next: [],
                        };
                        const hasScheds = examHasSchedules(exam);
                        return (
                          <tr key={exam.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-mono text-xs">
                              {exam.exam_code}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-medium">
                              {exam.title}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 hidden md:table-cell text-xs">
                              {EXAM_TYPES.find(
                                (t) => t.value === exam.exam_type,
                              )?.label || exam.exam_type}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 hidden lg:table-cell text-xs">
                              {exam.start_date
                                ? new Date(exam.start_date).toLocaleDateString()
                                : "N/A"}{" "}
                              –{" "}
                              {exam.end_date
                                ? new Date(exam.end_date).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 hidden sm:table-cell">
                              <span
                                className={`px-2 py-1 text-xs font-bold border rounded ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              <div className="flex justify-end gap-2 flex-wrap">
                                {/* Edit */}
                                <button
                                  onClick={() => editExam(exam)}
                                  disabled={!canEdit(exam.status)}
                                  className={`px-3 py-1 text-xs font-medium border rounded ${canEdit(exam.status) ? "bg-green-600 text-white border-green-700 hover:bg-green-700" : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"}`}
                                >
                                  Edit
                                </button>

                                {/* Schedule / Reschedule */}
                                <button
                                  onClick={() => openScheduleModal(exam)}
                                  className={`px-3 py-1 text-xs font-medium border rounded ${hasScheds ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700" : "bg-purple-600 text-white border-purple-700 hover:bg-purple-700"}`}
                                >
                                  {hasScheds
                                    ? `Reschedule (${getExamSchedules(exam).length})`
                                    : "Schedule"}
                                </button>

                                {/* Assign Markers */}
                                {MARKER_VISIBLE_STATUSES.has(exam.status) && (
                                  <button
                                    onClick={() => openMarkingModal(exam)}
                                    className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium border border-yellow-700 hover:bg-yellow-700 rounded"
                                  >
                                    {(exam.markers || []).length > 0
                                      ? `Markers (${exam.markers.length})`
                                      : "Assign Markers"}
                                  </button>
                                )}

                                {/* Moderate */}
                                {exam.status === "moderation" && (
                                  <button
                                    onClick={() => openModerationModal(exam)}
                                    className="px-3 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700 rounded"
                                  >
                                    Moderate
                                  </button>
                                )}

                                {/* Change Status */}
                                {exam.status !== "archived" &&
                                  exam.status !== "cancelled" &&
                                  status.next.length > 0 && (
                                    <select
                                      value=""
                                      onChange={(e) =>
                                        updateExamStatus(
                                          exam.id,
                                          e.target.value,
                                        )
                                      }
                                      className="px-2 py-1 text-xs border border-gray-400 bg-white rounded"
                                    >
                                      <option value="">Change Status</option>
                                      {status.next.map((ns) => (
                                        <option key={ns} value={ns}>
                                          → {EXAM_STATUS[ns]?.label}
                                        </option>
                                      ))}
                                    </select>
                                  )}

                                {/* Delete */}
                                <button
                                  onClick={() => deleteExam(exam)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {filteredExams.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-300 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-xs text-gray-700">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, filteredExams.length)}{" "}
                    of {filteredExams.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Schedules tab */}
            <div className="bg-white border border-gray-300 p-4 mb-6 rounded">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={scheduleSearchTerm}
                    onChange={(e) => setScheduleSearchTerm(e.target.value)}
                    placeholder="Search by exam or subject..."
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={scheduleFilterDate}
                    onChange={(e) => setScheduleFilterDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Filter by Subject
                  </label>
                  <select
                    value={scheduleFilterSubject}
                    onChange={(e) => setScheduleFilterSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={clearScheduleFilters}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-300 overflow-hidden rounded">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {[
                        "Exam Code",
                        "Exam Title",
                        "Subject",
                        "Date",
                        "Start",
                        "End",
                        "Room",
                        "Invigilator",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`border border-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-700 ${["Room", "Invigilator"].includes(h) ? "hidden md:table-cell" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="border border-gray-300 px-4 py-12 text-center text-gray-500"
                        >
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                            Loading...
                          </div>
                        </td>
                      </tr>
                    ) : getPaginatedSchedules().length === 0 ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="border border-gray-300 px-4 py-12 text-center text-gray-500"
                        >
                          No schedules found
                        </td>
                      </tr>
                    ) : (
                      getPaginatedSchedules().map((s, idx) => {
                        const st = EXAM_STATUS[s.exam_status] || {
                          label: s.exam_status || "Unknown",
                          color: "bg-gray-100 text-gray-800",
                        };
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-mono text-xs">
                              {s.exam_code}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-medium">
                              {s.exam_title}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {s.subject}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {s.date
                                ? new Date(s.date).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {s.start_time || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {s.end_time || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 hidden md:table-cell">
                              {s.room || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 hidden md:table-cell">
                              {s.invigilator_name || "Not Assigned"}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-bold border rounded ${st.color}`}
                              >
                                {st.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {filteredSchedules.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-300 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-xs text-gray-700">
                    Showing {(scheduleCurrentPage - 1) * itemsPerPage + 1}–
                    {Math.min(
                      scheduleCurrentPage * itemsPerPage,
                      filteredSchedules.length,
                    )}{" "}
                    of {filteredSchedules.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setScheduleCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={scheduleCurrentPage === 1}
                      className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {scheduleCurrentPage} of {scheduleTotalPages}
                    </span>
                    <button
                      onClick={() =>
                        setScheduleCurrentPage((p) =>
                          Math.min(scheduleTotalPages, p + 1),
                        )
                      }
                      disabled={scheduleCurrentPage === scheduleTotalPages}
                      className="px-4 py-1 text-sm border border-gray-400 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Create/Edit Exam Modal ─────────────────────────────────────────── */}
      {showExamModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowExamModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">
                {selectedExam ? "Edit Exam" : "Create Exam"}
              </h3>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Exam Code *
                  </label>
                  <input
                    type="text"
                    value={editFormData.exam_code}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        exam_code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Grade Level *
                  </label>
                  {/* Grade Level select in modal */}
                  {/* Grade Level select in Create/Edit modal */}
                  <select
                    value={editFormData.grade_level}
                    onChange={(e) => {
                      const newGrade = e.target.value;
                      const availableTypes = getAvailableExamTypes(
                        newGrade,
                        gradeLevels,
                      );
                      const stillValid = availableTypes.some(
                        (t) => t.value === editFormData.exam_type,
                      );
                      setEditFormData({
                        ...editFormData,
                        grade_level: newGrade,
                        exam_type: stillValid ? editFormData.exam_type : "",
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="">Select Grade</option>
                    {gradeLevels.map((gl) => (
                      <option key={gl.id} value={gl.choice_value}>
                        {" "}
                        {/* ← was gl.id */}
                        {gl.display_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Exam Type *
                  </label>
                  {/* ── Dynamic exam types based on grade level ── */}
                  <select
                    value={editFormData.exam_type}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        exam_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="">Select Type</option>
                    {getAvailableExamTypes(
                      editFormData.grade_level,
                      gradeLevels,
                    ).map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="number"
                    value={editFormData.academic_year}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        academic_year: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={editFormData.term}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        term: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  >
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.start_date}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.end_date}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        end_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editFormData.duration_minutes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={editFormData.total_marks}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        total_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={editFormData.passing_marks}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        passing_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subjects
                  </label>
                  <div className="border border-gray-300 p-3 max-h-40 overflow-y-auto rounded flex flex-wrap gap-2">
                    {subjects.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No subjects available
                      </p>
                    ) : (
                      subjects.map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editFormData.subjects?.includes(s.name)}
                            onChange={(e) => {
                              const list = e.target.checked
                                ? [...(editFormData.subjects || []), s.name]
                                : (editFormData.subjects || []).filter(
                                    (n) => n !== s.name,
                                  );
                              setEditFormData({
                                ...editFormData,
                                subjects: list,
                              });
                            }}
                          />
                          <span className="text-sm">{s.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    value={editFormData.instructions}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        instructions: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveExam}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded"
              >
                Save Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ──────────────────────────────────────────────────── */}
      {showScheduleModal && selectedExam && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-auto rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">
                {schedules.length > 0 ? "Reschedule" : "Schedule"} Exam:{" "}
                {selectedExam.title}
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              {schedules.length > 0 ? (
                <div className="mb-4 bg-blue-50 border border-blue-300 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    ✏️ Existing schedule loaded. Edit rows or add new ones.
                    Saving will replace all existing schedules.
                  </p>
                </div>
              ) : (
                <div className="mb-4 bg-yellow-50 border border-yellow-300 p-3 rounded">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Schedule each subject with date, time, and room.
                  </p>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mb-4">
                  <thead>
                    <tr className="bg-gray-50">
                      {[
                        "Subject",
                        "Date",
                        "Start Time",
                        "End Time",
                        "Room",
                        "Invigilator",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border border-gray-300 px-3 py-2 text-left text-xs font-bold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((sched, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-3 py-2">
                          <select
                            value={sched.subject}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].subject = e.target.value;
                              setSchedules(n);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          >
                            <option value="">Select</option>
                            {(selectedExam.subjects || []).map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="date"
                            value={sched.date}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].date = e.target.value;
                              setSchedules(n);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="time"
                            value={sched.start_time}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].start_time = e.target.value;
                              setSchedules(n);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="time"
                            value={sched.end_time}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].end_time = e.target.value;
                              setSchedules(n);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="text"
                            value={sched.room}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].room = e.target.value;
                              setSchedules(n);
                            }}
                            placeholder="Room No"
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <select
                            value={sched.invigilator}
                            onChange={(e) => {
                              const n = [...schedules];
                              n[idx].invigilator = e.target.value;
                              setSchedules(n);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-400 bg-white rounded"
                          >
                            <option value="">Select</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.first_name} {t.last_name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <button
                            onClick={() =>
                              setSchedules(
                                schedules.filter((_, i) => i !== idx),
                              )
                            }
                            className="text-red-600 hover:text-red-800 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() =>
                  setSchedules([
                    ...schedules,
                    {
                      subject: "",
                      date: "",
                      start_time: "",
                      end_time: "",
                      room: "",
                      invigilator: "",
                    },
                  ])
                }
                className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700 rounded"
              >
                + Add Row
              </button>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Marking Modal ───────────────────────────────────────────────────── */}
      {showMarkingModal && selectedExam && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMarkingModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">
                Assign Markers: {selectedExam.title}
              </h3>
              <button
                onClick={() => setShowMarkingModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-3">
                Select markers for each subject. Hold{" "}
                <kbd className="px-1 border border-gray-300 rounded text-xs">
                  Ctrl
                </kbd>{" "}
                to select multiple. Currently assigned markers are pre-selected.
              </p>
              {(selectedExam.subjects || []).length === 0 ? (
                <p className="text-sm text-gray-500">
                  No subjects assigned to this exam.
                </p>
              ) : (
                (selectedExam.subjects || []).map((subject) => {
                  const assignedNames = (selectedExam.markers || [])
                    .filter((m) => m.subject === subject)
                    .map((m) => m.teacher_name);
                  return (
                    <div
                      key={subject}
                      className="mb-4 p-3 border border-gray-300 rounded"
                    >
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        {subject}
                      </label>
                      {assignedNames.length > 0 && (
                        <p className="text-xs text-blue-700 mb-2">
                          Currently assigned:{" "}
                          <span className="text-red-600 font-semibold">
                            {assignedNames.join(", ")}
                          </span>
                        </p>
                      )}
                      <select
                        multiple
                        value={markingData[subject] || []}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (o) => o.value,
                          );
                          setMarkingData((prev) => ({
                            ...prev,
                            [subject]: selected,
                          }));
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-400 bg-white h-32 rounded"
                      >
                        {teachers.map((t) => (
                          <option key={t.id} value={String(t.id)}>
                            {t.first_name} {t.last_name}
                            {t.specialization ? ` — ${t.specialization}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })
              )}
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowMarkingModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={assignMarkers}
                className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium border border-yellow-700 hover:bg-yellow-700 rounded"
              >
                Save Markers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Moderation Modal ─────────────────────────────────────────────────── */}
      {showModerationModal && selectedExam && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModerationModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">
                Moderate Exam: {selectedExam.title}
              </h3>
              <button
                onClick={() => setShowModerationModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 bg-purple-50 border border-purple-300 p-3 rounded">
                <p className="text-sm text-purple-800">
                  Review and moderate all marked scripts before publishing.
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Moderator
                </label>
                <select
                  value={moderationData.moderator || ""}
                  onChange={(e) =>
                    setModerationData({
                      ...moderationData,
                      moderator: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                >
                  <option value="">Select Moderator</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.first_name} {t.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Moderation Notes
                </label>
                <textarea
                  value={moderationData.notes || ""}
                  onChange={(e) =>
                    setModerationData({
                      ...moderationData,
                      notes: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                  placeholder="Enter moderation comments..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={moderationData.approved || false}
                  onChange={(e) =>
                    setModerationData({
                      ...moderationData,
                      approved: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">
                  Approve all results for publication
                </span>
              </label>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowModerationModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitModeration}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded"
              >
                Submit Moderation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permissions Modal ─────────────────────────────────────────────────── */}
      {showPermissionModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPermissionModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-auto rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-md font-bold text-gray-900">
                Global Permission Settings
              </h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                {
                  key: "schoolWide",
                  label: "School-Wide Mark Uploading",
                  desc: "Allow all teachers to upload marks for any exam",
                },
                {
                  key: "requireModeration",
                  label: "Require Moderation",
                  desc: "Results must be moderated before publication",
                },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded"
                >
                  <div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-xs text-gray-600">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions[key]}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          [key]: e.target.checked,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:h-5 after:w-5 after:transition-all rounded" />
                  </label>
                </div>
              ))}

              <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Scheduled Lock</p>
                    <p className="text-xs text-gray-600">
                      Auto-expire permissions after timestamp
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={scheduledLock.enabled}
                      onChange={(e) =>
                        setScheduledLock({
                          ...scheduledLock,
                          enabled: e.target.checked,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:h-5 after:w-5 after:transition-all rounded" />
                  </label>
                </div>
                {scheduledLock.enabled && (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Lock Until
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledLock.lockUntil}
                      onChange={(e) =>
                        setScheduledLock({
                          ...scheduledLock,
                          lockUntil: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-400 bg-white rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="font-bold text-sm mb-2">
                  Grade Level Permissions
                </p>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
                  {classes.length === 0 ? (
                    <p className="text-sm text-gray-500 p-3">
                      No classes available
                    </p>
                  ) : (
                    classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between p-2 border-b border-gray-200"
                      >
                        <span className="text-sm">{cls.class_name}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={permissions.gradeLevels[cls.id] || false}
                            onChange={(e) =>
                              setPermissions({
                                ...permissions,
                                gradeLevels: {
                                  ...permissions.gradeLevels,
                                  [cls.id]: e.target.checked,
                                },
                              })
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 border border-gray-400 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:h-5 after:w-5 after:transition-all rounded" />
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={savePermissions}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700 rounded"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamManagement;
