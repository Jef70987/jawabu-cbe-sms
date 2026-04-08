/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Calendar, Download, Printer, 
  ChevronDown, TrendingUp, CheckCircle, Clock 
} from 'lucide-react';

const Academic = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [studentInfo, setStudentInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [termResults, setTermResults] = useState(null);
  const [reportCards, setReportCards] = useState([]);
  const [selectedReportCard, setSelectedReportCard] = useState(null);
  const [error, setError] = useState(null);

  // CBC Rating Scale
  const ratingScale = {
    EE1: { label: 'Exceptional', range: '90-100%', points: 8, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    EE2: { label: 'Very Good', range: '75-89%', points: 7, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    ME1: { label: 'Good', range: '58-74%', points: 6, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    ME2: { label: 'Fair', range: '41-57%', points: 5, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    AE1: { label: 'Needs Improvement', range: '31-40%', points: 4, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    AE2: { label: 'Below Average', range: '21-30%', points: 3, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    BE1: { label: 'Well Below Average', range: '11-20%', points: 2, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    BE2: { label: 'Minimal', range: '1-10%', points: 1, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  };

  useEffect(() => {
    fetchAcademicData();
  }, [selectedTerm, selectedYear]);

  const fetchAcademicData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        // Student Information
        setStudentInfo({
          name: 'John Kamau',
          admissionNo: '2024/001',
          class: 'Grade 9 East',
          classTeacher: 'Mr. Omondi',
          upi: '1234567890',
          stream: 'East',
          rollNumber: 12
        });

        // Subjects taken in current class
        setSubjects([
          { id: 1, name: 'Integrated Science', code: 'SCI', isCompulsory: true, teacher: 'Mrs. Mwangi' },
          { id: 2, name: 'Mathematics', code: 'MATH', isCompulsory: true, teacher: 'Mr. Kamau' },
          { id: 3, name: 'English', code: 'ENG', isCompulsory: true, teacher: 'Ms. Achieng' },
          { id: 4, name: 'Kiswahili', code: 'KIS', isCompulsory: true, teacher: 'Mrs. Otieno' },
          { id: 5, name: 'Agriculture', code: 'AGR', isCompulsory: true, teacher: 'Mr. Kipchoge' },
          { id: 6, name: 'Creative Arts', code: 'ART', isCompulsory: false, teacher: 'Ms. Wangari' }
        ]);

        // Term Results
        setTermResults({
          term: 'Term 1',
          year: '2024',
          overallRating: 'ME1',
          overallPoints: 6,
          totalCompetencies: 35,
          eeCount: 12,
          meCount: 15,
          aeCount: 6,
          beCount: 2,
          learningAreas: [
            { name: 'Integrated Science', score: 'ME1', points: 6, percentage: 72, teacherComment: 'Good understanding of scientific concepts' },
            { name: 'Mathematics', score: 'ME2', points: 5, percentage: 65, teacherComment: 'Needs improvement in algebra' },
            { name: 'English', score: 'ME1', points: 6, percentage: 71, teacherComment: 'Good reading comprehension' },
            { name: 'Kiswahili', score: 'ME1', points: 6, percentage: 74, teacherComment: 'Excellent oral skills' },
            { name: 'Agriculture', score: 'EE2', points: 7, percentage: 82, teacherComment: 'Excellent practical work' },
            { name: 'Creative Arts', score: 'EE1', points: 8, percentage: 91, teacherComment: 'Outstanding creativity' }
          ],
          attendance: {
            present: 62,
            absent: 3,
            total: 65,
            percentage: 95.4
          },
          teacherRemarks: 'John has shown good progress this term. He excels in practical subjects and works well in groups. Needs to focus more on mathematics.',
          headTeacherRemarks: 'A promising student with good academic potential. Keep up the good work.'
        });

        // Available Report Cards
        setReportCards([
          { id: 1, term: 'Term 1', year: '2024', generatedDate: '2024-04-15', status: 'Published' },
          { id: 2, term: 'Term 2', year: '2024', generatedDate: '2024-07-10', status: 'Pending' },
          { id: 3, term: 'Term 3', year: '2023', generatedDate: '2023-11-20', status: 'Published' }
        ]);

        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load academic data');
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    return ratingScale[rating]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const handlePrintResult = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('Downloading result slip...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Performance</h1>
            <p className="text-gray-600 dark:text-gray-400">View your term results, subjects, and report cards</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrintResult}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Student Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{studentInfo?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admission Number</p>
              <p className="font-medium text-gray-900 dark:text-white">{studentInfo?.admissionNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
              <p className="font-medium text-gray-900 dark:text-white">{studentInfo?.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Class Teacher</p>
              <p className="font-medium text-gray-900 dark:text-white">{studentInfo?.classTeacher}</p>
            </div>
          </div>
        </div>

        {/* Term Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 flex gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
        </div>

        {/* Overall Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 mb-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-blue-100 text-sm">Overall Rating</p>
              <p className="text-3xl font-bold">{termResults?.overallRating}</p>
              <p className="text-blue-100 text-sm">{termResults?.overallPoints} Points</p>
            </div>
            <div className="text-center">
              <p className="text-blue-100 text-sm">Total Competencies</p>
              <p className="text-3xl font-bold">{termResults?.totalCompetencies}</p>
              <p className="text-blue-100 text-sm">Assessed</p>
            </div>
            <div className="text-center">
              <p className="text-blue-100 text-sm">Attendance Rate</p>
              <p className="text-3xl font-bold">{termResults?.attendance.percentage}%</p>
              <p className="text-blue-100 text-sm">{termResults?.attendance.present}/{termResults?.attendance.total} days</p>
            </div>
            <div className="text-center">
              <p className="text-blue-100 text-sm">Class Position</p>
              <p className="text-3xl font-bold">12/42</p>
              <p className="text-blue-100 text-sm">Top 29%</p>
            </div>
          </div>
        </div>

        {/* Competency Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 dark:text-green-400">Exceeding (EE)</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{termResults?.eeCount}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-400">Meeting (ME)</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{termResults?.meCount}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Approaching (AE)</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{termResults?.aeCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">Below (BE)</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{termResults?.beCount}</p>
          </div>
        </div>

        {/* Learning Areas Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Areas Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Learning Area</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300">Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300">Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Teacher's Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {termResults?.learningAreas.map((area, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{area.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRatingColor(area.score)}`}>
                        {area.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">{area.points}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{area.teacherComment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subjects Taken */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <div key={subject.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{subject.name}</h3>
                  {subject.isCompulsory ? (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">Core</span>
                  ) : (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">Optional</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code: {subject.code}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Teacher: {subject.teacher}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Remarks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teacher's Remarks</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{termResults?.teacherRemarks}</p>
          </div>
        </div>

        {/* Head Teacher Remarks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Head Teacher's Remarks</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{termResults?.headTeacherRemarks}</p>
          </div>
        </div>

        {/* Report Card Archive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Previous Report Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportCards.map(card => (
              <div key={card.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{card.term} {card.year}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    card.status === 'Published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {card.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generated: {new Date(card.generatedDate).toLocaleDateString()}</p>
                <button className="mt-3 w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  View Report Card
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academic;