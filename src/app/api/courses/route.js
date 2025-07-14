import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import { Course, User, Review, Enrollment } from '../../../models';
import { requireInstructor, authenticateToken } from '../../../middleware/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    // Check if user is authenticated (optional for browsing)
    const authResult = await authenticateToken(request);
    const userId = authResult.user?._id;
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceRange = searchParams.get('price');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    let query = { isPublished: true, isActive: true };

    if (category && category !== 'all') {
      query.category = category.replace('-', ' ');
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case 'free':
          query.price = 0;
          break;
        case 'paid':
          query.price = { $gt: 0 };
          break;
        case 'under-50':
          query.price = { $lt: 50 };
          break;
        case '50-100':
          query.price = { $gte: 50, $lte: 100 };
          break;
        case 'over-100':
          query.price = { $gt: 100 };
          break;
      }
    }

    const [courses, totalCount] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'firstName lastName username')
        .select('title description category level price originalPrice thumbnail duration enrollmentCount averageRating totalReviews createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query)
    ]);

    // Get user's enrollments if authenticated
    let userEnrollments = [];
    if (userId) {
      userEnrollments = await Enrollment.find({
        student: userId,
        isActive: true
      }).select('course').lean();
    }
    
    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.course.toString());
    
    const coursesWithStats = courses.map(course => ({
      ...course,
      instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
      rating: course.averageRating || 0,
      reviews: course.totalReviews || 0,
      students: course.enrollmentCount || 0,
      image: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      lessons: Math.floor(Math.random() * 50) + 20,
      inWishlist: false,
      isEnrolled: enrolledCourseIds.includes(course._id.toString())
    }));

    return NextResponse.json({
      courses: coursesWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requireInstructor(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const {
      title,
      description,
      category,
      level,
      price,
      originalPrice,
      thumbnail,
      requirements,
      learningObjectives,
      tags
    } = await request.json();

    if (!title || !description || !category || !level) {
      return NextResponse.json(
        { error: 'Title, description, category, and level are required' },
        { status: 400 }
      );
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price: price || 0,
      originalPrice,
      thumbnail,
      requirements,
      learningObjectives,
      tags,
      instructor: authResult.user._id
    });

    return NextResponse.json({
      message: 'Course created successfully',
      course
    }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}