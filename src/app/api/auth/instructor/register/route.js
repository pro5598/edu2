import { NextResponse } from 'next/server';
import { User } from '../../../../../models';
import { generateToken } from '../../../../../lib/jwt';
import connectDB from '../../../../../lib/database';

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

export async function POST(request) {
  try {
    await connectDB();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      bio,
      expertise,
      experience,
      education,
      linkedinProfile,
      portfolio
    } = await request.json();

    if (!email || !password || !firstName || !lastName || !bio || !expertise) {
      return NextResponse.json(
        { error: ' email, password, first name, last name, bio, and expertise are required for instructor registration' },
        { status: 400 }
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


    if (bio.length < 50) {
      return NextResponse.json(
        { error: 'Bio must be at least 50 characters long' },
        { status: 400 }
      );
    }

    if (expertise.length < 10) {
      return NextResponse.json(
        { error: 'Expertise description must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    const userData = {
      email,
      password,
      firstName,
      lastName,
      role: 'instructor',
      bio,
      expertise,
      isActive: false
    };

    if (phone) userData.phone = phone;
    if (experience) userData.experience = experience;
    if (education) userData.education = education;
    if (linkedinProfile) userData.linkedinProfile = linkedinProfile;
    if (portfolio) userData.portfolio = portfolio;

    const user = new User(userData);
    await user.save();

    const response = NextResponse.json({
      message: 'Instructor registration successful. Your account is pending approval by an administrator.',
      user: user.toSafeObject(),
      status: 'pending_approval'
    }, { status: 201 });

    return response;
  } catch (error) {
    console.error('Instructor registration error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
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
