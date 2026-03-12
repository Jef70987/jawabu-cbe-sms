import React from 'react';
import {
  LayoutDashboard,
  Gavel,
  Users,
  AlertTriangle,
  UserX,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Heart,
  Clock,
  ClipboardList,
  BookOpen,
  Award,
  TrendingUp,
  UserCheck,
  Shield
} from 'lucide-react';

export const DeputyPrincipalSidebarData = [
  {
    title: "Dashboard",
    path: "/deputy/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "deputy_principal"
  },
  {
    title: "Discipline",
    path: "/deputy/discipline",
    icon: <Gavel size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Cases", path: "/deputy/discipline/cases" },
      { title: "New Case", path: "/deputy/discipline/new" },
      { title: "Active Cases", path: "/deputy/discipline/active" },
      { title: "Hearings", path: "/deputy/discipline/hearings" },
      { title: "Appeals", path: "/deputy/discipline/appeals" },
      { title: "Resolved Cases", path: "/deputy/discipline/resolved" }
    ]
  },
  {
    title: "Student Affairs",
    path: "/deputy/student-affairs",
    icon: <Users size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Students", path: "/deputy/student-affairs/all" },
      { title: "Student Conduct", path: "/deputy/student-affairs/conduct" },
      { title: "Welfare", path: "/deputy/student-affairs/welfare" },
      { title: "Activities", path: "/deputy/student-affairs/activities" },
      { title: "Clubs & Societies", path: "/deputy/student-affairs/clubs" },
      { title: "Student Leaders", path: "/deputy/student-affairs/leaders" }
    ]
  },
  {
    title: "Conduct Records",
    path: "/deputy/conduct",
    icon: <ClipboardList size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Records", path: "/deputy/conduct/all" },
      { title: "Merit Points", path: "/deputy/conduct/merits" },
      { title: "Demerit Points", path: "/deputy/conduct/demerits" },
      { title: "Incident History", path: "/deputy/conduct/history" },
      { title: "Behavior Trends", path: "/deputy/conduct/trends" }
    ]
  },
  {
    title: "Suspensions",
    path: "/deputy/suspensions",
    icon: <UserX size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Active Suspensions", path: "/deputy/suspensions/active" },
      { title: "In-School", path: "/deputy/suspensions/in-school" },
      { title: "Out-of-School", path: "/deputy/suspensions/out-school" },
      { title: "History", path: "/deputy/suspensions/history" },
      { title: "Appeals", path: "/deputy/suspensions/appeals" },
      { title: "Review Board", path: "/deputy/suspensions/review" }
    ]
  },
  {
    title: "Counseling",
    path: "/deputy/counseling",
    icon: <Heart size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Sessions", path: "/deputy/counseling/sessions" },
      { title: "Schedule", path: "/deputy/counseling/schedule" },
      { title: "Counselors", path: "/deputy/counseling/counselors" },
      { title: "Resources", path: "/deputy/counseling/resources" },
      { title: "Referrals", path: "/deputy/counseling/referrals" },
      { title: "Reports", path: "/deputy/counseling/reports" }
    ]
  },
  {
    title: "Case Reports",
    path: "/deputy/case-reports",
    icon: <FileText size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Daily Reports", path: "/deputy/case-reports/daily" },
      { title: "Weekly Summary", path: "/deputy/case-reports/weekly" },
      { title: "Monthly Analysis", path: "/deputy/case-reports/monthly" },
      { title: "Quarterly Review", path: "/deputy/case-reports/quarterly" },
      { title: "Annual Report", path: "/deputy/case-reports/annual" },
      { title: "Custom Reports", path: "/deputy/case-reports/custom" }
    ]
  },
  {
    title: "Statistics",
    path: "/deputy/statistics",
    icon: <BarChart3 size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Discipline Stats", path: "/deputy/statistics/discipline" },
      { title: "Trend Analysis", path: "/deputy/statistics/trends" },
      { title: "Comparative Analysis", path: "/deputy/statistics/comparative" },
      { title: "Demographics", path: "/deputy/statistics/demographics" },
      { title: "Predictive Analytics", path: "/deputy/statistics/predictive" }
    ]
  },
  {
    title: "Interventions",
    path: "/deputy/interventions",
    icon: <Shield size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Behavior Plans", path: "/deputy/interventions/plans" },
      { title: "Mentoring", path: "/deputy/interventions/mentoring" },
      { title: "Peer Mediation", path: "/deputy/interventions/mediation" },
      { title: "Restorative Justice", path: "/deputy/interventions/restorative" },
      { title: "Follow-ups", path: "/deputy/interventions/followups" }
    ]
  },
  {
    title: "Calendar",
    path: "/deputy/calendar",
    icon: <Calendar size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Hearings", path: "/deputy/calendar/hearings" },
      { title: "Meetings", path: "/deputy/calendar/meetings" },
      { title: "Counseling Sessions", path: "/deputy/calendar/counseling" },
      { title: "Deadlines", path: "/deputy/calendar/deadlines" }
    ]
  },
  {
    title: "Notifications",
    path: "/deputy/notifications",
    icon: <Bell size={20} />,
    role: "deputy_principal",
    badge: 5
  },
  {
    title: "Settings",
    path: "/deputy/settings",
    icon: <Settings size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Profile", path: "/deputy/settings/profile" },
      { title: "Notifications", path: "/deputy/settings/notifications" },
      { title: "Preferences", path: "/deputy/settings/preferences" },
      { title: "Security", path: "/deputy/settings/security" },
      { title: "Discipline Settings", path: "/deputy/settings/discipline" }
    ]
  }
];