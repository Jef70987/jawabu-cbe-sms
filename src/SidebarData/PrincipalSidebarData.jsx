import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap,
  DollarSign,
  BarChart3,
  BookOpen,
  Settings,
  Calendar,
  Bell,
  FileText,
  AlertTriangle,
  Award,
  PieChart,
  TrendingUp,
  UserCheck,
  Clock,
  MessageCircle
} from 'lucide-react';
import LogoutIcon from '@mui/icons-material/Logout';
export const PrincipalSidebarData = [
  {
    title: "Dashboard",
    path: "/PrincipalPortal/dashboard",
    icon: <LayoutDashboard size={20} />,
    role: "principal"
  },
  {
    title: "Students",
    path: "/PrincipalPortal/students",
    icon: <GraduationCap size={20} />,
    role: "principal",
    submenu: [
      { title: "All Students", path: "/PrincipalPortal/students/all" },
    ]
  },

  {
    title: "Finance",
    path: "/PrincipalPortal/finance",
    icon: <DollarSign size={20} />,
    role: "principal",
    submenu: [
      { title: "Overview", path: "/PrincipalPortal/finance/overview" },
    ]
  },

  {
    title: "Messages",
    path: "/PrincipalPortal/messages",
    icon: <MessageCircle size={20} />,
    role: "principal",
  },
  {
    title: "LogOut",
    path: "/PrincipalPortal/logout",
    icon: <LogoutIcon sx={{color:'red',fontSize:30}}/>,
    role: "principal",
  },
];