"use client";
import React, { useState, useEffect } from "react";
import { Star, Edit3, Trash2, BookOpen, MessageSquare, Filter, Search, Plus } from "lucide-react";

const StudentReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews();
  }, [searchTerm, filterRating, pagination.currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterRating !== 'all' && { rating: filterRating })
      });
      
      const response = await fetch(`/api/student/reviews?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.reviews);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reviewData = reviews;

  const handleEditReview = async (reviewId, rating, comment) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/student/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          rating,
          comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      // Refresh reviews after successful edit
      await fetchReviews();
      setEditingReview(null);
      setEditForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch(`/api/student/reviews?reviewId=${reviewId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      // Refresh reviews after successful deletion
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (review) => {
    setEditingReview(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.feedback
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const filteredReviews = reviews;

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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-slate-600">Loading reviews...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error: {error}</div>
            <button 
              onClick={fetchReviews}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
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
                        {editingReview === review.id ? (
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setEditForm({...editForm, rating: star})}
                                className={`w-4 h-4 ${star <= editForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        ) : (
                           <div className="flex items-center space-x-2">
                             {renderStars(review.rating)}
                             <span className="text-sm text-slate-700">
                               {review.rating}/5
                             </span>
                           </div>
                         )}
                      </td>
                      <td className="px-6 py-4">
                        {editingReview === review.id ? (
                          <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                            className="w-full p-2 border border-slate-300 rounded-lg resize-none text-sm"
                            rows={3}
                            placeholder="Write your review..."
                          />
                        ) : (
                          <div className="text-sm text-slate-800 max-w-xs truncate">
                            {review.feedback}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(review.date).toLocaleDateString()}
                        {review.lastEditedAt && (
                          <div className="text-xs text-slate-400">Edited</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingReview === review.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditReview(review.id, editForm.rating, editForm.comment)}
                              disabled={isSubmitting || !editForm.comment.trim()}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isSubmitting}
                              className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEdit(review)}
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Mobile/Tablet Card View */}
        {!loading && !error && (
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
                    
                    {editingReview === review.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditReview(review.id, editForm.rating, editForm.comment)}
                          disabled={isSubmitting || !editForm.comment.trim()}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEdit(review)}
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
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {editingReview === review.id ? (
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditForm({...editForm, rating: star})}
                              className={`w-4 h-4 ${star <= editForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      ) : (
                         <>
                           {renderStars(review.rating)}
                           <span className="text-sm text-slate-700">
                             {review.rating}/5
                           </span>
                         </>
                       )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      {new Date(review.date).toLocaleDateString()}
                      {review.lastEditedAt && (
                        <div className="text-xs text-slate-400">Edited</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      {editingReview === review.id ? (
                        <textarea
                          value={editForm.comment}
                          onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg resize-none text-sm"
                          rows={3}
                          placeholder="Write your review..."
                        />
                      ) : (
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {review.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredReviews.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              No reviews found
            </h3>
            <p className="text-sm sm:text-base text-slate-700 mb-6">
              {searchTerm || filterRating !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "You haven't written any reviews yet. Start by taking a course!"}
            </p>
            {(!searchTerm && filterRating === "all") && (
              <a 
                href="/student/browse-courses"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Courses
              </a>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalCount)} of {pagination.totalCount} reviews
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {summary.totalReviews}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-yellow-600">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {summary.ratingDistribution[5]}
              </div>
              <div className="text-xs sm:text-sm text-slate-700">5-Star Reviews</div>
            </div>
            <div className="text-center">
               <div className="text-lg sm:text-xl font-bold text-blue-600">
                 {summary.ratingDistribution[4] + summary.ratingDistribution[5]}
               </div>
               <div className="text-xs sm:text-sm text-slate-700">Positive Reviews</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewsPage;
