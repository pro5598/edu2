// app/admin/dashboard/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Activity,
  BarChart3,
  MessageSquare,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalInstructors: 0,
      totalCourses: 0,
      totalRevenue: 0,
      activeUsers: 0,
      pendingApprovals: 0,
    },
    recentActivity: [],
    topCourses: [],
    recentUsers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const iconMap = {
    Users,
    UserCheck,
    BookOpen,
    DollarSign,
    TrendingUp,
    Activity,
    AlertTriangle
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      
      const processedData = {
        ...data,
        recentActivity: data.recentActivity.map(activity => ({
          ...activity,
          icon: iconMap[activity.icon] || Activity
        }))
      };
      
      setDashboardData(processedData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Instructors</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalInstructors}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Courses</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.totalCourses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Top Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Top Performing Courses</span>
                </h2>
                <Link href="/admin/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {dashboardData.topCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-700">by {course.instructor}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-700">{course.students} students</span>
                        <span className="text-sm font-medium text-green-600">${course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Recent Activity</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Recent Users</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {dashboardData.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-600">{user.type} • {user.joinDate}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Manage Users</span>
              </button>
            </Link>
            <Link href="/admin/instructors">
              <button className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors w-full">
                <UserCheck className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-700">Instructors</span>
              </button>
            </Link>
            <Link href="/admin/courses">
              <button className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors w-full">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Courses</span>
              </button>
            </Link>
            <Link href="/admin/analytics">
              <button className="flex flex-col items-center space-y-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors w-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Analytics</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
