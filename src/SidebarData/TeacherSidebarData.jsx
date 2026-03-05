import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

export const TeacherSidebarData = [
  
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/TeacherPortal/Dashboard"
  },
  {
    title: "Competency Matrix",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/CompetencyMatrix"
  },
  {
    title: "Mark Entry",
    icon: <MonetizationOnIcon />,
    link: "/TeacherPortal/MarkEntry"
  },
  {
    title: "Portfolio",
    icon: <DescriptionIcon />,
    link: "/TeacherPortal/Portfolio"
  },
  {
    title: "Termly Summary",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/TermlySummary"
  },
  {
    title: "Analytics",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/Analytics"
  },
  {
    title: "Report Card",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/ReportCard"
  },
  {
    title: "KNEC Export",
    icon: <ReceiptIcon />,
    link: "/TeacherPortal/KnecExport"
  },
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{color:'white',fontSize:30}}/>,
    link: "/Login"
  },
];

export default TeacherSidebarData;