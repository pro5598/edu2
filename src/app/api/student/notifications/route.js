// API route for student notifications
import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../middleware/auth';
import connectDB from '../../../../lib/database';
import Notification from '../../../../models/Notification';



// GET /api/student/notifications - Get all notifications for the student
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

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const formattedNotifications = notifications.map(notification => ({
      id: notification._id.toString(),
      userId: notification.recipient.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt,
      isRead: notification.read,
      createdAt: notification.createdAt,
      readAt: notification.readAt
    }));

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      total: formattedNotifications.length,
      unreadCount: formattedNotifications.filter(n => !n.isRead).length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/student/notifications - Create a new notification
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

    const body = await request.json();
    const { type, title, message, recipient } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, message' },
        { status: 400 }
      );
    }

    const notification = new Notification({
      title,
      message,
      type,
      recipient: recipient || user._id,
      status: 'sent',
      sentDate: new Date()
    });

    await notification.save();

    const formattedNotification = {
      id: notification._id.toString(),
      userId: notification.recipient.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt,
      isRead: notification.read,
      createdAt: notification.createdAt
    };

    return NextResponse.json({
      success: true,
      notification: formattedNotification,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}