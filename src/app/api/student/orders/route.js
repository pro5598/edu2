import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { authenticateToken } from '../../../../middleware/auth';
import Order from '../../../../models/Order';

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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    
    // Build query
    const query = { student: user.id };
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'items.course',
        select: 'title thumbnail category averageRating'
      });
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    // Format order data
    const orderData = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      itemCount: order.items.length,
      items: order.items.map(item => ({
        id: item._id,
        courseId: item.course?._id || item.course,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        instructor: item.instructor,
        thumbnail: item.course?.thumbnail,
        category: item.course?.category,
        averageRating: item.course?.averageRating
      }))
    }));
    
    return NextResponse.json({
      orders: orderData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Get order history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}