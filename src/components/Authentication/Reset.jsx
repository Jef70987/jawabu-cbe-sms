import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const schoolName = "JAWABU SCHOOL";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [userId, setUserId] = useState(null);
  const [emailMasked, setEmailMasked] = useState('');

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === 2 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer, canResend]);

  const maskEmailHelper = (emailStr) => {
    if (!emailStr) return '';
    const parts = emailStr.split('@');
    if (parts.length !== 2) return emailStr;
    const username = parts[0];
    const domain = parts[1];
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.substring(0, 3)}***@${domain}`;
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setMessage('');
    
    try {
      const result = await requestPasswordResetOtp(email);
      
      // Check if result exists and has success flag
      if (result && result.success === true) {
        setUserId(result.user_id);
        setEmailMasked(result.email_masked || maskEmailHelper(email));
        setStep(2);
        setTimer(60);
        setCanResend(false);
        setMessage(result.message || 'Verification code sent to your email');
      } else {
        // Handle error response - display error message, no white screen
        let errorMsg = 'Failed to send verification code';
        if (result && result.error) {
          if (typeof result.error === 'string') {
            errorMsg = result.error;
          } else if (typeof result.error === 'object') {
            errorMsg = JSON.stringify(result.error);
          }
        }
        setErrors({ email: errorMsg });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ email: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setErrors({});
    setMessage('');
    
    try {
      const result = await requestPasswordResetOtp(email);
      
      if (result && result.success === true) {
        setTimer(60);
        setCanResend(false);
        setMessage(result.message || 'New verification code sent to your email');
      } else {
        let errorMsg = 'Failed to resend verification code';
        if (result && result.error) {
          errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        }
        setErrors({ otp: errorMsg });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit verification code' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await verifyPasswordResetOtp(email, otpCode);
      
      if (result && result.success === true) {
        setStep(3);
        setMessage('');
        setOtpCode('');
      } else {
        let errorMsg = 'Invalid verification code. Please try again.';
        if (result && result.error) {
          errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        }
        setErrors({ otp: errorMsg });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswords = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const passwordErrors = validatePasswords();
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (!userId) {
      setErrors({ general: 'Session expired. Please restart the password reset process.' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await resetPassword(userId, newPassword, confirmPassword);
      
      if (result && result.success === true) {
        navigate('/Login', { 
          state: { message: 'Password reset successfully! Please login with your new password.' } 
        });
      } else {
        let errorMsg = 'Failed to reset password. Please try again.';
        if (result && result.error) {
          errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        }
        setErrors({ general: errorMsg });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl lg:text-3xl font-extrabold mb-4 tracking-tight leading-tight">
              RESET YOUR PASSWORD SECURELY WITH TWO-FACTOR AUTHENTICATION
            </h1>
            <div className="mt-6 flex justify-center">
              <span className="w-24 h-1.5 bg-green-500 rounded-full shadow-lg"></span>
            </div>
          </div>
          <div className="mb-12 max-w-xl">
            <p className="text-base lg:text-xl text-white leading-relaxed font-medium">
               Ensure your account security with our enhanced password reset process.
            </p>
          </div>
          <div className="space-y-8 w-full max-w-sm text-left">
            {[
              "Secure Two-Factor Authentication",
              "Encrypted Password Reset",
              "Instant Email Verification"
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
        </div>
      </div>

      {/* Right Side */}
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
              <p className="text-xs text-red-500 mt-1 font-semibold">PASSWORD RESET</p>
            </div>

            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 px-1">
                <span>Email</span>
                <span>OTP</span>
                <span>Reset</span>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {message}
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {errors.general}
              </div>
            )}

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} noValidate>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your registered email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} noValidate>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit verification code sent to:
                  </p>
                  <p className="text-md font-semibold text-green-700 mt-1">
                    {emailMasked || maskEmailHelper(email)}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`w-full text-center text-3xl font-bold tracking-widest px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                    autoFocus
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm text-center mt-2">{errors.otp}</p>
                  )}
                </div>

                <div className="text-center mb-6">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in <span className="font-semibold text-green-600">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend verification code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate>
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Verified Successfully!</h3>
                  <p className="text-sm text-gray-600 mt-1">Enter your new password below</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
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
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="mb-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center">
                      <span className={`mr-2 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>•</span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>•</span>
                      At least one lowercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>•</span>
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${/(?=.*\d)/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>•</span>
                      At least one number
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Link to Login */}
            <div className="mt-6 text-center">
              <Link to="/Login" className="text-sm text-green-600 hover:text-green-700">
                ← Back to Login
              </Link>
            </div>

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

export default ForgotPassword;
