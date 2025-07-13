"use client";
import React from 'react';
import { BookOpen, Award, MessageCircle, TrendingUp, Home, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const StudentPanelFooter = ({ userProgress = { completed: 42, total: 100 } }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Progress Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Your Progress
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">This Week</span>
                <span className="text-slate-800 font-medium">{userProgress.completed}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${userProgress.completed}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500">Keep going! You're doing great!</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-green-600" />
              Quick Actions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/student/continue" className="text-blue-600 hover:text-blue-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Continue Last Lesson
                </Link>
              </li>
              <li>
                <Link href="/student/certificates" className="text-slate-600 hover:text-slate-800 flex items-center">
                  <Award className="w-3 h-3 mr-2" />
                  My Certificates
                </Link>
              </li>
              <li>
                <Link href="/student/discussions" className="text-slate-600 hover:text-slate-800 flex items-center">
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Join Discussions
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Paths */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Explore More</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses/web-development" className="text-slate-600 hover:text-blue-600">Web Development</Link></li>
              <li><Link href="/courses/data-science" className="text-slate-600 hover:text-blue-600">Data Science</Link></li>
              <li><Link href="/courses/design" className="text-slate-600 hover:text-blue-600">UI/UX Design</Link></li>
              <li><Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">Browse All Courses →</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-purple-600" />
              Need Help?
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-slate-600 hover:text-slate-800">Help Center</Link></li>
              <li><Link href="/support" className="text-slate-600 hover:text-slate-800">Contact Support</Link></li>
              <li><Link href="/community" className="text-slate-600 hover:text-slate-800">Student Community</Link></li>
              <li>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  💬 Live Chat
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700 flex items-center">
              <Home className="w-3 h-3 mr-1" />
              Home
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
          </div>
          <p className="text-xs text-slate-500">© 2025 Eduverse. Keep Learning!</p>
        </div>
      </div>
    </footer>
  );
};

export default StudentPanelFooter;
