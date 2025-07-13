"use client";
import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  Search,
  Menu,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Eduverse</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">Home <span className="ml-1">▾</span></a>
          <a href="#courses" className="text-gray-700 hover:text-purple-600 transition-colors">Courses <span className="ml-1">▾</span></a>
          <a href="#dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard <span className="ml-1">▾</span></a>
          <a href="#pages" className="text-gray-700 hover:text-purple-600 transition-colors">Pages <span className="ml-1">▾</span></a>
          <a href="#elements" className="text-gray-700 hover:text-purple-600 transition-colors">Elements <span className="ml-1">▾</span></a>
          <a href="#blog" className="text-gray-700 hover:text-purple-600 transition-colors">Blog <span className="ml-1">▾</span></a>
        </nav>

        {/* User Icons */}
        <div className="flex items-center space-x-4">
          {/* Profile Icon */}
          <button className="text-gray-700 hover:text-purple-600 transition-colors">
            <Users className="w-6 h-6" />
          </button>

          {/* Cart Icon */}
          <button className="text-gray-700 hover:text-purple-600 transition-colors">
            <ShoppingBag className="w-6 h-6" />
          </button>

          {/* Search Icon */}
          <button className="text-gray-700 hover:text-purple-600 transition-colors">
            <Search className="w-6 h-6" />
          </button>
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
        <div className="md:hidden bg-white border-t py-4">
          <div className="flex flex-col space-y-4">
            <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
            <a href="#courses" className="text-gray-700 hover:text-purple-600 transition-colors">Courses</a>
            <a href="#dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</a>
            <a href="#pages" className="text-gray-700 hover:text-purple-600 transition-colors">Pages</a>
            <a href="#elements" className="text-gray-700 hover:text-purple-600 transition-colors">Elements</a>
            <a href="#blog" className="text-gray-700 hover:text-purple-600 transition-colors">Blog</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;