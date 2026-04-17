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
  const { user, login, error } = useAuth();
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
      'deputy_principal': '/DeputyPortal',
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

  const handleResetPassword = () => {
    navigate('/Reset');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Assuming login returns a promise
      const result = await login(credentials.email, credentials.password);
      
      if (!result?.success) {
        // Handle failed login (error will be handled by AuthContext and shown via authError)
        setIsLoading(false);
      }
    } catch (error) {
      if (error){setIsLoading(false);}
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - CBE Curriculum Information with Green Theme */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
          alt="Education concept"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Deep Green Overlay for readability */}
        <div className="absolute inset-0 bg-green-900/80"></div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Curved border effect - hidden on mobile */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-82 bg-red-700" 
             style={{ 
               clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
               opacity: '0.95'
             }}>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-8 lg:p-16 h-full text-center">
          
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              JOINT ADVANCED WEB ANALYTICS AND BEHAVIORAL UNIT
            </h1>
            <p className="text-lg lg:text-2xl font-light text-green-300">
              Competency-Based Education
            </p>
            <div className="mt-6 flex justify-center">
              <span className="w-24 h-1.5 bg-green-500 rounded-full shadow-lg"></span>
            </div>
          </div>

          {/* Description - Increased font size and line height for readability */}
          <div className="mb-12 max-w-xl">
            <p className="text-base lg:text-xl text-gray-100 leading-relaxed font-medium">
              The Competency-Based Education (CBE) curriculum focuses on students mastering specific skills at their own pace, ensuring mastery before progressing.
            </p>
          </div>

          {/* Features List - Larger icons and text */}
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

          {/* Stats Section - Cleaned up alignment */}
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

      {/* Right Side - Clean Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-gray-50 rounded-2xl shadow-2xl p-7 border border-green-600">
            {/* Logo and Title */}
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

            {/* Welcome Text */}
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-gray-500">Enter your login credentials.</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-600 px-4 py-2 text-center rounded-lg mb-4 text-sm">
                {error}
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
                {/* <button onClick={handleResetPassword} className="text-sm text-green-600 hover:text-green-700"> */}
                 <button onClick={''} className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </button>
              </div>
            </form>

            {/* Footer */}
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
    </div>
  );
};

export default Login;