const express = require('express');
const router = express.Router();
const Submission = require('../Models/Submission');
const Exam = require('../Models/Exam');
const Question = require('../Models/Question');
const PDFDocument = require('pdfkit');

// SUBMIT EXAM & AUTO GRADE
router.post('/submit', async (req, res) => {
  try {
    const { userId, examId, userAnswers, tabSwitches } = req.body;
    
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let totalQuestions = exam.questions.length;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let totalScore = 0;

    let processedAnswers = [];

    for (let q of exam.questions) {
      const given = userAnswers.find(a => a.questionId.toString() === q._id.toString());
      const userAnsText = given ? given.answer.trim() : null;

      if (userAnsText) {
        attempted++;
        if (userAnsText.toLowerCase() === q.correctAnswer.toLowerCase()) {
          correct++;
          totalScore += q.marks;
          processedAnswers.push({ questionId: q._id, givenAnswer: userAnsText, isCorrect: true, marksObtained: q.marks });
        } else {
          incorrect++;
          const penalty = exam.negativeMarking ? exam.negativeMarkPenalty : 0;
          totalScore -= penalty;
          processedAnswers.push({ questionId: q._id, givenAnswer: userAnsText, isCorrect: false, marksObtained: -penalty });
        }
      } else {
        processedAnswers.push({ questionId: q._id, givenAnswer: '', isCorrect: false, marksObtained: 0 });
      }
    }

    const percentageScore = Math.max(0, Math.round((totalScore / totalQuestions) * 100));

    const submission = new Submission({
      student: userId,
      exam: examId,
      answers: processedAnswers,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      percentageScore,
      passed: percentageScore >= 40,
      proctoringLogs: { tabSwitchCount: tabSwitches || 0 }
    });

    await submission.save();

    res.json({
      success: true,
      submissionId: submission._id,
      score: percentageScore,
      totalQuestions,
      attempted,
      correct,
      incorrect
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Dashboard Counters for Student (Upcoming, In Progress, Completed)
router.get('/dashboard-stats/:userId', async (req, res) => {
  try {
    const completedCount = await Submission.countDocuments({ student: req.params.userId });
    const totalExams = await Exam.countDocuments();
    const upcomingCount = Math.max(0, totalExams - completedCount);

    res.json({
      upcomingCount,
      progressCount: 0,
      completedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Solutions for Completed Exam (Matches View Solutions UI)
router.get('/solutions/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('answers.questionId')
      .populate('exam');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const solutionData = submission.answers.map((ans, idx) => ({
      index: idx + 1,
      questionText: ans.questionId.questionText,
      givenAnswer: ans.givenAnswer,
      correctAnswer: ans.questionId.correctAnswer,
      explanation: ans.questionId.explanation || 'No detailed explanation provided.'
    }));

    res.json({
      examTitle: submission.exam.title,
      solutions: solutionData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DOWNLOAD Certificate PDF
router.get('/certificate/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('student')
      .populate('exam');

    if (!submission || !submission.passed) {
      return res.status(400).json({ message: 'Certificate only available for passed exams.' });
    }

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${submission._id}.pdf`);

    doc.pipe(res);

    doc.rect(20, 20, 802, 555).stroke('#2563eb');
    doc.fontSize(30).fillColor('#2563eb').text('CERTIFICATE OF COMPLETION', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).fillColor('#333').text('This is to certify that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(24).fillColor('#000').text(submission.student.name, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#333').text(`has successfully passed the examination for`, { align: 'center' });
    doc.fontSize(20).fillColor('#16a34a').text(submission.exam.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Score: ${submission.percentageScore}%`, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/results/submit
router.post('/submit', async (req, res) => {
  try {
    const { userId, examId, userAnswers } = req.body;
    
    // Fetch Exam & Questions
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    exam.questions.forEach((question, index) => {
      const selectedAnswer = userAnswers[question._id] || userAnswers[index];
      
      if (!selectedAnswer) {
        unattemptedCount++;
      } else if (selectedAnswer === question.correctAnswer) {
        correctCount++;
        score += (question.marks || 1);
      } else {
        incorrectCount++;
        if (exam.negativeMarking) {
          score -= (exam.negativeMarkPenalty || 0.25);
        }
      }
    });

    const totalMarks = exam.questions.length * 1; // Assuming 1 mark each
    const percentage = Math.max(0, ((score / totalMarks) * 100)).toFixed(2);

    // Save to DB
    const newSubmission = new Submission({
      userId,
      examId,
      score: Math.max(0, score),
      totalMarks,
      percentage,
      correctCount,
      incorrectCount,
      unattemptedCount,
      userAnswers,
      submittedAt: new Date()
    });

    await newSubmission.save();

    // MUST RETURN THE NEW SUBMISSION OBJECT
    res.status(200).json({
      success: true,
      result: newSubmission
    });

  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/results/recent/:userId
router.get('/recent/:userId', async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .populate('examId', 'title') // Exam ka title fetch karne ke liye
      .sort({ submittedAt: -1 })   // Sabse latest submission pehle dikhane ke liye
      .limit(5);                   // Sirf top 5 recent results dikhane ke liye

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching recent submissions:", error);
    res.status(500).json({ error: "Server error fetching submissions" });
  }
});

module.exports = router;