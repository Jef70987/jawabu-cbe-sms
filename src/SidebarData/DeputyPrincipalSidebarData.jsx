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
import LogoutIcon from '@mui/icons-material/Logout';

export const DeputyPrincipalSidebarData = [
  {
    title: "Dashboard",
    path: "/DeputyPortal/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "deputy_principal"
  },
  {
    title: "Discipline",
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
    ]
  },
  {
    title: "Student Affairs",
    path: "/DeputyPortal/student-affairs/*",
    icon: <Users size={20} />,
    role: "deputy_principal",
    submenu: [
      // { title: "All Students", path: "/DeputyPortal/student-affairs/all" },
      // { title: "Student Conduct", path: "/DeputyPortal/student-affairs/conduct" },
      // { title: "Welfare", path: "/DeputyPortal/student-affairs/welfare" },
      { title: "Activities", path: "/DeputyPortal/student-affairs/activities" },
      { title: "Clubs & Societies", path: "/DeputyPortal/student-affairs/clubs" },
      // { title: "Student Leaders", path: "/DeputyPortal/student-affairs/leaders" }
    ]
  },
  // {
  //   title: "Conduct Records",
  //   path: "/DeputyPortal/conduct",
  //   icon: <ClipboardList size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "All Records", path: "/DeputyPortal/conduct/all" },
  //     { title: "Merit Points", path: "/DeputyPortal/conduct/merits" },
  //     { title: "Demerit Points", path: "/DeputyPortal/conduct/demerits" },
  //     { title: "Incident History", path: "/DeputyPortal/conduct/history" },
  //     { title: "Behavior Trends", path: "/DeputyPortal/conduct/trends" }
  //   ]
  // },
  // {
  //   title: "Suspensions",
  //   path: "/DeputyPortal/suspensions",
  //   icon: <UserX size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "Active Suspensions", path: "/DeputyPortal/suspensions/active" },
  //     { title: "In-School", path: "/DeputyPortal/suspensions/in-school" },
  //     { title: "Out-of-School", path: "/DeputyPortal/suspensions/out-school" },
  //     { title: "History", path: "/DeputyPortal/suspensions/history" },
  //     { title: "Appeals", path: "/DeputyPortal/suspensions/appeals" },
  //     { title: "Review Board", path: "/DeputyPortal/suspensions/review" }
  //   ]
  // },
  // {
  //   title: "Counseling",
  //   path: "/DeputyPortal/counseling",
  //   icon: <Heart size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "Sessions", path: "/DeputyPortal/counseling/sessions" },
  //     { title: "Schedule", path: "/DeputyPortal/counseling/schedule" },
  //     { title: "Counselors", path: "/DeputyPortal/counseling/counselors" },
  //     { title: "Resources", path: "/DeputyPortal/counseling/resources" },
  //     { title: "Referrals", path: "/DeputyPortal/counseling/referrals" },
  //     { title: "Reports", path: "/DeputyPortal/counseling/reports" }
  //   ]
  // },
  // {
  //   title: "Case Reports",
  //   path: "/DeputyPortal/case-reports",
  //   icon: <FileText size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "Daily Reports", path: "/DeputyPortal/case-reports/daily" },
  //     { title: "Weekly Summary", path: "/DeputyPortal/case-reports/weekly" },
  //     { title: "Monthly Analysis", path: "/DeputyPortal/case-reports/monthly" },
  //     { title: "Quarterly Review", path: "/DeputyPortal/case-reports/quarterly" },
  //     { title: "Annual Report", path: "/DeputyPortal/case-reports/annual" },
  //     { title: "Custom Reports", path: "/DeputyPortal/case-reports/custom" }
  //   ]
  // },
  {
    title: "Statistics",
    path: "/DeputyPortal/statistics",
    icon: <BarChart3 size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Discipline Stats", path: "/DeputyPortal/statistics/discipline" },
      // { title: "Trend Analysis", path: "/DeputyPortal/statistics/trends" },
      // { title: "Comparative Analysis", path: "/DeputyPortal/statistics/comparative" },
      // { title: "Demographics", path: "/DeputyPortal/statistics/demographics" },
      // { title: "Predictive Analytics", path: "/DeputyPortal/statistics/predictive" }
    ]
  },
  // {
  //   title: "Interventions",

  //   path: "/DeputyPortal/interventions",
  //   icon: <Shield size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "Behavior Plans", path: "/DeputyPortal/interventions/plans" },
  //     { title: "Mentoring", path: "/DeputyPortal/interventions/mentoring" },
  //     { title: "Peer Mediation", path: "/DeputyPortal/interventions/mediation" },
  //     { title: "Restorative Justice", path: "/DeputyPortal/interventions/restorative" },
  //     { title: "Follow-ups", path: "/DeputyPortal/interventions/followups" },
  //   ]
  // },
 
  // {
  //   title: "Calendar",
  //   path: "/DeputyPortal/calendar",
  //   icon: <Calendar size={20} />,
  //   role: "deputy_principal",
  //   submenu: [
  //     { title: "Hearings", path: "/DeputyPortal/calendar/hearings" },
  //     { title: "Meetings", path: "/DeputyPortal/calendar/meetings" },
  //     { title: "Counseling Sessions", path: "/DeputyPortal/calendar/counseling" },
  //     { title: "Deadlines", path: "/DeputyPortal/calendar/deadlines" }
  //   ]
  // },
  {
    title: "Notifications",
    path: "/DeputyPortal/notifications",
    icon: <Bell size={20} />,
    role: "deputy_principal",
    badge: 5
  },
  {
    title: "Settings",
    path: "/DeputyPortal/settings",
    icon: <Settings size={20} />,
    role: "deputy_principal",
    submenu: [
      { title: "Profile", path: "/DeputyPortal/settings/profile" },
      // { title: "Notifications", path: "/DeputyPortal/settings/notifications" },
      // { title: "Preferences", path: "/DeputyPortal/settings/preferences" },
      // { title: "Security", path: "/DeputyPortal/settings/security" },
      // { title: "Discipline Settings", path: "/DeputyPortal/settings/discipline" }
    ]
  },
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{color:'red',fontSize:30}}/>,
    link: "/Logout"
  },
];