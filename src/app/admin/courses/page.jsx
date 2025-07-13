// app/admin/courses/page.jsx
"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Star,
  Save,
  X,
} from "lucide-react";

const AdminCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Masterclass 2024",
      instructor: "John Smith",
      category: "Web Development",
      students: 1247,
      rating: 4.8,
      reviews: 156,
      price: 60,
      revenue: 18450,
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-20",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      instructor: "Sarah Johnson",
      category: "Web Development",
      students: 0,
      rating: 0,
      reviews: 0,
      price: 45,
      revenue: 0,
      createdDate: "2024-01-22",
      lastUpdated: "2024-01-22",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Node.js Complete Guide",
      instructor: "Mike Chen",
      category: "Backend Development",
      students: 654,
      rating: 4.6,
      reviews: 89,
      price: 75,
      revenue: 9870,
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-18",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Emma Wilson",
      category: "Data Science",
      students: 0,
      rating: 0,
      reviews: 0,
      price: 90,
      revenue: 0,
      createdDate: "2024-01-25",
      lastUpdated: "2024-01-25",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop",
    },
  ]);

  const categories = [
    "Web Development",
    "Backend Development",
    "Data Science",
    "Mobile Development",
    "UI/UX Design",
    "DevOps",
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

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
      instructor: course.instructor,
      category: course.category,
      price: course.price,
      thumbnail: course.thumbnail,
    });
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditFormData({});
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === editingCourse 
          ? { 
              ...course, 
              ...editFormData,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : course
      )
    );
    setEditingCourse(null);
    setEditFormData({});
    setShowEditModal(false);
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
                    <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Price:</span> ${course.price}
                    </p>
                    
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
                  
                  <div className="flex items-center justify-center pt-3 border-t border-gray-200 mt-auto">
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  Instructor
                </label>
                <input
                  type="text"
                  value={editFormData.instructor}
                  onChange={(e) => handleFormChange('instructor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter instructor name"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => handleFormChange('price', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter course price"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={editFormData.thumbnail}
                  onChange={(e) => handleFormChange('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  placeholder="Enter thumbnail image URL"
                />
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
