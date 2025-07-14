import connectDB from './src/lib/database.js';
import { Course } from './src/models/index.js';

async function checkCourseData() {
  try {
    console.log('🔍 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    console.log('\n📊 Checking courses in database...');
    const courses = await Course.find({}).select('_id title instructor isPublished').lean();
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course._id}`);
      console.log(`   Title: ${course.title}`);
      console.log(`   Instructor: ${course.instructor}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log('');
    });
    
    if (courses.length > 0) {
      const testCourseId = courses[0]._id;
      console.log(`🧪 Testing API fetch for course: ${testCourseId}`);
      
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${testCourseId}`);
        const data = await response.json();
        
        console.log('API Response Status:', response.status);
        console.log('API Response:', JSON.stringify(data, null, 2));
      } catch (apiError) {
        console.log('❌ API fetch failed:', apiError.message);
        console.log('Make sure the development server is running with: bun run dev');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCourseData();