// backend/routes/culturalSiteRoutes.js
const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const {
  getCulturalSites,
  getCulturalSite,
  createCulturalSite,
  updateCulturalSite,
  deleteCulturalSite
} = require('../controllers/culturalSiteController');

// GET all cultural sites
router.get('/', getCulturalSites);

// GET single cultural site
router.get('/:id', getCulturalSite);

// POST create new cultural site (protected)
router.post('/', checkJwt, createCulturalSite);

// PUT update cultural site (protected)
router.put('/:id', checkJwt, updateCulturalSite);

// DELETE cultural site (protected)
router.delete('/:id', checkJwt, deleteCulturalSite);

module.exports = router;