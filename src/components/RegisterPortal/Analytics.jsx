/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [pathwayRecommendations, setPathwayRecommendations] = useState([]);
  const [interestAnalysis, setInterestAnalysis] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [competencyRadar, setCompetencyRadar] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('pathway');
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestForm, setInterestForm] = useState({
    interests: [],
    talents: [],
    aspirations: '',
    preferredSubjects: [],
    careerGoals: ''
  });

  // Career Pathways for Senior School (G10-G12)
  const careerPathways = [
    {
      id: 1,
      name: 'STEM (Science, Technology, Engineering & Mathematics)',
      code: 'STEM',
      description: 'For learners with strong performance in Sciences and Mathematics',
      requiredSubjects: ['Mathematics', 'Integrated Science', 'Physics', 'Chemistry'],
      recommendedCareers: ['Engineering', 'Medicine', 'Computer Science', 'Architecture', 'Research'],
      averageSalary: 'KES 50,000 - 200,000',
      universities: ['University of Nairobi', 'JKUAT', 'KU', 'Strathmore'],
      icon: '🔬',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Humanities & Social Sciences',
      code: 'HUSS',
      description: 'For learners excelling in languages, history, and social studies',
      requiredSubjects: ['English', 'Kiswahili', 'History', 'Geography', 'CRE/IRE'],
      recommendedCareers: ['Law', 'Journalism', 'Teaching', 'Social Work', 'Public Administration'],
      averageSalary: 'KES 40,000 - 150,000',
      universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'],
      icon: '📚',
      color: 'green'
    },
    {
      id: 3,
      name: 'Creative Arts & Sports',
      code: 'ARTS',
      description: 'For learners with talents in arts, music, drama, and sports',
      requiredSubjects: ['Creative Arts', 'Physical Education', 'Music', 'Theatre'],
      recommendedCareers: ['Musician', 'Athlete', 'Actor', 'Graphic Designer', 'Coach'],
      averageSalary: 'KES 30,000 - 500,000',
      universities: ['Kenyatta University', 'Technical University of Kenya', 'Sports Academy'],
      icon: '🎨',
      color: 'purple'
    },
    {
      id: 4,
      name: 'Technical & Vocational',
      code: 'TVET',
      description: 'For learners with practical skills in technical and vocational areas',
      requiredSubjects: ['Agriculture', 'Business Studies', 'Computer Science', 'Home Science'],
      recommendedCareers: ['Entrepreneur', 'Technician', 'Chef', 'Fashion Designer', 'Electrician'],
      averageSalary: 'KES 35,000 - 180,000',
      universities: ['Technical University', 'TVET Institutes', 'Polytechnics'],
      icon: '🛠️',
      color: 'orange'
    }
  ];

  // Core Competencies
  const coreCompetencies = [
    'Communication',
    'Critical Thinking',
    'Creativity',
    'Citizenship',
    'Digital Literacy',
    'Learning to Learn',
    'Self-efficacy'
  ];

  // Interest Categories
  const interestCategories = [
    { id: 1, name: 'Science & Research', icon: '🔬', color: 'blue' },
    { id: 2, name: 'Technology & Computing', icon: '💻', color: 'indigo' },
    { id: 3, name: 'Engineering & Building', icon: '🏗️', color: 'orange' },
    { id: 4, name: 'Arts & Design', icon: '🎨', color: 'purple' },
    { id: 5, name: 'Music & Performance', icon: '🎵', color: 'pink' },
    { id: 6, name: 'Sports & Athletics', icon: '⚽', color: 'green' },
    { id: 7, name: 'Business & Entrepreneurship', icon: '💼', color: 'yellow' },
    { id: 8, name: 'Teaching & Education', icon: '📚', color: 'teal' },
    { id: 9, name: 'Healthcare & Medicine', icon: '🏥', color: 'red' },
    { id: 10, name: 'Agriculture & Environment', icon: '🌱', color: 'emerald' },
    { id: 11, name: 'Law & Politics', icon: '⚖️', color: 'gray' },
    { id: 12, name: 'Media & Communication', icon: '📺', color: 'cyan' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with API calls
      setTimeout(() => {
        setClasses([
          { id: 1, name: 'Grade 7 East', level: 7, stream: 'East', students: 45 },
          { id: 2, name: 'Grade 7 West', level: 7, stream: 'West', students: 42 },
          { id: 3, name: 'Grade 8 East', level: 8, stream: 'East', students: 38 },
          { id: 4, name: 'Grade 8 West', level: 8, stream: 'West', students: 40 },
          { id: 5, name: 'Grade 9 East', level: 9, stream: 'East', students: 43 },
          { id: 6, name: 'Grade 9 West', level: 9, stream: 'West', students: 41 }
        ]);

        setStudents([
          {
            id: 1,
            admissionNo: '2024/001',
            name: 'John Kamau',
            className: 'Grade 9 East',
            classId: 5,
            gender: 'M',
            upi: '1234567890'
          },
          {
            id: 2,
            admissionNo: '2024/002',
            name: 'Mary Wanjiku',
            className: 'Grade 9 East',
            classId: 5,
            gender: 'F',
            upi: '1234567891'
          },
          {
            id: 3,
            admissionNo: '2024/003',
            name: 'Peter Omondi',
            className: 'Grade 9 West',
            classId: 6,
            gender: 'M',
            upi: '1234567892'
          },
          {
            id: 4,
            admissionNo: '2024/004',
            name: 'Sarah Akinyi',
            className: 'Grade 8 East',
            classId: 3,
            gender: 'F',
            upi: '1234567893'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const fetchStudentProfile = async (studentId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const profile = {
        id: parseInt(studentId),
        name: studentId === '1' ? 'John Kamau' : studentId === '2' ? 'Mary Wanjiku' : 'Peter Omondi',
        admissionNo: studentId === '1' ? '2024/001' : studentId === '2' ? '2024/002' : '2024/003',
        className: studentId === '1' ? 'Grade 9 East' : studentId === '2' ? 'Grade 9 East' : 'Grade 9 West',
        upi: studentId === '1' ? '1234567890' : studentId === '2' ? '1234567891' : '1234567892',
        gender: studentId === '1' ? 'M' : studentId === '2' ? 'F' : 'M',
        dateOfBirth: '2010-05-15',
        age: 14,
        interests: studentId === '1' 
          ? ['Science & Research', 'Technology & Computing', 'Sports & Athletics']
          : studentId === '2'
          ? ['Arts & Design', 'Music & Performance', 'Teaching & Education']
          : ['Business & Entrepreneurship', 'Agriculture & Environment', 'Sports & Athletics'],
        talents: studentId === '1'
          ? ['Problem Solving', 'Leadership', 'Analytical Thinking']
          : studentId === '2'
          ? ['Creativity', 'Communication', 'Empathy']
          : ['Practical Skills', 'Negotiation', 'Teamwork'],
        aspirations: studentId === '1'
          ? 'I want to become an engineer and solve real-world problems'
          : studentId === '2'
          ? 'I want to be a teacher and inspire young minds'
          : 'I want to start my own agribusiness and create jobs',
        careerGoals: studentId === '1'
          ? 'Software Engineer or Mechanical Engineer'
          : studentId === '2'
          ? 'Teacher or Artist'
          : 'Entrepreneur or Farmer',
        preferredSubjects: studentId === '1'
          ? ['Mathematics', 'Integrated Science', 'Computer Science']
          : studentId === '2'
          ? ['English', 'Creative Arts', 'Kiswahili']
          : ['Agriculture', 'Business Studies', 'Mathematics'],
        performance: {
          grade7: {
            term1: { Mathematics: 78, Science: 82, English: 65, Kiswahili: 70, Agriculture: 75 },
            term2: { Mathematics: 80, Science: 85, English: 68, Kiswahili: 72, Agriculture: 78 },
            term3: { Mathematics: 82, Science: 88, English: 70, Kiswahili: 75, Agriculture: 80 }
          },
          grade8: {
            term1: { Mathematics: 83, Science: 86, English: 72, Kiswahili: 76, Agriculture: 82 },
            term2: { Mathematics: 85, Science: 89, English: 74, Kiswahili: 78, Agriculture: 84 },
            term3: { Mathematics: 87, Science: 91, English: 75, Kiswahili: 80, Agriculture: 86 }
          },
          grade9: {
            term1: { Mathematics: 88, Science: 92, English: 77, Kiswahili: 82, Agriculture: 88 },
            term2: { Mathematics: 90, Science: 94, English: 79, Kiswahili: 84, Agriculture: 90 }
          }
        },
        competencies: {
          Communication: 85,
          'Critical Thinking': 92,
          Creativity: 78,
          Citizenship: 88,
          'Digital Literacy': 90,
          'Learning to Learn': 86,
          'Self-efficacy': 82
        },
        values: {
          Respect: 90,
          Responsibility: 88,
          Integrity: 92,
          Honesty: 94,
          Love: 85,
          Tolerance: 82,
          Peace: 88
        },
        attendance: {
          grade7: { present: 180, absent: 5, total: 185 },
          grade8: { present: 185, absent: 3, total: 188 },
          grade9: { present: 125, absent: 2, total: 127 }
        },
        projects: [
          { name: 'Kitchen Garden Project', subject: 'Agriculture', score: 'EE1', year: 2024 },
          { name: 'Science Fair - Water Purification', subject: 'Science', score: 'EE2', year: 2024 },
          { name: 'School Debate Competition', subject: 'English', score: 'ME1', year: 2023 }
        ]
      };

      setStudentProfile(profile);
      generatePathwayRecommendations(profile);
      generateInterestAnalysis(profile);
      generatePerformanceTrends(profile);
      generateCompetencyRadar(profile);

    } catch (err) {
      setError('Failed to fetch student profile');
    } finally {
      setLoading(false);
    }
  };

  const generatePathwayRecommendations = (profile) => {
    const mathAvg = calculateSubjectAverage(profile, 'Mathematics');
    const scienceAvg = calculateSubjectAverage(profile, 'Science');
    const englishAvg = calculateSubjectAverage(profile, 'English');
    const kiswahiliAvg = calculateSubjectAverage(profile, 'Kiswahili');
    const agriAvg = calculateSubjectAverage(profile, 'Agriculture');

    const criticalThinkingScore = profile.competencies['Critical Thinking'];
    const creativityScore = profile.competencies['Creativity'];
    const digitalScore = profile.competencies['Digital Literacy'];

    const recommendations = careerPathways.map(pathway => {
      let score = 0;
      let matchFactors = [];

      if (pathway.code === 'STEM') {
        score = (mathAvg * 0.3 + scienceAvg * 0.3 + criticalThinkingScore * 0.2 + digitalScore * 0.2);
        if (mathAvg > 80) matchFactors.push('Strong Mathematics performance');
        if (scienceAvg > 80) matchFactors.push('Excellent Science scores');
        if (criticalThinkingScore > 85) matchFactors.push('High critical thinking ability');
        if (profile.interests.includes('Science & Research')) matchFactors.push('Interest in Science');
        if (profile.interests.includes('Technology & Computing')) matchFactors.push('Interest in Technology');
      }

      if (pathway.code === 'HUSS') {
        score = (englishAvg * 0.3 + kiswahiliAvg * 0.3 + profile.competencies['Communication'] * 0.2 + profile.competencies['Citizenship'] * 0.2);
        if (englishAvg > 75) matchFactors.push('Strong English performance');
        if (kiswahiliAvg > 75) matchFactors.push('Strong Kiswahili performance');
        if (profile.competencies['Communication'] > 80) matchFactors.push('Excellent communication skills');
        if (profile.interests.includes('Law & Politics')) matchFactors.push('Interest in Law/Politics');
        if (profile.interests.includes('Teaching & Education')) matchFactors.push('Interest in Teaching');
      }

      if (pathway.code === 'ARTS') {
        score = (creativityScore * 0.4 + profile.competencies['Communication'] * 0.3 + englishAvg * 0.3);
        if (creativityScore > 80) matchFactors.push('High creativity score');
        if (profile.interests.includes('Arts & Design')) matchFactors.push('Interest in Arts');
        if (profile.interests.includes('Music & Performance')) matchFactors.push('Interest in Music/Performance');
        if (profile.interests.includes('Sports & Athletics')) matchFactors.push('Interest in Sports');
        if (profile.talents.includes('Creativity')) matchFactors.push('Creative talent');
      }

      if (pathway.code === 'TVET') {
        score = (agriAvg * 0.25 + mathAvg * 0.2 + profile.competencies['Self-efficacy'] * 0.3 + digitalScore * 0.25);
        if (agriAvg > 70) matchFactors.push('Strong Agriculture performance');
        if (profile.interests.includes('Business & Entrepreneurship')) matchFactors.push('Interest in Business');
        if (profile.interests.includes('Agriculture & Environment')) matchFactors.push('Interest in Agriculture');
        if (profile.talents.includes('Practical Skills')) matchFactors.push('Practical skills talent');
      }

      return {
        ...pathway,
        matchScore: Math.round(score),
        matchFactors: matchFactors.slice(0, 3),
        confidence: score > 85 ? 'High' : score > 70 ? 'Medium' : 'Low'
      };
    });

    const sorted = recommendations.sort((a, b) => b.matchScore - a.matchScore);
    setPathwayRecommendations(sorted);
  };

  const generateInterestAnalysis = (profile) => {
    const analysis = profile.interests.map(interest => {
      const category = interestCategories.find(c => c.name === interest);
      return {
        subject: interest,
        value: Math.floor(Math.random() * 30) + 70,
        icon: category?.icon || '📌',
        color: category?.color || 'blue'
      };
    });
    setInterestAnalysis(analysis);
  };

  const generatePerformanceTrends = (profile) => {
    const trends = [];
    const subjects = ['Mathematics', 'Science', 'English', 'Kiswahili', 'Agriculture'];
    
    subjects.forEach(subject => {
      const data = [];
      if (profile.performance.grade7) {
        data.push({
          term: 'G7 T1',
          score: profile.performance.grade7.term1[subject] || 0,
          grade: 'Grade 7'
        });
        data.push({
          term: 'G7 T2',
          score: profile.performance.grade7.term2[subject] || 0,
          grade: 'Grade 7'
        });
        data.push({
          term: 'G7 T3',
          score: profile.performance.grade7.term3[subject] || 0,
          grade: 'Grade 7'
        });
      }
      if (profile.performance.grade8) {
        data.push({
          term: 'G8 T1',
          score: profile.performance.grade8.term1[subject] || 0,
          grade: 'Grade 8'
        });
        data.push({
          term: 'G8 T2',
          score: profile.performance.grade8.term2[subject] || 0,
          grade: 'Grade 8'
        });
        data.push({
          term: 'G8 T3',
          score: profile.performance.grade8.term3[subject] || 0,
          grade: 'Grade 8'
        });
      }
      if (profile.performance.grade9) {
        data.push({
          term: 'G9 T1',
          score: profile.performance.grade9.term1[subject] || 0,
          grade: 'Grade 9'
        });
        data.push({
          term: 'G9 T2',
          score: profile.performance.grade9.term2[subject] || 0,
          grade: 'Grade 9'
        });
      }
      
      trends.push({
        subject,
        data
      });
    });
    
    setPerformanceTrends(trends);
  };

  const generateCompetencyRadar = (profile) => {
    const data = coreCompetencies.map(comp => ({
      competency: comp,
      score: profile.competencies[comp] || 0,
      fullMark: 100
    }));
    setCompetencyRadar(data);
  };

  const calculateSubjectAverage = (profile, subject) => {
    let total = 0;
    let count = 0;
    
    if (profile.performance.grade9) {
      if (profile.performance.grade9.term1[subject]) {
        total += profile.performance.grade9.term1[subject];
        count++;
      }
      if (profile.performance.grade9.term2[subject]) {
        total += profile.performance.grade9.term2[subject];
        count++;
      }
    }
    
    return count > 0 ? Math.round(total / count) : 70;
  };

  const handleStudentSelect = (e) => {
    setSelectedStudent(e.target.value);
    if (e.target.value) {
      fetchStudentProfile(e.target.value);
    } else {
      setStudentProfile(null);
      setPathwayRecommendations([]);
    }
  };

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleAddInterest = () => {
    if (studentProfile) {
      setInterestForm({
        interests: studentProfile.interests || [],
        talents: studentProfile.talents || [],
        aspirations: studentProfile.aspirations || '',
        preferredSubjects: studentProfile.preferredSubjects || [],
        careerGoals: studentProfile.careerGoals || ''
      });
      setShowInterestModal(true);
    }
  };

  const handleInterestSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Interests updated successfully');
      setShowInterestModal(false);
      
      if (selectedStudent) {
        fetchStudentProfile(selectedStudent);
      }
    } catch (err) {
      setError('Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest) => {
    setInterestForm(prev => {
      const current = prev.interests || [];
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...current, interest] };
      }
    });
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'High': return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && !studentProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics & Career Pathways</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track student progress and get AI-powered career recommendations for Grade 9 exit
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Student Selection */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Class/Grade
              </label>
              <select
                value={selectedClass}
                onChange={handleClassSelect}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.students} students)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Student
              </label>
              <select
                value={selectedStudent}
                onChange={handleStudentSelect}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Student</option>
                {students
                  .filter(s => selectedClass || s.classId === parseInt(selectedClass))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admissionNo})</option>
                  ))
                }
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddInterest}
                disabled={!selectedStudent}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Interests & Talents
              </button>
            </div>
          </div>
        </div>

        {studentProfile && (
          <>
            {/* Student Profile Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {studentProfile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{studentProfile.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">{studentProfile.admissionNo}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-gray-500">{studentProfile.className}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-gray-500">UPI: {studentProfile.upi}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
                        Age {studentProfile.age}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                        Grade {studentProfile.className.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {studentProfile.interests.map((interest, i) => {
                          const category = interestCategories.find(c => c.name === interest);
                          return (
                            <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 bg-${category?.color}-50 text-${category?.color}-700 rounded text-xs border border-${category?.color}-200`}>
                              {category?.icon} {interest}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Talents</p>
                      <div className="flex flex-wrap gap-1">
                        {studentProfile.talents.map((talent, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-200">
                            ✨ {talent}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Career Goal</p>
                      <p className="text-sm font-medium text-gray-900">
                        {studentProfile.careerGoals}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'pathway', label: 'Career Pathway', icon: '🎯' },
                  { id: 'performance', label: 'Performance Trends', icon: '📈' },
                  { id: 'competencies', label: 'Competency Profile', icon: '⭐' },
                  { id: 'interests', label: 'Interests & Talents', icon: '🎨' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Career Pathway Tab */}
              {activeTab === 'pathway' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Career Pathway Recommendations - Grade 9 Exit
                    </h2>
                    <span className="text-xs text-gray-500">
                      Based on academic performance and interests
                    </span>
                  </div>
                  
                  {/* Top Recommendation */}
                  {pathwayRecommendations.length > 0 && (
                    <div className={`p-6 bg-gradient-to-r from-${pathwayRecommendations[0].color}-50 to-${pathwayRecommendations[0].color}-100 border border-${pathwayRecommendations[0].color}-200 rounded-xl`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          TOP RECOMMENDATION
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getConfidenceColor(pathwayRecommendations[0].confidence)}`}>
                          {pathwayRecommendations[0].confidence} Confidence
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{pathwayRecommendations[0].icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {pathwayRecommendations[0].name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {pathwayRecommendations[0].description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Match Score</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">
                                  {pathwayRecommendations[0].matchScore}%
                                </span>
                                <div className="flex-1 h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${pathwayRecommendations[0].matchScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Recommended Careers</p>
                              <p className="text-sm font-medium text-gray-900">
                                {pathwayRecommendations[0].recommendedCareers.slice(0, 3).join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Average Salary Range</p>
                              <p className="text-sm font-medium text-gray-900">
                                {pathwayRecommendations[0].averageSalary}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Matching Factors:</p>
                            <div className="flex flex-wrap gap-2">
                              {pathwayRecommendations[0].matchFactors.map((factor, i) => (
                                <span key={i} className="px-3 py-1 bg-white bg-opacity-50 text-gray-700 rounded-full text-xs border border-gray-200">
                                  ✓ {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* All Pathways Comparison */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">All Pathways Comparison</h3>
                    <div className="space-y-3">
                      {pathwayRecommendations.map((pathway, index) => (
                        <div key={pathway.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{pathway.icon}</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{pathway.name}</h4>
                                <p className="text-xs text-gray-500">Code: {pathway.code}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getConfidenceColor(pathway.confidence)}`}>
                                {pathway.confidence}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              {pathway.matchScore}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pathway.matchScore}%` }}
                            ></div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {pathway.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Required Subjects</p>
                              <div className="flex flex-wrap gap-1">
                                {pathway.requiredSubjects.map((subj, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    {subj}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Career Options</p>
                              <p className="text-sm text-gray-900">
                                {pathway.recommendedCareers.slice(0, 4).join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grade 9 Exit Summary */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-xl">📋</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Grade 9 Exit - Career Pathway Selection
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Based on the learner's performance in Grade 7-9 and their interests, 
                          the recommended pathway for Senior School is{' '}
                          <span className="font-bold">{pathwayRecommendations[0]?.name}</span>.
                          This recommendation will be presented to the learner and parents for 
                          final selection before Grade 10 placement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Trends Tab */}
              {activeTab === 'performance' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Performance Trends - Junior School (Grade 7-9)
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {performanceTrends.map((trend, idx) => {
                      const average = trend.data.reduce((sum, item) => sum + item.score, 0) / trend.data.length;
                      
                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">{trend.subject}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Average:</span>
                              <span className={`text-sm font-bold ${getScoreColor(average)}`}>
                                {average.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={trend.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="term" tick={{ fontSize: 12 }} />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#3b82f6" 
                                fill="#93c5fd" 
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    })}
                  </div>

                  {/* Subject Performance Summary */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Strongest Subjects</p>
                      <p className="text-lg font-bold text-green-700">
                        Science, Mathematics
                      </p>
                      <p className="text-xs text-green-600 mt-1">Above 85% average</p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-600 mb-1">Improvement Needed</p>
                      <p className="text-lg font-bold text-yellow-700">
                        Kiswahili, English
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">Below 75% average</p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Overall Trend</p>
                      <p className="text-lg font-bold text-blue-700">
                        +12% Improvement
                      </p>
                      <p className="text-xs text-blue-600 mt-1">From Grade 7 to Grade 9</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Competency Profile Tab */}
              {activeTab === 'competencies' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Core Competencies & Values Profile
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Competency Radar</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyRadar}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="competency" tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
                          <Radar 
                            name="Score" 
                            dataKey="score" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.3}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Competency List */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Competency Scores</h3>
                      <div className="space-y-4">
                        {competencyRadar.map((comp, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-700">{comp.competency}</span>
                              <span className={`text-sm font-bold ${getScoreColor(comp.score)}`}>
                                {comp.score}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  comp.score >= 80 ? 'bg-green-500' :
                                  comp.score >= 60 ? 'bg-blue-500' :
                                  comp.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${comp.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Values Assessment */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Values Assessment</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(studentProfile.values).map(([value, score], idx) => (
                          <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="4"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  fill="none"
                                  stroke={
                                    score >= 90 ? '#22c55e' :
                                    score >= 80 ? '#3b82f6' :
                                    score >= 70 ? '#eab308' : '#ef4444'
                                  }
                                  strokeWidth="4"
                                  strokeDasharray={`${2 * Math.PI * 28}`}
                                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                {score}%
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gray-700">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interests & Talents Tab */}
              {activeTab === 'interests' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Interests & Talents Analysis
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Interest Categories */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Interest Areas</h3>
                      <div className="space-y-4">
                        {interestAnalysis.map((interest, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{interest.icon}</span>
                                <span className="text-sm text-gray-700">{interest.subject}</span>
                              </div>
                              <span className={`text-sm font-bold text-${interest.color}-600`}>
                                {interest.value}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full bg-${interest.color}-500`}
                                style={{ width: `${interest.value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Talents */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Identified Talents</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {studentProfile.talents.map((talent, idx) => (
                          <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg text-center">
                            <div className="text-3xl mb-2">✨</div>
                            <p className="text-sm font-medium text-gray-900">{talent}</p>
                            <p className="text-xs text-gray-500 mt-1">Natural ability</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects Portfolio */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Project Portfolio Evidence</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {studentProfile.projects.map((project, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-900 mb-1">{project.name}</p>
                            <p className="text-xs text-gray-500 mb-3">{project.subject} • {project.year}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              project.score === 'EE1' 
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : project.score === 'EE2'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              {project.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Interest Update Modal */}
        {showInterestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Update Interests & Talents
                  </h2>
                  <button
                    onClick={() => setShowInterestModal(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleInterestSubmit(); }} className="space-y-5">
                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Interest Areas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestCategories.map(category => (
                        <label
                          key={category.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            interestForm.interests.includes(category.name)
                              ? `bg-${category.color}-50 border-${category.color}-200`
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={interestForm.interests.includes(category.name)}
                            onChange={() => handleInterestToggle(category.name)}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Talents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Talents (comma separated)
                    </label>
                    <input
                      type="text"
                      value={interestForm.talents.join(', ')}
                      onChange={(e) => setInterestForm({
                        ...interestForm,
                        talents: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      })}
                      placeholder="e.g., Drawing, Public Speaking, Sports"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Career Goals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Goals
                    </label>
                    <input
                      type="text"
                      value={interestForm.careerGoals}
                      onChange={(e) => setInterestForm({ ...interestForm, careerGoals: e.target.value })}
                      placeholder="e.g., Software Engineer, Teacher, Entrepreneur"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Aspirations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Aspirations
                    </label>
                    <textarea
                      value={interestForm.aspirations}
                      onChange={(e) => setInterestForm({ ...interestForm, aspirations: e.target.value })}
                      rows="3"
                      placeholder="What do you want to become in future? Describe your dreams and aspirations..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  {/* Preferred Subjects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Subjects
                    </label>
                    <select
                      multiple
                      value={interestForm.preferredSubjects}
                      onChange={(e) => setInterestForm({
                        ...interestForm,
                        preferredSubjects: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      size="4"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Integrated Science</option>
                      <option value="English">English</option>
                      <option value="Kiswahili">Kiswahili</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Creative Arts">Creative Arts</option>
                      <option value="Business Studies">Business Studies</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowInterestModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;