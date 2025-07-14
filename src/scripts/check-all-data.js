import connectDB from '../lib/database.js';
import { Course, Chapter, Lesson, User, Enrollment } from '../models/index.js';

async function checkAllData() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    console.log('=== CHECKING ALL DATA ===\n');

    const courses = await Course.find({})
      .populate('instructor', 'firstName lastName username')
      .lean();
    
    console.log(`📚 Total Courses: ${courses.length}\n`);
    
    for (const course of courses) {
      console.log(`🎓 Course: ${course.title}`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Instructor: ${course.instructor?.firstName} ${course.instructor?.lastName}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log(`   Created: ${course.createdAt}`);
      
      const chapters = await Chapter.find({ course: course._id })
        .sort({ order: 1 })
        .lean();
      
      console.log(`   📖 Chapters: ${chapters.length}`);
      
      for (const chapter of chapters) {
        console.log(`     Chapter: ${chapter.title} (ID: ${chapter._id})`);
        
        const chapterLessons = await Lesson.find({ chapter: chapter._id })
          .sort({ order: 1 })
          .lean();
        
        console.log(`       📝 Lessons in chapter: ${chapterLessons.length}`);
        
        for (const lesson of chapterLessons) {
          console.log(`         - ${lesson.title}`);
          console.log(`           ID: ${lesson._id}`);
          console.log(`           Published: ${lesson.isPublished}`);
          console.log(`           Type: ${lesson.type}`);
          console.log(`           Video URL: ${lesson.videoUrl || 'None'}`);
          console.log(`           Duration: ${lesson.duration || 0}`);
          console.log(`           Timestamps: ${lesson.timestamps?.length || 0}`);
        }
      }
      
      const directLessons = await Lesson.find({ 
        course: course._id,
        $or: [
          { chapter: { $exists: false } },
          { chapter: null }
        ]
      })
        .sort({ order: 1 })
        .lean();
      
      console.log(`   📝 Direct Lessons (no chapter): ${directLessons.length}`);
      
      for (const lesson of directLessons) {
        console.log(`     - ${lesson.title}`);
        console.log(`       ID: ${lesson._id}`);
        console.log(`       Published: ${lesson.isPublished}`);
        console.log(`       Type: ${lesson.type}`);
        console.log(`       Video URL: ${lesson.videoUrl || 'None'}`);
        console.log(`       Duration: ${lesson.duration || 0}`);
        console.log(`       Timestamps: ${lesson.timestamps?.length || 0}`);
      }
      
      const allCourseLessons = await Lesson.find({ course: course._id }).lean();
      const publishedLessons = await Lesson.find({ course: course._id, isPublished: true }).lean();
      
      console.log(`   📊 Total lessons: ${allCourseLessons.length}`);
      console.log(`   ✅ Published lessons: ${publishedLessons.length}`);
      console.log(`   ❌ Unpublished lessons: ${allCourseLessons.length - publishedLessons.length}`);
      
      console.log('\n' + '='.repeat(50) + '\n');
    }
    
    console.log('=== API SIMULATION ===\n');
    
    for (const course of courses) {
      console.log(`🔍 Simulating API call for course: ${course.title}`);
      
      const chapters = await Chapter.find({ course: course._id })
        .sort({ order: 1 })
        .lean();
      
      const chaptersWithLessons = await Promise.all(
        chapters.map(async (chapter) => {
          const lessons = await Lesson.find({ 
            chapter: chapter._id,
            isPublished: true 
          })
            .sort({ order: 1 })
            .lean();
          
          return {
            id: chapter._id,
            title: chapter.title,
            description: chapter.description,
            lessons: lessons.map(lesson => ({
              id: lesson._id,
              title: lesson.title,
              description: lesson.description,
              duration: lesson.duration || 0,
              videoUrl: lesson.videoUrl,
              isYouTube: lesson.videoType === 'youtube',
              type: lesson.type
            }))
          };
        })
      );
      
      const directLessons = await Lesson.find({ 
        course: course._id,
        isPublished: true,
        $or: [
          { chapter: { $exists: false } },
          { chapter: null }
        ]
      })
        .sort({ order: 1 })
        .lean();
      
      if (directLessons.length > 0) {
        chaptersWithLessons.push({
          id: 'default',
          title: 'Course Content',
          description: 'Main course lessons',
          lessons: directLessons.map(lesson => ({
            id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration || 0,
            videoUrl: lesson.videoUrl,
            isYouTube: lesson.videoType === 'youtube',
            type: lesson.type
          }))
        });
      }
      
      console.log(`   📋 API Response chapters: ${chaptersWithLessons.length}`);
      
      let totalLessonsInResponse = 0;
      chaptersWithLessons.forEach(chapter => {
        console.log(`     Chapter: ${chapter.title} - ${chapter.lessons.length} lessons`);
        totalLessonsInResponse += chapter.lessons.length;
      });
      
      console.log(`   📊 Total lessons in API response: ${totalLessonsInResponse}`);
      
      const shouldShowContent = chaptersWithLessons.length > 0 && totalLessonsInResponse > 0;
      console.log(`   🎯 Should show content: ${shouldShowContent ? 'YES' : 'NO'}`);
      
      if (!shouldShowContent) {
        console.log(`   ⚠️  ISSUE: This course will show "Course Content Coming Soon"`);
        console.log(`      Reason: No chapters with published lessons found`);
      }
      
      console.log('\n' + '-'.repeat(30) + '\n');
    }
    
    console.log('=== SUMMARY ===\n');
    
    const totalLessons = await Lesson.countDocuments();
    const publishedLessons = await Lesson.countDocuments({ isPublished: true });
    const lessonsWithChapters = await Lesson.countDocuments({ chapter: { $exists: true, $ne: null } });
    const lessonsWithoutChapters = await Lesson.countDocuments({ $or: [{ chapter: { $exists: false } }, { chapter: null }] });
    
    console.log(`📊 Database Statistics:`);
    console.log(`   Total Courses: ${courses.length}`);
    console.log(`   Total Lessons: ${totalLessons}`);
    console.log(`   Published Lessons: ${publishedLessons}`);
    console.log(`   Unpublished Lessons: ${totalLessons - publishedLessons}`);
    console.log(`   Lessons with Chapters: ${lessonsWithChapters}`);
    console.log(`   Lessons without Chapters: ${lessonsWithoutChapters}`);
    
    console.log('\n✅ Check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    process.exit(0);
  }
}

checkAllData();