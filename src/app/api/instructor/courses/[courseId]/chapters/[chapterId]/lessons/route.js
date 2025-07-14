import { NextResponse } from 'next/server';
import { Course, Chapter, Lesson } from '../../../../../../../../models';
import { requireInstructor } from '../../../../../../../../middleware/auth';
import connectDB from '../../../../../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const authResult = await requireInstructor(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { courseId, chapterId } = await params;
    const instructorId = authResult.user._id;

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const lessons = await Lesson.find({ chapter: chapterId })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
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
    const { courseId, chapterId } = await params;
    const instructorId = authResult.user._id;
    
    let lessonData;
    let videoFile = null;
    let videoPath = null;
    
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      lessonData = JSON.parse(formData.get('lessonData'));
      videoFile = formData.get('videoFile');
      
      if (videoFile && lessonData.videoType === 'upload') {
        const path = await import('path');
        const fs = await import('fs/promises');
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
        await fs.mkdir(uploadsDir, { recursive: true });
        
        const fileName = `${Date.now()}-${videoFile.name}`;
        const filePath = path.join(uploadsDir, fileName);
        
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        
        videoPath = `/uploads/videos/${fileName}`;
      }
    } else {
      lessonData = await request.json();
    }

    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const lastLesson = await Lesson.findOne({ chapter: chapterId }).sort({ order: -1 });
    const order = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = new Lesson({
      title: lessonData.title || 'New Lesson',
      description: lessonData.description || '',
      duration: lessonData.duration || 0,
      videoUrl: lessonData.videoUrl || '',
      videoType: lessonData.videoType || 'upload',
      videoFile: videoPath,
      course: courseId,
      chapter: chapterId,
      order,
      content: lessonData.content || lessonData.description || `Content for ${lessonData.title || 'New Lesson'}`,
      timestamps: lessonData.timestamps || [],
      type: lessonData.videoUrl || videoPath ? 'video' : 'text'
    });

    await lesson.save();

    return NextResponse.json({ 
      message: 'Lesson created successfully',
      lesson
    }, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}