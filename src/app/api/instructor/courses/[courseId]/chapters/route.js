import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../models';
import { requireInstructor } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';

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

    const chapters = await Chapter.find({ course: courseId })
      .sort({ order: 1 })
      .lean();

    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const lessons = await Lesson.find({ chapter: chapter._id })
          .sort({ order: 1 })
          .lean();
        
        return {
          ...chapter,
          lessons,
          totalLessons: lessons.length,
          totalDuration: lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
        };
      })
    );

    return NextResponse.json({ chapters: chaptersWithLessons });
  } catch (error) {
    console.error('Get chapters error:', error);
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
    const { courseId } = await params;
    const instructorId = authResult.user._id;
    const { title, description } = await request.json();

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lastChapter = await Chapter.findOne({ course: courseId }).sort({ order: -1 });
    const order = lastChapter ? lastChapter.order + 1 : 1;

    const chapter = new Chapter({
      title,
      description,
      course: courseId,
      order
    });

    await chapter.save();

    return NextResponse.json({ 
      message: 'Chapter created successfully',
      chapter
    }, { status: 201 });
  } catch (error) {
    console.error('Create chapter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}