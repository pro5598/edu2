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
  Eye,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VideoPlayer from "../../../../../components/VideoPlayer";

const CourseLessonsPage = () => {
  const params = useParams();
  const courseId = params.courseId;
  const videoRef = useRef(null);

  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [courseStatus, setCourseStatus] = useState("active");
  const [completionDate, setCompletionDate] = useState(null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showViewSubmissionModal, setShowViewSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);

        if (!response.ok) {
          throw new Error("Course not found");
        }

        const data = await response.json();
        const course = data.course;

        // Fetch student submissions for this course
        let submissionsMap = {};
        try {
          const submissionsResponse = await fetch(
            `/api/student/submissions?courseId=${courseId}`,
            {
              credentials: "include",
            }
          );
          if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            submissionsMap = submissionsData.submissions || {};
          }
        } catch (submissionError) {
          console.error("Error fetching submissions:", submissionError);
        }

        // Add submission status to assignments
        const assignmentsWithStatus = (data.assignments || []).map(
          (assignment) => {
            const submission = submissionsMap[assignment._id];
            return {
              ...assignment,
              submissionStatus: submission ? submission.status : null,
              score: submission ? submission.score : null,
              feedback: submission ? submission.feedback : null,
              submittedAt: submission ? submission.submittedAt : null,
              submissionText: submission ? submission.submissionText : "",
              submissionFiles: submission ? submission.submissionFiles : [],
              submissionNotes: submission ? submission.submissionNotes : "",
            };
          }
        );

        const formattedCourseData = {
          title: course.title,
          instructor: course.instructor.name,
          description: course.description,
          chapters: course.chapters || [],
          assignments: assignmentsWithStatus,
          notes: data.courseNotes,
        };

        console.log("Formatted course data:", formattedCourseData);
        console.log("Formatted chapters:", formattedCourseData.chapters);
        console.log(
          "Formatted chapters length:",
          formattedCourseData.chapters.length
        );

        setCourseData(formattedCourseData);
        setError(null);

        // Fetch progress data after course data is loaded
        await fetchProgressData();
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err.message);
        setCourseData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `/api/student/courses/${courseId}/progress`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const progressData = await response.json();
          const completedLessonIds = progressData.completedLessons;

          // Store progress information
          setCourseProgress(progressData.progress || 0);
          setCourseStatus(progressData.status || "active");
          setCompletionDate(progressData.completionDate);

          // Store completed lesson IDs for mapping to indices
          window.completedLessonIds = completedLessonIds;
          console.log("Fetched completed lesson IDs:", completedLessonIds);
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const allLessons = courseData
    ? courseData.chapters && courseData.chapters.length > 0
      ? courseData.chapters.flatMap((chapter) => chapter.lessons || [])
      : courseData.lessons || []
    : [];

  const currentLessonData = allLessons[currentLesson];

  // Map completed lesson IDs to indices when allLessons is available
  useEffect(() => {
    if (allLessons.length > 0 && window.completedLessonIds) {
      console.log("Mapping lesson IDs to indices...");
      console.log(
        "All lessons:",
        allLessons.map((l) => ({ id: l._id || l.id, title: l.title }))
      );
      console.log("Completed lesson IDs from API:", window.completedLessonIds);

      const completedIndices = [];
      allLessons.forEach((lesson, index) => {
        const lessonId = lesson._id || lesson.id;
        if (window.completedLessonIds.includes(lessonId)) {
          completedIndices.push(index);
          console.log(
            `Lesson "${lesson.title}" (ID: ${lessonId}) is completed - mapped to index ${index}`
          );
        }
      });

      console.log("Final completed indices:", completedIndices);
      setCompletedLessons(completedIndices);
      delete window.completedLessonIds;
    }
  }, [allLessons]);

  useEffect(() => {
    if (currentLessonData?.isYouTube) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentLesson, currentLessonData?.isYouTube]);

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Link href="/student/courses">
            <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const hasChapters = courseData?.chapters && courseData.chapters.length > 0;
  const hasLessons = courseData?.lessons && courseData.lessons.length > 0;
  const shouldShowComingSoon =
    !courseData.chapters ||
    (courseData.chapters.length === 0 &&
      (!courseData.lessons || courseData.lessons.length === 0));

  // Early return for courses without content
  if (shouldShowComingSoon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Course Content Coming Soon
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            This course is available but content is being prepared. Please check
            back later.
          </p>
          <Link href="/student/courses">
            <button className="bg-blue-600 text-white px-4 py-2 sm:px-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Enhanced lesson completion functions with API integration
  const markLessonComplete = async (lessonIndex) => {
    if (completedLessons.includes(lessonIndex)) {
      return;
    }

    const currentLessonData = allLessons[lessonIndex];
    const lessonId = currentLessonData?._id || currentLessonData?.id;
    if (!lessonId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/student/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompletedLessons([...completedLessons, lessonIndex]);

        setCourseProgress(data.progress || 0);
        if (data.progress === 100) {
          setCourseStatus("completed");
          setCompletionDate(new Date().toISOString());
        }
      } else {
        const error = await response.json();
        console.error("Failed to mark lesson as complete:", error);
        alert("Failed to mark lesson as complete. Please try again.");
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      alert("Failed to mark lesson as complete. Please try again.");
    }
  };

  const markLessonIncomplete = async (lessonIndex) => {
    if (!completedLessons.includes(lessonIndex)) return;

    const currentLessonData = allLessons[lessonIndex];
    const lessonId = currentLessonData?._id || currentLessonData?.id;
    if (!lessonId) return;

    try {
      const response = await fetch(
        `/api/student/lessons/${lessonId}/complete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompletedLessons(
          completedLessons.filter((index) => index !== lessonIndex)
        );

        // Update course progress and status
        setCourseProgress(data.progress || 0);
        if (data.progress < 100) {
          setCourseStatus("active");
          setCompletionDate(null);
        }
      } else {
        const error = await response.json();
        console.error("Failed to mark lesson as incomplete:", error);
        alert("Failed to mark lesson as incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Error marking lesson as incomplete:", error);
      alert("Failed to mark lesson as incomplete. Please try again.");
    }
  };

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get type icon for assignments
  const getTypeIcon = (type) => {
    switch (type) {
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      case "project":
        return <FileText className="w-4 h-4" />;
      case "assignment":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Get file type icon for notes
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "ppt":
      case "pptx":
        return <FileText className="w-4 h-4 text-orange-600" />;
      case "zip":
        return <Download className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // Handle assignment submission modal
  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
    setSubmissionText("");
    setSubmissionFiles([]);
    setSubmissionNotes("");
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionText("");
    setSubmissionFiles([]);
    setSubmissionNotes("");
  };

  const openViewSubmissionModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewSubmissionModal(true);
  };

  const closeViewSubmissionModal = () => {
    setShowViewSubmissionModal(false);
    setSelectedAssignment(null);
  };

  const downloadAssignmentDocument = (assignment) => {
    if (assignment.attachments && assignment.attachments.length > 0) {
      assignment.attachments.forEach((attachment) => {
        const link = document.createElement("a");
        link.href = attachment.url;
        link.download = attachment.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else {
      alert("No document attached to download");
    }
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSubmissionFiles((prev) => [...prev, ...files]);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setSubmissionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle assignment submission
  const handleSubmitAssignment = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("submissionText", submissionText);
      formData.append("submissionNotes", submissionNotes);

      // Add files to form data
      submissionFiles.forEach((file) => {
        formData.append("submissionFiles", file);
      });

      const response = await fetch(
        `/api/student/assignments/${selectedAssignment._id}/submit`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit assignment");
      }

      // Update the assignment status in the local state
      setCourseData((prevData) => ({
        ...prevData,
        assignments: prevData.assignments.map((assignment) =>
          assignment._id === selectedAssignment._id
            ? { ...assignment, submissionStatus: "submitted" }
            : assignment
        ),
      }));

      alert("Assignment submitted successfully!");
      closeSubmitModal();
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Error submitting assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Completion Banner */}
      {courseStatus === "completed" && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  🎉 Congratulations! Course Completed
                </h3>
                <p className="text-sm text-green-100">
                  You completed this course on{" "}
                  {completionDate
                    ? new Date(completionDate).toLocaleDateString()
                    : "recently"}
                  . Progress: {courseProgress}%
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Certificate Available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link href="/student/courses">
                <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 flex-shrink-0">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline text-sm sm:text-base">
                    Back to Courses
                  </span>
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
                {activeTab === "lessons"
                  ? `${currentLesson + 1}/${allLessons.length}`
                  : activeTab === "assignments"
                  ? `${courseData.assignments?.length || 0} assignments`
                  : `${courseData.notes?.length || 0} notes`}
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
          <div
            className={`flex-1 transition-all duration-300 ${
              showSidebar ? "lg:mr-80" : ""
            }`}
          >
            {/* Video Player - Only show when on lessons tab */}
            {activeTab === "lessons" && (
              <div className="bg-black relative">
                <div className="aspect-video relative">
                  {currentLessonData?.videoUrl ? (
                    <VideoPlayer
                      url={
                        currentLessonData.videoUrl.startsWith("http")
                          ? currentLessonData.videoUrl
                          : `${window.location.origin}${currentLessonData.videoUrl}`
                      }
                      className="w-full h-full"
                      timestamps={currentLessonData.timestamps || []}
                      onProgress={(currentTime) => {
                        setCurrentTime(currentTime);
                      }}
                      handleDuration={(duration) => {
                        setDuration(duration);
                      }}
                      onEnded={() => {
                        // Auto-mark lesson as complete when video ends
                        if (!completedLessons.includes(currentLesson)) {
                          toggleLessonCompletion(currentLesson);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p className="text-sm sm:text-base">
                        Video content loading...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {activeTab === "lessons" && (
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
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {completedLessons.includes(currentLesson) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span>
                        {completedLessons.includes(currentLesson)
                          ? "Completed"
                          : "Mark Complete"}
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
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Assignments Content */}
            {activeTab === "assignments" && (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Course Assignments
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Complete assignments to test your understanding and earn
                    course credit.
                  </p>
                </div>

                {courseData.assignments && courseData.assignments.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.assignments.map((assignment, index) => (
                      <div
                        key={index}
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
                                <span>
                                  Due: {formatDate(assignment.dueDate)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>
                                  Max Score: {assignment.maxScore} points
                                </span>
                              </div>
                              {assignment.submittedAt && (
                                <div className="flex items-center space-x-1">
                                  <Upload className="w-4 h-4" />
                                  <span>
                                    Submitted:{" "}
                                    {formatDate(assignment.submittedAt)}
                                  </span>
                                </div>
                              )}
                              {assignment.score !== null && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    Score: {assignment.score}/
                                    {assignment.maxScore}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Requirements */}
                            {assignment.requirements && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Requirements:
                                </h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  {assignment.requirements.map((req, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-2"
                                    >
                                      <span className="text-blue-600 mt-1">
                                        •
                                      </span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Feedback */}
                            {assignment.feedback && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-900 mb-1">
                                  Instructor Feedback:
                                </h4>
                                <p className="text-sm text-blue-800">
                                  {assignment.feedback}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {assignment.submissionStatus ===
                                "Not Submitted" &&
                                !isOverdue(assignment.dueDate) && (
                                  <button
                                    onClick={() => openSubmitModal(assignment)}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    <Upload className="w-4 h-4" />
                                    <span>Submit Assignment</span>
                                  </button>
                                )}

                              {(assignment.submissionStatus ===
                                "Submitted - Awaiting Grade" ||
                                assignment.submissionStatus === "Graded") && (
                                <button
                                  onClick={() =>
                                    openViewSubmissionModal(assignment)
                                  }
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Submission</span>
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  downloadAssignmentDocument(assignment)
                                }
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                              </button>

                              {assignment.feedback && (
                                <button
                                  onClick={() => alert(assignment.feedback)}
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Feedback</span>
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
                      Assignments will appear here when your instructor adds
                      them.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes Content */}
            {activeTab === "notes" && (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Course Notes & Resources
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Download course materials, references, and additional
                    resources provided by your instructor.
                  </p>
                </div>

                {courseData.notes && courseData.notes.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.notes.map((note, index) => (
                      <div
                        key={index}
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
                                <span>
                                  Added: {formatDate(note.uploadedAt)}
                                </span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <button
                              onClick={() =>
                                window.open(note.downloadUrl, "_blank")
                              }
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
                      Course notes and resources will appear here when your
                      instructor adds them.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Sidebar with Tabs */}
          <div
            className={`${
              showSidebar ? "translate-x-0" : "translate-x-full"
            } lg:translate-x-0 fixed lg:sticky top-14 sm:top-16 right-0 w-full max-w-sm lg:w-80 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-white border-l border-gray-200 overflow-y-auto z-50 lg:z-auto transition-transform duration-300 ease-in-out`}
          >
            <div className="p-3 sm:p-4 lg:p-6">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Content
                </h3>
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
                  onClick={() => setActiveTab("lessons")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "lessons"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Lessons
                </button>
                <button
                  onClick={() => setActiveTab("assignments")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "assignments"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "notes"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* Lessons Tab Content */}
              {activeTab === "lessons" && (
                <>
                  {/* Course Status Section */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Course Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Overall Progress:</span>
                        <span className="font-medium text-gray-900">
                          {courseProgress || 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            courseStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : courseStatus === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {courseStatus === "completed"
                            ? "✅ Completed"
                            : courseStatus === "active"
                            ? "📚 In Progress"
                            : courseStatus || "Enrolled"}
                        </span>
                      </div>
                      {completionDate && (
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Completed:</span>
                          <span className="text-gray-900">
                            {new Date(completionDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hidden lg:block">
                      Lesson Progress
                    </h3>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>
                        {completedLessons.length} of {allLessons.length} lessons
                      </span>
                      <span>
                        {Math.round(
                          (completedLessons.length / allLessons.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (completedLessons.length / allLessons.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Curriculum */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Course Curriculum
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {courseData.chapters.map((chapter, chapterIndex) => (
                        <div
                          key={chapter.id}
                          className="border border-gray-200 rounded-lg"
                        >
                          <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              {chapter.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {chapter.lessons.length} lessons
                            </p>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {chapter.lessons.map((lesson, lessonIndex) => {
                              const globalLessonIndex =
                                courseData.chapters
                                  .slice(0, chapterIndex)
                                  .reduce(
                                    (acc, ch) => acc + ch.lessons.length,
                                    0
                                  ) + lessonIndex;

                              const isCompleted =
                                completedLessons.includes(globalLessonIndex);
                              const isCurrent =
                                globalLessonIndex === currentLesson;

                              return (
                                <div
                                  key={lesson.id}
                                  className={`group relative ${
                                    isCurrent
                                      ? "bg-blue-50 border-r-2 border-blue-600"
                                      : ""
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      selectLesson(globalLessonIndex)
                                    }
                                    className="w-full text-left p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                      {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`font-medium truncate text-sm sm:text-base ${
                                            isCurrent
                                              ? "text-blue-600"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {lesson.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                          {lesson.duration}
                                        </p>
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
                                        ? "text-orange-600 hover:bg-orange-50"
                                        : "text-green-600 hover:bg-green-50"
                                    }`}
                                    title={
                                      isCompleted
                                        ? "Mark as incomplete"
                                        : "Mark as complete"
                                    }
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
              {activeTab === "assignments" && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Course Assignments
                  </h3>
                  {courseData.assignments &&
                  courseData.assignments.length > 0 ? (
                    <div className="space-y-3">
                      {courseData.assignments.map((assignment, index) => {
                        const isSubmitted =
                          assignment.submissionStatus === "submitted";
                        const isGraded =
                          assignment.submissionStatus === "graded";
                        const isOverdue =
                          new Date(assignment.dueDate) < new Date() &&
                          !isSubmitted;

                        return (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-start space-x-2 mb-2">
                              <div className="flex-shrink-0 p-1 bg-blue-100 rounded">
                                {getTypeIcon(assignment.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                  {assignment.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {assignment.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                  <span className="text-gray-600">
                                    Due: {formatDate(assignment.dueDate)}
                                  </span>
                                  <span className="text-gray-600">
                                    Max Score: {assignment.maxScore} points
                                  </span>
                                  {isOverdue && (
                                    <span className="text-red-600 font-medium">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Submission Status */}
                            <div className="mb-3">
                              {isGraded ? (
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-800">
                                      Graded
                                    </span>
                                  </div>
                                  <div className="text-sm font-medium text-green-800">
                                    Score: {assignment.score || 0}/
                                    {assignment.maxScore}
                                  </div>
                                </div>
                              ) : isSubmitted ? (
                                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-blue-800">
                                    Submitted - Awaiting Grade
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  <span className="text-sm text-yellow-800">
                                    {isOverdue
                                      ? "Not Submitted - Overdue"
                                      : "Not Submitted"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {!isSubmitted && !isOverdue && (
                                <button
                                  onClick={() => openSubmitModal(assignment)}
                                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Submit Assignment</span>
                                </button>
                              )}

                              {isSubmitted && (
                                <button
                                  onClick={() => openSubmitModal(assignment)}
                                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Submission</span>
                                </button>
                              )}

                              {assignment.attachments &&
                                assignment.attachments.length > 0 && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        assignment.attachments[0].url,
                                        "_blank"
                                      )
                                    }
                                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>
                                )}

                              {isGraded && assignment.feedback && (
                                <button
                                  onClick={() => alert(assignment.feedback)}
                                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Feedback</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        No assignments available
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab Content */}
              {activeTab === "notes" && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Course Notes
                  </h3>
                  {courseData.notes && courseData.notes.length > 0 ? (
                    <div className="space-y-3">
                      {courseData.notes.map((note, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-start space-x-2 mb-2">
                            <div className="flex-shrink-0 p-1 bg-green-100 rounded">
                              {getFileIcon(note.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {note.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {note.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {note.fileSize}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              window.open(note.downloadUrl, "_blank")
                            }
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
                      <p className="text-sm text-gray-600">
                        No notes available
                      </p>
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
                  <h3 className="text-xl font-bold text-gray-900">
                    Submit Assignment
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssignment.title}
                  </p>
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
                <h4 className="font-medium text-blue-900 mb-2">
                  Assignment Details
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {selectedAssignment.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                  <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                  <span>Max Score: {selectedAssignment.maxScore} points</span>
                  <span>Type: {selectedAssignment.type}</span>
                </div>
              </div>

              {/* Requirements */}
              {selectedAssignment.requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Requirements:
                  </h4>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-black"
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
                    <span className="text-sm text-gray-600">
                      Click to upload files
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, TXT, ZIP, Images (Max 10MB each)
                    </span>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {submissionFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">
                      Uploaded Files:
                    </h5>
                    {submissionFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-black"
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
                disabled={
                  isSubmitting ||
                  (!submissionText.trim() && submissionFiles.length === 0)
                }
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

      {/* View Submission Modal */}
      {showViewSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    View Submission
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssignment.title}
                  </p>
                </div>
                <button
                  onClick={closeViewSubmissionModal}
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
                <h4 className="font-medium text-blue-900 mb-2">
                  Assignment Details
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {selectedAssignment.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                  <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                  <span>Max Score: {selectedAssignment.maxScore} points</span>
                  <span>Type: {selectedAssignment.type}</span>
                  {selectedAssignment.submittedAt && (
                    <span>
                      Submitted: {formatDate(selectedAssignment.submittedAt)}
                    </span>
                  )}
                  {selectedAssignment.score !== null && (
                    <span>
                      Score: {selectedAssignment.score}/
                      {selectedAssignment.maxScore}
                    </span>
                  )}
                </div>
              </div>

              {/* Submission Status */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  Submission Status
                </h4>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAssignment.submissionStatus === "Graded"
                        ? "bg-green-100 text-green-800"
                        : selectedAssignment.submissionStatus ===
                          "Submitted - Awaiting Grade"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedAssignment.submissionStatus}
                  </span>
                </div>
              </div>

              {/* Submitted Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Submitted Text
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[150px] whitespace-pre-wrap">
                  {selectedAssignment.submissionText ||
                    "No text submission provided"}
                </div>
              </div>

              {/* Submitted Files */}
              {selectedAssignment.submissionFiles &&
                selectedAssignment.submissionFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Submitted Files
                    </label>
                    <div className="space-y-2">
                      {selectedAssignment.submissionFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-2">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {file.filename || file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              (
                              {file.size
                                ? (file.size / 1024 / 1024).toFixed(2)
                                : "Unknown"}{" "}
                              MB)
                            </span>
                          </div>
                          {file.url && (
                            <button
                              onClick={() => window.open(file.url, "_blank")}
                              className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Submitted Notes */}
              {selectedAssignment.submissionNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Additional Notes
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[100px] whitespace-pre-wrap">
                    {selectedAssignment.submissionNotes}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {selectedAssignment.feedback && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Instructor Feedback
                  </h4>
                  <p className="text-sm text-purple-800 whitespace-pre-wrap">
                    {selectedAssignment.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeViewSubmissionModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

export default CourseLessonsPage;
