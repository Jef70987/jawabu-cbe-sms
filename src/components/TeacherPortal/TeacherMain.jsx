import React from "react";
import { Routes, Route } from "react-router-dom"
import TeacherSidebar from "../../sidebars/TeacherSidebar";
import Logout from "../Authentication/Logout";
import Login from "../Authentication/Login";
import TeacherDashboard from "./TeacherDashboard";
import CompetencyMatrix from "./CompetencyMatrix";
import Analytics from "./Analytics";
import ClassProfile from "./Class";
import AssessmentBuilder from "./AssesmentMng";
import MarkEntryGrid from "./MarkEntry";
import EvidenceVault from "./Portfolio";
import NotificationCenter from "./NotificationCenter";
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
                    <Route path="/MarkEntry" element={<MarkEntryGrid/>}/>
                    <Route path="/Portfolio" element={<EvidenceVault/>}/>
                    <Route path="/AssessmentManager" element={<AssessmentBuilder/>}/>
                    <Route path="/ClassProfile" element={<ClassProfile/>}/>
                    <Route path="/CompetencyMatrix" element={<CompetencyMatrix/>}/>
                    <Route path="/Analytics" element={<Analytics/>}/>
                    <Route path="/Notifications" element={<NotificationCenter/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                    <Route path="*" element={<TeacherDashboard/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Teacher;