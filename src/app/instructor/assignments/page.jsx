// app/instructor/assignments/page.jsx
"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  BookOpen,
  CheckCircle,
  Eye,
  Users,
  Clock,
  Download,
  Calendar,
  Upload,
  X,
  ArrowLeft,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const InstructorAssignmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showSubmissionDetailModal, setShowSubmissionDetailModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  // Sample data with submission information
  const assignments = [
    {
      id: 1,
      title: "Build a React Todo App",
      course: "React Masterclass 2024",
      courseId: 1,
      description: "Create a fully functional todo application using React hooks and local storage",
      type: "project",
      maxScore: 100,
      dueDate: "2024-02-15",
      createdAt: "2024-01-01",
      totalStudents: 45,
      submittedCount: 32,
      gradedCount: 28,
      submissions: [
        {
          id: 1,
          studentName: "John Doe",
          studentEmail: "john.doe@email.com",
          submittedAt: "2024-02-14",
          status: "graded",
          score: 85,
          submissionText: "I have created a React Todo app with all the required features including:\n\n1. Add new todos\n2. Mark todos as complete\n3. Delete todos\n4. Filter todos (All, Active, Completed)\n5. Local storage persistence\n6. Responsive design\n\nThe application uses React hooks (useState, useEffect) for state management and localStorage for data persistence. I've also implemented proper error handling and user feedback.\n\nKey features implemented:\n- Component-based architecture\n- Clean and intuitive UI\n- Proper state management\n- Data persistence\n- Mobile-friendly design",
          files: [
            { name: "todo-app.zip", size: "2.5 MB", type: "application/zip" },
            { name: "readme.md", size: "1.2 KB", type: "text/markdown" },
            { name: "demo-screenshots.pdf", size: "850 KB", type: "application/pdf" }
          ],
          feedback: "Great work! Clean code and good implementation of hooks. Your component structure is well organized and the UI is intuitive. The local storage implementation is perfect. Consider adding unit tests for better code quality.",
          submissionHistory: [
            { date: "2024-02-14", action: "Submitted", details: "Initial submission" },
            { date: "2024-02-15", action: "Graded", details: "Score: 85/100" },
            { date: "2024-02-15", action: "Feedback Added", details: "Instructor feedback provided" }
          ]
        },
        {
          id: 2,
          studentName: "Jane Smith",
          studentEmail: "jane.smith@email.com",
          submittedAt: "2024-02-13",
          status: "submitted",
          score: null,
          submissionText: "My React Todo application includes all requested functionality. I've built it using modern React patterns with hooks and functional components.\n\nFeatures implemented:\n- Add, edit, and delete todos\n- Mark todos as complete/incomplete\n- Filter functionality (All, Active, Completed)\n- Local storage for data persistence\n- Responsive design for mobile and desktop\n- Clean, modern UI with CSS modules\n\nI've also added some extra features like:\n- Todo categories/tags\n- Due date functionality\n- Search functionality\n- Dark mode toggle\n\nThe code is well-documented and follows React best practices. I've used TypeScript for better type safety and included a comprehensive README with setup instructions.",
          files: [
            { name: "react-todo.zip", size: "3.1 MB", type: "application/zip" },
            { name: "project-documentation.pdf", size: "1.8 MB", type: "application/pdf" }
          ],
          feedback: null,
          submissionHistory: [
            { date: "2024-02-13", action: "Submitted", details: "Initial submission with extra features" }
          ]
        },
        {
          id: 3,
          studentName: "Mike Johnson",
          studentEmail: "mike.johnson@email.com",
          submittedAt: "2024-02-15",
          status: "submitted",
          score: null,
          submissionText: "Here is my completed Todo app with React hooks. I focused on creating a clean, functional application that meets all the requirements.\n\nImplemented features:\n- CRUD operations for todos\n- State management with useState and useReducer\n- Effect hooks for localStorage integration\n- Component composition and reusability\n- CSS-in-JS styling with styled-components\n\nI've also included:\n- Unit tests with Jest and React Testing Library\n- ESLint and Prettier configuration\n- GitHub Actions for CI/CD\n- Deployment to Netlify\n\nThe application is live at: https://mike-react-todo.netlify.app\n\nI've learned a lot about React hooks and modern development practices while building this project.",
          files: [
            { name: "todo-project.zip", size: "4.2 MB", type: "application/zip" },
            { name: "demo-video.mp4", size: "15.3 MB", type: "video/mp4" },
            { name: "test-coverage-report.html", size: "245 KB", type: "text/html" }
          ],
          feedback: null,
          submissionHistory: [
            { date: "2024-02-15", action: "Submitted", details: "Submission with live demo and tests" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "JavaScript ES6 Quiz",
      course: "JavaScript Fundamentals",
      courseId: 2,
      description: "Test your knowledge of ES6 features including arrow functions, destructuring, and modules",
      type: "quiz",
      maxScore: 50,
      dueDate: "2024-02-20",
      createdAt: "2024-01-05",
      totalStudents: 67,
      submittedCount: 45,
      gradedCount: 45,
      submissions: []
    },
    {
      id: 3,
      title: "Node.js API Development",
      course: "Node.js Complete Guide",
      courseId: 3,
      description: "Build a RESTful API with authentication and database integration",
      type: "project",
      maxScore: 150,
      dueDate: "2024-02-25",
      createdAt: "2023-12-20",
      totalStudents: 38,
      submittedCount: 38,
      gradedCount: 35,
      submissions: []
    },
    {
      id: 4,
      title: "CSS Flexbox Layout",
      course: "Web Design Fundamentals",
      courseId: 4,
      description: "Create responsive layouts using CSS Flexbox properties",
      type: "assignment",
      maxScore: 75,
      dueDate: "2024-02-28",
      createdAt: "2024-01-08",
      totalStudents: 52,
      submittedCount: 12,
      gradedCount: 0,
      submissions: []
    },
  ];

  const courses = [
    { id: 1, name: "React Masterclass 2024" },
    { id: 2, name: "JavaScript Fundamentals" },
    { id: 3, name: "Node.js Complete Guide" },
    { id: 4, name: "Web Design Fundamentals" },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || assignment.courseId.toString() === filterCourse;
    
    return matchesSearch && matchesCourse;
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('video')) return '🎥';
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip')) return '📦';
    if (type.includes('text')) return '📝';
    return '📁';
  };

  const openSubmissionsModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
  };

  const closeSubmissionsModal = () => {
    setShowSubmissionsModal(false);
    setSelectedAssignment(null);
  };

  const openSubmissionDetail = (submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.score?.toString() || "");
    setFeedbackInput(submission.feedback || "");
    setShowSubmissionDetailModal(true);
  };

  const closeSubmissionDetail = () => {
    setShowSubmissionDetailModal(false);
    setSelectedSubmission(null);
    setGradeInput("");
    setFeedbackInput("");
  };

  const handleGradeSubmission = () => {
    // Here you would typically make an API call to save the grade and feedback
    console.log("Grading submission:", {
      submissionId: selectedSubmission.id,
      grade: gradeInput,
      feedback: feedbackInput
    });
    
    // Update the submission in the local state (in a real app, this would come from the API)
    if (selectedAssignment && selectedSubmission) {
      const updatedAssignments = assignments.map(assignment => {
        if (assignment.id === selectedAssignment.id) {
          return {
            ...assignment,
            submissions: assignment.submissions.map(submission => {
              if (submission.id === selectedSubmission.id) {
                return {
                  ...submission,
                  score: parseInt(gradeInput),
                  feedback: feedbackInput,
                  status: 'graded'
                };
              }
              return submission;
            })
          };
        }
        return assignment;
      });
    }
    
    alert("Grade and feedback saved successfully!");
    closeSubmissionDetail();
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span>Assignments</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mt-1">
                Create and manage assignments for your courses
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
              />
            </div>

            {/* Course Filter */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="p-4 sm:p-6">
          {filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Assignment Info */}
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(assignment.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {assignment.course}
                        </p>
                        <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                          {assignment.description}
                        </p>
                        
                        {/* Assignment Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{assignment.totalStudents} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Upload className="w-4 h-4" />
                            <span>{assignment.submittedCount} submitted</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{assignment.gradedCount} graded</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 lg:ml-4">
                      <button
                        onClick={() => openSubmissionsModal(assignment)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Submissions</span>
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No assignments found
              </h3>
              <p className="text-gray-800 mb-6">
                {searchTerm || filterCourse !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first assignment to get started"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAssignment.title} - Submissions</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssignment.submittedCount} of {selectedAssignment.totalStudents} students submitted
                  </p>
                </div>
                <button
                  onClick={closeSubmissionsModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submissions List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedAssignment.submissions.length > 0 ? (
                <div className="space-y-4">
                  {selectedAssignment.submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{submission.studentName}</h4>
                          <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                          {submission.score !== null && (
                            <span className="text-sm font-medium text-gray-900">
                              {submission.score}/{selectedAssignment.maxScore}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submission Preview */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Submission Preview:</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-3">
                          {submission.submissionText}
                        </p>
                      </div>

                      {/* Files Preview */}
                      {submission.files.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Files ({submission.files.length}):</h5>
                          <div className="flex flex-wrap gap-2">
                            {submission.files.slice(0, 3).map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                                <span className="text-sm">{getFileIcon(file.type)}</span>
                                <span className="text-sm text-blue-800">{file.name}</span>
                                <span className="text-xs text-blue-600">({file.size})</span>
                              </div>
                            ))}
                            {submission.files.length > 3 && (
                              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                                <span className="text-sm text-gray-600">+{submission.files.length - 3} more</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => openSubmissionDetail(submission)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        {submission.status === 'submitted' && (
                          <button
                            onClick={() => openSubmissionDetail(submission)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Grade Submission
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600">Students haven't submitted their assignments yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeSubmissionsModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Export Submissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {showSubmissionDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeSubmissionDetail}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.studentName}'s Submission</h3>
                    <p className="text-sm text-gray-600">{selectedAssignment.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubmissionStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                  {selectedSubmission.score !== null && (
                    <span className="text-lg font-bold text-gray-900">
                      {selectedSubmission.score}/{selectedAssignment.maxScore}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submission Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Student Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Student Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedSubmission.studentName}</p>
                      <p><span className="font-medium">Email:</span> {selectedSubmission.studentEmail}</p>
                      <p><span className="font-medium">Submitted:</span> {formatDateTime(selectedSubmission.submittedAt)}</p>
                    </div>
                  </div>

                  {/* Submission Text */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Submission Content</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {selectedSubmission.submissionText}
                      </pre>
                    </div>
                  </div>

                  {/* Files */}
                  {selectedSubmission.files.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Submitted Files</h4>
                      <div className="space-y-2">
                        {selectedSubmission.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getFileIcon(file.type)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-600">{file.size} • {file.type}</p>
                              </div>
                            </div>
                            <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission History */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Submission History</h4>
                    <div className="space-y-2">
                      {selectedSubmission.submissionHistory.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">{formatDateTime(entry.date)}</span>
                          <span className="font-medium text-gray-900">{entry.action}</span>
                          <span className="text-gray-600">{entry.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grading Panel */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Grading</h4>
                    
                    {/* Score Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score (out of {selectedAssignment.maxScore})
                      </label>
                      <input
                        type="number"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        min="0"
                        max={selectedAssignment.maxScore}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter score"
                      />
                    </div>

                    {/* Feedback Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>
                      <textarea
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Provide feedback to the student..."
                      />
                    </div>

                    {/* Grade Button */}
                    <button
                      onClick={handleGradeSubmission}
                      disabled={!gradeInput}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedSubmission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                    </button>
                  </div>

                  {/* Current Feedback */}
                  {selectedSubmission.feedback && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Current Feedback</h4>
                      <p className="text-sm text-gray-700">{selectedSubmission.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeSubmissionDetail}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Assignment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
                  placeholder="Enter assignment title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Course
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800">
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Assignment Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800">
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
                  placeholder="Describe the assignment requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Max Score
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignmentsPage;
