import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import Enrollment from '../../../models/Enrollment';
import Course from '../../../models/Course';
import User from '../../../models/User';
import Cart from '../../../models/Cart';
import Notification from '../../../models/Notification';
import { authenticateToken } from '../../../middleware/auth';

export async function GET(request) {
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

    const enrollments = await Enrollment.find({ 
      student: user.id,
      isActive: true 
    })
    .populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'name firstName lastName'
      }
    })
    .sort({ enrollmentDate: -1 });

    const enrollmentData = enrollments.map(enrollment => ({
      id: enrollment._id,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      progress: enrollment.progress,
      totalTimeSpent: enrollment.totalTimeSpent,
      lastAccessedAt: enrollment.lastAccessedAt,
      completionDate: enrollment.completionDate,
      rating: enrollment.rating,
      review: enrollment.review,
      course: {
        id: enrollment.course._id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        duration: enrollment.course.duration,
        category: enrollment.course.category,
        price: enrollment.course.price,
        averageRating: enrollment.course.averageRating,
        enrollmentCount: enrollment.course.enrollmentCount,
        instructor: enrollment.course.instructor?.name || 
                   `${enrollment.course.instructor?.firstName || ''} ${enrollment.course.instructor?.lastName || ''}`.trim(),
        lessons: enrollment.course.lessons?.length || 0
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
    await connectDB();
    
    const authResult = await authenticateToken(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;

    const { courseIds, paymentMethod = 'credit_card' } = await request.json();

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { error: 'Course IDs are required' },
        { status: 400 }
      );
    }

    const courses = await Course.find({ 
      _id: { $in: courseIds },
      isPublished: true,
      isActive: true 
    });

    if (courses.length !== courseIds.length) {
      return NextResponse.json(
        { error: 'Some courses not found or not available' },
        { status: 404 }
      );
    }

    const existingEnrollments = await Enrollment.find({
      student: user.id,
      course: { $in: courseIds },
      isActive: true
    });

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { error: 'Already enrolled in some of these courses' },
        { status: 409 }
      );
    }

    const enrollmentData = courses.map(course => ({
      student: user.id,
      course: course._id,
      paymentAmount: course.price,
      paymentMethod: paymentMethod,
      paymentStatus: 'completed',
      paymentDate: new Date(),
      enrollmentDate: new Date(),
      status: 'active'
    }));

    const enrollments = await Enrollment.insertMany(enrollmentData);

    // Remove courses from cart
    await Cart.deleteMany({
      student: user.id,
      course: { $in: courseIds }
    });

    // Update enrollment count for each course
    for (const course of courses) {
      await Course.findByIdAndUpdate(course._id, {
        $inc: { enrollmentCount: 1 }
      });
    }

    // Get student information for notifications
    const student = await User.findById(user.id);
    
    // Create enrollment notifications for instructors
    for (const course of courses) {
      try {
        await Notification.create({
          recipient: course.instructor,
          type: 'enrollment',
          title: 'New Student Enrollment',
          message: `${student.name || `${student.firstName} ${student.lastName}`} has enrolled in your course "${course.title}"`,
          data: {
            studentName: student.name || `${student.firstName} ${student.lastName}`,
            courseName: course.title,
            courseId: course._id,
            studentId: student._id
          }
        });
      } catch (notificationError) {
        console.error('Failed to create enrollment notification:', notificationError);
        // Don't fail the enrollment if notification creation fails
      }
    }

    const totalAmount = courses.reduce((sum, course) => sum + parseFloat(course.price), 0);

    return NextResponse.json({
      message: 'Enrollment successful',
      enrollments: enrollments.map(enrollment => ({
        id: enrollment._id,
        student: enrollment.student,
        course: enrollment.course,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
        paymentAmount: enrollment.paymentAmount
      })),
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