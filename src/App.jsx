import React from "react";
import { HashRouter as Router , Routes ,Route } from "react-router-dom";

import Bursar from "./components/BursarPortal/Bursar";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import Register from "./components/RegisterPortal/Register";
import Hr from "./components/HrPortal/Hr";
import { AuthProvider } from "./components/Authentication/AuthContext";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import Accountant from "./components/AccountantPortal/Finance";
import Teacher from "./components/TeacherPortal/TeacherMain";
import Student from "./components/StudentPortal/StudentMain";
import DeputyPrincipal from "./components/DeputyPrincipalPortal/Deputy";
import Principal from "./components/PrincipalPortal/Principal";
import ForgotPassword from "./components/Authentication/Reset";
function App() {
    return(
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/Login/" element={<Login/>}/>
                    <Route path="/Logout/" element={<ProtectedRoute><Logout/></ProtectedRoute>}/>
                    <Route path="/Reset/" element={<ForgotPassword/>}/>
                    {/* wrapping all portals with ProtectedRoute */}
                    <Route path="/RegisterPortal/*" element={
                            <ProtectedRoute allowedRoles={['registrar']}>
                                <Register/>
                            </ProtectedRoute>
                        }/>
                    <Route path="/FinancePortal/*" element={
                        <ProtectedRoute allowedRoles={['accountant']}>
                            <Accountant/>
                        </ProtectedRoute>
                            }/>
                    <Route path="/BursarPortal/*" element={
                        <ProtectedRoute allowedRoles={['bursar']}>
                            <Bursar/>
                        </ProtectedRoute>
                            }/>
                    <Route path="/TeacherPortal/*" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <Teacher/>
                        </ProtectedRoute>
                            }/>

                    <Route path="/StudentPortal/*" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Student/>
                        </ProtectedRoute>
                            }/>
                    <Route path="/HrPortal/*" element={
                        <ProtectedRoute allowedRoles={['hr_manager']}>
                            <Hr/>
                        </ProtectedRoute>
                            }/>
                    <Route path="/PrincipalPortal/*" element={
                       <ProtectedRoute allowedRoles={['principal']}>
                          <Principal/>
                      </ProtectedRoute>
                        }/>

                    <Route path="/DeputyPortal/*" element={
                       <ProtectedRoute allowedRoles={['deputy_principal']}>
                           <DeputyPrincipal/>
                       </ProtectedRoute>
                       }/>

                    <Route path="*" element={<Login/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;