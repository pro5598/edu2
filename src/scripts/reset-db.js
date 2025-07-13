import { mongoose } from '../lib/database.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import bcrypt from 'bcryptjs';

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu2');
    console.log('✅ Connected to MongoDB');
    
    // Drop all collections
    console.log('🗑️ Dropping existing collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`   Dropped collection: ${collection.name}`);
    }
    
    console.log('✅ All collections dropped');
    
    // Create indexes (Mongoose will create them automatically when models are used)
    console.log('📊 Creating indexes...');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@edu2.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      profile: {
        bio: 'System Administrator',
        expertise: ['System Administration', 'Education Technology'],
        socialLinks: {
          website: 'https://edu2.com'
        }
      }
    });
    
    await adminUser.save();
    console.log('✅ Admin user created');
    
    // Create instructor user
    console.log('👨‍🏫 Creating instructor user...');
    const instructorUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'instructor@edu2.com',
      password: 'instructor123',
      role: 'instructor',
      isActive: true,
      isEmailVerified: true,
      profile: {
        bio: 'Experienced software developer and educator with 10+ years in the industry.',
        expertise: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          website: 'https://johndoe.dev'
        }
      },
      teaching: {
        totalStudents: 0,
        totalCourses: 0,
        averageRating: 0,
        totalEarnings: 0,
        specializations: ['Web Development', 'JavaScript', 'Full Stack Development']
      }
    });
    
    await instructorUser.save();
    console.log('✅ Instructor user created');
    
    // Create student user
    console.log('👨‍🎓 Creating student user...');
    const studentUser = new User({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'student@edu2.com',
      password: 'student123',
      role: 'student',
      isActive: true,
      isEmailVerified: true,
      profile: {
        bio: 'Passionate learner interested in web development and technology.',
        interests: ['Web Development', 'Programming', 'Design'],
        goals: ['Learn full-stack development', 'Build portfolio projects', 'Get a tech job']
      },
      learning: {
        totalCoursesEnrolled: 0,
        totalCoursesCompleted: 0,
        totalLearningTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        preferredLearningStyle: 'visual',
        skillLevels: {
          'JavaScript': 'beginner',
          'HTML/CSS': 'intermediate'
        }
      }
    });
    
    await studentUser.save();
    console.log('✅ Student user created');
    
    // Create sample courses
    console.log('📚 Creating sample courses...');
    
    const course1 = new Course({
      title: 'Complete JavaScript Fundamentals',
      description: 'Master JavaScript from basics to advanced concepts. Perfect for beginners who want to learn programming.',
      shortDescription: 'Learn JavaScript from scratch with hands-on projects and real-world examples.',
      instructor: instructorUser._id,
      category: 'Programming',
      subcategory: 'JavaScript',
      level: 'beginner',
      language: 'English',
      price: 99.99,
      originalPrice: 149.99,
      currency: 'USD',
      duration: 2400, // 40 hours in minutes
      thumbnail: '/images/courses/javascript-fundamentals.jpg',
      previewVideo: 'https://example.com/preview/js-fundamentals',
      tags: ['JavaScript', 'Programming', 'Web Development', 'Beginner'],
      learningObjectives: [
        'Understand JavaScript syntax and fundamentals',
        'Work with variables, functions, and objects',
        'Handle events and DOM manipulation',
        'Build interactive web applications',
        'Debug and troubleshoot JavaScript code'
      ],
      prerequisites: ['Basic computer skills', 'HTML/CSS knowledge helpful but not required'],
      targetAudience: [
        'Complete beginners to programming',
        'Web developers wanting to learn JavaScript',
        'Students preparing for web development careers'
      ],
      isPublished: true,
      publishedAt: new Date(),
      features: {
        hasQuizzes: true,
        hasAssignments: true,
        hasCertificate: true,
        hasDownloadableResources: true,
        hasLifetimeAccess: true,
        isMobileAccessible: true
      },
      seo: {
        metaTitle: 'Complete JavaScript Fundamentals Course - Learn JS from Scratch',
        metaDescription: 'Master JavaScript programming with our comprehensive course. Perfect for beginners with hands-on projects.',
        keywords: ['JavaScript course', 'learn JavaScript', 'JS tutorial', 'programming course']
      }
    });
    
    await course1.save();
    
    const course2 = new Course({
      title: 'React.js Complete Guide',
      description: 'Build modern web applications with React.js. Learn hooks, state management, and best practices.',
      shortDescription: 'Master React.js with practical projects and modern development techniques.',
      instructor: instructorUser._id,
      category: 'Programming',
      subcategory: 'React',
      level: 'intermediate',
      language: 'English',
      price: 129.99,
      originalPrice: 199.99,
      currency: 'USD',
      duration: 3000, // 50 hours in minutes
      thumbnail: '/images/courses/react-complete-guide.jpg',
      previewVideo: 'https://example.com/preview/react-guide',
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
      learningObjectives: [
        'Build dynamic React applications',
        'Master React hooks and state management',
        'Implement routing and navigation',
        'Connect to APIs and handle data',
        'Deploy React applications'
      ],
      prerequisites: ['JavaScript fundamentals', 'HTML/CSS knowledge', 'Basic programming concepts'],
      targetAudience: [
        'JavaScript developers wanting to learn React',
        'Frontend developers looking to advance skills',
        'Web developers building modern applications'
      ],
      isPublished: true,
      publishedAt: new Date(),
      features: {
        hasQuizzes: true,
        hasAssignments: true,
        hasCertificate: true,
        hasDownloadableResources: true,
        hasLifetimeAccess: true,
        isMobileAccessible: true
      },
      seo: {
        metaTitle: 'React.js Complete Guide - Build Modern Web Apps',
        metaDescription: 'Learn React.js from basics to advanced with hands-on projects and real-world examples.',
        keywords: ['React course', 'React.js tutorial', 'frontend development', 'JavaScript framework']
      }
    });
    
    await course2.save();
    
    const course3 = new Course({
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn server-side development.',
      shortDescription: 'Master backend development with Node.js and build RESTful APIs.',
      instructor: instructorUser._id,
      category: 'Programming',
      subcategory: 'Node.js',
      level: 'intermediate',
      language: 'English',
      price: 119.99,
      originalPrice: 179.99,
      currency: 'USD',
      duration: 2700, // 45 hours in minutes
      thumbnail: '/images/courses/nodejs-backend.jpg',
      previewVideo: 'https://example.com/preview/nodejs-backend',
      tags: ['Node.js', 'Backend', 'Express', 'MongoDB', 'API'],
      learningObjectives: [
        'Build RESTful APIs with Node.js and Express',
        'Work with databases and data modeling',
        'Implement authentication and authorization',
        'Handle file uploads and processing',
        'Deploy and scale Node.js applications'
      ],
      prerequisites: ['JavaScript fundamentals', 'Basic understanding of web development', 'Command line basics'],
      targetAudience: [
        'Frontend developers wanting to learn backend',
        'Full-stack developers expanding skills',
        'Developers building web applications'
      ],
      isPublished: true,
      publishedAt: new Date(),
      features: {
        hasQuizzes: true,
        hasAssignments: true,
        hasCertificate: true,
        hasDownloadableResources: true,
        hasLifetimeAccess: true,
        isMobileAccessible: true
      },
      seo: {
        metaTitle: 'Node.js Backend Development Course - Build Scalable APIs',
        metaDescription: 'Learn Node.js backend development with Express and MongoDB. Build RESTful APIs and scalable applications.',
        keywords: ['Node.js course', 'backend development', 'Express.js', 'MongoDB', 'API development']
      }
    });
    
    await course3.save();
    
    console.log('✅ Sample courses created');
    
    // Create sample lessons for the first course
    console.log('📖 Creating sample lessons...');
    
    const lesson1 = new Lesson({
      title: 'Introduction to JavaScript',
      description: 'Get started with JavaScript programming language and understand its role in web development.',
      content: 'Welcome to JavaScript! In this lesson, we\'ll explore what JavaScript is and why it\'s essential for modern web development.',
      course: course1._id,
      order: 1,
      type: 'video',
      duration: 15,
      videoUrl: 'https://example.com/videos/js-intro',
      videoThumbnail: '/images/lessons/js-intro-thumb.jpg',
      isPublished: true,
      publishedAt: new Date(),
      isFree: true,
      learningObjectives: [
        'Understand what JavaScript is',
        'Learn about JavaScript\'s role in web development',
        'Set up development environment'
      ],
      estimatedTime: 15,
      difficulty: 'beginner'
    });
    
    await lesson1.save();
    
    const lesson2 = new Lesson({
      title: 'Variables and Data Types',
      description: 'Learn about JavaScript variables, data types, and how to work with different kinds of data.',
      content: 'In this lesson, we\'ll cover JavaScript variables and the different data types available.',
      course: course1._id,
      order: 2,
      type: 'video',
      duration: 25,
      videoUrl: 'https://example.com/videos/js-variables',
      videoThumbnail: '/images/lessons/js-variables-thumb.jpg',
      isPublished: true,
      publishedAt: new Date(),
      isFree: false,
      learningObjectives: [
        'Declare and use variables',
        'Understand different data types',
        'Work with strings, numbers, and booleans'
      ],
      estimatedTime: 25,
      difficulty: 'beginner',
      quiz: {
        questions: [
          {
            question: 'Which keyword is used to declare a variable in modern JavaScript?',
            type: 'multiple-choice',
            options: ['var', 'let', 'const', 'Both let and const'],
            correctAnswer: 3,
            explanation: 'Both let and const are used in modern JavaScript, with const for constants and let for variables.'
          }
        ],
        passingScore: 70,
        timeLimit: 300
      }
    });
    
    await lesson2.save();
    
    console.log('✅ Sample lessons created');
    
    // Create sample enrollment
    console.log('📝 Creating sample enrollment...');
    
    const enrollment = new Enrollment({
      student: studentUser._id,
      course: course1._id,
      enrollmentDate: new Date(),
      status: 'active',
      progress: 25,
      completedLessons: [lesson1._id],
      totalTimeSpent: 15,
      lastAccessedAt: new Date(),
      paymentStatus: 'completed',
      paymentAmount: course1.price,
      paymentDate: new Date(),
      paymentMethod: 'credit_card',
      isActive: true
    });
    
    await enrollment.save();
    console.log('✅ Sample enrollment created');
    
    // Create sample review
    console.log('⭐ Creating sample review...');
    
    const review = new Review({
      student: studentUser._id,
      course: course1._id,
      rating: 5,
      comment: 'Excellent course! The instructor explains everything clearly and the examples are very helpful.',
      pros: ['Clear explanations', 'Good examples', 'Well structured'],
      cons: ['Could use more advanced topics'],
      wouldRecommend: true,
      difficultyRating: 3,
      valueForMoney: 5,
      instructorRating: 5,
      contentQuality: 5,
      isVerifiedPurchase: true,
      completionPercentage: 25,
      timeSpentOnCourse: 15,
      isPublic: true,
      isApproved: true,
      approvedAt: new Date(),
      language: 'English',
      isActive: true
    });
    
    await review.save();
    console.log('✅ Sample review created');
    
    // Create sample cart
    console.log('🛒 Creating sample cart...');
    
    const cart = new Cart({
      user: studentUser._id,
      items: [
        {
          course: course2._id,
          price: course2.price,
          originalPrice: course2.originalPrice,
          discountApplied: Math.round(((course2.originalPrice - course2.price) / course2.originalPrice) * 100),
          addedAt: new Date()
        }
      ],
      currency: 'USD',
      isActive: true
    });
    
    await cart.save();
    console.log('✅ Sample cart created');
    
    // Create sample wishlist
    console.log('❤️ Creating sample wishlist...');
    
    const wishlist = new Wishlist({
      user: studentUser._id,
      items: [
        {
          course: course3._id,
          addedAt: new Date(),
          priority: 8,
          notes: 'Want to learn backend development after completing React course',
          priceWhenAdded: course3.price,
          notifyOnDiscount: true,
          discountThreshold: 15,
          tags: ['backend', 'priority'],
          category: 'Programming',
          source: 'browse'
        }
      ],
      name: 'My Learning Wishlist',
      description: 'Courses I want to take to become a full-stack developer',
      isPublic: false,
      privacy: 'private',
      notifications: {
        priceDrops: true,
        recommendations: true,
        reminders: true
      },
      isActive: true
    });
    
    await wishlist.save();
    console.log('✅ Sample wishlist created');
    
    // Update course statistics
    console.log('📊 Updating course statistics...');
    
    await course1.updateRating();
    await course1.incrementEnrollment();
    await course1.save();
    
    // Update instructor statistics
    instructorUser.teaching.totalStudents = 1;
    instructorUser.teaching.totalCourses = 3;
    instructorUser.teaching.averageRating = 5;
    await instructorUser.save();
    
    console.log('✅ Statistics updated');
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   👤 Users created: 3 (1 admin, 1 instructor, 1 student)');
    console.log('   📚 Courses created: 3');
    console.log('   📖 Lessons created: 2');
    console.log('   📝 Enrollments created: 1');
    console.log('   ⭐ Reviews created: 1');
    console.log('   🛒 Carts created: 1');
    console.log('   ❤️ Wishlists created: 1');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@edu2.com / admin123');
    console.log('   Instructor: instructor@edu2.com / instructor123');
    console.log('   Student: student@edu2.com / student123');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the reset function
resetDatabase();