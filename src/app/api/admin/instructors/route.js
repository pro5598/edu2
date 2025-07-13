import { NextResponse } from 'next/server';
import User from '../../../../models/User.js';
import { requireAdmin } from '../../../../middleware/auth.js';
import connectDB from '../../../../lib/database.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const whereClause = { role: 'instructor' };
    if (status === 'pending') {
      whereClause.isActive = false;
    } else if (status === 'active') {
      whereClause.isActive = true;
    }

    const instructors = await User.find(whereClause)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalInstructors = await User.countDocuments(whereClause);
    const totalPages = Math.ceil(totalInstructors / limit);

    return NextResponse.json({
      instructors: instructors.map(instructor => ({
        id: instructor._id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        username: instructor.username,
        name: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        phone: instructor.phone || 'N/A',
        bio: instructor.bio || 'No bio provided',
        expertise: instructor.expertise || [],
        experience: instructor.experience || 'No experience provided',
        status: instructor.isActive ? 'active' : 'pending',
        joinDate: instructor.createdAt ? new Date(instructor.createdAt).toISOString().split('T')[0] : 'N/A'
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalInstructors,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get instructors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const instructorData = await request.json();
    const { firstName, lastName, username, email, password, phone, bio, expertise, experience } = instructorData;

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

    const newInstructor = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      phone: phone || '',
      bio: bio || '',
      expertise: expertise || [],
      experience: experience || '',
      role: 'instructor',
      isActive: false
    });

    await newInstructor.save();

    const instructorResponse = {
      id: newInstructor._id,
      firstName: newInstructor.firstName,
      lastName: newInstructor.lastName,
      username: newInstructor.username,
      name: `${newInstructor.firstName} ${newInstructor.lastName}`,
      email: newInstructor.email,
      phone: newInstructor.phone || 'N/A',
      bio: newInstructor.bio || 'No bio provided',
      expertise: newInstructor.expertise,
      experience: newInstructor.experience || 'No experience provided',
      status: newInstructor.isActive ? 'active' : 'pending',
      joinDate: newInstructor.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: instructorResponse,
      message: 'Instructor created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating instructor:', error);
    
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
        error: 'Failed to create instructor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { instructorId, ...updateData } = await request.json();

    if (!instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID is required' },
        { status: 400 }
      );
    }

    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor'
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'bio', 'expertise', 'experience', 'isActive'];
    const filteredData = {};
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        filteredData[key] = value;
      }
    }

    if (updateData.email && updateData.email !== instructor.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    Object.assign(instructor, filteredData);
    await instructor.save();

    return NextResponse.json({
      message: 'Instructor updated successfully',
      instructor: {
        id: instructor._id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        username: instructor.username,
        name: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        phone: instructor.phone || 'N/A',
        bio: instructor.bio || 'No bio provided',
        expertise: instructor.expertise || [],
        experience: instructor.experience || 'No experience provided',
        status: instructor.isActive ? 'active' : 'pending',
        joinDate: instructor.createdAt ? new Date(instructor.createdAt).toISOString().split('T')[0] : 'N/A'
      }
    });
  } catch (error) {
    console.error('Update instructor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { instructorId, action } = await request.json();

    if (!instructorId || !action) {
      return NextResponse.json(
        { error: 'Instructor ID and action are required' },
        { status: 400 }
      );
    }

    if (!['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "activate" or "deactivate"' },
        { status: 400 }
      );
    }

    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor'
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    const adminUser = authResult.user;
    
    if (action === 'activate') {
      await instructor.activate(adminUser._id);
    } else {
      await instructor.deactivate();
    }

    return NextResponse.json({
      message: `Instructor ${action}d successfully`,
      instructor: {
        id: instructor._id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        username: instructor.username,
        name: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        phone: instructor.phone || 'N/A',
        bio: instructor.bio || 'No bio provided',
        expertise: instructor.expertise || [],
        experience: instructor.experience || 'No experience provided',
        status: instructor.isActive ? 'active' : 'pending',
        joinDate: instructor.createdAt ? new Date(instructor.createdAt).toISOString().split('T')[0] : 'N/A'
      }
    });
  } catch (error) {
    console.error('Update instructor status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('id');

    if (!instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID is required' },
        { status: 400 }
      );
    }

    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor'
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(instructorId);

    return NextResponse.json({
      message: 'Instructor deleted successfully'
    });
  } catch (error) {
    console.error('Delete instructor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}