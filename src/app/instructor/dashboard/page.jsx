"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  User,
  List,
  Bell,
  Settings,
} from "lucide-react";
import Link from "next/link";

const InstructorDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("7days");

  // Sample data - replace with real data from your API
  const dashboardData = {
    stats: {
      totalCourses: 8,
      totalRevenue: 45890,
      totalReviews: 342,
      completionRate: 87,
    },
    recentActivity: [
      {
        id: 1,
        type: "enrollment",
        message: "5 new students enrolled in React Masterclass",
        time: "2 hours ago",
        icon: Users,
        color: "text-blue-600 bg-blue-100",
      },
      {
        id: 2,
        type: "review",
        message: "New 5-star review for JavaScript Fundamentals",
        time: "4 hours ago",
        icon: Star,
        color: "text-yellow-600 bg-yellow-100",
      },
      {
        id: 3,
        type: "completion",
        message: "12 students completed Node.js Course",
        time: "6 hours ago",
        icon: Award,
        color: "text-green-600 bg-green-100",
      },
      {
        id: 4,
        type: "message",
        message: "3 new messages from students",
        time: "1 day ago",
        icon: MessageSquare,
        color: "text-purple-600 bg-purple-100",
      },
    ],
    topCourses: [
      {
        id: 1,
        title: "React Masterclass 2024",
        revenue: 18450,
        rating: 4.9,
        reviews: 156,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        revenue: 12340,
        rating: 4.7,
        reviews: 98,
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
      },
      {
        id: 3,
        title: "Node.js Complete Guide",
        revenue: 9870,
        rating: 4.8,
        reviews: 76,
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
      },
    ],
    recentReviews: [
      {
        id: 1,
        student: "Sarah Johnson",
        course: "React Masterclass 2024",
        rating: 5,
        comment: "Excellent course! Very detailed and well-structured.",
        time: "2 days ago",
      },
      {
        id: 2,
        student: "Mike Chen",
        course: "JavaScript Fundamentals",
        rating: 5,
        comment: "Perfect for beginners. Great explanations!",
        time: "3 days ago",
      },
      {
        id: 3,
        student: "Emma Wilson",
        course: "Node.js Complete Guide",
        rating: 4,
        comment: "Good content, would love more practical examples.",
        time: "4 days ago",
      },
    ],
    monthlyData: [
      { month: "Jan", revenue: 3200, students: 45 },
      { month: "Feb", revenue: 4100, students: 62 },
      { month: "Mar", revenue: 3800, students: 58 },
      { month: "Apr", revenue: 5200, students: 78 },
      { month: "May", revenue: 4900, students: 71 },
      { month: "Jun", revenue: 6100, students: 89 },
    ],
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${dashboardData.stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Top Performing Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>Your courses</span>
                </h2>
                <Link href="/instructor/my-courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {dashboardData.topCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                    </div>
                    <Link href={`/instructor/my-courses/${course.id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Manage
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
         

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Recent Reviews</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {dashboardData.recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{review.student}</span>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{review.comment}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{review.course}</span>
                      <span className="text-xs text-gray-500">{review.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default InstructorDashboardPage;
