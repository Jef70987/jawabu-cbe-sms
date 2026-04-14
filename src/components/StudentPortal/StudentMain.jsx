import React from "react"
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "../../sidebars/StudentSidebar";
import StudentDashboard from "./Dashboard";
import Logout from "../Authentication/Logout";
import StudentFeeManagement from "./Fees";
import StudentProfile from "./Profile";
import Grades from "./Grades";
import StudentResults from "./Studentresults";
import Academic from "./Academic";
import Analysis from "./Analytics";

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
                    <Route path="/Grades" element={<Grades/>}/>
                    <Route path="/Analytics" element={<Analysis/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                   
                </Routes>
               
            </div>
        </div>
    );
};
 export default Student ;