import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../models';
import { requireInstructor } from '../../../../../middleware/auth';
import connectDB from '../../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapters = await Chapter.find({ course: courseId }).sort({ order: 1 });
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    const chaptersWithLessons = chapters.map(chapter => ({
      ...chapter.toObject(),
      lessons: lessons.filter(lesson => lesson.chapter.toString() === chapter._id.toString())
    }));

    const courseData = {
      ...course.toObject(),
      chapters: chaptersWithLessons
    };

    return NextResponse.json(courseData);
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
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const updateData = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'thumbnailFile') {
        continue;
      }
      if (key === 'requirements' || key === 'objectives') {
        try {
          updateData[key] = JSON.parse(value);
        } catch {
          updateData[key] = value.split(',').map(item => item.trim()).filter(item => item);
        }
      } else {
        updateData[key] = value;
      }
    }

    const thumbnailFile = formData.get('thumbnailFile');
    if (thumbnailFile && thumbnailFile.size > 0) {
      updateData.thumbnail = `/uploads/thumbnails/${courseId}-${Date.now()}-${thumbnailFile.name}`;
    }

    Object.assign(course, updateData);
    await course.save();

    return NextResponse.json({
      message: 'Course updated successfully',
      course: course.toObject()
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
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    await Lesson.deleteMany({ course: courseId });
    await Chapter.deleteMany({ course: courseId });
    await Course.findByIdAndDelete(courseId);

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}