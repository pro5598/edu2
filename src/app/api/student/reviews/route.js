import { NextResponse } from 'next/server';
import { Review, Course, User, Enrollment } from '../../../../models';
import { authenticateToken } from '../../../../middleware/auth';
import connectDB from '../../../../lib/database';

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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query for student's reviews
    let query = {
      student: user._id,
      isActive: true
    };

    // Add rating filter if specified
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Get reviews with course and instructor information
    const reviews = await Review.find(query)
      .populate({
        path: 'course',
        select: 'title thumbnail instructor',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter by search term if provided
    let filteredReviews = reviews;
    if (search) {
      filteredReviews = reviews.filter(review => 
        review.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
        review.comment?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Get total count for pagination
    const totalCount = await Review.countDocuments(query);
    
    // Calculate summary statistics
    const allUserReviews = await Review.find({ student: user._id, isActive: true });
    const totalReviews = allUserReviews.length;
    const averageRating = totalReviews > 0 
      ? allUserReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allUserReviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    // Format response data
    const formattedReviews = filteredReviews.map(review => ({
      id: review._id,
      course: review.course?.title || 'Unknown Course',
      feedback: review.comment,
      rating: review.rating,
      date: review.createdAt.toISOString().split('T')[0],
      instructor: review.course?.instructor 
        ? `${review.course.instructor.firstName} ${review.course.instructor.lastName}`
        : 'Unknown Instructor',
      courseId: review.course?._id,
      canEdit: review.canEdit(user._id, 24), // 24 hours edit window
      helpfulVotes: review.helpfulVotes || 0,
      unhelpfulVotes: review.unhelpfulVotes || 0,
      isApproved: review.isApproved,
      lastEditedAt: review.lastEditedAt
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      summary: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get student reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const { reviewId, rating, comment } = await request.json();

    if (!reviewId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Review ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await Review.findOne({
      _id: reviewId,
      student: user._id,
      isActive: true
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Check if review can be edited (24 hour window)
    if (!review.canEdit(user._id, 24)) {
      return NextResponse.json(
        { error: 'Review can only be edited within 24 hours of creation' },
        { status: 403 }
      );
    }

    // Store original values for edit history
    review._original = {
      rating: review.rating,
      comment: review.comment
    };

    // Update review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update course average rating
    const courseReviews = await Review.find({
      course: review.course,
      isApproved: true,
      isActive: true
    });

    if (courseReviews.length > 0) {
      const averageRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
      await Course.findByIdAndUpdate(review.course, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: courseReviews.length
      });
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        lastEditedAt: review.lastEditedAt
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const review = await Review.findOne({
      _id: reviewId,
      student: user._id,
      isActive: true
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Soft delete - mark as inactive
    review.isActive = false;
    await review.save();

    // Clear rating and review from enrollment record
    await Enrollment.findOneAndUpdate(
      {
        student: user._id,
        course: review.course,
        isActive: true
      },
      {
        $unset: {
          rating: 1,
          review: 1
        }
      }
    );

    // Update course average rating
    const courseReviews = await Review.find({
      course: review.course,
      isApproved: true,
      isActive: true
    });

    const averageRating = courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
      : 0;

    await Course.findByIdAndUpdate(review.course, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: courseReviews.length
    });

    return NextResponse.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}