import { NextResponse } from 'next/server';
import { User } from '../../../../models';
import { generateToken } from '../../../../lib/jwt';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
  };
};

const validateRoleSpecificFields = (role, data) => {
  const errors = [];
  
  switch (role) {
    case 'instructor':
      if (!data.bio || data.bio.trim().length < 50) {
        errors.push('Bio must be at least 50 characters for instructors');
      }
      if (!data.expertise || data.expertise.trim().length === 0) {
        errors.push('Area of expertise is required for instructors');
      }
      if (!data.experience || data.experience.trim().length === 0) {
        errors.push('Experience level is required for instructors');
      }
      break;
    case 'admin':
      if (!data.adminCode || data.adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        errors.push('Invalid admin registration code');
      }
      break;
    case 'student':
    default:
      break;
  }
  
  return errors;
};

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      role = 'student',
      bio,
      expertise,
      experience,
      adminCode,
      phone
    } = requestData;

    if (!username || !email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Username, email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    const roleValidationErrors = validateRoleSpecificFields(role, requestData);
    if (roleValidationErrors.length > 0) {
      return NextResponse.json(
        { error: roleValidationErrors.join(', ') },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'Username' : 'Email';
      return NextResponse.json(
        { error: `${field} already exists. Please choose a different one.` },
        { status: 409 }
      );
    }

    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      isActive: role === 'instructor' ? false : true
    };

    if (bio) userData.bio = bio;
    if (phone) userData.phone = phone;
    if (expertise) userData.expertise = expertise;
    if (experience) userData.experience = experience;

    const user = await User.create(userData);

    let responseMessage = 'Registration successful';
    if (role === 'instructor') {
      responseMessage = 'Instructor application submitted successfully. Your account will be activated after review.';
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    const response = NextResponse.json({
      message: responseMessage,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
      },
      requiresActivation: role === 'instructor'
    }, { status: 201 });

    if (user.isActive) {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return NextResponse.json(
        { error: `Validation error: ${validationErrors}` },
        { status: 400 }
      );
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}