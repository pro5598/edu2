"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  Star,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const StudentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data - replace with real data from your API
  const dashboardData = {
    stats: {
      totalCourses: 12,
      activeCourses: 3,
      completedCourses: 9,
      totalHours: 156,
      streak: 12,
      averageRating: 4.8,
      rank: 85,
    },
    recentCourses: [
      {
        id: 1,
        title: "React Advanced Patterns",
        progress: 75,
        lastAccessed: "2 hours ago",
        nextLesson: "Custom Hooks Deep Dive",
        instructor: "John Doe",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
        timeLeft: "2h 30m",
        difficulty: "Advanced",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        progress: 100,
        lastAccessed: "1 day ago",
        nextLesson: "Course Completed",
        instructor: "Jane Smith",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
        timeLeft: "Completed",
        difficulty: "Beginner",
      },
      {
        id: 3,
        title: "UI/UX Design Principles",
        progress: 45,
        lastAccessed: "3 days ago",
        nextLesson: "Color Theory Basics",
        instructor: "Mike Johnson",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
        timeLeft: "4h 15m",
        difficulty: "Intermediate",
      },
    ],
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalCourses}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.completedCourses}</div>
              <div className="text-xs sm:text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalHours}h</div>
              <div className="text-xs sm:text-sm text-gray-500">Study Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section - Now Full Width */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Play className="w-5 h-5 text-blue-600" />
                <span>Continue Learning</span>
              </h2>
              <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {dashboardData.recentCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Next: {course.nextLesson}</p>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}/lessons`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Continue
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/browse-courses">
              <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Browse Courses</span>
              </button>
            </Link>
            <Link href="/wishlist">
              <button className="flex flex-col items-center space-y-2 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors w-full">
                <Star className="w-6 h-6 text-pink-600" />
                <span className="text-sm font-medium text-pink-700">Wishlist</span>
              </button>
            </Link>
            <Link href="/reviews">
              <button className="flex flex-col items-center space-y-2 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors w-full">
                <Star className="w-6 h-6 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">My Reviews</span>
              </button>
            </Link>
            <Link href="/settings">
              <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full">
                <Target className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Settings</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
