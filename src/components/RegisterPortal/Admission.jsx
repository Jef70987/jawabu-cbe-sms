/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Users,
  School,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Info,
  UserPlus,
  Calendar,
  Phone,
  Mail,
  Shield,
  Heart,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Custom notification component
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
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full rounded-lg border p-4 shadow-lg animate-slide-in ${getStyles()}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle
              className={`h-6 w-6 ${type === "danger" ? "text-red-500" : type === "success" ? "text-green-500" : "text-yellow-500"} mr-3`}
            />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium ${getButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Admission() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState({ students: true, classes: true });
  const [notifications, setNotifications] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [stats, setStats] = useState({ total_students: 0, active_students: 0 });

  // Admission number configuration - Format: PREFIX-XXX (e.g., ADM/JWB-001)
  const [admissionConfig, setAdmissionConfig] = useState({
    prefix: "ADM/JWB",
    nextSequence: 1,
  });

  // Form data
  const [formData, setFormData] = useState({
    admission_no: "",
    upi_number: "",
    knec_number: "",
    birth_certificate_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "Kenyan",
    religion: "",
    blood_group: "",
    address: "",
    city: "",
    country: "Kenya",
    phone: "",
    email: "",
    current_class: "",
    admission_date: new Date().toISOString().split("T")[0],
    admission_type: "Regular",
    father_name: "",
    father_phone: "",
    father_email: "",
    father_occupation: "",
    mother_name: "",
    mother_phone: "",
    mother_email: "",
    mother_occupation: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_phone: "",
    guardian_email: "",
    guardian_address: "",
    medical_conditions: "",
    allergies: "",
    medication: "",
    emergency_contact: "",
    emergency_contact_name: "",
    previous_school: "",
    previous_class: "",
    transfer_certificate_no: "",
    status: "Active",
  });

  const [formErrors, setFormErrors] = useState({});

  const steps = [
    { number: 1, title: "Personal" },
    { number: 2, title: "Contact" },
    { number: 3, title: "Parent/Guardian" },
    { number: 4, title: "Medical" },
    { number: 5, title: "Review" },
  ];

  const genders = ["Male", "Female", "Other"];
  const nationalities = ["Kenyan", "Other"];
  const religions = ["Christian", "Muslim", "Hindu", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const relationships = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Uncle",
    "Aunt",
    "Grandfather",
    "Grandmother",
    "Other",
  ];

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification("error", "Please login to access admission system");
      return;
    }
    fetchInitialData();
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading({ students: true, classes: true });
      await fetchStudents();
      await fetchClasses();
      await fetchStatistics();
    } catch (error) {
      console.error("Initial fetch error:", error);
      addNotification("error", "Error fetching initial data.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        updateAdmissionConfigFromStudents(data.data);
      }
    } catch (error) {
      console.error("Students fetch error:", error);
      addNotification("error", "Error fetching students.");
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/classes/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setClasses(data.data);
      }
    } catch (error) {
      console.error("Classes fetch error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/admission-stats/`,
        { headers: getAuthHeaders() },
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) setStats(data.data);
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  // Parse admission number - Format: PREFIX-XXX (e.g., ADM/JWB-001)
  const parseAdmissionNumber = (admNo) => {
    if (!admNo) return null;
    const regex = /^([A-Z/]+)-(\d+)$/;
    const match = admNo.match(regex);
    if (match) {
      return { prefix: match[1], sequence: parseInt(match[2], 10) };
    }
    return null;
  };

  const updateAdmissionConfigFromStudents = (studentsList) => {
    if (studentsList.length === 0) return;
    let highestSequence = 0;
    studentsList.forEach((student) => {
      if (student.admission_no) {
        const parsed = parseAdmissionNumber(student.admission_no);
        if (parsed && parsed.sequence > highestSequence) {
          highestSequence = parsed.sequence;
        }
      }
    });
    setAdmissionConfig((prev) => ({
      ...prev,
      nextSequence: highestSequence + 1,
    }));
  };

  // Generate admission number in format "ADM/JWB-001"
  const generateAdmissionNumber = () => {
    const { prefix, nextSequence } = admissionConfig;
    const sequenceStr = nextSequence.toString().padStart(3, "0");
    return `${prefix}-${sequenceStr}`;
  };

  useEffect(() => {
    if (!loading.students) {
      setFormData((prev) => ({
        ...prev,
        admission_no: generateAdmissionNumber(),
      }));
    }
  }, [admissionConfig.nextSequence, loading.students]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 1:
        if (!formData.first_name) errors.first_name = "First name is required";
        if (!formData.last_name) errors.last_name = "Last name is required";
        if (!formData.gender) errors.gender = "Gender is required";
        if (!formData.date_of_birth)
          errors.date_of_birth = "Date of birth is required";
        break;
      case 2:
        if (!formData.address) errors.address = "Address is required";
        if (!formData.phone) errors.phone = "Phone number is required";
        if (!formData.current_class) errors.current_class = "Class is required";
        break;
      case 3:
        if (!formData.guardian_name)
          errors.guardian_name = "Guardian name is required";
        if (!formData.guardian_phone)
          errors.guardian_phone = "Guardian phone is required";
        if (!formData.guardian_relation)
          errors.guardian_relation = "Guardian relation is required";
        break;
      case 4:
        if (!formData.emergency_contact_name)
          errors.emergency_contact_name = "Emergency contact name is required";
        if (!formData.emergency_contact)
          errors.emergency_contact = "Emergency contact phone is required";
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      addNotification("warning", "Please fill in all required fields.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitAdmission = async () => {
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        addNotification("warning", `Please complete Step ${step} correctly.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        addNotification(
          "success",
          `Student ${formData.first_name} ${formData.last_name} registered successfully with admission number ${formData.admission_no}!`,
        );
        await fetchStudents();
        await fetchStatistics();
        resetForm();
        setCurrentStep(1);
      } else {
        addNotification("error", data.error || "Failed to register student");
      }
    } catch (error) {
      console.error("Submit error:", error);
      addNotification("error", "Failed to register student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAdmissionConfig((prev) => ({
      ...prev,
      nextSequence: prev.nextSequence + 1,
    }));
    setFormData({
      admission_no: generateAdmissionNumber(),
      upi_number: "",
      knec_number: "",
      birth_certificate_no: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      nationality: "Kenyan",
      religion: "",
      blood_group: "",
      address: "",
      city: "",
      country: "Kenya",
      phone: "",
      email: "",
      current_class: "",
      admission_date: new Date().toISOString().split("T")[0],
      admission_type: "Regular",
      father_name: "",
      father_phone: "",
      father_email: "",
      father_occupation: "",
      mother_name: "",
      mother_phone: "",
      mother_email: "",
      mother_occupation: "",
      guardian_name: "",
      guardian_relation: "",
      guardian_phone: "",
      guardian_email: "",
      guardian_address: "",
      medical_conditions: "",
      allergies: "",
      medication: "",
      emergency_contact: "",
      emergency_contact_name: "",
      previous_school: "",
      previous_class: "",
      transfer_certificate_no: "",
      status: "Active",
    });
    setFormErrors({});
  };

  const saveConfig = () => {
    setShowConfigModal(false);
    addNotification("success", "Admission configuration updated");
  };

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // Show all records
      setImportPreview(jsonData);
      setShowImportModal(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmImport = async () => {
    if (!importFile) return;
    setIsImporting(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("excelFile", importFile);
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/import/`,
        {
          method: "POST",
          headers: { Authorization: getAuthHeaders()["Authorization"] },
          body: formDataUpload,
        },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.errors && data.errors.length > 0) {
          // Show detailed errors in a structured way
          const errorCount = data.errors.length;
          const firstErrors = data.errors
            .slice(0, 3)
            .map((e) => `Row ${e.row}: ${e.error}`)
            .join("\n");
          addNotification(
            "warning",
            `Imported ${data.importedCount} students. ${errorCount} rows had errors:\n${firstErrors}${errorCount > 3 ? "\n..." : ""}`,
          );
        } else {
          addNotification(
            "success",
            `Imported ${data.importedCount} students successfully!`,
          );
        }
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        await fetchStudents();
        await fetchStatistics();
      } else {
        addNotification("error", data.error || "Import failed");
      }
    } catch (error) {
      console.error("Import error:", error);
      addNotification("error", "Failed to import students.");
    } finally {
      setIsImporting(false);
    }
  };
  const downloadTemplate = () => {
    // Generate a sample admission number in the correct format
    const sampleAdmissionNo = `${admissionConfig.prefix}-001`;

    const templateData = [
      {
        admission_no: sampleAdmissionNo,
        upi_number: "UPI2024001234",
        knec_number: "KNEC2024012345",
        birth_certificate_no: "BC12345678",
        first_name: "John",
        middle_name: "Kiprop",
        last_name: "Mwangi",
        date_of_birth: "2010-05-15",
        gender: "Male",
        nationality: "Kenyan",
        religion: "Christian",
        blood_group: "O+",
        address: "123 Main Street",
        city: "Nairobi",
        country: "Kenya",
        phone: "0712345678",
        email: "john@example.com",
        current_class: "",
        admission_date: new Date().toISOString().split("T")[0],
        admission_type: "Regular",
        father_name: "Peter Mwangi",
        father_phone: "0723456789",
        father_email: "peter@example.com",
        father_occupation: "Engineer",
        mother_name: "Mary Mwangi",
        mother_phone: "0734567890",
        mother_email: "mary@example.com",
        mother_occupation: "Teacher",
        guardian_name: "Peter Mwangi",
        guardian_relation: "Father",
        guardian_phone: "0723456789",
        guardian_email: "peter@example.com",
        guardian_address: "123 Main Street",
        medical_conditions: "None",
        allergies: "Peanuts",
        medication: "None",
        emergency_contact: "0723456789",
        emergency_contact_name: "Peter Mwangi",
        previous_school: "ABC Primary",
        previous_class: "Class 7",
        transfer_certificate_no: "TC12345",
        status: "Active",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "student_import_template.xlsx");
    addNotification("success", "Template downloaded successfully");
  };

  const getStepClass = (stepNumber) => {
    if (currentStep > stepNumber)
      return "bg-green-600 text-white border-green-600";
    if (currentStep === stepNumber)
      return "bg-blue-600 text-white border-blue-600";
    return "bg-white text-gray-500 border-gray-300";
  };

  const getClassById = (id) => {
    const cls = classes.find((c) => c.id == id);
    return cls
      ? `${cls.class_name}${cls.stream ? ` - ${cls.stream}` : ""}`
      : "Not selected";
  };

  const recentAdmissions = students.slice(0, 5).map((s) => ({
    name: `${s.first_name} ${s.last_name}`,
    admission_no: s.admission_no,
    date: new Date(s.admission_date).toLocaleDateString(),
    status: s.status,
  }));

  const animationStyle = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
  `;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <style>{animationStyle}</style>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to access the admission system
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{animationStyle}</style>

      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="mb-6 bg-green-700 p-4 md:p-6 rounded-l">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Student Admission
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Register new students and manage admissions
              </p>
              {user && (
                <p className="text-xs text-green-200 mt-1">
                  Logged in as: {user.first_name} {user.last_name}
                </p>
              )}
            </div>
            <button
              onClick={downloadTemplate}
              className="px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <Download className="h-4 w-4" />
              Download Template
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-l border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {stats.total_students}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-l border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active Students</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {stats.active_students}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-l border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Available Classes</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {classes.length}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              {/* Progress Steps */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    New Registration
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded-full">
                    Step {currentStep} of {steps.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${getStepClass(step.number)} border-2`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1 md:mt-2 font-medium text-center ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"}`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-1 md:mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div>
                  {/* Admission Number Section */}
                  <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admission Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.admission_no}
                            readOnly
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                          />
                          <button
                            onClick={() => setShowConfigModal(true)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Configure
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Format: {admissionConfig.prefix}-XXX
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Sequence</p>
                        <p className="text-lg md:text-xl font-bold text-blue-600">
                          {admissionConfig.nextSequence}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NEMIS Compliance Section */}
                  <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-l border border-gray-300">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 md:mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      NEMIS Compliance (Government Identifiers)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          UPI Number
                        </label>
                        <input
                          type="text"
                          value={formData.upi_number}
                          onChange={(e) =>
                            handleInputChange("upi_number", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                          placeholder="UPI2024001234"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          KNEC Number
                        </label>
                        <input
                          type="text"
                          value={formData.knec_number}
                          onChange={(e) =>
                            handleInputChange("knec_number", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                          placeholder="KNEC2024012345"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Birth Certificate No.
                        </label>
                        <input
                          type="text"
                          value={formData.birth_certificate_no}
                          onChange={(e) =>
                            handleInputChange(
                              "birth_certificate_no",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                          placeholder="BC12345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                      {formErrors.first_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.first_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={formData.middle_name}
                        onChange={(e) =>
                          handleInputChange("middle_name", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      {formErrors.last_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.last_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          handleInputChange("date_of_birth", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      {formErrors.date_of_birth && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.date_of_birth}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value="">Select Gender</option>
                        {genders.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      {formErrors.gender && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.gender}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <select
                        value={formData.nationality}
                        onChange={(e) =>
                          handleInputChange("nationality", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      >
                        {nationalities.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Religion
                      </label>
                      <select
                        value={formData.religion}
                        onChange={(e) =>
                          handleInputChange("religion", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value="">Select Religion</option>
                        {religions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={formData.blood_group}
                        onChange={(e) =>
                          handleInputChange("blood_group", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Academic */}
              {currentStep === 2 && (
                <div>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows="2"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      ></textarea>
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.current_class}
                          onChange={(e) =>
                            handleInputChange("current_class", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        >
                          <option value="">Select Class</option>
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.class_name}
                              {c.stream ? ` - ${c.stream}` : ""}
                            </option>
                          ))}
                        </select>
                        {formErrors.current_class && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.current_class}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admission Date
                        </label>
                        <input
                          type="date"
                          value={formData.admission_date}
                          onChange={(e) =>
                            handleInputChange("admission_date", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admission Type
                        </label>
                        <select
                          value={formData.admission_type}
                          onChange={(e) =>
                            handleInputChange("admission_type", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Transfer">Transfer</option>
                          <option value="Re-admission">Re-admission</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Parent/Guardian */}
              {currentStep === 3 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                      Father's Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.father_name}
                        onChange={(e) =>
                          handleInputChange("father_name", e.target.value)
                        }
                        placeholder="Father's Name"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="tel"
                        value={formData.father_phone}
                        onChange={(e) =>
                          handleInputChange("father_phone", e.target.value)
                        }
                        placeholder="Father's Phone"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="email"
                        value={formData.father_email}
                        onChange={(e) =>
                          handleInputChange("father_email", e.target.value)
                        }
                        placeholder="Father's Email"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.father_occupation}
                        onChange={(e) =>
                          handleInputChange("father_occupation", e.target.value)
                        }
                        placeholder="Occupation"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-pink-800 mb-2 md:mb-3 text-sm md:text-base">
                      Mother's Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.mother_name}
                        onChange={(e) =>
                          handleInputChange("mother_name", e.target.value)
                        }
                        placeholder="Mother's Name"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="tel"
                        value={formData.mother_phone}
                        onChange={(e) =>
                          handleInputChange("mother_phone", e.target.value)
                        }
                        placeholder="Mother's Phone"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="email"
                        value={formData.mother_email}
                        onChange={(e) =>
                          handleInputChange("mother_email", e.target.value)
                        }
                        placeholder="Mother's Email"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.mother_occupation}
                        onChange={(e) =>
                          handleInputChange("mother_occupation", e.target.value)
                        }
                        placeholder="Occupation"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-amber-800 mb-2 md:mb-3 text-sm md:text-base">
                      Guardian Information{" "}
                      <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={formData.guardian_name}
                          onChange={(e) =>
                            handleInputChange("guardian_name", e.target.value)
                          }
                          placeholder="Guardian Name"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                        {formErrors.guardian_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.guardian_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <select
                          value={formData.guardian_relation}
                          onChange={(e) =>
                            handleInputChange(
                              "guardian_relation",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        >
                          <option value="">Select Relationship</option>
                          {relationships.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        {formErrors.guardian_relation && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.guardian_relation}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={formData.guardian_phone}
                          onChange={(e) =>
                            handleInputChange("guardian_phone", e.target.value)
                          }
                          placeholder="Guardian Phone"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                        {formErrors.guardian_phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.guardian_phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          value={formData.guardian_email}
                          onChange={(e) =>
                            handleInputChange("guardian_email", e.target.value)
                          }
                          placeholder="Guardian Email"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <textarea
                          value={formData.guardian_address}
                          onChange={(e) =>
                            handleInputChange(
                              "guardian_address",
                              e.target.value,
                            )
                          }
                          placeholder="Guardian Address"
                          rows="2"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Medical & Emergency */}
              {currentStep === 4 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-green-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-green-800 mb-2 md:mb-3 text-sm md:text-base">
                      Medical Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <textarea
                        value={formData.medical_conditions}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_conditions",
                            e.target.value,
                          )
                        }
                        placeholder="Medical Conditions"
                        rows="2"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      ></textarea>
                      <textarea
                        value={formData.allergies}
                        onChange={(e) =>
                          handleInputChange("allergies", e.target.value)
                        }
                        placeholder="Allergies"
                        rows="2"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      ></textarea>
                      <textarea
                        value={formData.medication}
                        onChange={(e) =>
                          handleInputChange("medication", e.target.value)
                        }
                        placeholder="Medication"
                        rows="2"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-red-800 mb-2 md:mb-3 text-sm md:text-base">
                      Emergency Contact <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={formData.emergency_contact_name}
                          onChange={(e) =>
                            handleInputChange(
                              "emergency_contact_name",
                              e.target.value,
                            )
                          }
                          placeholder="Contact Name"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                        {formErrors.emergency_contact_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.emergency_contact_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={formData.emergency_contact}
                          onChange={(e) =>
                            handleInputChange(
                              "emergency_contact",
                              e.target.value,
                            )
                          }
                          placeholder="Contact Phone"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                        {formErrors.emergency_contact && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.emergency_contact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
                      Previous School Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.previous_school}
                        onChange={(e) =>
                          handleInputChange("previous_school", e.target.value)
                        }
                        placeholder="Previous School"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.previous_class}
                        onChange={(e) =>
                          handleInputChange("previous_class", e.target.value)
                        }
                        placeholder="Previous Class"
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.transfer_certificate_no}
                        onChange={(e) =>
                          handleInputChange(
                            "transfer_certificate_no",
                            e.target.value,
                          )
                        }
                        placeholder="Transfer Certificate No."
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                      NEMIS Compliance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <p>
                        <span className="text-gray-500">UPI:</span>{" "}
                        <strong>{formData.upi_number || "Not provided"}</strong>
                      </p>
                      <p>
                        <span className="text-gray-500">KNEC:</span>{" "}
                        <strong>
                          {formData.knec_number || "Not provided"}
                        </strong>
                      </p>
                      <p>
                        <span className="text-gray-500">Birth Cert:</span>{" "}
                        <strong>
                          {formData.birth_certificate_no || "Not provided"}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                      Student Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-gray-500">Admission No:</span>{" "}
                        <strong className="font-mono">
                          {formData.admission_no}
                        </strong>
                      </p>
                      <p>
                        <span className="text-gray-500">Full Name:</span>{" "}
                        <strong>
                          {formData.first_name} {formData.last_name}
                        </strong>
                      </p>
                      <p>
                        <span className="text-gray-500">Date of Birth:</span>{" "}
                        {formData.date_of_birth}
                      </p>
                      <p>
                        <span className="text-gray-500">Gender:</span>{" "}
                        {formData.gender}
                      </p>
                      <p>
                        <span className="text-gray-500">Class:</span>{" "}
                        {getClassById(formData.current_class)}
                      </p>
                      <p>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold text-amber-800 mb-2 text-sm">
                      Guardian Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-gray-500">Guardian:</span>{" "}
                        {formData.guardian_name}
                      </p>
                      <p>
                        <span className="text-gray-500">Relation:</span>{" "}
                        {formData.guardian_relation}
                      </p>
                      <p>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {formData.guardian_phone}
                      </p>
                      <p>
                        <span className="text-gray-500">Emergency:</span>{" "}
                        {formData.emergency_contact_name} (
                        {formData.emergency_contact})
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-blue-50">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        disabled
                        className="w-4 h-4"
                      />
                      <span className="text-xs md:text-sm text-gray-700">
                        I confirm that all information provided is accurate and
                        complete.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={resetForm}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  {currentStep < steps.length && (
                    <button
                      onClick={nextStep}
                      className="px-4 md:px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === steps.length && (
                    <button
                      onClick={submitAdmission}
                      disabled={isSubmitting}
                      className="px-4 md:px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" /> Submit
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Bulk Import Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                Bulk Import
              </h3>
              <div className="p-3 bg-blue-50 rounded-lg mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-blue-700">
                  Import multiple students from Excel file. Download the
                  template first.
                </p>
              </div>
              <input
                type="file"
                onChange={onFileSelected}
                accept=".csv,.xlsx,.xls"
                className="w-full mb-3 text-sm bg-blue-200 py-4 rounded-l border border-blue-200"
              />
              <button
                onClick={downloadTemplate}
                className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Template
              </button>
            </div>

            {/* Recent Admissions */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  Recent Admissions
                </h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {loading.students ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                  </div>
                ) : recentAdmissions.length > 0 ? (
                  recentAdmissions.map((admission, idx) => (
                    <div key={idx} className="p-3 md:p-4 hover:bg-gray-50">
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {admission.name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {admission.admission_no}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {admission.date}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {admission.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No students yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal - Shows all records */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="px-4 py-3 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-base md:text-lg font-bold">
                Preview Import Data
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  File: <span className="font-medium">{importFile?.name}</span>
                  <span className="ml-4">
                    Total Records:{" "}
                    <strong className="text-blue-600">
                      {importPreview.length}
                    </strong>
                  </span>
                </p>
              </div>

              {importPreview.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm border-collapse">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-100">
                        {Object.keys(importPreview[0]).map((key, idx) => (
                          <th
                            key={idx}
                            className="text-left p-2 border border-gray-300 font-semibold whitespace-nowrap"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.values(row).map((value, colIdx) => (
                            <td
                              key={colIdx}
                              className="p-2 border border-gray-200 whitespace-nowrap"
                            >
                              {String(value || "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No preview available</p>
              )}

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-700 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Showing all {importPreview.length} records. Please verify
                    the data before importing. Admission numbers should follow
                    the format:{" "}
                    <strong className="font-mono">
                      {admissionConfig.prefix}-XXX
                    </strong>{" "}
                    (e.g., {admissionConfig.prefix}-001)
                  </span>
                </p>
              </div>
            </div>
            <div className="px-4 py-3 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                disabled={isImporting}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Importing...
                  </>
                ) : (
                  `Import ${importPreview.length} Records`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-3 border-b">
              <h3 className="text-base md:text-lg font-bold">
                Admission Number Configuration
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Prefix</label>
                <input
                  type="text"
                  value={admissionConfig.prefix}
                  onChange={(e) =>
                    setAdmissionConfig((prev) => ({
                      ...prev,
                      prefix: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                  placeholder="e.g., ADM/JWB"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format will be: PREFIX-XXX
                </p>
                ``
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Next Sequence
                </label>
                <input
                  type="number"
                  value={admissionConfig.nextSequence}
                  onChange={(e) =>
                    setAdmissionConfig((prev) => ({
                      ...prev,
                      nextSequence: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  Next Admission Number:{" "}
                  <strong className="font-mono">
                    {generateAdmissionNumber()}
                  </strong>
                </p>
              </div>
            </div>
            <div className="px-4 py-3 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admission;
