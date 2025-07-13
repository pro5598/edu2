import { NextResponse } from 'next/server';
import { Course, User, Review, Lesson } from '../../../models';
import { authenticateToken, requireInstructor } from '../../../middleware/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceRange = searchParams.get('price');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const offset = (page - 1) * limit;

    let whereClause = { isPublished: true };

    if (category && category !== 'all') {
      whereClause.category = category.replace('-', ' ');
    }

    if (search) {
      whereClause.$or = [
        { title: { $iLike: `%${search}%` } },
        { description: { $iLike: `%${search}%` } }
      ];
    }

    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case 'free':
          whereClause.price = 0;
          break;
        case 'paid':
          whereClause.price = { $gt: 0 };
          break;
        case 'under-50':
          whereClause.price = { $lt: 50 };
          break;
        case '50-100':
          whereClause.price = { $between: [50, 100] };
          break;
        case 'over-100':
          whereClause.price = { $gt: 100 };
          break;
      }
    }

    const courses = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'username']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const coursesWithStats = courses.rows.map(course => ({
      ...course.toJSON(),
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`
    }));

    return NextResponse.json({
      courses: coursesWithStats,
      pagination: {
        page,
        limit,
        total: courses.count,
        pages: Math.ceil(courses.count / limit)
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

    const {
      title,
      description,
      category,
      level,
      price,
      originalPrice,
      thumbnail,
      requirements,
      objectives,
      lessons
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
      objectives,
      instructorId: request.user.id,
      totalLessons: lessons ? lessons.length : 0
    });

    if (lessons && lessons.length > 0) {
      const lessonData = lessons.map((lesson, index) => ({
        ...lesson,
        courseId: course.id,
        order: index + 1
      }));
      await Lesson.bulkCreate(lessonData);
    }

    return NextResponse.json({
      message: 'Course created successfully',
      course
    }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}