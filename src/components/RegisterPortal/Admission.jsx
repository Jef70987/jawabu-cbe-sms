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
  MapPin,
  User,
  Heart,
  Shield,
  BookOpen,
  FileText,
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
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full md:w-auto animate-slide-in ${getStyles()} rounded-lg border p-4 shadow-lg`}
    >
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
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
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
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
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
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
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonStyles()}`}
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
  const [loading, setLoading] = useState({
    students: true,
    classes: true,
    stats: true,
  });
  const [notifications, setNotifications] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    class_distribution: [],
    gender_distribution: { male: 0, female: 0, other: 0 },
    admission_type_distribution: {},
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    data: null,
    action: null,
  });

  // Admission number configuration
  const [admissionConfig, setAdmissionConfig] = useState({
    lastAdmissionNumber: "",
    prefix: "ADM",
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    nextSequence: 1,
  });

  // Complete form data structure matching the Student model
  const [formData, setFormData] = useState({
    admission_no: "",
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
    current_section: "",
    stream: "",
    roll_number: "",
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
    expected_graduation_date: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Contact & Academic", icon: BookOpen },
    { number: 3, title: "Parent/Guardian", icon: Users },
    { number: 4, title: "Medical & Emergency", icon: Heart },
    { number: 5, title: "Review & Submit", icon: FileText },
  ];

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Check authentication on mount
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
      setLoading({ students: true, classes: true, stats: true });

      // Fetch students
      await fetchStudents();

      // Fetch classes
      await fetchClasses();

      // Fetch statistics
      await fetchStatistics();
    } catch (error) {
      console.error("Initial fetch error:", error);
      addNotification(
        "error",
        "Error fetching initial data. Please refresh the page.",
      );
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar/students/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          addNotification("error", "Session expired. Please login again.");
          navigate("/Logout");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setStudents(data.data);

        // Update admission config based on existing students
        updateAdmissionConfigFromStudents(data.data);
      } else {
        addNotification("error", data.error || "Failed to load students");
      }
    } catch (error) {
      console.error("Students fetch error:", error);
      addNotification(
        "error",
        "Error fetching students. Please check your connection.",
      );
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
        if (data.success) {
          setClasses(data.data);
        }
      }
    } catch (error) {
      console.error("Classes fetch error:", error);
      addNotification("error", "Failed to load classes");
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/admission-stats/`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  // Parse admission number and extract components
  const parseAdmissionNumber = (admNo) => {
    if (!admNo) return null;

    // Match format: PREFIX-YYYYMM-SEQUENCE
    const regex = /^([A-Z]+)-(\d{4})(\d{2})-(\d+)$/;
    const match = admNo.match(regex);

    if (match) {
      return {
        prefix: match[1],
        year: parseInt(match[2], 10),
        month: parseInt(match[3], 10),
        sequence: parseInt(match[4], 10),
      };
    }
    return null;
  };

  // Update admission config from existing students
  const updateAdmissionConfigFromStudents = (studentsList) => {
    if (studentsList.length === 0) return;

    let highestSequence = 0;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    studentsList.forEach((student) => {
      if (student.admission_no) {
        const parsed = parseAdmissionNumber(student.admission_no);
        if (
          parsed &&
          parsed.year === currentYear &&
          parsed.month === currentMonth &&
          parsed.sequence > highestSequence
        ) {
          highestSequence = parsed.sequence;
        }
      }
    });

    setAdmissionConfig((prev) => ({
      ...prev,
      nextSequence: highestSequence + 1,
    }));
  };

  // Generate admission number
  const generateAdmissionNumber = () => {
    const { prefix, year, month, nextSequence } = admissionConfig;
    return `${prefix}-${year}${month.toString().padStart(2, "0")}-${nextSequence}`;
  };

  // Update admission number when config changes
  useEffect(() => {
    if (!loading.students) {
      const newAdmissionNo = generateAdmissionNumber();
      setFormData((prev) => ({
        ...prev,
        admission_no: newAdmissionNo,
      }));
    }
  }, [admissionConfig.nextSequence, loading.students]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setAdmissionConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        if (!formData.city) errors.city = "City is required";
        if (!formData.phone) errors.phone = "Phone number is required";
        if (!formData.current_class) errors.current_class = "Class is required";
        if (!formData.roll_number)
          errors.roll_number = "Roll number is required";
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
      addNotification(
        "warning",
        "Please fill in all required fields before proceeding.",
      );
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      addNotification("error", "Please login to register students");
      return;
    }

    // Validate all steps
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        addNotification("warning", `Please complete Step ${step} correctly.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Map form fields to match backend expectations
      const submitData = {
        ...formData,
        expected_graduation_date: formData.expected_graduation_date || null,
        current_class: formData.current_class,
      };

      // Remove any fields that shouldn't be sent
      delete submitData.current_class_id; // if it exists

      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(submitData),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        addNotification(
          "success",
          `Student ${formData.first_name} ${formData.last_name} registered successfully with admission number ${formData.admission_no}`,
        );

        // Refresh data
        await fetchStudents();
        await fetchStatistics();

        // Reset form with new admission number
        resetForm();
        setCurrentStep(1);
      } else {
        addNotification("error", data.error || "Failed to register student");
      }
    } catch (error) {
      console.error("Submit error:", error);
      addNotification("error", "Failed to register student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Increment sequence for next admission
    setAdmissionConfig((prev) => ({
      ...prev,
      nextSequence: prev.nextSequence + 1,
    }));

    setFormData({
      admission_no: generateAdmissionNumber(),
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
      current_section: "",
      stream: "",
      roll_number: "",
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
      expected_graduation_date: "",
    });
    setFormErrors({});
  };

  const saveAdmissionConfig = () => {
    if (admissionConfig.lastAdmissionNumber) {
      const parsed = parseAdmissionNumber(admissionConfig.lastAdmissionNumber);
      if (parsed) {
        setAdmissionConfig((prev) => ({
          ...prev,
          prefix: parsed.prefix,
          year: parsed.year,
          month: parsed.month,
          nextSequence: parsed.sequence + 1,
        }));
      }
    }

    setShowConfigModal(false);
    addNotification("success", "Admission number configuration updated");
  };

  // Excel Import Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Preview first 5 rows
      setImportPreview(jsonData.slice(0, 5));
      setShowImportModal(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportSubmit = async () => {
    if (!importFile) return;

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("excelFile", importFile);

      const response = await fetch(
        `${API_BASE_URL}/api/registrar/students/import/`,
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeaders()["Authorization"],
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        addNotification(
          "success",
          `Successfully imported ${data.importedCount} students!`,
        );
        if (data.errors && data.errors.length > 0) {
          console.warn("Import errors:", data.errors);
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
      addNotification("error", "Failed to import students. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // check if we have any classes
    if (classes.length === 0) {
      addNotification(
        "warning",
        "No classes available. Please create classes first.",
      );
      return;
    }

    // Use the first class ID from your classes list
    const firstClassId = classes[0]?.id || "";

    const templateData = [
      {
        admission_no: "",
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
        current_class: firstClassId, // This will be the actual UUID
        current_section: "A",
        stream: "Blue",
        roll_number: "1",
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
        expected_graduation_date: "2026-12-31",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "student_import_template.xlsx");

    addNotification("success", "Template downloaded successfully");
  };

  // Render admission number field
  const renderAdmissionNumberField = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admission Number
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="admission_no"
              value={formData.admission_no}
              readOnly
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm w-64"
            />
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              Configure
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Next Sequence</p>
          <p className="text-2xl font-bold text-blue-600">
            {admissionConfig.nextSequence}
          </p>
        </div>
      </div>
    </div>
  );

  // Render configuration modal
  const renderConfigModal = () => (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Admission Number Configuration
            </h3>
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                <p className="text-sm text-blue-700">
                  Set the last admission number used to continue the sequence
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Admission Number Used
              </label>
              <input
                type="text"
                name="lastAdmissionNumber"
                value={admissionConfig.lastAdmissionNumber}
                onChange={handleConfigChange}
                placeholder="e.g., ADM-202401-25"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: PREFIX-YYYYMM-SEQUENCE (e.g., ADM-202401-25)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefix
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={admissionConfig.prefix}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={admissionConfig.year}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium text-amber-800">
                    Next Admission Number
                  </p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {generateAdmissionNumber()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current sequence: {admissionConfig.nextSequence}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={() => setShowConfigModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveAdmissionConfig}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );

  // Render form steps
  const renderStep = () => {
    const CurrentStepIcon = steps[currentStep - 1].icon;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Personal Details
              </h3>
            </div>

            {renderAdmissionNumberField()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.first_name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                />
                {formErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter middle name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.last_name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                />
                {formErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.date_of_birth
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.date_of_birth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.gender
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.gender}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion
                </label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Religion</option>
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Contact & Academic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.address
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter physical address"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.city
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="0712345678"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="student@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="current_class"
                    value={formData.current_class}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.current_class
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} ({cls.class_code}) - Level{" "}
                        {cls.numeric_level}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    name="current_section"
                    value={formData.current_section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., A, B, C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream
                  </label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Stream</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Purple">Purple</option>
                    <option value="Orange">Orange</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.roll_number
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="1"
                  />
                  {formErrors.roll_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.roll_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Type
                  </label>
                  <select
                    name="admission_type"
                    value={formData.admission_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Re-admission">Re-admission</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Parent/Guardian Details
              </h3>
            </div>

            <div className="space-y-8">
              {/* Father's Information */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Father's Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Phone
                    </label>
                    <input
                      type="tel"
                      name="father_phone"
                      value={formData.father_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Email
                    </label>
                    <input
                      type="email"
                      name="father_email"
                      value={formData.father_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="father@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Occupation
                    </label>
                    <input
                      type="text"
                      name="father_occupation"
                      value={formData.father_occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Mother's Information */}
              <div className="bg-pink-50 rounded-lg p-5 border border-pink-200">
                <h4 className="font-semibold text-pink-800 mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Mother's Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Phone
                    </label>
                    <input
                      type="tel"
                      name="mother_phone"
                      value={formData.mother_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Email
                    </label>
                    <input
                      type="email"
                      name="mother_email"
                      value={formData.mother_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="mother@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Occupation
                    </label>
                    <input
                      type="text"
                      name="mother_occupation"
                      value={formData.mother_occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Teacher"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian's Information */}
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-4 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Guardian's Information{" "}
                  <span className="text-red-500 ml-1">*</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="guardian_name"
                      value={formData.guardian_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.guardian_name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter guardian's name"
                    />
                    {formErrors.guardian_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.guardian_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="guardian_phone"
                      value={formData.guardian_phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.guardian_phone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="0712345678"
                    />
                    {formErrors.guardian_phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.guardian_phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Relationship{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="guardian_relation"
                      value={formData.guardian_relation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.guardian_relation
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.guardian_relation && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.guardian_relation}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      name="guardian_email"
                      value={formData.guardian_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="guardian@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Address
                    </label>
                    <textarea
                      name="guardian_address"
                      value={formData.guardian_address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter guardian's address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Medical & Emergency Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Medical Information */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Medical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List any medical conditions (if none, type 'None')"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List any allergies (if none, type 'None')"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication
                    </label>
                    <textarea
                      name="medication"
                      value={formData.medication}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List current medications (if none, type 'None')"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Emergency Contact <span className="text-red-500 ml-1">*</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.emergency_contact_name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter emergency contact name"
                    />
                    {formErrors.emergency_contact_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.emergency_contact_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.emergency_contact
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="0712345678"
                    />
                    {formErrors.emergency_contact && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.emergency_contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Previous School Information */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Previous School Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous School
                    </label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter previous school name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Class
                    </label>
                    <input
                      type="text"
                      name="previous_class"
                      value={formData.previous_class}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Class 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Certificate No.
                    </label>
                    <input
                      type="text"
                      name="transfer_certificate_no"
                      value={formData.transfer_certificate_no}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="TC12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Graduation Date
                    </label>
                    <input
                      type="date"
                      name="expected_graduation_date"
                      value={formData.expected_graduation_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Review & Submit Application
              </h3>
            </div>

            <div className="space-y-4">
              {/* Student Summary Card */}
              <div className="bg-white rounded-lg p-6 border-2 border-blue-200 shadow-md">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Admission No:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {formData.admission_no}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Full Name:</span>
                    <span className="font-medium">
                      {formData.first_name} {formData.middle_name}{" "}
                      {formData.last_name}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Date of Birth:</span>
                    <span>{formData.date_of_birth}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Gender:</span>
                    <span className="capitalize">{formData.gender}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Email:</span>
                    <span className="truncate">
                      {formData.email || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Summary Card */}
              <div className="bg-white rounded-lg p-6 border-2 border-green-200 shadow-md">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Class:</span>
                    <span className="font-medium">
                      {classes.find((c) => c.id == formData.current_class)
                        ?.class_name || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Section:</span>
                    <span>{formData.current_section || "Not specified"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Stream:</span>
                    <span>{formData.stream || "Not specified"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Roll Number:</span>
                    <span>{formData.roll_number || "Not assigned"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Admission Date:</span>
                    <span>{formData.admission_date}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Admission Type:</span>
                    <span className="capitalize">
                      {formData.admission_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guardian Summary Card */}
              <div className="bg-white rounded-lg p-6 border-2 border-amber-200 shadow-md">
                <h4 className="font-semibold text-amber-800 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Guardian Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Guardian Name:</span>
                    <span className="font-medium">
                      {formData.guardian_name}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Relationship:</span>
                    <span>{formData.guardian_relation}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">Guardian Phone:</span>
                    <span>{formData.guardian_phone}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 w-32">
                      Emergency Contact:
                    </span>
                    <span>
                      {formData.emergency_contact_name} (
                      {formData.emergency_contact})
                    </span>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="border border-gray-300 rounded-lg p-6 bg-blue-50">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={true}
                      readOnly
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <label htmlFor="agreeToTerms" className="ml-3">
                    <span className="font-medium text-gray-700">
                      Declaration
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      By submitting this form, I confirm that all information
                      provided is accurate and complete to the best of my
                      knowledge. The student will be registered in the school
                      management system upon submission.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Animation styles
  const animationStyle = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 inline-block"
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

      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Student Admission System
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Register new students and manage admissions
              </p>
              {user && (
                <p className="text-sm text-gray-500 mt-2">
                  Logged in as:{" "}
                  <span className="font-medium">
                    {user.first_name} {user.last_name}
                  </span>{" "}
                  ({user.role})
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </button>
              <button
                onClick={fetchInitialData}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading.students ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Students
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {loading.students ? "..." : stats.total_students}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Active Students
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {loading.students ? "..." : stats.active_students}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Available Classes
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {loading.classes ? "..." : classes.length}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <School className="h-6 w-6 md:h-7 md:w-7 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Next Admission
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {admissionConfig.nextSequence}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Registration Form (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    New Student Registration
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Step {currentStep} of {steps.length}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                              currentStep >= step.number
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-200 text-gray-400"
                            }`}
                          >
                            {currentStep > step.number ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <StepIcon className="h-5 w-5" />
                            )}
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium text-center ${
                              currentStep >= step.number
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-2 ${
                              currentStep > step.number
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Clear Form
                    </button>

                    {currentStep < steps.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center transition-all duration-200"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center transition-all duration-200 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Register Student
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Excel Import Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Bulk Import Students
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700 mb-2 flex items-start">
                    <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    Import multiple students from Excel file
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1 ml-6">
                    <li>• Download the template first</li>
                    <li>• Fill in student data</li>
                    <li>• Upload the completed file</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    id="excelFile"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="excelFile" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-700">
                      Upload Excel File
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to select .xlsx or .xls file
                    </p>
                  </label>
                </div>

                <button
                  onClick={downloadTemplate}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Registrations
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {loading.students ? "..." : students.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {loading.students ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
                  </div>
                ) : (
                  students.slice(0, 5).map((student) => (
                    <div
                      key={student.id}
                      className="p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-sm text-gray-600 font-mono">
                            {student.admission_no}
                          </p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "Inactive"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {student.status}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(
                                student.admission_date,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Configure Admission Number
                  </span>
                </button>

                <button
                  onClick={fetchInitialData}
                  className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Data
                  </span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Print Registration Form
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="font-medium text-gray-700">
                  System Status: Connected
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {students.length} students in database • {classes.length}{" "}
                  active classes
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Last sync: {new Date().toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Next admission: {generateAdmissionNumber()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Import Preview Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Preview Import Data
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  File: <span className="font-medium">{importFile?.name}</span>
                  <span className="ml-4">
                    Preview: {importPreview.length} rows shown
                  </span>
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {importPreview[0] &&
                        Object.keys(importPreview[0]).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importPreview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td
                            key={idx}
                            className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  Preview shows only first 5 rows. Make sure all data is correct
                  before importing.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={isImporting}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center ${
                  isImporting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Confirm Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && renderConfigModal()}
    </div>
  );
}

export default Admission;
