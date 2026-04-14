import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeputyPrincipalSidebar from '../../sidebars/DeputyPrincipalSidebar';

// Import all deputy principal components
import DeputyPrincipalDashboard from './DeputyPrincipalDashboard';
import DeputyDiscipline from './DeputyDiscipline';
import DeputyStudentAffairs from './DeputyStudentAffairs';
import DeputyConductRecords from './DeputyConductRecords';

// Import Suspensions components
import SuspensionsActive from './suspensions/SuspensionsActive';
import SuspensionsInSchool from './suspensions/SuspensionsInSchool';
import SuspensionsOutSchool from './suspensions/SuspensionsOutSchool';
import SuspensionsHistory from './suspensions/SuspensionsHistory';
import SuspensionsAppeals from './suspensions/SuspensionsAppeals';
import SuspensionsReviewBoard from './suspensions/SuspensionsReviewBoard';

// Import Counseling components
import CounselingSessions from './counseling/CounselingSessions';
import CounselingSchedule from './counseling/CounselingSchedule';
import CounselingCounselors from './counseling/CounselingCounselors';
import CounselingResources from './counseling/CounselingResources';
import CounselingReferrals from './counseling/CounselingReferrals';
import CounselingReports from './counseling/CounselingReports';

// Import Case Reports components
import CaseReportsDaily from './case-reports/CaseReportsDaily';
import CaseReportsWeekly from './case-reports/CaseReportsWeekly';
import CaseReportsMonthly from './case-reports/CaseReportsMonthly';
import CaseReportsQuarterly from './case-reports/CaseReportsQuarterly';
import CaseReportsAnnual from './case-reports/CaseReportsAnnual';
import CaseReportsCustom from './case-reports/CaseReportsCustom';

// Import Statistics components
import StatisticsDiscipline from './statistics/StatisticsDiscipline';
import StatisticsComparative from './statistics/StatisticsComparative';
import StatisticsTrends from './statistics/StatisticsTrends';
import StatisticsDemographics from './statistics/StatisticsDemographics';
import StatisticsPredictive from './statistics/StatisticsPredictive';

// Import Interventions components
import InterventionsBehaviorPlans from './interventions/InterventionsBehaviorPlans';
import InterventionsMonitoring from './interventions/InterventionsMonitoring';
import InterventionsPeerMediation from './interventions/InterventionsPeerMediation';
import InterventionsRestorativeJustice from './interventions/InterventionsRestorativeJustice';
import InterventionsFollowUp from './interventions/InterventionsFollowUp';

// Import Settings components
import SettingsProfile from './settings/SettingsProfile';
import SettingsNotifications from './settings/SettingsNotifications';
import SettingsPreferences from './settings/SettingsPreferences';
import SettingsSecurity from './settings/SettingsSecurity';
import SettingsDiscipline from './settings/SettingsDiscipline';

// Import Calendar components
import CalendarHearings from './calendar/CalendarHearings';
import CalendarMeetings from './calendar/CalendarMeetings';
import CalendarCounseling from './calendar/CalendarCounseling';
import CalendarDeadlines from './calendar/CalendarDeadlines';

// Import discipline sub-pages
import DisciplineCases from './discipline/DisciplineCases';
import DisciplineNewCase from './discipline/DisciplineNewCase';
import DisciplineActive from './discipline/DisciplineActive';
import DisciplineHearings from './discipline/DisciplineHearings';
import DisciplineAppeals from './discipline/DisciplineAppeals';
import DisciplineResolved from './discipline/DisciplineResolved';

const DeputyPrincipal = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", gap: "2px" }}>
      <div style={{ flexShrink: 0 }}>
        <DeputyPrincipalSidebar />
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: "auto",
        padding: "0px 0rem",
        backgroundColor: "#f8fafc",
        minHeight: "100vh"
      }}>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<DeputyPrincipalDashboard />} />
          <Route path="/dashboard" element={<DeputyPrincipalDashboard />} />
          
          {/* Discipline Routes */}
          <Route path="/discipline" element={<DeputyDiscipline />}>
            <Route path="cases" element={<DisciplineCases />} />
            <Route path="new" element={<DisciplineNewCase />} />
            <Route path="active" element={<DisciplineActive />} />
            <Route path="hearings" element={<DisciplineHearings />} />
            <Route path="appeals" element={<DisciplineAppeals />} />
            <Route path="resolved" element={<DisciplineResolved />} />
          </Route>
          
          {/* Suspensions Routes */}
          <Route path="/suspensions/active" element={<SuspensionsActive />} />
          <Route path="/suspensions/in-school" element={<SuspensionsInSchool />} />
          <Route path="/suspensions/out-school" element={<SuspensionsOutSchool />} />
          <Route path="/suspensions/history" element={<SuspensionsHistory />} />
          <Route path="/suspensions/appeals" element={<SuspensionsAppeals />} />
          <Route path="/suspensions/review" element={<SuspensionsReviewBoard />} />
          
          {/* Counseling Routes */}
          <Route path="/counseling/sessions" element={<CounselingSessions />} />
          <Route path="/counseling/schedule" element={<CounselingSchedule />} />
          <Route path="/counseling/counselors" element={<CounselingCounselors />} />
          <Route path="/counseling/resources" element={<CounselingResources />} />
          <Route path="/counseling/referrals" element={<CounselingReferrals />} />
          <Route path="/counseling/reports" element={<CounselingReports />} />
          
          {/* Case Reports Routes */}
          <Route path="/case-reports/daily" element={<CaseReportsDaily />} />
          <Route path="/case-reports/weekly" element={<CaseReportsWeekly />} />
          <Route path="/case-reports/monthly" element={<CaseReportsMonthly />} />
          <Route path="/case-reports/quarterly" element={<CaseReportsQuarterly />} />
          <Route path="/case-reports/annual" element={<CaseReportsAnnual />} />
          <Route path="/case-reports/custom" element={<CaseReportsCustom />} />
          
          {/* Statistics Routes */}
          <Route path="/statistics/discipline" element={<StatisticsDiscipline />} />
          <Route path="/statistics/comparative" element={<StatisticsComparative />} />
          <Route path="/statistics/trends" element={<StatisticsTrends />} />
          <Route path="/statistics/demographics" element={<StatisticsDemographics />} />
          <Route path="/statistics/predictive" element={<StatisticsPredictive />} />
          
          {/* Interventions Routes */}
          <Route path="/interventions/behavior-plans" element={<InterventionsBehaviorPlans />} />
          <Route path="/interventions/monitoring" element={<InterventionsMonitoring />} />
          <Route path="/interventions/peer-mediation" element={<InterventionsPeerMediation />} />
          <Route path="/interventions/restorative-justice" element={<InterventionsRestorativeJustice />} />
          <Route path="/interventions/follow-up" element={<InterventionsFollowUp />} />
          
          {/* Settings Routes */}
          <Route path="/settings/profile" element={<SettingsProfile />} />
          <Route path="/settings/notifications" element={<SettingsNotifications />} />
          <Route path="/settings/preferences" element={<SettingsPreferences />} />
          <Route path="/settings/security" element={<SettingsSecurity />} />
          <Route path="/settings/discipline" element={<SettingsDiscipline />} />
          
          {/* Calendar Routes */}
          <Route path="/calendar/hearings" element={<CalendarHearings />} />
          <Route path="/calendar/meetings" element={<CalendarMeetings />} />
          <Route path="/calendar/counseling" element={<CalendarCounseling />} />
          <Route path="/calendar/deadlines" element={<CalendarDeadlines />} />
          
          {/* Other Deputy Routes */}
          <Route path="/student-affairs/*" element={<DeputyStudentAffairs />} />
          <Route path="/conduct/*" element={<DeputyConductRecords />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/deputy/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default DeputyPrincipal;