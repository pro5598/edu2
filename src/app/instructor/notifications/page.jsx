// app/instructor/notifications/page.jsx
"use client";
import React, { useState, useEffect } from "react";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [showUnreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const unreadParam = showUnreadOnly ? '&unreadOnly=true' : '';
      const response = await fetch(`/api/instructor/notifications?page=1&limit=50${unreadParam}`);
      
      if (response.ok) {
        const data = await response.json();
        const formattedNotifications = data.notifications.map(notification => ({
          ...notification,
          icon: getNotificationIcon(notification.type),
          color: getNotificationColor(notification.type)
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'enrollment': return User;
      case 'review': return Star;
      case 'submission': return Upload;
      case 'assignment': return Upload;
      case 'message': return MessageSquare;
      case 'completion': return CheckCircle;
      case 'system': return BarChart3;
      default: return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'enrollment': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'submission': return 'text-green-600 bg-green-100';
      case 'assignment': return 'text-green-600 bg-green-100';
      case 'message': return 'text-purple-600 bg-purple-100';
      case 'completion': return 'text-green-600 bg-green-100';
      case 'system': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    return matchesReadStatus;
  });

  const markAsRead = async (id) => {
    try {
      const response = await fetch('/api/instructor/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: id,
          action: 'markAsRead'
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAsUnread = async (id) => {
    try {
      const response = await fetch('/api/instructor/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: id,
          action: 'markAsUnread'
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: false }
              : notification
          )
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/instructor/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: null,
          action: 'markAllAsRead'
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/instructor/notifications?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
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
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading notifications...
              </h3>
            </div>
          ) : filteredNotifications.length > 0 ? (
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
