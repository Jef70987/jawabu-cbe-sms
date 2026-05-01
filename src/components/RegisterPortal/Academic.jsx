/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Layers,
  GitBranch,
  Target,
  Award,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Globe,
  School,
  Calendar,
  Clock,
  Link2,
  Database,
  HardDrive,
  Shield,
  ChevronUp,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Learning Domains - Static (never changes)
const LEARNING_DOMAINS = [
  { id: "cognitive", name: "Cognitive (Knowledge)", code: "C" },
  { id: "psychomotor", name: "Psychomotor (Skills)", code: "P" },
  { id: "affective", name: "Affective (Values/Attitudes)", code: "A" },
];

// Notification Component
const Notification = ({ type, message, onClose, duration = 5000 }) => {
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
      case "success":
        return "bg-green-50 border-green-300 text-green-800";
      case "error":
        return "bg-red-50 border-red-300 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-300 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-300 text-blue-800";
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full md:w-auto ${getStyles()} border p-4 shadow-lg`}
    >
      <div className="flex items-start">
        {type === "success" && (
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
        )}
        {type === "error" && (
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
        )}
        {type === "warning" && (
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
        )}
        {(type === "info" || !type) && (
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
        )}
        <div className="flex-1">
          <p className="text-sm font-bold">
            {type === "success"
              ? "Success"
              : type === "error"
                ? "Error"
                : type === "warning"
                  ? "Warning"
                  : "Information"}
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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-gray-400 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-100">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

function AcademicManagement() {
  const { getAuthHeaders, isAuthenticated, user } = useAuth();

  // State
  const [curriculum, setCurriculum] = useState([]);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [coreCompetencies, setCoreCompetencies] = useState([]);
  const [coreValues, setCoreValues] = useState([]);
  const [weightConfig, setWeightConfig] = useState({
    sbaWeight: 40,
    examWeight: 60,
  });
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStrand, setSelectedStrand] = useState(null);
  const [selectedSubStrand, setSelectedSubStrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("subjects");

  // Modal States
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showStrandModal, setShowStrandModal] = useState(false);
  const [showSubStrandModal, setShowSubStrandModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false); // NEW: Grade CRUD modal
  const [itemToDelete, setItemToDelete] = useState(null);
  // grade level
  const [academicYears, setAcademicYears] = useState([]);
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [editingAcademicYear, setEditingAcademicYear] = useState(null);
  const [academicYearForm, setAcademicYearForm] = useState({
    year_code: "",
    year_name: "",
    start_date: "",
    end_date: "",
    is_current: false,
  });
  // Form Data
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    isCore: true,
    isActive: true,
    description: "",
  });
  const [strandForm, setStrandForm] = useState({
    name: "",
    code: "",
    description: "",
    gradeLevel: "", // ADDED: grade level for strand
  });
  const [subStrandForm, setSubStrandForm] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [outcomeForm, setOutcomeForm] = useState({
    description: "",
    domain: "cognitive",
    competencies: [],
  });
  const [versionForm, setVersionForm] = useState({
    name: "",
    academicYear: "",
    isActive: false,
  });
  const [gradeForm, setGradeForm] = useState({
    name: "",
    level: "",
    description: "",
  }); // NEW
  const [editingGrade, setEditingGrade] = useState(null); // NEW

  // Terms
  const [terms, setTerms] = useState([]);
  const [showTermModal, setShowTermModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [termForm, setTermForm] = useState({
    academic_year: "", // ID of the AcademicYear
    term: "Term 1",
    start_date: "",
    end_date: "",
    is_current: false,
  });
  const [termAcademicYearFilter, setTermAcademicYearFilter] = useState("");
  // Bulk Import
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importPreview, setImportPreview] = useState([]);

  // Editing State
  const [editingItem, setEditingItem] = useState(null);

  // Expanded/Collapsed State for Tree View
  const [expandedGrades, setExpandedGrades] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedStrands, setExpandedStrands] = useState({});

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchCurriculum(),
      fetchVersions(),
      fetchGradeLevels(),
      fetchCoreCompetencies(),
      fetchCoreValues(),
      fetchWeightConfig(),
      fetchAcademicYears(),
      fetchTerms(),
    ]);
    setIsLoading(false);
  };

  const fetchCurriculum = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/curriculum/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setCurriculum(data.data);
        if (data.data && data.data.length > 0 && !selectedGrade) {
          setSelectedGrade(data.data[0].gradeId);
        }
      } else {
        addNotification("error", data.error || "Failed to load curriculum");
      }
    } catch (error) {
      addNotification("error", "Failed to load curriculum data");
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/curriculum/versions/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setVersions(data.data);
        const active = data.data.find((v) => v.isActive);
        if (active) setActiveVersion(active);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
      addNotification("error", "Failed to load versions");
    }
  };
  const fetchTerms = async () => {
    try {
      let url = `${API_BASE_URL}/api/registrar/academic/terms/`;
      if (termAcademicYearFilter) {
        url += `?academic_year=${termAcademicYearFilter}`;
      }
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setTerms(data.data);
      else addNotification("error", data.error || "Failed to load terms");
    } catch {
      addNotification("error", "Failed to load terms");
    }
  };

  const handleSaveTerm = async () => {
    if (
      !termForm.academic_year ||
      !termForm.term ||
      !termForm.start_date ||
      !termForm.end_date
    ) {
      addNotification("warning", "Please fill in all required fields");
      return;
    }
    const url = editingTerm
      ? `${API_BASE_URL}/api/registrar/academic/terms/${editingTerm.id}/`
      : `${API_BASE_URL}/api/registrar/academic/terms/create/`;
    const method = editingTerm ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          academic_year: termForm.academic_year,
          term: termForm.term,
          start_date: termForm.start_date,
          end_date: termForm.end_date,
          is_current: termForm.is_current,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addNotification(
          "success",
          editingTerm ? "Term updated" : "Term created",
        );
        setShowTermModal(false);
        setEditingTerm(null);
        setTermForm({
          academic_year: "",
          term: "Term 1",
          start_date: "",
          end_date: "",
          is_current: false,
        });
        fetchTerms();
      } else {
        addNotification("error", data.error || "Failed to save term");
      }
    } catch {
      addNotification("error", "Network error");
    }
  };

  const handleDeleteTerm = async (term) => {
    if (!window.confirm(`Delete Term ${term.term}?`)) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/academic/terms/${term.id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Term deleted");
        fetchTerms();
      } else addNotification("error", data.error || "Failed to delete");
    } catch {
      addNotification("error", "Network error");
    }
  };

  const openEditTerm = (t) => {
    setEditingTerm(t);
    setTermForm({
      academic_year: t.academic_year || t.academic_year_id, // depends on serializer
      term: t.term,
      start_date: t.start_date,
      end_date: t.end_date,
      is_current: t.is_current,
    });
    setShowTermModal(true);
  };
  const fetchGradeLevels = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/grade-levels/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setGradeLevels(data.data);
        const initialExpanded = {};
        data.data.forEach((grade) => {
          initialExpanded[grade.id] = false;
        });
        setExpandedGrades(initialExpanded);
      }
    } catch (error) {
      console.error("Error fetching grade levels:", error);
    }
  };

  const fetchCoreCompetencies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/core-competencies/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setCoreCompetencies(data.data);
      }
    } catch (error) {
      console.error("Error fetching core competencies:", error);
    }
  };

  const fetchCoreValues = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/core-values/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setCoreValues(data.data);
      }
    } catch (error) {
      console.error("Error fetching core values:", error);
    }
  };

  const fetchWeightConfig = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/weight-config/`,
        {
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        setWeightConfig({
          sbaWeight: data.data.sba_weight,
          examWeight: data.data.exam_weight,
        });
      }
    } catch (error) {
      console.error("Error fetching weight config:", error);
    }
  };
  const fetchAcademicYears = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/academic/academic-years/`,
        { headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (data.success) setAcademicYears(data.data);
    } catch {
      addNotification("error", "Failed to load academic years");
    }
  };

  const handleSaveAcademicYear = async () => {
    if (
      !academicYearForm.year_code ||
      !academicYearForm.year_name ||
      !academicYearForm.start_date ||
      !academicYearForm.end_date
    ) {
      addNotification("warning", "Please fill in all required fields");
      return;
    }
    const url = editingAcademicYear
      ? `${API_BASE_URL}/api/registrar/academic/academic-years/${editingAcademicYear.id}/`
      : `${API_BASE_URL}/api/registrar/academic/academic-years/create/`;
    const method = editingAcademicYear ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(academicYearForm),
      });
      const data = await res.json();
      if (data.success) {
        addNotification(
          "success",
          editingAcademicYear
            ? "Academic year updated"
            : "Academic year created",
        );
        setShowAcademicYearModal(false);
        setEditingAcademicYear(null);
        setAcademicYearForm({
          year_code: "",
          year_name: "",
          start_date: "",
          end_date: "",
          is_current: false,
        });
        fetchAcademicYears();
      } else {
        addNotification("error", data.error || "Failed to save");
      }
    } catch {
      addNotification("error", "Network error");
    }
  };

  const handleDeleteAcademicYear = async (yr) => {
    if (!window.confirm(`Delete ${yr.year_name}?`)) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/registrar/academic/academic-years/${yr.id}/`,
        { method: "DELETE", headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (data.success) {
        addNotification("success", "Deleted");
        fetchAcademicYears();
      } else addNotification("error", data.error || "Failed");
    } catch {
      addNotification("error", "Network error");
    }
  };

  const openEditAcademicYear = (yr) => {
    setEditingAcademicYear(yr);
    setAcademicYearForm({
      year_code: yr.year_code,
      year_name: yr.year_name,
      start_date: yr.start_date,
      end_date: yr.end_date,
      is_current: yr.is_current,
    });
    setShowAcademicYearModal(true);
  };
  // Subject CRUD
  const createSubject = async () => {
    if (!subjectForm.name || !subjectForm.code) {
      addNotification("warning", "Please fill in required fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/learning-areas/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            area_name: subjectForm.name,
            area_code: subjectForm.code,
            area_type: subjectForm.isCore ? "Core" : "Optional",
            is_active: subjectForm.isActive,
            description: subjectForm.description,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        addNotification(
          "success",
          `Subject "${subjectForm.name}" created successfully`,
        );
        setShowSubjectModal(false);
        resetSubjectForm();
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to create subject");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      addNotification("error", "Failed to create subject");
    }
  };

  const updateSubject = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/learning-areas/${editingItem.id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            area_name: subjectForm.name,
            area_code: subjectForm.code,
            area_type: subjectForm.isCore ? "Core" : "Optional",
            is_active: subjectForm.isActive,
            description: subjectForm.description,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Subject "${subjectForm.name}" updated successfully`,
        );
        setShowSubjectModal(false);
        setEditingItem(null);
        resetSubjectForm();
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to update subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      addNotification("error", "Failed to update subject");
    }
  };

  const confirmDeleteSubject = (subject) => {
    setItemToDelete({ type: "subject", data: subject });
    setShowDeleteConfirmModal(true);
  };

  const deleteSubject = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/learning-areas/${itemToDelete.data.id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Subject "${itemToDelete.data.name}" deleted successfully`,
        );
        setShowDeleteConfirmModal(false);
        setItemToDelete(null);
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      addNotification("error", "Failed to delete subject");
    }
  };

  // Strand CRUD - FIXED with grade_level
  const createStrand = async () => {
    if (!strandForm.name || !selectedSubject) {
      addNotification(
        "warning",
        "Please select a subject and fill in strand name",
      );
      return;
    }

    if (!strandForm.gradeLevel) {
      addNotification("warning", "Please select a grade level for this strand");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/strands/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            learning_area: selectedSubject.id,
            strand_name: strandForm.name,
            strand_code:
              strandForm.code || strandForm.name.substring(0, 3).toUpperCase(),
            grade_level: strandForm.gradeLevel, // ✅ FIXED: Send grade_level
            description: strandForm.description,
            display_order: 0,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Strand "${strandForm.name}" created successfully for grade`,
        );
        setShowStrandModal(false);
        setStrandForm({ name: "", code: "", description: "", gradeLevel: "" });
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to create strand");
      }
    } catch (error) {
      console.error("Error creating strand:", error);
      addNotification("error", "Failed to create strand");
    }
  };

  // Sub-Strand CRUD
  const createSubStrand = async () => {
    if (!subStrandForm.name || !selectedStrand) {
      addNotification(
        "warning",
        "Please select a strand and fill in sub-strand name",
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/substrands/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            strand: selectedStrand.id,
            substrand_name: subStrandForm.name,
            substrand_code:
              subStrandForm.code ||
              subStrandForm.name.substring(0, 4).toUpperCase(),
            description: subStrandForm.description,
            display_order: 0,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Sub-Strand "${subStrandForm.name}" created successfully`,
        );
        setShowSubStrandModal(false);
        setSubStrandForm({ name: "", code: "", description: "" });
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to create sub-strand");
      }
    } catch (error) {
      console.error("Error creating sub-strand:", error);
      addNotification("error", "Failed to create sub-strand");
    }
  };

  // Learning Outcome CRUD
  const createOutcome = async () => {
    if (!outcomeForm.description || !selectedSubStrand) {
      addNotification("warning", "Please fill in learning outcome description");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/outcomes/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            substrand: selectedSubStrand.id,
            description: outcomeForm.description,
            domain: outcomeForm.domain,
            competencies: outcomeForm.competencies,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "Learning outcome created successfully");
        setShowOutcomeModal(false);
        setOutcomeForm({
          description: "",
          domain: "cognitive",
          competencies: [],
        });
        await fetchCurriculum();
      } else {
        addNotification(
          "error",
          data.error || "Failed to create learning outcome",
        );
      }
    } catch (error) {
      console.error("Error creating outcome:", error);
      addNotification("error", "Failed to create learning outcome");
    }
  };

  // Clone Curriculum
  const cloneCurriculum = async () => {
    if (!versionForm.academicYear) {
      addNotification("warning", "Please enter target academic year");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/curriculum/clone/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            target_year: versionForm.academicYear,
            target_name:
              versionForm.name || `${versionForm.academicYear} Curriculum`,
            source_year: activeVersion?.academicYear,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Curriculum cloned to ${versionForm.academicYear} successfully`,
        );
        setShowCloneModal(false);
        setVersionForm({ name: "", academicYear: "", isActive: false });
        await fetchVersions();
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to clone curriculum");
      }
    } catch (error) {
      console.error("Error cloning curriculum:", error);
      addNotification("error", "Failed to clone curriculum");
    }
  };

  // Create New Version
  const createNewVersion = async () => {
    if (!versionForm.name || !versionForm.academicYear) {
      addNotification("warning", "Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/curriculum/versions/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: versionForm.name,
            academic_year: versionForm.academicYear,
            is_active: versionForm.isActive,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "New version created successfully");
        setShowVersionModal(false);
        setVersionForm({ name: "", academicYear: "", isActive: false });
        await fetchVersions();
      } else {
        addNotification("error", data.error || "Failed to create version");
      }
    } catch (error) {
      console.error("Error creating version:", error);
      addNotification("error", "Failed to create version");
    }
  };

  // Publish Curriculum
  const confirmPublishCurriculum = () => {
    setShowPublishConfirmModal(true);
  };

  const publishCurriculum = async () => {
    if (!activeVersion) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/curriculum/versions/${activeVersion.id}/publish/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          "Curriculum published and locked successfully",
        );
        setShowPublishConfirmModal(false);
        await fetchVersions();
      } else {
        addNotification("error", data.error || "Failed to publish curriculum");
      }
    } catch (error) {
      console.error("Error publishing curriculum:", error);
      addNotification("error", "Failed to publish curriculum");
    }
  };

  // Update Weight Configuration
  const updateWeightConfig = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/weight-config/update/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            sba_weight: weightConfig.sbaWeight,
            exam_weight: weightConfig.examWeight,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "Weight configuration updated successfully");
        setShowWeightModal(false);
      } else {
        addNotification(
          "error",
          data.error || "Failed to update weight configuration",
        );
      }
    } catch (error) {
      console.error("Error updating weight config:", error);
      addNotification("error", "Failed to update weight configuration");
    }
  };

  // Bulk Import
  const handleBulkUpload = async () => {
    if (!uploadFile) {
      addNotification("warning", "Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/bulk-import/`,
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeaders()["Authorization"],
          },
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification(
          "success",
          `Curriculum imported successfully: ${data.imported_count} items`,
        );
        setShowBulkImportModal(false);
        setUploadFile(null);
        await fetchCurriculum();
      } else {
        addNotification("error", data.error || "Failed to import curriculum");
      }
    } catch (error) {
      console.error("Error importing curriculum:", error);
      addNotification("error", "Failed to import curriculum");
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Grade_Level: "G7",
        Subject_Name: "Integrated Science",
        Strand_Name: "Human Health",
        Sub_Strand_Name: "Respiratory System",
        Learning_Outcome:
          "Learner should be able to model the breathing process",
        Competency_Key: "CT, DL",
        Assessment_Scale: "8",
        SBA_Weight: "40",
        Summative_Weight: "60",
        Is_Optional: "FALSE",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum_Template");
    XLSX.writeFile(workbook, "curriculum_import_template.xlsx");
    addNotification("success", "Template downloaded");
  };

  // --- GRADE LEVEL CRUD ---

  const handleCreateGrade = async () => {
    if (!gradeForm.name || !gradeForm.level) {
      addNotification("warning", "Please fill in name and level");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/grade-levels/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: gradeForm.name,
            level: parseInt(gradeForm.level),
            description: gradeForm.description,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "Grade level created");
        setShowGradeModal(false);
        setGradeForm({ name: "", level: "", description: "" });
        fetchGradeLevels();
      } else {
        addNotification("error", data.error || "Failed to create grade level");
      }
    } catch (err) {
      addNotification("error", "Network error");
    }
  };

  const handleUpdateGrade = async () => {
    if (!editingGrade) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/grade-levels/${editingGrade.id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: gradeForm.name,
            level: parseInt(gradeForm.level),
            description: gradeForm.description,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "Grade level updated");
        setShowGradeModal(false);
        setEditingGrade(null);
        setGradeForm({ name: "", level: "", description: "" });
        fetchGradeLevels();
      } else {
        addNotification("error", data.error || "Failed to update grade level");
      }
    } catch (err) {
      addNotification("error", "Network error");
    }
  };

  const handleDeleteGrade = async (grade) => {
    if (!window.confirm(`Delete ${grade.name}?`)) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/academic/grade-levels/${grade.id}/`,
        { method: "DELETE", headers: getAuthHeaders() },
      );
      const data = await response.json();
      if (data.success) {
        addNotification("success", "Grade level deleted");
        fetchGradeLevels();
      } else {
        addNotification("error", data.error || "Failed to delete");
      }
    } catch (err) {
      addNotification("error", "Network error");
    }
  };

  const openEditGrade = (grade) => {
    setEditingGrade(grade);
    setGradeForm({
      name: grade.name,
      level: grade.level.toString(),
      description: grade.description || "",
    });
    setShowGradeModal(true);
  };

  const openAddGrade = () => {
    setEditingGrade(null);
    setGradeForm({ name: "", level: "", description: "" });
    setShowGradeModal(true);
  };

  // --- end grade level CRUD ---

  const resetSubjectForm = () => {
    setSubjectForm({
      name: "",
      code: "",
      gradeLevel: selectedGrade,
      isCore: true,
      isActive: true,
      description: "",
    });
  };

  const getSubjectsForGrade = (gradeId) => {
    // Convert to string for comparison
    const searchId = String(gradeId);
    const gradeData = curriculum.find((g) => String(g.gradeId) === searchId);
    return gradeData?.subjects || [];
  };

  const toggleGradeExpanded = (gradeId) => {
    setExpandedGrades((prev) => ({ ...prev, [gradeId]: !prev[gradeId] }));
  };

  const toggleSubjectExpanded = (subjectId) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const toggleStrandExpanded = (strandId) => {
    setExpandedStrands((prev) => ({ ...prev, [strandId]: !prev[strandId] }));
  };

  // Fetch all data on mount
  useEffect(() => {
    if (!isAuthenticated) {
      addNotification("error", "Please login to access curriculum management");
      return;
    }
    fetchAllData();
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTerms();
  }, [termAcademicYearFilter]);

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to access curriculum management
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-green-700 text-white font-medium border border-green-800 inline-block hover:bg-green-800"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const displayGradeLevels = gradeLevels.length > 0 ? gradeLevels : [];

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${itemToDelete?.data?.name || itemToDelete?.data?.class_name || "this item"}"? This action cannot be undone.`}
        onConfirm={deleteSubject}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
          setItemToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showPublishConfirmModal}
        title="Publish Curriculum"
        message="Are you sure you want to publish and lock this curriculum version? No further changes will be allowed for this academic year."
        onConfirm={publishCurriculum}
        onCancel={() => setShowPublishConfirmModal(false)}
        confirmText="Publish"
        cancelText="Cancel"
      />

      {/* Header with Green Color */}
      <div className="mb-8 bg-green-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Curriculum Management (CBC/CBE)
            </h1>
            <p className="text-green-100 mt-1">
              The "DNA" of the curriculum - Manage subjects, strands,
              competencies, and learning outcomes
            </p>
            {activeVersion && (
              <p className="text-sm text-green-200 mt-2">
                Active Version:{" "}
                <span className="font-bold">{activeVersion.name}</span> (
                {activeVersion.academicYear})
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {!activeVersion?.isPublished && (
              <button
                onClick={confirmPublishCurriculum}
                className="px-5 py-2 bg-yellow-600 text-white text-sm font-medium border border-yellow-700 hover:bg-yellow-700"
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Publish & Lock
              </button>
            )}
            <button
              onClick={() => setShowCloneModal(true)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700"
            >
              <Copy className="h-4 w-4 inline mr-2" />
              Clone Year
            </button>
            <button
              onClick={() => setShowBulkImportModal(true)}
              className="px-5 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Bulk Import
            </button>
            <button
              onClick={fetchAllData}
              className="px-5 py-2 bg-gray-600 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Green Theme */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-300 pb-4">
        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "subjects" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Subjects & Strands
        </button>
        <button
          onClick={() => setActiveTab("competencies")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "competencies" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Competencies & Values
        </button>
        <button
          onClick={() => setActiveTab("weights")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "weights" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Weight Configuration
        </button>
        <button
          onClick={() => setActiveTab("versions")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "versions" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Database className="h-4 w-4 inline mr-2" />
          Version History
        </button>
        <button
          onClick={() => setActiveTab("grade-levels")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "grade-levels" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <School className="h-4 w-4 inline mr-2" />
          Grade Levels
        </button>
        <button
          onClick={() => setActiveTab("academic-years")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "academic-years" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Academic Years
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-5 py-2 border border-gray-300 text-sm font-medium ${activeTab === "terms" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Terms
        </button>
      </div>

      {/* TAB 1: SUBJECTS & STRANDS */}
      {activeTab === "subjects" && (
        <div>
          {/* Grade Level Selector */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {displayGradeLevels.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`px-4 py-2 text-sm font-medium border ${selectedGrade === grade.id ? "bg-green-700 text-white border-green-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  {grade.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Subject Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                resetSubjectForm();
                setShowSubjectModal(true);
              }}
              className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Subject
            </button>
          </div>

          {/* Curriculum Tree View */}
          {isLoading ? (
            <div className="bg-white border border-gray-300 p-12 text-center">
              <Loader2 className="h-12 w-12 text-green-700 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading curriculum...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-300">
              {displayGradeLevels
                .filter((g) => g.id === selectedGrade)
                .map((grade) => {
                  const subjects = getSubjectsForGrade(grade.id);
                  return (
                    <div key={grade.id}>
                      <div
                        className="border-b border-gray-300 px-6 py-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                        onClick={() => toggleGradeExpanded(grade.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-md font-bold text-gray-900">
                              {grade.name}
                            </h2>
                            <p className="text-xs text-gray-600">
                              {subjects.length} subjects
                            </p>
                          </div>
                          {expandedGrades[grade.id] ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                      </div>

                      {expandedGrades[grade.id] && (
                        <div className="p-4">
                          {subjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              No subjects configured for this grade. Click "Add
                              Subject" to get started.
                            </div>
                          ) : (
                            subjects.map((subject) => (
                              <div
                                key={subject.id}
                                className="mb-4 border border-gray-200"
                              >
                                <div
                                  className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                                  onClick={() =>
                                    toggleSubjectExpanded(subject.id)
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <BookOpen className="h-5 w-5 text-green-600" />
                                    <div>
                                      <h3 className="font-bold text-gray-900">
                                        {subject.name}
                                      </h3>
                                      <p className="text-xs text-gray-500">
                                        Code: {subject.code} |{" "}
                                        {subject.isCore
                                          ? "Core Subject"
                                          : "Optional"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubject(subject);
                                        setShowStrandModal(true);
                                      }}
                                      className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700"
                                    >
                                      <Plus className="h-3 w-3 inline mr-1" />
                                      Add Strand
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingItem(subject);
                                        setSubjectForm({
                                          ...subject,
                                          name: subject.name,
                                          code: subject.code,
                                          isCore: subject.isCore,
                                        });
                                        setShowSubjectModal(true);
                                      }}
                                      className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium border border-yellow-700 hover:bg-yellow-700"
                                    >
                                      <Edit2 className="h-3 w-3 inline" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDeleteSubject(subject);
                                      }}
                                      className="px-2 py-1 bg-red-600 text-white text-xs font-medium border border-red-700 hover:bg-red-700"
                                    >
                                      <Trash2 className="h-3 w-3 inline" />
                                    </button>
                                    {expandedSubjects[subject.id] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>

                                {expandedSubjects[subject.id] && (
                                  <div className="p-4 border-t border-gray-200">
                                    {subject.strands?.length === 0 ? (
                                      <div className="text-center py-4 text-gray-400">
                                        No strands configured. Click "Add
                                        Strand" to add topics.
                                      </div>
                                    ) : (
                                      subject.strands?.map((strand) => (
                                        <div
                                          key={strand.id}
                                          className="mb-3 border border-gray-200"
                                        >
                                          <div
                                            className="px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                                            onClick={() =>
                                              toggleStrandExpanded(strand.id)
                                            }
                                          >
                                            <div>
                                              <h4 className="font-medium text-gray-800">
                                                {strand.name}
                                              </h4>
                                              <p className="text-xs text-gray-500">
                                                Code: {strand.code}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedStrand(strand);
                                                  setShowSubStrandModal(true);
                                                }}
                                                className="px-2 py-1 bg-teal-600 text-white text-xs font-medium border border-teal-700 hover:bg-teal-700"
                                              >
                                                <Plus className="h-3 w-3 inline mr-1" />
                                                Add Sub-Strand
                                              </button>
                                              {expandedStrands[strand.id] ? (
                                                <ChevronUp className="h-4 w-4" />
                                              ) : (
                                                <ChevronDown className="h-4 w-4" />
                                              )}
                                            </div>
                                          </div>

                                          {expandedStrands[strand.id] && (
                                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                              {strand.subStrands?.length ===
                                              0 ? (
                                                <div className="text-center py-4 text-gray-400">
                                                  No sub-strands configured.
                                                  Click "Add Sub-Strand" to add
                                                  specific topics.
                                                </div>
                                              ) : (
                                                strand.subStrands?.map(
                                                  (subStrand) => (
                                                    <div
                                                      key={subStrand.id}
                                                      className="mb-3 border border-gray-200 bg-white"
                                                    >
                                                      <div className="px-4 py-2 flex justify-between items-center">
                                                        <div>
                                                          <h5 className="font-medium text-gray-800">
                                                            {subStrand.name}
                                                          </h5>
                                                          <p className="text-xs text-gray-500">
                                                            Code:{" "}
                                                            {subStrand.code}
                                                          </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                          <button
                                                            onClick={() => {
                                                              setSelectedSubStrand(
                                                                subStrand,
                                                              );
                                                              setShowOutcomeModal(
                                                                true,
                                                              );
                                                            }}
                                                            className="px-2 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700"
                                                          >
                                                            <Target className="h-3 w-3 inline mr-1" />
                                                            Add Learning Outcome
                                                          </button>
                                                        </div>
                                                      </div>

                                                      {/* Learning Outcomes */}
                                                      {subStrand.outcomes
                                                        ?.length > 0 && (
                                                        <div className="px-4 pb-3">
                                                          <p className="text-xs font-bold text-gray-700 mb-2">
                                                            Learning Outcomes:
                                                          </p>
                                                          <ul className="list-disc list-inside space-y-1">
                                                            {subStrand.outcomes.map(
                                                              (outcome) => (
                                                                <li
                                                                  key={
                                                                    outcome.id
                                                                  }
                                                                  className="text-sm text-gray-600"
                                                                >
                                                                  {
                                                                    outcome.description
                                                                  }
                                                                  <span className="ml-2 text-xs text-purple-600">
                                                                    [
                                                                    {
                                                                      outcome.domain
                                                                    }
                                                                    ] -
                                                                    Competencies:{" "}
                                                                    {outcome.competencies?.join(
                                                                      ", ",
                                                                    )}
                                                                  </span>
                                                                </li>
                                                              ),
                                                            )}
                                                          </ul>
                                                        </div>
                                                      )}
                                                    </div>
                                                  ),
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPETENCIES & VALUES */}
      {activeTab === "competencies" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Competencies */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">
                Core Competencies (KICD)
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                The 7 competencies of the CBC framework
              </p>
            </div>
            <div className="p-4">
              {coreCompetencies.map((comp) => (
                <div
                  key={comp.id}
                  className="mb-4 p-3 border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{comp.name}</h3>
                      <p className="text-xs text-gray-500">Code: {comp.code}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">
                      Indicators:
                    </p>
                    <ul className="list-disc list-inside">
                      {(comp.indicators || []).map((ind, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">
                Core Values (KICD)
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                The 7 values of the CBC framework
              </p>
            </div>
            <div className="p-4">
              {coreValues.map((value) => (
                <div
                  key={value.id}
                  className="mb-4 p-3 border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{value.name}</h3>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">
                      Indicators:
                    </p>
                    <ul className="list-disc list-inside">
                      {(value.indicators || []).map((ind, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Domains */}
          <div className="bg-white border border-gray-300 lg:col-span-2">
            <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
              <h2 className="text-md font-bold text-gray-900">
                Learning Domains
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Cognitive, Psychomotor, and Affective domains for learning
                outcomes
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LEARNING_DOMAINS.map((domain) => (
                  <div key={domain.id} className="p-3 border border-gray-200">
                    <h3 className="font-bold text-gray-900">{domain.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Code: {domain.code}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Used for categorizing learning outcomes based on the type
                      of learning objective.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEIGHT CONFIGURATION */}
      {activeTab === "weights" && (
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100">
            <h2 className="text-md font-bold text-gray-900">
              Assessment Weight Configuration
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Define SBA vs Summative assessment ratios
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  School-Based Assessment (SBA) Weight
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weightConfig.sbaWeight}
                    onChange={(e) =>
                      setWeightConfig({
                        sbaWeight: parseInt(e.target.value),
                        examWeight: 100 - parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-green-700">
                    {weightConfig.sbaWeight}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Includes CATs, projects, assignments, and continuous
                  assessment
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Summative Assessment Weight
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weightConfig.examWeight}
                    onChange={(e) =>
                      setWeightConfig({
                        examWeight: parseInt(e.target.value),
                        sbaWeight: 100 - parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-green-700">
                    {weightConfig.examWeight}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Includes end of term exams and national assessments
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-800">
                    Weight Configuration Notice
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changes to weight configuration will affect all future
                    assessments. The total must always equal 100%.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowWeightModal(true)}
                className="px-5 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weight Config Modal */}
      {showWeightModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowWeightModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Confirm Weight Configuration
              </h3>
              <button
                onClick={() => setShowWeightModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-800">
                Are you sure you want to update the weight configuration?
              </p>
              <p className="text-xs text-gray-600 mt-2">
                SBA: {weightConfig.sbaWeight}% | Exam: {weightConfig.examWeight}
                %
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowWeightModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateWeightConfig}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERSION HISTORY */}
      {activeTab === "versions" && (
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300 px-6 py-4 bg-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-md font-bold text-gray-900">
                Curriculum Version History
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Track changes and manage curriculum versions across academic
                years
              </p>
            </div>
            <button
              onClick={() => setShowVersionModal(true)}
              className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              New Version
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">
                    Version Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">
                    Academic Year
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">
                    Created Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      {version.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {version.academicYear}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {version.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                          Active
                        </span>
                      ) : version.isPublished ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium border border-yellow-200">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {new Date(version.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-2 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                          <Eye className="h-3 w-3 inline" />
                        </button>
                        {!version.isPublished && !version.isActive && (
                          <button
                            onClick={async () => {
                              const response = await fetch(
                                `${API_BASE_URL}/api/registrar/academic/curriculum/versions/${version.id}/activate/`,
                                {
                                  method: "POST",
                                  headers: getAuthHeaders(),
                                },
                              );
                              const data = await response.json();
                              if (data.success) {
                                addNotification("success", "Version activated");
                                await fetchVersions();
                              }
                            }}
                            className="px-2 py-1 bg-green-600 text-white text-xs font-medium border border-green-700 hover:bg-green-700"
                          >
                            <Lock className="h-3 w-3 inline" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: GRADE LEVELS - NEW */}
      {activeTab === "grade-levels" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openAddGrade}
              className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800"
            >
              <Plus className="h-4 w-4 inline mr-2" /> Add Grade Level
            </button>
          </div>
          <div className="bg-white border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {gradeLevels.map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono">{grade.level}</td>
                    <td className="px-4 py-3 font-medium">{grade.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {grade.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openEditGrade(grade)}
                        className="mr-2 p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(grade)}
                        className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* TAB 6: ACADEMIC YEARS */}
      {activeTab === "academic-years" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingAcademicYear(null);
                setAcademicYearForm({
                  year_code: "",
                  year_name: "",
                  start_date: "",
                  end_date: "",
                  is_current: false,
                });
                setShowAcademicYearModal(true);
              }}
              className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800"
            >
              <Plus className="h-4 w-4 inline mr-2" /> Add Academic Year
            </button>
          </div>
          <div className="bg-white border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Year Code
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Year Name
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">
                    Current
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((yr) => (
                  <tr
                    key={yr.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono font-bold">
                      {yr.year_code}
                    </td>
                    <td className="px-4 py-3 font-medium">{yr.year_name}</td>
                    <td className="px-4 py-3">{yr.start_date}</td>
                    <td className="px-4 py-3">{yr.end_date}</td>
                    <td className="px-4 py-3 text-center">
                      {yr.is_current ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                          Current
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs border border-gray-200">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openEditAcademicYear(yr)}
                        className="mr-2 p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAcademicYear(yr)}
                        className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {academicYears.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No academic years found. Click "Add Academic Year" to
                      create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* TAB 7: TERMS */}
      {activeTab === "terms" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700">
                Filter by Year:
              </label>
              <select
                value={termAcademicYearFilter}
                onChange={(e) => setTermAcademicYearFilter(e.target.value)}
                className="px-3 py-1 border border-gray-400 text-sm bg-white"
              >
                <option value="">All Years</option>
                {academicYears.map((yr) => (
                  <option key={yr.id} value={yr.id}>
                    {yr.year_code}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setEditingTerm(null);
                setTermForm({
                  academic_year: "",
                  term: "Term 1",
                  start_date: "",
                  end_date: "",
                  is_current: false,
                });
                setShowTermModal(true);
              }}
              className="px-4 py-2 bg-green-700 text-white text-sm font-medium border border-green-800 hover:bg-green-800"
            >
              <Plus className="h-4 w-4 inline mr-2" /> Add Term
            </button>
          </div>

          <div className="bg-white border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Academic Year
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Term
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">
                    Current
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {terms.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {t.academic_year_name || t.academic_year?.year_code}
                    </td>
                    <td className="px-4 py-3">Term {t.term}</td>
                    <td className="px-4 py-3">{t.start_date}</td>
                    <td className="px-4 py-3">{t.end_date}</td>
                    <td className="px-4 py-3 text-center">
                      {t.is_current ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                          Current
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs border border-gray-200">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openEditTerm(t)}
                        className="mr-2 p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(t)}
                        className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {terms.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No terms found. Select an academic year or add a new term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Subject Modal */}
      {showSubjectModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowSubjectModal(false);
            setEditingItem(null);
            resetSubjectForm();
          }}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                {editingItem ? "Edit Subject" : "Add Subject"}
              </h3>
              <button
                onClick={() => {
                  setShowSubjectModal(false);
                  setEditingItem(null);
                  resetSubjectForm();
                }}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Subject Type
                </label>
                <select
                  value={subjectForm.isCore}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      isCore: e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="true">Core Subject (Ministry Mandated)</option>
                  <option value="false">Optional/Elective Subject</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={subjectForm.description}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSubjectModal(false);
                  setEditingItem(null);
                  resetSubjectForm();
                }}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? updateSubject : createSubject}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strand Modal - FIXED with Grade Level Selector */}
      {showStrandModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowStrandModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Add Strand</h3>
              <button
                onClick={() => setShowStrandModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Subject:{" "}
                <span className="font-bold">{selectedSubject?.name}</span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Grade Level *
                </label>
                <select
                  value={strandForm.gradeLevel}
                  onChange={(e) =>
                    setStrandForm({ ...strandForm, gradeLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Grade Level</option>
                  {gradeLevels.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Strand Name *
                </label>
                <input
                  type="text"
                  value={strandForm.name}
                  onChange={(e) =>
                    setStrandForm({ ...strandForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Strand Code
                </label>
                <input
                  type="text"
                  value={strandForm.code}
                  onChange={(e) =>
                    setStrandForm({
                      ...strandForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={strandForm.description}
                  onChange={(e) =>
                    setStrandForm({
                      ...strandForm,
                      description: e.target.value,
                    })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowStrandModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createStrand}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Strand Modal */}
      {showSubStrandModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSubStrandModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Add Sub-Strand
              </h3>
              <button
                onClick={() => setShowSubStrandModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Strand:{" "}
                <span className="font-bold">{selectedStrand?.name}</span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Sub-Strand Name *
                </label>
                <input
                  type="text"
                  value={subStrandForm.name}
                  onChange={(e) =>
                    setSubStrandForm({ ...subStrandForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Sub-Strand Code
                </label>
                <input
                  type="text"
                  value={subStrandForm.code}
                  onChange={(e) =>
                    setSubStrandForm({
                      ...subStrandForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={subStrandForm.description}
                  onChange={(e) =>
                    setSubStrandForm({
                      ...subStrandForm,
                      description: e.target.value,
                    })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowSubStrandModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createSubStrand}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Outcome Modal */}
      {showOutcomeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowOutcomeModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Add Learning Outcome
              </h3>
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Sub-Strand:{" "}
                <span className="font-bold">{selectedSubStrand?.name}</span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Learning Outcome Description *
                </label>
                <textarea
                  value={outcomeForm.description}
                  onChange={(e) =>
                    setOutcomeForm({
                      ...outcomeForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="By the end of the lesson, the learner should be able to..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Learning Domain
                </label>
                <select
                  value={outcomeForm.domain}
                  onChange={(e) =>
                    setOutcomeForm({ ...outcomeForm, domain: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  {LEARNING_DOMAINS.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Associated Competencies
                </label>
                <div className="border border-gray-400 p-3 max-h-32 overflow-y-auto">
                  {coreCompetencies.map((comp) => (
                    <label key={comp.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        value={comp.code}
                        onChange={(e) => {
                          const competencies = e.target.checked
                            ? [...outcomeForm.competencies, comp.code]
                            : outcomeForm.competencies.filter(
                                (c) => c !== comp.code,
                              );
                          setOutcomeForm({ ...outcomeForm, competencies });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {comp.name} ({comp.code})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createOutcome}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBulkImportModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Bulk Import Curriculum
              </h3>
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-300">
                <h4 className="text-sm font-bold text-blue-900 mb-2">
                  CSV/Excel Format Requirements
                </h4>
                <p className="text-xs text-blue-800">
                  Your file must include these columns:
                </p>
                <ul className="text-xs text-blue-800 mt-2 list-disc list-inside">
                  <li>Grade_Level (e.g., G1, G7, PP1)</li>
                  <li>Subject_Name (e.g., "Integrated Science")</li>
                  <li>Strand_Name (e.g., "Human Health")</li>
                  <li>Sub_Strand_Name (e.g., "Respiratory System")</li>
                  <li>Learning_Outcome (Measurable goal)</li>
                  <li>Competency_Key (e.g., "CT, DL")</li>
                  <li>Assessment_Scale (4 or 8)</li>
                  <li>SBA_Weight (e.g., 40)</li>
                  <li>Summative_Weight (e.g., 60)</li>
                  <li>Is_Optional (TRUE/FALSE)</li>
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 h-2">
                    <div
                      className="bg-green-600 h-2"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  <Download className="h-4 w-4 inline mr-1" />
                  Download Template
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Upload & Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clone Modal */}
      {showCloneModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCloneModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Clone Curriculum
              </h3>
              <button
                onClick={() => setShowCloneModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Copy the entire {activeVersion?.academicYear} curriculum to a
                new academic year.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Target Academic Year *
                </label>
                <input
                  type="text"
                  value={versionForm.academicYear}
                  onChange={(e) =>
                    setVersionForm({
                      ...versionForm,
                      academicYear: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., 2026"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Version Name
                </label>
                <input
                  type="text"
                  value={versionForm.name}
                  onChange={(e) =>
                    setVersionForm({ ...versionForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., 2026 Curriculum"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={cloneCurriculum}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Clone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Modal */}
      {showVersionModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowVersionModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                Create New Version
              </h3>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Version Name *
                </label>
                <input
                  type="text"
                  value={versionForm.name}
                  onChange={(e) =>
                    setVersionForm({ ...versionForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., 2026 Curriculum"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Academic Year *
                </label>
                <input
                  type="text"
                  value={versionForm.academicYear}
                  onChange={(e) =>
                    setVersionForm({
                      ...versionForm,
                      academicYear: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., 2026"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={versionForm.isActive}
                    onChange={(e) =>
                      setVersionForm({
                        ...versionForm,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as active version
                  </span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createNewVersion}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Level Modal */}
      {showGradeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowGradeModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                {editingGrade ? "Edit Grade Level" : "Add Grade Level"}
              </h3>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Level Number *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={gradeForm.level}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, level: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Grade Name *
                </label>
                <input
                  type="text"
                  value={gradeForm.name}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="e.g., Grade 7"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={gradeForm.description}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, description: e.target.value })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingGrade ? handleUpdateGrade : handleCreateGrade}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                {editingGrade ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Academic Year Modal */}
      {showAcademicYearModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAcademicYearModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                {editingAcademicYear
                  ? "Edit Academic Year"
                  : "Add Academic Year"}
              </h3>
              <button
                onClick={() => setShowAcademicYearModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Year Code *{" "}
                  <span className="font-normal text-gray-500">
                    (e.g. 2024-2025)
                  </span>
                </label>
                <input
                  type="text"
                  value={academicYearForm.year_code}
                  onChange={(e) =>
                    setAcademicYearForm({
                      ...academicYearForm,
                      year_code: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="2024-2025"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Year Name *
                </label>
                <input
                  type="text"
                  value={academicYearForm.year_name}
                  onChange={(e) =>
                    setAcademicYearForm({
                      ...academicYearForm,
                      year_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                  placeholder="Academic Year 2024/2025"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={academicYearForm.start_date}
                  onChange={(e) =>
                    setAcademicYearForm({
                      ...academicYearForm,
                      start_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={academicYearForm.end_date}
                  onChange={(e) =>
                    setAcademicYearForm({
                      ...academicYearForm,
                      end_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={academicYearForm.is_current}
                    onChange={(e) =>
                      setAcademicYearForm({
                        ...academicYearForm,
                        is_current: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as current academic year
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-5">
                  This will unset any previously current year.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAcademicYearModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAcademicYear}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                {editingAcademicYear ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Term Modal */}
      {showTermModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowTermModal(false)}
        >
          <div
            className="bg-white border border-gray-400 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">
                {editingTerm ? "Edit Term" : "Add Term"}
              </h3>
              <button
                onClick={() => setShowTermModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Academic Year *
                </label>
                <select
                  value={termForm.academic_year}
                  onChange={(e) =>
                    setTermForm({ ...termForm, academic_year: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Year</option>
                  {academicYears.map((yr) => (
                    <option key={yr.id} value={yr.id}>
                      {yr.year_code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Term Number *
                </label>
                <select
                  value={termForm.term}
                  onChange={(e) =>
                    setTermForm({ ...termForm, term: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={termForm.start_date}
                  onChange={(e) =>
                    setTermForm({ ...termForm, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={termForm.end_date}
                  onChange={(e) =>
                    setTermForm({ ...termForm, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termForm.is_current}
                    onChange={(e) =>
                      setTermForm({ ...termForm, is_current: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as current term for this academic year
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-5">
                  This will unset any other current term for the same year.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowTermModal(false)}
                className="px-4 py-2 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTerm}
                className="px-4 py-2 bg-green-700 text-white text-sm font-bold border border-green-800 hover:bg-green-800"
              >
                {editingTerm ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicManagement;
