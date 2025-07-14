// API route for individual notification actions
import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../../middleware/auth';
import connectDB from '../../../../../lib/database';
import Notification from '../../../../../models/Notification';



// DELETE /api/student/notifications/[id] - Delete a specific notification
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

    const { id } = params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: user._id
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/student/notifications/[id] - Get a specific notification
export async function GET(request, { params }) {
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
    }).lean();

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

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
      notification: formattedNotification,
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}