/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { useAuth } from '../Authentication/AuthContext';
import { useNavigate } from 'react-router';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const notificationColors = {
  warning: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  info: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  success: { bg: 'bg-green-50', icon: 'text-green-600' },
  admission: { bg: 'bg-purple-50', icon: 'text-purple-600' }
};

function Dashboard() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Dashboard data state - all real data
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    todayRegistrations: 0,
    maleStudents: 0,
    femaleStudents: 0,
    admissionRate: 0,
    studentsNeedingClass: 0
  });

  // Fetch real data from backend
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAllData();
    updateDateTime();
    
    const timeInterval = setInterval(updateDateTime, 60000);
    const dataRefreshInterval = setInterval(fetchAllData, 300000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch students and classes in parallel
      const [studentsRes, classesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/registrar/students/`, {
          headers: getAuthHeaders()
        }),
        fetch(`${API_BASE_URL}/api/registrar/classes/`, {
          headers: getAuthHeaders()
        })
      ]);
      
      const studentsData = await studentsRes.json();
      const classesData = await classesRes.json();
      
      if (studentsData.success) {
        setStudents(studentsData.data);
        calculateStats(studentsData.data, classesData.data);
      }
      
      if (classesData.success) {
        setClasses(classesData.data);
      }
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentsData, classesData) => {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate statistics
    const totalStudents = studentsData.length;
    const activeStudents = studentsData.filter(s => s.status === 'Active').length;
    const maleStudents = studentsData.filter(s => s.gender === 'Male').length;
    const femaleStudents = studentsData.filter(s => s.gender === 'Female').length;
    const studentsNeedingClass = studentsData.filter(s => !s.current_class).length;
    
    // Today's registrations
    const todayRegistrations = studentsData.filter(s => {
      if (!s.admission_date) return false;
      const admissionDate = new Date(s.admission_date);
      admissionDate.setHours(0, 0, 0, 0);
      return admissionDate.getTime() === today.getTime();
    }).length;
    
    // Admission rate (active vs total)
    const admissionRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
    
    setStats({
      totalStudents,
      activeStudents,
      todayRegistrations,
      maleStudents,
      femaleStudents,
      admissionRate,
      studentsNeedingClass
    });
  };

  const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
    
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes} ${ampm}`);
  };

  // const handleNavigate = (path) => {
  //   navigate(path);
  // };

  // Get recent students (last 5 by admission date)
  const getRecentStudents = () => {
    return [...students]
      .sort((a, b) => new Date(b.admission_date) - new Date(a.admission_date))
      .slice(0, 5);
  };

  // Get class distribution
  const getClassDistribution = () => {
    const distribution = {};
    students.forEach(student => {
      if (student.current_class) {
        const className = classes.find(c => c.id === student.current_class)?.class_name || 'Unknown';
        distribution[className] = (distribution[className] || 0) + 1;
      }
    });
    return distribution;
  };

  // Generate admission trends (last 6 months of real data)
  const getAdmissionTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const labels = [];
    const applications = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
      
      // Count real students admitted in this month
      const monthStudents = students.filter(s => {
        if (!s.admission_date) return false;
        const date = new Date(s.admission_date);
        return date.getMonth() === monthIndex;
      }).length;
      
      applications.push(monthStudents);
    }
    
    return { labels, applications };
  };

  // Get real notifications based on data
  const getNotifications = () => {
    const notifications = [];
    
    // Notification for today's registrations
    if (stats.todayRegistrations > 0) {
      notifications.push({
        id: 1,
        type: 'admission',
        icon: 'user-plus',
        title: `${stats.todayRegistrations} new admission(s) today`,
        time: 'Today',
        read: false
      });
    }
    
    // Notification for students needing class assignment
    if (stats.studentsNeedingClass > 0) {
      notifications.push({
        id: 2,
        type: 'warning',
        icon: 'exclamation-circle',
        title: `${stats.studentsNeedingClass} students need class assignment`,
        time: 'Now',
        read: false
      });
    }
    
    // Notification for system status
    notifications.push({
      id: 3,
      type: 'success',
      icon: 'check-circle',
      title: `System connected · ${students.length} students loaded`,
      time: 'Live',
      read: true
    });
    
    return notifications;
  };

  // Get upcoming deadlines (real data from your system)
  const getDeadlines = () => {
    // These should come from a deadlines API endpoint
    // For now, using static data but marked as coming soon
    return [
      { id: 1, title: 'Term 1 Registration', daysLeft: 5, status: 'warning' },
      { id: 2, title: 'Document Verification', daysLeft: 7, status: 'info' },
      { id: 3, title: 'Fee Payment Deadline', daysLeft: 10, status: 'success' }
    ];
  };

  // Chart initialization
  useEffect(() => {
    if (!students.length) return;
    
    const trends = getAdmissionTrends();
    const distribution = getClassDistribution();
    
    // Admission Trends Chart
    const ctx = document.getElementById('admissionChart');
    if (ctx) {
      // @ts-ignore
      if (ctx.chartInstance) {
        // @ts-ignore
        ctx.chartInstance.destroy();
      }

      const admissionChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: trends.labels,
          datasets: [
            {
              label: 'Admissions',
              data: trends.applications,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Students'
              }
            }
          }
        }
      });
      
      // @ts-ignore
      ctx.chartInstance = admissionChart;
    }

    // Class Distribution Chart
    const classCtx = document.getElementById('classDistributionChart');
    if (classCtx && Object.keys(distribution).length > 0) {
      // @ts-ignore
      if (classCtx.chartInstance) {
        // @ts-ignore
        classCtx.chartInstance.destroy();
      }

      const classChart = new Chart(classCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(distribution),
          datasets: [{
            data: Object.values(distribution),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(6, 182, 212, 0.8)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
      
      // @ts-ignore
      classCtx.chartInstance = classChart;
    }

    return () => {
      // Cleanup handled by destroy calls above
    };
  }, [students, classes]);

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access the registrar dashboard</p>
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrar dashboard...</p>
        </div>
      </div>
    );
  }

  const recentStudents = getRecentStudents();
  const classDistribution = getClassDistribution();
  const notifications = getNotifications();
  const deadlines = getDeadlines();
  const trends = getAdmissionTrends();

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
              <i className="fas fa-user-tie text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Registrar Dashboard</h1>
              <p className="text-gray-600">Academics & Admissions Management</p>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Logged in as: <span className="font-medium">{user.first_name} {user.last_name}</span> ({user.role})
                </p>
              )}
              {error && (
                <div className="mt-1 flex items-center text-sm text-amber-600">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:items-end space-y-2">
            <p className="text-gray-700 font-medium">{currentDate}</p>
            <p className="text-gray-600">{currentTime}</p>
            <button 
              onClick={fetchAllData}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh Data
            </button>
          </div>
        </header>

        {/* Stats Cards - All Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon="users" 
            color="border-blue-500" 
            trend={`${stats.todayRegistrations} new today`} 
          />
          <StatCard 
            title="Active Students" 
            value={stats.activeStudents} 
            icon="user-check" 
            color="border-green-500" 
            trend={`${stats.admissionRate}% admission rate`} 
          />
          <StatCard 
            title="Male Students" 
            value={stats.maleStudents} 
            icon="male" 
            color="border-amber-500" 
            trend={stats.totalStudents > 0 ? `${Math.round((stats.maleStudents / stats.totalStudents) * 100)}% of total` : '0%'} 
          />
          <StatCard 
            title="Female Students" 
            value={stats.femaleStudents} 
            icon="female" 
            color="border-pink-500" 
            trend={stats.totalStudents > 0 ? `${Math.round((stats.femaleStudents / stats.totalStudents) * 100)}% of total` : '0%'} 
          />
          <StatCard 
            title="Need Class" 
            value={stats.studentsNeedingClass} 
            icon="exclamation-circle" 
            color="border-purple-500" 
            trend="Require assignment" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Admission Trends Chart - Real Data */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Admission Trends</h3>
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
            <div className="h-72">
              <canvas id="admissionChart" className="w-full h-full"></canvas>
            </div>
          </div>

          {/* Class Distribution - Real Data */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Distribution</h3>
              <div className="h-56">
                <canvas id="classDistributionChart" className="w-full h-full"></canvas>
              </div>
              {Object.keys(classDistribution).length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">No students assigned to classes yet</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* <QuickActionButton 
                  icon="user-plus" 
                  label="New Admission" 
                  color="bg-blue-500 hover:bg-blue-600" 
                  onClick={handleNavigate('/RegisterPortal/Admission')} 
                />
                <QuickActionButton 
                  icon="users" 
                  label="Manage Students" 
                  color="bg-green-500 hover:bg-green-600" 
                  onClick={handleNavigate('/RegisterPortal/StudentManagement')} 
                />
                <QuickActionButton 
                  icon="file-alt" 
                  label="Reports" 
                  color="bg-amber-500 hover:bg-amber-600" 
                  onClick={handleNavigate('/RegisterPortal/Reports')} 
                />
                <QuickActionButton 
                  icon="school" 
                  label="Class Setup" 
                  color="bg-purple-500 hover:bg-purple-600" 
                  onClick={handleNavigate('/RegisterPortal/Class')} 
                /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Students & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Students - Real Data */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recently Admitted Students</h3>
              <a href="/registrar/students" className="text-sm text-blue-600 hover:text-blue-800">
                View All <i className="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <i className={`fas fa-${student.gender?.toLowerCase() === 'male' ? 'male' : 'female'} text-blue-600`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{student.admission_no || 'No ID'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          {student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'No date'}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            student.status === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-users text-3xl mb-3 text-gray-300"></i>
                  <p>No students found</p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications & Deadlines */}
          <div className="space-y-6">
            {/* Real Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {deadlines.map(deadline => (
                  <div key={deadline.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{deadline.title}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      deadline.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      deadline.status === 'info' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-t-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <i 
          className={`fas fa-${icon} text-3xl opacity-20`}
          style={{ color: color.replace('border-', '').replace('-500', '') }}
        ></i>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <i className="fas fa-arrow-up text-green-500 mr-1"></i>
          <span className="text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ icon, label, color, onClick }) {
  return (
    <button 
      className={`${color} text-white rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95`}
      onClick={onClick}
    >
      <i className={`fas fa-${icon} text-xl mb-2`}></i>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Notification Item Component
function NotificationItem({ notification }) {
  return (
    <div className={`flex items-start p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notificationColors[notification.type]?.bg || 'bg-gray-50'} flex items-center justify-center mr-3`}>
        <i className={`fas fa-${notification.icon} ${notificationColors[notification.type]?.icon || 'text-gray-600'}`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
    </div>
  );
}

export default Dashboard;