import { NextResponse } from 'next/server';
import { Enrollment, Course, User, Cart } from '../../../models';
import { authenticateToken } from '../../../middleware/auth';

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

    const enrollments = await Enrollment.findAll({
      where: { studentId: request.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['enrollmentDate', 'DESC']]
    });

    const enrollmentData = enrollments.map(enrollment => ({
      ...enrollment.toJSON(),
      course: {
        ...enrollment.course.toJSON(),
        instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`
      }
    }));

    return NextResponse.json({
      enrollments: enrollmentData,
      totalCourses: enrollmentData.length
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
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

    const { courseIds, paymentMethod = 'card' } = await request.json();

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { error: 'Course IDs are required' },
        { status: 400 }
      );
    }

    const courses = await Course.findAll({
      where: { id: courseIds }
    });

    if (courses.length !== courseIds.length) {
      return NextResponse.json(
        { error: 'Some courses not found' },
        { status: 404 }
      );
    }

    const existingEnrollments = await Enrollment.findAll({
      where: {
        studentId: request.user.id,
        courseId: courseIds
      }
    });

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { error: 'Already enrolled in some of these courses' },
        { status: 409 }
      );
    }

    const enrollmentData = courses.map(course => ({
      studentId: request.user.id,
      courseId: course.id,
      paidAmount: course.price,
      enrollmentDate: new Date()
    }));

    const enrollments = await Enrollment.bulkCreate(enrollmentData);

    await Cart.destroy({
      where: {
        studentId: request.user.id,
        courseId: courseIds
      }
    });

    for (const course of courses) {
      await course.increment('totalStudents');
    }

    const totalAmount = courses.reduce((sum, course) => sum + parseFloat(course.price), 0);

    return NextResponse.json({
      message: 'Enrollment successful',
      enrollments,
      totalAmount,
      coursesCount: courses.length
    }, { status: 201 });
  } catch (error) {
    console.error('Create enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}