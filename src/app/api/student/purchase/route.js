import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { authenticateToken } from '../../../../middleware/auth';
import Cart from '../../../../models/Cart';
import Course from '../../../../models/Course';
import Order from '../../../../models/Order';
import Enrollment from '../../../../models/Enrollment';
import Payment from '../../../../models/Payment';
import Notification from '../../../../models/Notification';
import User from '../../../../models/User';

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
    const { 
      paymentMethod = 'credit_card',
      contactInfo,
      billingAddress 
    } = await request.json();

    // Get user's cart
    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: 'items.course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate all courses are still available
    const courseIds = cart.items.map(item => item.course._id);
    const courses = await Course.find({ 
      _id: { $in: courseIds },
      isPublished: true,
      isActive: true 
    });

    if (courses.length !== courseIds.length) {
      return NextResponse.json(
        { error: 'Some courses are no longer available' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled in any of these courses
    const existingEnrollments = await Enrollment.find({
      student: user._id,
      course: { $in: courseIds },
      isActive: true
    });

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { error: 'Already enrolled in some of these courses' },
        { status: 409 }
      );
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Create order
    const orderItems = cart.items.map(item => ({
      course: item.course._id,
      title: item.course.title,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      instructor: `${item.course.instructor.firstName} ${item.course.instructor.lastName}`
    }));

    const order = new Order({
      student: user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      contactInfo,
      billingAddress,
      status: 'completed',
      paymentStatus: 'completed'
    });

    await order.save();

    // Create enrollments
    const enrollmentData = cart.items.map(item => ({
      student: user._id,
      course: item.course._id,
      paymentAmount: item.price,
      paymentMethod: paymentMethod,
      paymentStatus: 'completed',
      paymentDate: new Date(),
      enrollmentDate: new Date(),
      status: 'active'
    }));

    const enrollments = await Enrollment.insertMany(enrollmentData);

    // Create payment records (after order is saved to get orderNumber)
    const paymentData = cart.items.map(item => ({
      transactionId: `TXN-${order.orderNumber}-${item.course._id}`,
      student: user._id,
      course: item.course._id,
      instructor: item.course.instructor._id,
      totalAmount: item.price,
      status: 'completed',
      paymentMethod: paymentMethod,
      paymentGateway: 'stripe',
      processedAt: new Date()
    }));

    await Payment.insertMany(paymentData);

    // Update enrollment count for each course
    for (const item of cart.items) {
      await Course.findByIdAndUpdate(item.course._id, {
        $inc: { enrollmentCount: 1 }
      });
    }

    // Get student information for notifications
    const student = await User.findById(user._id);
    
    // Create enrollment notifications for instructors
    for (const item of cart.items) {
      try {
        await Notification.create({
          recipient: item.course.instructor._id,
          type: 'enrollment',
          title: 'New Student Enrollment',
          message: `${student.name || `${student.firstName} ${student.lastName}`} has enrolled in your course "${item.course.title}"`,
          data: {
            studentName: student.name || `${student.firstName} ${student.lastName}`,
            courseName: item.course.title,
            courseId: item.course._id,
            studentId: student._id,
            orderNumber: order.orderNumber
          }
        });
      } catch (notificationError) {
        console.error('Failed to create enrollment notification:', notificationError);
        // Don't fail the purchase if notification creation fails
      }
    }

    // Clear the cart
    await Cart.findOneAndUpdate(
      { user: user._id },
      { $set: { items: [], totalAmount: 0 } }
    );

    return NextResponse.json({
      message: 'Purchase completed successfully',
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt
      },
      enrollments: enrollments.map(enrollment => ({
        id: enrollment._id,
        course: enrollment.course,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status
      }))
    }, { status: 201 });

  } catch (error) {
    console.error('Complete purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}