"use client";
import React, { useState } from "react";
import { Star, Edit3, Trash2, BookOpen, MessageSquare, Filter, Search, Plus } from "lucide-react";

const StudentReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [editingReview, setEditingReview] = useState(null);

  const reviewData = [
    {
      id: 1,
      course: "Speaking Korean for Beginners",
      feedback: "Excellent course! The instructor explains everything clearly and the pace is perfect for beginners. I've learned so much in just a few weeks.",
      rating: 5,
      reviewsCount: 9,
      date: "2024-12-15",
      instructor: "Kim Min-jun"
    },
    {
      id: 2,
      course: "Introduction to Calculus",
      feedback: "Good foundational course, but could use more practical examples. The theory is solid though.",
      rating: 4,
      reviewsCount: 12,
      date: "2024-11-28",
      instructor: "Dr. Sarah Johnson"
    },
    {
      id: 3,
      course: "How to Write Your First Novel",
      feedback: "Amazing course! The writing exercises are incredibly helpful and the feedback is constructive.",
      rating: 5,
      reviewsCount: 15,
      date: "2024-11-10",
      instructor: "Mark Thompson"
    },
    {
      id: 4,
      course: "Web Development Bootcamp",
      feedback: "Comprehensive course covering all the basics. Great for beginners in web development.",
      rating: 4,
      reviewsCount: 8,
      date: "2024-10-22",
      instructor: "Alex Rodriguez"
    },
    {
      id: 5,
      course: "Digital Marketing Fundamentals",
      feedback: "Very practical course with real-world examples. Highly recommend for marketing beginners.",
      rating: 5,
      reviewsCount: 11,
      date: "2024-10-05",
      instructor: "Lisa Chen"
    },
    {
      id: 6,
      course: "Python Programming Basics",
      feedback: "Good introduction to Python, but the pace could be a bit faster for those with some programming background.",
      rating: 4,
      reviewsCount: 7,
      date: "2024-09-18",
      instructor: "David Kumar"
    },
  ];

  const filteredReviews = reviewData.filter(review => {
    const matchesSearch = review.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const handleEditReview = (reviewId) => {
    setEditingReview(reviewId);
  };

  const handleDeleteReview = (reviewId) => {
    console.log("Delete review:", reviewId);
    // Add delete logic here
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                My Reviews
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Manage your course reviews and feedback
              </p>
            </div>
            

          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-slate-900"
              />
            </div>
            
            {/* Rating Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white text-slate-900"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {review.course}
                      </div>
                      <div className="text-xs text-slate-600">
                        by {review.instructor}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-slate-700">
                        ({review.reviewsCount})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800 max-w-xs truncate">
                      {review.feedback}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">

                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                        {review.course}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        by {review.instructor}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditReview(review.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-slate-700">
                      ({review.reviewsCount} reviews)
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {review.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              No reviews found
            </h3>
            <p className="text-sm sm:text-base text-slate-700">
              {searchTerm || filterRating !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Start reviewing your completed courses to help other students"}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {reviewData.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-yellow-600">
                {(reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length).toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {reviewData.filter(review => review.rating === 5).length}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">5-Star Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {reviewData.reduce((sum, review) => sum + review.reviewsCount, 0)}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">Total Feedback</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewsPage;
