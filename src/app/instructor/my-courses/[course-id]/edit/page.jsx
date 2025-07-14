"use client";
import React, { useState, useEffect } from 'react';
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
  Edit,
  Play,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import VideoPlayer from '../../../../../components/VideoPlayer';
import Link from 'next/link';

const EditCoursePage = () => {
  const params = useParams();
  const router = useRouter();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    originalPrice: 0,
    thumbnail: "",
    requirements: [],
    objectives: [],
    chapters: [],
    notes: [],
    isPublished: false
  });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoLesson, setCurrentVideoLesson] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/instructor/courses/${params['course-id']}`);
        if (response.ok) {
          const course = await response.json();
          setCourseData({
            title: course.title || '',
            description: course.description || '',
            category: course.category || '',
            level: course.level || '',
            price: course.price || 0,
            originalPrice: course.originalPrice || 0,
            thumbnail: course.thumbnail || '',
            requirements: course.requirements || [],
            objectives: course.objectives || [],
            chapters: (course.chapters || []).map(chapter => ({
              ...chapter,
              title: chapter.title || '',
              description: chapter.description || '',
              lessons: (chapter.lessons || []).map(lesson => ({
                ...lesson,
                title: lesson.title || '',
                description: lesson.description || '',
                duration: lesson.duration || '',
                timestamps: lesson.timestamps || []
              }))
            })),
            notes: [],
            isPublished: course.isPublished || false
          });
          
          // Fetch course notes separately
          await fetchCourseNotes();
        } else {
          console.error('Failed to fetch course');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseNotes = async () => {
      try {
        const response = await fetch(`/api/instructor/courses/${params['course-id']}/notes`);
        if (response.ok) {
          const data = await response.json();
          setCourseData(prev => ({
            ...prev,
            notes: data.notes || []
          }));
        } else {
          console.error('Failed to fetch course notes');
        }
      } catch (error) {
        console.error('Error fetching course notes:', error);
      }
    };

    if (params['course-id']) {
      fetchCourse();
    }
  }, [params]);

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
  const addChapter = async () => {
    try {
      const response = await fetch(`/api/instructor/courses/${params['course-id']}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Chapter',
          description: ''
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const newChapter = {
          ...result.chapter,
          title: result.chapter.title || '',
          description: result.chapter.description || '',
          lessons: []
        };
        setCourseData(prev => ({
          ...prev,
          chapters: [...prev.chapters, newChapter]
        }));
      } else {
        alert('Failed to create chapter');
      }
    } catch (error) {
      console.error('Error creating chapter:', error);
      alert('Error creating chapter');
    }
  };

  // Handler for adding new lessons
  const addLesson = async (chapterIndex) => {
    const chapter = courseData.chapters[chapterIndex];
    if (!chapter || !chapter._id) {
      alert('Please save the chapter first');
      return;
    }
    
    try {
      const response = await fetch(`/api/instructor/courses/${params['course-id']}/chapters/${chapter._id}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Lesson',
          description: '',
          duration: 0
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const newLesson = {
          ...result.lesson,
          title: result.lesson.title || '',
          description: result.lesson.description || '',
          duration: result.lesson.duration || '',
          timestamps: result.lesson.timestamps || []
        };
        setCourseData(prev => ({
          ...prev,
          chapters: prev.chapters.map((chapter, index) =>
            index === chapterIndex
              ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
              : chapter
          )
        }));
      } else {
        alert('Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson');
    }
  };

  // Handler for removing lessons
  const removeLesson = async (chapterIndex, lessonIndex) => {
    const chapter = courseData.chapters[chapterIndex];
    const lesson = chapter.lessons[lessonIndex];
    
    if (!lesson._id) {
      // If lesson doesn't have an ID, just remove from local state
      setCourseData(prev => ({
        ...prev,
        chapters: prev.chapters.map((chapter, index) =>
          index === chapterIndex
            ? { ...chapter, lessons: chapter.lessons.filter((_, lIndex) => lIndex !== lessonIndex) }
            : chapter
        )
      }));
      return;
    }
    
    try {
      const response = await fetch(`/api/instructor/courses/${params['course-id']}/chapters/${chapter._id}/lessons/${lesson._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCourseData(prev => ({
          ...prev,
          chapters: prev.chapters.map((chapter, index) =>
            index === chapterIndex
              ? { ...chapter, lessons: chapter.lessons.filter((_, lIndex) => lIndex !== lessonIndex) }
              : chapter
          )
        }));
      } else {
        alert('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    }
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

  const handleVideoUpload = async (file, lessonData) => {
    if (currentVideoLesson) {
      const { chapterIndex, lessonIndex } = currentVideoLesson;
      
      try {
        const formData = new FormData();
        formData.append('video', file);
        
        const response = await fetch('/api/uploads/videos', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          handleLessonChange(chapterIndex, lessonIndex, 'videoFile', file);
          handleLessonChange(chapterIndex, lessonIndex, 'videoType', 'upload');
          handleLessonChange(chapterIndex, lessonIndex, 'videoUrl', result.videoUrl);
          if (lessonData && lessonData.timestamps) {
            handleLessonChange(chapterIndex, lessonIndex, 'timestamps', lessonData.timestamps);
          }
        } else {
          alert('Failed to upload video');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        alert('Error uploading video');
      }
    }
  };

  const handleVideoLink = (url, type, lessonData) => {
    if (currentVideoLesson) {
      const { chapterIndex, lessonIndex } = currentVideoLesson;
      handleLessonChange(chapterIndex, lessonIndex, 'videoUrl', url);
      handleLessonChange(chapterIndex, lessonIndex, 'videoType', type);
      handleLessonChange(chapterIndex, lessonIndex, 'videoFile', null);
      if (lessonData && lessonData.timestamps) {
        handleLessonChange(chapterIndex, lessonIndex, 'timestamps', lessonData.timestamps);
      }
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

  const saveNote = async (noteData) => {
    if (!noteData.file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('noteData', JSON.stringify({
        title: noteData.title,
        description: noteData.description,
        order: noteData.order || 0
      }));
      formData.append('file', noteData.file);

      const url = noteData.index !== undefined 
        ? `/api/instructor/courses/${params['course-id']}/notes/${noteData._id}`
        : `/api/instructor/courses/${params['course-id']}/notes`;
      
      const method = noteData.index !== undefined ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        setCourseData(prev => {
          if (noteData.index !== undefined) {
            // Edit existing note
            return {
              ...prev,
              notes: prev.notes.map((note, index) => 
                index === noteData.index ? result.note : note
              )
            };
          } else {
            // Add new note
            return {
              ...prev,
              notes: [...prev.notes, result.note]
            };
          }
        });
        
        alert(noteData.index !== undefined ? 'Note updated successfully!' : 'Note added successfully!');
        setShowNotesModal(false);
        setCurrentNote(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to save note'}`);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note');
    }
  };

  const removeNote = async (noteIndex) => {
    const noteToDelete = courseData.notes[noteIndex];
    if (!noteToDelete._id) {
      // If note doesn't have an _id, it's only in local state
      setCourseData(prev => ({
        ...prev,
        notes: prev.notes.filter((_, index) => index !== noteIndex)
      }));
      return;
    }

    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/instructor/courses/${params['course-id']}/notes/${noteToDelete._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCourseData(prev => ({
          ...prev,
          notes: prev.notes.filter((_, index) => index !== noteIndex)
        }));
        alert('Note deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete note'}`);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      // Add basic course data
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('category', courseData.category);
      formData.append('level', courseData.level);
      formData.append('price', courseData.price.toString());
      formData.append('originalPrice', courseData.originalPrice.toString());
      formData.append('requirements', JSON.stringify(courseData.requirements));
      formData.append('objectives', JSON.stringify(courseData.objectives));
      
      // Add thumbnail if it's a file
      if (courseData.thumbnailFile) {
        formData.append('thumbnail', courseData.thumbnailFile);
      }
      
      // Save basic course data
      const courseResponse = await fetch(`/api/instructor/courses/${params['course-id']}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!courseResponse.ok) {
        const error = await courseResponse.json();
        throw new Error(error.message || 'Failed to update course');
      }
      
      // Save chapters and lessons
      for (const chapter of courseData.chapters) {
        if (chapter._id) {
          // Update existing chapter
          const chapterResponse = await fetch(`/api/instructor/courses/${params['course-id']}/chapters/${chapter._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: chapter.title,
              description: chapter.description
            })
          });
          
          if (!chapterResponse.ok) {
            console.error('Failed to update chapter:', chapter.title);
          }
          
          // Update lessons in this chapter
          for (const lesson of chapter.lessons) {
            if (lesson._id) {
              const lessonFormData = new FormData();
              lessonFormData.append('lessonData', JSON.stringify({
                title: lesson.title,
                description: lesson.description,
                duration: lesson.duration,
                videoUrl: lesson.videoUrl,
                videoType: lesson.videoType,
                timestamps: lesson.timestamps || []
              }));
              
              // Add video file if it exists
              if (lesson.videoFile && lesson.videoFile instanceof File) {
                lessonFormData.append('videoFile', lesson.videoFile);
              }
              
              const lessonResponse = await fetch(`/api/instructor/courses/${params['course-id']}/chapters/${chapter._id}/lessons/${lesson._id}`, {
                method: 'PUT',
                body: lessonFormData
              });
              
              if (!lessonResponse.ok) {
                console.error('Failed to update lesson:', lesson.title);
              }
            }
          }
        }
      }
      
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert(`Error saving course: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const method = courseData.isPublished ? 'DELETE' : 'POST';
      const response = await fetch(`/api/instructor/courses/${params['course-id']}/publish`, {
        method: method
      });
      
      if (response.ok) {
        const result = await response.json();
        setCourseData(prev => ({
          ...prev,
          isPublished: !prev.isPublished
        }));
        alert(result.message);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update course status'}`);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Error updating course status');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Video },
    { id: 'notes', label: 'Course Notes', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course data...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      courseData.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {courseData.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePublishToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    courseData.isPublished
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{courseData.isPublished ? 'Unpublish' : 'Publish'}</span>
                </button>
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
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="photography">Photography</option>
                      <option value="music">Music</option>
                      <option value="other">Other</option>
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
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCourseData(prev => ({
                            ...prev,
                            thumbnailFile: file,
                            thumbnail: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {courseData.thumbnail ? (
                        <div>
                          <img
                            src={courseData.thumbnail}
                            alt="Course thumbnail"
                            className="w-32 h-20 object-cover mx-auto mb-2 rounded"
                          />
                          <p className="text-sm text-gray-800">Click to change thumbnail</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                          <p className="text-sm text-gray-800">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-700">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                    </label>
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
                    <div key={chapter._id || chapter.id || chapterIndex} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <input
                          type="text"
                          value={chapter.title || ''}
                          onChange={(e) => handleChapterChange(chapterIndex, 'title', e.target.value)}
                          className="w-full font-medium text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-600"
                          placeholder="Chapter title"
                        />
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson._id || lesson.id || lessonIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3 flex-1">
                                  <Video className="w-5 h-5 text-gray-700" />
                                  <input
                                    type="text"
                                    value={lesson.title || ''}
                                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'title', e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-600 text-gray-900 font-medium"
                                    placeholder="Lesson title"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={lesson.duration || ''}
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
                                value={lesson.description || ''}
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
                                  
                                  {lesson.timestamps && lesson.timestamps.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-green-200">
                                      <div className="flex items-center space-x-2 text-xs text-green-700 mb-2">
                                        <Clock className="w-3 h-3" />
                                        <span>{lesson.timestamps.length} timestamp{lesson.timestamps.length !== 1 ? 's' : ''}</span>
                                      </div>
                                      <div className="space-y-1 max-h-20 overflow-y-auto">
                                        {lesson.timestamps.slice(0, 3).map((timestamp, idx) => (
                                          <div key={idx} className="flex items-center space-x-2 text-xs text-green-600">
                                            <span className="font-mono bg-green-100 px-1 rounded">
                                              {Math.floor(timestamp.time / 60)}:{(timestamp.time % 60).toString().padStart(2, '0')}
                                            </span>
                                            <span className="truncate">{timestamp.title}</span>
                                          </div>
                                        ))}
                                        {lesson.timestamps.length > 3 && (
                                          <div className="text-xs text-green-500">
                                            +{lesson.timestamps.length - 3} more...
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
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
                    <div key={note._id || `note-${index}`} className="border border-gray-200 rounded-lg p-4">
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [timestamps, setTimestamps] = useState(lesson.timestamps || []);
  const [newTimestamp, setNewTimestamp] = useState({ time: '', title: '', description: '' });

  // Initialize preview URL if lesson already has a video
  useEffect(() => {
    if (lesson.videoUrl && videoType === 'upload') {
      setPreviewUrl(lesson.videoUrl);
    }
  }, [lesson.videoUrl, videoType]);

  // Clean up blob URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clean up preview when video type changes
  useEffect(() => {
    if (videoType !== 'upload') {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [videoType, previewUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, WebM, OGG, AVI, MOV, WMV)');
        return;
      }
      
      // Validate file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        alert('File size must be less than 500MB');
        return;
      }
      
      // Clean up previous blob URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new blob URL for preview
      const newPreviewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(newPreviewUrl);
      
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: newPreviewUrl
      });
    }
  };

  const addTimestamp = () => {
    if (newTimestamp.time && newTimestamp.title) {
      const timeInSeconds = convertTimeToSeconds(newTimestamp.time);
      
      // Validate that we got a valid time
      if (timeInSeconds === 0 && newTimestamp.time !== '0' && newTimestamp.time !== '00:00' && newTimestamp.time !== '0:00') {
        alert('Please enter a valid time format (e.g., 1:30, 01:30, or 1:30:45)');
        return;
      }
      
      const timestamp = {
        time: timeInSeconds,
        title: newTimestamp.title.trim(),
        description: newTimestamp.description.trim()
      };
      
      setTimestamps([...timestamps, timestamp].sort((a, b) => a.time - b.time));
      setNewTimestamp({ time: '', title: '', description: '' });
    }
  };

  const removeTimestamp = (index) => {
    setTimestamps(timestamps.filter((_, i) => i !== index));
  };

  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') {
      return 0;
    }
    
    const parts = timeStr.trim().split(':');
    
    if (parts.length === 2) {
      // Format: mm:ss
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    } else if (parts.length === 3) {
      // Format: hh:mm:ss
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      const seconds = parseInt(parts[2], 10) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 1) {
      // Format: just seconds
      const seconds = parseInt(parts[0], 10) || 0;
      return seconds;
    }
    
    return 0;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const lessonData = {
      videoType,
      videoUrl: videoType !== 'upload' ? videoUrl : '',
      timestamps
    };
    
    if (videoType === 'upload' && selectedFile) {
      onVideoUpload(selectedFile, lessonData);
    } else if ((videoType === 'youtube' || videoType === 'link') && videoUrl) {
      onVideoLink(videoUrl, videoType, lessonData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
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

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-black text-gray-900"
                placeholder={videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/video.mp4'}
              />
              
              {/* Video Preview */}
              {videoUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Preview
                  </label>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <VideoPlayer
                      url={videoUrl}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Preview for uploaded video */}
          {videoType === 'upload' && (previewUrl || lesson.videoUrl) && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Preview
              </label>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <VideoPlayer
                  url={previewUrl || lesson.videoUrl}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Timeline Management */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Video Timestamps
            </label>
            
            {/* Add New Timestamp */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Timestamp</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Time (e.g., 1:30, 01:30, 1:30:45)"
                    value={newTimestamp.time}
                    onChange={(e) => setNewTimestamp({...newTimestamp, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-black text-black"
                    pattern="^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{2}$|^[0-9]+$"
                    title="Enter time in format mm:ss, hh:mm:ss, or just seconds"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newTimestamp.title}
                    onChange={(e) => setNewTimestamp({...newTimestamp, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-black text-black"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newTimestamp.description}
                    onChange={(e) => setNewTimestamp({...newTimestamp, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-black text-black"
                  />
                </div>
              </div>
              <button
                onClick={addTimestamp}
                disabled={!newTimestamp.time || !newTimestamp.title}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add Timestamp
              </button>
            </div>

            {/* Existing Timestamps */}
            {timestamps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Current Timestamps</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {timestamps.map((timestamp, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-blue-600">
                            {formatTime(timestamp.time)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {timestamp.title}
                          </span>
                        </div>
                        {timestamp.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {timestamp.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeTimestamp(index)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
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
