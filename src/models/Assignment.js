import { mongoose } from '../lib/database.js';

const assignmentSchema = new mongoose.Schema({
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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['assignment', 'quiz', 'project', 'essay'],
    default: 'assignment'
  },
  maxScore: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    default: 100
  },
  dueDate: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    maxlength: 5000
  },
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number
    },
    mimeType: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    comment: 'Percentage penalty for late submissions'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  submissionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes for better query performance
assignmentSchema.index({ course: 1 });
assignmentSchema.index({ instructor: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ isActive: 1 });
assignmentSchema.index({ createdAt: -1 });

// Virtual for checking if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});

// Virtual for days until due
assignmentSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const diffTime = this.dueDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update average score
assignmentSchema.methods.updateAverageScore = async function() {
  const Submission = mongoose.model('Submission');
  const submissions = await Submission.find({ 
    assignment: this._id, 
    isGraded: true 
  });
  
  if (submissions.length > 0) {
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    this.averageScore = Math.round((totalScore / submissions.length) * 10) / 10;
  } else {
    this.averageScore = 0;
  }
  
  return await this.save();
};

// Method to increment submission count
assignmentSchema.methods.incrementSubmissionCount = async function() {
  this.submissionCount += 1;
  return await this.save();
};

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;