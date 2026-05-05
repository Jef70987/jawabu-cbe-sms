import React from "react";
import { Routes, Route } from "react-router-dom"
import HrSidebar from "../../sidebars/HrSidebar";
import HRDashboard from "./Dashboard";

import HelpSupport from "./HelpSupport";
import Settings from "./Settings";
import Login from "../Authentication/Login";
import Payroll from "./PayrollMngmt";
import Recruitment from "./Recruitment";
import StaffManagement from "./StaffMngnt";
import DepartmentManagement from "./DepartmentMng";
import StaffMessaging from "../CommonService/StaffMessaging";

const Hr = () => {
    return(
        <div style={{ display: "flex", height: "100vh", overflow: "hidden",gap:"2px" }}>
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <HrSidebar/>
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
                    <Route path="/" element={<HRDashboard/>}/>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/HrDashboard" element={<HRDashboard/>}/>
                    <Route path="/Department" element={<DepartmentManagement/>}/>
                    <Route path="/Payroll" element={<Payroll/>}/>
                    <Route path="/Recruitment" element={<Recruitment/>}/>
                    <Route path="/StaffMngnt" element={<StaffManagement/>}/>
                    <Route path="/Messages" element={<StaffMessaging/>}/>
                    <Route path="/HelpSupport" element={<HelpSupport/>}/>
                    <Route path="/Messages" element={<Messages/>}/>
                    <Route path="/Settings" element={<Settings/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Hr;
