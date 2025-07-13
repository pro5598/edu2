import { mongoose } from '../lib/database.js';

const chapterSchema = new mongoose.Schema({
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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0,
    min: 0,
    comment: 'Total duration in minutes'
  }
}, {
  timestamps: true
});

chapterSchema.index({ course: 1, order: 1 });
chapterSchema.index({ course: 1, isPublished: 1 });

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);

export default Chapter;