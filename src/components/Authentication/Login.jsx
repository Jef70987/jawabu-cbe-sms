// Login.jsx
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
  const { user, login, error: authError } = useAuth();
  const navigate = useNavigate();

  // Helper function to redirect based on role
  const redirectByRole = (role) => {
    const roleRoutes = {
      'teacher': '/TeacherPortal',
      'accountant': '/FinancePortal',
      'registrar': '/RegisterPortal',
      'bursar': '/BursarPortal',
      'hr_manager': '/HrPortal',
      'system_admin': '/SystemAdminPortal',
      'principal': '/PrincipalPortal',
      'deputy_principal': '/DeputyPrincipalPortal',
      'director_studies': '/DirectorPortal',
      'student': '/StudentPortal',
    };
    
    const route = roleRoutes[role] || '/Login';
    navigate(route);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectByRole(user.role);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = login(credentials.email, credentials.password);
    console.log('Login result:', result);
    if (!result.success) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - CBE Curriculum Information with Green Theme */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
        {/* Background Image - Education concept */}
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
          alt="Education concept with books"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Green Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/90 to-green-900/95"></div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Curved border effect - hidden on mobile */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-32 bg-white" 
             style={{ 
               clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
               opacity: '0.95'
             }}>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-6 lg:p-12 w-full h-full">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden mb-6">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 overflow-hidden">
              <img 
                src="/logo.jpeg" 
                alt="School Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 lg:mb-12 text-center">
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
              CBE ANALYTICS AND MANAGEMENT SYSTEM
            </h1>
            <p className="text-base lg:text-xl font-light text-green-200">
              Competency Based Education
            </p>
            <div className="mt-4 flex justify-center">
              <span className="inline-block w-20 h-1 bg-green-400 rounded-full"></span>
            </div>
          </div>

          {/* CBE Description */}
          <div className="mb-8 text-center max-w-lg">
            <p className="text-sm lg:text-base text-green-100 leading-relaxed">
              The Competency-Based Education (CBE) curriculum focuses on students mastering 
              specific skills and competencies at their own pace. Our approach ensures every 
              learner achieves mastery before progressing.
            </p>
          </div>

          {/* Key Features - Simplified */}
          <div className="space-y-3 w-full max-w-md">
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="bg-green-500 text-white p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Competency-Based Mastery</span>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="bg-green-500 text-white p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Personalized Learning Paths</span>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="bg-green-500 text-white p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Authentic Real-World Assessment</span>
            </div>
          </div>

          {/* Simple Stats */}
          <div className="mt-8 flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs text-green-200">Success Rate</div>
            </div>
            <div className="w-px bg-white/30"></div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-xs text-green-200">Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Clean Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-600 animate-fadeIn">
            {/* Logo and Title */}
            <div className="text-center mb-6">
              <div className="mx-auto h-20 w-20 mb-4">
                <img 
                  src="/logo.jpeg" 
                  alt="school logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{schoolName}</h2>
              <p className="text-xs text-gray-500 mt-1">STRIVING FOR EXCELLENCE</p>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-6">
              <p className="text-sm text-green-600">Welcome back. Enter your login credentials.</p>
            </div>
            
            {/* Error Message */}
            {authError && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {authError}
              </div>
            )}

            {/* Login Form */}
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-200 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} {schoolName}. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Powered by Syntelsafe
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;