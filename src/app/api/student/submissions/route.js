import { NextResponse } from 'next/server';
import { Submission, Assignment } from '@/models';
import connectDB from '@/lib/database';
import { authenticateToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const student = authResult.user;
    if (student.role !== 'student') {
      return NextResponse.json({ error: 'Access denied. Student role required.' }, { status: 403 });
    }

    await connectDB();
    const studentId = student._id;

    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');

    let query = { student: studentId };
    
    if (courseId) {
      const assignments = await Assignment.find({ course: courseId }).select('_id');
      const assignmentIds = assignments.map(a => a._id);
      query.assignment = { $in: assignmentIds };
    }

    const submissions = await Submission.find(query)
      .populate({
        path: 'assignment',
        select: 'title maxScore dueDate course',
        populate: {
          path: 'course',
          select: 'title'
        }
      })
      .sort({ submittedAt: -1 });

    const submissionMap = {};
    submissions.forEach(submission => {
      submissionMap[submission.assignment._id.toString()] = {
        _id: submission._id,
        submissionText: submission.submissionText,
        submissionFiles: submission.submissionFiles,
        submissionNotes: submission.submissionNotes,
        submittedAt: submission.submittedAt,
        isLate: submission.isLate,
        isGraded: submission.isGraded,
        score: submission.score,
        feedback: submission.feedback,
        status: submission.status
      };
    });

    return NextResponse.json({ submissions: submissionMap }, { status: 200 });

  } catch (error) {
    console.error('Error fetching student submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}