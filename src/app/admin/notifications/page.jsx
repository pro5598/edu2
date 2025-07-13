// app/admin/notifications/page.jsx
"use client";
import React, { useState } from "react";
import {
  Bell,
  BellOff,
  Plus,
  Send,
  Users,
  UserCheck,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Calendar,
  Filter,
} from "lucide-react";

const AdminNotificationsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    audience: "all",
    scheduledDate: "",
  });

  const notifications = [
    {
      id: 1,
      title: "Platform Maintenance Scheduled",
      message: "We will be performing scheduled maintenance on January 25th from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable.",
      type: "warning",
      audience: "all",
      status: "sent",
      createdDate: "2024-01-20",
      sentDate: "2024-01-20",
      recipients: 15420,
      openRate: 78.5,
    },
    {
      id: 2,
      title: "New Course Categories Available",
      message: "We've added new course categories including Data Science, Machine Learning, and Cloud Computing. Explore these exciting new topics!",
      type: "info",
      audience: "students",
      status: "sent",
      createdDate: "2024-01-18",
      sentDate: "2024-01-18",
      recipients: 12840,
      openRate: 65.2,
    },
    {
      id: 3,
      title: "Instructor Payout Update",
      message: "Your monthly earnings have been processed and will be transferred to your account within 3-5 business days.",
      type: "success",
      audience: "instructors",
      status: "sent",
      createdDate: "2024-01-15",
      sentDate: "2024-01-15",
      recipients: 342,
      openRate: 92.1,
    },
    {
      id: 4,
      title: "Security Alert: Password Policy Update",
      message: "We've updated our password policy to enhance account security. Please update your password to meet the new requirements.",
      type: "alert",
      audience: "all",
      status: "draft",
      createdDate: "2024-01-22",
      sentDate: null,
      recipients: 0,
      openRate: 0,
    },
    {
      id: 5,
      title: "Holiday Sale - 50% Off All Courses",
      message: "Don't miss our biggest sale of the year! Get 50% off all courses until January 31st. Use code HOLIDAY50 at checkout.",
      type: "promotion",
      audience: "students",
      status: "scheduled",
      createdDate: "2024-01-19",
      sentDate: "2024-01-24",
      recipients: 12840,
      openRate: 0,
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "text-blue-600 bg-blue-100";
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "alert":
        return "text-red-600 bg-red-100";
      case "promotion":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      case "promotion":
        return <Bell className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateNotification = () => {
    console.log("Creating notification:", newNotification);
    setShowCreateModal(false);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      audience: "all",
      scheduledDate: "",
    });
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
                <span>Notifications Management</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Send and manage platform-wide notifications
              </p>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notification</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 mb-3">{notification.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Audience: {notification.audience}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(notification.createdDate)}</span>
                        </div>
                        {notification.sentDate && (
                          <div className="flex items-center space-x-1">
                            <Send className="w-4 h-4" />
                            <span>Sent: {formatDate(notification.sentDate)}</span>
                          </div>
                        )}
                        {notification.recipients > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{notification.recipients} recipients</span>
                          </div>
                        )}
                        {notification.openRate > 0 && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{notification.openRate}% open rate</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.status === "draft" && (
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-900 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Create New Notification</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({...prev, title: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter notification title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({...prev, message: e.target.value}))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter notification message"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({...prev, type: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Audience
                  </label>
                  <select
                    value={newNotification.audience}
                    onChange={(e) => setNewNotification(prev => ({...prev, audience: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="instructors">Instructors Only</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Schedule Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduledDate}
                  onChange={(e) => setNewNotification(prev => ({...prev, scheduledDate: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;
