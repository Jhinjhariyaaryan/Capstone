const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // e.g., "20 May 2025"
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
  durationMinutes: { type: Number, required: true }, // e.g., 120
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  shuffleQuestions: { type: Boolean, default: true },
  negativeMarking: { type: Boolean, default: false },
  negativeMarkPenalty: { type: Number, default: 0.25 },
  isPaid: { type: Boolean, default: false },
  feeAmount: { type: Number, default: 0 },
  validWaiverCodes: [{ type: String }], // e.g., ["SCHOLAR2025"]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);