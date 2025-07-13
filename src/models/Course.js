import { mongoose } from '../lib/database.js';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'design', 'business', 'marketing', 'photography', 'music', 'other'],
    default: 'other'
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  },
  duration: {
    type: Number,
    min: 0,
    comment: 'Duration in minutes'
  },
  thumbnail: {
    type: String
  },
  previewVideo: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  targetAudience: {
    type: String,
    maxlength: 500
  },
  language: {
    type: String,
    default: 'English'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  enrollmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  certificateOffered: {
    type: Boolean,
    default: false
  },
  maxEnrollments: {
    type: Number,
    min: 1
  },
  enrollmentDeadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountValidUntil: {
    type: Date
  }
}, {
  timestamps: true
});

courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

courseSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  next();
});

courseSchema.methods.updateRating = async function(newRating) {
  const totalScore = this.averageRating * this.totalRatings + newRating;
  this.totalRatings += 1;
  this.averageRating = Math.round((totalScore / this.totalRatings) * 10) / 10;
  return await this.save();
};

courseSchema.methods.incrementEnrollment = async function() {
  this.enrollmentCount += 1;
  return await this.save();
};

courseSchema.methods.decrementEnrollment = async function() {
  if (this.enrollmentCount > 0) {
    this.enrollmentCount -= 1;
    return await this.save();
  }
};

courseSchema.methods.publish = async function() {
  this.isPublished = true;
  this.publishedAt = new Date();
  return await this.save();
};

courseSchema.methods.unpublish = async function() {
  this.isPublished = false;
  return await this.save();
};

courseSchema.methods.getDiscountedPrice = function() {
  if (this.discountPercentage > 0 && this.discountValidUntil && this.discountValidUntil > new Date()) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
};

courseSchema.methods.isEnrollmentOpen = function() {
  if (!this.isPublished || !this.isActive) return false;
  if (this.enrollmentDeadline && this.enrollmentDeadline < new Date()) return false;
  if (this.maxEnrollments && this.enrollmentCount >= this.maxEnrollments) return false;
  return true;
};

courseSchema.virtual('lessonsCount', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  count: true
});

courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course'
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;