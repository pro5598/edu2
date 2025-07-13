"use client";

import React, { useState, useEffect } from 'react';
import { Edit, Save, X, User } from 'lucide-react';

export default function InstructorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/instructor/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/instructor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
            <input
               type="text"
               value={formData.lastName || ''}
               onChange={(e) => handleInputChange('lastName', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
            <input
               type="email"
               value={formData.email || ''}
               onChange={(e) => handleInputChange('email', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
            <input
               type="tel"
               value={formData.phone || ''}
               onChange={(e) => handleInputChange('phone', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">Gender</label>
            <select
               value={formData.gender || ''}
               onChange={(e) => handleInputChange('gender', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 mb-2">Date of Birth</label>
            <input
               type="date"
               value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
               onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-2">Experience</label>
            <input
               type="text"
               value={formData.experience || ''}
               onChange={(e) => handleInputChange('experience', e.target.value)}
               placeholder="e.g., 5 years in web development"
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
             />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-2">Biography</label>
            <textarea
               value={formData.bio || ''}
               onChange={(e) => handleInputChange('bio', e.target.value)}
               rows={4}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
               placeholder="Tell us about yourself..."
             />
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(profile?.createdAt)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">First Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.firstName || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.lastName || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Username</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.username || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.email || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not provided'}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(profile?.dateOfBirth)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Experience</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.experience || 'Not provided'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Not provided'}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Biography</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile?.bio || 'No biography provided yet.'}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}