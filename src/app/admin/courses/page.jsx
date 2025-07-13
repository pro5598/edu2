// app/admin/courses/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Star,
  Save,
  X,
  Trash2,
} from "lucide-react";

const AdminCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterCategory !== 'all') queryParams.append('category', filterCategory);

      const response = await fetch(`/api/admin/courses?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterCategory]);

  const categories = [
    "programming",
    "design",
    "business",
    "marketing",
    "photography",
    "music",
    "other",
  ];

  const filteredCourses = courses; // Filtering is now handled by the API

  const renderStars = (rating) => {
    if (rating === 0) return <span className="text-gray-500">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
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
        <span className="text-sm text-gray-700">{rating}</span>
      </div>
    );
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setEditFormData({
      title: course.title,
      category: course.category,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      isPublished: course.isPublished,
      isActive: course.isActive,
      level: course.level,
      description: course.description,
    });
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditFormData({});
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: editingCourse,
          ...editFormData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const data = await response.json();
      
      // Update the course in the local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === editingCourse ? data.course : course
        )
      );
      
      setEditingCourse(null);
      setEditFormData({});
      setShowEditModal(false);
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }

      // Remove the course from local state
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course: ' + error.message);
    }
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
                <span>Courses Management</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Manage all courses on the platform
              </p>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <X className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Error loading courses</p>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={fetchCourses}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-600">No courses found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">by {course.instructor}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 capitalize">{course.category}</span>
                      <div className="flex space-x-1">
                        {course.isPublished && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Published</span>
                        )}
                        {course.isActive && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-3">
                      <div className="flex justify-between">
                        <span><span className="font-medium">Price:</span> ${course.price}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-gray-500 line-through">${course.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span><span className="font-medium">Students:</span> {course.students}</span>
                        <span><span className="font-medium">Revenue:</span> ${course.revenue}</span>
                      </div>
                    </div>
                    
                    <div className="min-h-[2rem] mb-3">
                      {course.rating > 0 ? (
                        <div>
                          {renderStars(course.rating)}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No rating</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 pt-3 border-t border-gray-200 mt-auto">
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit course"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editFormData.price || 0}
                    onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                    placeholder="Enter course price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    value={editFormData.originalPrice || 0}
                    onChange={(e) => handleFormChange('originalPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                    placeholder="Enter original price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Level
                </label>
                <select
                  value={editFormData.level || 'beginner'}
                  onChange={(e) => handleFormChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={editFormData.thumbnail || ''}
                  onChange={(e) => handleFormChange('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter thumbnail image URL"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Published Status
                  </label>
                  <select
                    value={editFormData.isPublished ? 'true' : 'false'}
                    onChange={(e) => handleFormChange('isPublished', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Active Status
                  </label>
                  <select
                    value={editFormData.isActive ? 'true' : 'false'}
                    onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
