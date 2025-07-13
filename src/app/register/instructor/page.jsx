'use client';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, UserCheck, ArrowLeft, BookOpen, Award, FileText, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InstructorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    expertise: '',
    experience: '',
    education: '',
    bio: '',
    linkedinProfile: '',
    portfolio: '',
    agreeToTerms: false,
    agreeToInstructorTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.expertise) {
      errors.expertise = 'Area of expertise is required';
    }
    
    if (!formData.experience) {
      errors.experience = 'Experience level is required';
    }
    
    if (!formData.education.trim()) {
      errors.education = 'Education information is required';
    }
    
    if (!formData.bio.trim()) {
      errors.bio = 'Professional bio is required';
    } else if (formData.bio.trim().length < 50) {
      errors.bio = 'Bio must be at least 50 characters long';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData.agreeToInstructorTerms) {
      errors.agreeToInstructorTerms = 'You must agree to the instructor agreement';
    }
    
    return errors;
  };

  const parseFullName = (fullName) => {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  const generateUsername = (email, firstName, lastName) => {
    const emailPrefix = email.split('@')[0];
    const baseUsername = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`.replace(/[^a-z0-9_]/g, '');
    return baseUsername || emailPrefix;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setFieldErrors({});
    
    try {
      const { firstName, lastName } = parseFullName(formData.fullName);
      const username = generateUsername(formData.email, firstName, lastName);
      
      const registrationData = {
        username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName,
        lastName,
        phone: formData.phone,
        bio: formData.bio,
        expertise: formData.expertise,
        experience: formData.experience,
        education: formData.education,
        linkedinProfile: formData.linkedinProfile || undefined,
        portfolio: formData.portfolio || undefined
      };
      
      const response = await fetch('/api/auth/instructor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login/instructorlogin?message=registration-pending');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#10b981' }}>
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/register">
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
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Become an Instructor</h1>
          <p className="text-white/80 text-lg">Share your knowledge and inspire learners worldwide</p>
        </div>

        {/* Registration Form Container */}
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Instructor Application</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Fill out this form to apply as an instructor. We'll review your application and get back to you.</p>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-700 font-medium">Registration Successful!</p>
                  <p className="text-green-600 text-sm">Your application has been submitted for review. You'll be redirected to the login page shortly.</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      required
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Expertise */}
                  <div>
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                      Area of Expertise *
                    </label>
                    <select
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 ${
                        fieldErrors.expertise ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select your expertise</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Business">Business</option>
                      <option value="Photography">Photography</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.expertise && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.expertise}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Professional Background
                </h3>
                
                <div className="space-y-4">
                  {/* Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 ${
                        fieldErrors.experience ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {fieldErrors.experience && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.experience}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Education *
                    </label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        fieldErrors.education ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Bachelor's in Computer Science"
                      required
                    />
                    {fieldErrors.education && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.education}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        fieldErrors.bio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your professional background, achievements, and teaching philosophy..."
                      required
                    />
                    {fieldErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.bio}</p>
                    )}
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      type="url"
                      id="linkedinProfile"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Website (Optional)
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-green-600" />
                  Account Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Create a strong password"
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
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          fieldErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-0.5"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {fieldErrors.agreeToTerms && (
                  <p className="text-sm text-red-600">{fieldErrors.agreeToTerms}</p>
                )}

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToInstructorTerms"
                    checked={formData.agreeToInstructorTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-0.5"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/instructor-agreement" className="text-green-600 hover:text-green-700 font-medium">
                      Instructor Agreement
                    </Link>{' '}
                    and understand the course creation guidelines
                  </span>
                </label>
                {fieldErrors.agreeToInstructorTerms && (
                  <p className="text-sm text-red-600">{fieldErrors.agreeToInstructorTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>Submit Application</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Application Notice */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">Application Review Process</p>
              </div>
              <p className="text-xs text-green-700">
                Your application will be reviewed by our team within 3-5 business days. We'll contact you via email with the next steps.
              </p>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an instructor account?{' '}
                <Link href="/login/instructorlogin" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-white/90 text-lg italic">
            "Teaching is the profession that teaches all the other professions."
          </p>
          <p className="text-white/70 text-sm mt-2">- Unknown</p>
        </div>
      </div>
    </div>
  );
}
