"use client";
import React, { useState, useEffect } from "react";
import { Save, Edit3, User, Mail, Phone, Calendar, Briefcase, FileText, Camera, RefreshCw, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const StudentProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, statsResponse] = await Promise.all([
        fetch('/api/student/profile'),
        fetch('/api/student/stats')
      ]);

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats data');
      }

      const profileData = await profileResponse.json();
      const statsData = await statsResponse.json();
      
      setProfileData(profileData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <AlertCircle className="h-8 w-8" />
              <span className="ml-3 text-lg">{error}</span>
            </div>
            <div className="text-center">
              <button
                onClick={fetchProfileData}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const profileFields = [
    {
      key: "registrationDate",
      label: "Registration Date",
      icon: Calendar,
      type: "text",
      value: formatDate(profileData.createdAt || profileData.registrationDate),
      editValue: formatDate(profileData.createdAt || profileData.registrationDate),
      readonly: true,
    },
    {
      key: "firstName",
      label: "First Name",
      icon: User,
      type: "text",
      value: profileData.firstName || '',
      editValue: profileData.firstName || '',
    },
    {
      key: "lastName",
      label: "Last Name",
      icon: User,
      type: "text",
      value: profileData.lastName || '',
      editValue: profileData.lastName || '',
    },
    {
      key: "username",
      label: "Username",
      icon: User,
      type: "text",
      value: profileData.username || '',
      editValue: profileData.username || '',
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      type: "email",
      value: profileData.email || '',
      editValue: profileData.email || '',
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      value: profileData.phone || '',
      editValue: profileData.phone || '',
    },
  ];

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
                My Profile
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            
            {/* Profile Actions */}
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Avatar Section */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold shadow-lg">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {profileData.occupation}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Member since {profileData.registrationDate}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {profileFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className={field.key === "registrationDate" ? "lg:col-span-2" : ""}>
                  <label className="block text-sm sm:text-base font-medium text-slate-600 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{field.label}</span>
                    </div>
                  </label>
                  {isEditing && !field.readonly ? (
                    <input
                      type={field.type}
                      value={field.editValue}
                      onChange={(e) => handleProfileUpdate(field.key, e.target.value)}
                      className="w-full p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-800 text-sm sm:text-base">
                        {field.readonly ? field.value : field.editValue}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Occupation Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm sm:text-base font-medium text-slate-600 mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Skill/Occupation</span>
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.occupation || ''}
                  onChange={(e) => handleProfileUpdate('occupation', e.target.value)}
                  className="w-full p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                  placeholder="Enter your occupation"
                />
              ) : (
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-800 text-sm sm:text-base">{profileData.occupation || ''}</p>
                </div>
              )}
            </div>

            {/* Biography Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm sm:text-base font-medium text-slate-600 mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Biography</span>
                </div>
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.bio || ''}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  rows="4"
                  className="w-full p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-none text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    {profileData.bio || ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 sm:hidden">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-base font-medium"
                >
                  Cancel Changes
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Stats */}
         <div className="px-4 sm:px-6 py-4 sm:py-6 bg-slate-50 border-t border-slate-200">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div className="text-center">
               <div className="text-lg sm:text-xl font-bold text-blue-600">{stats?.totalCourses || 0}</div>
               <div className="text-xs sm:text-sm text-slate-600">Courses</div>
             </div>
             <div className="text-center">
               <div className="text-lg sm:text-xl font-bold text-green-600">{stats?.certificates || 0}</div>
               <div className="text-xs sm:text-sm text-slate-600">Certificates</div>
             </div>
             <div className="text-center">
               <div className="text-lg sm:text-xl font-bold text-purple-600">{stats?.totalHours || 0}h</div>
               <div className="text-xs sm:text-sm text-slate-600">Study Time</div>
             </div>
             <div className="text-center">
               <div className="text-lg sm:text-xl font-bold text-orange-600">{stats?.averageRating || '0.0'}</div>
               <div className="text-xs sm:text-sm text-slate-600">Avg Rating</div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
