import { NextResponse } from 'next/server';
import { Course, Review, User } from '../../../../../../models';
import { requireInstructor } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = params;
    const instructorId = authResult.user._id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let query = { course: courseId };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('student', 'name email avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    const reviewStats = await Review.aggregate([
      { $match: { course: course._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    let stats = {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    if (reviewStats.length > 0) {
      const stat = reviewStats[0];
      stats.averageRating = Math.round(stat.averageRating * 10) / 10;
      stats.totalReviews = stat.totalReviews;
      
      stat.ratingDistribution.forEach(rating => {
        stats.ratingDistribution[rating]++;
      });
    }

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Get course reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}