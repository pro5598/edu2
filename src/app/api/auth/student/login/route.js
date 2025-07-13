import { NextResponse } from 'next/server';
import { User } from '../../../../../models';
import { generateToken } from '../../../../../lib/jwt';

export async function POST(request) {
  try {
    const { username, password, rememberMe = false } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      where: {
        $or: [
          { username: username },
          { email: username }
        ],
        role: 'student'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid student credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your student account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid student credentials' },
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
      message: 'Student login successful',
      user: user.toSafeObject(),
      redirectPath: '/student/dashboard'
    });

    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    response.cookies.set('userRole', 'student', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    return response;
  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}