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
    enum: ['info', 'success', 'warning', 'alert', 'promotion', 'payment'],
    default: 'info'
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

notificationSchema.statics.createPaymentNotification = async function(paymentData) {
  const notification = new this({
    title: 'New Course Purchase - Commission Earned',
    message: `A student has purchased "${paymentData.courseName}" from instructor ${paymentData.instructorName}. Your commission: $${paymentData.commissionAmount.toFixed(2)} from total payment of $${paymentData.totalAmount.toFixed(2)}.`,
    type: 'payment',
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

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;