"use client";
import React, { useState } from "react";
import { Star, Users, Heart, ShoppingCart, Trash2, Filter, Search, BookOpen, Clock, DollarSign } from "lucide-react";

const StudentWishlistPage = () => {
  const wishlistData = [
    {
      id: 1,
      title: "React Front To Back",
      instructor: "Brad Traversy",
      rating: 5,
      reviews: 100,
      lessons: 50,
      students: 100,
      price: 60,
      originalPrice: 84.99,
      discount: true,
      dateAdded: "2024-12-01",
      category: "Web Development",
      level: "Intermediate",
      duration: "12 hours",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "PHP Beginner Advanced",
      instructor: "John Smith",
      rating: 4.6,
      reviews: 21,
      lessons: 50,
      students: 100,
      price: 80,
      originalPrice: 100,
      discount: true,
      dateAdded: "2024-11-15",
      category: "Backend Development",
      level: "Beginner",
      duration: "15 hours",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Angular Zero to Mastery",
      instructor: "Sarah Johnson",
      rating: 4.9,
      reviews: 102,
      lessons: 50,
      students: 100,
      price: 40,
      originalPrice: 90,
      discount: true,
      dateAdded: "2024-10-20",
      category: "Frontend Development",
      level: "Advanced",
      duration: "20 hours",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Python Machine Learning",
      instructor: "Dr. Emily Chen",
      rating: 4.8,
      reviews: 85,
      lessons: 65,
      students: 150,
      price: 120,
      originalPrice: 150,
      discount: true,
      dateAdded: "2024-09-10",
      category: "Data Science",
      level: "Advanced",
      duration: "25 hours",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    },
  ];

  const handleRemoveFromWishlist = (courseId) => {
    console.log("Remove from wishlist:", courseId);
  };

  const handleAddToCart = (courseId) => {
    console.log("Add to cart:", courseId);
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
                <span>My Wishlist</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {wishlistData.length} courses saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="p-4 sm:p-6">
          {wishlistData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistData.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-slate-100 max-w-sm mx-auto w-full"
                >
                  {/* Course Image - Fixed Height */}
                  <div className="relative h-48">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Remove Button Only */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveFromWishlist(course.id)}
                        className="p-2 bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 rounded-full transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Course Content - Fixed Structure */}
                  <div className="p-5">
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {course.rating} ({course.reviews})
                      </span>
                    </div>

                    {/* Title - Fixed Height */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <p className="text-sm text-gray-600 mb-4">
                      by {course.instructor}
                    </p>

                    {/* Course Details - Simplified */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {course.level}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${course.price}
                        </span>
                        {course.discount && (
                          <span className="text-sm line-through text-gray-500">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button - Single Button */}
                    <button
                      onClick={() => handleAddToCart(course.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6">
                Start adding courses you're interested in to your wishlist
              </p>
              <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                Browse Courses
              </button>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {wishlistData.length > 0 && (
          <div className="px-4 sm:px-6 py-4 sm:py-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-slate-600">
                Total value: <span className="font-semibold text-slate-800">
                  ${wishlistData.reduce((sum, course) => sum + course.originalPrice, 0).toFixed(2)}
                </span>
                {" "}
                <span className="text-green-600">
                  (Save ${wishlistData.reduce((sum, course) => sum + (course.originalPrice - course.price), 0).toFixed(2)})
                </span>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentWishlistPage;
