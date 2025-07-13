import { NextResponse } from 'next/server';
import { User } from '../../../../../models';
import { generateToken } from '../../../../../lib/jwt';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password) && 
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const validateAdminCode = (adminCode) => {
  const validAdminCode = process.env.ADMIN_REGISTRATION_CODE || 'ADMIN2024';
  return adminCode === validAdminCode;
};

export async function POST(request) {
  try {
    const { 
      username, 
      email, 
      password, 
      confirmPassword,
      firstName, 
      lastName,
      adminCode
    } = await request.json();

    if (!username || !email || !password || !firstName || !lastName || !adminCode) {
      return NextResponse.json(
        { error: 'Username, email, password, first name, last name, and admin code are required' },
        { status: 400 }
      );
    }

    if (!validateAdminCode(adminCode)) {
      return NextResponse.json(
        { error: 'Invalid admin registration code' },
        { status: 403 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      where: {
        $or: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'admin',
      isActive: true
    };

    const user = await User.create(userData);

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    });

    const response = NextResponse.json({
      message: 'Admin registration successful',
      user: user.toSafeObject(),
      redirectPath: '/admin/dashboard'
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    response.cookies.set('userRole', 'admin', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return response;
  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}