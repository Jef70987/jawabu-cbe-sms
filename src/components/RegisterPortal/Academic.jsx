/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Academic = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [academicYear, setAcademicYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddCompetencyModal, setShowAddCompetencyModal] = useState(false);
  const [showAddLearningAreaModal, setShowAddLearningAreaModal] = useState(false);
  const [showAssessmentWindowModal, setShowAssessmentWindowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Data states from Django models
  const [academicYears, setAcademicYears] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [strands, setStrands] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [terms, setTerms] = useState([]);
  const [assessmentWindows, setAssessmentWindows] = useState([]);
  const [cbeReportCards, setCbeReportCards] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Form states aligned with Django models
  const [newCompetency, setNewCompetency] = useState({
    competency_code: '',
    competency_statement: '',
    performance_indicator: '',
    is_core_competency: true,
    display_order: '',
    substrand: '' // Changed from substrand_id to match Django field name
  });

  const [newLearningArea, setNewLearningArea] = useState({
    area_code: '',
    area_name: '',
    short_name: '',
    area_type: 'Core', // Changed from 'CORE' to match Django choices
    description: '',
    is_active: true
  });

  const [newAssessmentWindow, setNewAssessmentWindow] = useState({
    assessment_type: '',
    weight_percentage: '',
    open_date: '',
    close_date: '',
    is_active: true,
    term: '' // Changed from term_id to match Django field name
  });

  const [reportFilters, setReportFilters] = useState({
    class_id: '',
    term: '', // Changed from term_id to match Django field name
    report_type: 'Learner Progress Report', // Updated to match Django choices
    include_comments: true,
    include_signatures: true
  });

  // Theme colors
  const themeColors = {
    primary: '#1E40AF', // Blue
    secondary: '#DC2626', // Red
    success: '#059669', // Green
    light: '#F3F4F6', // Light gray
    white: '#FFFFFF'
  };

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data aligned with Django models
      const mockAcademicYears = [
        { id: 1, year_code: '2024-2025', year_name: '2024-2025 Academic Year', 
          start_date: '2024-01-08', end_date: '2024-11-22', is_current: true },
        { id: 2, year_code: '2023-2024', year_name: '2023-2024 Academic Year', 
          start_date: '2023-01-09', end_date: '2023-11-24', is_current: false }
      ];
      
      const mockLearningAreas = [
        { id: 1, area_code: 'ENG', area_name: 'English Language', 
          short_name: 'English', area_type: 'Core', 
          description: 'Language and literacy skills', is_active: true },
        { id: 2, area_code: 'KIS', area_name: 'Kiswahili Language', 
          short_name: 'Kiswahili', area_type: 'Core', 
          description: 'Kiswahili language skills', is_active: true },
        { id: 3, area_code: 'MAT', area_name: 'Mathematics', 
          short_name: 'Maths', area_type: 'Core', 
          description: 'Numeracy and mathematical concepts', is_active: true },
        { id: 4, area_code: 'SCI', area_name: 'Integrated Science', 
          short_name: 'Science', area_type: 'Core', 
          description: 'Scientific concepts and inquiry', is_active: true },
        { id: 5, area_code: 'SSE', area_name: 'Social Studies', 
          short_name: 'S.Studies', area_type: 'Core', 
          description: 'Social and environmental studies', is_active: true },
        { id: 6, area_code: 'CRE', area_name: 'Christian Religious Education', 
          short_name: 'CRE', area_type: 'Core', 
          description: 'Christian religious studies', is_active: true },
        { id: 7, area_code: 'HPE', area_name: 'Health & Physical Education', 
          short_name: 'HPE', area_type: 'Optional', 
          description: 'Health and physical development', is_active: true },
        { id: 8, area_code: 'AGR', area_name: 'Agriculture', 
          short_name: 'Agriculture', area_type: 'Optional', 
          description: 'Agricultural practices', is_active: true },
      ];

      const mockStrands = [
        { id: 1, strand_code: 'ENG-L', strand_name: 'Listening and Speaking', 
          description: 'Oral communication skills', display_order: 1, learning_area: 1 },
        { id: 2, strand_code: 'ENG-R', strand_name: 'Reading', 
          description: 'Reading comprehension', display_order: 2, learning_area: 1 },
        { id: 3, strand_code: 'ENG-W', strand_name: 'Writing', 
          description: 'Writing skills', display_order: 3, learning_area: 1 },
        { id: 4, strand_code: 'MAT-N', strand_name: 'Numbers', 
          description: 'Number concepts', display_order: 1, learning_area: 3 },
        { id: 5, strand_code: 'MAT-M', strand_name: 'Measurement', 
          description: 'Measurement concepts', display_order: 2, learning_area: 3 },
      ];

      const mockSubstrands = [
        { id: 1, substrand_code: 'ENG-L1', substrand_name: 'Oral Communication', 
          description: 'Speaking and listening', display_order: 1, strand: 1 },
        { id: 2, substrand_code: 'ENG-R1', substrand_name: 'Reading Comprehension', 
          description: 'Understanding texts', display_order: 1, strand: 2 },
        { id: 3, substrand_code: 'ENG-W1', substrand_name: 'Creative Writing', 
          description: 'Writing composition', display_order: 1, strand: 3 },
        { id: 4, substrand_code: 'MAT-N1', substrand_name: 'Whole Numbers', 
          description: 'Whole number operations', display_order: 1, strand: 4 },
      ];

      const mockCompetencies = [
        { id: 1, competency_code: 'ENG-L1.1', 
          competency_statement: 'Listen and respond to oral information appropriately', 
          performance_indicator: 'Responds correctly to 4 out of 5 questions', 
          is_core_competency: true, display_order: 1, substrand: 1 },
        { id: 2, competency_code: 'ENG-R1.1', 
          competency_statement: 'Read and comprehend grade-level texts fluently', 
          performance_indicator: 'Reads 90 words per minute with 80% comprehension', 
          is_core_competency: true, display_order: 1, substrand: 2 },
        { id: 3, competency_code: 'MAT-N1.1', 
          competency_statement: 'Add and subtract whole numbers up to 10,000', 
          performance_indicator: 'Solves 8 out of 10 problems correctly', 
          is_core_competency: true, display_order: 1, substrand: 4 },
      ];

      const mockTerms = [
        { id: 1, term: 'Term 1', start_date: '2024-01-08', 
          end_date: '2024-04-05', is_current: false, academic_year: 1 },
        { id: 2, term: 'Term 2', start_date: '2024-05-06', 
          end_date: '2024-08-09', is_current: false, academic_year: 1 },
        { id: 3, term: 'Term 3', start_date: '2024-09-02', 
          end_date: '2024-11-22', is_current: true, academic_year: 1 },
      ];

      const mockAssessmentWindows = [
        { id: 1, assessment_type: 'Opener', weight_percentage: 15, 
          open_date: '2024-09-02', close_date: '2024-09-13', is_active: true, term: 3 },
        { id: 2, assessment_type: 'Mid-Term', weight_percentage: 25, 
          open_date: '2024-10-07', close_date: '2024-10-18', is_active: true, term: 3 },
        { id: 3, assessment_type: 'End-Term', weight_percentage: 60, 
          open_date: '2024-11-04', close_date: '2024-11-15', is_active: true, term: 3 },
      ];

      const mockCbeReportCards = [
        { id: 1, report_id: 'REP-20241120-ABC123', 
          report_type: 'Learner Progress Report', 
          academic_year: '2024-2025', term: 'Term 3', 
          reporting_date: '2024-11-20', is_published: true, 
          class_id: 1, student: 1, teacher: 1 },
        { id: 2, report_id: 'REP-20241120-DEF456', 
          report_type: 'Learner Progress Report', 
          academic_year: '2024-2025', term: 'Term 3', 
          reporting_date: '2024-11-20', is_published: true, 
          class_id: 2, student: 2, teacher: 2 },
      ];

      const mockActivities = [
        { id: 1, action: 'Term 3 assessments submitted', 
          details: 'Mathematics - Grade 5B', user: 'Mr. Kamau', 
          time: '2 hours ago', type: 'assessment' },
        { id: 2, action: 'New competency added', 
          details: 'SCI3.4.2 - Environmental conservation', 
          user: 'Registrar', time: '1 day ago', type: 'competency' },
        { id: 3, action: 'CBE Report cards generated', 
          details: 'Grade 4A - All subjects', user: 'System', 
          time: '2 days ago', type: 'report' },
        { id: 4, action: 'Learning area updated', 
          details: 'English Language strands', user: 'Mrs. Wanjiku', 
          time: '3 days ago', type: 'curriculum' },
      ];

      setAcademicYears(mockAcademicYears);
      setLearningAreas(mockLearningAreas);
      setStrands(mockStrands);
      setSubstrands(mockSubstrands);
      setCompetencies(mockCompetencies);
      setTerms(mockTerms);
      setAssessmentWindows(mockAssessmentWindows);
      setCbeReportCards(mockCbeReportCards);
      setRecentActivities(mockActivities);
      
      // Set current academic year
      const currentYear = mockAcademicYears.find(year => year.is_current);
      if (currentYear) setAcademicYear(currentYear.year_code);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Competency management functions
  const handleAddCompetency = async () => {
    if (!newCompetency.competency_code || !newCompetency.competency_statement || !newCompetency.substrand) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // In production: await axios.post('/api/competencies/', newCompetency)
      const newComp = {
        id: competencies.length + 1,
        ...newCompetency,
        substrand_detail: substrands.find(s => s.id === parseInt(newCompetency.substrand))
      };
      
      setCompetencies([...competencies, newComp]);
      setShowAddCompetencyModal(false);
      setNewCompetency({
        competency_code: '',
        competency_statement: '',
        performance_indicator: '',
        is_core_competency: true,
        display_order: '',
        substrand: ''
      });
      
      alert('Competency added successfully');
    } catch (error) {
      console.error('Error adding competency:', error);
      alert('Failed to add competency');
    }
  };

  // Learning Area management
  const handleAddLearningArea = async () => {
    if (!newLearningArea.area_code || !newLearningArea.area_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // In production: await axios.post('/api/learning-areas/', newLearningArea)
      const newArea = {
        id: learningAreas.length + 1,
        ...newLearningArea
      };
      
      setLearningAreas([...learningAreas, newArea]);
      setShowAddLearningAreaModal(false);
      setNewLearningArea({
        area_code: '',
        area_name: '',
        short_name: '',
        area_type: 'Core',
        description: '',
        is_active: true
      });
      
      alert('Learning Area added successfully');
    } catch (error) {
      console.error('Error adding learning area:', error);
      alert('Failed to add learning area');
    }
  };

  // Assessment Window management
  const handleAddAssessmentWindow = async () => {
    if (!newAssessmentWindow.assessment_type || !newAssessmentWindow.term) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // In production: await axios.post('/api/assessment-windows/', newAssessmentWindow)
      const newWindow = {
        id: assessmentWindows.length + 1,
        ...newAssessmentWindow,
        term_detail: terms.find(t => t.id === parseInt(newAssessmentWindow.term))
      };
      
      setAssessmentWindows([...assessmentWindows, newWindow]);
      setShowAssessmentWindowModal(false);
      setNewAssessmentWindow({
        assessment_type: '',
        weight_percentage: '',
        open_date: '',
        close_date: '',
        is_active: true,
        term: ''
      });
      
      alert('Assessment Window added successfully');
    } catch (error) {
      console.error('Error adding assessment window:', error);
      alert('Failed to add assessment window');
    }
  };

  // CBE Report Card generation
  const handleGenerateReport = async () => {
    if (!reportFilters.class_id || !reportFilters.term) {
      alert('Please select class and term');
      return;
    }

    try {
      // In production: await axios.post('/api/cbe-report-cards/', reportFilters)
      const newReport = {
        id: cbeReportCards.length + 1,
        report_id: `REP-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        report_type: reportFilters.report_type,
        academic_year: academicYear,
        term: terms.find(t => t.id === parseInt(reportFilters.term))?.term,
        reporting_date: new Date().toISOString().split('T')[0],
        is_published: true,
        class_id: parseInt(reportFilters.class_id)
      };
      
      setCbeReportCards([newReport, ...cbeReportCards]);
      setShowReportModal(false);
      
      alert(`CBE Report Card generated successfully: ${newReport.report_id}`);
    } catch (error) {
      console.error('Error generating CBE report card:', error);
      alert('Failed to generate CBE report card');
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'curriculum':
        return (
          <div className="space-y-6">
            {/* Learning Areas Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Learning Areas (CBE Subjects)</h3>
                    <p className="text-sm text-gray-600 mt-1">Core and optional subjects in Kenya CBE Curriculum</p>
                  </div>
                  <button 
                    onClick={() => setShowAddLearningAreaModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition-colors"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Learning Area
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {learningAreas.map((area) => (
                      <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-white px-2 py-1 rounded" 
                                style={{ backgroundColor: themeColors.primary }}>
                            {area.area_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{area.area_name}</div>
                          <div className="text-xs text-gray-500">{area.short_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            area.area_type === 'Core' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {area.area_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            area.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {area.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Competencies Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Competencies</h3>
                    <p className="text-sm text-gray-600 mt-1">Specific skills and knowledge per CBE curriculum</p>
                  </div>
                  <button 
                    onClick={() => setShowAddCompetencyModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center transition-colors"
                    style={{ backgroundColor: themeColors.success }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Competency
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statement</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Performance Indicator</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {competencies.map((comp) => (
                      <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-semibold text-white px-2 py-1 rounded" 
                               style={{ backgroundColor: themeColors.success }}>
                            {comp.competency_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{comp.competency_statement}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{comp.performance_indicator}</div>
                        </td>
                        <td className="px-6 py-4">
                          {comp.is_core_competency ? (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Core Competency
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              Supplementary
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assessment Windows Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">CBE Assessment Windows</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage assessment periods and deadlines</p>
                    </div>
                    <button 
                      onClick={() => setShowAssessmentWindowModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition-colors"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Window
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {assessmentWindows.map((window) => (
                      <div key={window.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}20` }}>
                            <svg className="w-6 h-6" style={{ color: themeColors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{window.assessment_type} Assessment</h4>
                            <p className="text-sm text-gray-600">
                              {window.open_date} to {window.close_date}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Weight: {window.weight_percentage}%
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                Term {terms.find(t => t.id === window.term)?.term}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            window.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {window.is_active ? 'Active' : 'Closed'}
                          </span>
                          <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assessment Stats Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Status</h3>
                  <p className="text-sm text-gray-600 mt-1">Current term CBE ratings progress</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {[
                      { label: 'Opener Assessments', value: 85, color: 'bg-green-500' },
                      { label: 'Mid-Term Assessments', value: 65, color: 'bg-yellow-500' },
                      { label: 'End-Term Assessments', value: 30, color: 'bg-red-500' },
                      { label: 'Overall CBE Ratings', value: 60, color: 'bg-blue-500' },
                    ].map((stat, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                          <span className="text-lg font-bold text-gray-900">{stat.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${stat.color} h-2 rounded-full transition-all duration-500`} 
                            style={{ width: `${stat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pending CBE Ratings</span>
                      <span className="font-semibold text-gray-900">1,240</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">Completed CBE Ratings</span>
                      <span className="font-semibold text-gray-900">3,560</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            {/* CBE Report Card Generation Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200" style={{ borderBottomColor: `${themeColors.primary}20` }}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">Generate CBE Report Cards</h3>
                    <p className="text-sm text-gray-600 mt-1">Create competency-based reports aligned with Kenya CBE curriculum</p>
                  </div>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="px-6 py-3 text-white rounded-lg hover:opacity-90 font-medium flex items-center transition-all"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate CBE Report
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">CBE Report Cards</p>
                        <p className="text-xl font-bold text-gray-900">{cbeReportCards.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-green-100">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Published Reports</p>
                        <p className="text-xl font-bold text-gray-900">{cbeReportCards.filter(r => r.is_published).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-red-100">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                        <p className="text-xl font-bold text-gray-900">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CBE Report Card List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent CBE Report Cards</h3>
                <p className="text-sm text-gray-600 mt-1">Previously generated competency-based reports</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Report ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Academic Year</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Term</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cbeReportCards.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-semibold text-gray-900">{report.report_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{report.report_type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{report.academic_year}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {report.term}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            report.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.is_published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                              View
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                              Download
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default: // Overview
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Learning Areas', 
                  value: learningAreas.length, 
                  change: 'Active',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                },
                { 
                  title: 'Competencies', 
                  value: competencies.length, 
                  change: 'Core & Optional',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: 'text-green-600',
                  bgColor: 'bg-green-100'
                },
                { 
                  title: 'Assessment Windows', 
                  value: assessmentWindows.length, 
                  change: 'Current term',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-100'
                },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Latest updates in the CBE Academic System</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-lg mt-1 ${
                        activity.type === 'assessment' ? 'bg-blue-50' :
                        activity.type === 'competency' ? 'bg-green-50' :
                        activity.type === 'report' ? 'bg-indigo-50' : 'bg-gray-50'
                      }`}>
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs font-medium text-gray-500">By {activity.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CBE Academic Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Competency-Based Education (CBE) Academic Management</h1>
              <p className="text-gray-600 mt-2">Kenya Competency-Based Curriculum • {academicYear} Academic Year</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.year_code}>
                      {year.year_code} {year.is_current && '(Current)'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search learning areas, competencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )},
              { id: 'curriculum', label: 'Curriculum', icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )},
              { id: 'assessment', label: 'Assessment', icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )},
              { id: 'reports', label: 'CBE Reports', icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )},
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === tab.id ? { borderBottomColor: themeColors.primary, color: themeColors.primary } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {renderTabContent()}
      </div>

      {/* Modals */}
      {/* Add Competency Modal */}
      {showAddCompetencyModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Competency</h3>
              <p className="text-sm text-gray-600 mt-1">Define a new competency for the CBE curriculum</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competency Code *
                    </label>
                    <input
                      type="text"
                      value={newCompetency.competency_code}
                      onChange={(e) => setNewCompetency({...newCompetency, competency_code: e.target.value})}
                      placeholder="e.g., ENG-L1.1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-strand *
                    </label>
                    <select
                      value={newCompetency.substrand}
                      onChange={(e) => setNewCompetency({...newCompetency, substrand: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select sub-strand</option>
                      {substrands.map((substrand) => (
                        <option key={substrand.id} value={substrand.id}>
                          {substrand.substrand_code} - {substrand.substrand_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competency Statement *
                  </label>
                  <textarea
                    value={newCompetency.competency_statement}
                    onChange={(e) => setNewCompetency({...newCompetency, competency_statement: e.target.value})}
                    placeholder="Describe the specific skill or knowledge students should master..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Indicator
                  </label>
                  <textarea
                    value={newCompetency.performance_indicator}
                    onChange={(e) => setNewCompetency({...newCompetency, performance_indicator: e.target.value})}
                    placeholder="How will this competency be measured and assessed?"
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={newCompetency.display_order}
                      onChange={(e) => setNewCompetency({...newCompetency, display_order: e.target.value})}
                      placeholder="e.g., 1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="isCore"
                      checked={newCompetency.is_core_competency}
                      onChange={(e) => setNewCompetency({...newCompetency, is_core_competency: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isCore" className="ml-2 text-sm text-gray-700">
                      Core Competency
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCompetencyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCompetency}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-colors"
                style={{ backgroundColor: themeColors.success }}
              >
                Add Competency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Learning Area Modal */}
      {showAddLearningAreaModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Learning Area</h3>
              <p className="text-sm text-gray-600 mt-1">Add a new subject to the CBE curriculum</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Code *
                    </label>
                    <input
                      type="text"
                      value={newLearningArea.area_code}
                      onChange={(e) => setNewLearningArea({...newLearningArea, area_code: e.target.value})}
                      placeholder="e.g., ENG"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Name
                    </label>
                    <input
                      type="text"
                      value={newLearningArea.short_name}
                      onChange={(e) => setNewLearningArea({...newLearningArea, short_name: e.target.value})}
                      placeholder="e.g., English"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Name *
                  </label>
                  <input
                    type="text"
                    value={newLearningArea.area_name}
                    onChange={(e) => setNewLearningArea({...newLearningArea, area_name: e.target.value})}
                    placeholder="e.g., English Language"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Type
                  </label>
                  <select
                    value={newLearningArea.area_type}
                    onChange={(e) => setNewLearningArea({...newLearningArea, area_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Core">Core Subject</option>
                    <option value="Optional">Optional Subject</option>
                    <option value="Extracurricular">Extracurricular Subject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newLearningArea.description}
                    onChange={(e) => setNewLearningArea({...newLearningArea, description: e.target.value})}
                    placeholder="Brief description of the learning area..."
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newLearningArea.is_active}
                    onChange={(e) => setNewLearningArea({...newLearningArea, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active Learning Area
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddLearningAreaModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLearningArea}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-colors"
                style={{ backgroundColor: themeColors.primary }}
              >
                Add Learning Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assessment Window Modal */}
      {showAssessmentWindowModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Assessment Window</h3>
              <p className="text-sm text-gray-600 mt-1">Create assessment period for a specific term</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type *
                  </label>
                  <select
                    value={newAssessmentWindow.assessment_type}
                    onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, assessment_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="Opener">Term Opener</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="End-Term">End-Term</option>
                    <option value="Special">Special Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term *
                  </label>
                  <select
                    value={newAssessmentWindow.term}
                    onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, term: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select term</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>{term.term}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Date
                    </label>
                    <input
                      type="date"
                      value={newAssessmentWindow.open_date}
                      onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, open_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Close Date
                    </label>
                    <input
                      type="date"
                      value={newAssessmentWindow.close_date}
                      onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, close_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight Percentage
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={newAssessmentWindow.weight_percentage}
                      onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, weight_percentage: e.target.value})}
                      placeholder="e.g., 15"
                      className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="ml-2 text-gray-500">% of term grade</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="windowActive"
                    checked={newAssessmentWindow.is_active}
                    onChange={(e) => setNewAssessmentWindow({...newAssessmentWindow, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="windowActive" className="ml-2 text-sm text-gray-700">
                    Active Assessment Window
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAssessmentWindowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssessmentWindow}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-colors"
                style={{ backgroundColor: themeColors.primary }}
              >
                Add Assessment Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBE Report Card Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generate CBE Report Card</h3>
              <p className="text-sm text-gray-600 mt-1">Create competency-based reports aligned with Kenya CBE</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class *
                  </label>
                  <select
                    value={reportFilters.class_id}
                    onChange={(e) => setReportFilters({...reportFilters, class_id: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a class</option>
                    {/* In production, this would fetch classes from the API */}
                    <option value="1">Grade 4 A</option>
                    <option value="2">Grade 4 B</option>
                    <option value="3">Grade 5 A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Term *
                  </label>
                  <select
                    value={reportFilters.term}
                    onChange={(e) => setReportFilters({...reportFilters, term: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a term</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>{term.term}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportFilters.report_type}
                    onChange={(e) => setReportFilters({...reportFilters, report_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Learner Progress Report">Learner Progress Report</option>
                    <option value="Parent Summary Report">Parent Summary Report</option>
                    <option value="Teacher Class Performance Report">Teacher Class Performance Report</option>
                    <option value="School-Wide CBE Report">School-Wide CBE Report</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.include_comments}
                      onChange={(e) => setReportFilters({...reportFilters, include_comments: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Include teacher comments
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.include_signatures}
                      onChange={(e) => setReportFilters({...reportFilters, include_signatures: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Include signature sections
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        CBE Report Cards will be generated in PDF format and include competency ratings (BE, AE, ME, EE) 
                        as per Kenya CBE guidelines. Each report includes learning area performance, competency summaries, 
                        and values development assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-colors"
                style={{ backgroundColor: themeColors.primary }}
              >
                Generate CBE Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academic;