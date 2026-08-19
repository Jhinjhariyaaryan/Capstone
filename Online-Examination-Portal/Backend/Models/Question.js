const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "Data Structures"
  type: { type: String, enum: ['MCQ', 'TRUE_FALSE', 'DESCRIPTIVE'], required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }], // Optional for descriptive
  correctAnswer: { type: String, required: true },
  explanation: { type: String }, // For solution review
  marks: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);