import { NextResponse } from 'next/server';
import { Course, User, Review, Lesson, Chapter, Enrollment, Assignment } from '../../../../models';
import { authenticateToken, requireInstructor } from '../../../../middleware/auth';
import connectDB from '../../../../lib/database';
import mongoose from 'mongoose';
import CourseNote from '@/models/CourseNote';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = await Course.findById(id)
      .populate({
        path: 'instructor',
        select: 'firstName lastName username bio profileImage'
      })
      .lean();

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    console.log('=== API DEBUGGING ===');
    console.log('Course ID:', id);
    console.log('Looking for chapters with course:', id);

    const chapters = await Chapter.find({ course: id })
      .sort({ order: 1 })
      .lean();

    console.log('Found chapters:', chapters);
    console.log('Chapters count:', chapters.length);

    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        console.log('Processing chapter:', chapter.title, 'ID:', chapter._id);

        const lessons = await Lesson.find({
          chapter: chapter._id,
          isPublished: true
        })
          .sort({ order: 1 })
          .lean();

        console.log('Found lessons for chapter', chapter.title, ':', lessons.length);
        console.log('Lessons:', lessons.map(l => l.title));

        return {
          id: chapter._id,
          title: chapter.title,
          description: chapter.description,
          lessons: lessons.map(lesson => ({
            id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration || 0,
            videoUrl: lesson.videoUrl,
            isYouTube: lesson.videoType === 'youtube',
            type: lesson.type
          }))
        };
      })
    );

    console.log('Final chaptersWithLessons:', chaptersWithLessons);
    console.log('Final chaptersWithLessons count:', chaptersWithLessons.length);

    // Also fetch lessons that are directly associated with the course but not with chapters
    const directLessons = await Lesson.find({
      course: id,
      isPublished: true,
      $or: [
        { chapter: { $exists: false } },
        { chapter: null }
      ]
    })
      .sort({ order: 1 })
      .lean();

    // If there are direct lessons, add them as a default chapter
    if (directLessons.length > 0) {
      chaptersWithLessons.push({
        id: 'default',
        title: 'Course Content',
        description: 'Main course lessons',
        lessons: directLessons.map(lesson => ({
          id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration || 0,
          videoUrl: lesson.videoUrl,
          isYouTube: lesson.videoType === 'youtube',
          type: lesson.type
        }))
      });
    }

    const reviews = await Review.find({ course: id, isApproved: true })
      .populate({
        path: 'student',
        select: 'firstName lastName'
      })
      .lean();

    const courseNotes = await CourseNote.find({
      course: id,
      isPublished: true
    })
      .sort({ order: 1 })
      .lean();

    const assignments = await Assignment.find({
      course: id,
      isActive: true
    })
      .sort({ dueDate: 1 })
      .lean();

    console.log("course Note: ", courseNotes)
    console.log("assignments: ", assignments)

    const courseData = {
      ...course,
      instructor: {
        ...course.instructor,
        name: `${course.instructor.firstName} ${course.instructor.lastName}`
      },
      chapters: chaptersWithLessons,
      reviews: reviews.map(review => ({
        ...review,
        studentName: `${review.student.firstName} ${review.student.lastName}`
      }))
    };


    return NextResponse.json({
      course: courseData,
      courseNotes,
      assignments,
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const updateData = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.instructor.toString() !== request.user.id && request.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this course' },
        { status: 403 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.instructor.toString() !== request.user.id && request.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this course' },
        { status: 403 }
      );
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
