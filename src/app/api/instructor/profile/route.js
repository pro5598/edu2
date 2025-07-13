import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import { requireInstructor } from '../../../../middleware/auth';

export async function GET(request) {
  try {
    const authResult = await requireInstructor(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const instructor = await User.findById(authResult.user._id)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error) {
    console.error('Get instructor profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const authResult = await requireInstructor(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      expertise,
      experience,
      dateOfBirth,
      gender
    } = body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (experience !== undefined) updateData.experience = experience;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;

    const instructor = await User.findByIdAndUpdate(
      authResult.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error) {
    console.error('Update instructor profile error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}