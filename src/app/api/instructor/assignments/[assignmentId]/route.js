import { NextRequest, NextResponse } from 'next/server';
import { Assignment, Course, User, Submission } from '@/models';
import connectDB from '@/lib/database';
import { requireInstructor } from '@/middleware/auth';
import path from 'path';
import fs from 'fs/promises';

// GET /api/instructor/assignments/[assignmentId] - Get specific assignment
export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    const { assignmentId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    }).populate('course', 'title');

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ assignment });

  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/instructor/assignments/[assignmentId] - Update assignment
export async function PUT(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    const { assignmentId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const assignmentData = JSON.parse(formData.get('assignmentData'));
    
    // Handle new file attachments
    const newAttachments = [];
    const files = formData.getAll('attachments');
    
    if (files && files.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      
      for (const file of files) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.name}`;
          const uploadDir = path.join(process.cwd(), 'public/uploads/assignments');
          
          await fs.mkdir(uploadDir, { recursive: true });
          
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(await file.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          
          newAttachments.push({
            fileName,
            filePath: `/uploads/assignments/${fileName}`,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date()
          });
        }
      }
    }

    // Update assignment
    Object.assign(assignment, assignmentData);
    if (newAttachments.length > 0) {
      assignment.attachments = [...assignment.attachments, ...newAttachments];
    }

    await assignment.save();
    await assignment.populate('course', 'title');

    return NextResponse.json({ assignment });

  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/instructor/assignments/[assignmentId] - Delete assignment
export async function DELETE(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructorId = authResult.user._id;

    const { assignmentId } = await params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      instructor: instructorId
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if there are any submissions
    const submissionCount = await Submission.countDocuments({ assignment: assignment._id });
    if (submissionCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete assignment with existing submissions' 
      }, { status: 400 });
    }

    // Delete associated files
    if (assignment.attachments && assignment.attachments.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      
      for (const attachment of assignment.attachments) {
        try {
          const fullPath = path.join(process.cwd(), 'public', attachment.filePath);
          await fs.unlink(fullPath);
        } catch (fileError) {
          console.warn('Could not delete file:', attachment.filePath);
        }
      }
    }

    await Assignment.findByIdAndDelete(assignment._id);

    return NextResponse.json({ message: 'Assignment deleted successfully' });

  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}