const express = require('express');
const router = express.Router();
const { requireRole } = require('../middlewares/roles');
const { checkJwt } = require('../middlewares/auth');

// Admin-only route
router.get('/dashboard', checkJwt, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

module.exports = router;