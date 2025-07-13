import { mongoose } from '../lib/database.js';

const wishlistItemSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  priceWhenAdded: {
    type: Number,
    min: 0
  },
  notifyOnDiscount: {
    type: Boolean,
    default: true
  },
  discountThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 10 // Notify when discount is 10% or more
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  category: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  reminderSet: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  lastViewed: {
    type: Date
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  source: {
    type: String,
    enum: ['browse', 'search', 'recommendation', 'social', 'email', 'other'],
    default: 'browse'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  _id: false
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  name: {
    type: String,
    default: 'My Wishlist',
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  totalValue: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  categories: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0,
    min: 0
  },
  sharedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    followedAt: {
      type: Date,
      default: Date.now
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }],
  privacy: {
    type: String,
    enum: ['private', 'public', 'friends', 'followers'],
    default: 'private'
  },
  allowComments: {
    type: Boolean,
    default: false
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isApproved: {
      type: Boolean,
      default: true
    }
  }],
  sortOrder: {
    type: String,
    enum: ['dateAdded', 'priority', 'price', 'rating', 'alphabetical', 'custom'],
    default: 'dateAdded'
  },
  sortDirection: {
    type: String,
    enum: ['asc', 'desc'],
    default: 'desc'
  },
  notifications: {
    priceDrops: {
      type: Boolean,
      default: true
    },
    newCourses: {
      type: Boolean,
      default: false
    },
    recommendations: {
      type: Boolean,
      default: true
    },
    reminders: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalAdded: {
      type: Number,
      default: 0,
      min: 0
    },
    totalRemoved: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPurchased: {
      type: Number,
      default: 0,
      min: 0
    },
    averageTimeToPurchase: {
      type: Number, // in days
      min: 0
    },
    mostAddedCategory: {
      type: String
    },
    totalSavings: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: {
    type: Date
  }
}, {
  timestamps: true
});

wishlistSchema.index({ isPublic: 1 });
wishlistSchema.index({ lastUpdated: -1 });
wishlistSchema.index({ lastAccessed: -1 });
wishlistSchema.index({ 'items.course': 1 });
wishlistSchema.index({ 'items.addedAt': -1 });
wishlistSchema.index({ 'items.priority': -1 });
wishlistSchema.index({ categories: 1 });
wishlistSchema.index({ tags: 1 });
wishlistSchema.index({ privacy: 1 });
wishlistSchema.index({ 'followers.user': 1 });
wishlistSchema.index({ isActive: 1 });

wishlistSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  this.updateStatistics();
  next();
});

wishlistSchema.methods.addItem = async function(courseId, options = {}) {
  const existingItemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item
    const existingItem = this.items[existingItemIndex];
    existingItem.addedAt = new Date();
    existingItem.priority = options.priority || existingItem.priority;
    existingItem.notes = options.notes || existingItem.notes;
    existingItem.tags = options.tags || existingItem.tags;
    existingItem.notifyOnDiscount = options.notifyOnDiscount !== undefined ? 
      options.notifyOnDiscount : existingItem.notifyOnDiscount;
    existingItem.discountThreshold = options.discountThreshold || existingItem.discountThreshold;
    existingItem.isActive = true;
  } else {
    // Add new item
    this.items.push({
      course: courseId,
      addedAt: new Date(),
      priority: options.priority || 0,
      notes: options.notes || '',
      priceWhenAdded: options.priceWhenAdded,
      notifyOnDiscount: options.notifyOnDiscount !== undefined ? options.notifyOnDiscount : true,
      discountThreshold: options.discountThreshold || 10,
      tags: options.tags || [],
      category: options.category,
      isPublic: options.isPublic || false,
      reminderSet: options.reminderSet || false,
      reminderDate: options.reminderDate,
      source: options.source || 'browse',
      isActive: true
    });
    
    this.statistics.totalAdded += 1;
  }
  
  return await this.save();
};

wishlistSchema.methods.removeItem = async function(courseId) {
  const itemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (itemIndex !== -1) {
    this.items.splice(itemIndex, 1);
    this.statistics.totalRemoved += 1;
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.updateItem = async function(courseId, updates) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    Object.assign(item, updates);
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.moveItem = async function(courseId, newPosition) {
  const itemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (itemIndex !== -1 && newPosition >= 0 && newPosition < this.items.length) {
    const [item] = this.items.splice(itemIndex, 1);
    this.items.splice(newPosition, 0, item);
    return await this.save();
  }
  
  throw new Error('Invalid item or position');
};

wishlistSchema.methods.setPriority = async function(courseId, priority) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.priority = Math.max(0, Math.min(10, priority));
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.addTags = async function(courseId, tags) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    const newTags = tags.filter(tag => !item.tags.includes(tag));
    item.tags.push(...newTags);
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.removeTags = async function(courseId, tags) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.tags = item.tags.filter(tag => !tags.includes(tag));
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.setReminder = async function(courseId, reminderDate) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.reminderSet = true;
    item.reminderDate = reminderDate;
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.clearReminder = async function(courseId) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.reminderSet = false;
    item.reminderDate = undefined;
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.markItemViewed = async function(courseId) {
  const item = this.items.find(
    item => item.course.toString() === courseId.toString()
  );
  
  if (item) {
    item.lastViewed = new Date();
    item.viewCount += 1;
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.markItemPurchased = async function(courseId, purchasePrice) {
  const itemIndex = this.items.findIndex(
    item => item.course.toString() === courseId.toString()
  );
  
  if (itemIndex !== -1) {
    const item = this.items[itemIndex];
    
    // Calculate savings if price when added is available
    if (item.priceWhenAdded && purchasePrice < item.priceWhenAdded) {
      this.statistics.totalSavings += (item.priceWhenAdded - purchasePrice);
    }
    
    // Calculate time to purchase
    const daysToPurchase = Math.ceil((new Date() - item.addedAt) / (1000 * 60 * 60 * 24));
    if (this.statistics.averageTimeToPurchase) {
      this.statistics.averageTimeToPurchase = 
        (this.statistics.averageTimeToPurchase + daysToPurchase) / 2;
    } else {
      this.statistics.averageTimeToPurchase = daysToPurchase;
    }
    
    this.statistics.totalPurchased += 1;
    this.items.splice(itemIndex, 1);
    
    return await this.save();
  }
  
  throw new Error('Item not found in wishlist');
};

wishlistSchema.methods.sortItems = function(sortBy = 'dateAdded', direction = 'desc') {
  this.sortOrder = sortBy;
  this.sortDirection = direction;
  
  this.items.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dateAdded':
        comparison = new Date(a.addedAt) - new Date(b.addedAt);
        break;
      case 'priority':
        comparison = a.priority - b.priority;
        break;
      case 'price':
        comparison = (a.priceWhenAdded || 0) - (b.priceWhenAdded || 0);
        break;
      case 'alphabetical':
        // This would need course title, might need population
        comparison = 0;
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });
};

wishlistSchema.methods.getItemsByCategory = function(category) {
  return this.items.filter(item => item.category === category);
};

wishlistSchema.methods.getItemsByTag = function(tag) {
  return this.items.filter(item => item.tags.includes(tag));
};

wishlistSchema.methods.getItemsByPriority = function(minPriority = 0) {
  return this.items.filter(item => item.priority >= minPriority);
};

wishlistSchema.methods.getActiveItems = function() {
  return this.items.filter(item => item.isActive);
};

wishlistSchema.methods.getItemsWithReminders = function() {
  return this.items.filter(item => item.reminderSet && item.reminderDate);
};

wishlistSchema.methods.getDueReminders = function() {
  const now = new Date();
  return this.items.filter(item => 
    item.reminderSet && 
    item.reminderDate && 
    item.reminderDate <= now
  );
};

wishlistSchema.methods.updateStatistics = function() {
  this.totalItems = this.items.filter(item => item.isActive).length;
  
  // Update categories
  this.categories = [...new Set(this.items
    .filter(item => item.category)
    .map(item => item.category)
  )];
  
  // Update tags
  this.tags = [...new Set(this.items
    .flatMap(item => item.tags)
  )];
  
  // Find most added category
  const categoryCount = {};
  this.items.forEach(item => {
    if (item.category) {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    }
  });
  
  this.statistics.mostAddedCategory = Object.keys(categoryCount)
    .reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, null);
};

wishlistSchema.methods.generateShareToken = async function() {
  if (!this.shareToken) {
    this.shareToken = require('crypto').randomBytes(32).toString('hex');
    await this.save();
  }
  return this.shareToken;
};

wishlistSchema.methods.addFollower = async function(userId) {
  const existingFollower = this.followers.find(
    follower => follower.user.toString() === userId.toString()
  );
  
  if (!existingFollower) {
    this.followers.push({
      user: userId,
      followedAt: new Date(),
      notifications: true
    });
    return await this.save();
  }
};

wishlistSchema.methods.removeFollower = async function(userId) {
  this.followers = this.followers.filter(
    follower => follower.user.toString() !== userId.toString()
  );
  return await this.save();
};

wishlistSchema.methods.addComment = async function(userId, commentText) {
  if (this.allowComments) {
    this.comments.push({
      user: userId,
      comment: commentText,
      createdAt: new Date(),
      likes: [],
      isApproved: true
    });
    return await this.save();
  }
  
  throw new Error('Comments are not allowed on this wishlist');
};

wishlistSchema.methods.likeComment = async function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (comment && !comment.likes.includes(userId)) {
    comment.likes.push(userId);
    return await this.save();
  }
};

wishlistSchema.methods.unlikeComment = async function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.likes = comment.likes.filter(
      like => like.toString() !== userId.toString()
    );
    return await this.save();
  }
};

wishlistSchema.methods.hasItem = function(courseId) {
  return this.items.some(
    item => item.course.toString() === courseId.toString() && item.isActive
  );
};

wishlistSchema.methods.getItemCount = function() {
  return this.items.filter(item => item.isActive).length;
};

wishlistSchema.methods.isEmpty = function() {
  return this.getItemCount() === 0;
};

wishlistSchema.methods.clear = async function() {
  this.items = [];
  this.statistics.totalRemoved += this.totalItems;
  return await this.save();
};

wishlistSchema.methods.archive = async function() {
  this.isActive = false;
  this.archivedAt = new Date();
  return await this.save();
};

wishlistSchema.methods.restore = async function() {
  this.isActive = true;
  this.archivedAt = undefined;
  return await this.save();
};

wishlistSchema.methods.incrementAccess = async function() {
  this.accessCount += 1;
  this.lastAccessed = new Date();
  return await this.save();
};

wishlistSchema.methods.incrementShare = async function() {
  this.sharedCount += 1;
  return await this.save();
};

wishlistSchema.statics.findPublicWishlists = function(limit = 20, skip = 0) {
  return this.find({
    isPublic: true,
    isActive: true,
    totalItems: { $gt: 0 }
  })
  .populate('user', 'firstName lastName avatar')
  .sort({ lastUpdated: -1 })
  .limit(limit)
  .skip(skip);
};

wishlistSchema.statics.findByShareToken = function(shareToken) {
  return this.findOne({ shareToken, isActive: true })
    .populate('user', 'firstName lastName avatar')
    .populate('items.course');
};

wishlistSchema.statics.findWishlistsWithReminders = function() {
  const now = new Date();
  return this.find({
    'items.reminderSet': true,
    'items.reminderDate': { $lte: now },
    isActive: true
  });
};

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;