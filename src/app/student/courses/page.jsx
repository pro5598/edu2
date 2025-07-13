"use client";
import React, { useState } from "react";
import { Star, BookOpen, Play, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const StudentCoursesPage = () => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const courses = [
    {
      id: 1,
      title: "React Front To Back",
      instructor: "Brad Traversy",
      rating: 4.8,
      reviews: 102,
      lessons: 45,
      duration: "12h 30m",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "PHP Beginner Advanced",
      instructor: "John Smith",
      rating: 4.6,
      reviews: 21,
      lessons: 52,
      duration: "18h 45m",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      title: "Angular Zero to Mastery",
      instructor: "Sarah Johnson",
      rating: 4.9,
      reviews: 102,
      lessons: 68,
      duration: "25h 15m",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      color: "from-green-500 to-teal-600",
    },
  ];

  const openRatingModal = (course) => {
    setSelectedCourse(course);
    setShowRatingModal(true);
    setUserRating(0);
    setReviewText("");
    setHoverRating(0);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedCourse(null);
    setUserRating(0);
    setReviewText("");
    setHoverRating(0);
  };

  const handleRatingSubmit = () => {
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }
    
    console.log("Rating submitted:", {
      courseId: selectedCourse.id,
      rating: userRating,
      review: reviewText
    });
    
    alert("Thank you for your rating!");
    closeRatingModal();
  };

  const renderStars = (rating, interactive = false, size = "w-3 h-3 sm:w-4 sm:h-4") => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} cursor-pointer transition-colors ${
              i < (interactive ? (hoverRating || userRating) : Math.floor(rating))
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
            onClick={interactive ? () => setUserRating(i + 1) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6 xl:p-7">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-none">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          My Courses
        </h2>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => {
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative">
                  <div
                    className={`h-36 sm:h-44 lg:h-48 bg-gradient-to-br ${course.color} p-4 sm:p-6 flex items-center justify-center relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      {/* Course-specific image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-3 sm:p-4">
                        <img
                          src={course.image}
                          alt={`${course.title} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full bg-gray-200 rounded-lg items-center justify-center text-gray-600 font-bold text-lg">
                          {course.title.split(' ')[0].charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(course.rating)}
                      <span className="text-xs sm:text-sm text-gray-700 ml-1 sm:ml-2">
                        ({course.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-6 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href={`/courses/${course.id}/lessons`} className="block">
                      <button className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Continue Learning</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => openRatingModal(course)}
                      className="w-full bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Rate Course</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeRatingModal}
            ></div>
            
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rate Course
                  </h3>
                  <button
                    onClick={closeRatingModal}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {selectedCourse && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {selectedCourse.title}
                      </h4>
                      <p className="text-sm text-gray-700">
                        by {selectedCourse.instructor}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Your Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {renderStars(userRating, true, "w-8 h-8")}
                        {userRating > 0 && (
                          <span className="ml-2 text-sm text-gray-700">
                            {userRating} out of 5 stars
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Review (Optional)
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this course..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={closeRatingModal}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRatingSubmit}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              Start learning by enrolling in your first course!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
