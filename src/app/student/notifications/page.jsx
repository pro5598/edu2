"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Check,
  X,
  Clock,
  BookOpen,
  ShoppingCart,
  Star,
  Heart,
  Settings,
  Trash2,
  Filter,
  Search,
} from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "course",
      title: "New Course Available",
      message: "Advanced React Development course is now available for enrollment.",
      timestamp: "2025-07-13T10:30:00Z",
      isRead: false,
      icon: BookOpen,
      color: "blue",
    },
    {
      id: 2,
      type: "order",
      title: "Order Confirmed",
      message: "Your order #12345 has been confirmed and is being processed.",
      timestamp: "2025-07-13T09:15:00Z",
      isRead: false,
      icon: ShoppingCart,
      color: "green",
    },
    {
      id: 3,
      type: "review",
      title: "Course Review Request",
      message: "Please review your completed course 'JavaScript Fundamentals'.",
      timestamp: "2025-07-12T16:45:00Z",
      isRead: true,
      icon: Star,
      color: "yellow",
    },
    {
      id: 4,
      type: "wishlist",
      title: "Wishlist Item on Sale",
      message: "Python for Beginners from your wishlist is now 50% off!",
      timestamp: "2025-07-12T14:20:00Z",
      isRead: false,
      icon: Heart,
      color: "red",
    },
    {
      id: 5,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2-4 AM EST.",
      timestamp: "2025-07-12T12:00:00Z",
      isRead: true,
      icon: Settings,
      color: "gray",
    },
    {
      id: 6,
      type: "course",
      title: "Course Progress Update",
      message: "You're 75% complete with 'Web Development Bootcamp'. Keep going!",
      timestamp: "2025-07-11T18:30:00Z",
      isRead: true,
      icon: BookOpen,
      color: "purple",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "unread" && !notification.isRead) ||
      (filter === "read" && notification.isRead);
    
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationItem = ({ notification }) => {
    const Icon = notification.icon;
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600",
      gray: "bg-gray-100 text-gray-700", // Changed from text-gray-600 to text-gray-700
      purple: "bg-purple-100 text-purple-600",
    };

    return (
      <div
        className={`p-4 border border-slate-300 rounded-lg transition-all duration-200 hover:shadow-md ${
          notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${colorClasses[notification.color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${
                  notification.isRead ? "text-slate-800" : "text-slate-900"
                }`}>
                  {notification.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  notification.isRead ? "text-slate-600" : "text-slate-700"
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  {!notification.isRead && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                  title={notification.isRead ? "Mark as unread" : "Mark as read"}
                >
                  <Check className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-300 h-20 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <BellRing className="w-6 h-6 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-slate-700 mt-1">Stay updated with your latest activities</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={unreadCount === 0}
          >
            Mark All Read
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>



      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {notifications.length === 0 ? "No notifications yet" : "No notifications found"}
            </h3>
            <p className="text-slate-600">
              {notifications.length === 0 
                ? "You'll see notifications here when you have new activities."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
