import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {
      role: 'student'
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query)
      .select('firstName lastName username email status phone createdAt isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const usersWithEnrollments = await Promise.all(
      users.map(async (user) => {
        const enrollmentCount = await Enrollment.countDocuments({ 
          userId: user._id 
        });
        
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: 'Student',
          status: user.isActive ? 'active' : 'suspended',
          coursesEnrolled: enrollmentCount,
          phone: user.phone || 'N/A',
          joinDate: user.createdAt.toISOString().split('T')[0]
        };
      })
    );

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithEnrollments,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const { userId, ...updateData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const allowedFields = ['firstName', 'lastName', 'username', 'email', 'phone', 'status'];
    const filteredData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'status') {
          filteredData['isActive'] = updateData[key] === 'active';
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      filteredData,
      { new: true, runValidators: true }
    ).select('firstName lastName username email isActive phone createdAt');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const enrollmentCount = await Enrollment.countDocuments({ 
      userId: updatedUser._id 
    });

    const userResponse = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      email: updatedUser.email,
      type: 'Student',
      status: updatedUser.isActive ? 'active' : 'suspended',
      coursesEnrolled: enrollmentCount,
      phone: updatedUser.phone || 'N/A',
      joinDate: updatedUser.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const userData = await request.json();
    const { firstName, lastName, username, email, phone, password, isActive } = userData;

    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, username, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json(
        { success: false, error: `User with this ${field} already exists` },
        { status: 409 }
      );
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      phone: phone || '',
      role: 'student',
      isActive: isActive !== undefined ? isActive : true
    });

    await newUser.save();

    const userResponse = {
      id: newUser._id,
      name: newUser.getFullName(),
      email: newUser.email,
      type: 'Student',
      status: newUser.isActive ? 'active' : 'inactive',
      coursesEnrolled: 0,
      phone: newUser.phone || 'N/A',
      joinDate: newUser.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user' 
      },
      { status: 500 }
    );
  }
}