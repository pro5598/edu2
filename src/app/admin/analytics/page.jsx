"use client";
import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
} from "lucide-react";

const AdminAnalyticsPage = () => {
  const analyticsData = {
    overview: {
      totalRevenue: 245_890,
      totalUsers: 15_420,
      totalCourses: 1_250,
      activeInstructors: 342,
    },
    topCategories: [
      { name: "Web Development", courses: 450, revenue: 89_500, students: 5_420 },
      { name: "Data Science",     courses: 280, revenue: 67_800, students: 3_250 },
      { name: "Mobile Development", courses: 220, revenue: 45_600, students: 2_180 },
      { name: "UI/UX Design",     courses: 180, revenue: 32_400, students: 1_890 },
      { name: "DevOps",           courses: 120, revenue: 28_900, students: 1_240 },
    ],
    topInstructors: [
      { name: "John Smith",   courses: 8, students: 2_450, revenue: 28_500 },
      { name: "Sarah Johnson",courses: 6, students: 1_890, revenue: 22_300 },
      { name: "Mike Chen",    courses: 5, students: 1_650, revenue: 19_800 },
      { name: "Emma Wilson",  courses: 4, students: 1_420, revenue: 16_900 },
    ],
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
            <span>Analytics Dashboard</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-1">
            Platform performance and insights
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${analyticsData.overview.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.overview.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.overview.totalCourses.toLocaleString()}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Active Instructors</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.overview.activeInstructors}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Categories */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Top Categories</span>
              </h3>
              <div className="space-y-4">
                {analyticsData.topCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{cat.name}</h4>
                      <p className="text-sm text-gray-700">
                        {cat.courses} courses • {cat.students} students
                      </p>
                    </div>
                    <p className="font-bold text-green-600">
                      ${cat.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Instructors */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Top Instructors</span>
              </h3>
              <div className="space-y-4">
                {analyticsData.topInstructors.map((inst, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{inst.name}</h4>
                      <p className="text-sm text-gray-700">
                        {inst.courses} courses • {inst.students} students
                      </p>
                    </div>
                    <p className="font-bold text-green-600">
                      ${inst.revenue.toLocaleString()}
                    </p>
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

export default AdminAnalyticsPage;
