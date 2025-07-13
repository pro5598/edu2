import { sequelize, User, Course, Lesson, Enrollment, Review, Cart, Wishlist } from '../models/index.js';

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('Database models synced successfully.');

    console.log('Creating default admin user...');
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@edu.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      console.log('Default admin user created (username: admin, password: admin123)');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Creating sample instructor...');
    const instructorExists = await User.findOne({ where: { username: 'instructor1' } });
    
    if (!instructorExists) {
      const instructor = await User.create({
        username: 'instructor1',
        email: 'instructor@edu.com',
        password: 'instructor123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'instructor',
        bio: 'Experienced web developer and instructor with 10+ years in the industry.'
      });

      console.log('Creating sample courses...');
      await Course.bulkCreate([
        {
          title: 'Complete Web Development Bootcamp',
          description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, and more.',
          category: 'Web Development',
          level: 'beginner',
          price: 89.99,
          originalPrice: 199.99,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          duration: '65 hours',
          totalLessons: 120,
          requirements: ['Basic computer skills', 'No programming experience required'],
          objectives: ['Build responsive websites', 'Learn modern JavaScript', 'Master React framework'],
          instructorId: instructor.id,
          isPublished: true
        },
        {
          title: 'Python for Data Science',
          description: 'Master Python for data analysis, visualization, and machine learning.',
          category: 'Data Science',
          level: 'intermediate',
          price: 79.99,
          originalPrice: 149.99,
          thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
          duration: '45 hours',
          totalLessons: 85,
          requirements: ['Basic Python knowledge', 'Mathematics fundamentals'],
          objectives: ['Data analysis with Pandas', 'Data visualization', 'Machine learning basics'],
          instructorId: instructor.id,
          isPublished: true
        },
        {
          title: 'UI/UX Design Masterclass',
          description: 'Learn modern UI/UX design principles and create stunning user interfaces.',
          category: 'Design',
          level: 'beginner',
          price: 0,
          originalPrice: 0,
          thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
          duration: '30 hours',
          totalLessons: 60,
          requirements: ['Design software (Figma/Adobe XD)', 'Creative mindset'],
          objectives: ['Design principles', 'User research', 'Prototyping'],
          instructorId: instructor.id,
          isPublished: true
        }
      ]);
      
      console.log('Sample courses created.');
    } else {
      console.log('Sample data already exists.');
    }

    console.log('Creating sample student...');
    const studentExists = await User.findOne({ where: { username: 'student1' } });
    
    if (!studentExists) {
      await User.create({
        username: 'student1',
        email: 'student@edu.com',
        password: 'student123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'student'
      });
      console.log('Sample student created (username: student1, password: student123)');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

export default initializeDatabase;

if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}