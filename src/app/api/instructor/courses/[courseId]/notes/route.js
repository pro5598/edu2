import { NextResponse } from 'next/server';
import { Course, CourseNote } from '../../../../../../models';
import { requireInstructor } from '../../../../../../middleware/auth';
import connectDB from '../../../../../../lib/database';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const notes = await CourseNote.find({ course: courseId })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Get course notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId } = await params;
    const instructorId = authResult.user._id;
    
    const formData = await request.formData();
    const noteData = JSON.parse(formData.get('noteData'));
    const file = formData.get('file');

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'course-notes');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const fileExtension = path.extname(file.name);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    const fileType = getFileType(fileExtension);
    const relativePath = `/uploads/course-notes/${fileName}`;

    const note = new CourseNote({
      title: noteData.title,
      description: noteData.description,
      course: courseId,
      fileName,
      originalFileName: file.name,
      filePath: relativePath,
      fileSize: file.size,
      fileType,
      mimeType: file.type,
      order: noteData.order || 0
    });

    await note.save();

    return NextResponse.json({ 
      message: 'Course note created successfully',
      note
    }, { status: 201 });
  } catch (error) {
    console.error('Create course note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getFileType(extension) {
  const ext = extension.toLowerCase();
  const typeMap = {
    '.pdf': 'pdf',
    '.doc': 'doc',
    '.docx': 'docx',
    '.txt': 'txt',
    '.ppt': 'ppt',
    '.pptx': 'pptx',
    '.xls': 'xls',
    '.xlsx': 'xlsx',
    '.zip': 'zip',
    '.rar': 'rar'
  };
  return typeMap[ext] || 'other';
}