// app/instructor/notifications/page.jsx
"use client";
import React, { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCircle,
  User,
  BookOpen,
  MessageSquare,
  Star,
  Upload,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
} from "lucide-react";

const InstructorNotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "enrollment",
      title: "New Student Enrollment",
      message: "Sarah Johnson enrolled in your React Masterclass 2024 course",
      time: "2 hours ago",
      read: false,
      icon: User,
      color: "text-blue-600 bg-blue-100",
      course: "React Masterclass 2024",
    },
    {
      id: 2,
      type: "review",
      title: "New Course Review",
      message: "Mike Chen left a 5-star review for JavaScript Fundamentals",
      time: "4 hours ago",
      read: false,
      icon: Star,
      color: "text-yellow-600 bg-yellow-100",
      course: "JavaScript Fundamentals",
    },
    {
      id: 3,
      type: "assignment",
      title: "Assignment Submitted",
      message: "Emma Wilson submitted the React Todo App assignment",
      time: "6 hours ago",
      read: true,
      icon: Upload,
      color: "text-green-600 bg-green-100",
      course: "React Masterclass 2024",
    },
    {
      id: 4,
      type: "message",
      title: "New Student Message",
      message: "David Rodriguez sent you a message about the Node.js course",
      time: "8 hours ago",
      read: true,
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-100",
      course: "Node.js Complete Guide",
    },
    {
      id: 5,
      type: "completion",
      title: "Course Completion",
      message: "15 students completed your Angular Zero to Mastery course",
      time: "1 day ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      course: "Angular Zero to Mastery",
    },
    {
      id: 6,
      type: "enrollment",
      title: "New Student Enrollment",
      message: "Alex Thompson enrolled in your PHP Beginner to Advanced course",
      time: "1 day ago",
      read: true,
      icon: User,
      color: "text-blue-600 bg-blue-100",
      course: "PHP Beginner to Advanced",
    },
    {
      id: 7,
      type: "review",
      title: "New Course Review",
      message: "Lisa Anderson left a 4-star review for Node.js Complete Guide",
      time: "2 days ago",
      read: true,
      icon: Star,
      color: "text-yellow-600 bg-yellow-100",
      course: "Node.js Complete Guide",
    },
    {
      id: 8,
      type: "system",
      title: "Course Analytics Update",
      message: "Your monthly course analytics report is now available",
      time: "3 days ago",
      read: true,
      icon: BarChart3,
      color: "text-indigo-600 bg-indigo-100",
      course: null,
    },
  ]);

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    return matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getTimeColor = (read) => {
    return read ? "text-gray-500" : "text-blue-600";
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Stay updated with your course activities and student interactions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showUnreadOnly 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showUnreadOnly ? 'Show All' : 'Unread Only'}</span>
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${notification.color} flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          {notification.course && (
                            <div className="flex items-center space-x-1 mt-2">
                              <BookOpen className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{notification.course}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`text-xs ${getTimeColor(notification.read)}`}>
                            {notification.time}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            {notification.read ? (
                              <button
                                onClick={() => markAsUnread(notification.id)}
                                className="p-1 text-gray-500 hover:text-blue-600 rounded"
                                title="Mark as unread"
                              >
                                <BellOff className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:text-blue-700 rounded"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-500 hover:text-red-600 rounded"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showUnreadOnly 
                  ? "No unread notifications" 
                  : "No notifications yet"}
              </h3>
              <p className="text-gray-600">
                {showUnreadOnly
                  ? "All notifications have been read"
                  : "You'll see notifications here when students interact with your courses"}
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default InstructorNotificationsPage;
