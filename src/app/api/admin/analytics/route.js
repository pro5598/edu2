import { NextResponse } from 'next/server';
import { User, Course, Enrollment, Review } from '../../../../models';
import { authenticateToken, requireAdmin } from '../../../../middleware/auth';
import { Op } from 'sequelize';

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
      requireAdmin(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalInstructors = await User.count({ where: { role: 'instructor' } });
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { isPublished: true } });
    const totalEnrollments = await Enrollment.count();
    const totalReviews = await Review.count();

    const totalRevenue = await Enrollment.sum('paidAmount') || 0;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyEnrollments = await Enrollment.count({
      where: {
        enrollmentDate: {
          [Op.gte]: thisMonth
        }
      }
    });

    const monthlyRevenue = await Enrollment.sum('paidAmount', {
      where: {
        enrollmentDate: {
          [Op.gte]: thisMonth
        }
      }
    }) || 0;

    const topCourses = await Course.findAll({
      attributes: ['id', 'title', 'totalStudents', 'averageRating'],
      order: [['totalStudents', 'DESC']],
      limit: 5
    });

    const recentEnrollments = await Enrollment.findAll({
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['firstName', 'lastName']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['title']
        }
      ],
      order: [['enrollmentDate', 'DESC']],
      limit: 10
    });

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const enrollments = await Enrollment.count({
        where: {
          enrollmentDate: {
            [Op.gte]: date,
            [Op.lt]: nextMonth
          }
        }
      });
      
      const revenue = await Enrollment.sum('paidAmount', {
        where: {
          enrollmentDate: {
            [Op.gte]: date,
            [Op.lt]: nextMonth
          }
        }
      }) || 0;
      
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        enrollments,
        revenue
      });
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalReviews,
        totalRevenue,
        monthlyEnrollments,
        monthlyRevenue
      },
      topCourses,
      recentEnrollments: recentEnrollments.map(enrollment => ({
        id: enrollment.id,
        studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        courseTitle: enrollment.course.title,
        enrollmentDate: enrollment.enrollmentDate,
        paidAmount: enrollment.paidAmount
      })),
      monthlyData: last6Months
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}