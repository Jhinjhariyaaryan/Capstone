const app = require('../Server');
const connectDB = require('../Config/db');

let dbConnected = false;

module.exports = async (req, res) => {
    try {
        if (!dbConnected) {
            await connectDB();
            dbConnected = true;
        }

        return app(req, res);
    } catch (error) {
        console.error('Serverless Function Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};