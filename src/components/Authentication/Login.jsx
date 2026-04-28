/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const schoolName = "JAWABU SCHOOL";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showForceDialog, setShowForceDialog] = useState(false);
  const { user, login, error, otpData, setOtpData, resendForceLogoutOtp } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    const roleRoutes = {
      'teacher': '/TeacherPortal',
      'accountant': '/FinancePortal',
      'registrar': '/RegisterPortal',
      'bursar': '/BursarPortal',
      'hr_manager': '/HrPortal',
      'system_admin': '/SystemAdminPortal',
      'principal': '/PrincipalPortal',
      'deputy_principal': '/DeputyPortal',
      'director_studies': '/DirectorPortal',
      'student': '/StudentPortal',
    };
    const route = roleRoutes[role] || '/Login';
    navigate(route);
  };

  useEffect(() => {
    if (user) {
      redirectByRole(user.role);
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleResetPassword = () => {
    navigate('/Reset');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(credentials.email, credentials.password);
    
    if (result?.conflict) {
      setShowForceDialog(true);
      setIsLoading(false);
    } else if (result?.otp_required) {
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setOtpCode('');
      setOtpError('');
      setIsLoading(false);
    } else if (result?.success) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async () => {
    setShowForceDialog(false);
    setIsLoading(true);
    
    const forceResult = await login(credentials.email, credentials.password, true);
    
    if (forceResult?.otp_required) {
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setOtpCode('');
      setOtpError('');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError('Please enter a 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setOtpError('');
    
    const result = await login(
      otpData?.email || credentials.email,
      otpData?.password || credentials.password,
      true,
      otpCode
    );
    
    if (result?.success) {
      setShowOtpModal(false);
      setOtpData(null);
      setOtpCode('');
    } else if (result?.error) {
      setOtpError(result.error);
    } else {
      setOtpError('Invalid OTP code. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    const result = await resendForceLogoutOtp(otpData?.email || credentials.email);
    
    if (result.success) {
      setTimer(60);
      setCanResend(false);
      setOtpError('');
    } else {
      setOtpError(result.error || 'Failed to resend OTP');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[60vh] lg:min-h-screen">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
          alt="Education concept"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900/80"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="hidden lg:block absolute right-0 top-0 h-full w-82 bg-red-700" 
             style={{ 
               clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
               opacity: '0.95'
             }}>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-8 lg:p-16 h-full text-center">
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              NURTURING COMPETENCE, CHARACTER, AND CREATIVITY
            </h1>
            <p className="text-lg lg:text-2xl font-light text-green-300">
              Competency-Based Education
            </p>
            <div className="mt-6 flex justify-center">
              <span className="w-24 h-1.5 bg-green-500 rounded-full shadow-lg"></span>
            </div>
          </div>
          <div className="mb-12 max-w-xl">
            <p className="text-base lg:text-xl text-gray-100 leading-relaxed font-medium">
              The Competency-Based Education (CBE) curriculum focuses on students mastering specific skills at their own pace, ensuring mastery before progressing.
            </p>
          </div>
          <div className="space-y-8 w-full max-w-sm text-left">
            {[
              "Competency-Based Mastery",
              "Personalized Learning Paths",
              "Authentic Real-World Assessment"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-5">
                <div className="text-green-400 flex-shrink-0">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg lg:text-xl font-semibold text-white">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-16 flex gap-12 text-center border-t border-white/20 pt-8">
            <div>
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="text-sm uppercase tracking-wider text-green-300 mt-1">Success Rate</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-sm uppercase tracking-wider text-green-300 mt-1">Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-md w-full">
          <div className="bg-gray-50 rounded-2xl shadow-2xl p-7 border border-green-600">
            <div className="text-center mb-6">
              <div className="mx-auto h-20 w-20 mb-4">
                <img 
                  src="/logo.jpeg" 
                  alt="school logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl font-bold text-green-800">{schoolName}</h2>
              <p className="text-xs text-red-500 mt-1 font-semibold">STRIVING FOR EXCELLENCE</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm font-bold text-gray-500">Enter your login credentials.</p>
            </div>
            
            {error && !showOtpModal && !showForceDialog && (
              <div className="bg-red-100 text-red-600 px-4 py-2 text-center rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-end">
                <button onClick={handleResetPassword} className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} jawabu. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by Syntelsafe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Force Logout Dialog - White Background */}
      {showForceDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6 border border-red-300 rounded-lg p-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-900">Active Session Detected</h3>
              <p className="text-sm text-red-600 mt-2">
                You are already logged in on another device. Do you want to force logout from that device and continue?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForceDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleForceLogout}
                className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800"
              >
                Force Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal - White Background */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Verification Required</h3>
              <p className="text-sm text-gray-600 mt-2">
                Enter the 6-digit code sent to your email:
              </p>
              <p className="text-md font-semibold text-green-700 mt-1">
                {otpData?.email_masked || 'your email'}
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-bold tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                autoFocus
              />
              {otpError && (
                <p className="text-red-500 text-sm text-center mt-2">{otpError}</p>
              )}
            </div>

            <div className="text-center mb-6">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in <span className="font-semibold text-green-600">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                  className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                >
                  Resend verification code
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otpCode.length !== 6}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;