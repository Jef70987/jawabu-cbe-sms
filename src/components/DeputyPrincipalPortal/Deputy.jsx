import React from "react";
import { Routes, Route } from "react-router-dom";
import DeputyPrincipalSidebar from "../../sidebars/DeputyPrincipalSidebar";
import DeputyPrincipalDashboard from "./DeputyPrincipalDashboard";
import Discipline from "./DeputyDiscipline";
import DeputyStudentAffairs from "./DeputyStudentAffairs";
import Login from "../Authentication/Login";
import Logout from "../Authentication/Logout";
import TeacherAssignment from "./TeacherAssign";


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
                    <Route path="/" element={<DeputyPrincipalDashboard />} />
                    <Route path="/dashboard" element={<DeputyPrincipalDashboard />} />
                    <Route path="/discipline" element={<Discipline />} />
                    <Route path="/student-affairs/" element={<DeputyStudentAffairs />} />
                    <Route path="/Assignments" element={<TeacherAssignment/>}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/Logout" element={<Logout/>}/>

                    <Route path="*" element={<DeputyPrincipalDashboard />} />

                </Routes>
            </div>
        </div>
    );
};

export default DeputyPrincipal;