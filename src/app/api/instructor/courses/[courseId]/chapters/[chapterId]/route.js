import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../../models';
import { requireInstructor } from '../../../../../../../middleware/auth';
import connectDB from '../../../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, chapterId } = await params;
    const instructorId = authResult.user._id;
    const updateData = await request.json();

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapter = await Chapter.findOneAndUpdate(
      { _id: chapterId, course: courseId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Chapter updated successfully',
      chapter
    });
  } catch (error) {
    console.error('Update chapter error:', error);
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
    const { courseId, chapterId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapter = await Chapter.findOneAndDelete({ _id: chapterId, course: courseId });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    await Lesson.deleteMany({ chapter: chapterId });

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}