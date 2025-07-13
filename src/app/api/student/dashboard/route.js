import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { Enrollment, Course, User } from '../../../../models';
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

    // Get student enrollments with course details
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        model: 'Course',
        populate: {
          path: 'instructor',
          model: 'User',
          select: 'firstName lastName'
        }
      })
      .sort({ enrollmentDate: -1 });

    // Calculate statistics
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(enrollment => 
      enrollment.progress === 100
    ).length;
    const activeCourses = totalCourses - completedCourses;

    // Calculate total hours (assuming each course has duration in minutes)
    const totalHours = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course.duration || 0);
    }, 0);

    // Get recent courses (last 5 accessed)
    const recentCourses = enrollments.slice(0, 5).map(enrollment => {
      const course = enrollment.course;
      const instructor = course.instructor;
      
      return {
        id: course._id,
        title: course.title,
        progress: enrollment.progress || 0,
        lastAccessed: enrollment.lastAccessedAt || enrollment.enrollmentDate,
        nextLesson: 'Continue Learning',
        instructor: `${instructor.firstName} ${instructor.lastName}`,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
        timeLeft: 'N/A',
        difficulty: course.difficulty || 'Beginner'
      };
    });

    // Calculate learning streak (simplified - days with activity)
    const streak = 12; // This would need more complex logic with activity tracking
    
    // Calculate average rating from completed courses
    const averageRating = 4.8; // This would come from student's ratings
    
    // Calculate rank (simplified)
    const rank = 85; // This would be calculated based on progress compared to other students

    const dashboardData = {
      stats: {
        totalCourses,
        activeCourses,
        completedCourses,
        totalHours: Math.round(totalHours / 60), // Convert minutes to hours
        streak,
        averageRating,
        rank
      },
      recentCourses
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}