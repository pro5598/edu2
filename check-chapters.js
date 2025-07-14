const  connectDB  = require('./src/lib/database');
const Course = require('./src/models/Course');
const Chapter = require('./src/models/Chapter');
const Lesson = require('./src/models/Lesson');

async function checkCourseChapters() {
  try {
    await connectDB();
    console.log('Connected to database successfully!');
    
    const courses = await Course.find({}).select('_id title chapters lessons');
    console.log(`\nFound ${courses.length} courses in database:\n`);
    
    for (const course of courses) {
      console.log(`Course: ${course.title}`);
      console.log(`ID: ${course._id}`);
      console.log(`Chapters array length: ${course.chapters ? course.chapters.length : 'undefined'}`);
      console.log(`Lessons array length: ${course.lessons ? course.lessons.length : 'undefined'}`);
      
      if (course.chapters && course.chapters.length > 0) {
        console.log('Chapter IDs:', course.chapters);
        
        for (let i = 0; i < course.chapters.length; i++) {
          const chapter = await Chapter.findById(course.chapters[i]).populate('lessons');
          if (chapter) {
            console.log(`  Chapter ${i + 1}: ${chapter.title}`);
            console.log(`  Chapter lessons: ${chapter.lessons ? chapter.lessons.length : 0}`);
            if (chapter.lessons && chapter.lessons.length > 0) {
              chapter.lessons.forEach((lesson, idx) => {
                console.log(`    Lesson ${idx + 1}: ${lesson.title}`);
              });
            }
          } else {
            console.log(`  Chapter ${i + 1}: Not found in database`);
          }
        }
      }
      
      if (course.lessons && course.lessons.length > 0) {
        console.log('Direct lessons on course:', course.lessons.length);
        for (let i = 0; i < course.lessons.length; i++) {
          const lesson = await Lesson.findById(course.lessons[i]);
          if (lesson) {
            console.log(`  Direct Lesson ${i + 1}: ${lesson.title}`);
          }
        }
      }
      
      console.log('---\n');
    }
    
    console.log('\nChecking all chapters in database:');
    const allChapters = await Chapter.find({}).populate('lessons');
    console.log(`Total chapters: ${allChapters.length}`);
    
    allChapters.forEach((chapter, idx) => {
      console.log(`Chapter ${idx + 1}: ${chapter.title} (${chapter.lessons ? chapter.lessons.length : 0} lessons)`);
    });
    
    console.log('\nChecking all lessons in database:');
    const allLessons = await Lesson.find({});
    console.log(`Total lessons: ${allLessons.length}`);
    
    allLessons.forEach((lesson, idx) => {
      console.log(`Lesson ${idx + 1}: ${lesson.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkCourseChapters();
