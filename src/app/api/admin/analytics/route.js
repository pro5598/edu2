import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { authenticateToken } from '@/middleware/auth';
import { User, Course, Payment, Enrollment } from '@/models';

export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [overviewStats, topCategories, topInstructors] = await Promise.all([
      getOverviewStats(),
      getTopCategories(),
      getTopInstructors()
    ]);

    return NextResponse.json({
      overview: overviewStats,
      topCategories,
      topInstructors
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function getOverviewStats() {
  const [totalRevenue, totalUsers, totalCourses, activeInstructors] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$adminRevenue' } } }
    ]),
    User.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'instructor', isActive: true })
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    totalUsers,
    totalCourses,
    activeInstructors
  };
}

async function getTopCategories() {
  const categories = await Course.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        courses: { $sum: 1 },
        courseIds: { $push: '$_id' }
      }
    },
    { $sort: { courses: -1 } },
    { $limit: 5 }
  ]);

  const categoriesWithStats = await Promise.all(
    categories.map(async (cat) => {
      const [enrollmentStats, revenueStats] = await Promise.all([
        Enrollment.countDocuments({ course: { $in: cat.courseIds } }),
        Payment.aggregate([
          {
            $lookup: {
              from: 'courses',
              localField: 'course',
              foreignField: '_id',
              as: 'courseData'
            }
          },
          { $unwind: '$courseData' },
          { $match: { 'courseData.category': cat._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$adminRevenue' } } }
        ])
      ]);

      return {
        name: cat._id,
        courses: cat.courses,
        students: enrollmentStats,
        revenue: revenueStats[0]?.total || 0
      };
    })
  );

  return categoriesWithStats.sort((a, b) => b.revenue - a.revenue);
}

async function getTopInstructors() {
  const instructors = await User.aggregate([
    { $match: { role: 'instructor', isActive: true } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'instructor',
        as: 'courses'
      }
    },
    {
      $addFields: {
        courseCount: { $size: '$courses' },
        courseIds: '$courses._id'
      }
    },
    { $match: { courseCount: { $gt: 0 } } },
    { $sort: { courseCount: -1 } },
    { $limit: 10 }
  ]);

  const instructorsWithStats = await Promise.all(
    instructors.map(async (instructor) => {
      const [studentCount, revenue] = await Promise.all([
        Enrollment.countDocuments({ course: { $in: instructor.courseIds } }),
        Payment.aggregate([
          { $match: { instructor: instructor._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$instructorAmount' } } }
        ])
      ]);

      return {
        name: `${instructor.firstName} ${instructor.lastName}`,
        courses: instructor.courseCount,
        students: studentCount,
        revenue: revenue[0]?.total || 0
      };
    })
  );

  return instructorsWithStats.sort((a, b) => b.revenue - a.revenue).slice(0, 4);
}