import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// eslint-disable-next-line react-refresh/only-export-components
export const SidebarData = [
  
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/StudentPortal/Dashboard"
  },
  {
    title: "Academic",
    icon: <SchoolIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/AcademicRecord"
  },

  {
    title: "Learning",
    icon: <LibraryBooksIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/Learning"
  },
  {
    title: "Analytics",
    icon: <BarChartIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/CareerGuidance"
  },
  {
    title: "Chatbot",
    icon: <SmartToyIcon sx={{fontSize:30}} />,
    link: "/StudentPortal/bot"
  },
  
  {
    title: "ExtraCurriculumn",
    icon: <DescriptionIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/ExtraCurriculumn"
  },
  {
    title: "Finance",
    icon: <MonetizationOnIcon />,
    link: "/StudentPortal/FeeManagement"
  },

  {
    title: "Notices",
    icon: <EventIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/Notices"
  },
  {
    title: "Profile",
    icon: <PersonIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/StudentProfile"
  },
  {
    title: "Settings",
    icon: <SettingsIcon sx={{fontSize:30}} />,
    link: "/StudentPortal/Settings"
  },
  {
    title: "Help & Support",
    icon: <HelpIcon sx={{fontSize:30}}/>,
    link: "/StudentPortal/Help&Support"
  },
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{fontSize:30}}/>,
    link: "/Login"
  },
];

export default SidebarData;