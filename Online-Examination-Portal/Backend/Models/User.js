const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  course: { type: String, default: 'B.Tech' },
  semester: { type: String, default: '5th' },
  profilePic: { type: String, default: 'https://via.placeholder.com/150' },
  settings: {
    notificationsEnabled: { type: Boolean, default: true },
    examSoundEnabled: { type: Boolean, default: true },
    themePreference: { type: String, enum: ['light', 'dark'], default: 'light' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);