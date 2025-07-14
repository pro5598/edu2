import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database';
import { authenticateToken } from '../../../../../middleware/auth';
import Cart from '../../../../../models/Cart';
import Course from '../../../../../models/Course';

export async function DELETE(request, { params }) {
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
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      item => item.course.toString() === courseId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Course not found in cart' },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    return NextResponse.json({
      message: 'Course removed from cart',
      success: true
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}