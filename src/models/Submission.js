import { mongoose } from '../lib/database.js';

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionText: {
    type: String,
    maxlength: 10000
  },
  submissionFiles: [{
    fileName: {
      type: String,
      required: true
    },
    originalName: {
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
  submissionNotes: {
    type: String,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    maxlength: 2000
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
    enum: ['submitted', 'graded', 'returned', 'resubmitted'],
    default: 'submitted'
  },
  attempt: {
    type: Number,
    default: 1,
    min: 1
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// Indexes for better query performance
submissionSchema.index({ assignment: 1 });
submissionSchema.index({ student: 1 });
submissionSchema.index({ submittedAt: -1 });
submissionSchema.index({ isGraded: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true }); // One submission per student per assignment

// Virtual for calculating days late
submissionSchema.virtual('daysLate').get(function() {
  if (!this.isLate) return 0;
  
  return this.populated('assignment') ? 
    Math.ceil((this.submittedAt - this.assignment.dueDate) / (1000 * 60 * 60 * 24)) : 0;
});

// Pre-save middleware to check if submission is late
submissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);
    
    if (assignment && this.submittedAt > assignment.dueDate) {
      this.isLate = true;
    }
  }
  
  next();
});

// Post-save middleware to update assignment submission count
submissionSchema.post('save', async function(doc) {
  if (doc.isNew) {
    const Assignment = mongoose.model('Assignment');
    await Assignment.findByIdAndUpdate(
      doc.assignment,
      { $inc: { submissionCount: 1 } }
    );
  }
});

// Method to grade submission
submissionSchema.methods.grade = async function(score, feedback, gradedBy) {
  this.score = score;
  this.feedback = feedback;
  this.gradedBy = gradedBy;
  this.gradedAt = new Date();
  this.isGraded = true;
  this.status = 'graded';
  
  await this.save();
  
  // Update assignment average score
  const Assignment = mongoose.model('Assignment');
  const assignment = await Assignment.findById(this.assignment);
  if (assignment) {
    await assignment.updateAverageScore();
  }
  
  return this;
};

// Method to calculate final score with late penalty
submissionSchema.methods.calculateFinalScore = async function() {
  if (!this.isGraded) return null;
  
  let finalScore = this.score;
  
  if (this.isLate) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);
    
    if (assignment && assignment.latePenalty > 0) {
      const penalty = (assignment.latePenalty / 100) * this.score;
      finalScore = Math.max(0, this.score - penalty);
    }
  }
  
  return Math.round(finalScore * 10) / 10;
};

const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

export default Submission;