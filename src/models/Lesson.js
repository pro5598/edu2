import { mongoose } from '../lib/database.js';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  content: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment', 'document', 'interactive'],
    default: 'text'
  },
  duration: {
    type: Number,
    min: 0,
    comment: 'Duration in minutes'
  },
  videoUrl: {
    type: String
  },
  videoThumbnail: {
    type: String
  },
  videoFile: {
    type: String
  },
  videoType: {
    type: String,
    enum: ['upload', 'youtube', 'vimeo', 'external'],
    default: 'upload'
  },
  timestamps: [{
    time: {
      type: Number,
      required: true,
      min: 0
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'doc', 'image', 'video', 'audio', 'other'],
      default: 'other'
    },
    size: {
      type: Number,
      min: 0
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  isFree: {
    type: Boolean,
    default: false
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 2000
  },
  transcript: {
    type: String
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],
  quiz: {
    questions: [{
      question: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
        default: 'multiple-choice'
      },
      options: [{
        text: String,
        isCorrect: Boolean
      }],
      correctAnswer: String,
      explanation: String,
      points: {
        type: Number,
        default: 1,
        min: 0
      }
    }],
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    timeLimit: {
      type: Number,
      min: 0,
      comment: 'Time limit in minutes'
    },
    allowRetakes: {
      type: Boolean,
      default: true
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: 1
    }
  },
  assignment: {
    instructions: {
      type: String
    },
    dueDate: {
      type: Date
    },
    maxPoints: {
      type: Number,
      default: 100,
      min: 0
    },
    submissionFormat: {
      type: String,
      enum: ['text', 'file', 'url', 'both'],
      default: 'text'
    },
    allowLateSubmission: {
      type: Boolean,
      default: false
    },
    latePenalty: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  completionCriteria: {
    type: String,
    enum: ['view', 'time-based', 'quiz-pass', 'assignment-submit'],
    default: 'view'
  },
  estimatedTime: {
    type: Number,
    min: 0,
    comment: 'Estimated completion time in minutes'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ course: 1 });
lessonSchema.index({ isPublished: 1 });
lessonSchema.index({ isActive: 1 });
lessonSchema.index({ type: 1 });
lessonSchema.index({ isFree: 1 });
lessonSchema.index({ createdAt: -1 });

lessonSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

lessonSchema.methods.publish = async function() {
  this.isPublished = true;
  this.publishedAt = new Date();
  return await this.save();
};

lessonSchema.methods.unpublish = async function() {
  this.isPublished = false;
  return await this.save();
};

lessonSchema.methods.getNextLesson = async function() {
  return await this.constructor.findOne({
    course: this.course,
    order: { $gt: this.order },
    isPublished: true,
    isActive: true
  }).sort({ order: 1 });
};

lessonSchema.methods.getPreviousLesson = async function() {
  return await this.constructor.findOne({
    course: this.course,
    order: { $lt: this.order },
    isPublished: true,
    isActive: true
  }).sort({ order: -1 });
};

lessonSchema.methods.canAccess = function(userRole, isEnrolled) {
  if (!this.isPublished || !this.isActive) return false;
  if (userRole === 'admin' || userRole === 'instructor') return true;
  if (this.isFree) return true;
  return isEnrolled;
};

lessonSchema.methods.getTotalQuizPoints = function() {
  if (!this.quiz || !this.quiz.questions) return 0;
  return this.quiz.questions.reduce((total, question) => total + (question.points || 1), 0);
};

lessonSchema.statics.getByOrder = function(courseId, order) {
  return this.findOne({
    course: courseId,
    order: order,
    isPublished: true,
    isActive: true
  });
};

lessonSchema.statics.getCourseProgress = async function(courseId, completedLessons) {
  const totalLessons = await this.countDocuments({
    course: courseId,
    isPublished: true,
    isActive: true
  });
  
  const completed = completedLessons.length;
  const progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  
  return {
    totalLessons,
    completedLessons: completed,
    progress
  };
};

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;