import React from "react"
import { Routes, Route } from "react-router-dom";
import RegisterSidebar from "../../sidebars/RegisterSidebar";
import Dashboard from "./Dashboard";
import Admission from "./Admission";
import Login from "../Authentication/Login";
import Logout from "../Authentication/Logout";
import ClassManagement from "./ClassMngmnt";
import StudentManagement from "./StudentMngmnt";
import AcademicManagement from "./Academic";
import ExamAndReportManagement from "./ExamMngmnt";
import ReportCardGenerator from "./ReportCard";
import Analytics from "./Analytics";

const Register  = () => {
    return(
        <div style={{ display: "flex", height: "100vh", overflow: "hidden",gap:"2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <RegisterSidebar/>
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
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/Dashboard" element={<Dashboard/>}/>
                    <Route path="/Admission" element={<Admission/>}/>
                    <Route path="/StudentManagement" element={<StudentManagement/>}/>
                    <Route path="/Class" element={<ClassManagement/>}/>
                    <Route path="/Academic" element={<AcademicManagement/>}/>
                    <Route path="/ExamAndReportManagement" element={<ExamAndReportManagement/>}/>
                    <Route path="/ReportCard" element={<ReportCardGenerator/>}/>
                    <Route path="/Analytics" element={<Analytics/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                    
                    <Route path="*" element={<Logout/>}/>
                </Routes>
               
            </div>
        </div>
    );
};
 export default Register ;