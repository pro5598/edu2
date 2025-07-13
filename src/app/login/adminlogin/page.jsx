'use client';
import { React, useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Shield, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setMessage(decodeURIComponent(messageParam));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful! Redirecting to admin dashboard...');
        localStorage.setItem('authToken', 'admin-authenticated');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('username', formData.username);
        
        setTimeout(() => {
          router.push(data.redirectPath || '/admin/dashboard');
        }, 1500);
      } else {
        if (response.status === 403 && data.error.includes('inactive')) {
          setError(data.error);
        } else {
          setError(data.error || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f87171' }}>
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/login">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Admin Portal</h1>
          <p className="text-white/80 text-lg">System Administration Access</p>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Admin Login</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto"></div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-sm">{message}</span>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Access Admin Panel</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 font-medium">Secure Admin Access</p>
              </div>
              <p className="text-xs text-red-700 mt-1">
                This is a restricted area. All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Security Quote */}
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-white/90 text-lg italic">
            "With great power comes great responsibility."
          </p>
          <p className="text-white/70 text-sm mt-2">- System Administrator</p>
        </div>
      </div>
    </div>
  );
}
