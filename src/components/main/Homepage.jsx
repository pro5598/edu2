"use client";
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Play, 
  ArrowRight, 
  Code, 
  Database, 
  Smartphone, 
  Palette,
  Users,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  Quote,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Shield
} from "lucide-react";
import Navbar from './Navbar';

const Homepage = () => {
  <Navbar></Navbar>
  const [cartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    satisfaction: 0
  });
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setStats({
          students: Math.floor(36000 * progress),
          courses: Math.floor(500 * progress),
          instructors: Math.floor(150 * progress),
          satisfaction: Math.floor(99 * progress)
        });
        if (step >= steps) clearInterval(timer);
      }, increment);
    };
    animateStats();
  }, []);

  

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      image: "👩‍💻",
      text: "The courses here completely transformed my career. I went from knowing nothing about coding to landing my dream job in just 6 months!"
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      image: "👨‍💼",
      text: "Incredible learning experience! The instructors are top-notch and the curriculum is perfectly structured for real-world applications."
    },
    {
      name: "Emily Rodriguez",
      role: "UI/UX Designer",
      image: "👩‍🎨",
      text: "Best investment I've ever made. The design courses here are comprehensive and taught by industry professionals."
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of real-world experience"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join a thriving community of learners and get help when you need it"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certification",
      description: "Earn recognized certificates to showcase your new skills to employers"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to course materials"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Hands-on Projects",
      description: "Build real projects that you can add to your professional portfolio"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Money-back Guarantee",
      description: "30-day money-back guarantee if you're not completely satisfied"
    }
  ];

  const courses = [
    {
      title: "Complete Web Development Bootcamp",
      instructor: "John Doe",
      rating: 4.9,
      students: 12500,
      image: "🌐",
      duration: "40 hours",
      level: "Beginner to Advanced"
    },
    {
      title: "React & Node.js Full Stack",
      instructor: "Jane Smith",
      rating: 4.8,
      students: 8900,
      image: "⚛️",
      duration: "35 hours",
      level: "Intermediate"
    },
    {
      title: "Mobile App Development",
      instructor: "Mike Johnson",
      rating: 4.9,
      students: 6700,
      image: "📱",
      duration: "30 hours",
      level: "Beginner"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Trustpilot */}
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-green-500 fill-current" />
                <span className="text-green-600 font-semibold">Trustpilot</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">Excellent 4.9 out of 5</span>
              </div>
              {/* Main Heading */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Education Is The Best
                </h1>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Success In Life</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  Transform your career with our comprehensive online courses. Learn from industry experts, 
                  build real projects, and join thousands of successful graduates.
                </p>
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                  <span className="font-semibold">Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:border-purple-600 hover:text-purple-600 transition-all transform hover:scale-105">
                  <Play className="w-5 h-5" />
                  <span className="font-semibold">Watch Demo</span>
                </button>
              </div>
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.students.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.courses}+</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.satisfaction}%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-70 transform rotate-12 animate-pulse"></div>
                <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full opacity-70 transform -rotate-12 animate-pulse delay-75"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full opacity-70 animate-pulse delay-150"></div>
              </div>

<div className="relative z-10 flex justify-center">
  <div className="relative">
    <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
      <img
        src="Image/women.png" 
        alt="Woman"
        className="object-cover w-full h-full"
      />
    </div>
                  {/* Floating Cards */}
                  <div className="absolute -top-4 -left-8 bg-white rounded-xl shadow-xl p-4 flex items-center space-x-3 animate-float">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">36k+</div>
                      <div className="text-xs text-gray-500">Enrolled Students</div>
                      <div className="flex -space-x-2 mt-1">
                        <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-red-400 rounded-full border-2 border-white"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-8 bg-white rounded-xl shadow-xl p-4 animate-float delay-75">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Course</div>
                        <div className="text-xs text-gray-500">Completed!</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-12 bg-white rounded-xl shadow-xl p-3 animate-float delay-150">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-xs text-gray-500">99% Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              CATEGORIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Top Course Categories
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold">
              That <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Change Yourself</span>
            </h2>
          </div>
          {/* Course Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Web Design */}
            <div className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Palette className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Web Design</h3>
              <p className="text-gray-500">15+ Courses</p>
            </div>
            {/* Backend */}
            <div className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Database className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Backend Development</h3>
              <p className="text-gray-500">12+ Courses</p>
            </div>
            {/* Full Stack */}
            <div className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Code className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">Full Stack</h3>
              <p className="text-gray-500">8+ Courses</p>
            </div>
            {/* Mobile Application */}
            <div className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">Mobile Development</h3>
              <p className="text-gray-500">10+ Courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              FEATURED COURSES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Most Popular Courses
            </h2>
            <p className="text-xl text-gray-600">Hand-picked courses loved by our students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-6xl">
                  {course.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">{course.level}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-purple-100">Real stories from real students</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <Quote className="w-12 h-12 text-purple-200 mb-6" />
              <p className="text-xl md:text-2xl leading-relaxed mb-8">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div>
                  <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-purple-200">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Homepage;