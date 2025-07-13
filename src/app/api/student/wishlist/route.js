import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import { authenticateToken } from '../../../../middleware/auth';
import Wishlist from '../../../../models/Wishlist';
import Course from '../../../../models/Course';
import User from '../../../../models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const user = authResult.user;

    const wishlist = await Wishlist.findOne({ user: user.id })
      .populate({
        path: 'items.course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });

    if (!wishlist) {
      return NextResponse.json({
        wishlistItems: [],
        itemCount: 0
      });
    }

    const wishlistData = wishlist.items
      .filter(item => item.isActive)
      .map(item => ({
        id: item._id,
        course: {
          ...item.course.toObject(),
          instructor: `${item.course.instructor.firstName} ${item.course.instructor.lastName}`
        },
        addedAt: item.addedAt,
        priority: item.priority,
        notes: item.notes
      }));

    return NextResponse.json({
      wishlistItems: wishlistData,
      itemCount: wishlistData.length
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const user = authResult.user;

    const { courseId, action } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ user: user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: user.id,
        items: []
      });
    }

    const existingItemIndex = wishlist.items.findIndex(
      item => item.course.toString() === courseId && item.isActive
    );

    if (action === 'remove' || existingItemIndex !== -1) {
      if (existingItemIndex !== -1) {
        wishlist.items[existingItemIndex].isActive = false;
        wishlist.totalItems = Math.max(0, wishlist.totalItems - 1);
        wishlist.lastUpdated = new Date();
        await wishlist.save();
        
        return NextResponse.json({
          message: 'Course removed from wishlist',
          action: 'removed'
        });
      } else {
        return NextResponse.json(
          { error: 'Course not found in wishlist' },
          { status: 404 }
        );
      }
    } else {
      // Add to wishlist
      wishlist.items.push({
        course: courseId,
        addedAt: new Date(),
        priceWhenAdded: course.price,
        source: 'browse'
      });
      
      wishlist.totalItems = (wishlist.totalItems || 0) + 1;
      wishlist.lastUpdated = new Date();
      await wishlist.save();
      
      return NextResponse.json({
        message: 'Course added to wishlist',
        action: 'added'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}