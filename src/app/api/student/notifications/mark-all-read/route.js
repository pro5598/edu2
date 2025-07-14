// API route for marking all notifications as read
import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../../middleware/auth';
import connectDB from '../../../../../lib/database';
import Notification from '../../../../../models/Notification';



// POST /api/student/notifications/mark-all-read - Mark all notifications as read
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

    const currentTime = new Date();
    const result = await Notification.updateMany(
      { 
        recipient: user._id,
        read: false
      },
      { 
        read: true,
        readAt: currentTime
      }
    );

    const updatedCount = result.modifiedCount;

    return NextResponse.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      updatedCount,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}