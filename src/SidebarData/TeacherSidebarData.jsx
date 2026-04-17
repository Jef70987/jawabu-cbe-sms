import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { BellDotIcon, CameraIcon,HomeIcon, LineChartIcon, PenBoxIcon } from 'lucide-react';

const TeacherSidebarData = [
  
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/TeacherPortal/Dashboard"
  },
   {
    title: "Analytics",
    icon: <LineChartIcon />,
    link: "/TeacherPortal/Analytics"
  },
  {
    title: "Class Profile",
    icon: <HomeIcon />,
    link: "/TeacherPortal/ClassProfile"
  },
  {
    title: "Competency Matrix",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/CompetencyMatrix"
  },
  {
    title: "Mark Entry",
    icon: <PenBoxIcon />,
    link: "/TeacherPortal/MarkEntry"
  },
  {
    title: "Portfolio",
    icon: <CameraIcon />,
    link: "/TeacherPortal/Portfolio"
  },
  {
    title: "Assessment",
    icon: <DescriptionIcon />,
    link: "/TeacherPortal/AssessmentManager"
  },
  {
    title: "Notifications",
    icon: <BellDotIcon />,
    link: "/TeacherPortal/Notifications"
  },
  
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{color:'red',fontSize:30}}/>,
    link: "/Logout"
  },
];

export default TeacherSidebarData;