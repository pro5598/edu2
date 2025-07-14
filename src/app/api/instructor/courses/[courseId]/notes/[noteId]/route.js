import { NextResponse } from 'next/server';
import { Course, CourseNote } from '../../../../../../../models';
import { requireInstructor } from '../../../../../../../middleware/auth';
import connectDB from '../../../../../../../lib/database';
import path from 'path';
import fs from 'fs/promises';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, noteId } = await params;
    const instructorId = authResult.user._id;
    
    const formData = await request.formData();
    const noteData = JSON.parse(formData.get('noteData'));
    const file = formData.get('file');

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const note = await CourseNote.findOne({ _id: noteId, course: courseId });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    let updateData = {
      title: noteData.title,
      description: noteData.description,
      order: noteData.order || note.order
    };

    if (file) {
      if (note.filePath) {
        try {
          const oldFilePath = path.join(process.cwd(), 'public', note.filePath);
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.log('Old file not found or already deleted');
        }
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

      updateData = {
        ...updateData,
        fileName,
        originalFileName: file.name,
        filePath: relativePath,
        fileSize: file.size,
        fileType,
        mimeType: file.type
      };
    }

    const updatedNote = await CourseNote.findByIdAndUpdate(
      noteId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      message: 'Course note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update course note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, noteId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const note = await CourseNote.findOneAndDelete({ _id: noteId, course: courseId });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (note.filePath) {
      try {
        const filePath = path.join(process.cwd(), 'public', note.filePath);
        await fs.unlink(filePath);
      } catch (error) {
        console.log('File not found or already deleted');
      }
    }

    return NextResponse.json({ message: 'Course note deleted successfully' });
  } catch (error) {
    console.error('Delete course note error:', error);
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