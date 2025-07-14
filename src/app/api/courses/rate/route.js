import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { authenticateToken } from '../../../../middleware/auth';
import Enrollment from '../../../../models/Enrollment';
import Course from '../../../../models/Course';
import Review from '../../../../models/Review';

export async function POST(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;
    const { courseId, enrollmentId, rating, review } = await request.json();

    if (!courseId || !enrollmentId || !rating) {
      return NextResponse.json(
        { error: 'Course ID, enrollment ID, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: user.id,
      course: courseId,
      isActive: true
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or not authorized' },
        { status: 404 }
      );
    }

    if (enrollment.rating) {
      return NextResponse.json(
        { error: 'You have already rated this course' },
        { status: 409 }
      );
    }

    const existingActiveReview = await Review.findOne({
      student: user.id,
      course: courseId,
      isActive: true
    });

    if (existingActiveReview) {
      return NextResponse.json(
        { error: 'You have already rated this course' },
        { status: 409 }
      );
    }

    enrollment.rating = rating;
    enrollment.review = review || '';
    await enrollment.save();

    const courseReview = new Review({
      student: user.id,
      course: courseId,
      rating: rating,
      comment: review || '',
      isApproved: true
    });
    await courseReview.save();

    const course = await Course.findById(courseId);
    if (course) {
      await course.updateRating(rating);
    }

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: rating,
      review: review
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}