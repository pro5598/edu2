import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../models';
import { requireInstructor } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';

export async function POST(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.isPublished) {
      return NextResponse.json({ error: 'Course is already published' }, { status: 400 });
    }

    const chapters = await Chapter.find({ course: courseId });
    if (chapters.length === 0) {
      return NextResponse.json({ 
        error: 'Course must have at least one chapter to be published' 
      }, { status: 400 });
    }

    const lessons = await Lesson.find({ course: courseId });
    if (lessons.length === 0) {
      return NextResponse.json({ 
        error: 'Course must have at least one lesson to be published' 
      }, { status: 400 });
    }

    if (!course.title || !course.description || !course.price || !course.category) {
      return NextResponse.json({ 
        error: 'Course must have title, description, price, and category to be published' 
      }, { status: 400 });
    }

    course.isPublished = true;
    course.publishedAt = new Date();
    await course.save();

    await Chapter.updateMany(
      { course: courseId },
      { isPublished: true }
    );

    await Lesson.updateMany(
      { course: courseId },
      { isPublished: true }
    );

    return NextResponse.json({ 
      message: 'Course published successfully',
      course: {
        _id: course._id,
        title: course.title,
        isPublished: course.isPublished,
        publishedAt: course.publishedAt
      }
    });
  } catch (error) {
    console.error('Publish course error:', error);
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
    const { courseId } = params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    course.isPublished = false;
    course.publishedAt = null;
    await course.save();

    await Chapter.updateMany(
      { course: courseId },
      { isPublished: false }
    );

    await Lesson.updateMany(
      { course: courseId },
      { isPublished: false }
    );

    return NextResponse.json({ 
      message: 'Course unpublished successfully',
      course: {
        _id: course._id,
        title: course.title,
        isPublished: course.isPublished
      }
    });
  } catch (error) {
    console.error('Unpublish course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}