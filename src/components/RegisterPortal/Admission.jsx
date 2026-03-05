/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Django API Base URL - Changed to Django port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL;


function Admission() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState({
    students: true,
    classes: true
  });
  const [error, setError] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [admissionConfig, setAdmissionConfig] = useState({
    lastAdmissionNumber: '',
    prefix: 'ADM',
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    nextSequence: 1
  });
  

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['Authorization'] = tokenValue;
    }
    
    return headers;
  };
  // Function to parse admission number and extract sequence
  const parseAdmissionNumber = (admNo) => {
    if (!admNo) return { sequence: 0 };
    
    // Match format: PREFIX-YYYYMM-XXXXX (e.g., ADM-202401-1, ADM-202401-100, ADM-202401-1000, etc.)
    const regex = /^([A-Z]+)-(\d{4})(\d{2})-(\d+)$/;
    const match = admNo.match(regex);
    
    if (match) {
      const [, prefix, year, month, sequence] = match;
      return {
        prefix,
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        sequence: parseInt(sequence, 10)
      };
    }
    
    return { sequence: 0 };
  };

  // Function to get the highest admission number from existing students
  const getHighestAdmissionSequence = () => {
    if (students.length === 0) {
      // If no students, start from 1
      return 1;
    }
    
    let highestSequence = 0;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    students.forEach(student => {
      if (student.admission_no) {
        const parsed = parseAdmissionNumber(student.admission_no);
        if (parsed.sequence > highestSequence) {
          highestSequence = parsed.sequence;
        }
      }
    });
    
    return highestSequence + 1;
  };

  // Generate sequential admission number
  const generateAdmissionNumber = () => {
    let sequenceToUse = admissionConfig.nextSequence;
    
    // If no configured last number, use from existing students
    if (!admissionConfig.lastAdmissionNumber && students.length > 0) {
      sequenceToUse = getHighestAdmissionSequence();
    }
    
    const { prefix, year, month } = admissionConfig;
    // No padding - just use the raw sequence number (1, 10, 100, 1000, etc.)
    return `${prefix}-${year}${month}-${sequenceToUse}`;
  };

  // Complete form data structure matching sms_app_student table
  const [formData, setFormData] = useState({
    admission_no: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    nationality: 'Kenyan',
    religion: '',
    blood_group: '',
    address: '',
    city: '',
    country: 'Kenya',
    phone: '',
    email: '',
    current_class_id: '',
    current_section: '',
    stream: '',
    roll_number: '',
    admission_date: new Date().toISOString().split('T')[0],
    admission_type: 'new',
    father_name: '',
    father_phone: '',
    father_email: '',
    father_occupation: '',
    mother_name: '',
    mother_phone: '',
    mother_email: '',
    mother_occupation: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_address: '',
    medical_conditions: '',
    allergies: '',
    medication: '',
    emergency_contact: '',
    emergency_contact_name: '',
    previous_school: '',
    previous_class: '',
    transfer_certificate_no: '',
    status: 'active',
    expected_graduation_date: '',
    archived: false,
    archived_at: null
  });

  const steps = [
    { number: 1, title: 'Personal Details' },
    { number: 2, title: 'Contact & Academic' },
    { number: 3, title: 'Parent/Guardian' },
    { number: 4, title: 'Medical & Emergency' },
    { number: 5, title: 'Review & Submit' }
  ];

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update admission number when students or config changes
  useEffect(() => {
    if (!loading.students) {
      const nextSequence = getHighestAdmissionSequence();
      setAdmissionConfig(prev => ({
        ...prev,
        nextSequence
      }));
      
      // Generate admission number and update form data
      const newAdmissionNo = generateAdmissionNumber();
      setFormData(prev => ({
        ...prev,
        admission_no: newAdmissionNo
      }));
    }
 
  }, [loading.students, admissionConfig.lastAdmissionNumber]);

  const fetchData = async () => {
    try {
      setLoading({ students: true, classes: true });
      setError(null);

      // Fetch existing students
      const studentsRes = await fetch(`${API_BASE_URL}/api/students/`, {
        headers: getAuthHeaders()
      });
      
      if (!studentsRes.ok) {
        if (studentsRes.status === 401) {
          setError('Session expired. Please login again.');
          return;
        }
        throw new Error(`HTTP error! status: ${studentsRes.status}`);
      }
      
      const studentsData = await studentsRes.json();
      if (studentsData.success) {
        setStudents(studentsData.data);
      } else {
        setError(studentsData.error || 'Failed to load students');
      }

      // Fetch available classes
      const classesRes = await fetch(`${API_BASE_URL}/api/classes/`, {
        headers: getAuthHeaders()
      });
      
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        if (classesData.success) {
          setClasses(classesData.data);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to connect to server. Please try again later.');
    } finally {
      setLoading({ students: false, classes: false });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setAdmissionConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.gender && formData.date_of_birth;
      case 2:
        return formData.address && formData.phone && formData.current_class_id;
      case 3:
        return formData.guardian_name && formData.guardian_phone && formData.guardian_relation;
      case 4:
        return formData.emergency_contact && formData.emergency_contact_name;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // First generate admission number if not set
      if (!formData.admission_no) {
        const admissionRes = await fetch(`${API_BASE_URL}/api/students/generate-admission-no/`, {
          headers: getAuthHeaders()
        });
        
        if (admissionRes.ok) {
          const admissionData = await admissionRes.json();
          if (admissionData.success) {
            formData.admission_no = admissionData.admission_no;
          }
        }
      }
      
      // Submit to Django API
      const response = await fetch(`${API_BASE_URL}/api/students/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const successMsg = `✅ Student registered successfully!\nAdmission No: ${formData.admission_no}\nStudent: ${formData.first_name} ${formData.last_name}`;
        setSuccessMessage(successMsg);
        
        // Refresh data from backend
        await fetchData();
        
        // Reset form with new admission number
        resetForm();
        
      } else {
        alert(`❌ Failed to register student: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error registering student:', error);
      alert('⚠️ Failed to register student. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    // Calculate next sequence
    const nextSequence = getHighestAdmissionSequence() + 1;
    setAdmissionConfig(prev => ({
      ...prev,
      nextSequence
    }));
    
    const newAdmissionNo = generateAdmissionNumber();
    
    setFormData({
      admission_no: newAdmissionNo,
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      nationality: 'Kenyan',
      religion: '',
      blood_group: '',
      address: '',
      city: '',
      country: 'Kenya',
      phone: '',
      email: '',
      current_class_id: '',
      current_section: '',
      stream: '',
      roll_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      admission_type: 'new',
      father_name: '',
      father_phone: '',
      father_email: '',
      father_occupation: '',
      mother_name: '',
      mother_phone: '',
      mother_email: '',
      mother_occupation: '',
      guardian_name: '',
      guardian_relation: '',
      guardian_phone: '',
      guardian_email: '',
      guardian_address: '',
      medical_conditions: '',
      allergies: '',
      medication: '',
      emergency_contact: '',
      emergency_contact_name: '',
      previous_school: '',
      previous_class: '',
      transfer_certificate_no: '',
      status: 'active',
      expected_graduation_date: '',
      archived: false,
      archived_at: null
    });
    setCurrentStep(1);
  };

  const saveAdmissionConfig = () => {
    // Update next sequence based on last admission number
    if (admissionConfig.lastAdmissionNumber) {
      const parsed = parseAdmissionNumber(admissionConfig.lastAdmissionNumber);
      if (parsed.sequence > 0) {
        setAdmissionConfig(prev => ({
          ...prev,
          nextSequence: parsed.sequence + 1
        }));
      }
    }
    
    // Regenerate admission number
    const newAdmissionNo = generateAdmissionNumber();
    setFormData(prev => ({
      ...prev,
      admission_no: newAdmissionNo
    }));
    
    setShowConfigModal(false);
    alert('✅ Admission number configuration updated!');
  };

  // Excel Import Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
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
      formData.append('excelFile', importFile);
      
      const response = await fetch(`${API_BASE_URL}/api/students/import/`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeaders()['Authorization']
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ Successfully imported ${data.importedCount} students!`);
        if (data.errors && data.errors.length > 0) {
          console.warn('Import errors:', data.errors);
        }
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        await fetchData();
      } else {
        alert(`❌ Import failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error importing students:', error);
      alert('⚠️ Failed to import students. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Generate a sample admission number for template
    const sampleAdmissionNo = generateAdmissionNumber();
    
    // Create template data matching database schema
    const templateData = [{
      'admission_no': sampleAdmissionNo,
      'first_name': 'John',
      'middle_name': 'Kiprop',
      'last_name': 'Mwangi',
      'date_of_birth': '2010-05-15',
      'gender': 'male',
      'nationality': 'Kenyan',
      'religion': 'Christian',
      'blood_group': 'O+',
      'address': '123 Main Street',
      'city': 'Nairobi',
      'country': 'Kenya',
      'phone': '0712345678',
      'email': 'john@example.com',
      'current_class_id': '1',
      'current_section': 'A',
      'stream': 'Science',
      'roll_number': '12',
      'admission_date': new Date().toISOString().split('T')[0],
      'admission_type': 'new',
      'father_name': 'Peter Mwangi',
      'father_phone': '0723456789',
      'father_email': 'peter@example.com',
      'father_occupation': 'Engineer',
      'mother_name': 'Mary Mwangi',
      'mother_phone': '0734567890',
      'mother_email': 'mary@example.com',
      'mother_occupation': 'Teacher',
      'guardian_name': 'Peter Mwangi',
      'guardian_relation': 'Father',
      'guardian_phone': '0723456789',
      'guardian_email': 'peter@example.com',
      'guardian_address': '123 Main Street',
      'medical_conditions': 'None',
      'allergies': 'Peanuts',
      'medication': 'None',
      'emergency_contact': '0723456789',
      'emergency_contact_name': 'Peter Mwangi',
      'previous_school': 'ABC Primary',
      'previous_class': 'Class 7',
      'transfer_certificate_no': 'TC12345',
      'status': 'active',
      'expected_graduation_date': '2026-12-31'
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // Set column widths
    const wscols = [
      {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
      {wch: 12}, {wch: 10}, {wch: 15}, {wch: 10},
      {wch: 5}, {wch: 20}, {wch: 15}, {wch: 10},
      {wch: 12}, {wch: 25}, {wch: 15}, {wch: 10},
      {wch: 10}, {wch: 10}, {wch: 5}, {wch: 12},
      {wch: 20}, {wch: 15}, {wch: 15}, {wch: 20},
      {wch: 20}, {wch: 15}, {wch: 15}, {wch: 20},
      {wch: 20}, {wch: 15}, {wch: 15}, {wch: 20},
      {wch: 20}, {wch: 15}, {wch: 20}, {wch: 15},
      {wch: 15}, {wch: 15}, {wch: 20}, {wch: 15},
      {wch: 12}
    ];
    worksheet['!cols'] = wscols;
    
    XLSX.writeFile(workbook, 'student_import_template.xlsx');
  };

  // Render Admission Number Field with Config Button
  const renderAdmissionNumberField = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Admission Number
        </label>
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <i className="fas fa-cog mr-1"></i>
          Configure Sequence
        </button>
      </div>
      <input
        type="text"
        name="admission_no"
        value={formData.admission_no}
        readOnly
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
        placeholder="Will be generated after configuration" 
      />
      <div className="flex justify-between mt-1">
        <p className="text-xs text-blue-600 font-medium">Next: {admissionConfig.nextSequence}</p>
      </div>
    </div>
  );

  // Render Configuration Modal
  const renderConfigModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Admission Number Configuration</h3>
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <i className="fas fa-info-circle mr-2"></i>
                Set the last admission number used to continue the sequence
              </p>
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
                placeholder="e.g., ADM-202401-025"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the last admission number issued. Next admission will continue from this number.
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
                <i className="fas fa-info-circle text-amber-500 mt-0.5 mr-2"></i>
                <div>
                  <p className="font-medium text-amber-800">Next Admission Number</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{generateAdmissionNumber()}</p>
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admission Number Field */}
              {renderAdmissionNumberField()}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
                  <option value="None">None</option>
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
                  <option value="AB">AB-</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact & Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="current_class_id"
                  value={formData.current_class_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} ({cls.class_code})
                    </option>
                  ))}
                </select>
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
                  <option value="Blue">Champions</option>
                  <option value="Red">Winners</option>
                  
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <input
                  type="number"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  <option value="new">New Admission</option>
                  <option value="transfer">Transfer</option>
                  <option value="re-admission">Re-admission</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Parent/Guardian Details</h3>
            <div className="space-y-8">
              {/* Father's Information */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-4">Father's Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Phone</label>
                    <input
                      type="tel"
                      name="father_phone"
                      value={formData.father_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Email</label>
                    <input
                      type="email"
                      name="father_email"
                      value={formData.father_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
                    <input
                      type="text"
                      name="father_occupation"
                      value={formData.father_occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mother's Information */}
              <div className="bg-pink-50 rounded-lg p-5 border border-pink-100">
                <h4 className="font-semibold text-pink-800 mb-4">Mother's Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Phone</label>
                    <input
                      type="tel"
                      name="mother_phone"
                      value={formData.mother_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Email</label>
                    <input
                      type="email"
                      name="mother_email"
                      value={formData.mother_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
                    <input
                      type="text"
                      name="mother_occupation"
                      value={formData.mother_occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian's Information (Required) */}
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-4">Guardian's Information <span className="text-red-500">*</span></h4>
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="guardian_relation"
                      value={formData.guardian_relation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Email</label>
                    <input
                      type="email"
                      name="guardian_email"
                      value={formData.guardian_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Address</label>
                    <textarea
                      name="guardian_address"
                      value={formData.guardian_address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Medical & Emergency Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medical Information */}
              <div className="md:col-span-2 bg-green-50 rounded-lg p-5 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-4">Medical Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
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

              {/* Emergency Contact (Required) */}
              <div className="md:col-span-2 bg-red-50 rounded-lg p-5 border border-red-100">
                <h4 className="font-semibold text-red-800 mb-4">Emergency Contact <span className="text-red-500">*</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Previous School Information */}
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Previous School Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Class</label>
                    <input
                      type="text"
                      name="previous_class"
                      value={formData.previous_class}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Certificate No.</label>
                    <input
                      type="text"
                      name="transfer_certificate_no"
                      value={formData.transfer_certificate_no}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Date</label>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Review & Submit Application</h3>
            
            <div className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                    <div>
                      <p className="font-medium text-green-800">Registration Successful!</p>
                      <p className="text-green-700 text-sm mt-1 whitespace-pre-line">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Student Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-32">Admission No:</span>
                      <span className="font-medium">{formData.admission_no}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Full Name:</span>
                      <span className="font-medium">{formData.first_name} {formData.middle_name} {formData.last_name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Date of Birth:</span>
                      <span>{formData.date_of_birth}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Gender:</span>
                      <span>{formData.gender}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Phone:</span>
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Academic Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-32">Class:</span>
                      <span className="font-medium">
                        {classes.find(c => c.id == formData.current_class_id)?.class_name || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Section:</span>
                      <span>{formData.current_section || 'Not specified'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Stream:</span>
                      <span>{formData.stream || 'Not specified'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Admission Date:</span>
                      <span>{formData.admission_date}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Admission Type:</span>
                      <span className="capitalize">{formData.admission_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Summary */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Guardian Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-600 w-32">Guardian Name:</span>
                    <span className="font-medium">{formData.guardian_name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">Relationship:</span>
                    <span>{formData.guardian_relation}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">Guardian Phone:</span>
                    <span>{formData.guardian_phone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">Emergency Contact:</span>
                    <span>{formData.emergency_contact_name} ({formData.emergency_contact})</span>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="border border-gray-300 rounded-lg p-5 bg-white">
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
                  <label htmlFor="agreeToTerms" className="ml-3 text-gray-700">
                    <span className="font-medium">Declaration</span>
                    <p className="text-sm mt-1">
                      By submitting this form, I confirm that all information provided is accurate and complete.
                      The student will be registered in the school management system upon submission.
                    </p>
                  </label>
                </div>
              </div>

              {/* Database Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-medium text-blue-800 mb-3">Database Information</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-database mt-1 mr-2"></i>
                    Data will be stored in PostgreSQL database (sms_app_student table)
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-table mt-1 mr-2"></i>
                    All fields match the database schema structure
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-server mt-1 mr-2"></i>
                    Data will be synced with the Django backend server
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Admission System</h1>
              <p className="text-gray-600 mt-1">Register new students to the school database</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download Template
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh Data
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                <div>
                  <p className="text-red-700 font-medium">Connection Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Registration Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">New Student Registration</h2>
                <p className="text-gray-600">Complete all 5 steps to register student in the database</p>
                
                {/* Progress Bar */}
                <div className="flex items-center justify-between mt-6">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${currentStep >= step.number ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-400'}`}>
                          {currentStep > step.number ? (
                            <i className="fas fa-check text-sm"></i>
                          ) : (
                            <span className="font-bold">{step.number}</span>
                          )}
                        </div>
                        <span className={`text-sm mt-2 font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                      )}
                    </React.Fragment>
                  ))}
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
                    className={`px-8 py-3 rounded-lg font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    <i className="fas fa-chevron-left mr-2"></i>
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Clear Form
                    </button>
                    
                    {currentStep < steps.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
                      >
                        Continue
                        <i className="fas fa-chevron-right ml-2"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 ${isSubmitting ? 'bg-green-500' : 'bg-green-600'} text-white rounded-lg font-medium hover:bg-green-700 flex items-center`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus mr-2"></i>
                            Register Student
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {loading.students ? '...' : students.length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-users text-blue-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Available Classes</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {loading.classes ? '...' : classes.length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-school text-green-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Next Admission No.</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {loading.students ? '...' : admissionConfig.nextSequence.toString().padStart(3, '0')}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-hashtag text-amber-600 text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Excel Import Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Import Students</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700 mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Import multiple students from Excel file
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1 ml-5">
                    <li>• Download the template first</li>
                    <li>• Fill in student data</li>
                    <li>• Upload the completed file</li>
                  </ul>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="excelFile"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="excelFile" className="cursor-pointer">
                    <i className="fas fa-file-excel text-green-500 text-4xl mb-3"></i>
                    <p className="font-medium text-gray-700">Upload Excel File</p>
                    <p className="text-sm text-gray-500 mt-1">Click to select .xlsx or .xls file</p>
                  </label>
                </div>
                
                <button
                  onClick={downloadTemplate}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Template
                </button>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Registrations</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {loading.students ? '...' : students.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {loading.students ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : students.slice(0, 5).map(student => (
                  <div key={student.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {student.first_name} {student.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">{student.admission_no}</p>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' :
                            student.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(student.admission_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center justify-between transition-colors"
                >
                  <span>
                    <i className="fas fa-print mr-2"></i>
                    Print Registration
                  </span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium flex items-center justify-between transition-colors"
                >
                  <span>
                    <i className="fas fa-cog mr-2"></i>
                    Configure Admission No.
                  </span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                <button 
                  onClick={fetchData}
                  className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-between transition-colors"
                >
                  <span>
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh All Data
                  </span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                
              </div>
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div>
                <p className="font-medium text-gray-700">
                  Status: {error ? 'Connection failed' : 'Connected'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <i className="fas fa-table mr-1"></i>
                  student_estimate: {students.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <i className="fas fa-server mr-1"></i>
                ...
              </p>
              <p className="text-xs text-gray-500 mt-1">Last sync: {new Date().toLocaleTimeString()}</p>
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
                <h3 className="text-lg font-semibold text-gray-800">Preview Import Data</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  File: <span className="font-medium">{importFile?.name}</span>
                  <span className="ml-4">Rows: {importPreview.length}</span>
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {importPreview[0] && Object.keys(importPreview[0]).map(key => (
                        <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importPreview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Preview shows only first 5 rows. Make sure all data is correct before importing.
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
                className={`px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center ${isImporting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload mr-2"></i>
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