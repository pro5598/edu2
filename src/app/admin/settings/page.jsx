// app/admin/settings/page.jsx
"use client";
import React, { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Database,
  Key,
  Globe,
  Users,
  BookOpen,
  DollarSign,
  Save,
  Eye,
  EyeOff,
  Server,
  Palette,
  Lock,
  AlertTriangle,
  Check,
  X,
  Info,
} from "lucide-react";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [settings, setSettings] = useState({
    general: {
      siteName: "EduPlatform",
      siteTagline: "Learn, Grow, Succeed",
      adminEmail: "admin@eduplatform.com",
      supportEmail: "support@eduplatform.com",
      contactPhone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      language: "en",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      maintenanceMode: false,
      maintenanceMessage: "We're currently performing scheduled maintenance. Please check back soon.",
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      apiKey: "sk-1234567890abcdef1234567890abcdef",
      allowedIPs: "192.168.1.0/24, 10.0.0.0/8",
      sslRequired: true,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      newUserRegistration: true,
      courseSubmissions: true,
      paymentNotifications: true,
      systemAlerts: true,
      weeklyReports: true,
      dailyBackups: true,
      errorReports: true,
      performanceAlerts: false,
    },
    platform: {
      allowUserRegistration: true,
      requireEmailVerification: true,
      autoApproveInstructors: false,
      autoApproveCourses: false,
      enableCourseReviews: true,
      enableDiscussions: true,
      maxFileUploadSize: 100,
      allowedFileTypes: "pdf,doc,docx,ppt,pptx,mp4,mp3,jpg,png",
      commissionRate: 30,
      minCoursePrice: 10,
      maxCoursePrice: 999,
      refundPeriod: 30,
    },
    appearance: {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      accentColor: "#F59E0B",
      darkMode: false,
      customLogo: "",
      favicon: "",
      footerText: "© 2024 EduPlatform. All rights reserved.",
      showBranding: true,
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings, color: 'blue' },
    { id: 'security', label: 'Security', icon: Shield, color: 'red' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
    { id: 'platform', label: 'Platform', icon: Globe, color: 'green' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'purple' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const ToggleSwitch = ({ checked, onChange, color = 'blue' }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="sr-only peer" 
      />
      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${color}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${color}-600`}></div>
    </label>
  );

  const SettingCard = ({ title, description, children, icon: Icon, warning = false }) => (
    <div className={`p-6 rounded-xl border-2 ${warning ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className={`p-2 rounded-lg ${warning ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`w-5 h-5 ${warning ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${warning ? 'text-red-900' : 'text-gray-900'}`}>{title}</h4>
            {children}
          </div>
          <p className={`text-sm ${warning ? 'text-red-700' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure your platform settings and preferences</p>
            </div>
          </div>
          
          {/* Save Status */}
          {saveStatus && (
            <div className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
              saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {saveStatus === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              <span>{saveStatus === 'success' ? 'Settings saved successfully!' : 'Error saving settings. Please try again.'}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-50 text-${tab.color}-700 border-${tab.color}-200 border`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h2>
              </div>

              <div className="p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Tagline</label>
                        <input
                          type="text"
                          value={settings.general.siteTagline}
                          onChange={(e) => updateSetting('general', 'siteTagline', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                        <input
                          type="email"
                          value={settings.general.adminEmail}
                          onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <input
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={settings.general.currency}
                          onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select
                          value={settings.general.dateFormat}
                          onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <SettingCard
                      title="Maintenance Mode"
                      description="Temporarily disable site access for maintenance"
                      icon={AlertTriangle}
                      warning={settings.general.maintenanceMode}
                    >
                      <ToggleSwitch
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                        color="red"
                      />
                    </SettingCard>

                    {settings.general.maintenanceMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                        <textarea
                          value={settings.general.maintenanceMessage}
                          onChange={(e) => updateSetting('general', 'maintenanceMessage', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingCard
                        title="Two-Factor Authentication"
                        description="Require 2FA for admin accounts"
                        icon={Lock}
                      >
                        <ToggleSwitch
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                          color="green"
                        />
                      </SettingCard>

                      <SettingCard
                        title="SSL Required"
                        description="Force HTTPS connections"
                        icon={Shield}
                      >
                        <ToggleSwitch
                          checked={settings.security.sslRequired}
                          onChange={(e) => updateSetting('security', 'sslRequired', e.target.checked)}
                          color="green"
                        />
                      </SettingCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          value={settings.security.lockoutDuration}
                          onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={settings.security.apiKey}
                          onChange={(e) => updateSetting('security', 'apiKey', e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingCard
                        title="Require Uppercase Letters"
                        description="Passwords must contain uppercase letters"
                        icon={Key}
                      >
                        <ToggleSwitch
                          checked={settings.security.requireUppercase}
                          onChange={(e) => updateSetting('security', 'requireUppercase', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Require Special Characters"
                        description="Passwords must contain special characters"
                        icon={Key}
                      >
                        <ToggleSwitch
                          checked={settings.security.requireSpecialChars}
                          onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
                        />
                      </SettingCard>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SettingCard
                        title="Email Notifications"
                        description="Enable email notifications"
                        icon={Mail}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.emailEnabled}
                          onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                          color="blue"
                        />
                      </SettingCard>

                      <SettingCard
                        title="SMS Notifications"
                        description="Enable SMS notifications"
                        icon={Bell}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.smsEnabled}
                          onChange={(e) => updateSetting('notifications', 'smsEnabled', e.target.checked)}
                          color="green"
                        />
                      </SettingCard>

                      <SettingCard
                        title="Push Notifications"
                        description="Enable push notifications"
                        icon={Bell}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.pushEnabled}
                          onChange={(e) => updateSetting('notifications', 'pushEnabled', e.target.checked)}
                          color="purple"
                        />
                      </SettingCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingCard
                        title="New User Registration"
                        description="Notify when new users register"
                        icon={Users}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.newUserRegistration}
                          onChange={(e) => updateSetting('notifications', 'newUserRegistration', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Course Submissions"
                        description="Notify when courses are submitted"
                        icon={BookOpen}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.courseSubmissions}
                          onChange={(e) => updateSetting('notifications', 'courseSubmissions', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Payment Notifications"
                        description="Notify about payments"
                        icon={DollarSign}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.paymentNotifications}
                          onChange={(e) => updateSetting('notifications', 'paymentNotifications', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="System Alerts"
                        description="Critical system notifications"
                        icon={AlertTriangle}
                      >
                        <ToggleSwitch
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                          color="red"
                        />
                      </SettingCard>
                    </div>
                  </div>
                )}

                {/* Platform Settings */}
                {activeTab === 'platform' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingCard
                        title="User Registration"
                        description="Allow new user registrations"
                        icon={Users}
                      >
                        <ToggleSwitch
                          checked={settings.platform.allowUserRegistration}
                          onChange={(e) => updateSetting('platform', 'allowUserRegistration', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Email Verification"
                        description="Require email verification"
                        icon={Mail}
                      >
                        <ToggleSwitch
                          checked={settings.platform.requireEmailVerification}
                          onChange={(e) => updateSetting('platform', 'requireEmailVerification', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Auto-Approve Instructors"
                        description="Automatically approve instructor applications"
                        icon={Users}
                      >
                        <ToggleSwitch
                          checked={settings.platform.autoApproveInstructors}
                          onChange={(e) => updateSetting('platform', 'autoApproveInstructors', e.target.checked)}
                        />
                      </SettingCard>

                      <SettingCard
                        title="Auto-Approve Courses"
                        description="Automatically approve course submissions"
                        icon={BookOpen}
                      >
                        <ToggleSwitch
                          checked={settings.platform.autoApproveCourses}
                          onChange={(e) => updateSetting('platform', 'autoApproveCourses', e.target.checked)}
                        />
                      </SettingCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                        <input
                          type="number"
                          value={settings.platform.commissionRate}
                          onChange={(e) => updateSetting('platform', 'commissionRate', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Course Price ($)</label>
                        <input
                          type="number"
                          value={settings.platform.minCoursePrice}
                          onChange={(e) => updateSetting('platform', 'minCoursePrice', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Course Price ($)</label>
                        <input
                          type="number"
                          value={settings.platform.maxCoursePrice}
                          onChange={(e) => updateSetting('platform', 'maxCoursePrice', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.secondaryColor}
                            onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.secondaryColor}
                            onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.accentColor}
                            onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.accentColor}
                            onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <SettingCard
                      title="Show Platform Branding"
                      description="Display 'Powered by EduPlatform' in footer"
                      icon={Info}
                    >
                      <ToggleSwitch
                        checked={settings.appearance.showBranding}
                        onChange={(e) => updateSetting('appearance', 'showBranding', e.target.checked)}
                      />
                    </SettingCard>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                      <input
                        type="text"
                        value={settings.appearance.footerText}
                        onChange={(e) => updateSetting('appearance', 'footerText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Changes will be applied immediately after saving.
                  </p>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
