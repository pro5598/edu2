import { NextResponse } from 'next/server';
import { Course, Lesson, Review, Enrollment } from '../../../../models';
import { authenticateToken, requireInstructor } from '../../../../middleware/auth';

export async function GET(request) {
  try {
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const roleResult = await new Promise((resolve) => {
      requireInstructor(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const courses = await Course.findAll({
      where: { instructorId: request.user.id },
      include: [
        {
          model: Lesson,
          as: 'lessons'
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false
        },
        {
          model: Enrollment,
          as: 'enrollments'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const coursesWithStats = courses.map(course => {
      const totalReviews = course.reviews.length;
      const averageRating = totalReviews > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      return {
        ...course.toJSON(),
        totalStudents: course.enrollments.length,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10
      };
    });

    return NextResponse.json({ courses: coursesWithStats });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}