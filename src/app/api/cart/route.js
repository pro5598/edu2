import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import { authenticateToken } from '../../../middleware/auth';
import Cart from '../../../models/Cart';
import Course from '../../../models/Course';
import User from '../../../models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({ user: user.id })
      .populate({
        path: 'items.course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });

    if (!cart) {
      return NextResponse.json({
        cartItems: [],
        totalAmount: 0,
        itemCount: 0
      });
    }

    const cartData = cart.items.map(item => ({
      id: item._id,
      course: {
        ...item.course.toObject(),
        instructor: `${item.course.instructor.firstName} ${item.course.instructor.lastName}`
      },
      addedAt: item.addedAt,
      price: item.price
    }));

    return NextResponse.json({
      cartItems: cartData,
      totalAmount: cart.totalAmount,
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
    await connectDB();
    
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ user: user.id });
    
    if (!cart) {
      cart = new Cart({
        user: user.id,
        items: []
      });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.course.toString() === courseId
    );

    if (existingItemIndex !== -1) {
      return NextResponse.json(
        { error: 'Course already in cart' },
        { status: 409 }
      );
    }

    cart.items.push({
      course: courseId,
      addedAt: new Date(),
      price: course.price,
      originalPrice: course.originalPrice || course.price
    });
    
    await cart.save();

    return NextResponse.json({
      message: 'Course added to cart'
    }, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}