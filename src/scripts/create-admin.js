import connectDB from '../lib/database.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    await connectDB();
    console.log('Connected to database');

    const adminData = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true
    };

    const existingAdmin = await User.findOne({
      $or: [
        { username: adminData.username },
        { email: adminData.email },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      return;
    }

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin account created successfully!');
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('\n⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
  } finally {
    process.exit(0);
  }
}

createAdmin();
