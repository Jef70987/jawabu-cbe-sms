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
<<<<<<< HEAD
    path: "/DeputyPortal/dashboard",
=======
    path: "/deputy/dashboard",
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    icon: <LayoutDashboard size={20} />,
    role: "deputy_principal"
  },
  {
    title: "Discipline",
<<<<<<< HEAD
    path: "/DeputyPortal/discipline/*",
    icon: <Gavel size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Cases", path: "/DeputyPortal/discipline/cases" },
      { title: "New Case", path: "/DeputyPortal/discipline/new" },
      { title: "Active Cases", path: "/DeputyPortal/discipline/active" },
      { title: "Hearings", path: "/DeputyPortal/discipline/hearings" },
      { title: "Appeals", path: "/DeputyPortal/discipline/appeals" },
      { title: "Resolved Cases", path: "/DeputyPortal/discipline/resolved" }
=======
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
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Student Affairs",
<<<<<<< HEAD
    path: "/DeputyPortal/student-affairs/*",
    icon: <Users size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Students", path: "/DeputyPortal/student-affairs/all" },
      { title: "Student Conduct", path: "/DeputyPortal/student-affairs/conduct" },
      { title: "Welfare", path: "/DeputyPortal/student-affairs/welfare" },
      { title: "Activities", path: "/DeputyPortal/student-affairs/activities" },
      { title: "Clubs & Societies", path: "/DeputyPortal/student-affairs/clubs" },
      { title: "Student Leaders", path: "/DeputyPortal/student-affairs/leaders" }
=======
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
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Conduct Records",
<<<<<<< HEAD
    path: "/DeputyPortal/conduct",
    icon: <ClipboardList size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Records", path: "/DeputyPortal/conduct/all" },
      { title: "Merit Points", path: "/DeputyPortal/conduct/merits" },
      { title: "Demerit Points", path: "/DeputyPortal/conduct/demerits" },
      { title: "Incident History", path: "/DeputyPortal/conduct/history" },
      { title: "Behavior Trends", path: "/DeputyPortal/conduct/trends" }
=======
    path: "/deputy/conduct",
    icon: <ClipboardList size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "All Records", path: "/deputy/conduct/all" },
      { title: "Merit Points", path: "/deputy/conduct/merits" },
      { title: "Demerit Points", path: "/deputy/conduct/demerits" },
      { title: "Incident History", path: "/deputy/conduct/history" },
      { title: "Behavior Trends", path: "/deputy/conduct/trends" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Suspensions",
<<<<<<< HEAD
    path: "/DeputyPortal/suspensions",
    icon: <UserX size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Active Suspensions", path: "/DeputyPortal/suspensions/active" },
      { title: "In-School", path: "/DeputyPortal/suspensions/in-school" },
      { title: "Out-of-School", path: "/DeputyPortal/suspensions/out-school" },
      { title: "History", path: "/DeputyPortal/suspensions/history" },
      { title: "Appeals", path: "/DeputyPortal/suspensions/appeals" },
      { title: "Review Board", path: "/DeputyPortal/suspensions/review" }
=======
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
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Counseling",
<<<<<<< HEAD
    path: "/DeputyPortal/counseling",
    icon: <Heart size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Sessions", path: "/DeputyPortal/counseling/sessions" },
      { title: "Schedule", path: "/DeputyPortal/counseling/schedule" },
      { title: "Counselors", path: "/DeputyPortal/counseling/counselors" },
      { title: "Resources", path: "/DeputyPortal/counseling/resources" },
      { title: "Referrals", path: "/DeputyPortal/counseling/referrals" },
      { title: "Reports", path: "/DeputyPortal/counseling/reports" }
=======
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
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Case Reports",
<<<<<<< HEAD
    path: "/DeputyPortal/case-reports",
    icon: <FileText size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Daily Reports", path: "/DeputyPortal/case-reports/daily" },
      { title: "Weekly Summary", path: "/DeputyPortal/case-reports/weekly" },
      { title: "Monthly Analysis", path: "/DeputyPortal/case-reports/monthly" },
      { title: "Quarterly Review", path: "/DeputyPortal/case-reports/quarterly" },
      { title: "Annual Report", path: "/DeputyPortal/case-reports/annual" },
      { title: "Custom Reports", path: "/DeputyPortal/case-reports/custom" }
=======
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
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Statistics",
<<<<<<< HEAD
    path: "/DeputyPortal/statistics",
    icon: <BarChart3 size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Discipline Stats", path: "/DeputyPortal/statistics/discipline" },
      { title: "Trend Analysis", path: "/DeputyPortal/statistics/trends" },
      { title: "Comparative Analysis", path: "/DeputyPortal/statistics/comparative" },
      { title: "Demographics", path: "/DeputyPortal/statistics/demographics" },
      { title: "Predictive Analytics", path: "/DeputyPortal/statistics/predictive" }
=======
    path: "/deputy/statistics",
    icon: <BarChart3 size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Discipline Stats", path: "/deputy/statistics/discipline" },
      { title: "Trend Analysis", path: "/deputy/statistics/trends" },
      { title: "Comparative Analysis", path: "/deputy/statistics/comparative" },
      { title: "Demographics", path: "/deputy/statistics/demographics" },
      { title: "Predictive Analytics", path: "/deputy/statistics/predictive" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Interventions",
<<<<<<< HEAD
    path: "/DeputyPortal/interventions",
    icon: <Shield size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Behavior Plans", path: "/DeputyPortal/interventions/plans" },
      { title: "Mentoring", path: "/DeputyPortal/interventions/mentoring" },
      { title: "Peer Mediation", path: "/DeputyPortal/interventions/mediation" },
      { title: "Restorative Justice", path: "/DeputyPortal/interventions/restorative" },
      { title: "Follow-ups", path: "/DeputyPortal/interventions/followups" }
=======
    path: "/deputy/interventions",
    icon: <Shield size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Behavior Plans", path: "/deputy/interventions/plans" },
      { title: "Mentoring", path: "/deputy/interventions/mentoring" },
      { title: "Peer Mediation", path: "/deputy/interventions/mediation" },
      { title: "Restorative Justice", path: "/deputy/interventions/restorative" },
      { title: "Follow-ups", path: "/deputy/interventions/followups" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Calendar",
<<<<<<< HEAD
    path: "/DeputyPortal/calendar",
    icon: <Calendar size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Hearings", path: "/DeputyPortal/calendar/hearings" },
      { title: "Meetings", path: "/DeputyPortal/calendar/meetings" },
      { title: "Counseling Sessions", path: "/DeputyPortal/calendar/counseling" },
      { title: "Deadlines", path: "/DeputyPortal/calendar/deadlines" }
=======
    path: "/deputy/calendar",
    icon: <Calendar size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Hearings", path: "/deputy/calendar/hearings" },
      { title: "Meetings", path: "/deputy/calendar/meetings" },
      { title: "Counseling Sessions", path: "/deputy/calendar/counseling" },
      { title: "Deadlines", path: "/deputy/calendar/deadlines" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  },
  {
    title: "Notifications",
<<<<<<< HEAD
    path: "/DeputyPortal/notifications",
=======
    path: "/deputy/notifications",
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    icon: <Bell size={20} />,
    role: "deputy_principal",
    badge: 5
  },
  {
    title: "Settings",
<<<<<<< HEAD
    path: "/DeputyPortal/settings",
    icon: <Settings size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Profile", path: "/DeputyPortal/settings/profile" },
      { title: "Notifications", path: "/DeputyPortal/settings/notifications" },
      { title: "Preferences", path: "/DeputyPortal/settings/preferences" },
      { title: "Security", path: "/DeputyPortal/settings/security" },
      { title: "Discipline Settings", path: "/DeputyPortal/settings/discipline" }
=======
    path: "/deputy/settings",
    icon: <Settings size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Profile", path: "/deputy/settings/profile" },
      { title: "Notifications", path: "/deputy/settings/notifications" },
      { title: "Preferences", path: "/deputy/settings/preferences" },
      { title: "Security", path: "/deputy/settings/security" },
      { title: "Discipline Settings", path: "/deputy/settings/discipline" }
>>>>>>> a0c12f5acab9b8f5c7c998dd8abe0ff6f67aa55f
    ]
  }
];