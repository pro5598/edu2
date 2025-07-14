// API route for individual notification actions
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock database - in a real app, this would be your database
// This should be the same reference as in the main notifications route
let notifications = [
  {
    id: '1',
    userId: 'student123',
    type: 'course',
    title: 'New Course Available',
    message: 'Advanced React Development course is now available for enrollment.',
    timestamp: '2025-01-13T10:30:00Z',
    isRead: false,
    createdAt: '2025-01-13T10:30:00Z',
  },
  {
    id: '2',
    userId: 'student123',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being processed.',
    timestamp: '2025-01-13T09:15:00Z',
    isRead: false,
    createdAt: '2025-01-13T09:15:00Z',
  },
  {
    id: '3',
    userId: 'student123',
    type: 'review',
    title: 'Course Review Request',
    message: 'Please review your completed course "JavaScript Fundamentals".',
    timestamp: '2025-01-12T16:45:00Z',
    isRead: true,
    createdAt: '2025-01-12T16:45:00Z',
  },
  {
    id: '4',
    userId: 'student123',
    type: 'wishlist',
    title: 'Wishlist Item on Sale',
    message: 'Python for Beginners from your wishlist is now 50% off!',
    timestamp: '2025-01-12T14:20:00Z',
    isRead: false,
    createdAt: '2025-01-12T14:20:00Z',
  },
  {
    id: '5',
    userId: 'student123',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM EST.',
    timestamp: '2025-01-12T12:00:00Z',
    isRead: true,
    createdAt: '2025-01-12T12:00:00Z',
  },
];

// Helper function to verify JWT token
function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    // In a real app, use your actual JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
}

// DELETE /api/student/notifications/[id] - Delete a specific notification
export async function DELETE(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const notificationIndex = notifications.findIndex(
      n => n.id === id && (n.userId === user.id || n.userId === 'student123')
    );

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    notifications.splice(notificationIndex, 1);

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
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const notification = notifications.find(
      n => n.id === id && (n.userId === user.id || n.userId === 'student123')
    );

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}