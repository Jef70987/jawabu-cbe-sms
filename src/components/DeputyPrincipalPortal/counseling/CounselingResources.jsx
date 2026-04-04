import React, { useState } from 'react';
import {
  BookOpen, FileText, Video, Download,
  Search, Filter, Eye, Plus, MoreVertical,
  Heart, Users, Award, Link as LinkIcon
} from 'lucide-react';

const CounselingResources = () => {
  const [activeTab, setActiveTab] = useState('guides');

  const resources = {
    guides: [
      {
        id: 1,
        title: 'Student Stress Management Guide',
        type: 'PDF',
        category: 'Mental Health',
        size: '2.4 MB',
        downloads: 245,
        uploaded: '2024-03-01'
      },
      {
        id: 2,
        title: 'Academic Success Strategies',
        type: 'PDF',
        category: 'Academic',
        size: '1.8 MB',
        downloads: 189,
        uploaded: '2024-03-05'
      }
    ],
    videos: [
      {
        id: 3,
        title: 'Understanding Anxiety in Teens',
        type: 'Video',
        duration: '15:30',
        views: 567,
        uploaded: '2024-02-15'
      },
      {
        id: 4,
        title: 'Conflict Resolution Techniques',
        type: 'Video',
        duration: '12:45',
        views: 432,
        uploaded: '2024-02-20'
      }
    ],
    articles: [
      {
        id: 5,
        title: 'Building Resilience in Students',
        type: 'Article',
        author: 'Dr. Sarah Wilson',
        readTime: '8 min',
        likes: 89,
        published: '2024-03-10'
      }
    ],
    links: [
      {
        id: 6,
        title: 'National Youth Mental Health Foundation',
        url: 'https://example.com/mental-health',
        category: 'External Resource',
        visits: 234,
        added: '2024-02-01'
      }
    ]
  };

  const tabs = [
    { id: 'guides', name: 'Guides & Handouts', icon: <BookOpen size={16} /> },
    { id: 'videos', name: 'Videos', icon: <Video size={16} /> },
    { id: 'articles', name: 'Articles', icon: <FileText size={16} /> },
    { id: 'links', name: 'External Links', icon: <LinkIcon size={16} /> }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header. */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Counseling Resources</h1>
          <p className="text-gray-600 mt-1">Educational materials and resources for students</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Library</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700">
            <Plus size={18} />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Resources</p>
          <p className="text-2xl font-bold text-blue-600">48</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-green-600">1,245</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Video Views</p>
          <p className="text-2xl font-bold text-purple-600">2,890</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">External Links</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>All Categories</option>
              <option>Mental Health</option>
              <option>Academic</option>
              <option>Social Skills</option>
            </select>
          </div>

          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.guides.map((guide) => (
                <div key={guide.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <BookOpen size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{guide.title}</h3>
                        <p className="text-xs text-gray-500">{guide.category} • {guide.type} • {guide.size}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{guide.downloads} downloads</span>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Download
                    </button>
                    <button className="p-1 hover:bg-white rounded-lg">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.videos.map((video) => (
                <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Video size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{video.title}</h3>
                      <p className="text-xs text-gray-500">{video.duration} • {video.views} views</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Watch Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-4">
              {resources.articles.map((article) => (
                <div key={article.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <FileText size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{article.title}</h3>
                        <p className="text-xs text-gray-500">By {article.author} • {article.readTime} read</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart size={14} className="text-red-500" />
                      <span className="text-xs">{article.likes} likes</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Read Article
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              {resources.links.map((link) => (
                <div key={link.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <LinkIcon size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{link.title}</h3>
                        <p className="text-xs text-gray-500">{link.category}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{link.visits} visits</span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        Visit Link
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselingResources;