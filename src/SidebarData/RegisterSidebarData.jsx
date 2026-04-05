import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { BookIcon } from 'lucide-react';

const RegisterSidebarData = [
  
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/RegisterPortal/Dashboard"
  },
  {
    title: "Academic",
    icon: < BookIcon/>,
    link: "/RegisterPortal/academic"
  },
  {
    title: "Exam & Report Mngmnt",
    icon: <BarChartIcon />,
    link: "/RegisterPortal/ExamAndReportManagement"
  },
  {
    title: "Admission",
    icon: <SchoolIcon />,
    link: "/RegisterPortal/Admission"
  },
  {
    title: "Student Mngmnt",
    icon: <PeopleIcon />,
    link: "/RegisterPortal/StudentManagement"
  },
  {
    title: "Class",
    icon: < HomeIcon/>,
    link: "/RegisterPortal/class"
  },
  {
    title: "Report Card",
    icon: <ReceiptIcon />,
    link: "/RegisterPortal/ReportCard"
  },
  {
    title: "LogOut",
    icon: <LogoutIcon sx={{color:'red',fontSize:30}}/>,
    link: "/Logout"
  },
  
];

export default RegisterSidebarData;