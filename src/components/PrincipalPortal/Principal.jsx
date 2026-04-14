  import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrincipalSidebar from '../../sidebars/PrincipalSidebar';

// Main pages
import PrincipalDashboard from './PrincipalDashboard';
import PrincipalOverview from './PrincipalOverview';
import PrincipalStaff from './PrincipalStaff';
import PrincipalStudents from './PrincipalStudents';
import PrincipalAcademic from './PrincipalAcademic';
import PrincipalFinance from './PrincipalFinance';
import PrincipalDiscipline from './PrincipalDiscipline';
import PrincipalReports from './PrincipalReports';
import PrincipalAnalytics from './PrincipalAnalytics';
import PrincipalCalendar from './PrincipalCalendar';
import PrincipalNotifications from './PrincipalNotifications';
import PrincipalSettings from './PrincipalSettings';

// Staff
import StaffAll from './staff/StaffAll';
import StaffFaculty from './staff/StaffFaculty';
import StaffAdmin from './staff/StaffAdmin';
import StaffDepartments from './staff/StaffDepartments';
import StaffPerformance from './staff/StaffPerformance';
import StaffAttendance from './staff/StaffAttendance';

// Students
import StudentsAll from './students/StudentsAll';
import StudentsEnrollment from './students/StudentsEnrollment';
import StudentsPerformance from './students/StudentsPerformance';
import StudentsAttendance from './students/StudentsAttendance';
import StudentsGraduation from './students/StudentsGraduation';
import StudentsAchievements from './students/StudentsAchievements';

// Academic
import AcademicOverview from './academic/AcademicOverview';
import AcademicCurriculum from './academic/AcademicCurriculum';
import AcademicCourses from './academic/AcademicCourses';
import AcademicExaminations from './academic/AcademicExaminations';
import AcademicResults from './academic/AcademicResults';
import AcademicTimetable from './academic/AcademicTimetable';

// Finance
import FinanceOverview from './finance/FinanceOverview';
import FinanceBudget from './finance/FinanceBudget';
import FinanceRevenue from './finance/FinanceRevenue';
import FinanceExpenses from './finance/FinanceExpenses';
import FinancePayroll from './finance/FinancePayroll';
import FinanceReports from './finance/FinanceReports';

// Discipline
import DisciplineCases from './discipline/DisciplineCases';
import DisciplineSuspensions from './discipline/DisciplineSuspensions';
import DisciplineStatistics from './discipline/DisciplineStatistics';
import DisciplineAppeals from './discipline/DisciplineAppeals';

// Reports
import ReportsAcademic from './reports/ReportsAcademic';
import ReportsFinancial from './reports/ReportsFinancial';
import ReportsStaff from './reports/ReportsStaff';
import ReportsStudents from './reports/ReportsStudents';
import ReportsAnnual from './reports/ReportsAnnual';
import ReportsCustom from './reports/ReportsCustom';

// Analytics
import AnalyticsTrends from './analytics/AnalyticsTrends';
import AnalyticsComparative from './analytics/AnalyticsComparative';
import AnalyticsPredictive from './analytics/AnalyticsPredictive';
import AnalyticsVisualization from './analytics/AnalyticsVisualization';

// Calendar
import CalendarAcademic from './calendar/CalendarAcademic';
import CalendarEvents from './calendar/CalendarEvents';
import CalendarMeetings from './calendar/CalendarMeetings';
import CalendarHolidays from './calendar/CalendarHolidays';


import Logout from "../Authentication/Logout";

const Principal = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar */}
      <PrincipalSidebar />

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f8fafc" }}>
        <Routes>

          {/* DEFAULT */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<PrincipalDashboard />} />
          <Route path="overview" element={<PrincipalOverview />} />

          {/* Staff */}
          <Route path="staff" element={<PrincipalStaff />} />
          <Route path="staff/all" element={<StaffAll />} />
          <Route path="staff/faculty" element={<StaffFaculty />} />
          <Route path="staff/admin" element={<StaffAdmin />} />
          <Route path="staff/departments" element={<StaffDepartments />} />
          <Route path="staff/performance" element={<StaffPerformance />} />
          <Route path="staff/attendance" element={<StaffAttendance />} />

          {/* Students */}
          <Route path="students" element={<PrincipalStudents />} />
          <Route path="students/all" element={<StudentsAll />} />
          <Route path="students/enrollment" element={<StudentsEnrollment />} />
          <Route path="students/performance" element={<StudentsPerformance />} />
          <Route path="students/attendance" element={<StudentsAttendance />} />
          <Route path="students/graduation" element={<StudentsGraduation />} />
          <Route path="students/achievements" element={<StudentsAchievements />} />

          {/* Academic */}
          <Route path="academic" element={<PrincipalAcademic />} />
          <Route path="academic/overview" element={<AcademicOverview />} />
          <Route path="academic/curriculum" element={<AcademicCurriculum />} />
          <Route path="academic/courses" element={<AcademicCourses />} />
          <Route path="academic/exams" element={<AcademicExaminations />} />
          <Route path="academic/results" element={<AcademicResults />} />
          <Route path="academic/timetable" element={<AcademicTimetable />} />

          {/* Finance */}
          <Route path="finance" element={<PrincipalFinance />} />
          <Route path="finance/overview" element={<FinanceOverview />} />
          <Route path="finance/budget" element={<FinanceBudget />} />
          <Route path="finance/revenue" element={<FinanceRevenue />} />
          <Route path="finance/expenses" element={<FinanceExpenses />} />
          <Route path="finance/payroll" element={<FinancePayroll />} />
          <Route path="finance/reports" element={<FinanceReports />} />

          {/* Discipline */}
          <Route path="discipline" element={<PrincipalDiscipline />} />
          <Route path="discipline/cases" element={<DisciplineCases />} />
          <Route path="discipline/suspensions" element={<DisciplineSuspensions />} />
          <Route path="discipline/statistics" element={<DisciplineStatistics />} />
          <Route path="discipline/appeals" element={<DisciplineAppeals />} />

          {/* Reports */}
          <Route path="reports" element={<PrincipalReports />} />
          <Route path="reports/academic" element={<ReportsAcademic />} />
          <Route path="reports/financial" element={<ReportsFinancial />} />
          <Route path="reports/staff" element={<ReportsStaff />} />
          <Route path="reports/students" element={<ReportsStudents />} />
          <Route path="reports/annual" element={<ReportsAnnual />} />
          <Route path="reports/custom" element={<ReportsCustom />} />

          {/* Analytics */}
          <Route path="analytics" element={<PrincipalAnalytics />} />
          <Route path="analytics/trends" element={<AnalyticsTrends />} />
          <Route path="analytics/comparative" element={<AnalyticsComparative />} />
          <Route path="analytics/predictive" element={<AnalyticsPredictive />} />
          <Route path="analytics/visualization" element={<AnalyticsVisualization />} />

          {/* Calendar */}
          <Route path="calendar" element={<PrincipalCalendar />} />
          <Route path="calendar/academic" element={<CalendarAcademic />} />
          <Route path="calendar/events" element={<CalendarEvents />} />
          <Route path="calendar/meetings" element={<CalendarMeetings />} />
          <Route path="calendar/holidays" element={<CalendarHolidays />} />

          {/* Notifications */}
          <Route path="notifications" element={<PrincipalNotifications />} />

          {/* Settings */}
          <Route path="settings" element={<PrincipalSettings />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />\
          
          <Route path="/Logout" element={<Logout/>}/>
                    
          <Route path="*" element={<Logout/>}/>

        </Routes>
      </div>
    </div>
  );
};

export default Principal;