"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  BarChart3,
  Shield,
  MessageSquare,
  CreditCard,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    email: "admin@example.com",
    title: "System Administrator",
    bio: "Managing the learning platform and ensuring smooth operations.",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const response = await fetch('/api/admin/profile')
          if (response.ok) {
            const data = await response.json()
            setProfileData({
              firstName: data.firstName || "Admin",
              lastName: data.lastName || "User",
              username: data.username || "admin",
              email: data.email || "admin@example.com",
              title: data.title || "System Administrator",
              bio: data.bio || "Managing the learning platform and ensuring smooth operations.",
            })
          }
        } catch (error) {
          console.error('Error fetching profile data:', error)
        }
      }
    }

    fetchProfileData()
  }, [user])

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      id: "instructors",
      label: "Instructors",
      icon: UserCheck,
      href: "/admin/instructors",
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      href: "/admin/payments",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
  ];

  const userActions = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    { id: "logout", label: "Logout", icon: LogOut, action: "logout" },
  ];

  const handleLogout = async () => {
    await logout();
    closeSidebar();
  };

  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-300 via-orange-300 via-30% to-white to-50%">
      {/* Header Section */}
      <div className="relative z-30">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 mb-1">
                  {profileData.title}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {profileData.firstName}{profileData.lastName ? ` ${profileData.lastName}` : ''}
                </h1>
                <div className="text-sm text-gray-700 mt-1">
                  Admin Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-lg shadow-lg border border-slate-200"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-slate-600" />
        ) : (
          <Menu className="w-6 h-6 text-slate-600" />
        )}
      </button>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5">
        <div className="flex flex-col lg:flex-row min-h-[600px] relative">

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[45]"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed lg:sticky lg:top-0
              top-0 left-0 
              h-screen lg:h-screen
              w-80 max-w-[85vw] lg:w-80 lg:max-w-none
              bg-white rounded-r-xl lg:rounded-l-xl lg:rounded-r-none
              border-r lg:border border-slate-200 shadow-lg lg:shadow-sm
              transform transition-transform duration-300 ease-in-out z-[50] lg:z-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <div className="text-slate-700 text-sm mb-6 mt-12 lg:mt-0">
                WELCOME, {profileData.firstName || 'Admin'}!
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = isActive(item.href);
                  return (
                    <Link href={item.href} key={item.id} passHref>
                      <button
                        onClick={closeSidebar}
                        className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 border-r-4 text-sm sm:text-base ${isCurrent
                            ? "bg-red-50 text-red-700 border-red-500 font-semibold"
                            : "text-slate-700 hover:bg-slate-100 border-transparent hover:text-slate-900"
                          }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-200">
                <div className="text-slate-600 text-xs font-semibold mb-4 tracking-wider">
                  ADMIN
                </div>
                <nav className="space-y-2">
                  {userActions.map((item) => {
                    const Icon = item.icon;

                    if (item.action === "logout") {
                      return (
                        <button
                          key={item.id}
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm sm:text-base"
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    }

                    return (
                      <Link href={item.href} key={item.id} passHref>
                        <button
                          onClick={closeSidebar}
                          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm sm:text-base"
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 rounded-xl lg:rounded-l-none lg:rounded-r-xl min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
