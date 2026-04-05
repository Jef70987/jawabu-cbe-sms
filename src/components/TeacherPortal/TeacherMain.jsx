import React from "react";
import { Routes, Route } from "react-router-dom"
import TeacherSidebar from "../../sidebars/TeacherSidebar";
import Logout from "../Authentication/Logout";
import Login from "../Authentication/Login";
import TeacherDashboard from "./TeacherDashboard";
import MarksEntrySheet from "./MarkEntry";
import PortfolioUploader from "./Portfolio";
import KNECExportView from "./KnecExportView";
import CompetencyMatrix from "./CompetencyMatrix";
import TermlySummary from "./TermlySummary";
import Analytics from "./Analytics";
import AssessmentManager from "./AssesmentMng";

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
                    {/*<Route path="/" element={<TeacherDashboard/>}/>*/}
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/MarkEntry" element={<MarksEntrySheet/>}/>
                    {/*<Route path="/Portfolio" element={<PortfolioUploader/>}/>*/}
                    {/*<Route path="/AssessmentManager" element={<AssessmentManager/>}/>*/}
                    {/*<Route path="/KnecExport" element={<KNECExportView/>}/>*/}
                    <Route path="/CompetencyMatrix" element={<CompetencyMatrix/>}/>
                    {/*<Route path="/TermlySummary" element={<TermlySummary/>}/>*/}
                    <Route path="/Analytics" element={<Analytics/>}/>
                    <Route path="/Logout" element={<Logout/>}/>
                    <Route path="*" element={<TeacherDashboard/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Teacher;