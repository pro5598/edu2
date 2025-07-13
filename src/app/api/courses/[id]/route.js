import { NextResponse } from 'next/server';
import { Course, User, Review, Lesson, Enrollment } from '../../../../models';
import { authenticateToken, requireInstructor } from '../../../../middleware/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'username', 'bio', 'profileImage']
        },
        {
          model: Lesson,
          as: 'lessons',
          order: [['order', 'ASC']]
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['firstName', 'lastName']
            }
          ],
          where: { isApproved: true },
          required: false
        }
      ]
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const courseData = {
      ...course.toJSON(),
      instructor: {
        ...course.instructor.toJSON(),
        name: `${course.instructor.firstName} ${course.instructor.lastName}`
      },
      reviews: course.reviews.map(review => ({
        ...review.toJSON(),
        studentName: `${review.student.firstName} ${review.student.lastName}`
      }))
    };

    return NextResponse.json({ course: courseData });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const updateData = await request.json();

    const course = await Course.findByPk(id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.instructorId !== request.user.id && request.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this course' },
        { status: 403 }
      );
    }

    await course.update(updateData);

    return NextResponse.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;

    const course = await Course.findByPk(id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.instructorId !== request.user.id && request.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this course' },
        { status: 403 }
      );
    }

    await course.destroy();

    return NextResponse.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}