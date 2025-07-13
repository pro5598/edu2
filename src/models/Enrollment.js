import { mongoose } from '../lib/database.js';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'suspended', 'pending'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
      comment: 'Time spent in minutes'
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  quizResults: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
      comment: 'Time spent in minutes'
    },
    attempts: {
      type: Number,
      default: 1,
      min: 1
    },
    passed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    answers: [{
      questionIndex: Number,
      selectedAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      timeSpent: Number
    }]
  }],
  assignments: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    submittedAt: {
      type: Date
    },
    submission: {
      type: String
    },
    fileUrl: {
      type: String
    },
    grade: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: {
      type: String
    },
    gradedAt: {
      type: Date
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded', 'late'],
      default: 'pending'
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  totalTimeSpent: {
    type: Number,
    default: 0,
    min: 0,
    comment: 'Total time spent in minutes'
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date
  },
  certificateUrl: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'free'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    min: 0
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'free', 'coupon']
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  couponCode: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000
  },
  reviewDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ completionDate: -1 });
enrollmentSchema.index({ paymentStatus: 1 });
enrollmentSchema.index({ isActive: 1 });

enrollmentSchema.pre('save', function(next) {
  if (this.isModified('progress') && this.progress >= 100 && !this.completionDate) {
    this.completionDate = new Date();
    this.status = 'completed';
  }
  
  this.lastAccessedAt = new Date();
  next();
});

enrollmentSchema.methods.markLessonComplete = async function(lessonId, timeSpent = 0, score = null) {
  const existingCompletion = this.completedLessons.find(
    completion => completion.lesson.toString() === lessonId.toString()
  );
  
  if (!existingCompletion) {
    this.completedLessons.push({
      lesson: lessonId,
      completedAt: new Date(),
      timeSpent: timeSpent,
      score: score
    });
  } else {
    existingCompletion.completedAt = new Date();
    existingCompletion.timeSpent += timeSpent;
    if (score !== null) {
      existingCompletion.score = score;
    }
  }
  
  this.totalTimeSpent += timeSpent;
  await this.updateProgress();
  return await this.save();
};

enrollmentSchema.methods.updateProgress = async function() {
  const Lesson = mongoose.model('Lesson');
  const totalLessons = await Lesson.countDocuments({
    course: this.course,
    isPublished: true,
    isActive: true
  });
  
  if (totalLessons > 0) {
    this.progress = Math.round((this.completedLessons.length / totalLessons) * 100);
  }
};

enrollmentSchema.methods.addQuizResult = async function(lessonId, quizData) {
  const existingResult = this.quizResults.find(
    result => result.lesson.toString() === lessonId.toString()
  );
  
  if (existingResult) {
    existingResult.attempts += 1;
    existingResult.score = quizData.score;
    existingResult.correctAnswers = quizData.correctAnswers;
    existingResult.timeSpent = quizData.timeSpent;
    existingResult.passed = quizData.passed;
    existingResult.completedAt = new Date();
    existingResult.answers = quizData.answers;
  } else {
    this.quizResults.push({
      lesson: lessonId,
      score: quizData.score,
      totalQuestions: quizData.totalQuestions,
      correctAnswers: quizData.correctAnswers,
      timeSpent: quizData.timeSpent,
      passed: quizData.passed,
      answers: quizData.answers
    });
  }
  
  this.totalTimeSpent += quizData.timeSpent;
  return await this.save();
};

enrollmentSchema.methods.submitAssignment = async function(lessonId, submissionData) {
  const existingAssignment = this.assignments.find(
    assignment => assignment.lesson.toString() === lessonId.toString()
  );
  
  if (existingAssignment) {
    existingAssignment.submittedAt = new Date();
    existingAssignment.submission = submissionData.submission;
    existingAssignment.fileUrl = submissionData.fileUrl;
    existingAssignment.status = 'submitted';
    existingAssignment.attempts += 1;
  } else {
    this.assignments.push({
      lesson: lessonId,
      submittedAt: new Date(),
      submission: submissionData.submission,
      fileUrl: submissionData.fileUrl,
      status: 'submitted',
      attempts: 1
    });
  }
  
  return await this.save();
};

enrollmentSchema.methods.gradeAssignment = async function(lessonId, grade, feedback, gradedBy) {
  const assignment = this.assignments.find(
    assignment => assignment.lesson.toString() === lessonId.toString()
  );
  
  if (assignment) {
    assignment.grade = grade;
    assignment.feedback = feedback;
    assignment.gradedAt = new Date();
    assignment.gradedBy = gradedBy;
    assignment.status = 'graded';
    return await this.save();
  }
  
  throw new Error('Assignment not found');
};

enrollmentSchema.methods.isLessonCompleted = function(lessonId) {
  return this.completedLessons.some(
    completion => completion.lesson.toString() === lessonId.toString()
  );
};

enrollmentSchema.methods.getQuizScore = function(lessonId) {
  const result = this.quizResults.find(
    result => result.lesson.toString() === lessonId.toString()
  );
  return result ? result.score : null;
};

enrollmentSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completionDate = new Date();
  this.progress = 100;
  return await this.save();
};

enrollmentSchema.methods.drop = async function() {
  this.status = 'dropped';
  this.isActive = false;
  return await this.save();
};

enrollmentSchema.methods.issueCertificate = async function(certificateUrl) {
  this.certificateIssued = true;
  this.certificateIssuedAt = new Date();
  this.certificateUrl = certificateUrl;
  return await this.save();
};

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;