const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Exam = require('../Models/Exam');
const Payment = require('../Models/Payment');
const nodemailer = require('nodemailer');

// Register Exam with Stripe / Fee Waiver Code
router.post('/checkout', async (req, res) => {
  try {
    const { userId, examId, waiverCode, userEmail } = req.body;
    const exam = await Exam.findById(examId);

    // Apply Fee Waiver
    if (waiverCode && exam.validWaiverCodes.includes(waiverCode)) {
      const payment = new Payment({
        student: userId,
        exam: examId,
        amountPaid: 0,
        waiverCodeUsed: waiverCode,
        status: 'COMPLETED'
      });
      await payment.save();

      await sendReceiptEmail(userEmail, exam.title, 0, waiverCode);
      return res.json({ success: true, message: 'Fee waiver code applied successfully.' });
    }

    // Stripe Session Setup
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: exam.title },
          unit_amount: exam.feeAmount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?examId=${examId}`,
      cancel_url: `http://localhost:3000/payment-cancelled`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Payment Receipt Email helper
async function sendReceiptEmail(email, examTitle, amount, codeUsed) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Registration Confirmation: ${examTitle}`,
    html: `
      <h2>Exam Registration Receipt</h2>
      <p>Thank you for registering for <b>${examTitle}</b>.</p>
      <p><b>Amount Paid:</b> $${amount}</p>
      ${codeUsed ? `<p><b>Waiver Code Applied:</b> ${codeUsed}</p>` : ''}
      <p>Good luck with your exam!</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;