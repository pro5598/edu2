import { NextResponse } from 'next/server';
import { Cart, Course, User } from '../../../models';
import { authenticateToken, requireStudent } from '../../../middleware/auth';

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

    const cartItems = await Cart.findAll({
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

    const cartData = cartItems.map(item => ({
      id: item.id,
      course: {
        ...item.course.toJSON(),
        instructor: `${item.course.instructor.firstName} ${item.course.instructor.lastName}`
      },
      addedAt: item.addedAt
    }));

    const totalAmount = cartData.reduce((sum, item) => sum + parseFloat(item.course.price), 0);

    return NextResponse.json({
      cartItems: cartData,
      totalAmount,
      itemCount: cartData.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
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

    const existingCartItem = await Cart.findOne({
      where: {
        studentId: request.user.id,
        courseId
      }
    });

    if (existingCartItem) {
      return NextResponse.json(
        { error: 'Course already in cart' },
        { status: 409 }
      );
    }

    const cartItem = await Cart.create({
      studentId: request.user.id,
      courseId
    });

    return NextResponse.json({
      message: 'Course added to cart',
      cartItem
    }, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}