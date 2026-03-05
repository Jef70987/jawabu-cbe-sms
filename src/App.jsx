import React from "react";
import { HashRouter as Router , Routes ,Route } from "react-router-dom";
import Finance from "./components/FinancePortal/Finance";
import Bursar from "./components/BursarPortal/Bursar";
import Login from "./components/Authentication/Login";
import Register from "./components/RegisterPortal/Register";
// import Hr from "./components/HrPortal/Hr";

import { AuthProvider } from "./components/Authentication/AuthContext";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

// import ProtectedRoute from "./components/Authentication/Layout/ProtectedRoute";
function App() {
    return(
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/Login/" element={<Login/>}/>

                    {/* wrapping all portals with ProtectedRoute */}
                    <Route path="/RegisterPortal/*" element={
                            <ProtectedRoute allowedRoles={['registrar']}>
                                <Register/>
                            </ProtectedRoute>
                        }/>
                    <Route path="/FinancePortal/*" element={
                        <ProtectedRoute allowedRoles={['accountant']}>
                            <Finance/>
                        </ProtectedRoute>
                            }/>
                    <Route path="/BursarPortal/*" element={
                        <ProtectedRoute allowedRoles={['bursar']}>
                            <Bursar/>
                        </ProtectedRoute>
                            }/>
                    {/* <Route path="/HrPortal/*" element={
                        <ProtectedRoute allowedRoles={['hr_manager']}>
                            <Hr/>
                        </ProtectedRoute>
                            }/> */}

                    <Route path="*" element={<Login/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;