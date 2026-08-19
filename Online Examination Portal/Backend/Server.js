const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./Config/db');

// Initialize App
const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Backend API Routes
app.use('/api/auth', require('./Routes/AuthRoutes'));
app.use('/api/exams', require('./Routes/ExamRoutes'));
app.use('/api/results', require('./Routes/ResultRoutes'));
app.use('/api/payments', require('./Routes/PaymentRoutes'));

// Root Healthcheck API
app.get('/', (req, res) => {
    res.send('Online Examination Portal API is running smoothly...');
});

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;