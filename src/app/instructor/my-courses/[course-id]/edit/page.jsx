"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  BookOpen,
  Video,
  FileText,
  Download,
  Eye,
  Edit,
  Calendar,
  Link as LinkIcon,
  Play,
} from 'lucide-react';
import Link from 'next/link';

const EditCoursePage = () => {
  const params = useParams();
  const router = useRouter();

  const [courseData, setCourseData] = useState({
    title: "React Front To Back",
    description: "Complete React development course from basics to advanced concepts",
    category: "Web Development",
    level: "Intermediate",
    price: 60,
    originalPrice: 84.99,
    thumbnail: "",
    requirements: ["Basic JavaScript knowledge", "HTML/CSS fundamentals"],
    objectives: ["Master React fundamentals", "Build real-world projects", "Understand modern React patterns"],
    chapters: [
      {
        id: 1,
        title: "React Fundamentals",
        lessons: [
          { 
            id: 1, 
            title: "What is React?", 
            duration: "19:45", 
            videoUrl: "https://www.youtube.com/embed/qnrYvsBdtD8",
            videoType: "youtube", // youtube, upload, link
            videoFile: null,
            description: "Introduction to React library and its core concepts"
          },
          { 
            id: 2, 
            title: "Setting Up Environment", 
            duration: "25:30", 
            videoUrl: "",
            videoType: "upload",
            videoFile: null,
            description: "Install Node.js, npm, and create your first React app"
          }
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
        type: "pdf",
        file: null
      },
      {
        id: 2,
        title: "React Cheat Sheet",
        description: "Quick reference for React hooks and components",
        fileName: "react-cheatsheet.pdf",
        fileSize: "180 KB",
        uploadedAt: "2024-01-20",
        downloadUrl: "#",
        type: "pdf",
        file: null
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoLesson, setCurrentVideoLesson] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handler for chapter changes
  const handleChapterChange = (chapterIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) => 
        index === chapterIndex ? { ...chapter, [field]: value } : chapter
      )
    }));
  };

  // Handler for lesson changes
  const handleLessonChange = (chapterIndex, lessonIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, chIndex) => 
        chIndex === chapterIndex 
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : chapter
      )
    }));
  };

  // Handler for adding new chapters
  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: "New Chapter",
      lessons: []
    };
    setCourseData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  // Handler for adding new lessons
  const addLesson = (chapterIndex) => {
    const newLesson = {
      id: Date.now(),
      title: "New Lesson",
      duration: "00:00",
      videoUrl: "",
      videoType: "upload",
      videoFile: null,
      description: ""
    };
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) =>
        index === chapterIndex
          ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
          : chapter
      )
    }));
  };

  // Handler for removing lessons
  const removeLesson = (chapterIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, index) =>
        index === chapterIndex
          ? { ...chapter, lessons: chapter.lessons.filter((_, lIndex) => lIndex !== lessonIndex) }
          : chapter
      )
    }));
  };

  // Video management functions
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
      handleLessonChange(chapterIndex, lessonIndex, 'videoFile', file);
      handleLessonChange(chapterIndex, lessonIndex, 'videoType', 'upload');
      handleLessonChange(chapterIndex, lessonIndex, 'videoUrl', URL.createObjectURL(file));
    }
  };

  const handleVideoLink = (url, type) => {
    if (currentVideoLesson) {
      const { chapterIndex, lessonIndex } = currentVideoLesson;
      handleLessonChange(chapterIndex, lessonIndex, 'videoUrl', url);
      handleLessonChange(chapterIndex, lessonIndex, 'videoType', type);
      handleLessonChange(chapterIndex, lessonIndex, 'videoFile', null);
    }
  };

  // Notes management functions
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      fileName: "",
      fileSize: "",
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadUrl: "#",
      type: "pdf",
      file: null
    };
    setCurrentNote(newNote);
    setShowNotesModal(true);
  };

  const editNote = (noteIndex) => {
    setCurrentNote({ ...courseData.notes[noteIndex], index: noteIndex });
    setShowNotesModal(true);
  };

  const saveNote = (noteData) => {
    setCourseData(prev => {
      if (noteData.index !== undefined) {
        // Edit existing note
        return {
          ...prev,
          notes: prev.notes.map((note, index) => 
            index === noteData.index ? { ...noteData, index: undefined } : note
          )
        };
      } else {
        // Add new note
        return {
          ...prev,
          notes: [...prev.notes, noteData]
        };
      }
    });
    setShowNotesModal(false);
    setCurrentNote(null);
  };

  const removeNote = (noteIndex) => {
    setCourseData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, index) => index !== noteIndex)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving course:', courseData);
      setTimeout(() => {
        setIsSaving(false);
        alert('Course updated successfully!');
      }, 1000);
    } catch (error) {
      setIsSaving(false);
      alert('Error saving course');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Video },
    { id: 'notes', label: 'Course Notes', icon: FileText },
  ];

  return (
    <>
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Link href="/instructor/my-courses">
                  <button className="flex items-center space-x-2 text-gray-900 hover:text-gray-800">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Courses</span>
                  </button>
                </Link>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Edit Course
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-4 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-800 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      value={courseData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Level
                    </label>
                    <select
                      value={courseData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={courseData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      value={courseData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-800">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-700">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Requirements
                  </label>
                  <div className="space-y-2">
                    {courseData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                          placeholder="Enter requirement"
                        />
                        <button
                          onClick={() => removeArrayItem('requirements', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('requirements')}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Requirement</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Course Curriculum</h3>
                  <button 
                    onClick={addChapter}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Chapter</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {courseData.chapters.map((chapter, chapterIndex) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) => handleChapterChange(chapterIndex, 'title', e.target.value)}
                          className="w-full font-medium text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-600"
                          placeholder="Chapter title"
                        />
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3 flex-1">
                                  <Video className="w-5 h-5 text-gray-700" />
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'title', e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-600 text-gray-900 font-medium"
                                    placeholder="Lesson title"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={lesson.duration}
                                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'duration', e.target.value)}
                                    className="w-20 text-sm text-gray-900 bg-transparent border border-gray-300 rounded px-2 py-1 text-center placeholder-gray-600"
                                    placeholder="00:00"
                                  />
                                  <button
                                    onClick={() => openVideoModal(chapterIndex, lessonIndex)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Manage Video"
                                  >
                                    <Play className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => removeLesson(chapterIndex, lessonIndex)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <textarea
                                value={lesson.description}
                                onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'description', e.target.value)}
                                className="w-full text-sm text-gray-700 bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                                placeholder="Lesson description"
                                rows={2}
                              />
                              
                              {lesson.videoUrl && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                  <div className="flex items-center space-x-2 text-sm text-green-800">
                                    <Video className="w-4 h-4" />
                                    <span>
                                      Video {lesson.videoType === 'youtube' ? 'Link' : 
                                             lesson.videoType === 'upload' ? 'Uploaded' : 'Added'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <button 
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

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Course Notes & Resources</h3>
                  <button 
                    onClick={addNote}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Note</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {courseData.notes.map((note, index) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{note.title}</h4>
                            <p className="text-sm text-gray-700 mb-2">{note.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-700">
                              <span>{note.fileName}</span>
                              <span>{note.fileSize}</span>
                              <span>Added: {note.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editNote(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit Note"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
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
                  
                  {courseData.notes.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes added yet</h3>
                      <p className="text-gray-700 mb-4">Add course materials, references, and resources for your students</p>
                      <button 
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
          </div>
        </div>
      </div>

      {/* Video Management Modal */}
      {showVideoModal && currentVideoLesson && (
        <VideoModal
          lesson={courseData.chapters[currentVideoLesson.chapterIndex].lessons[currentVideoLesson.lessonIndex]}
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
    </>
  );
};

// Video Management Modal Component
const VideoModal = ({ lesson, onClose, onVideoUpload, onVideoLink }) => {
  const [videoType, setVideoType] = useState(lesson.videoType || 'upload');
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (videoType === 'upload' && selectedFile) {
      onVideoUpload(selectedFile);
    } else if ((videoType === 'youtube' || videoType === 'link') && videoUrl) {
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
                onClick={() => setVideoType('upload')}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === 'upload' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Upload Video</span>
              </button>
              
              <button
                onClick={() => setVideoType('youtube')}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === 'youtube' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
              >
                <Video className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">YouTube Link</span>
              </button>
              
              <button
                onClick={() => setVideoType('link')}
                className={`p-4 border-2 rounded-lg text-center ${
                  videoType === 'link' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
              >
                <LinkIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">External Link</span>
              </button>
            </div>
          </div>

          {videoType === 'upload' && (
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
                    {selectedFile ? selectedFile.name : 'Click to upload video or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">MP4, MOV, AVI up to 500MB</p>
                </label>
              </div>
            </div>
          )}

          {(videoType === 'youtube' || videoType === 'link') && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {videoType === 'youtube' ? 'YouTube URL' : 'Video URL'}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
                placeholder={videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/video.mp4'}
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
              (videoType === 'upload' && !selectedFile) ||
              ((videoType === 'youtube' || videoType === 'link') && !videoUrl)
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

// Notes Management Modal Component - FIXED COLORS
const NotesModal = ({ note, onClose, onSave }) => {
  const [noteData, setNoteData] = useState({
    title: note?.title || '',
    description: note?.description || '',
    fileName: note?.fileName || '',
    type: note?.type || 'pdf',
    file: note?.file || null,
    ...note
  });

  const handleInputChange = (field, value) => {
    setNoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNoteData(prev => ({
        ...prev,
        file: file,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.name.split('.').pop().toLowerCase()
      }));
    }
  };

  const handleSave = () => {
    if (noteData.title && noteData.description && (noteData.file || noteData.fileName)) {
      onSave({
        ...noteData,
        uploadedAt: noteData.uploadedAt || new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {note?.index !== undefined ? 'Edit Note' : 'Add Note'}
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
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={noteData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 text-gray-900"
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
                  {noteData.fileName || 'Click to upload file or drag and drop'}
                </p>
                <p className="text-xs text-gray-700 mt-1">PDF, DOC, PPT, TXT, ZIP up to 10MB</p>
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
            disabled={!noteData.title || !noteData.description || (!noteData.file && !noteData.fileName)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {note?.index !== undefined ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
