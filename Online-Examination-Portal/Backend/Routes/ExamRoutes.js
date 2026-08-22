// const express = require('express');
// const router = express.Router();
// const Exam = require('../Models/Exam');
// const Question = require('../Models/Question');
// const multer = require('multer');
// const xlsx = require('xlsx');

// const upload = multer({ dest: 'uploads/imports/' });

// // GET All Active Exams for Student Dashboard
// router.get('/list', async (req, res) => {
//   try {
//     const exams = await Exam.find().populate('questions');
//     res.json(exams);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET Single Exam by ID (With Option Shuffling if enabled)
// router.get('/:id', async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.id).populate('questions');
//     if (!exam) return res.status(404).json({ message: 'Exam not found' });

//     let questionsData = exam.questions.map(q => ({
//       _id: q._id,
//       questionText: q.questionText,
//       type: q.type,
//       options: exam.shuffleQuestions ? q.options.sort(() => Math.random() - 0.5) : q.options,
//       marks: q.marks
//     }));

//     if (exam.shuffleQuestions) {
//       questionsData = questionsData.sort(() => Math.random() - 0.5);
//     }

//     res.json({
//       _id: exam._id,
//       title: exam.title,
//       durationMinutes: exam.durationMinutes,
//       questions: questionsData
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // BULK IMPORT Questions via Excel/CSV
// router.post('/import-questions', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     // Data format expected: category, type, questionText, options (comma separated), correctAnswer
//     const parsedQuestions = data.map(item => ({
//       category: item.category,
//       type: item.type,
//       questionText: item.questionText,
//       options: item.options ? item.options.split(',') : [],
//       correctAnswer: String(item.correctAnswer).trim()
//     }));

//     const inserted = await Question.insertMany(parsedQuestions);
//     res.json({ message: 'Questions imported successfully', count: inserted.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Exam = require('../Models/Exam');
const Question = require('../Models/Question');
const multer = require('multer');
const xlsx = require('xlsx');

// ✅ Memory storage for Vercel Serverless
const upload = multer({ storage: multer.memoryStorage() });

// GET All Active Exams
router.get('/list', async (req, res) => {
  try {
    const exams = await Exam.find().populate('questions');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Single Exam by ID
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let questionsData = exam.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: exam.shuffleQuestions ? [...q.options].sort(() => Math.random() - 0.5) : q.options,
      marks: q.marks
    }));

    if (exam.shuffleQuestions) {
      questionsData = questionsData.sort(() => Math.random() - 0.5);
    }

    res.json({
      _id: exam._id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      questions: questionsData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ BULK IMPORT Questions via Excel/CSV (Buffer Read)
router.post('/import-questions', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const parsedQuestions = data.map(item => ({
      category: item.category,
      type: item.type,
      questionText: item.questionText,
      options: item.options ? String(item.options).split(',') : [],
      correctAnswer: String(item.correctAnswer).trim()
    }));

    const inserted = await Question.insertMany(parsedQuestions);
    res.json({ message: 'Questions imported successfully', count: inserted.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;