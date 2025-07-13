import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { authenticateToken } from '@/middleware/auth';
import { Notification, User } from '@/models';

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
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    
    let query = {};
    if (type && type !== 'all') {
      query.type = type;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const notifications = await Notification.find(query)
      .populate('metadata.courseId', 'title')
      .populate('metadata.studentId', 'username email')
      .populate('metadata.instructorId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalNotifications = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);
    
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          totalRecipients: { $sum: '$recipients' },
          averageOpenRate: { $avg: '$openRate' },
          totalCommissions: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'payment'] },
                '$metadata.commissionAmount',
                0
              ]
            }
          }
        }
      }
    ]);
    
    const notificationStats = stats[0] || {
      totalNotifications: 0,
      totalRecipients: 0,
      averageOpenRate: 0,
      totalCommissions: 0
    };
    
    return NextResponse.json({
      notifications,
      stats: notificationStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotifications,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }
    
    const { title, message, type, scheduledDate } = await request.json();
    
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }
    
    const totalUsers = await User.countDocuments({ isActive: true });
    
    const notificationData = {
      title,
      message,
      type: type || 'info',
      recipients: totalUsers
    };
    
    if (scheduledDate) {
      notificationData.status = 'scheduled';
      notificationData.scheduledDate = new Date(scheduledDate);
    } else {
      notificationData.status = 'sent';
      notificationData.sentDate = new Date();
    }
    
    const notification = new Notification(notificationData);
    await notification.save();
    
    return NextResponse.json({
      message: 'Notification created successfully',
      notification
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Notification deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}