import { NextResponse } from 'next/server';
import { User } from '../../../../../models';
import { generateToken } from '../../../../../lib/jwt';
import connectDB from '../../../../../lib/database';

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password, rememberMe = false } = await request.json();
    const loginField = username || email;

    if (!loginField || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [
        { username: loginField },
        { email: loginField }
      ],
      role: 'admin'
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Admin account is not active. Please contact system administrator.' },
        { status: 403 }
      );
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    await user.updateLastLogin();

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    });

    const response = NextResponse.json({
      message: 'Admin login successful',
      user: user.toSafeObject(),
      redirectPath: '/admin/dashboard'
    });

    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    response.cookies.set('userRole', 'admin', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}