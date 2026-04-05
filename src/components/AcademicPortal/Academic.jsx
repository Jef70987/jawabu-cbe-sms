import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AcademicSidebar from '../../sidebars/AcademicSidebar';

import AcademicDashboard from './AcademicDashboard';
import AcademicCurriculum from './AcademicCurriculum';
import AcademicCourses from './AcademicCourses';
import AcademicExaminations from './AcademicExaminations';
import AcademicResults from './AcademicResults';
import AcademicTimetable from './AcademicTimetable';
import AcademicAttendance from './AcademicAttendance';
import AcademicReports from './AcademicReports';
import AcademicNotifications from './AcademicNotifications';
import AcademicSettings from './AcademicSettings';

const Academic = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", gap: "2px" }}>
      
      {/* Sidebar */}
      <div style={{ flexShrink: 0 }}>
        <AcademicSidebar />
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto",
        padding: "0px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh"
      }}>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<AcademicDashboard />} />
          <Route path="dashboard" element={<AcademicDashboard />} />

          <Route path="curriculum/*" element={<AcademicCurriculum />} />
          <Route path="courses/*" element={<AcademicCourses />} />
          <Route path="examinations/*" element={<AcademicExaminations />} />
          <Route path="results/*" element={<AcademicResults />} />
          <Route path="timetable/*" element={<AcademicTimetable />} />
          <Route path="attendance/*" element={<AcademicAttendance />} />
          <Route path="reports/*" element={<AcademicReports />} />
          <Route path="notifications" element={<AcademicNotifications />} />
          <Route path="settings/*" element={<AcademicSettings />} />

          {/* ✅ FIXED REDIRECT (IMPORTANT) */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Academic;