/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpData, setOtpData] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          
          const response = await fetch(`${API_BASE_URL}/api/auth/validate-token/`, {
            headers: { 
              'Authorization': tokenValue,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (user) refreshToken();
    }, 55 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (email, password, forceLogout = false, otpCode = null) => {
    setError(null);
    
    try {
      const body = { email, password };
      if (forceLogout) body.force_logout = true;
      if (otpCode) body.otp_code = otpCode;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      // Case 1: Active session exists
      if (response.status === 409 && data.code === 'ACTIVE_SESSION_EXISTS') {
        return { 
          success: false, 
          conflict: true,
          force_logout_available: data.force_logout_available,
          error: data.error 
        };
      }
      
      // Case 2: OTP required after force logout
      if (data.code === 'OTP_REQUIRED') {
        setOtpData({
          email: email,
          password: password,
          email_masked: data.email_masked
        });
        return { 
          success: false, 
          otp_required: true,
          email_masked: data.email_masked,
          message: data.message
        };
      }
      console.log('Login response data:', data);
      // Case 3: Login failed
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Invalid credentials');
      }
      
      // Case 4: Login success
      const token = data.access || data.token || data.access_token;
      const refresh_token = data.refresh || data.refresh_token;
      let userData = data.user || {};
      
      if (!token) throw new Error('Authentication Error');
      
      if (!userData.email) userData.email = email;
      if (!userData.role) userData.role = 'user';
      
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (data.session_id) localStorage.setItem('session_id', data.session_id);
      
      setUser(userData);
      setOtpData(null);
      return { success: true, user: userData };
      
    } catch (err) {
      const errorMessage = err.message || String(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resendForceLogoutOtp = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-force-logout-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to resend OTP' };
    }
  };

  const requestPasswordResetOtp = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const verifyPasswordResetOtp = async (email, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-password-reset-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code: otpCode }),
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to verify OTP' };
    }
  };

  const resetPassword = async (userId, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          new_password: newPassword, 
          confirm_password: confirmPassword 
        }),
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to reset password' };
    }
  };

  const logout = () => { 
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(error => {
      if (error) return null;
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('session_id');
    setUser(null);
    setOtpData(null);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return logout();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token || data.access);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['Authorization'] = tokenValue;
    }
    
    return headers;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    getAuthHeaders,
    otpData,
    setOtpData,
    resendForceLogoutOtp,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};