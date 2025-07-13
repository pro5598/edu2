import { NextResponse } from 'next/server';
import { User, Course, Enrollment } from '../../../../models';
import connectDB from '../../../../lib/database';

export async function GET(request) {
  try {
    await connectDB();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalInstructors, totalCourses, activeUsers, pendingInstructors, recentUsers, topCourses, todayUsers] = await Promise.all([
      User.countDocuments({ role: { $in: ['student', 'instructor'] } }),
      User.countDocuments({ role: 'instructor', isActive: true }),
      Course.countDocuments(),
      User.countDocuments({ 
        role: { $in: ['student', 'instructor'] },
        lastLogin: { $gte: sevenDaysAgo }
      }),
      User.countDocuments({ role: 'instructor', isActive: false }),
      User.find({ role: { $in: ['student', 'instructor'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email role isActive createdAt'),
      Course.find()
        .populate('instructor', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title instructor price createdAt'),
      User.countDocuments({ 
        role: { $in: ['student', 'instructor'] },
        createdAt: { $gte: today }
      })
    ]);

    const enrollmentCounts = await Promise.all(
      topCourses.map(async (course) => {
        const count = await Enrollment.countDocuments({ course: course._id });
        return { courseId: course._id, count };
      })
    );

    const coursesWithEnrollments = topCourses.map(course => {
      const enrollment = enrollmentCounts.find(e => e.courseId.toString() === course._id.toString());
      return {
        id: course._id,
        title: course.title,
        instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
        students: enrollment ? enrollment.count : 0,
        revenue: enrollment ? enrollment.count * (course.price || 0) : 0,
        status: 'active'
      };
    });

    const formattedRecentUsers = recentUsers.map(user => ({
      id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
      email: user.email,
      type: user.role === 'instructor' ? 'Instructor' : 'Student',
      joinDate: user.createdAt.toISOString().split('T')[0],
      status: user.isActive ? 'active' : 'pending'
    }));

    const recentActivity = [
      {
        id: 1,
        type: 'user',
        message: `${todayUsers} new users registered today`,
        time: '1 hour ago',
        icon: 'Users',
        color: 'text-blue-600 bg-blue-100'
      },
      {
        id: 2,
        type: 'instructor',
        message: `${pendingInstructors} new instructor applications pending`,
        time: '2 hours ago',
        icon: 'UserCheck',
        color: 'text-orange-600 bg-orange-100'
      },
      {
        id: 3,
        type: 'course',
        message: `${topCourses.length} courses available`,
        time: '4 hours ago',
        icon: 'BookOpen',
        color: 'text-green-600 bg-green-100'
      },
      {
        id: 4,
        type: 'revenue',
        message: 'System running smoothly',
        time: '6 hours ago',
        icon: 'DollarSign',
        color: 'text-purple-600 bg-purple-100'
      }
    ];

    const dashboardData = {
      stats: {
        totalUsers,
        totalInstructors,
        totalCourses,
        totalRevenue: coursesWithEnrollments.reduce((sum, course) => sum + course.revenue, 0),
        activeUsers,
        pendingApprovals: pendingInstructors
      },
      recentActivity,
      topCourses: coursesWithEnrollments,
      recentUsers: formattedRecentUsers
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}