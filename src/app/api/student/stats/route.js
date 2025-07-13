import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { Enrollment, Review } from '../../../../models';
import { requireStudent } from '../../../../middleware/auth';

export async function GET(request) {
  try {
    const authResult = await requireStudent(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const studentId = authResult.user._id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course', 'duration')
      .lean();

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(enrollment => 
      enrollment.progress === 100 || enrollment.status === 'completed'
    ).length;

    const totalHours = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.totalTimeSpent || 0);
    }, 0);

    const certificates = enrollments.filter(enrollment => 
      enrollment.certificateIssued
    ).length;

    const reviews = await Review.find({ student: studentId }).lean();
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const stats = {
      totalCourses,
      completedCourses,
      certificates,
      totalHours: Math.round(totalHours / 60),
      averageRating: Math.round(averageRating * 10) / 10
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get student stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}