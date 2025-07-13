import { verifyToken } from '../lib/jwt.js';
import User from '../models/User.js';
import { cookies } from 'next/headers';
import connectDB from '../lib/database.js';

const authenticateToken = async (request) => {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { error: 'Access token required', status: 401 };
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return { error: 'User not found or inactive', status: 401 };
    }

    return { user };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
};

const requireRole = (roles) => {
  return async (request) => {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return authResult;
    }

    if (!roles.includes(authResult.user.role)) {
      return { error: 'Insufficient permissions', status: 403 };
    }

    return authResult;
  };
};

const requireStudent = requireRole(['student']);
const requireInstructor = requireRole(['instructor']);
const requireAdmin = requireRole(['admin']);
const requireInstructorOrAdmin = requireRole(['instructor', 'admin']);

export {
  authenticateToken,
  requireRole,
  requireStudent,
  requireInstructor,
  requireAdmin,
  requireInstructorOrAdmin
};