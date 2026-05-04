import React from "react"
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "../../sidebars/StudentSidebar";
import StudentDashboard from "./Dashboard";
import Logout from "../Authentication/Logout";
import StudentFeeManagement from "./Fees";
import StudentProfile from "./Profile";
import Academic from "./Academic";
import Grades from "./Grades";
import Chatbot from "./Chatbot";
import Reportcard from "./ReportCard";
const Student = () => {
    return(
        <div style={{ display: "flex", height: "100vh", overflow: "hidden",gap:"2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <StudentSidebar/>
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
                    <Route path="/" element={<StudentDashboard/>}/>
                    <Route path="/Dashboard" element={<StudentDashboard/>}/>
                    <Route path="/Finance" element={<StudentFeeManagement/>}/>
                    <Route path="/Profile" element={<StudentProfile/>}/>
                    <Route path="/Academic" element={<Academic/>}/>
                    <Route path="/Results" element={<Grades/>}/>
                    <Route path="/Reportcard" element={<Reportcard/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                    <Route path="/chat" element={<Chatbot/>}/>
                </Routes>
               
            </div>
        </div>
    );
};
 export default Student ;