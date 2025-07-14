import { mongoose } from '../lib/database.js';

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  instructorAmount: {
    type: Number,
    min: 0
  },
  adminRevenue: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay'],
    required: true
  },
  gatewayTransactionId: {
    type: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  },
  refundedAt: {
    type: Date
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

paymentSchema.index({ student: 1 });
paymentSchema.index({ instructor: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ course: 1, status: 1 });
paymentSchema.index({ course: 1, createdAt: -1 });

paymentSchema.pre('validate', function(next) {
  if (this.totalAmount && (!this.instructorAmount || !this.adminRevenue)) {
    this.instructorAmount = this.totalAmount * 0.9;
    this.adminRevenue = this.totalAmount * 0.1;
  }
  next();
});

paymentSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('totalAmount')) {
    this.instructorAmount = this.totalAmount * 0.9;
    this.adminRevenue = this.totalAmount * 0.1;
  }
  next();
});

paymentSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.processedAt = new Date();
  return this.save();
};

paymentSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  return this.save();
};

paymentSchema.methods.processRefund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount || this.totalAmount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  return this.save();
};

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;