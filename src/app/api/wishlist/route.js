import { NextResponse } from 'next/server';
import { Wishlist, Course, User } from '../../../models';
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

    const wishlistItems = await Wishlist.findAll({
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
      order: [['addedAt', 'DESC']]
    });

    const wishlistData = wishlistItems.map(item => ({
      id: item.id,
      course: {
        ...item.course.toJSON(),
        instructor: `${item.course.instructor.firstName} ${item.course.instructor.lastName}`
      },
      addedAt: item.addedAt
    }));

    return NextResponse.json({
      wishlistItems: wishlistData,
      itemCount: wishlistData.length
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
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

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const existingWishlistItem = await Wishlist.findOne({
      where: {
        studentId: request.user.id,
        courseId
      }
    });

    if (existingWishlistItem) {
      await existingWishlistItem.destroy();
      return NextResponse.json({
        message: 'Course removed from wishlist',
        action: 'removed'
      });
    } else {
      const wishlistItem = await Wishlist.create({
        studentId: request.user.id,
        courseId
      });
      return NextResponse.json({
        message: 'Course added to wishlist',
        wishlistItem,
        action: 'added'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}