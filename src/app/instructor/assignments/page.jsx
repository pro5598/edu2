// app/instructor/assignments/page.jsx
"use client";
import React, { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import CreateAssignmentModal from '../../../components/CreateAssignmentModal';

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
  
  // API state
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Functions - Using cookie-based authentication

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instructor/assignments', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/instructor/courses', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      setSubmissionsLoading(true);
      const response = await fetch(`/api/instructor/assignments/${assignmentId}/submissions`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const createAssignment = async (assignmentData, attachments) => {
    try {
      const formData = new FormData();
      formData.append('assignmentData', JSON.stringify(assignmentData));
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await fetch('/api/instructor/assignments', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }
      
      const data = await response.json();
      setAssignments(prev => [data.assignment, ...prev]);
      return data.assignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`/api/instructor/assignments/${assignmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }
      
      setAssignments(prev => prev.filter(assignment => assignment._id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };

  const gradeSubmission = async (assignmentId, submissionId, score, feedback) => {
    try {
      const response = await fetch(`/api/instructor/assignments/${assignmentId}/submissions/${submissionId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score, feedback })
      });
      
      if (!response.ok) {
        throw new Error('Failed to grade submission');
      }
      
      const data = await response.json();
      
      // Update submissions list
      setSubmissions(prev => prev.map(sub => 
        sub._id === submissionId ? data.submission : sub
      ));
      
      return data.submission;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || assignment.course?._id === filterCourse;
    
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

  const openSubmissionsModal = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
    await fetchSubmissions(assignment._id);
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

  const handleGradeSubmission = async () => {
    try {
      const updatedSubmission = await gradeSubmission(
        selectedAssignment._id,
        selectedSubmission._id,
        parseInt(gradeInput),
        feedbackInput
      );
      
      // Update the selected submission
      setSelectedSubmission(updatedSubmission);
      
      alert("Grade and feedback saved successfully!");
      closeSubmissionDetail();
    } catch (error) {
      console.error('Failed to grade submission:', error);
      alert('Failed to grade submission. Please try again.');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        await deleteAssignment(assignmentId);
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleCreateAssignment = async (assignmentData, attachments) => {
    try {
      await createAssignment(assignmentData, attachments);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment. Please try again.');
    }
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
                <option key={course._id} value={course._id.toString()}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-2" />
                <p>{error}</p>
              </div>
              <button
                onClick={fetchAssignments}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment._id}
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
                          {assignment.course?.title || 'Unknown Course'}
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
                            <span>{assignment.course?.enrollmentCount || 0} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Upload className="w-4 h-4" />
                            <span>{assignment.submissionCount || 0} submitted</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{assignment.gradedCount || 0} graded</span>
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
                      <button 
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
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
              {submissionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading submissions...</p>
                </div>
              ) : submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{submission.student?.name || 'Unknown Student'}</h4>
                          <p className="text-sm text-gray-600">{submission.student?.email || 'No email'}</p>
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
                          {submission.content || 'No text content'}
                        </p>
                      </div>

                      {/* Files Preview */}
                      {submission.attachments && submission.attachments.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Files ({submission.attachments.length}):</h5>
                          <div className="flex flex-wrap gap-2">
                            {submission.attachments.slice(0, 3).map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                                <span className="text-sm">{getFileIcon(file.mimetype || file.type)}</span>
                                <span className="text-sm text-blue-800">{file.originalname || file.name}</span>
                                <span className="text-xs text-blue-600">({file.size ? `${Math.round(file.size/1024)}KB` : 'Unknown size'})</span>
                              </div>
                            ))}
                            {submission.attachments.length > 3 && (
                              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                                <span className="text-sm text-gray-600">+{submission.attachments.length - 3} more</span>
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
                    <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.student?.name || 'Unknown Student'}'s Submission</h3>
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
                      <p><span className="font-medium">Name:</span> {selectedSubmission.student?.name || 'Unknown Student'}</p>
                      <p><span className="font-medium">Email:</span> {selectedSubmission.student?.email || 'No email'}</p>
                      <p><span className="font-medium">Submitted:</span> {formatDateTime(selectedSubmission.submittedAt)}</p>
                    </div>
                  </div>

                  {/* Submission Text */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Submission Content</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {selectedSubmission.content || 'No text content'}
                      </pre>
                    </div>
                  </div>

                  {/* Files */}
                  {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Submitted Files</h4>
                      <div className="space-y-2">
                        {selectedSubmission.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getFileIcon(file.mimetype || file.type)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{file.originalname || file.name}</p>
                                <p className="text-sm text-gray-600">{file.size ? `${Math.round(file.size/1024)}KB` : 'Unknown size'} • {file.mimetype || file.type}</p>
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
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">{formatDateTime(selectedSubmission.submittedAt)}</span>
                        <span className="font-medium text-gray-900">Submitted</span>
                        <span className="text-gray-600">Assignment submitted by student</span>
                      </div>
                      {selectedSubmission.gradedAt && (
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{formatDateTime(selectedSubmission.gradedAt)}</span>
                          <span className="font-medium text-gray-900">Graded</span>
                          <span className="text-gray-600">Score: {selectedSubmission.score}/{selectedAssignment.maxScore}</span>
                        </div>
                      )}
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
                      {selectedSubmission.score !== null && selectedSubmission.score !== undefined ? 'Update Grade' : 'Submit Grade'}
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
        <CreateAssignmentModal
          courses={courses}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAssignment}
        />
      )}
    </div>
  );
};

export default InstructorAssignmentsPage;
