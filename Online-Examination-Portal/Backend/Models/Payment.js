const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  stripePaymentIntentId: { type: String },
  amountPaid: { type: Number, required: true },
  waiverCodeUsed: { type: String },
  status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
  receiptSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);