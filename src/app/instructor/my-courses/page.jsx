"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Edit,
  Plus,
  Star,
  MessageSquare,
  X,
  User,
  Save,
  Upload,
  FileText,
  Video,
  Settings,
  Trash2,
  Play,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

const InstructorMyCoursesPage = () => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoLesson, setCurrentVideoLesson] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Front To Back",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      price: 60,
      originalPrice: 84.99,
      category: "Web Development",
      reviews: [
        {
          id: 1,
          studentName: "Sarah Johnson",
          rating: 5,
          comment:
            "Excellent course! Very detailed and well-structured. The instructor explains complex concepts in a simple way.",
          date: "2024-01-15",
        },
        {
          id: 2,
          studentName: "Mike Chen",
          rating: 5,
          comment:
            "Perfect for beginners. Great explanations and practical examples. Highly recommended!",
          date: "2024-01-12",
        },
        {
          id: 3,
          studentName: "Emma Wilson",
          rating: 4,
          comment:
            "Good content overall. Would love more advanced topics and real-world projects.",
          date: "2024-01-10",
        },
      ],
    },
    {
      id: 2,
      title: "PHP Beginner to Advanced",
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
      price: 80,
      originalPrice: 100,
      category: "Backend Development",
      reviews: [
        {
          id: 1,
          studentName: "John Smith",
          rating: 5,
          comment:
            "Great PHP course! Covers everything from basics to advanced concepts.",
          date: "2024-01-14",
        },
        {
          id: 2,
          studentName: "Maria Garcia",
          rating: 4,
          comment:
            "Good course structure. Would appreciate more modern PHP frameworks coverage.",
          date: "2024-01-11",
        },
      ],
    },
    {
      id: 3,
      title: "Angular Zero to Mastery",
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      price: 40,
      originalPrice: 90,
      category: "Frontend Development",
      reviews: [
        {
          id: 1,
          studentName: "Alex Thompson",
          rating: 5,
          comment:
            "Excellent Angular course! Very up-to-date with the latest Angular features.",
          date: "2024-01-13",
        },
      ],
    },
    {
      id: 4,
      title: "Node.js Complete Guide",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
      price: 75,
      originalPrice: 95,
      category: "Backend Development",
      reviews: [
        {
          id: 1,
          studentName: "Chris Lee",
          rating: 5,
          comment: "Outstanding Node.js course! The best I've taken so far.",
          date: "2024-01-16",
        },
      ],
    },
  ]);

  // Form state for creating new course
  const [newCourse, setNewCourse] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    originalPrice: "",
    thumbnail: null,
    requirements: [""],
    objectives: [""],

    // Curriculum
    chapters: [
      {
        id: Date.now(),
        title: "Introduction",
        lessons: [
          {
            id: Date.now() + 1,
            title: "",
            duration: "",
            videoUrl: "",
            videoType: "upload",
            videoFile: null,
            description: "",
          },
        ],
      },
    ],

    // Notes
    notes: [],
  });

  const openReviewsModal = (course) => {
    setSelectedCourse(course);
    setShowReviewsModal(true);
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
    setSelectedCourse(null);
  };

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setActiveTab("basic");
    setNewCourse({
      title: "",
      description: "",
      category: "",
      level: "",
      price: "",
      originalPrice: "",
      thumbnail: null,
      requirements: [""],
      objectives: [""],
      chapters: [
        {
          id: Date.now(),
          title: "Introduction",
          lessons: [
            {
              id: Date.now() + 1,
              title: "",
              duration: "",
              videoUrl: "",
              videoType: "upload",
              videoFile: null,
              description: "",
            },
          ],
        },
      ],
      notes: [],
    });
  };

  const handleInputChange = (field, value) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setNewCourse((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Chapter management
  const handleChapterChange = (chapterIndex, field, value) => {
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) =>
        index === chapterIndex ? { ...chapter, [field]: value } : chapter
      ),
    }));
  };

  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: "New Chapter",
      lessons: [],
    };
    setNewCourse((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
  };

  const removeChapter = (chapterIndex) => {
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, index) => index !== chapterIndex),
    }));
  };

  // Lesson management
  const handleLessonChange = (chapterIndex, lessonIndex, field, value) => {
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, chIndex) =>
        chIndex === chapterIndex
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : chapter
      ),
    }));
  };

  const addLesson = (chapterIndex) => {
    const newLesson = {
      id: Date.now(),
      title: "New Lesson",
      duration: "00:00",
      videoUrl: "",
      videoType: "upload",
      videoFile: null,
      description: "",
    };
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) =>
        index === chapterIndex
          ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
          : chapter
      ),
    }));
  };

  const removeLesson = (chapterIndex, lessonIndex) => {
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) =>
        index === chapterIndex
          ? {
              ...chapter,
              lessons: chapter.lessons.filter(
                (_, lIndex) => lIndex !== lessonIndex
              ),
            }
          : chapter
      ),
    }));
  };

  // Video management
  const openVideoModal = (chapterIndex, lessonIndex) => {
    setCurrentVideoLesson({ chapterIndex, lessonIndex });
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoLesson(null);
  };

  const handleVideoUpload = (file) => {
    if (currentVideoLesson) {
      const { chapterIndex, lessonIndex } = currentVideoLesson;
      handleLessonChange(chapterIndex, lessonIndex, "videoFile", file);
      handleLessonChange(chapterIndex, lessonIndex, "videoType", "upload");
      handleLessonChange(
        chapterIndex,
        lessonIndex,
        "videoUrl",
        URL.createObjectURL(file)
      );
    }
  };

  const handleVideoLink = (url, type) => {
    if (currentVideoLesson) {
      const { chapterIndex, lessonIndex } = currentVideoLesson;
      handleLessonChange(chapterIndex, lessonIndex, "videoUrl", url);
      handleLessonChange(chapterIndex, lessonIndex, "videoType", type);
      handleLessonChange(chapterIndex, lessonIndex, "videoFile", null);
    }
  };

  // Notes management
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      fileName: "",
      fileSize: "",
      uploadedAt: new Date().toISOString().split("T")[0],
      downloadUrl: "#",
      type: "pdf",
      file: null,
    };
    setCurrentNote(newNote);
    setShowNotesModal(true);
  };

  const editNote = (noteIndex) => {
    setCurrentNote({ ...newCourse.notes[noteIndex], index: noteIndex });
    setShowNotesModal(true);
  };

  const saveNote = (noteData) => {
    setNewCourse((prev) => {
      if (noteData.index !== undefined) {
        return {
          ...prev,
          notes: prev.notes.map((note, index) =>
            index === noteData.index ? { ...noteData, index: undefined } : note
          ),
        };
      } else {
        return {
          ...prev,
          notes: [...prev.notes, noteData],
        };
      }
    });
    setShowNotesModal(false);
    setCurrentNote(null);
  };

  const removeNote = (noteIndex) => {
    setNewCourse((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, index) => index !== noteIndex),
    }));
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();

    // Validate form
    if (!newCourse.title || !newCourse.price || !newCourse.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new course object
    const courseToAdd = {
      id: courses.length + 1,
      title: newCourse.title,
      thumbnail: newCourse.thumbnail
        ? URL.createObjectURL(newCourse.thumbnail)
        : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      price: parseFloat(newCourse.price),
      originalPrice: newCourse.originalPrice
        ? parseFloat(newCourse.originalPrice)
        : parseFloat(newCourse.price),
      category: newCourse.category,
      reviews: [],
    };

    // Add to courses array
    setCourses((prev) => [...prev, courseToAdd]);

    // Reset form and close
    handleCancelCreate();
    alert("Course created successfully!");
  };

  const renderStars = (rating) => {
    return (
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
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categories = [
    "Web Development",
    "Backend Development",
    "Frontend Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Database",
    "UI/UX Design",
    "Other",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>My Courses</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Manage and track your course performance
              </p>
            </div>

            {/* Create Course Button */}
            <button
              onClick={handleCreateCourse}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="p-4 sm:p-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title and Category */}
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {course.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${course.price}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-sm line-through text-gray-600">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Reviews Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => openReviewsModal(course)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>View Reviews ({course.reviews.length})</span>
                      </button>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Link
                        href={`/instructor/my-courses/${course.id}/edit`}
                        className="block"
                      >
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                          <Edit className="w-4 h-4" />
                          <span>Edit Course</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                No courses yet
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mb-6">
                Create your first course to start teaching
              </p>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Create New Course
                </h3>
                <button
                  onClick={handleCancelCreate}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mt-4">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("basic")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === "basic"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-800 hover:text-gray-900"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Basic Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === "curriculum"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-800 hover:text-gray-900"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Curriculum</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === "notes"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-800 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Course Notes</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              <form onSubmit={handleSubmitCourse}>
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          value={newCourse.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Enter course title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Category *
                        </label>
                        <select
                          value={newCourse.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={newCourse.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Describe your course..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Level *
                        </label>
                        <select
                          value={newCourse.level}
                          onChange={(e) =>
                            handleInputChange("level", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          required
                        >
                          <option value="">Select level</option>
                          {levels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          value={newCourse.price}
                          onChange={(e) =>
                            handleInputChange("price", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Original Price ($)
                        </label>
                        <input
                          type="number"
                          value={newCourse.originalPrice}
                          onChange={(e) =>
                            handleInputChange("originalPrice", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Course Thumbnail
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "thumbnail")}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-800">
                            {newCourse.thumbnail
                              ? newCourse.thumbnail.name
                              : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-xs text-gray-700">
                            PNG, JPG up to 2MB
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Requirements
                      </label>
                      <div className="space-y-2">
                        {newCourse.requirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={req}
                              onChange={(e) =>
                                handleArrayChange(
                                  "requirements",
                                  index,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Enter requirement"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("requirements", index)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("requirements")}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Requirement</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Learning Objectives
                      </label>
                      <div className="space-y-2">
                        {newCourse.objectives.map((obj, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={obj}
                              onChange={(e) =>
                                handleArrayChange(
                                  "objectives",
                                  index,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Enter learning objective"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("objectives", index)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("objectives")}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Objective</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Course Curriculum
                      </h3>
                      <button
                        type="button"
                        onClick={addChapter}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Chapter</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newCourse.chapters.map((chapter, chapterIndex) => (
                        <div
                          key={chapter.id}
                          className="border border-gray-200 rounded-lg"
                        >
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={chapter.title}
                                onChange={(e) =>
                                  handleChapterChange(
                                    chapterIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="flex-1 font-mediu bg-transparent border-none focus:outline-none text-black"
                                placeholder="Chapter title"
                              />
                              {newCourse.chapters.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeChapter(chapterIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {chapter.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3 flex-1">
                                      <Video className="w-5 h-5 text-gray-600" />
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) =>
                                          handleLessonChange(
                                            chapterIndex,
                                            lessonIndex,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className="flex-1 bg-transparent border-none focus:outline-none text-black font-medium"
                                        placeholder="Lesson title"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={lesson.duration}
                                        onChange={(e) =>
                                          handleLessonChange(
                                            chapterIndex,
                                            lessonIndex,
                                            "duration",
                                            e.target.value
                                          )
                                        }
                                        className="w-20 text-sm text-black bg-transparent border border-gray-300 rounded px-2 py-1 text-center"
                                        placeholder="00:00"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openVideoModal(
                                            chapterIndex,
                                            lessonIndex
                                          )
                                        }
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Manage Video"
                                      >
                                        <Play className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeLesson(
                                            chapterIndex,
                                            lessonIndex
                                          )
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <textarea
                                    value={lesson.description}
                                    onChange={(e) =>
                                      handleLessonChange(
                                        chapterIndex,
                                        lessonIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-sm text-black bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Lesson description"
                                    rows={2}
                                  />

                                  {lesson.videoUrl && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                      <div className="flex items-center space-x-2 text-sm text-green-800">
                                        <Video className="w-4 h-4" />
                                        <span>
                                          Video{" "}
                                          {lesson.videoType === "youtube"
                                            ? "Link"
                                            : lesson.videoType === "upload"
                                            ? "Uploaded"
                                            : "Added"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addLesson(chapterIndex)}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 p-2"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Lesson</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Course Notes & Resources
                      </h3>
                      <button
                        type="button"
                        onClick={addNote}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Note</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newCourse.notes.map((note, index) => (
                        <div
                          key={note.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {note.title}
                                </h4>
                                <p className="text-sm text-gray-700 mb-2">
                                  {note.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-700">
                                  <span>{note.fileName}</span>
                                  <span>{note.fileSize}</span>
                                  <span>Added: {note.uploadedAt}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => editNote(index)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit Note"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeNote(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete Note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {newCourse.notes.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No notes added yet
                          </h3>
                          <p className="text-gray-700 mb-4">
                            Add course materials, references, and resources for
                            your students
                          </p>
                          <button
                            type="button"
                            onClick={addNote}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add First Note</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>

              <div className="flex space-x-3">
                {activeTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "curriculum", "notes"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}

                {activeTab !== "notes" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "curriculum", "notes"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitCourse}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create Course</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Management Modal */}
      {showVideoModal && currentVideoLesson && (
        <VideoModal
          lesson={
            newCourse.chapters[currentVideoLesson.chapterIndex].lessons[
              currentVideoLesson.lessonIndex
            ]
          }
          onClose={closeVideoModal}
          onVideoUpload={handleVideoUpload}
          onVideoLink={handleVideoLink}
        />
      )}

      {/* Notes Management Modal */}
      {showNotesModal && (
        <NotesModal
          note={currentNote}
          onClose={() => setShowNotesModal(false)}
          onSave={saveNote}
        />
      )}

      {/* Reviews Modal */}
      {showReviewsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCourse.title} - Reviews
                  </h3>
                </div>
                <button
                  onClick={closeReviewsModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedCourse.reviews.length > 0 ? (
                <div className="space-y-6">
                  {selectedCourse.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.studentName}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">
                                  {formatDate(review.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-800">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    This course hasn't received any reviews yet.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeReviewsModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Video Management Modal Component
const VideoModal = ({ lesson, onClose, onVideoUpload, onVideoLink }) => {
  const [videoType, setVideoType] = useState(lesson.videoType || "upload");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (videoType === "upload" && selectedFile) {
      onVideoUpload(selectedFile);
    } else if ((videoType === "youtube" || videoType === "link") && videoUrl) {
      onVideoLink(videoUrl, videoType);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Manage Video</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Video Source
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setVideoType("upload")}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === "upload"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400 text-gray-800"
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Upload Video</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoType("youtube")}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === "youtube"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400 text-gray-800"
                }`}
              >
                <Video className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">YouTube Link</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoType("link")}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === "link"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400 text-gray-800"
                }`}
              >
                <LinkIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">External Link</span>
              </button>
            </div>
          </div>

          {videoType === "upload" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload Video File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-800">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to upload video or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    MP4, MOV, AVI up to 500MB
                  </p>
                </label>
              </div>
            </div>
          )}

          {(videoType === "youtube" || videoType === "link") && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {videoType === "youtube" ? "YouTube URL" : "Video URL"}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder={
                  videoType === "youtube"
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://example.com/video.mp4"
                }
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              (videoType === "upload" && !selectedFile) ||
              ((videoType === "youtube" || videoType === "link") && !videoUrl)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Video
          </button>
        </div>
      </div>
    </div>
  );
};

// Notes Management Modal Component
const NotesModal = ({ note, onClose, onSave }) => {
  const [noteData, setNoteData] = useState({
    title: note?.title || "",
    description: note?.description || "",
    fileName: note?.fileName || "",
    type: note?.type || "pdf",
    file: note?.file || null,
    ...note,
  });

  const handleInputChange = (field, value) => {
    setNoteData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNoteData((prev) => ({
        ...prev,
        file: file,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.name.split(".").pop().toLowerCase(),
      }));
    }
  };

  const handleSave = () => {
    if (
      noteData.title &&
      noteData.description &&
      (noteData.file || noteData.fileName)
    ) {
      onSave({
        ...noteData,
        uploadedAt:
          noteData.uploadedAt || new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {note?.index !== undefined ? "Edit Note" : "Add Note"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={noteData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={noteData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter note description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="note-file-upload"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
              />
              <label htmlFor="note-file-upload" className="cursor-pointer">
                <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-800">
                  {noteData.fileName || "Click to upload file or drag and drop"}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  PDF, DOC, PPT, TXT, ZIP up to 10MB
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !noteData.title ||
              !noteData.description ||
              (!noteData.file && !noteData.fileName)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {note?.index !== undefined ? "Update Note" : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorMyCoursesPage;
