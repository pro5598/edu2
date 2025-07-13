import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'alert', 'promotion', 'payment', 'enrollment', 'review', 'assignment', 'submission'],
    default: 'info'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'scheduled'],
    default: 'sent'
  },
  scheduledDate: {
    type: Date
  },
  sentDate: {
    type: Date
  },
  recipients: {
    type: Number,
    default: 0
  },
  openRate: {
    type: Number,
    default: 0
  },
  metadata: {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    commissionAmount: {
      type: Number
    },
    totalAmount: {
      type: Number
    }
  }
}, {
  timestamps: true
});

notificationSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentDate = new Date();
  return this.save();
};

notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsUnread = function() {
  this.read = false;
  this.readAt = null;
  return this.save();
};

notificationSchema.statics.createPaymentNotification = async function(paymentData) {
  const notification = new this({
    title: 'New Course Purchase - Commission Earned',
    message: `A student has purchased "${paymentData.courseName}" from instructor ${paymentData.instructorName}. Your commission: $${paymentData.commissionAmount.toFixed(2)} from total payment of $${paymentData.totalAmount.toFixed(2)}.`,
    type: 'payment',
    recipient: paymentData.adminId,
    status: 'sent',
    sentDate: new Date(),
    recipients: 1,
    metadata: {
      paymentId: paymentData.paymentId,
      courseId: paymentData.courseId,
      studentId: paymentData.studentId,
      instructorId: paymentData.instructorId,
      commissionAmount: paymentData.commissionAmount,
      totalAmount: paymentData.totalAmount
    }
  });
  
  return await notification.save();
};

notificationSchema.statics.createEnrollmentNotification = async function(enrollmentData) {
  const notification = new this({
    title: 'New Student Enrollment',
    message: `${enrollmentData.studentName} enrolled in your ${enrollmentData.courseName} course`,
    type: 'enrollment',
    recipient: enrollmentData.instructorId,
    status: 'sent',
    sentDate: new Date(),
    recipients: 1,
    metadata: {
      courseId: enrollmentData.courseId,
      studentId: enrollmentData.studentId,
      instructorId: enrollmentData.instructorId
    }
  });
  
  return await notification.save();
};

notificationSchema.statics.createReviewNotification = async function(reviewData) {
  const notification = new this({
    title: 'New Course Review',
    message: `${reviewData.studentName} left a ${reviewData.rating}-star review for ${reviewData.courseName}`,
    type: 'review',
    recipient: reviewData.instructorId,
    status: 'sent',
    sentDate: new Date(),
    recipients: 1,
    metadata: {
      courseId: reviewData.courseId,
      studentId: reviewData.studentId,
      instructorId: reviewData.instructorId
    }
  });
  
  return await notification.save();
};

notificationSchema.statics.createSubmissionNotification = async function(submissionData) {
  const notification = new this({
    title: 'Assignment Submitted',
    message: `${submissionData.studentName} submitted the ${submissionData.assignmentTitle} assignment`,
    type: 'submission',
    recipient: submissionData.instructorId,
    status: 'sent',
    sentDate: new Date(),
    recipients: 1,
    metadata: {
      courseId: submissionData.courseId,
      studentId: submissionData.studentId,
      instructorId: submissionData.instructorId
    }
  });
  
  return await notification.save();
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;