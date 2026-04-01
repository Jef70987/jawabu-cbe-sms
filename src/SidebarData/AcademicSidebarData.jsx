import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Clock,
  Award,
  Settings,
  Bell,
  BookMarked,
  Library,
  TrendingUp,
  CheckSquare,
  ClipboardList,
  BookCheck,
  Presentation
} from 'lucide-react';

export const AcademicSidebarData = [
  {
    title: "Dashboard",
    path: "/academic/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "academic"
  },
  {
    title: "Curriculum",
    path: "/academic/curriculum",
    icon: <BookOpen size={20} />,
    role: "academic",
    submenu: [
      { title: "Overview", path: "/academic/curriculum/overview" },
      { title: "Curriculum Structure", path: "/academic/curriculum/structure" },
      { title: "Subject Mapping", path: "/academic/curriculum/subjects" },
      { title: "Learning Outcomes", path: "/academic/curriculum/outcomes" },
      { title: "Standards Alignment", path: "/academic/curriculum/standards" }
    ]
  },
  {
    title: "Courses",
    path: "/academic/courses",
    icon: <BookMarked size={20} />,
    role: "academic",
    submenu: [
      { title: "All Courses", path: "/academic/courses/all" },
      { title: "Course Catalog", path: "/academic/courses/catalog" },
      { title: "Course Registration", path: "/academic/courses/registration" },
      { title: "Prerequisites", path: "/academic/courses/prerequisites" },
      { title: "Electives", path: "/academic/courses/electives" }
    ]
  },
  {
    title: "Examinations",
    path: "/academic/examinations",
    icon: <ClipboardList size={20} />,
    role: "academic",
    submenu: [
      { title: "Exam Schedule", path: "/academic/examinations/schedule" },
      { title: "Exam Registration", path: "/academic/examinations/registration" },
      { title: "Question Papers", path: "/academic/examinations/papers" },
      { title: "Invigilation", path: "/academic/examinations/invigilation" },
      { title: "Results Processing", path: "/academic/examinations/processing" }
    ]
  },
  {
    title: "Results & Grades",
    path: "/academic/results",
    icon: <Award size={20} />,
    role: "academic",
    submenu: [
      { title: "Grade Management", path: "/academic/results/grades" },
      { title: "Transcripts", path: "/academic/results/transcripts" },
      { title: "Grade Analysis", path: "/academic/results/analysis" },
      { title: "Report Cards", path: "/academic/results/report-cards" },
      { title: "Merit List", path: "/academic/results/merit-list" }
    ]
  },
  {
    title: "Timetable",
    path: "/academic/timetable",
    icon: <Calendar size={20} />,
    role: "academic",
    submenu: [
      { title: "Master Timetable", path: "/academic/timetable/master" },
      { title: "Class Schedule", path: "/academic/timetable/class" },
      { title: "Teacher Schedule", path: "/academic/timetable/teacher" },
      { title: "Room Allocation", path: "/academic/timetable/rooms" },
      { title: "Period Management", path: "/academic/timetable/periods" }
    ]
  },
  {
    title: "Attendance",
    path: "/academic/attendance",
    icon: <Users size={20} />,
    role: "academic",
    submenu: [
      { title: "Student Attendance", path: "/academic/attendance/students" },
      { title: "Teacher Attendance", path: "/academic/attendance/teachers" },
      { title: "Attendance Reports", path: "/academic/attendance/reports" },
      { title: "Leave Management", path: "/academic/attendance/leave" }
    ]
  },
  {
    title: "Academic Reports",
    path: "/academic/reports",
    icon: <FileText size={20} />,
    role: "academic",
    submenu: [
      { title: "Performance Reports", path: "/academic/reports/performance" },
      { title: "Subject Analysis", path: "/academic/reports/subject" },
      { title: "Class Analysis", path: "/academic/reports/class" },
      { title: "Comparative Reports", path: "/academic/reports/comparative" },
      { title: "Custom Reports", path: "/academic/reports/custom" }
    ]
  },
  {
    title: "Analytics",
    path: "/academic/analytics",
    icon: <BarChart3 size={20} />,
    role: "academic",
    submenu: [
      { title: "Academic Trends", path: "/academic/analytics/trends" },
      { title: "Predictive Analysis", path: "/academic/analytics/predictive" },
      { title: "Student Performance", path: "/academic/analytics/performance" },
      { title: "Teacher Effectiveness", path: "/academic/analytics/teacher" }
    ]
  },
  {
    title: "Notifications",
    path: "/academic/notifications",
    icon: <Bell size={20} />,
    role: "academic",
    badge: 6
  },
  {
    title: "Settings",
    path: "/academic/settings",
    icon: <Settings size={20} />,
    role: "academic",
    submenu: [
      { title: "Academic Settings", path: "/academic/settings/academic" },
      { title: "Grading System", path: "/academic/settings/grading" },
      { title: "Exam Settings", path: "/academic/settings/exam" },
      { title: "Notifications", path: "/academic/settings/notifications" },
      { title: "Preferences", path: "/academic/settings/preferences" }
    ]
  }
];