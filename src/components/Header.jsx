"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShoppingBag,
  Search,
  Menu,
  X,
  BookOpen,
  GraduationCap,
  User,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">EduVerse</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Home
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Courses
          </Link>
          {user && (
            <Link href={`/${user.role}`} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Dashboard
            </Link>
          )}
          {user?.role === 'instructor' && (
            <Link href="/instructor/courses" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              My Courses
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Cart Icon (only for students) */}
              {user.role === 'student' && (
                <Link href="/student/cart" className="relative text-gray-700 hover:text-purple-600 transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}
              
              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">{user.firstName}</span>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link href="/login">
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </Link>
              
              {/* Register Button */}
              <Link href="/register">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <div className="flex flex-col space-y-4">
            {/* Navigation Links */}
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Courses
            </Link>
            
            {user && (
              <>
                <Link href={`/${user.role}`} onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Dashboard
                </Link>
                {user.role === 'instructor' && (
                  <Link href="/instructor/courses" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                    My Courses
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                    Admin Panel
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link href="/student/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart ({cartItems.length})</span>
                  </Link>
                )}
              </>
            )}
            
            {/* User Actions */}
            <div className="border-t pt-4 mt-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700 font-medium">{user.firstName} {user.lastName}</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;