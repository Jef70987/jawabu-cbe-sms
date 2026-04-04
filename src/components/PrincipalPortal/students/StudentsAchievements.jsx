import React, { useState } from 'react';
import {
  Award, Star, Trophy, Medal,
  Search, Filter, Download, Eye,
  Calendar, Users, TrendingUp, CheckCircle,
  Plus, MoreVertical, FileText,
  Share2   // ✅ FIXED: added missing import
} from 'lucide-react';

const StudentsAchievements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const achievements = [
    {
      id: 'ACH001',
      title: 'National Science Fair Winner',
      student: 'Emma Thompson',
      grade: '10B',
      category: 'Academic',
      date: '2024-03-15',
      level: 'National',
      description: 'First place in Physics category',
      awardedBy: 'National Science Foundation'
    },
    {
      id: 'ACH002',
      title: 'Mathematics Olympiad Top 10',
      student: 'Sophia Lee',
      grade: '9C',
      category: 'Academic',
      date: '2024-03-10',
      level: 'Regional',
      description: 'Ranked 5th in regional competition',
      awardedBy: 'Math Association'
    },
    {
      id: 'ACH003',
      title: 'State Basketball Champions',
      student: 'James Wilson',
      grade: '11A',
      category: 'Sports',
      date: '2024-02-28',
      level: 'State',
      description: 'Team Captain, MVP of tournament',
      awardedBy: 'State Sports Federation'
    },
    {
      id: 'ACH004',
      title: 'Community Service Award',
      student: 'Olivia Martinez',
      grade: '11B',
      category: 'Community',
      date: '2024-02-20',
      level: 'School',
      description: '200+ volunteer hours',
      awardedBy: 'Student Council'
    }
  ];

  // ✅ FIXED .Tailwind safe classes
  const colorMap = {
    blue: "from-blue-50 to-blue-100",
    green: "from-green-50 to-green-100",
    purple: "from-purple-50 to-purple-100",
    orange: "from-orange-50 to-orange-100"
  };

  const iconBgMap = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100"
  };

  const categoryStats = [
    { name: 'Academic', count: 145, icon: <Award size={20} />, color: 'blue' },
    { name: 'Sports', count: 98, icon: <Trophy size={20} />, color: 'green' },
    { name: 'Arts', count: 67, icon: <Star size={20} />, color: 'purple' },
    { name: 'Community', count: 52, icon: <Medal size={20} />, color: 'orange' }
  ];

  const getLevelColor = (level) => {
    switch(level) {
      case 'National': return 'bg-purple-100 text-purple-800';
      case 'State': return 'bg-blue-100 text-blue-800';
      case 'Regional': return 'bg-green-100 text-green-800';
      case 'School': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAchievements = achievements.filter(ach =>
    (filterType === 'all' || ach.category === filterType) &&
    (ach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ach.student.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Achievements</h1>
          <p className="text-gray-600 mt-1">Celebrate and track student accomplishments</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} />
            <span>Export Achievements</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryStats.map((cat, idx) => (
          <div key={idx} className={`bg-gradient-to-r ${colorMap[cat.color]} rounded-xl p-4`}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm">{cat.name}</p>
                <p className="text-xl font-bold">{cat.count}</p>
              </div>
              <div className={`p-2 ${iconBgMap[cat.color]} rounded-lg`}>
                {cat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredAchievements.map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-xl border hover:shadow-md">
            <div className="p-5 border-b bg-yellow-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">
                    {achievement.student} - Grade {achievement.grade}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${getLevelColor(achievement.level)}`}>
                  {achievement.level}
                </span>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm mb-3">{achievement.description}</p>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white rounded px-3 py-2 text-sm">
                  View Certificate
                </button>

                {/* ✅ FIXED */}
                <button className="px-3 py-2 border rounded hover:bg-gray-50">
                  <Share2 size={16} />
                </button>

                <button className="px-3 py-2 border rounded hover:bg-gray-50">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StudentsAchievements;