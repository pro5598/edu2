import { NextResponse } from 'next/server';
import { User } from '../../../../models';
import { generateToken } from '../../../../lib/jwt';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;

const loginAttempts = new Map();

const isAccountLocked = (identifier) => {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return false;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_TIME) {
      return true;
    } else {
      loginAttempts.delete(identifier);
      return false;
    }
  }
  return false;
};

const recordFailedAttempt = (identifier) => {
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(identifier, attempts);
};

const clearFailedAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};

const getRemainingLockoutTime = (identifier) => {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return 0;
  
  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
  const remainingTime = LOCKOUT_TIME - timeSinceLastAttempt;
  return Math.max(0, Math.ceil(remainingTime / 1000 / 60));
};

const validateLoginInput = (username, password, role) => {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('Username or email is required');
  }
  
  if (!password || password.length === 0) {
    errors.push('Password is required');
  }
  
  if (role && !['student', 'instructor', 'admin'].includes(role)) {
    errors.push('Invalid role specified');
  }
  
  return errors;
};

const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'student':
    default:
      return '/student/dashboard';
  }
};

export async function POST(request) {
  try {
    const { username, password, role, rememberMe = false } = await request.json();
    
    const validationErrors = validateLoginInput(username, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    const identifier = username.toLowerCase();
    
    if (isAccountLocked(identifier)) {
      const remainingMinutes = getRemainingLockoutTime(identifier);
      return NextResponse.json(
        { 
          error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minutes.`,
          lockoutTime: remainingMinutes
        },
        { status: 429 }
      );
    }

    const whereClause = {
      $or: [
        { username: username },
        { email: username }
      ]
    };
    
    if (role) {
      whereClause.role = role;
    }

    const user = await User.findOne(whereClause).select('+password');

    if (!user) {
      recordFailedAttempt(identifier);
      return NextResponse.json(
        { error: 'Invalid username, email, or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      let message = 'Your account is not active';
      if (user.role === 'instructor') {
        message = 'Your instructor account is pending approval. Please wait for admin activation.';
      }
      return NextResponse.json(
        { error: message },
        { status: 403 }
      );
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      recordFailedAttempt(identifier);
      const attempts = loginAttempts.get(identifier);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - (attempts?.count || 0);
      
      return NextResponse.json(
        { 
          error: 'Invalid username, email, or password',
          remainingAttempts: Math.max(0, remainingAttempts)
        },
        { status: 401 }
      );
    }

    if (role && user.role !== role) {
      recordFailedAttempt(identifier);
      return NextResponse.json(
        { error: `Invalid credentials for ${role} login` },
        { status: 401 }
      );
    }

    clearFailedAttempts(identifier);

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    };

    const token = generateToken(tokenPayload);
    const redirectPath = getRedirectPath(user.role);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio
      },
      redirectPath,
      sessionInfo: {
        loginTime: new Date().toISOString(),
        rememberMe
      }
    });

    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    response.cookies.set('userRole', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.name === 'SequelizeDatabaseError') {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}