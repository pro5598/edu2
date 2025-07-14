"use client";
import React, { useState, useEffect } from "react";
import { Star, BookOpen, Play, ChevronRight, X, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const StudentCoursesPage = () => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrolled courses from API
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/enrollments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const data = await response.json();
       setCourses(data.enrollments || []);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError(err.message);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

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

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    try {
      const response = await fetch('/api/courses/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
           courseId: selectedCourse.id,
           enrollmentId: selectedCourse.enrollmentId,
           rating: userRating,
           review: reviewText
         })
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      toast.success("Thank you for your rating!");
      closeRatingModal();
      
      // Refresh courses to get updated ratings
      fetchEnrolledCourses();
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('Failed to submit rating');
    }
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
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            My Courses
          </h2>
          {!loading && (
            <button
              onClick={fetchEnrolledCourses}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>



        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-600">
                Loading your courses...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium">
                  Error loading courses
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {error}
                </p>
                <button
                  onClick={fetchEnrolledCourses}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((enrollment) => {
             const course = enrollment.course;
             return (
               <div
                 key={enrollment.id}
                 className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
               >
                 <div className="relative">
                   <div
                     className="h-36 sm:h-44 lg:h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-black/10"></div>
                     <div className="relative z-10 flex items-center justify-center w-full h-full">
                       {/* Course thumbnail */}
                       <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-3 sm:p-4">
                         <img
                           src={course.thumbnail || '/api/placeholder/100/100'}
                           alt={`${course.title} thumbnail`}
                           className="w-full h-full object-contain rounded-lg"
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
                   
                   {/* Progress indicator */}
                   {enrollment.progress > 0 && (
                     <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2">
                       <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                         <span>Progress</span>
                         <span>{enrollment.progress}%</span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                         <div 
                           className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                           style={{ width: `${enrollment.progress}%` }}
                         ></div>
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="p-4 sm:p-5 lg:p-6">
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center space-x-1">
                       {renderStars(course.averageRating || 0)}
                       <span className="text-xs sm:text-sm text-gray-700 ml-1 sm:ml-2">
                         ({course.averageRating ? course.averageRating.toFixed(1) : '0.0'})
                       </span>
                     </div>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                       {enrollment.status}
                     </span>
                   </div>

                   <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                     {course.title}
                   </h3>
                   
                   <p className="text-sm text-gray-600 mb-4">
                     by {course.instructor}
                   </p>
                   
                   <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                     <span>{course.lessons} lessons</span>
                     <span>{course.duration}</span>
                     <span>{course.category}</span>
                   </div>

                   {/* Action Buttons */}
                   <div className="space-y-3">
                     <Link href={`/student/courses/${course.id}/lessons`} className="block">
                       <button className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center justify-center space-x-2">
                         <Play className="w-4 h-4" />
                         <span>{enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
                         <ChevronRight className="w-4 h-4" />
                       </button>
                     </Link>
                     
                     {!enrollment.rating && (
                       <button 
                         onClick={() => openRatingModal({ ...course, enrollmentId: enrollment.id })}
                         className="w-full bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 py-2.5 rounded-lg font-medium transition-colors text-sm"
                       >
                         <div className="flex items-center justify-center space-x-2">
                           <Star className="w-4 h-4" />
                           <span>Rate Course</span>
                         </div>
                       </button>
                     )}
                     
                     {enrollment.rating && (
                       <div className="text-center py-2">
                         <div className="flex items-center justify-center space-x-1">
                           {renderStars(enrollment.rating)}
                           <span className="text-sm text-gray-600 ml-2">Your rating</span>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             );
           })}
        </div>
        )}



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
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link href="/student/courses">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Browse Courses
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
