import { mongoose } from '../lib/database.js';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return Number.isInteger(v) && v >= 1 && v <= 5;
      },
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  difficultyRating: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return v === null || v === undefined || (Number.isInteger(v) && v >= 1 && v <= 5);
      },
      message: 'Difficulty rating must be an integer between 1 and 5'
    }
  },
  valueForMoney: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return v === null || v === undefined || (Number.isInteger(v) && v >= 1 && v <= 5);
      },
      message: 'Value for money rating must be an integer between 1 and 5'
    }
  },
  instructorRating: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return v === null || v === undefined || (Number.isInteger(v) && v >= 1 && v <= 5);
      },
      message: 'Instructor rating must be an integer between 1 and 5'
    }
  },
  contentQuality: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return v === null || v === undefined || (Number.isInteger(v) && v >= 1 && v <= 5);
      },
      message: 'Content quality rating must be an integer between 1 and 5'
    }
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timeSpentOnCourse: {
    type: Number,
    min: 0,
    default: 0,
    comment: 'Time spent in minutes'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNotes: {
    type: String,
    maxlength: 500
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  unhelpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vote: {
      type: String,
      enum: ['helpful', 'unhelpful'],
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    isInstructor: {
      type: Boolean,
      default: false
    },
    isOfficial: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  language: {
    type: String,
    default: 'en'
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedReason: {
    type: String,
    maxlength: 200
  },
  lastEditedAt: {
    type: Date
  },
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    previousRating: Number,
    previousComment: String,
    reason: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ student: 1, course: 1 }, { unique: true });
reviewSchema.index({ course: 1 });
reviewSchema.index({ student: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isPublic: 1 });
reviewSchema.index({ isActive: 1 });
reviewSchema.index({ helpfulVotes: -1 });
reviewSchema.index({ wouldRecommend: 1 });
reviewSchema.index({ isVerifiedPurchase: 1 });

reviewSchema.pre('save', function(next) {
  if (this.isModified('comment') || this.isModified('rating')) {
    if (this.createdAt && this.createdAt.getTime() !== new Date().getTime()) {
      this.lastEditedAt = new Date();
      
      if (this.isModified('rating') || this.isModified('comment')) {
        this.editHistory.push({
          editedAt: new Date(),
          previousRating: this.isModified('rating') ? this._original?.rating : undefined,
          previousComment: this.isModified('comment') ? this._original?.comment : undefined,
          reason: 'User edit'
        });
      }
    }
  }
  
  if (this.reportedBy && this.reportedBy.length > 0) {
    this.isReported = true;
  }
  
  next();
});

reviewSchema.methods.addHelpfulVote = async function(userId) {
  const existingVote = this.votedBy.find(
    vote => vote.user.toString() === userId.toString()
  );
  
  if (existingVote) {
    if (existingVote.vote === 'unhelpful') {
      this.unhelpfulVotes -= 1;
      this.helpfulVotes += 1;
      existingVote.vote = 'helpful';
      existingVote.votedAt = new Date();
    }
    return await this.save();
  }
  
  this.votedBy.push({
    user: userId,
    vote: 'helpful',
    votedAt: new Date()
  });
  this.helpfulVotes += 1;
  
  return await this.save();
};

reviewSchema.methods.addUnhelpfulVote = async function(userId) {
  const existingVote = this.votedBy.find(
    vote => vote.user.toString() === userId.toString()
  );
  
  if (existingVote) {
    if (existingVote.vote === 'helpful') {
      this.helpfulVotes -= 1;
      this.unhelpfulVotes += 1;
      existingVote.vote = 'unhelpful';
      existingVote.votedAt = new Date();
    }
    return await this.save();
  }
  
  this.votedBy.push({
    user: userId,
    vote: 'unhelpful',
    votedAt: new Date()
  });
  this.unhelpfulVotes += 1;
  
  return await this.save();
};

reviewSchema.methods.removeVote = async function(userId) {
  const voteIndex = this.votedBy.findIndex(
    vote => vote.user.toString() === userId.toString()
  );
  
  if (voteIndex !== -1) {
    const vote = this.votedBy[voteIndex];
    if (vote.vote === 'helpful') {
      this.helpfulVotes -= 1;
    } else {
      this.unhelpfulVotes -= 1;
    }
    this.votedBy.splice(voteIndex, 1);
    return await this.save();
  }
};

reviewSchema.methods.addReply = async function(userId, message, isInstructor = false, isOfficial = false) {
  this.replies.push({
    user: userId,
    message: message,
    isInstructor: isInstructor,
    isOfficial: isOfficial,
    createdAt: new Date()
  });
  
  return await this.save();
};

reviewSchema.methods.approve = async function(approvedBy) {
  this.isApproved = true;
  this.approvedAt = new Date();
  this.approvedBy = approvedBy;
  return await this.save();
};

reviewSchema.methods.reject = async function(reason) {
  this.isApproved = false;
  this.moderationNotes = reason;
  return await this.save();
};

reviewSchema.methods.report = async function(userId, reason, description) {
  const existingReport = this.reportedBy.find(
    report => report.user.toString() === userId.toString()
  );
  
  if (!existingReport) {
    this.reportedBy.push({
      user: userId,
      reason: reason,
      description: description,
      reportedAt: new Date()
    });
    this.isReported = true;
    return await this.save();
  }
};

reviewSchema.methods.flag = async function(reason) {
  this.isFlagged = true;
  this.flaggedReason = reason;
  return await this.save();
};

reviewSchema.methods.unflag = async function() {
  this.isFlagged = false;
  this.flaggedReason = undefined;
  return await this.save();
};

reviewSchema.methods.getHelpfulnessRatio = function() {
  const totalVotes = this.helpfulVotes + this.unhelpfulVotes;
  if (totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / totalVotes) * 100);
};

reviewSchema.methods.canEdit = function(userId, timeLimit = 24) {
  if (this.student.toString() !== userId.toString()) return false;
  
  const timeLimitMs = timeLimit * 60 * 60 * 1000; // Convert hours to milliseconds
  const timeSinceCreation = new Date() - this.createdAt;
  
  return timeSinceCreation <= timeLimitMs;
};

reviewSchema.statics.getAverageRating = async function(courseId) {
  const result = await this.aggregate([
    {
      $match: {
        course: courseId,
        isApproved: true,
        isActive: true,
        isPublic: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const data = result[0];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.ratingDistribution.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  };
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;