import connectDB from '../lib/database.js';
import { Course, User, Lesson, Chapter } from '../models/index.js';

async function seedCompleteData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log(`Database already has ${existingCourses} courses. Clearing existing data...`);
      await Course.deleteMany({});
      await Lesson.deleteMany({});
      await Chapter.deleteMany({});
    }

    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        username: 'instructor1',
        email: 'instructor@edu.com',
        password: 'instructor123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'instructor',
        bio: 'Experienced web developer and instructor with 10+ years in the industry.',
        expertise: ['Web Development', 'JavaScript', 'React'],
        isActive: true
      });
      console.log('Created sample instructor');
    }

    const course1 = await Course.create({
      title: 'Complete Web Development Bootcamp',
      description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, and more.',
      instructor: instructor._id,
      category: 'programming',
      level: 'beginner',
      price: 89.99,
      originalPrice: 199.99,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      duration: 65,
      requirements: ['Basic computer skills', 'No programming experience required'],
      learningObjectives: ['Build responsive websites', 'Learn modern JavaScript', 'Master React framework'],
      isPublished: true,
      isActive: true,
      enrollmentCount: 245,
      averageRating: 4.8,
      totalReviews: 89,
      tags: ['web development', 'javascript', 'react', 'html', 'css']
    });

    const chapter1 = await Chapter.create({
      title: 'HTML Fundamentals',
      description: 'Learn the basics of HTML',
      course: course1._id,
      order: 1,
      isPublished: true
    });

    const chapter2 = await Chapter.create({
      title: 'CSS Styling',
      description: 'Master CSS for beautiful designs',
      course: course1._id,
      order: 2,
      isPublished: true
    });

    await Lesson.create({
      title: 'Introduction to HTML',
      description: 'Learn what HTML is and how to use it',
      content: 'This lesson covers the fundamentals of HTML including basic structure, tags, and elements.',
      course: course1._id,
      chapter: chapter1._id,
      order: 1,
      duration: 15,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      videoType: 'youtube',
      isPublished: true,
      isFree: true
    });

    await Lesson.create({
      title: 'HTML Tags and Elements',
      description: 'Understanding HTML tags and elements',
      content: 'Deep dive into HTML tags, attributes, and how to structure web content properly.',
      course: course1._id,
      chapter: chapter1._id,
      order: 2,
      duration: 20,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=salY_Sm6mv4',
      videoType: 'youtube',
      isPublished: true,
      isFree: false
    });

    await Lesson.create({
      title: 'CSS Basics',
      description: 'Introduction to CSS styling',
      content: 'Learn the fundamentals of CSS including selectors, properties, and basic styling techniques.',
      course: course1._id,
      chapter: chapter2._id,
      order: 1,
      duration: 18,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
      videoType: 'youtube',
      isPublished: true,
      isFree: false
    });

    await Lesson.create({
      title: 'CSS Flexbox',
      description: 'Master CSS Flexbox for layouts',
      content: 'Complete guide to CSS Flexbox including flex containers, flex items, and responsive layouts.',
      course: course1._id,
      chapter: chapter2._id,
      order: 2,
      duration: 25,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
      videoType: 'youtube',
      isPublished: true,
      isFree: false
    });

    const course2 = await Course.create({
      title: 'Python for Data Science',
      description: 'Master Python for data analysis, visualization, and machine learning.',
      instructor: instructor._id,
      category: 'programming',
      level: 'intermediate',
      price: 79.99,
      originalPrice: 149.99,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
      duration: 45,
      requirements: ['Basic Python knowledge', 'Mathematics fundamentals'],
      learningObjectives: ['Data analysis with Pandas', 'Data visualization', 'Machine learning basics'],
      isPublished: true,
      isActive: true,
      enrollmentCount: 189,
      averageRating: 4.6,
      totalReviews: 67,
      tags: ['python', 'data science', 'machine learning', 'pandas']
    });

    const pythonChapter1 = await Chapter.create({
      title: 'Python Basics',
      description: 'Learn Python fundamentals',
      course: course2._id,
      order: 1,
      isPublished: true
    });

    await Lesson.create({
      title: 'Python Introduction',
      description: 'Getting started with Python',
      content: 'Introduction to Python programming language, its features, and why it is popular for data science.',
      course: course2._id,
      chapter: pythonChapter1._id,
      order: 1,
      duration: 12,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
      videoType: 'youtube',
      isPublished: true,
      isFree: true
    });

    await Lesson.create({
      title: 'Python Variables and Data Types',
      description: 'Understanding Python variables',
      content: 'Learn about Python variables, data types including strings, integers, floats, and booleans.',
      course: course2._id,
      chapter: pythonChapter1._id,
      order: 2,
      duration: 16,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=OH86oLzVzzw',
      videoType: 'youtube',
      isPublished: true,
      isFree: false
    });

    console.log('Successfully seeded complete course data:');
    console.log('- 2 Courses');
    console.log('- 3 Chapters');
    console.log('- 6 Lessons');
    
  } catch (error) {
    console.error('Error seeding complete data:', error);
  } finally {
    process.exit(0);
  }
}

seedCompleteData();