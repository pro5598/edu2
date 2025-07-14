// API route for marking notification as unread
import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';
import Notification from '../../../../../../models/Notification';



// POST /api/student/notifications/[id]/unread - Mark notification as unread
export async function POST(request, { params }) {
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

    const { id } = params;
    const notification = await Notification.findOne({
      _id: id,
      recipient: user._id
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await notification.markAsUnread();

    const formattedNotification = {
      id: notification._id.toString(),
      userId: notification.recipient.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt,
      isRead: notification.read,
      createdAt: notification.createdAt,
      readAt: notification.readAt
    };

    return NextResponse.json({
      success: true,
      message: 'Notification marked as unread',
      notification: formattedNotification,
    });
  } catch (error) {
    console.error('Error marking notification as unread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}