"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  Heart,
  ShoppingCart,
  Trash2,
  Filter,
  Search,
  BookOpen,
  Clock,
  DollarSign,
} from "lucide-react";

const StudentWishlistPage = () => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/wishlist", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      setWishlistData(data.wishlistItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (courseId) => {
    try {
      const response = await fetch("/api/student/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId, action: "remove" }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }
      setWishlistData((prev) =>
        prev.filter((item) => item.course._id !== courseId)
      );
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = async (courseId) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      console.log("Added to cart successfully");
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(courseId);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : wishlistData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-slate-100 max-w-sm mx-auto w-full"
                >
                  {/* Course Image - Fixed Height */}
                  <div className="relative h-48">
                    <img
                      src={item.course.thumbnail || "/api/placeholder/300/200"}
                      alt={item.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove Button Only */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() =>
                          handleRemoveFromWishlist(item.course._id)
                        }
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
                            key={`${item.id}-star-${i}`}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.course.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {item.course.rating || 0} (
                        {item.course.reviewCount || 0})
                      </span>
                    </div>

                    {/* Title - Fixed Height */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                      {item.course.title}
                    </h3>

                    {/* Instructor */}
                    <p className="text-sm text-gray-600 mb-4">
                      by {item.course.instructor}
                    </p>

                    {/* Course Details - Simplified */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{item.course.duration || "N/A"}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.course.level || "All Levels"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${item.course.price || 0}
                        </span>
                        {item.course.originalPrice &&
                          item.course.originalPrice > item.course.price && (
                            <span className="text-sm line-through text-gray-500">
                              ${item.course.originalPrice}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Action Button - Single Button */}
                    <button
                      onClick={() => handleAddToCart(item.course._id)}
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
                Total value:{" "}
                <span className="font-semibold text-slate-800">
                  $
                  {wishlistData
                    .reduce(
                      (sum, item) =>
                        sum +
                        (item.course.originalPrice || item.course.price || 0),
                      0
                    )
                    .toFixed(2)}
                </span>{" "}
                <span className="text-green-600">
                  (Save $
                  {wishlistData
                    .reduce((sum, item) => {
                      const original =
                        item.course.originalPrice || item.course.price || 0;
                      const current = item.course.price || 0;
                      return sum + Math.max(0, original - current);
                    }, 0)
                    .toFixed(2)}
                  )
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
