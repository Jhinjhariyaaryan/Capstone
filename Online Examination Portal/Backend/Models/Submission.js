const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    givenAnswer: { type: String },
    isCorrect: { type: Boolean },
    marksObtained: { type: Number, default: 0 }
  }],
  totalQuestions: { type: Number, required: true },
  attempted: { type: Number, required: true },
  correct: { type: Number, required: true },
  incorrect: { type: Number, required: true },
  percentageScore: { type: Number, required: true },
  passed: { type: Boolean, default: false },
  proctoringLogs: {
    tabSwitchCount: { type: Number, default: 0 },
    flaggedViolations: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);