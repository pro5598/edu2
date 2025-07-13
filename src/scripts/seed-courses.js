import connectDB from '../lib/database.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

async function seedCourses() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log(`Database already has ${existingCourses} courses. Skipping seed.`);
      return;
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

    const sampleCourses = [
      {
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
      },
      {
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
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn modern UI/UX design principles and create stunning user interfaces.',
        instructor: instructor._id,
        category: 'design',
        level: 'beginner',
        price: 59.99,
        originalPrice: 99.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        duration: 30,
        requirements: ['Design software (Figma/Adobe XD)', 'Creative mindset'],
        learningObjectives: ['Design principles', 'User research', 'Prototyping'],
        isPublished: true,
        isActive: true,
        enrollmentCount: 156,
        averageRating: 4.9,
        totalReviews: 43,
        tags: ['ui design', 'ux design', 'figma', 'prototyping']
      },
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Complete guide to digital marketing including SEO, social media, and PPC.',
        instructor: instructor._id,
        category: 'marketing',
        level: 'beginner',
        price: 49.99,
        originalPrice: 89.99,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        duration: 25,
        requirements: ['Basic computer skills', 'Interest in marketing'],
        learningObjectives: ['SEO optimization', 'Social media marketing', 'PPC campaigns'],
        isPublished: true,
        isActive: true,
        enrollmentCount: 98,
        averageRating: 4.4,
        totalReviews: 32,
        tags: ['digital marketing', 'seo', 'social media', 'ppc']
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into advanced JavaScript concepts and modern ES6+ features.',
        instructor: instructor._id,
        category: 'programming',
        level: 'advanced',
        price: 99.99,
        originalPrice: 149.99,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
        duration: 40,
        requirements: ['Solid JavaScript fundamentals', 'Experience with ES6'],
        learningObjectives: ['Closures and scope', 'Async programming', 'Design patterns'],
        isPublished: false,
        isActive: true,
        enrollmentCount: 67,
        averageRating: 4.7,
        totalReviews: 23,
        tags: ['javascript', 'es6', 'async', 'closures']
      }
    ];

    await Course.insertMany(sampleCourses);
    console.log(`Successfully seeded ${sampleCourses.length} courses`);
    
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    process.exit(0);
  }
}

seedCourses();