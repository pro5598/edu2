"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Play,
  ChevronDown,
} from "lucide-react";

const BrowseCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Angela Yu",
      rating: 4.8,
      reviews: 2847,
      students: 15420,
      price: 89.99,
      originalPrice: 199.99,
      category: "Web Development",
      duration: "65 hours",
      lessons: 120,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      description:
        "Learn web development from scratch with HTML, CSS, JavaScript, React, and more.",
      inWishlist: false,
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Jose Portilla",
      rating: 4.9,
      reviews: 1923,
      students: 8750,
      price: 79.99,
      originalPrice: 149.99,
      category: "Data Science",
      duration: "45 hours",
      lessons: 85,
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
      description:
        "Master Python for data analysis, visualization, and machine learning.",
      inWishlist: true,
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Daniel Schifano",
      rating: 4.7,
      reviews: 1456,
      students: 6890,
      price: 0,
      originalPrice: 0,
      category: "Design",
      duration: "30 hours",
      lessons: 60,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      description:
        "Learn modern UI/UX design principles and create stunning user interfaces.",
      inWishlist: false,
    },
  ]);

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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      course.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory;
    const matchesPrice =
      selectedPrice === "all" ||
      (selectedPrice === "free" && course.price === 0) ||
      (selectedPrice === "paid" && course.price > 0) ||
      (selectedPrice === "under-50" && course.price < 50) ||
      (selectedPrice === "50-100" &&
        course.price >= 50 &&
        course.price <= 100) ||
      (selectedPrice === "over-100" && course.price > 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToWishlist = (courseId) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, inWishlist: !course.inWishlist }
          : course
      )
    );

    const course = courses.find((c) => c.id === courseId);
    const action = course.inWishlist ? "removed from" : "added to";
    console.log(`Course ${action} wishlist:`, courseId);
  };

  const handleAddToCart = (courseId) => {
    console.log("Add to cart:", courseId);
  };

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
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                      onClick={() => handleAddToWishlist(course.id)}
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
                              i < Math.floor(course.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {course.rating} ({course.reviews})
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-3 line-clamp-2">
                      {course.title}
                    </h3>

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
                            {course.originalPrice > course.price && (
                              <span className="text-sm line-through text-gray-500">
                                ${course.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(course.id)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
