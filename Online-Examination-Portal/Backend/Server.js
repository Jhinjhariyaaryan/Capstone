// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const connectDB = require('./Config/db');

// const app = express();

// // Connect to MongoDB Database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', require('./Routes/AuthRoutes'));
// app.use('/api/exams', require('./Routes/ExamRoutes'));
// app.use('/api/results', require('./Routes/ResultRoutes'));
// app.use('/api/payments', require('./Routes/PaymentRoutes'));

// // Health check
// app.get('/', (req, res) => {
//     res.send('Online Examination Portal API is running smoothly...');
// });

// // Local development only
// if (require.main === module) {
//     const PORT = process.env.PORT || 5000;

//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }

// module.exports = app;
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./Config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./Routes/AuthRoutes'));
app.use('/api/exams', require('./Routes/ExamRoutes'));
app.use('/api/results', require('./Routes/ResultRoutes'));
app.use('/api/payments', require('./Routes/PaymentRoutes'));

// Health check
app.get('/', (req, res) => {
    res.send('Online Examination Portal API is running smoothly...');
});

// // Local Development
// if (require.main === module) {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }

// module.exports = app;
// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    // Pehle MongoDB connect karein, phir server start karein
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((err) => {
        console.error("Failed to start server due to DB connection error:", err.message);
    });
}

module.exports = app;