import connectDB from './src/lib/database.js';
import { User } from './src/models/index.js';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    console.log('Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`✅ User model working. Found ${userCount} users`);
    
    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();