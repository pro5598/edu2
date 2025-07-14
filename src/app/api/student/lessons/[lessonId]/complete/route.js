import { NextResponse } from 'next/server';
import { Enrollment, Lesson, Course } from '../../../../../../models';
import { authenticateToken } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';

export async function POST(request, { params }) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { lessonId } = await params;
    const studentId = authResult.user._id;
    
    const lesson = await Lesson.findById(lessonId).populate('chapter');
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const course = await Course.findById(lesson.chapter.course);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: course._id
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const existingCompletion = enrollment.completedLessons.find(
      completion => completion.lesson.toString() === lessonId
    );

    if (existingCompletion) {
      return NextResponse.json({ 
        message: 'Lesson already completed',
        completedAt: existingCompletion.completedAt
      });
    }

    enrollment.completedLessons.push({
      lesson: lessonId,
      completedAt: new Date(),
      timeSpent: 0
    });

    const totalLessons = await Lesson.countDocuments({
      chapter: { $in: course.chapters }
    });
    
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progress === 100 && !enrollment.completionDate) {
      enrollment.completionDate = new Date();
      enrollment.status = 'completed';
    }

    await enrollment.save();

    return NextResponse.json({
      message: 'Lesson marked as complete',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      totalLessons,
      isCompleted: true
    });

  } catch (error) {
    console.error('Error marking lesson as complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark lesson as complete' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { lessonId } = await params;
    const studentId = authResult.user._id;
    
    const lesson = await Lesson.findById(lessonId).populate('chapter');
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const course = await Course.findById(lesson.chapter.course);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: course._id
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    enrollment.completedLessons = enrollment.completedLessons.filter(
      completion => completion.lesson.toString() !== lessonId
    );

    const totalLessons = await Lesson.countDocuments({
      chapter: { $in: course.chapters }
    });
    
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progress < 100) {
      enrollment.completionDate = null;
      enrollment.status = 'active';
    }

    await enrollment.save();

    return NextResponse.json({
      message: 'Lesson marked as incomplete',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      totalLessons,
      isCompleted: false
    });

  } catch (error) {
    console.error('Error marking lesson as incomplete:', error);
    return NextResponse.json(
      { error: 'Failed to mark lesson as incomplete' },
      { status: 500 }
    );
  }
}