import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { MessageCircle } from 'lucide-react';
import { PenBoxIcon,GraduationCapIcon } from 'lucide-react';

const DeputyPrincipalSidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/DeputyPortal/Dashboard"
    },
    
    {
        title: "Discipline",
        icon: <GraduationCapIcon />,
        link: "/DeputyPortal/Discipline"
    },
    // {
    //     title: "Attendance",
    //     icon: <MonetizationOnIcon />,
    //     link: "/DeputyPortal/Attendance"
    // },
    {
        title: "Messages",
        icon: <MessageCircle />,
        link: "/DeputyPortal/Messages"
    },
    {
        title: "Assign Teacher",
        icon: <PenBoxIcon />,
        link: "/DeputyPortal/Assignments"
    },
    {
        title: "LogOut",
        icon: <LogoutIcon sx={{color:'red',fontSize:30}}/>,
        link: "/Logout"
    },
    
];

export default DeputyPrincipalSidebarData;