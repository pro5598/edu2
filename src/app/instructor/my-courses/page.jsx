"use client";
import React, { useState } from 'react';
import {
  BookOpen,
  Edit,
  Plus,
  MoreVertical,
  Star,
  MessageSquare,
  X,
  User,
} from 'lucide-react';
import Link from 'next/link';

const InstructorMyCoursesPage = () => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "React Front To Back",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      price: 60,
      originalPrice: 84.99,
      category: "Web Development",
      reviews: [
        {
          id: 1,
          studentName: "Sarah Johnson",
          rating: 5,
          comment: "Excellent course! Very detailed and well-structured. The instructor explains complex concepts in a simple way.",
          date: "2024-01-15",
        },
        {
          id: 2,
          studentName: "Mike Chen",
          rating: 5,
          comment: "Perfect for beginners. Great explanations and practical examples. Highly recommended!",
          date: "2024-01-12",
        },
        {
          id: 3,
          studentName: "Emma Wilson",
          rating: 4,
          comment: "Good content overall. Would love more advanced topics and real-world projects.",
          date: "2024-01-10",
        },
      ]
    },
    {
      id: 2,
      title: "PHP Beginner to Advanced",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
      price: 80,
      originalPrice: 100,
      category: "Backend Development",
      reviews: [
        {
          id: 1,
          studentName: "John Smith",
          rating: 5,
          comment: "Great PHP course! Covers everything from basics to advanced concepts.",
          date: "2024-01-14",
        },
        {
          id: 2,
          studentName: "Maria Garcia",
          rating: 4,
          comment: "Good course structure. Would appreciate more modern PHP frameworks coverage.",
          date: "2024-01-11",
        }
      ]
    },
    {
      id: 3,
      title: "Angular Zero to Mastery",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      price: 40,
      originalPrice: 90,
      category: "Frontend Development",
      reviews: [
        {
          id: 1,
          studentName: "Alex Thompson",
          rating: 5,
          comment: "Excellent Angular course! Very up-to-date with the latest Angular features.",
          date: "2024-01-13",
        }
      ]
    },
    {
      id: 4,
      title: "Node.js Complete Guide",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
      price: 75,
      originalPrice: 95,
      category: "Backend Development",
      reviews: [
        {
          id: 1,
          studentName: "Chris Lee",
          rating: 5,
          comment: "Outstanding Node.js course! The best I've taken so far.",
          date: "2024-01-16",
        }
      ]
    },
  ];

  const openReviewsModal = (course) => {
    setSelectedCourse(course);
    setShowReviewsModal(true);
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
    setSelectedCourse(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>My Courses</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Manage and track your course performance
              </p>
            </div>
            
          </div>
        </div>

        {/* Course Grid */}
        <div className="p-4 sm:p-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title and Category */}
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-sm text-gray-600">{course.category}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${course.price}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-sm line-through text-gray-600">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Reviews Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => openReviewsModal(course)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>View Reviews</span>
                      </button>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Link href={`/instructor/my-courses/${course.id}/edit`} className="block">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                          <Edit className="w-4 h-4" />
                          <span>Edit Course</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                No courses yet
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mb-6">
                Create your first course to start teaching
              </p>
              <Link href="/instructor/my-courses/create">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Create Your First Course
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Modal */}
      {showReviewsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCourse.title} - Reviews</h3>
                </div>
                <button
                  onClick={closeReviewsModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedCourse.reviews.length > 0 ? (
                <div className="space-y-6">
                  {selectedCourse.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.studentName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">
                                  {formatDate(review.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-800">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">This course hasn't received any reviews yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeReviewsModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorMyCoursesPage;
