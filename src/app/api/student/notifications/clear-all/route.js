// API route for clearing all notifications
import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../../middleware/auth';
import connectDB from '../../../../../lib/database';
import Notification from '../../../../../models/Notification';



// DELETE /api/student/notifications/clear-all - Clear all notifications for the user
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
    
    const user = authResult.user;

    const result = await Notification.deleteMany({ recipient: user._id });
    const deletedCount = result.deletedCount;

    return NextResponse.json({
      success: true,
      message: `${deletedCount} notifications cleared successfully`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}