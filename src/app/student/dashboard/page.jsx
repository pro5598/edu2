"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  Star,
  Target,
  ChevronRight,
} from "lucide-react";

const StudentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
        // Fallback to sample data if API fails
        setDashboardData({
          stats: {
            totalCourses: 0,
            activeCourses: 0,
            completedCourses: 0,
            totalHours: 0,
            streak: 0,
            averageRating: 0,
            rank: 0,
          },
          recentCourses: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use the fetched data or show empty state
  const data = dashboardData || {
    stats: {
      totalCourses: 0,
      activeCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      streak: 0,
      averageRating: 0,
      rank: 0,
    },
    recentCourses: [],
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
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{data.stats.totalCourses}</div>
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
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{data.stats.completedCourses}</div>
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
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{data.stats.totalHours}h</div>
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
              <Link href="/student/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {data.recentCourses.length > 0 ? (
                data.recentCourses.map((course) => (
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
                    <Link href={`/student/courses/${course.id}/lessons`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Continue
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course</p>
                  <Link href="/browse-courses">
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Courses
                    </button>
                  </Link>
                </div>
              )}
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
