"use client";
import React, { useState } from "react";
import {
  User,
  Shield,
  Eye,
  EyeOff,
  Save,
  Check,
  X,
  Key,
  Settings as SettingsIcon,
  HelpCircle,
} from "lucide-react";

const StudentSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log("Password change submitted:", passwordForm);
    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveSettings = () => {
    console.log("Settings saved");
    alert("Settings saved successfully!");
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 8) return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (password.length < 12) return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="Emily"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Hannah"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="emily.hannah@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1-202-555-0174"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Change Password</span>
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {passwordStrength.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Password should be at least 8 characters with uppercase, lowercase, numbers, and symbols
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500 bg-white font-medium"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>Passwords don't match</span>
              </p>
            )}
            {passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
              <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Passwords match</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountTab();
      case "security":
        return renderSecurityTab();
      default:
        return renderAccountTab();
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>Settings</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Manage your account preferences and security settings
              </p>
            </div>
            
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200">
            <nav className="p-4 sm:p-6">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500 font-medium"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderTabContent()}
            
            {/* Save Button */}
            {activeTab !== "security" && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
