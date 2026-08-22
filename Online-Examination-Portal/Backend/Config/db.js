// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error('MONGO_URI is not defined');
//         }

//         if (mongoose.connection.readyState === 1) {
//             return;
//         }

//         await mongoose.connect(process.env.MONGO_URI);

//         console.log('MongoDB Connected Successfully.');
//     } catch (err) {
//         console.error('MongoDB Connection Error:', err.message);
//         throw err;
//     }
// };

// module.exports = connectDB;
// const mongoose = require('mongoose');
// const dns = require('dns');

// // DNS Servers ko Google & Cloudflare DNS par set karein (querySrv ECONNREFUSED fix ke liye)
// dns.setServers(['8.8.8.8', '1.1.1.1']);

// const connectDB = async () => {
//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error('MONGO_URI is not defined in .env file');
//         }

//         if (mongoose.connection.readyState === 1) {
//             return;
//         }

//         // Mongoose connection options me family: 4 add karein
//         await mongoose.connect(process.env.MONGO_URI, {
//             family: 4
//         });

//         console.log('MongoDB Connected Successfully.');
//     } catch (err) {
//         console.error('MongoDB Connection Error:', err.message);
//         throw err;
//     }
// };

// module.exports = connectDB;
const mongoose = require('mongoose');
const dns = require('dns');

// Custom DNS set only for local environment
if (!process.env.VERCEL) {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
        console.warn('Could not override DNS servers:', e.message);
    }
}

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            bufferCommands: false // Prevents queries hanging when serverless wakes up
        });

        console.log('MongoDB Connected Successfully.');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        throw err;
    }
};

module.exports = connectDB;