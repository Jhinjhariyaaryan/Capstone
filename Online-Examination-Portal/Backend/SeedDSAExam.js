// // seedAllExams.js
// const mongoose = require('mongoose');
// require('dotenv').config();

// const Question = require('./Models/Question');
// const Exam = require('./Models/Exam');

// const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exam_portal_db';

// // -------------------------------------------------------------
// // 1. DATA STRUCTURES & ALGORITHMS (DSA)
// // -------------------------------------------------------------
// const dsaQuestionsData = [
//   {
//     category: 'Data Structures and Algorithms',
//     type: 'MCQ',
//     questionText: 'What is the time complexity of the Binary Search algorithm in the worst case?',
//     options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
//     correctAnswer: 'O(log n)',
//     explanation: 'Binary Search repeatedly divides the search interval in half, leading to a logarithmic time complexity of O(log n).',
//     marks: 1
//   },
//   {
//     category: 'Data Structures and Algorithms',
//     type: 'MCQ',
//     questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
//     options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
//     correctAnswer: 'Stack',
//     explanation: 'A Stack processes elements using the LIFO principle, where the last added element is removed first.',
//     marks: 1
//   },
//   {
//     category: 'Data Structures and Algorithms',
//     type: 'MCQ',
//     questionText: 'Which data structure follows the First-In, First-Out (FIFO) principle?',
//     options: ['Stack', 'Queue', 'Array', 'Heap'],
//     correctAnswer: 'Queue',
//     explanation: 'A Queue works on the FIFO principle, where elements added first are processed first.',
//     marks: 1
//   },
//   {
//     category: 'Data Structures and Algorithms',
//     type: 'MCQ',
//     questionText: 'What is the worst-case time complexity of Quick Sort?',
//     options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
//     correctAnswer: 'O(n^2)',
//     explanation: 'When the pivot chosen is consistently the smallest or largest element, Quick Sort degrades to O(n^2).',
//     marks: 1
//   },
//   {
//     category: 'Data Structures and Algorithms',
//     type: 'MCQ',
//     questionText: 'Which algorithm design technique is used in Dynamic Programming?',
//     options: ['Divide and Conquer', 'Overlapping Subproblems & Optimal Substructure', 'Greedy Selection', 'Backtracking'],
//     correctAnswer: 'Overlapping Subproblems & Optimal Substructure',
//     explanation: 'Dynamic Programming solves complex problems by breaking them down into simpler, overlapping subproblems.',
//     marks: 1
//   }
// ];

// const dsaExamDetails = {
//   title: 'Data Structures and Algorithms',
//   description: 'Comprehensive test covering linear data structures, search algorithms, and sorting complexities.',
//   date: '20 May 2026',
//   timeSlot: '10:00 AM - 11:00 AM',
//   durationMinutes: 60,
//   shuffleQuestions: true,
//   negativeMarking: true,
//   negativeMarkPenalty: 0.25,
//   isPaid: false,
//   feeAmount: 0
// };

// // -------------------------------------------------------------
// // 2. DATABASE MANAGEMENT SYSTEMS (DBMS)
// // -------------------------------------------------------------
// const dbmsQuestionsData = [
//   {
//     category: 'Database Management Systems',
//     type: 'MCQ',
//     questionText: 'Which SQL command is used to remove a table structure permanently along with its data?',
//     options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'],
//     correctAnswer: 'DROP',
//     explanation: 'DROP command deletes the complete table definition and all rows from the database.',
//     marks: 1
//   },
//   {
//     category: 'Database Management Systems',
//     type: 'MCQ',
//     questionText: "What does ACID property 'A' stand for in DBMS?",
//     options: ['Atomicity', 'Availability', 'Accuracy', 'Authenticity'],
//     correctAnswer: 'Atomicity',
//     explanation: 'Atomicity ensures that all statements or operations within a transaction are completed successfully or none are.',
//     marks: 1
//   },
//   {
//     category: 'Database Management Systems',
//     type: 'MCQ',
//     questionText: 'Which normal form deals with removing Partial Dependency?',
//     options: ['1NF', '2NF', '3NF', 'BCNF'],
//     correctAnswer: '2NF',
//     explanation: 'A table is in 2NF if it is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key (No partial dependency).',
//     marks: 1
//   }
// ];

// const dbmsExamDetails = {
//   title: 'Database Management Systems',
//   description: 'Test covering relational algebra, SQL queries, normalization, and ACID properties.',
//   date: '22 May 2026',
//   timeSlot: '02:00 PM - 04:00 PM',
//   durationMinutes: 120,
//   shuffleQuestions: true,
//   negativeMarking: true,
//   negativeMarkPenalty: 0.25,
//   isPaid: false,
//   feeAmount: 0
// };

// // -------------------------------------------------------------
// // 3. OPERATING SYSTEMS (OS)
// // -------------------------------------------------------------
// const osQuestionsData = [
//   {
//     category: 'Operating Systems',
//     type: 'MCQ',
//     questionText: 'Which CPU scheduling algorithm gives minimum average waiting time?',
//     options: ['FCFS', 'SJF (Shortest Job First)', 'Round Robin', 'Priority Scheduling'],
//     correctAnswer: 'SJF (Shortest Job First)',
//     explanation: 'Shortest Job First (SJF) is optimal as it gives the minimum average waiting time for a given set of processes.',
//     marks: 1
//   },
//   {
//     category: 'Operating Systems',
//     type: 'MCQ',
//     questionText: 'What is a deadlock state in Operating System?',
//     options: [
//       'When CPU usage reaches 100%',
//       'When two or more processes are blocked waiting for each other to release resources',
//       'When main memory gets completely full',
//       'When a process finishes execution before child process'
//     ],
//     correctAnswer: 'When two or more processes are blocked waiting for each other to release resources',
//     explanation: 'Deadlock occurs when every process in a set is waiting for an event that only another process in the set can cause.',
//     marks: 1
//   },
//   {
//     category: 'Operating Systems',
//     type: 'MCQ',
//     questionText: 'Which page replacement algorithm suffers from Belady’s Anomaly?',
//     options: ['LRU (Least Recently Used)', 'FIFO (First In First Out)', 'Optimal Page Replacement', 'MRU (Most Recently Used)'],
//     correctAnswer: 'FIFO (First In First Out)',
//     explanation: 'Belady’s Anomaly is the phenomenon in which increasing the number of page frames results in an increase in the number of page faults for FIFO.',
//     marks: 1
//   }
// ];

// const osExamDetails = {
//   title: 'Operating Systems',
//   description: 'Assessment covering CPU scheduling, memory management, processes, and deadlocks.',
//   date: '25 May 2026',
//   timeSlot: '10:00 AM - 12:00 PM',
//   durationMinutes: 120,
//   shuffleQuestions: true,
//   negativeMarking: true,
//   negativeMarkPenalty: 0.25,
//   isPaid: false,
//   feeAmount: 0
// };

// // -------------------------------------------------------------
// // SEED DATABASE FUNCTION
// // -------------------------------------------------------------
// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log('Connected to MongoDB successfully...');

//     // 1. Purge existing data for clean seed
//     await Question.deleteMany({
//       category: { $in: ['Data Structures and Algorithms', 'Database Management Systems', 'Operating Systems'] }
//     });
//     await Exam.deleteMany({
//       title: { $in: ['Data Structures and Algorithms', 'Database Management Systems', 'Operating Systems'] }
//     });
//     console.log('Existing questions and exams cleared.');

//     // Helper function to insert questions & create exam
//     const createExamWithQuestions = async (questionsData, examDetails) => {
//       const insertedQuestions = await Question.insertMany(questionsData);
//       const questionIds = insertedQuestions.map(q => q._id);

//       const exam = new Exam({
//         ...examDetails,
//         questions: questionIds
//       });

//       await exam.save();
//       console.log(`Successfully created Exam: "${exam.title}" (${insertedQuestions.length} questions attached).`);
//     };

//     // 2. Seed DSA, DBMS, OS Exams
//     await createExamWithQuestions(dsaQuestionsData, dsaExamDetails);
//     await createExamWithQuestions(dbmsQuestionsData, dbmsExamDetails);
//     await createExamWithQuestions(osQuestionsData, osExamDetails);

//     console.log('\nAll Exam Papers inserted successfully!');
//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error seeding database:', error.message);
//     mongoose.connection.close();
//   }
// };

// // Run the script
// seedDatabase();
// SeedDSAExam.js
const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS resolution issue for Atlas connection
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS override skipped:', e.message);
}

const Question = require('./Models/Question');
const Exam = require('./Models/Exam');

// Atlas MONGO_URI from .env file
const MONGODB_URI ="mongodb+srv://jhinjhariyaaryan_db_user:bjjgSJCJItjwruai@examportal.vn9rjux.mongodb.net/?appName=ExamPortal";

// 1. DSA Data
const dsaQuestionsData = [
  {
    category: 'Data Structures and Algorithms',
    type: 'MCQ',
    questionText: 'What is the time complexity of the Binary Search algorithm in the worst case?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary Search repeatedly divides the search interval in half, leading to a logarithmic time complexity of O(log n).',
    marks: 1
  },
  {
    category: 'Data Structures and Algorithms',
    type: 'MCQ',
    questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctAnswer: 'Stack',
    explanation: 'A Stack processes elements using the LIFO principle, where the last added element is removed first.',
    marks: 1
  },
  {
    category: 'Data Structures and Algorithms',
    type: 'MCQ',
    questionText: 'Which data structure follows the First-In, First-Out (FIFO) principle?',
    options: ['Stack', 'Queue', 'Array', 'Heap'],
    correctAnswer: 'Queue',
    explanation: 'A Queue works on the FIFO principle, where elements added first are processed first.',
    marks: 1
  },
  {
    category: 'Data Structures and Algorithms',
    type: 'MCQ',
    questionText: 'What is the worst-case time complexity of Quick Sort?',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctAnswer: 'O(n^2)',
    explanation: 'When the pivot chosen is consistently the smallest or largest element, Quick Sort degrades to O(n^2).',
    marks: 1
  },
  {
    category: 'Data Structures and Algorithms',
    type: 'MCQ',
    questionText: 'Which algorithm design technique is used in Dynamic Programming?',
    options: ['Divide and Conquer', 'Overlapping Subproblems & Optimal Substructure', 'Greedy Selection', 'Backtracking'],
    correctAnswer: 'Overlapping Subproblems & Optimal Substructure',
    explanation: 'Dynamic Programming solves complex problems by breaking them down into simpler, overlapping subproblems.',
    marks: 1
  }
];

const dsaExamDetails = {
  title: 'Data Structures and Algorithms',
  description: 'Comprehensive test covering linear data structures, search algorithms, and sorting complexities.',
  date: '20 May 2026',
  timeSlot: '10:00 AM - 11:00 AM',
  durationMinutes: 60,
  shuffleQuestions: true,
  negativeMarking: true,
  negativeMarkPenalty: 0.25,
  isPaid: false,
  feeAmount: 0
};

// 2. DBMS Data
const dbmsQuestionsData = [
  {
    category: 'Database Management Systems',
    type: 'MCQ',
    questionText: 'Which SQL command is used to remove a table structure permanently along with its data?',
    options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'],
    correctAnswer: 'DROP',
    explanation: 'DROP command deletes the complete table definition and all rows from the database.',
    marks: 1
  },
  {
    category: 'Database Management Systems',
    type: 'MCQ',
    questionText: "What does ACID property 'A' stand for in DBMS?",
    options: ['Atomicity', 'Availability', 'Accuracy', 'Authenticity'],
    correctAnswer: 'Atomicity',
    explanation: 'Atomicity ensures that all statements or operations within a transaction are completed successfully or none are.',
    marks: 1
  },
  {
    category: 'Database Management Systems',
    type: 'MCQ',
    questionText: 'Which normal form deals with removing Partial Dependency?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: '2NF',
    explanation: 'A table is in 2NF if it is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key (No partial dependency).',
    marks: 1
  }
];

const dbmsExamDetails = {
  title: 'Database Management Systems',
  description: 'Test covering relational algebra, SQL queries, normalization, and ACID properties.',
  date: '22 May 2026',
  timeSlot: '02:00 PM - 04:00 PM',
  durationMinutes: 120,
  shuffleQuestions: true,
  negativeMarking: true,
  negativeMarkPenalty: 0.25,
  isPaid: false,
  feeAmount: 0
};

// 3. OS Data
const osQuestionsData = [
  {
    category: 'Operating Systems',
    type: 'MCQ',
    questionText: 'Which CPU scheduling algorithm gives minimum average waiting time?',
    options: ['FCFS', 'SJF (Shortest Job First)', 'Round Robin', 'Priority Scheduling'],
    correctAnswer: 'SJF (Shortest Job First)',
    explanation: 'Shortest Job First (SJF) is optimal as it gives the minimum average waiting time for a given set of processes.',
    marks: 1
  },
  {
    category: 'Operating Systems',
    type: 'MCQ',
    questionText: 'What is a deadlock state in Operating System?',
    options: [
      'When CPU usage reaches 100%',
      'When two or more processes are blocked waiting for each other to release resources',
      'When main memory gets completely full',
      'When a process finishes execution before child process'
    ],
    correctAnswer: 'When two or more processes are blocked waiting for each other to release resources',
    explanation: 'Deadlock occurs when every process in a set is waiting for an event that only another process in the set can cause.',
    marks: 1
  },
  {
    category: 'Operating Systems',
    type: 'MCQ',
    questionText: 'Which page replacement algorithm suffers from Belady’s Anomaly?',
    options: ['LRU (Least Recently Used)', 'FIFO (First In First Out)', 'Optimal Page Replacement', 'MRU (Most Recently Used)'],
    correctAnswer: 'FIFO (First In First Out)',
    explanation: 'Belady’s Anomaly is the phenomenon in which increasing the number of page frames results in an increase in the number of page faults for FIFO.',
    marks: 1
  }
];

const osExamDetails = {
  title: 'Operating Systems',
  description: 'Assessment covering CPU scheduling, memory management, processes, and deadlocks.',
  date: '25 May 2026',
  timeSlot: '10:00 AM - 12:00 PM',
  durationMinutes: 120,
  shuffleQuestions: true,
  negativeMarking: true,
  negativeMarkPenalty: 0.25,
  isPaid: false,
  feeAmount: 0
};

// SEED DATABASE FUNCTION
const seedDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGO_URI environment variable is missing!");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB Atlas successfully...');

    // 1. Purge existing data
    await Question.deleteMany({
      category: { $in: ['Data Structures and Algorithms', 'Database Management Systems', 'Operating Systems'] }
    });
    await Exam.deleteMany({
      title: { $in: ['Data Structures and Algorithms', 'Database Management Systems', 'Operating Systems'] }
    });
    console.log('Existing questions and exams cleared.');

    const createExamWithQuestions = async (questionsData, examDetails) => {
      const insertedQuestions = await Question.insertMany(questionsData);
      const questionIds = insertedQuestions.map(q => q._id);

      const exam = new Exam({
        ...examDetails,
        questions: questionIds
      });

      await exam.save();
      console.log(`Created Exam: "${exam.title}" (${insertedQuestions.length} questions attached).`);
    };

    // 2. Seed Exams
    await createExamWithQuestions(dsaQuestionsData, dsaExamDetails);
    await createExamWithQuestions(dbmsQuestionsData, dbmsExamDetails);
    await createExamWithQuestions(osQuestionsData, osExamDetails);

    console.log('\nAll Exam Papers inserted successfully into MongoAtlas!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();