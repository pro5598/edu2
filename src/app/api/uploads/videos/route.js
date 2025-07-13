import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'videos');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 500 * 1024 * 1024
  }
});

const uploadMiddleware = promisify(upload.single('video'));

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .videoBitrate('1000k')
      .audioBitrate('128k')
      .size('1280x720')
      .autopad()
      .on('end', () => {
        fs.unlinkSync(inputPath);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
  });
}

function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video');

    if (!file) {
      return NextResponse.json({ error: 'No video file received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalFilename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const compressedFilename = `compressed-${originalFilename}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    const originalPath = path.join(uploadDir, originalFilename);
    const compressedPath = path.join(uploadDir, compressedFilename);

    await fs.promises.writeFile(originalPath, buffer);

    try {
      const duration = await getVideoDuration(originalPath);
      await compressVideo(originalPath, compressedPath);
      
      const videoUrl = `/uploads/videos/${compressedFilename}`;
      const stats = await fs.promises.stat(compressedPath);
      
      return NextResponse.json({
        success: true,
        videoUrl,
        filename: compressedFilename,
        duration: Math.round(duration),
        size: stats.size
      });
    } catch (compressionError) {
      console.error('Video compression failed:', compressionError);
      const videoUrl = `/uploads/videos/${originalFilename}`;
      const stats = await fs.promises.stat(originalPath);
      
      return NextResponse.json({
        success: true,
        videoUrl,
        filename: originalFilename,
        duration: 0,
        size: stats.size,
        compressed: false
      });
    }
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}