// const express = require('express');
// const router = express.Router();
// const User = require('../Models/User');
// const multer = require('multer');

// // Multer storage configuration for avatar upload
// const upload = multer({ dest: 'uploads/avatars/' });

// // GET User Profile Data
// router.get('/profile/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE Profile (Matches "Save Changes" modal in frontend)
// router.post('/profile/update/:id', upload.single('profilePic'), async (req, res) => {
//   try {
//     const { name, studentId, email, course, semester } = req.body;
//     let updateFields = { name, studentId, email, course, semester };

//     if (req.file) {
//       updateFields.profilePic = `/uploads/avatars/${req.file.filename}`;
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE User Settings (Theme & Notifications)
// router.post('/settings/update/:id', async (req, res) => {
//   try {
//     const { notificationsEnabled, examSoundEnabled, themePreference } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { settings: { notificationsEnabled, examSoundEnabled, themePreference } },
//       { new: true }
//     );
//     res.json({ success: true, settings: user.settings });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const multer = require('multer');

// ✅ FIX: Use Memory Storage instead of diskStorage to avoid Vercel ENOENT crash
const upload = multer({ storage: multer.memoryStorage() });

// GET User Profile Data
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Profile
router.post('/profile/update/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, studentId, email, course, semester } = req.body;
    let updateFields = { name, studentId, email, course, semester };

    // ✅ FIX: Save file as Base64 Data URL instead of disk file path
    if (req.file) {
      updateFields.profilePic = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE User Settings
router.post('/settings/update/:id', async (req, res) => {
  try {
    const { notificationsEnabled, examSoundEnabled, themePreference } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { settings: { notificationsEnabled, examSoundEnabled, themePreference } },
      { new: true }
    );
    res.json({ success: true, settings: user.settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;