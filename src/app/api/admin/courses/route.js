import { NextResponse } from 'next/server';
import Course from '../../../../models/Course.js';
import User from '../../../../models/User.js';
import { authenticateToken } from '../../../../middleware/auth.js';
import connectDB from '../../../../lib/database.js';

// GET - Fetch all courses for admin
export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { user } = authResult;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category !== 'all') {
      query.category = category;
    }

    // Fetch courses with instructor details
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(query);

    // Transform data for frontend
    const transformedCourses = courses.map(course => ({
      id: course._id,
      title: course.title,
      instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
      instructorId: course.instructor?._id,
      category: course.category,
      students: course.enrollmentCount,
      rating: course.averageRating,
      reviews: course.totalReviews,
      price: course.price,
      originalPrice: course.originalPrice,
      revenue: course.enrollmentCount * course.price,
      createdDate: course.createdAt?.toISOString().split('T')[0],
      lastUpdated: course.updatedAt?.toISOString().split('T')[0],
      thumbnail: course.thumbnail,
      isPublished: course.isPublished,
      isActive: course.isActive,
      level: course.level,
      duration: course.duration,
      description: course.description
    }));

    return NextResponse.json({
      courses: transformedCourses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
        hasNext: page < Math.ceil(totalCourses / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// PUT - Update course details
export async function PUT(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { user } = authResult;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const body = await request.json();
    const { courseId, title, category, price, originalPrice, thumbnail, isPublished, isActive, level, description } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Update course fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (level !== undefined) updateData.level = level;
    if (description !== undefined) updateData.description = description;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName username email');

    // Transform response
    const transformedCourse = {
      id: updatedCourse._id,
      title: updatedCourse.title,
      instructor: updatedCourse.instructor ? `${updatedCourse.instructor.firstName} ${updatedCourse.instructor.lastName}` : 'Unknown',
      instructorId: updatedCourse.instructor?._id,
      category: updatedCourse.category,
      students: updatedCourse.enrollmentCount,
      rating: updatedCourse.averageRating,
      reviews: updatedCourse.totalReviews,
      price: updatedCourse.price,
      originalPrice: updatedCourse.originalPrice,
      revenue: updatedCourse.enrollmentCount * updatedCourse.price,
      createdDate: updatedCourse.createdAt?.toISOString().split('T')[0],
      lastUpdated: updatedCourse.updatedAt?.toISOString().split('T')[0],
      thumbnail: updatedCourse.thumbnail,
      isPublished: updatedCourse.isPublished,
      isActive: updatedCourse.isActive,
      level: updatedCourse.level,
      duration: updatedCourse.duration,
      description: updatedCourse.description
    };

    return NextResponse.json({
      message: 'Course updated successfully',
      course: transformedCourse
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a course
export async function DELETE(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { user } = authResult;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course has enrollments
    if (course.enrollmentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with active enrollments. Please contact students first.' },
        { status: 400 }
      );
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return NextResponse.json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}