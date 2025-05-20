const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// Get user preferences
router.get('/preferences', checkJwt, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.auth.payload.sub });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.patch('/preferences', checkJwt, async (req, res) => {
  try {
    const updatedUser = await userController.updateUserProfile(
      req.auth.payload.sub,
      { preferences: req.body }
    );
    res.json(updatedUser.preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;