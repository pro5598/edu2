import { NextResponse } from 'next/server';
import { User } from '../../../../models';
import { verifyToken } from '../../../../lib/jwt';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { 
          authenticated: false, 
          user: null,
          redirectPath: '/login'
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { 
          authenticated: false, 
          user: null,
          redirectPath: '/login'
        },
        { status: 401 }
      );
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false, 
          user: null,
          redirectPath: '/login'
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      let message = 'Your account is not active.';
      let redirectPath = '/login';
      
      if (user.role === 'instructor') {
        message = 'Your instructor account is pending approval.';
        redirectPath = '/login/instructorlogin';
      } else if (user.role === 'admin') {
        message = 'Your admin account is not active.';
        redirectPath = '/login/adminlogin';
      }
      
      return NextResponse.json(
        { 
          authenticated: false, 
          user: user.toSafeObject(),
          message,
          redirectPath
        },
        { status: 403 }
      );
    }

    const dashboardPath = user.role === 'admin' ? '/admin/dashboard' :
                         user.role === 'instructor' ? '/instructor/dashboard' :
                         '/student/dashboard';

    return NextResponse.json({
      authenticated: true,
      user: user.toSafeObject(),
      dashboardPath
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        user: null,
        redirectPath: '/login'
      },
      { status: 401 }
    );
  }
}