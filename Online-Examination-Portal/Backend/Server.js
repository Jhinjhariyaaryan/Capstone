const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads
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

// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;