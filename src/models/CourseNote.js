import { mongoose } from '../lib/database.js';

const courseNoteSchema = new mongoose.Schema({
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
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true,
    min: 0
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'other']
  },
  mimeType: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

courseNoteSchema.index({ course: 1, isPublished: 1 });
courseNoteSchema.index({ course: 1, order: 1 });

const CourseNote = mongoose.models.CourseNote || mongoose.model('CourseNote', courseNoteSchema);

export default CourseNote;