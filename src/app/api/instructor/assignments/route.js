import { NextRequest, NextResponse } from 'next/server';
import { Assignment, Course, User } from '@/models';
import connectDB from '@/lib/database';
import { requireInstructor } from '@/middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// GET /api/instructor/assignments - Get all assignments for instructor
export async function GET(request) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructor = authResult.user;
    const instructorId = authResult.user._id;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    // Build query
    let query = { instructor: instructorId };
    if (courseId) {
      query.course = courseId;
    }

    const assignments = await Assignment.find(query)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Assignment.countDocuments(query);

    return NextResponse.json({
      assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/instructor/assignments - Create new assignment
export async function POST(request) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const instructor = authResult.user;
    const instructorId = authResult.user._id;

    const formData = await request.formData();
    const assignmentData = JSON.parse(formData.get('assignmentData'));
    
    // Validate required fields
    const { title, description, course, dueDate, maxScore } = assignmentData;
    if (!title || !description || !course || !dueDate || !maxScore) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify course belongs to instructor
    const courseDoc = await Course.findOne({ _id: course, instructor: instructorId });
    if (!courseDoc) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Handle file attachments
    const attachments = [];
    const files = formData.getAll('attachments');
    
    if (files && files.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      
      for (const file of files) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.name}`;
          const uploadDir = path.join(process.cwd(), 'public/uploads/assignments');
          
          // Create directory if it doesn't exist
          await fs.mkdir(uploadDir, { recursive: true });
          
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(await file.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          
          attachments.push({
            fileName,
            filePath: `/uploads/assignments/${fileName}`,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date()
          });
        }
      }
    }

    // Create assignment
    const assignment = new Assignment({
      ...assignmentData,
      instructor: instructorId,
      attachments: attachments
    });

    await assignment.save();
    
    // Populate course data for response
    await assignment.populate('course', 'title');

    return NextResponse.json({ assignment }, { status: 201 });

  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}