"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Play,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const BrowseCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedPrice !== 'all') {
        params.append('price', selectedPrice);
      }
      
      const response = await fetch(`/api/courses?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      });
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourses(1);
  }, [selectedCategory, selectedPrice, searchTerm]);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        fetchCourses(1);
      }
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "data-science", label: "Data Science" },
    { value: "design", label: "Design" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "business", label: "Business" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
    { value: "under-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "over-100", label: "Over $100" },
  ];

  const handleAddToWishlist = async (courseId) => {
    try {
      const course = courses.find(c => c._id === courseId);
      const method = course?.inWishlist ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/student/wishlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }
      
      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, inWishlist: !course.inWishlist }
            : course
        )
      );
      
      toast.success(course?.inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      console.error('Error updating wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (courseId) => {
    try {
      const response = await fetch('/api/student/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      toast.success('Added to cart successfully');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
    }
  };

  const filteredCourses = courses;



  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>Browse Courses</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Discover new skills and advance your career
              </p>
            </div>

            <div className="text-sm text-slate-600">
              {filteredCourses.length} courses found
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-600 bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900 font-medium"
              >
                {priceRanges.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <span className="ml-2 text-red-600">{error}</span>
              <button
                onClick={() => fetchCourses(1)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'}
                        alt={course.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <button
                        onClick={() => handleAddToWishlist(course._id)}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                          course.inWishlist
                            ? "bg-pink-500 text-white shadow-lg"
                            : "bg-white/80 text-gray-600 hover:bg-white hover:text-pink-500"
                        }`}
                        title={
                          course.inWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-200 ${
                            course.inWishlist ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(course.averageRating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {(course.averageRating || 0).toFixed(1)} ({course.reviewCount || 0})
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-slate-600 text-sm mb-3">
                        by {course.instructor?.name || course.instructor}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                        <span>{course.enrollmentCount || 0} students</span>
                        <span>{course.lessons?.length || 0} lessons</span>
                        <span>{course.duration}</span>
                      </div>

                      <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center space-x-2">
                          {course.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">
                              Free
                            </span>
                          ) : (
                            <>
                              <span className="text-lg font-bold text-gray-800">
                                ${course.price}
                              </span>
                              {course.originalPrice && course.originalPrice > course.price && (
                                <span className="text-sm line-through text-gray-500">
                                  ${course.originalPrice}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {course.isEnrolled ? (
                          <button
                            onClick={() => window.location.href = `/student/courses/${course._id}/lessons`}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <Play className="w-4 h-4" />
                            <span>Go to Course</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(course._id)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                  <button
                    onClick={() => fetchCourses(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchCourses(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => fetchCourses(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCoursesPage;
