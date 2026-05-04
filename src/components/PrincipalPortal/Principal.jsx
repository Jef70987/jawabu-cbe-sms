import React from "react";
import { Routes, Route } from "react-router-dom";
import PrincipalSidebar from "../../sidebars/PrincipalSidebar";

// Import all principal components
import PrincipalDashboard from "./PrincipalDashboard";
import PrincipalStudents from "./PrincipalStudents";
import PrincipalFinance from "./PrincipalFinance";
import Login from "../Authentication/Login";
import Logout from "../Authentication/Logout";


import PrincipalMessages from "../CommonService/StaffMessaging";

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
                    
                    
                    {/* Student Management Routes */}
                    <Route path="/students" element={<PrincipalStudents />} />
                    <Route path="/students/all" element={<PrincipalStudents />} />
                    
                    
                    {/* Finance Routes */}
                    <Route path="/finance" element={<PrincipalFinance />} />
                    <Route path="/finance/overview" element={<PrincipalFinance />} />

                    
                    

                    <Route path="/messages" element={<PrincipalMessages />} />
                    
                    {/* Authentication */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/Logout" element={<Logout/>}/>
                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<PrincipalDashboard />} />
                </Routes>
            </div>
        </div>
    );
};

export default Principal;