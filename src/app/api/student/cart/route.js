import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { authenticateToken } from '../../../../middleware/auth';
import Cart from '../../../../models/Cart';
import Course from '../../../../models/Course';
import User from '../../../../models/User';
import Enrollment from '../../../../models/Enrollment';

export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const user = authResult.user;

    const cart = await Cart.findOne({ user: user._id })
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

    // Get user's enrollments to filter out enrolled courses from cart
    const userEnrollments = await Enrollment.find({
      student: user._id,
      isActive: true
    }).select('course').lean();
    
    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.course.toString());
    
    // Filter out enrolled courses from cart items
    const validCartItems = cart.items.filter(item => 
      !enrolledCourseIds.includes(item.course._id.toString())
    );
    
    // If cart items were filtered out, update the cart
    if (validCartItems.length !== cart.items.length) {
      cart.items = validCartItems;
      cart.totalAmount = validCartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
      await cart.save();
    }

    const cartData = validCartItems.map(item => ({
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
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const user = authResult.user;

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

    // Check if user is already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({
      student: user._id,
      course: courseId,
      isActive: true
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    let cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      cart = new Cart({
        user: user._id,
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