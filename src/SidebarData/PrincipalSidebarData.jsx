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
    path: "/PrincipalPortal/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "principal"
  },
  {
    title: "Overview",
    path: "/PrincipalPortal/overview",
    icon: <PieChart size={20} />,
    role: "principal"
  },
  {
    title: "Staff Management",
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
    ]
  },
  {
    title: "Students",
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
    ]
  },
  {
    title: "Academic",
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
    ]
  },
  {
    title: "Finance",
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
    ]
  },
  {
    title: "Discipline",
    path: "/PrincipalPortal/discipline",
    icon: <AlertTriangle size={20} />,
    role: "principal",
    submenu: [
      { title: "Cases", path: "/PrincipalPortal/discipline/cases" },
      { title: "Suspensions", path: "/PrincipalPortal/discipline/suspensions" },
      { title: "Statistics", path: "/PrincipalPortal/discipline/statistics" },
      { title: "Appeals", path: "/PrincipalPortal/discipline/appeals" }
    ]
  },
  {
    title: "Reports",
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
    ]
  },
  {
    title: "Analytics",
    path: "/PrincipalPortal/analytics",
    icon: <TrendingUp size={20} />,
    role: "principal",
    submenu: [
      { title: "Performance Trends", path: "/PrincipalPortal/analytics/trends" },
      { title: "Comparative Analysis", path: "/PrincipalPortal/analytics/comparative" },
      { title: "Predictive Analytics", path: "/PrincipalPortal/analytics/predictive" },
      { title: "Data Visualization", path: "/PrincipalPortal/analytics/visualization" }
    ]
  },
  {
    title: "Calendar",
    path: "/PrincipalPortal/calendar",
    icon: <Calendar size={20} />,
    role: "principal",
    submenu: [
      { title: "Academic Calendar", path: "/PrincipalPortal/calendar/academic" },
      { title: "Events", path: "/PrincipalPortal/calendar/events" },
      { title: "Meetings", path: "/PrincipalPortal/calendar/meetings" },
      { title: "Holidays", path: "/PrincipalPortal/calendar/holidays" }
    ]
  },
  {
    title: "Notifications",
    path: "/PrincipalPortal/notifications",
    icon: <Bell size={20} />,
    role: "principal",
    badge: 8
  },
  {
    title: "Settings",
    path: "/PrincipalPortal/settings",
    icon: <Settings size={20} />,
    role: "principal",
    submenu: [
      { title: "Profile", path: "/PrincipalPortal/settings/profile" },
      { title: "School Info", path: "/PrincipalPortal/settings/school" },
      { title: "Preferences", path: "/PrincipalPortal/settings/preferences" },
      { title: "Security", path: "/PrincipalPortal/settings/security" },
      { title: "System", path: "/PrincipalPortal/settings/system" }
    ]
  }
];