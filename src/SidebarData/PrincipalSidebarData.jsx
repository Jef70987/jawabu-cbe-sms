import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap,
  DollarSign,
  BarChart3,
  BookOpen,
  Settings,
  Calendar,
  Bell,
  FileText,
  AlertTriangle,
  Award,
  PieChart,
  TrendingUp,
  UserCheck,
  Clock
} from 'lucide-react';

export const PrincipalSidebarData = [
  {
    title: "Dashboard",
<<<<<<< HEAD
    path: "/PrincipalPortal/dashboard",
=======
    path: "/principal/dashboard",
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    icon: <LayoutDashboard size={20} />,
    role: "principal"
  },
  {
    title: "Overview",
<<<<<<< HEAD
    path: "/PrincipalPortal/overview",
=======
    path: "/principal/overview",
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    icon: <PieChart size={20} />,
    role: "principal"
  },
  {
    title: "Staff Management",
<<<<<<< HEAD
    path: "/PrincipalPortal/staff",
    icon: <Users size={20} />,
    role: "principal",
    submenu: [
      { title: "All Staff", path: "/PrincipalPortal/staff/all" },
      { title: "Faculty", path: "/PrincipalPortal/staff/faculty" },
      { title: "Administrative", path: "/PrincipalPortal/staff/admin" },
      { title: "Departments", path: "/PrincipalPortal/staff/departments" },
      { title: "Performance", path: "/PrincipalPortal/staff/performance" },
      { title: "Attendance", path: "/PrincipalPortal/staff/attendance" }
=======
    path: "/principal/staff",
    icon: <Users size={20} />,
    role: "principal",
    submenu: [
      { title: "All Staff", path: "/principal/staff/all" },
      { title: "Faculty", path: "/principal/staff/faculty" },
      { title: "Administrative", path: "/principal/staff/admin" },
      { title: "Departments", path: "/principal/staff/departments" },
      { title: "Performance", path: "/principal/staff/performance" },
      { title: "Attendance", path: "/principal/staff/attendance" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Students",
<<<<<<< HEAD
    path: "/PrincipalPortal/students",
    icon: <GraduationCap size={20} />,
    role: "principal",
    submenu: [
      { title: "All Students", path: "/PrincipalPortal/students/all" },
      { title: "Enrollment", path: "/PrincipalPortal/students/enrollment" },
      { title: "Performance", path: "/PrincipalPortal/students/performance" },
      { title: "Attendance", path: "/PrincipalPortal/students/attendance" },
      { title: "Graduation", path: "/PrincipalPortal/students/graduation" },
      { title: "Achievements", path: "/PrincipalPortal/students/achievements" }
=======
    path: "/principal/students",
    icon: <GraduationCap size={20} />,
    role: "principal",
    submenu: [
      { title: "All Students", path: "/principal/students/all" },
      { title: "Enrollment", path: "/principal/students/enrollment" },
      { title: "Performance", path: "/principal/students/performance" },
      { title: "Attendance", path: "/principal/students/attendance" },
      { title: "Graduation", path: "/principal/students/graduation" },
      { title: "Achievements", path: "/principal/students/achievements" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Academic",
<<<<<<< HEAD
    path: "/PrincipalPortal/academic",
    icon: <BookOpen size={20} />,
    role: "principal",
    submenu: [
      { title: "Overview", path: "/PrincipalPortal/academic/overview" },
      { title: "Curriculum", path: "/PrincipalPortal/academic/curriculum" },
      { title: "Courses", path: "/PrincipalPortal/academic/courses" },
      { title: "Examinations", path: "/PrincipalPortal/academic/exams" },
      { title: "Results", path: "/PrincipalPortal/academic/results" },
      { title: "Timetable", path: "/PrincipalPortal/academic/timetable" }
=======
    path: "/principal/academic",
    icon: <BookOpen size={20} />,
    role: "principal",
    submenu: [
      { title: "Overview", path: "/principal/academic/overview" },
      { title: "Curriculum", path: "/principal/academic/curriculum" },
      { title: "Courses", path: "/principal/academic/courses" },
      { title: "Examinations", path: "/principal/academic/exams" },
      { title: "Results", path: "/principal/academic/results" },
      { title: "Timetable", path: "/principal/academic/timetable" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Finance",
<<<<<<< HEAD
    path: "/PrincipalPortal/finance",
    icon: <DollarSign size={20} />,
    role: "principal",
    submenu: [
      { title: "Overview", path: "/PrincipalPortal/finance/overview" },
      { title: "Budget", path: "/PrincipalPortal/finance/budget" },
      { title: "Revenue", path: "/PrincipalPortal/finance/revenue" },
      { title: "Expenses", path: "/PrincipalPortal/finance/expenses" },
      { title: "Payroll", path: "/PrincipalPortal/finance/payroll" },
      { title: "Reports", path: "/PrincipalPortal/finance/reports" }
=======
    path: "/principal/finance",
    icon: <DollarSign size={20} />,
    role: "principal",
    submenu: [
      { title: "Overview", path: "/principal/finance/overview" },
      { title: "Budget", path: "/principal/finance/budget" },
      { title: "Revenue", path: "/principal/finance/revenue" },
      { title: "Expenses", path: "/principal/finance/expenses" },
      { title: "Payroll", path: "/principal/finance/payroll" },
      { title: "Reports", path: "/principal/finance/reports" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Discipline",
<<<<<<< HEAD
    path: "/PrincipalPortal/discipline",
    icon: <AlertTriangle size={20} />,
    role: "principal",
    submenu: [
      { title: "Cases", path: "/PrincipalPortal/discipline/cases" },
      { title: "Suspensions", path: "/PrincipalPortal/discipline/suspensions" },
      { title: "Statistics", path: "/PrincipalPortal/discipline/statistics" },
      { title: "Appeals", path: "/PrincipalPortal/discipline/appeals" }
=======
    path: "/principal/discipline",
    icon: <AlertTriangle size={20} />,
    role: "principal",
    submenu: [
      { title: "Cases", path: "/principal/discipline/cases" },
      { title: "Suspensions", path: "/principal/discipline/suspensions" },
      { title: "Statistics", path: "/principal/discipline/statistics" },
      { title: "Appeals", path: "/principal/discipline/appeals" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Reports",
<<<<<<< HEAD
    path: "/PrincipalPortal/reports",
    icon: <BarChart3 size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Reports", path: "/PrincipalPortal/reports/academic" },
      { title: "Financial Reports", path: "/PrincipalPortal/reports/financial" },
      { title: "Staff Reports", path: "/PrincipalPortal/reports/staff" },
      { title: "Student Reports", path: "/PrincipalPortal/reports/students" },
      { title: "Annual Reports", path: "/PrincipalPortal/reports/annual" },
      { title: "Custom Reports", path: "/PrincipalPortal/reports/custom" }
=======
    path: "/principal/reports",
    icon: <BarChart3 size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Reports", path: "/principal/reports/academic" },
      { title: "Financial Reports", path: "/principal/reports/financial" },
      { title: "Staff Reports", path: "/principal/reports/staff" },
      { title: "Student Reports", path: "/principal/reports/students" },
      { title: "Annual Reports", path: "/principal/reports/annual" },
      { title: "Custom Reports", path: "/principal/reports/custom" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Analytics",
<<<<<<< HEAD
    path: "/PrincipalPortal/analytics",
    icon: <TrendingUp size={20} />,
    role: "principal",
    submenu: [
      { title: "Performance Trends", path: "/PrincipalPortal/analytics/trends" },
      { title: "Comparative Analysis", path: "/PrincipalPortal/analytics/comparative" },
      { title: "Predictive Analytics", path: "/PrincipalPortal/analytics/predictive" },
      { title: "Data Visualization", path: "/PrincipalPortal/analytics/visualization" }
=======
    path: "/principal/analytics",
    icon: <TrendingUp size={20} />,
    role: "principal",
    submenu: [
      { title: "Performance Trends", path: "/principal/analytics/trends" },
      { title: "Comparative Analysis", path: "/principal/analytics/comparative" },
      { title: "Predictive Analytics", path: "/principal/analytics/predictive" },
      { title: "Data Visualization", path: "/principal/analytics/visualization" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Calendar",
<<<<<<< HEAD
    path: "/PrincipalPortal/calendar",
    icon: <Calendar size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Calendar", path: "/PrincipalPortal/calendar/academic" },
      { title: "Events", path: "/PrincipalPortal/calendar/events" },
      { title: "Meetings", path: "/PrincipalPortal/calendar/meetings" },
      { title: "Holidays", path: "/PrincipalPortal/calendar/holidays" }
=======
    path: "/principal/calendar",
    icon: <Calendar size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Calendar", path: "/principal/calendar/academic" },
      { title: "Events", path: "/principal/calendar/events" },
      { title: "Meetings", path: "/principal/calendar/meetings" },
      { title: "Holidays", path: "/principal/calendar/holidays" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Notifications",
<<<<<<< HEAD
    path: "/PrincipalPortal/notifications",
=======
    path: "/principal/notifications",
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    icon: <Bell size={20} />,
    role: "principal",
    badge: 8
  },
  {
    title: "Settings",
<<<<<<< HEAD
    path: "/PrincipalPortal/settings",
    icon: <Settings size={20} />,
    role: "principal",
    submenu: [
      { title: "Profile", path: "/PrincipalPortal/settings/profile" },
      { title: "School Info", path: "/PrincipalPortal/settings/school" },
      { title: "Preferences", path: "/PrincipalPortal/settings/preferences" },
      { title: "Security", path: "/PrincipalPortal/settings/security" },
      { title: "System", path: "/PrincipalPortal/settings/system" }
=======
    path: "/principal/settings",
    icon: <Settings size={20} />,
    role: "principal",
    submenu: [
      { title: "Profile", path: "/principal/settings/profile" },
      { title: "School Info", path: "/principal/settings/school" },
      { title: "Preferences", path: "/principal/settings/preferences" },
      { title: "Security", path: "/principal/settings/security" },
      { title: "System", path: "/principal/settings/system" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  }
];