const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const {
  getCulturalSites,
  getCulturalSite,
  createCulturalSite,
  updateCulturalSite,
  searchCulturalSites
} = require('../controllers/culturalSiteController');

// Public routes
router.get('/', getCulturalSites);
router.get('/search', searchCulturalSites);
router.get('/:id', getCulturalSite);

// Protected routes
router.use(checkJwt);
router.post('/', requireRole(['contributor', 'admin']), createCulturalSite);
router.put('/:id', requireRole(['contributor', 'admin']), updateCulturalSite);

module.exports = router;