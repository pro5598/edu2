import { NextRequest, NextResponse } from 'next/server';
import { Assignment, Submission, User, Enrollment, Notification } from '@/models';
import connectDB from '@/lib/database';
import { authenticateToken } from '@/middleware/auth';
import path from 'path';
import fs from 'fs/promises';

// POST /api/student/assignments/[assignmentId]/submit - Submit assignment
export async function POST(request, { params }) {
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

    // Get assignment and verify it exists
    const { assignmentId } = await params;
    const assignment = await Assignment.findById(assignmentId).populate('course');
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Verify student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: assignment.course._id,
      status: 'active'
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'You are not enrolled in this course' }, { status: 403 });
    }

    // Check if assignment is still active
    if (!assignment.isActive) {
      return NextResponse.json({ error: 'Assignment is no longer active' }, { status: 400 });
    }

    // Check if submission already exists
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 });
    }

    // Check if assignment is overdue and late submissions are not allowed
    const now = new Date();
    const isLate = now > assignment.dueDate;
    
    if (isLate && !assignment.allowLateSubmission) {
      return NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 });
    }

    const formData = await request.formData();
    const submissionText = formData.get('submissionText') || '';
    const submissionNotes = formData.get('submissionNotes') || '';
    
    // Handle file uploads
    const submissionFiles = [];
    const files = formData.getAll('submissionFiles');
    
    if (files && files.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      
      for (const file of files) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${student._id}-${file.name}`;
          const uploadDir = path.join(process.cwd(), 'public/uploads/submissions');
          
          // Create directory if it doesn't exist
          await fs.mkdir(uploadDir, { recursive: true });
          
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(await file.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          
          submissionFiles.push({
            fileName,
            originalName: file.name,
            filePath: `/uploads/submissions/${fileName}`,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date()
          });
        }
      }
    }

    // Create submission
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      submissionText,
      submissionFiles,
      submissionNotes,
      submittedAt: now,
      isLate,
      status: 'submitted'
    });

    await submission.save();
    
    // Populate data for response
    await submission.populate([
      { path: 'assignment', select: 'title maxScore dueDate' },
      { path: 'student', select: 'firstName lastName email' }
    ]);

    // Get student and instructor information for notifications
    const studentUser = await User.findById(studentId);
    
    // Create submission notification for instructor
    try {
      await Notification.createSubmissionNotification({
        studentName: `${studentUser.firstName} ${studentUser.lastName}`,
        assignmentTitle: assignment.title,
        courseName: assignment.course.title,
        assignmentId: assignment._id,
        courseId: assignment.course._id,
        studentId: studentId,
        instructorId: assignment.course.instructor
      });
    } catch (notificationError) {
      console.error('Failed to create submission notification:', notificationError);
      // Don't fail the submission if notification creation fails
    }

    return NextResponse.json({ 
      submission,
      message: 'Assignment submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}