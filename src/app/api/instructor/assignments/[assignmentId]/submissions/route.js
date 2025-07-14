import { NextRequest, NextResponse } from 'next/server';
import { Assignment, Submission, User } from '@/models';
import connectDB from '@/lib/database';
import { requireInstructor } from '@/middleware/auth';

// GET /api/instructor/assignments/[assignmentId]/submissions - Get all submissions for assignment
export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    // Verify assignment belongs to instructor
    const { assignmentId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'submitted', 'graded', etc.
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { assignment: assignmentId };
    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'firstName lastName email profileImage')
      .populate('assignment', 'title maxScore dueDate')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(query);

    // Calculate statistics
    const stats = {
      total: await Submission.countDocuments({ assignment: assignmentId }),
      graded: await Submission.countDocuments({ assignment: assignmentId, isGraded: true }),
      pending: await Submission.countDocuments({ assignment: assignmentId, isGraded: false }),
      late: await Submission.countDocuments({ assignment: assignmentId, isLate: true })
    };

    return NextResponse.json({
      submissions,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}