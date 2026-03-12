import React from "react";
import { Routes, Route } from "react-router-dom";
import PrincipalSidebar from "../../sidebars/PrincipalSidebar";

// Import all principal components
import PrincipalDashboard from "./PrincipalDashboard";
import PrincipalOverview from "./PrincipalOverview";
import PrincipalStaff from "./PrincipalStaff";
import PrincipalStudents from "./PrincipalStudents";
import PrincipalAcademic from "./PrincipalAcademic";
import PrincipalFinance from "./PrincipalFinance";
import PrincipalReports from "./PrincipalReports";
import PrincipalSettings from "./PrincipalSettings";
import Login from "../Authentication/Login";

// Discipline related (oversight)
import PrincipalDiscipline from "./PrincipalDiscipline";
import PrincipalSuspensions from "./PrincipalSuspensions";

// Analytics and Calendar
import PrincipalAnalytics from "./PrincipalAnalytics";
import PrincipalCalendar from "./PrincipalCalendar";
import PrincipalNotifications from "./PrincipalNotifications";

const Principal = () => {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", gap: "2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <PrincipalSidebar />
            </div>
            
            {/* Main Content Area */}
            <div style={{ 
                flex: 1, 
                overflowY: "auto",
                padding: "0px 0rem",
                backgroundColor: "#f8fafc",
                minHeight: "100vh"
            }}>
                <Routes>
                    {/* Dashboard Routes */}
                    <Route path="/" element={<PrincipalDashboard />} />
                    <Route path="/dashboard" element={<PrincipalDashboard />} />
                    <Route path="/overview" element={<PrincipalOverview />} />
                    
                    {/* Staff Management Routes */}
                    <Route path="/staff" element={<PrincipalStaff />} />
                    <Route path="/staff/all" element={<PrincipalStaff />} />
                    <Route path="/staff/faculty" element={<PrincipalStaff />} />
                    <Route path="/staff/admin" element={<PrincipalStaff />} />
                    <Route path="/staff/departments" element={<PrincipalStaff />} />
                    <Route path="/staff/performance" element={<PrincipalStaff />} />
                    <Route path="/staff/attendance" element={<PrincipalStaff />} />
                    
                    {/* Student Management Routes */}
                    <Route path="/students" element={<PrincipalStudents />} />
                    <Route path="/students/all" element={<PrincipalStudents />} />
                    <Route path="/students/enrollment" element={<PrincipalStudents />} />
                    <Route path="/students/performance" element={<PrincipalStudents />} />
                    <Route path="/students/attendance" element={<PrincipalStudents />} />
                    <Route path="/students/graduation" element={<PrincipalStudents />} />
                    <Route path="/students/achievements" element={<PrincipalStudents />} />
                    
                    {/* Academic Routes */}
                    <Route path="/academic" element={<PrincipalAcademic />} />
                    <Route path="/academic/overview" element={<PrincipalAcademic />} />
                    <Route path="/academic/curriculum" element={<PrincipalAcademic />} />
                    <Route path="/academic/courses" element={<PrincipalAcademic />} />
                    <Route path="/academic/exams" element={<PrincipalAcademic />} />
                    <Route path="/academic/results" element={<PrincipalAcademic />} />
                    <Route path="/academic/timetable" element={<PrincipalAcademic />} />
                    
                    {/* Finance Routes */}
                    <Route path="/finance" element={<PrincipalFinance />} />
                    <Route path="/finance/overview" element={<PrincipalFinance />} />
                    <Route path="/finance/budget" element={<PrincipalFinance />} />
                    <Route path="/finance/revenue" element={<PrincipalFinance />} />
                    <Route path="/finance/expenses" element={<PrincipalFinance />} />
                    <Route path="/finance/payroll" element={<PrincipalFinance />} />
                    <Route path="/finance/reports" element={<PrincipalFinance />} />
                    
                    {/* Discipline Routes */}
                    <Route path="/discipline" element={<PrincipalDiscipline />} />
                    <Route path="/discipline/cases" element={<PrincipalDiscipline />} />
                    <Route path="/discipline/suspensions" element={<PrincipalSuspensions />} />
                    <Route path="/discipline/statistics" element={<PrincipalDiscipline />} />
                    <Route path="/discipline/appeals" element={<PrincipalDiscipline />} />
                    
                    {/* Reports Routes */}
                    <Route path="/reports" element={<PrincipalReports />} />
                    <Route path="/reports/academic" element={<PrincipalReports />} />
                    <Route path="/reports/financial" element={<PrincipalReports />} />
                    <Route path="/reports/staff" element={<PrincipalReports />} />
                    <Route path="/reports/students" element={<PrincipalReports />} />
                    <Route path="/reports/annual" element={<PrincipalReports />} />
                    <Route path="/reports/custom" element={<PrincipalReports />} />
                    
                    {/* Analytics Routes */}
                    <Route path="/analytics" element={<PrincipalAnalytics />} />
                    <Route path="/analytics/trends" element={<PrincipalAnalytics />} />
                    <Route path="/analytics/comparative" element={<PrincipalAnalytics />} />
                    <Route path="/analytics/predictive" element={<PrincipalAnalytics />} />
                    <Route path="/analytics/visualization" element={<PrincipalAnalytics />} />
                    
                    {/* Calendar Routes */}
                    <Route path="/calendar" element={<PrincipalCalendar />} />
                    <Route path="/calendar/academic" element={<PrincipalCalendar />} />
                    <Route path="/calendar/events" element={<PrincipalCalendar />} />
                    <Route path="/calendar/meetings" element={<PrincipalCalendar />} />
                    <Route path="/calendar/holidays" element={<PrincipalCalendar />} />
                    
                    {/* Notifications */}
                    <Route path="/notifications" element={<PrincipalNotifications />} />
                    
                    {/* Settings Routes */}
                    <Route path="/settings" element={<PrincipalSettings />} />
                    <Route path="/settings/profile" element={<PrincipalSettings />} />
                    <Route path="/settings/school" element={<PrincipalSettings />} />
                    <Route path="/settings/preferences" element={<PrincipalSettings />} />
                    <Route path="/settings/security" element={<PrincipalSettings />} />
                    <Route path="/settings/system" element={<PrincipalSettings />} />
                    
                    {/* Authentication */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<PrincipalDashboard />} />
                </Routes>
            </div>
        </div>
    );
};

export default Principal;