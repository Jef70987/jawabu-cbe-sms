import React from "react";
import { Routes, Route } from "react-router-dom";
import DeputyPrincipalSidebar from "../../sidebars/DeputyPrincipalSidebar";

// Import all deputy principal components
import DeputyPrincipalDashboard from "./DeputyPrincipalDashboard";
import DeputyDiscipline from "./DeputyDiscipline";
import DeputyStudentAffairs from "./DeputyStudentAffairs";
import DeputyConductRecords from "./DeputyConductRecords";
import DeputySuspensions from "./DeputySuspensions";
import DeputyCounseling from "./DeputyCounseling";
import DeputyCaseReports from "./DeputyCaseReports";
import DeputyStatistics from "./DeputyStatistics";
import DeputyInterventions from "./DeputyInterventions";
import DeputyCalendar from "./DeputyCalendar";
import DeputyNotifications from "./DeputyNotifications";
import DeputySettings from "./DeputySettings";
import Login from "../Authentication/Login";

const DeputyPrincipal = () => {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", gap: "2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <DeputyPrincipalSidebar />
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
                    <Route path="/" element={<DeputyPrincipalDashboard />} />
                    <Route path="/dashboard" element={<DeputyPrincipalDashboard />} />
                    
                    {/* Discipline Routes */}
                    <Route path="/discipline" element={<DeputyDiscipline />} />
                    <Route path="/discipline/cases" element={<DeputyDiscipline />} />
                    <Route path="/discipline/new" element={<DeputyDiscipline />} />
                    <Route path="/discipline/active" element={<DeputyDiscipline />} />
                    <Route path="/discipline/hearings" element={<DeputyDiscipline />} />
                    <Route path="/discipline/appeals" element={<DeputyDiscipline />} />
                    <Route path="/discipline/resolved" element={<DeputyDiscipline />} />
                    
                    {/* Student Affairs Routes */}
                    <Route path="/student-affairs" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/all" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/conduct" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/welfare" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/activities" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/clubs" element={<DeputyStudentAffairs />} />
                    <Route path="/student-affairs/leaders" element={<DeputyStudentAffairs />} />
                    
                    {/* Conduct Records Routes */}
                    <Route path="/conduct" element={<DeputyConductRecords />} />
                    <Route path="/conduct/all" element={<DeputyConductRecords />} />
                    <Route path="/conduct/merits" element={<DeputyConductRecords />} />
                    <Route path="/conduct/demerits" element={<DeputyConductRecords />} />
                    <Route path="/conduct/history" element={<DeputyConductRecords />} />
                    <Route path="/conduct/trends" element={<DeputyConductRecords />} />
                    
                    {/* Suspensions Routes */}
                    <Route path="/suspensions" element={<DeputySuspensions />} />
                    <Route path="/suspensions/active" element={<DeputySuspensions />} />
                    <Route path="/suspensions/in-school" element={<DeputySuspensions />} />
                    <Route path="/suspensions/out-school" element={<DeputySuspensions />} />
                    <Route path="/suspensions/history" element={<DeputySuspensions />} />
                    <Route path="/suspensions/appeals" element={<DeputySuspensions />} />
                    <Route path="/suspensions/review" element={<DeputySuspensions />} />
                    
                    {/* Counseling Routes */}
                    <Route path="/counseling" element={<DeputyCounseling />} />
                    <Route path="/counseling/sessions" element={<DeputyCounseling />} />
                    <Route path="/counseling/schedule" element={<DeputyCounseling />} />
                    <Route path="/counseling/counselors" element={<DeputyCounseling />} />
                    <Route path="/counseling/resources" element={<DeputyCounseling />} />
                    <Route path="/counseling/referrals" element={<DeputyCounseling />} />
                    <Route path="/counseling/reports" element={<DeputyCounseling />} />
                    
                    {/* Case Reports Routes */}
                    <Route path="/case-reports" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/daily" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/weekly" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/monthly" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/quarterly" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/annual" element={<DeputyCaseReports />} />
                    <Route path="/case-reports/custom" element={<DeputyCaseReports />} />
                    
                    {/* Statistics Routes */}
                    <Route path="/statistics" element={<DeputyStatistics />} />
                    <Route path="/statistics/discipline" element={<DeputyStatistics />} />
                    <Route path="/statistics/trends" element={<DeputyStatistics />} />
                    <Route path="/statistics/comparative" element={<DeputyStatistics />} />
                    <Route path="/statistics/demographics" element={<DeputyStatistics />} />
                    <Route path="/statistics/predictive" element={<DeputyStatistics />} />
                    
                    {/* Interventions Routes */}
                    <Route path="/interventions" element={<DeputyInterventions />} />
                    <Route path="/interventions/plans" element={<DeputyInterventions />} />
                    <Route path="/interventions/mentoring" element={<DeputyInterventions />} />
                    <Route path="/interventions/mediation" element={<DeputyInterventions />} />
                    <Route path="/interventions/restorative" element={<DeputyInterventions />} />
                    <Route path="/interventions/followups" element={<DeputyInterventions />} />
                    
                    {/* Calendar Routes */}
                    <Route path="/calendar" element={<DeputyCalendar />} />
                    <Route path="/calendar/hearings" element={<DeputyCalendar />} />
                    <Route path="/calendar/meetings" element={<DeputyCalendar />} />
                    <Route path="/calendar/counseling" element={<DeputyCalendar />} />
                    <Route path="/calendar/deadlines" element={<DeputyCalendar />} />
                    
                    {/* Notifications */}
                    <Route path="/notifications" element={<DeputyNotifications />} />
                    
                    {/* Settings Routes */}
                    <Route path="/settings" element={<DeputySettings />} />
                    <Route path="/settings/profile" element={<DeputySettings />} />
                    <Route path="/settings/notifications" element={<DeputySettings />} />
                    <Route path="/settings/preferences" element={<DeputySettings />} />
                    <Route path="/settings/security" element={<DeputySettings />} />
                    <Route path="/settings/discipline" element={<DeputySettings />} />
                    
                    {/* Authentication */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<DeputyPrincipalDashboard />} />
                </Routes>
            </div>
        </div>
    );
};

export default DeputyPrincipal;