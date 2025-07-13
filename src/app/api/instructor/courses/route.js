import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson, CourseNote, Review, Enrollment } from '../../../../models';
import { requireInstructor } from '../../../../middleware/auth';
import connectDB from '../../../../lib/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    const courses = await Course.find({ instructor: instructorId })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const [chapters, reviews, enrollments] = await Promise.all([
          Chapter.find({ course: course._id }).sort({ order: 1 }),
          Review.find({ course: course._id, isApproved: true }),
          Enrollment.find({ course: course._id })
        ]);

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;

        return {
          ...course,
          totalStudents: enrollments.length,
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          totalChapters: chapters.length
        };
      })
    );

    return NextResponse.json({ courses: coursesWithStats });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;
    
    const formData = await request.formData();
    const courseData = JSON.parse(formData.get('courseData'));
    const thumbnailFile = formData.get('thumbnail');

    let thumbnailPath = null;
    if (thumbnailFile) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const fileName = `${Date.now()}-${thumbnailFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      thumbnailPath = `/uploads/thumbnails/${fileName}`;
    }

    const course = new Course({
      ...courseData,
      instructor: instructorId,
      thumbnail: thumbnailPath,
      isPublished: false
    });

    await course.save();

    return NextResponse.json({ 
      message: 'Course created successfully',
      course: {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}