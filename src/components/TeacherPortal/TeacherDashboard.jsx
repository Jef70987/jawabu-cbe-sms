/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, CheckSquare, FileText, TrendingUp, 
  AlertCircle, CheckCircle, X, Loader2, Bell, BookOpen, 
  Award, Target, Activity, UserCheck, ClipboardList, 
  ChevronRight, RefreshCw, GraduationCap, BarChart3
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import { Link } from 'react-router-dom';
// import { NotificationBell } from '../CommonService/NotificationBell';
import { useNavigate } from 'react-router-dom';
// export const TeacherLayout = ({ children }) => {
//   return (
//     <div>
//       <nav>
//         <NotificationBell portal="teacher" className="h-4 w-4 inline mr-2 font-bold text-red-500" /> 
//       </nav>
//       {children}
//     </div>
//   );
// };
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${styles[type]} border p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    timetable: [],
    pendingTasks: [],
    attendanceStats: {},
    classInfo: null,
    upcomingEvents: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('error', 'Please login to access dashboard');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teacher/dashboard/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        // Mock data for demo
        setDashboardData({
          timetable: [
            { id: 1, subject: 'Mathematics', time: '08:00 - 09:00', class: 'Grade 7A', room: 'Room 101', topic: 'Algebra' },
            { id: 2, subject: 'Mathematics', time: '09:00 - 10:00', class: 'Grade 7B', room: 'Room 101', topic: 'Algebra' },
            { id: 3, subject: 'Integrated Science', time: '11:00 - 12:00', class: 'Grade 7A', room: 'Lab 1', topic: 'Cell Structure' },
            { id: 4, subject: 'Mathematics', time: '14:00 - 15:00', class: 'Grade 7C', room: 'Room 101', topic: 'Geometry' }
          ],
          pendingTasks: [
            { id: 1, title: 'Mark Mathematics CAT', count: 42, dueDate: '2024-03-20', type: 'marking' },
            { id: 2, title: 'Complete Competency Matrix', count: 38, dueDate: '2024-03-18', type: 'competency' },
            { id: 3, title: 'Upload Evidence for Projects', count: 15, dueDate: '2024-03-22', type: 'evidence' },
            { id: 4, title: 'Lesson Log Entry', count: 3, dueDate: '2024-03-17', type: 'lesson' }
          ],
          attendanceStats: {
            present: 38,
            absent: 4,
            late: 2,
            total: 44,
            percentage: 86
          },
          classInfo: {
            id: 1,
            name: 'Grade 7A',
            stream: 'A',
            subject: 'Mathematics',
            students: 44,
            classTeacher: 'Mr. John Otieno'
          },
          upcomingEvents: [
            { id: 1, title: 'Staff Meeting', date: '2024-03-19', time: '15:30' },
            { id: 2, title: 'Parent-Teacher Conference', date: '2024-03-25', time: '08:00' },
            { id: 3, title: 'End of Term Exams', date: '2024-04-01', time: '08:00' }
          ],
          recentActivity: [
            { id: 1, action: 'Completed marking for Grade 7A Mathematics', time: '2 hours ago', type: 'marking' },
            { id: 2, action: 'Uploaded 5 evidence items for Science project', time: 'Yesterday', type: 'evidence' },
            { id: 3, action: 'Updated competency matrix for 7B', time: 'Yesterday', type: 'competency' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      addNotification('error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'marking': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'competency': return <Target className="h-5 w-5 text-green-600" />;
      case 'evidence': return <CheckSquare className="h-5 w-5 text-purple-600" />;
      default: return <ClipboardList className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'marking': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'evidence': return <CheckSquare className="h-4 w-4 text-purple-600" />;
      case 'competency': return <Target className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access teacher dashboard</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.map(notification => (
        <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />
      ))}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className=" mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome back, {user?.first_name || 'Teacher'} {user?.last_name || ''}</p>
            </div>
            <div className="flex gap-3">
               <button 
                onClick={() => navigate('/TeacherPortal/Notifications')}
                className="px-4 py-2 bg-white text-red-700 text-sm font-bold border border-gray-300 hover:bg-gray-50"
              >
                Notifications
              </button>
              <button onClick={fetchDashboardData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Link to="/teacher/class" className="bg-white border border-gray-300 p-4 hover:bg-gray-50 block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Class</p>
                <p className="text-xl font-bold text-gray-900">{dashboardData.classInfo?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{dashboardData.classInfo?.students} Students</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border border-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Link>
          <Link to="/teacher/attendance" className="bg-white border border-gray-300 p-4 hover:bg-gray-50 block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Today</p>
                <p className="text-xl font-bold text-green-700">{dashboardData.attendanceStats?.percentage}%</p>
                <p className="text-xs text-gray-500 mt-1">{dashboardData.attendanceStats?.present} present / {dashboardData.attendanceStats?.total} total</p>
              </div>
              <div className="w-12 h-12 bg-green-100 flex items-center justify-center border border-green-200">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Link>
          <Link to="/teacher/tasks" className="bg-white border border-gray-300 p-4 hover:bg-gray-50 block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-xl font-bold text-orange-700">{dashboardData.pendingTasks?.reduce((sum, t) => sum + t.count, 0)}</p>
                <p className="text-xs text-gray-500 mt-1">{dashboardData.pendingTasks?.length} assignments</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 flex items-center justify-center border border-orange-200">
                <ClipboardList className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Link>
          <div className="bg-white border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Lessons</p>
                <p className="text-xl font-bold text-purple-700">{dashboardData.timetable?.length}</p>
                <p className="text-xs text-gray-500 mt-1">periods scheduled</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border border-purple-200">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timetable */}
          <div className="lg:col-span-2 bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Today's Timetable</h2>
              <Link to="/teacher/timetable" className="text-sm text-blue-600 hover:text-blue-800">View Full Schedule</Link>
            </div>
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                </div>
              ) : (
                dashboardData.timetable.map((lesson, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-bold text-gray-700">{lesson.time}</div>
                      <div>
                        <p className="font-medium text-gray-900">{lesson.subject}</p>
                        <p className="text-xs text-gray-500">{lesson.class} | {lesson.room}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{lesson.topic}</p>
                      </div>
                    </div>
                    <Link to={`/teacher/lesson-log?subject=${lesson.subject}&class=${lesson.class}`} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700">
                      Log Lesson
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Pending Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {dashboardData.pendingTasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    {getTaskIcon(task.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.count} items • Due {task.dueDate}</p>
                    </div>
                    <Link to={`/teacher/${task.type}`} className="text-blue-600 hover:text-blue-800">
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.upcomingEvents.map(event => (
                <div key={event.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.date} at {event.time}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-300">
            <div className="border-b border-gray-300 px-4 py-3 bg-gray-100">
              <h2 className="font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="p-4 flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <Link to="/teacher/assessment-builder" className="bg-white border border-gray-300 p-4 text-center hover:bg-gray-50">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900 text-sm">Create Assessment</p>
          </Link>
          <Link to="/teacher/mark-entry" className="bg-white border border-gray-300 p-4 text-center hover:bg-gray-50">
            <CheckSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900 text-sm">Mark Entry</p>
          </Link>
          <Link to="/teacher/competency-matrix" className="bg-white border border-gray-300 p-4 text-center hover:bg-gray-50">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900 text-sm">Competencies</p>
          </Link>
          <Link to="/teacher/evidence-vault" className="bg-white border border-gray-300 p-4 text-center hover:bg-gray-50">
            <CheckSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900 text-sm">Evidence Vault</p>
          </Link>
          <Link to="/teacher/class-analytics" className="bg-white border border-gray-300 p-4 text-center hover:bg-gray-50">
            <BarChart3 className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900 text-sm">Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;