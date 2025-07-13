import { NextResponse } from 'next/server';
import { Review, Course, User, Enrollment, Notification } from '../../../models';
import { authenticateToken } from '../../../middleware/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    let whereClause = { isApproved: true };
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const reviews = await Review.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['firstName', 'lastName', 'profileImage']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const reviewData = reviews.map(review => ({
      ...review.toJSON(),
      studentName: `${review.student.firstName} ${review.student.lastName}`
    }));

    return NextResponse.json({ reviews: reviewData });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { courseId, rating, comment } = await request.json();

    if (!courseId || !rating) {
      return NextResponse.json(
        { error: 'Course ID and rating are required' },
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
      where: {
        studentId: request.user.id,
        courseId
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled in this course to leave a review' },
        { status: 403 }
      );
    }

    const existingReview = await Review.findOne({
      where: {
        studentId: request.user.id,
        courseId
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this course' },
        { status: 409 }
      );
    }

    const review = await Review.create({
      studentId: request.user.id,
      courseId,
      rating,
      comment
    });

    const course = await Course.findByPk(courseId);
    const allReviews = await Review.findAll({
      where: { courseId, isApproved: true }
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await course.update({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: allReviews.length
    });

    // Get student information for notifications
    const student = await User.findByPk(request.user.id);
    
    // Create review notification for instructor
    try {
      await Notification.createReviewNotification({
        studentName: `${student.firstName} ${student.lastName}`,
        courseName: course.title,
        rating: rating,
        courseId: course.id,
        studentId: student.id,
        instructorId: course.instructorId
      });
    } catch (notificationError) {
      console.error('Failed to create review notification:', notificationError);
      // Don't fail the review if notification creation fails
    }

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}