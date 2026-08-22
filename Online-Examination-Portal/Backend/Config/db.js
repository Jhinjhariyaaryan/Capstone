const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined');
        }

        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected Successfully.');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        throw err;
    }
};

module.exports = connectDB;