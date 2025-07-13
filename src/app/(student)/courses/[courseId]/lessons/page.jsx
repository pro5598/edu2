"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
  Circle,
  Clock,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  RotateCcw,
  X,
  FileText,
  Calendar,
  Download,
  Upload,
  AlertCircle,
  BookOpen,
  Paperclip,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CourseLessonsPage = () => {
  const params = useParams();
  const courseId = params.courseId;
  const videoRef = useRef(null);
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'assignments', or 'notes'
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Submit assignment modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Course-specific data with verified accessible videos
  const getCourseData = (courseId) => {
    const courseTemplates = {
      "1": {
        title: "React Front To Back",
        instructor: "Brad Traversy",
        description: "Complete React development course from basics to advanced",
        chapters: [
          {
            id: 1,
            title: "React Fundamentals",
            lessons: [
              {
                id: 1,
                title: "What is React?",
                duration: "19:45",
                description: "Introduction to React library and its core concepts",
                videoUrl: "https://www.youtube.com/embed/qnrYvsBdtD8",
                isYouTube: true,
              },
              {
                id: 2,
                title: "Setting Up React Environment",
                duration: "25:30",
                description: "Install Node.js, npm, and create your first React app",
                videoUrl: "https://www.youtube.com/embed/3OqiKTyH4r0",
                isYouTube: true,
              },
              {
                id: 3,
                title: "React Accessibility Best Practices",
                duration: "57:45",
                description: "Learn how to build accessible React applications",
                videoUrl: "https://www.youtube.com/embed/kz9e81oRs3Y",
                isYouTube: true,
              }
            ]
          },
          {
            id: 2,
            title: "Components and Props",
            lessons: [
              {
                id: 4,
                title: "React Components Deep Dive",
                duration: "45:20",
                description: "Creating and using functional components in React",
                videoUrl: "https://www.youtube.com/embed/lkFeFzhOEoc",
                isYouTube: true,
              },
              {
                id: 5,
                title: "Building Accessible React Apps",
                duration: "35:15",
                description: "Advanced techniques for accessible React development",
                videoUrl: "https://www.youtube.com/embed/-6OUjjhIr7E",
                isYouTube: true,
              }
            ]
          }
        ],
        assignments: [
          {
            id: 1,
            title: "Build a React Todo App",
            description: "Create a fully functional todo application using React hooks and local storage. Include add, delete, and toggle functionality.",
            dueDate: "2024-02-15",
            type: "project",
            maxScore: 100,
            status: "pending",
            submittedAt: null,
            score: null,
            feedback: null,
            requirements: [
              "Use React functional components",
              "Implement useState and useEffect hooks",
              "Add local storage persistence",
              "Include proper error handling"
            ],
          },
          {
            id: 2,
            title: "React Components Quiz",
            description: "Test your understanding of React components, props, and state management concepts.",
            dueDate: "2024-02-20",
            type: "quiz",
            maxScore: 50,
            status: "submitted",
            submittedAt: "2024-02-18",
            score: 45,
            feedback: "Great work! Minor issues with prop validation.",
            requirements: [
              "Complete all 20 questions",
              "Minimum 70% to pass",
              "Single attempt only"
            ]
          },
          {
            id: 3,
            title: "Component Lifecycle Assignment",
            description: "Create a React application demonstrating component lifecycle methods and hooks.",
            dueDate: "2024-02-25",
            type: "assignment",
            maxScore: 75,
            status: "graded",
            submittedAt: "2024-02-23",
            score: 68,
            feedback: "Good understanding of lifecycle. Consider optimizing re-renders.",
            requirements: [
              "Use both class and functional components",
              "Demonstrate useEffect cleanup",
              "Include performance optimizations"
            ]
          }
        ],
        notes: [
          {
            id: 1,
            title: "Course Syllabus",
            description: "Complete course outline and grading criteria",
            fileName: "react-syllabus.pdf",
            fileSize: "245 KB",
            uploadedAt: "2024-01-15",
            downloadUrl: "#",
            type: "pdf"
          },
          {
            id: 2,
            title: "React Cheat Sheet",
            description: "Quick reference for React hooks and components",
            fileName: "react-cheatsheet.pdf",
            fileSize: "180 KB",
            uploadedAt: "2024-01-20",
            downloadUrl: "#",
            type: "pdf"
          },
          {
            id: 3,
            title: "Project Requirements",
            description: "Detailed requirements for final project",
            fileName: "project-requirements.docx",
            fileSize: "95 KB",
            uploadedAt: "2024-02-01",
            downloadUrl: "#",
            type: "doc"
          },
          {
            id: 4,
            title: "Code Examples",
            description: "Sample code files for all lessons",
            fileName: "react-examples.zip",
            fileSize: "1.2 MB",
            uploadedAt: "2024-01-25",
            downloadUrl: "#",
            type: "zip"
          }
        ]
      },
      "2": {
        title: "PHP Beginner to Advanced",
        instructor: "John Smith",
        description: "Master PHP programming from basics to advanced concepts",
        chapters: [
          {
            id: 1,
            title: "PHP Basics",
            lessons: [
              {
                id: 1,
                title: "Introduction to PHP",
                duration: "3:15:36",
                description: "Complete PHP fundamentals and MySQL integration",
                videoUrl: "https://www.youtube.com/embed/BUCiSSyIGGU",
                isYouTube: true,
              },
              {
                id: 2,
                title: "PHP Complete Beginner's Guide",
                duration: "2:12:51",
                description: "Learn PHP 8 syntax, variables, functions, and OOP",
                videoUrl: "https://www.youtube.com/embed/oEgLT1hGX4U",
                isYouTube: true,
              },
              {
                id: 3,
                title: "PHP Full Course Tutorial",
                duration: "7:07:23",
                description: "Comprehensive PHP tutorial with MySQL database",
                videoUrl: "https://www.youtube.com/embed/t0syDUSbdfE",
                isYouTube: true,
              }
            ]
          },
          {
            id: 2,
            title: "Advanced PHP Concepts",
            lessons: [
              {
                id: 4,
                title: "PHP Expert Level Course",
                duration: "5:46:54",
                description: "Advanced PHP concepts, OOP, and web development",
                videoUrl: "https://www.youtube.com/embed/A5Aiy50mlbI",
                isYouTube: true,
              },
              {
                id: 5,
                title: "PHP Complete Tutorial",
                duration: "5:46:54",
                description: "PHP full course covering all essential concepts",
                videoUrl: "https://www.youtube.com/embed/6EukZDFE_Zg",
                isYouTube: true,
              }
            ]
          }
        ],
        assignments: [
          {
            id: 1,
            title: "PHP CRUD Application",
            description: "Build a complete CRUD application with PHP and MySQL for managing student records.",
            dueDate: "2024-02-28",
            type: "project",
            maxScore: 120,
            status: "pending",
            submittedAt: null,
            score: null,
            feedback: null,
            requirements: [
              "Use PHP 8+ features",
              "Implement proper SQL injection prevention",
              "Include form validation",
              "Add user authentication"
            ]
          }
        ],
        notes: [
          {
            id: 1,
            title: "PHP Documentation",
            description: "Official PHP documentation and best practices",
            fileName: "php-docs.pdf",
            fileSize: "520 KB",
            uploadedAt: "2024-01-18",
            downloadUrl: "#",
            type: "pdf"
          },
          {
            id: 2,
            title: "MySQL Integration Guide",
            description: "Step-by-step guide for PHP-MySQL integration",
            fileName: "mysql-guide.pdf",
            fileSize: "380 KB",
            uploadedAt: "2024-01-22",
            downloadUrl: "#",
            type: "pdf"
          }
        ]
      },
      "3": {
        title: "Angular Zero to Mastery",
        instructor: "Sarah Johnson",
        description: "Complete Angular framework course for modern web development",
        chapters: [
          {
            id: 1,
            title: "Angular Fundamentals",
            lessons: [
              {
                id: 1,
                title: "Angular in 90 Minutes",
                duration: "1:29:08",
                description: "Complete Angular crash course for beginners",
                videoUrl: "https://www.youtube.com/embed/oUmVFHlwZsI",
                isYouTube: true,
              },
              {
                id: 2,
                title: "Angular Complete Tutorial",
                duration: "2:20:43",
                description: "Angular tutorial from beginner to advanced",
                videoUrl: "https://www.youtube.com/embed/Pd98NIR63cU",
                isYouTube: true,
              },
              {
                id: 3,
                title: "Learn Angular A-Z",
                duration: "4:21:33",
                description: "Comprehensive Angular course covering all fundamentals",
                videoUrl: "https://www.youtube.com/embed/JWhRMyyF7nc",
                isYouTube: true,
              }
            ]
          },
          {
            id: 2,
            title: "Angular Advanced Topics",
            lessons: [
              {
                id: 4,
                title: "Angular Accessibility Workshop",
                duration: "45:30",
                description: "Building accessible Angular applications",
                videoUrl: "https://www.youtube.com/embed/juf_HneUbMk",
                isYouTube: true,
              },
              {
                id: 5,
                title: "Angular Best Practices",
                duration: "35:20",
                description: "Advanced Angular patterns and best practices",
                videoUrl: "https://www.youtube.com/embed/oUmVFHlwZsI?start=3600",
                isYouTube: true,
              }
            ]
          }
        ],
        assignments: [
          {
            id: 1,
            title: "Angular Todo Application",
            description: "Create a todo application using Angular with routing, services, and reactive forms.",
            dueDate: "2024-03-05",
            type: "project",
            maxScore: 100,
            status: "pending",
            submittedAt: null,
            score: null,
            feedback: null,
            requirements: [
              "Use Angular CLI",
              "Implement routing",
              "Create reusable components",
              "Use reactive forms"
            ]
          }
        ],
        notes: [
          {
            id: 1,
            title: "Angular Style Guide",
            description: "Official Angular coding style guide and conventions",
            fileName: "angular-style-guide.pdf",
            fileSize: "420 KB",
            uploadedAt: "2024-01-20",
            downloadUrl: "#",
            type: "pdf"
          },
          {
            id: 2,
            title: "TypeScript Fundamentals",
            description: "Essential TypeScript concepts for Angular development",
            fileName: "typescript-fundamentals.pdf",
            fileSize: "290 KB",
            uploadedAt: "2024-01-25",
            downloadUrl: "#",
            type: "pdf"
          }
        ]
      }
    };

    return courseTemplates[courseId] || {
      title: "Course Not Found",
      instructor: "Unknown",
      description: "Course content not available",
      chapters: [],
      assignments: [],
      notes: []
    };
  };

  const courseData = getCourseData(courseId);
  const allLessons = courseData.chapters.flatMap(chapter => chapter.lessons);
  const currentLessonData = allLessons[currentLesson];

  // Video event handlers (simplified for YouTube)
  useEffect(() => {
    if (currentLessonData?.isYouTube) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
  }, [currentLesson]);

  // Enhanced lesson completion functions with toggle capability
  const markLessonComplete = (lessonIndex) => {
    if (!completedLessons.includes(lessonIndex)) {
      setCompletedLessons([...completedLessons, lessonIndex]);
    }
  };

  const markLessonIncomplete = (lessonIndex) => {
    setCompletedLessons(completedLessons.filter(index => index !== lessonIndex));
  };

  // Toggle function for completion status
  const toggleLessonCompletion = (lessonIndex) => {
    if (completedLessons.includes(lessonIndex)) {
      markLessonIncomplete(lessonIndex);
    } else {
      markLessonComplete(lessonIndex);
    }
  };

  const goToNextLesson = () => {
    if (currentLesson < allLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  // Close sidebar when lesson is selected on mobile
  const selectLesson = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get type icon for assignments
  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'project':
        return <FileText className="w-4 h-4" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Get file type icon for notes
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'zip':
        return <Download className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // Handle assignment submission modal
  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
    setSubmissionText('');
    setSubmissionFiles([]);
    setSubmissionNotes('');
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionText('');
    setSubmissionFiles([]);
    setSubmissionNotes('');
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSubmissionFiles(prev => [...prev, ...files]);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setSubmissionFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle assignment submission
  const handleSubmitAssignment = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the submission to your backend
      console.log('Submitting assignment:', {
        assignmentId: selectedAssignment.id,
        submissionText,
        submissionFiles,
        submissionNotes
      });
      
      alert('Assignment submitted successfully!');
      closeSubmitModal();
    } catch (error) {
      alert('Error submitting assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle case where course doesn't exist
  if (courseData.chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link href="/courses">
                <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 flex-shrink-0">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline text-sm sm:text-base">Back to Courses</span>
                  <span className="sm:hidden text-sm">Back</span>
                </button>
              </Link>
              <div className="h-4 sm:h-6 w-px bg-gray-300 flex-shrink-0"></div>
              <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {courseData.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                {activeTab === 'lessons' ? `${currentLesson + 1}/${allLessons.length}` : 
                 activeTab === 'assignments' ? `${courseData.assignments?.length || 0} assignments` :
                 `${courseData.notes?.length || 0} notes`}
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 lg:hidden rounded-lg hover:bg-gray-100"
              >
                {showSidebar ? (
                  <X className="w-5 h-5" />
                ) : (
                  <List className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="flex">
          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'lg:mr-80' : ''}`}>
            {/* Video Player - Only show when on lessons tab */}
            {activeTab === 'lessons' && (
              <div className="bg-black relative">
                <div className="aspect-video relative">
                  {currentLessonData?.isYouTube ? (
                    <iframe
                      src={currentLessonData.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLessonData.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p className="text-sm sm:text-base">Video content loading...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {activeTab === 'lessons' && (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {currentLessonData?.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {currentLessonData?.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{currentLessonData?.duration}</span>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons with Revert Functionality */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <button
                      onClick={() => toggleLessonCompletion(currentLesson)}
                      className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        completedLessons.includes(currentLesson)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {completedLessons.includes(currentLesson) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span>
                        {completedLessons.includes(currentLesson) ? 'Completed' : 'Mark Complete'}
                      </span>
                    </button>

                    {/* Revert Button - Only show if lesson is completed */}
                    {completedLessons.includes(currentLesson) && (
                      <button
                        onClick={() => markLessonIncomplete(currentLesson)}
                        className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm sm:text-base"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Mark as Incomplete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentLesson === 0}
                    className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base ${
                      currentLesson === 0
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Lesson</span>
                  </button>
                  
                  <button
                    onClick={goToNextLesson}
                    disabled={currentLesson === allLessons.length - 1}
                    className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base ${
                      currentLesson === allLessons.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Assignments Content */}
            {activeTab === 'assignments' && (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Course Assignments
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Complete assignments to test your understanding and earn course credit.
                  </p>
                </div>

                {courseData.assignments && courseData.assignments.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(assignment.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-800 mb-3">
                              {assignment.description}
                            </p>
                            
                            {/* Assignment Details */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {formatDate(assignment.dueDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>Max Score: {assignment.maxScore} points</span>
                              </div>
                              {assignment.submittedAt && (
                                <div className="flex items-center space-x-1">
                                  <Upload className="w-4 h-4" />
                                  <span>Submitted: {formatDate(assignment.submittedAt)}</span>
                                </div>
                              )}
                              {assignment.score !== null && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Score: {assignment.score}/{assignment.maxScore}</span>
                                </div>
                              )}
                            </div>

                            {/* Requirements */}
                            {assignment.requirements && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  {assignment.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <span className="text-blue-600 mt-1">•</span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Feedback */}
                            {assignment.feedback && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-900 mb-1">Instructor Feedback:</h4>
                                <p className="text-sm text-blue-800">{assignment.feedback}</p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              {assignment.status === 'pending' && (
                                <button 
                                  onClick={() => openSubmitModal(assignment)}
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <Upload className="w-4 h-4" />
                                  <span>Submit Assignment</span>
                                </button>
                              )}
                              {assignment.status === 'submitted' && (
                                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                                  <Download className="w-4 h-4" />
                                  <span>Download Submission</span>
                                </button>
                              )}
                              {assignment.status === 'graded' && (
                                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                  <Download className="w-4 h-4" />
                                  <span>View Results</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No assignments yet
                    </h3>
                    <p className="text-gray-600">
                      Assignments will appear here when your instructor adds them.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes Content */}
            {activeTab === 'notes' && (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Course Notes & Resources
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Download course materials, references, and additional resources provided by your instructor.
                  </p>
                </div>

                {courseData.notes && courseData.notes.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                            {getFileIcon(note.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {note.title}
                            </h3>
                            <p className="text-sm text-gray-800 mb-3">
                              {note.description}
                            </p>
                            
                            {/* File Details */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-4">
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>{note.fileName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-4 h-4" />
                                <span>{note.fileSize}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Added: {formatDate(note.uploadedAt)}</span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <button 
                              onClick={() => window.open(note.downloadUrl, '_blank')}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download File</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No notes available
                    </h3>
                    <p className="text-gray-600">
                      Course notes and resources will appear here when your instructor adds them.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Sidebar with Tabs */}
          <div className={`${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-14 sm:top-16 right-0 w-full max-w-sm lg:w-80 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-white border-l border-gray-200 overflow-y-auto z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
            <div className="p-3 sm:p-4 lg:p-6">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'lessons'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Lessons
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'assignments'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* Lessons Tab Content */}
              {activeTab === 'lessons' && (
                <>
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hidden lg:block">Course Progress</h3>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>{completedLessons.length} of {allLessons.length} lessons</span>
                      <span>{Math.round((completedLessons.length / allLessons.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedLessons.length / allLessons.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Curriculum */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Course Curriculum</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {courseData.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="border border-gray-200 rounded-lg">
                          <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">{chapter.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{chapter.lessons.length} lessons</p>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {chapter.lessons.map((lesson, lessonIndex) => {
                              const globalLessonIndex = courseData.chapters
                                .slice(0, chapterIndex)
                                .reduce((acc, ch) => acc + ch.lessons.length, 0) + lessonIndex;
                              
                              const isCompleted = completedLessons.includes(globalLessonIndex);
                              const isCurrent = globalLessonIndex === currentLesson;
                              
                              return (
                                <div
                                  key={lesson.id}
                                  className={`group relative ${
                                    isCurrent ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                                  }`}
                                >
                                  <button
                                    onClick={() => selectLesson(globalLessonIndex)}
                                    className="w-full text-left p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                      {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate text-sm sm:text-base ${
                                          isCurrent ? 'text-blue-600' : 'text-gray-900'
                                        }`}>
                                          {lesson.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">{lesson.duration}</p>
                                      </div>
                                      {isCurrent && (
                                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                                      )}
                                    </div>
                                  </button>
                                  
                                  {/* Quick completion toggle button in sidebar */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLessonCompletion(globalLessonIndex);
                                    }}
                                    className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-xs ${
                                      isCompleted 
                                        ? 'text-orange-600 hover:bg-orange-50' 
                                        : 'text-green-600 hover:bg-green-50'
                                    }`}
                                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                  >
                                    {isCompleted ? (
                                      <RotateCcw className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Assignments Tab Content */}
              {activeTab === 'assignments' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Course Assignments</h3>
                  {courseData.assignments && courseData.assignments.length > 0 ? (
                    <div className="space-y-3">
                      {courseData.assignments.map((assignment) => (
                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2 mb-2">
                            <div className="flex-shrink-0 p-1 bg-blue-100 rounded">
                              {getTypeIcon(assignment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{assignment.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">Due: {formatDate(assignment.dueDate)}</p>
                            </div>
                          </div>
                          {assignment.score !== null && (
                            <div className="mt-2 text-xs text-gray-600">
                              Score: {assignment.score}/{assignment.maxScore}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No assignments available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab Content */}
              {activeTab === 'notes' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Course Notes</h3>
                  {courseData.notes && courseData.notes.length > 0 ? (
                    <div className="space-y-3">
                      {courseData.notes.map((note) => (
                        <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2 mb-2">
                            <div className="flex-shrink-0 p-1 bg-green-100 rounded">
                              {getFileIcon(note.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{note.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{note.fileName}</p>
                              <p className="text-xs text-gray-500">{note.fileSize}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(note.downloadUrl, '_blank')}
                            className="w-full flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No notes available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Submit Assignment</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedAssignment.title}</p>
                </div>
                <button
                  onClick={closeSubmitModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Assignment Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Assignment Details</h4>
                <p className="text-sm text-blue-800 mb-3">{selectedAssignment.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                  <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                  <span>Max Score: {selectedAssignment.maxScore} points</span>
                  <span>Type: {selectedAssignment.type}</span>
                </div>
              </div>

              {/* Requirements */}
              {selectedAssignment.requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedAssignment.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Submission Text
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter your submission text here..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload files</span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, TXT, ZIP, Images (Max 10MB each)
                    </span>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {submissionFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Uploaded Files:</h5>
                    {submissionFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Any additional notes for your instructor..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeSubmitModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={isSubmitting || (!submissionText.trim() && submissionFiles.length === 0)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Assignment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLessonsPage;
