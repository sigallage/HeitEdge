const express = require('express');
const router = express.Router();

// Import all route files
const culturalSiteRoutes = require('./culturalSiteRoutes');
const userRoutes = require('./userRoutes');
const questRoutes = require('./questRoutes');

// Setup routes
router.use('/api/sites', culturalSiteRoutes);
router.use('/api/users', userRoutes);
router.use('/api/quests', questRoutes);

module.exports = router;