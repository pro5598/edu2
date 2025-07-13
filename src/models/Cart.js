import { mongoose } from '../lib/database.js';

const cartItemSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  couponCode: {
    type: String,
    trim: true
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftRecipient: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      maxlength: 500
    }
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  _id: false
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOriginalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  appliedCoupons: [{
    code: {
      type: String,
      required: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    minimumAmount: {
      type: Number,
      min: 0
    },
    maximumDiscount: {
      type: Number,
      min: 0
    },
    applicableCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    isGlobal: {
      type: Boolean,
      default: true
    }
  }],
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sessionId: {
    type: String,
    trim: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    platform: String
  },
  savedForLater: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    reason: {
      type: String,
      maxlength: 200
    }
  }],
  checkoutAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  lastCheckoutAttempt: {
    type: Date
  },
  abandonedAt: {
    type: Date
  },
  recoveryEmailSent: {
    type: Boolean,
    default: false
  },
  recoveryEmailSentAt: {
    type: Date
  }
}, {
  timestamps: true
});


cartSchema.index({ lastUpdated: -1 });
cartSchema.index({ expiresAt: 1 });
cartSchema.index({ isActive: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ 'items.course': 1 });
cartSchema.index({ abandonedAt: 1 });
cartSchema.index({ recoveryEmailSent: 1 });

cartSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  this.calculateTotals();
  
  // Mark as abandoned if not updated for 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (this.lastUpdated < twentyFourHoursAgo && !this.abandonedAt) {
    this.abandonedAt = new Date();
  }
  
  next();
});

cartSchema.methods.addItem = async function(courseId, price, options = {}) {
  const existingItemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item
    this.items[existingItemIndex].price = price;
    this.items[existingItemIndex].addedAt = new Date();
    if (options.originalPrice) this.items[existingItemIndex].originalPrice = options.originalPrice;
    if (options.discountApplied) this.items[existingItemIndex].discountApplied = options.discountApplied;
    if (options.couponCode) this.items[existingItemIndex].couponCode = options.couponCode;
    if (options.isGift) this.items[existingItemIndex].isGift = options.isGift;
    if (options.giftRecipient) this.items[existingItemIndex].giftRecipient = options.giftRecipient;
  } else {
    // Add new item
    this.items.push({
      course: courseId,
      price: price,
      originalPrice: options.originalPrice || price,
      discountApplied: options.discountApplied || 0,
      couponCode: options.couponCode,
      isGift: options.isGift || false,
      giftRecipient: options.giftRecipient,
      priority: options.priority || 0,
      addedAt: new Date()
    });
  }
  
  return await this.save();
};

cartSchema.methods.removeItem = async function(courseId) {
  this.items = this.items.filter(
    item => item.course.toString() !== courseId.toString()
  );
  
  return await this.save();
};

cartSchema.methods.updateItemPrice = async function(courseId, newPrice, originalPrice) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.price = newPrice;
    if (originalPrice) item.originalPrice = originalPrice;
    return await this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.applyCoupon = async function(couponData) {
  const existingCoupon = this.appliedCoupons.find(
    coupon => coupon.code === couponData.code
  );
  
  if (!existingCoupon) {
    this.appliedCoupons.push({
      code: couponData.code,
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
      appliedAt: new Date(),
      minimumAmount: couponData.minimumAmount,
      maximumDiscount: couponData.maximumDiscount,
      applicableCourses: couponData.applicableCourses,
      isGlobal: couponData.isGlobal
    });
    
    return await this.save();
  }
};

cartSchema.methods.removeCoupon = async function(couponCode) {
  this.appliedCoupons = this.appliedCoupons.filter(
    coupon => coupon.code !== couponCode
  );
  
  return await this.save();
};

cartSchema.methods.calculateTotals = function() {
  this.totalOriginalAmount = this.items.reduce((total, item) => {
    return total + (item.originalPrice || item.price);
  }, 0);
  
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price;
  }, 0);
  
  // Apply coupon discounts
  let additionalDiscount = 0;
  this.appliedCoupons.forEach(coupon => {
    if (coupon.isGlobal) {
      if (coupon.discountType === 'percentage') {
        const discount = (this.totalAmount * coupon.discountValue) / 100;
        additionalDiscount += coupon.maximumDiscount ? 
          Math.min(discount, coupon.maximumDiscount) : discount;
      } else {
        additionalDiscount += coupon.discountValue;
      }
    } else {
      // Apply to specific courses
      coupon.applicableCourses.forEach(courseId => {
        const item = this.items.find(item => 
          item.course.toString() === courseId.toString()
        );
        if (item) {
          if (coupon.discountType === 'percentage') {
            const discount = (item.price * coupon.discountValue) / 100;
            additionalDiscount += coupon.maximumDiscount ? 
              Math.min(discount, coupon.maximumDiscount) : discount;
          } else {
            additionalDiscount += Math.min(coupon.discountValue, item.price);
          }
        }
      });
    }
  });
  
  this.totalAmount = Math.max(0, this.totalAmount - additionalDiscount);
  this.totalDiscount = this.totalOriginalAmount - this.totalAmount;
};

cartSchema.methods.moveToSavedForLater = async function(courseId, reason) {
  const itemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (itemIndex !== -1) {
    const item = this.items[itemIndex];
    this.savedForLater.push({
      course: item.course,
      savedAt: new Date(),
      originalPrice: item.originalPrice,
      reason: reason
    });
    
    this.items.splice(itemIndex, 1);
    return await this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.moveFromSavedForLater = async function(courseId) {
  const savedItemIndex = this.savedForLater.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (savedItemIndex !== -1) {
    const savedItem = this.savedForLater[savedItemIndex];
    
    // Get current course price (you might need to fetch from Course model)
    await this.addItem(savedItem.course, savedItem.originalPrice, {
      originalPrice: savedItem.originalPrice
    });
    
    this.savedForLater.splice(savedItemIndex, 1);
    return await this.save();
  }
  
  throw new Error('Item not found in saved for later');
};

cartSchema.methods.clear = async function() {
  this.items = [];
  this.appliedCoupons = [];
  this.totalAmount = 0;
  this.totalOriginalAmount = 0;
  this.totalDiscount = 0;
  return await this.save();
};

cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

cartSchema.methods.getItemCount = function() {
  return this.items.length;
};

cartSchema.methods.hasItem = function(courseId) {
  return this.items.some(
    item => item.course.toString() === courseId.toString()
  );
};

cartSchema.methods.markCheckoutAttempt = async function() {
  this.checkoutAttempts += 1;
  this.lastCheckoutAttempt = new Date();
  return await this.save();
};

cartSchema.methods.markAbandoned = async function() {
  this.abandonedAt = new Date();
  return await this.save();
};

cartSchema.methods.sendRecoveryEmail = async function() {
  this.recoveryEmailSent = true;
  this.recoveryEmailSentAt = new Date();
  return await this.save();
};

cartSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

cartSchema.methods.extendExpiry = async function(days = 30) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return await this.save();
};

cartSchema.statics.findAbandonedCarts = function(hoursAgo = 24) {
  const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return this.find({
    lastUpdated: { $lt: cutoffTime },
    abandonedAt: { $exists: false },
    isActive: true,
    'items.0': { $exists: true } // Has at least one item
  });
};

cartSchema.statics.findExpiredCarts = function() {
  return this.find({
    expiresAt: { $lt: new Date() },
    isActive: true
  });
};

cartSchema.statics.cleanupExpiredCarts = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
    isActive: false
  });
  return result.deletedCount;
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;