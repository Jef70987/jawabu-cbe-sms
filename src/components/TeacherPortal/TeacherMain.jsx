import React from "react";
import { Routes, Route } from "react-router-dom"
import TeacherSidebar from "../../sidebars/TeacherSidebar";
import Logout from "../Authentication/Logout";
import Login from "../Authentication/Login";
import TeacherDashboard from "./TeacherDashboard";
import ClassProfile from "./ClassProfile";
import Attendance from "./Attendance";
import TeacherCurriculum from "./curriculum";
import AssessmentManager from "./Assesment";
import JssEntryMarks from "./JssEntry";
import CompetencyMatrix from "./CompetencyMatrix";
import DigitalPortfolio from "./EvidenceUploader";
import Exams from "./Exam";

const Teacher = () => {
    return(
        <div style={{ display: "flex", height: "100vh", overflow: "hidden",gap:"2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <TeacherSidebar/>
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
                    <Route path="/" element={<TeacherDashboard/>}/>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/ClassProfile" element={<ClassProfile/>}/>
                    <Route path="/Attendance" element={<Attendance/>}/>
                    <Route path="/AssessmentManager" element={<AssessmentManager/>}/>
                    <Route path="/MarkEntry" element={<JssEntryMarks/>}/>
                    <Route path="/CompetencyMatrix" element={<CompetencyMatrix/>}/>
                    <Route path="/Curriculum" element={<TeacherCurriculum/>}/>
                    <Route path="/Portfolio" element={<DigitalPortfolio/>}/>
                    <Route path="/Exams" element={<Exams/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                    <Route path="*" element={<TeacherDashboard/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Teacher;