import React from 'react';
// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';

// Lucide Icons
import { 
  BellDotIcon, 
  BookOpenIcon, 
  CameraIcon, 
  HomeIcon, 
  LineChartIcon, 
  PenBoxIcon, 
  TimerIcon, 
  ClipboardCheckIcon,
  LayoutGridIcon
} from 'lucide-react';

const TeacherSidebarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/TeacherPortal/Dashboard"
  },
  {
    title: "Class Profile/attendance",
    icon: <HomeIcon />,
    link: "/TeacherPortal/ClassProfile"
  },

  /* --- SECTION: DAILY OPERATIONS --- */
  {
    title: "Subject-Attendance",
    icon: <ClipboardCheckIcon />, 
    link: "/TeacherPortal/Attendance"
  },
  {
    title: "Curriculum",
    icon: <BookOpenIcon />,
    link: "/TeacherPortal/Curriculum"
  },
  /* --- SECTION: CBA & GRADING (The Hub) --- */
  {
    title: "Assessment Manager", // 4-Point Scale (PP1-G6)
    icon: <DescriptionIcon />,
    link: "/TeacherPortal/AssessmentManager"
  },
 // {
 //   title: "JSS Mark Entry", // 8-Point Scale (G7-G9)
 //   icon: <PenBoxIcon />,
 //   link: "/TeacherPortal/MarkEntry"
 // },
  {
    title: "Competency Matrix",
    icon: <LayoutGridIcon />, // Visualizes student skill gaps
    link: "/TeacherPortal/CompetencyMatrix"
  },
  {
    title: "Digital Portfolio",
    icon: <CameraIcon />, // For uploading student evidence
    link: "/TeacherPortal/Portfolio"
  },
  // {
  //   title: "Timetable",
  //   icon: <TimerIcon />,
  //   link: "/TeacherPortal/Timetable"
  // },

  /* --- SECTION: RESULTS & UPDATES --- */
  {
    title: "Exams",
    icon: <DescriptionIcon />,
    link: "/TeacherPortal/Exams"
  },
  // {
  //   title: "Analytics",
  //   icon: <LineChartIcon />,
  //   link: "/TeacherPortal/Analytics"
  // },
  

  /* --- SECTION: ACCOUNT --- */
  // {
  //   title: "Settings",
  //   icon: <SettingsIcon />,
  //   link: "/TeacherPortal/Settings"
  // },
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{ color: '#ef4444', fontSize: 28 }} />,
    link: "/Logout"
  },
];

export default TeacherSidebarData;