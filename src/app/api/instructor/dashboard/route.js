import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { Course, Review, Enrollment, Payment, User } from '../../../../models';
import { authenticateToken, requireInstructor } from '../../../../middleware/auth';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request) {
  try {
    const authResult = await requireInstructor(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const instructorId = authResult.user._id;
    const cacheKey = `dashboard_${instructorId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    const courses = await Course.find({ instructor: instructorId })
      .select('title thumbnail createdAt')
      .lean();

    if (courses.length === 0) {
      return NextResponse.json({
        stats: {
          totalCourses: 0,
          totalRevenue: 0,
          totalReviews: 0,
          completionRate: 0
        },
        topCourses: [],
        recentActivity: [],
        recentReviews: [],
        monthlyData: []
      });
    }

    const courseIds = courses.map(course => course._id);

    const [enrollments, reviews, payments] = await Promise.all([
      Enrollment.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $sort: { createdAt: -1 } },
        { $limit: 50 },
        {
          $lookup: {
            from: 'users',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
            pipeline: [{ $project: { firstName: 1, lastName: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
            pipeline: [{ $project: { title: 1 } }]
          }
        },
        { $unwind: '$student' },
        { $unwind: '$course' },
        { $project: { course: 1, student: 1, createdAt: 1 } }
      ]),
      Review.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $sort: { createdAt: -1 } },
        { $limit: 20 },
        {
          $lookup: {
            from: 'users',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
            pipeline: [{ $project: { firstName: 1, lastName: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
            pipeline: [{ $project: { title: 1 } }]
          }
        },
        { $unwind: '$student' },
        { $unwind: '$course' },
        { $project: { course: 1, student: 1, rating: 1, comment: 1, createdAt: 1 } }
      ]),
      Payment.aggregate([
        { $match: { course: { $in: courseIds }, status: 'completed' } },
        { $sort: { createdAt: -1 } },
        { $limit: 100 },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
            pipeline: [{ $project: { title: 1 } }]
          }
        },
        { $unwind: '$course' },
        { $project: { course: 1, totalAmount: 1, createdAt: 1 } }
      ])
    ]);

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const totalStudents = enrollments.length;
    const totalReviews = reviews.length;

    const courseStats = new Map();
    courses.forEach(course => {
      courseStats.set(course._id.toString(), {
        id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        revenue: 0,
        totalRating: 0,
        reviewCount: 0,
        studentCount: 0
      });
    });

    enrollments.forEach(enrollment => {
      const courseId = enrollment.course._id.toString();
      const stats = courseStats.get(courseId);
      if (stats) {
        stats.studentCount++;
      }
    });

    reviews.forEach(review => {
      const courseId = review.course._id.toString();
      const stats = courseStats.get(courseId);
      if (stats) {
        stats.totalRating += review.rating;
        stats.reviewCount++;
      }
    });

    payments.forEach(payment => {
      const courseId = payment.course._id.toString();
      const stats = courseStats.get(courseId);
      if (stats) {
        stats.revenue += payment.totalAmount;
      }
    });

    const topCourses = Array.from(courseStats.values())
      .map(stats => ({
        id: stats.id,
        title: stats.title,
        thumbnail: stats.thumbnail,
        revenue: stats.revenue,
        rating: stats.reviewCount > 0 ? Math.round((stats.totalRating / stats.reviewCount) * 10) / 10 : 0,
        reviews: stats.reviewCount,
        students: stats.studentCount
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const recentActivity = [
      ...enrollments.slice(0, 3).map(enrollment => ({
        id: enrollment._id,
        type: 'enrollment',
        message: `New student enrolled in ${enrollment.course.title}`,
        time: getTimeAgo(enrollment.createdAt),
        icon: 'Users',
        color: 'text-blue-600 bg-blue-100',
        createdAt: enrollment.createdAt
      })),
      ...reviews.slice(0, 2).map(review => ({
        id: review._id,
        type: 'review',
        message: `New ${review.rating}-star review for ${review.course.title}`,
        time: getTimeAgo(review.createdAt),
        icon: 'Star',
        color: 'text-yellow-600 bg-yellow-100',
        createdAt: review.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     .slice(0, 4)
     .map(({ createdAt, ...activity }) => activity);

    const recentReviews = reviews.slice(0, 3).map(review => ({
      id: review._id,
      student: `${review.student.firstName} ${review.student.lastName}`,
      course: review.course.title,
      rating: review.rating,
      comment: review.comment,
      time: getTimeAgo(review.createdAt)
    }));

    const monthlyData = [
      { month: 'Jul', revenue: 0, students: 0 },
      { month: 'Aug', revenue: 0, students: 0 },
      { month: 'Sep', revenue: 0, students: 0 },
      { month: 'Oct', revenue: 0, students: 0 },
      { month: 'Nov', revenue: 0, students: 0 },
      { month: 'Dec', revenue: Math.round(totalRevenue / 6), students: Math.round(totalStudents / 6) }
    ];

    const dashboardData = {
      stats: {
        totalCourses: courses.length,
        totalRevenue: Math.round(totalRevenue),
        totalReviews,
        completionRate: 87
      },
      topCourses,
      recentActivity: recentActivity.slice(0, 4),
      recentReviews,
      monthlyData
    };

    cache.set(cacheKey, {
      data: dashboardData,
      timestamp: Date.now()
    });
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Instructor dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}