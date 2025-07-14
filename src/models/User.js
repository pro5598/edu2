import { mongoose } from '../lib/database.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  expertise: [{
    type: String
  }],
  experience: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  activatedAt: {
    type: Date
  },
  activatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post('save', async function(doc) {
  if (doc.role === 'instructor' && !doc.activatedAt) {
    console.log(`New instructor registered: ${doc.email}`);
  }
});

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return await this.save();
};

userSchema.methods.activate = async function(activatedBy) {
  this.isActive = true;
  this.activatedAt = new Date();
  this.activatedBy = activatedBy;
  return await this.save();
};

userSchema.methods.deactivate = async function() {
  this.isActive = false;
  return await this.save();
};

userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
