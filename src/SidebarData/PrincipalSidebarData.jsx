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
    path: "/principal/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "principal"
  },
  {
    title: "Overview",
    path: "/principal/overview",
    icon: <PieChart size={20} />,
    role: "principal"
  },
  {
    title: "Staff Management",
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
    ]
  },
  {
    title: "Students",
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
    ]
  },
  {
    title: "Academic",
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
    ]
  },
  {
    title: "Finance",
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
    ]
  },
  {
    title: "Discipline",
    path: "/principal/discipline",
    icon: <AlertTriangle size={20} />,
    role: "principal",
    submenu: [
      { title: "Cases", path: "/principal/discipline/cases" },
      { title: "Suspensions", path: "/principal/discipline/suspensions" },
      { title: "Statistics", path: "/principal/discipline/statistics" },
      { title: "Appeals", path: "/principal/discipline/appeals" }
    ]
  },
  {
    title: "Reports",
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
    ]
  },
  {
    title: "Analytics",
    path: "/principal/analytics",
    icon: <TrendingUp size={20} />,
    role: "principal",
    submenu: [
      { title: "Performance Trends", path: "/principal/analytics/trends" },
      { title: "Comparative Analysis", path: "/principal/analytics/comparative" },
      { title: "Predictive Analytics", path: "/principal/analytics/predictive" },
      { title: "Data Visualization", path: "/principal/analytics/visualization" }
    ]
  },
  {
    title: "Calendar",
    path: "/principal/calendar",
    icon: <Calendar size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Calendar", path: "/principal/calendar/academic" },
      { title: "Events", path: "/principal/calendar/events" },
      { title: "Meetings", path: "/principal/calendar/meetings" },
      { title: "Holidays", path: "/principal/calendar/holidays" }
    ]
  },
  {
    title: "Notifications",
    path: "/principal/notifications",
    icon: <Bell size={20} />,
    role: "principal",
    badge: 8
  },
  {
    title: "Settings",
    path: "/principal/settings",
    icon: <Settings size={20} />,
    role: "principal",
    submenu: [
      { title: "Profile", path: "/principal/settings/profile" },
      { title: "School Info", path: "/principal/settings/school" },
      { title: "Preferences", path: "/principal/settings/preferences" },
      { title: "Security", path: "/principal/settings/security" },
      { title: "System", path: "/principal/settings/system" }
    ]
  }
];