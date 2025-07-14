import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../../../../models';
import { requireInstructor } from '../../../../../../../../../middleware/auth';
import connectDB from '../../../../../../../../../lib/database';
import path from 'path';
import fs from 'fs/promises';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, chapterId, lessonId } = await params;
    const instructorId = authResult.user._id;
    
    const formData = await request.formData();
    const lessonData = JSON.parse(formData.get('lessonData'));
    const videoFile = formData.get('videoFile');

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({ _id: lessonId, chapter: chapterId, course: courseId });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    let videoPath = lesson.videoFile;
    if (videoFile && lessonData.videoType === 'upload') {
      if (lesson.videoFile) {
        try {
          const oldFilePath = path.join(process.cwd(), 'public', lesson.videoFile);
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.log('Old video file not found or already deleted');
        }
      }
      
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const fileName = `${Date.now()}-${videoFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      videoPath = `/uploads/videos/${fileName}`;
    } else if (lessonData.videoType !== 'upload') {
      videoPath = null;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        ...lessonData,
        videoFile: videoPath,
        content: lessonData.description || ''
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
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
    const { courseId, chapterId, lessonId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOneAndDelete({ 
      _id: lessonId, 
      chapter: chapterId, 
      course: courseId 
    });
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (lesson.videoFile) {
      try {
        const filePath = path.join(process.cwd(), 'public', lesson.videoFile);
        await fs.unlink(filePath);
      } catch (error) {
        console.log('Video file not found or already deleted');
      }
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}