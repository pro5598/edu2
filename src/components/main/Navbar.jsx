'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - Left Side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-blue-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <span className="text-white font-bold text-xl tracking-wide">Eduverse</span>
              </div>
            </Link>
          </div>

          {/* Desktop Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <button className="px-6 py-2.5 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium">
                Register
              </button>
            </Link>
          </div>

          {/* Mobile menu button - Right Side */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Auth Buttons */}
              <div className="space-y-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full px-4 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
