import { NextRequest, NextResponse } from 'next/server';
import { Assignment, Submission, User } from '@/models';
import connectDB from '@/lib/database';
import { requireInstructor } from '@/middleware/auth';

// GET /api/instructor/assignments/[assignmentId]/submissions/[submissionId] - Get specific submission
export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    // Verify assignment belongs to instructor
    const { assignmentId, submissionId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      assignment: assignmentId
    })
    .populate('student', 'firstName lastName email profileImage')
    .populate('assignment', 'title maxScore dueDate allowLateSubmission latePenalty')
    .populate('gradedBy', 'firstName lastName');

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Calculate final score with late penalty if applicable
    const finalScore = await submission.calculateFinalScore();

    return NextResponse.json({ 
      submission: {
        ...submission.toObject(),
        finalScore
      }
    });

  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/instructor/assignments/[assignmentId]/submissions/[submissionId] - Grade submission
export async function PUT(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    // Verify assignment belongs to instructor
    const { assignmentId, submissionId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      assignment: assignmentId
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const { score, feedback } = await request.json();

    // Validate score
    if (score === undefined || score < 0 || score > assignment.maxScore) {
      return NextResponse.json({ 
        error: `Score must be between 0 and ${assignment.maxScore}` 
      }, { status: 400 });
    }

    // Grade the submission
    await submission.grade(score, feedback || '', instructorId);
    
    // Populate data for response
    await submission.populate([
      { path: 'student', select: 'firstName lastName email profileImage' },
      { path: 'assignment', select: 'title maxScore dueDate allowLateSubmission latePenalty' },
      { path: 'gradedBy', select: 'firstName lastName' }
    ]);

    // Calculate final score with late penalty
    const finalScore = await submission.calculateFinalScore();

    return NextResponse.json({ 
      submission: {
        ...submission.toObject(),
        finalScore
      },
      message: 'Submission graded successfully'
    });

  } catch (error) {
    console.error('Error grading submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}