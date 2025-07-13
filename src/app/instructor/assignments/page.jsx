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
} from "lucide-react";
import Link from "next/link";

const InstructorAssignmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
          submissionText: "I have created a React Todo app with all the required features...",
          files: ["todo-app.zip", "readme.md"],
          feedback: "Great work! Clean code and good implementation of hooks."
        },
        {
          id: 2,
          studentName: "Jane Smith",
          studentEmail: "jane.smith@email.com",
          submittedAt: "2024-02-13",
          status: "submitted",
          score: null,
          submissionText: "My React Todo application includes all requested functionality...",
          files: ["react-todo.zip"],
          feedback: null
        },
        {
          id: 3,
          studentName: "Mike Johnson",
          studentEmail: "mike.johnson@email.com",
          submittedAt: "2024-02-15",
          status: "submitted",
          score: null,
          submissionText: "Here is my completed Todo app with React hooks...",
          files: ["todo-project.zip", "demo-video.mp4"],
          feedback: null
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

  const openSubmissionsModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
  };

  const closeSubmissionsModal = () => {
    setShowSubmissionsModal(false);
    setSelectedAssignment(null);
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
                  <FileText className="w-5 h-5" />
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

                      {/* Submission Content */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Submission:</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {submission.submissionText}
                        </p>
                      </div>

                      {/* Files */}
                      {submission.files.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Files:</h5>
                          <div className="flex flex-wrap gap-2">
                            {submission.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-800">{file}</span>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      {submission.feedback && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Feedback:</h5>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                            {submission.feedback}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                        {submission.status === 'submitted' && (
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Grade Submission
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          View Details
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          Download All
                        </button>
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
