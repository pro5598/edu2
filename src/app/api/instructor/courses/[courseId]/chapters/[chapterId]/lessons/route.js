import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../../../models';
import { requireInstructor } from '../../../../../../../../middleware/auth';
import connectDB from '../../../../../../../../lib/database';

export async function GET(request, { params }) {
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

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const lessons = await Lesson.find({ chapter: chapterId })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, chapterId } = await params;
    const instructorId = authResult.user._id;
    
    const lessonData = await request.json();

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const lastLesson = await Lesson.findOne({ chapter: chapterId }).sort({ order: -1 });
    const order = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = new Lesson({
      title: lessonData.title || '',
      description: lessonData.description || '',
      duration: lessonData.duration || 0,
      course: courseId,
      chapter: chapterId,
      order,
      content: lessonData.content || lessonData.description || lessonData.title || 'New lesson content'
    });

    await lesson.save();

    return NextResponse.json({ 
      message: 'Lesson created successfully',
      lesson
    }, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}