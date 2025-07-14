import { NextResponse } from 'next/server';
import { Enrollment, Course } from '../../../../../../models';
import { authenticateToken } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const studentId = authResult.user._id;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    }).populate('completedLessons.lesson');

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const completedLessonIds = enrollment.completedLessons.map(completion => completion.lesson._id.toString());

    return NextResponse.json({
      progress: enrollment.progress,
      completedLessons: completedLessonIds,
      totalTimeSpent: enrollment.totalTimeSpent,
      lastAccessedAt: enrollment.lastAccessedAt,
      status: enrollment.status,
      completionDate: enrollment.completionDate
    });

  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course progress' },
      { status: 500 }
    );
  }
}