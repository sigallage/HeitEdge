const CulturalSite = require('../models/CulturalSite');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// @desc    Get all cultural sites
// @route   GET /api/sites
// @access  Public
exports.getCulturalSites = asyncHandler(async (req, res) => {
  const { category, period, region } = req.query;
  const filter = {};
  
  if (category) filter.categories = category;
  if (period) filter.historicalPeriod = period;
  
  const sites = await CulturalSite.find(filter)
    .populate('createdBy', 'name profilePicture')
    .sort({ createdAt: -1 });
  
  res.json(sites);
});

// @desc    Get single cultural site
// @route   GET /api/sites/:id
// @access  Public
exports.getCulturalSite = asyncHandler(async (req, res) => {
  const site = await CulturalSite.findById(req.params.id)
    .populate('createdBy', 'name profilePicture');
  
  if (!site) {
    res.status(404);
    throw new Error('Cultural site not found');
  }
  
  res.json(site);
});

// @desc    Create new cultural site
// @route   POST /api/sites
// @access  Private/Contributor
exports.createCulturalSite = [
  body('name').trim().isLength({ min: 3 }).escape(),
  body('description').trim().isLength({ min: 10 }).escape(),
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('historicalPeriod').isIn(['Ancient', 'Medieval', 'Colonial', 'Modern', 'Unknown']),
  
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const site = new CulturalSite({
      ...req.body,
      createdBy: req.user._id
    });
    
    const createdSite = await site.save();
    res.status(201).json(createdSite);
  })
];

// @desc    Update cultural site
// @route   PUT /api/sites/:id
// @access  Private/Contributor+Admin
exports.updateCulturalSite = [
  body('name').trim().isLength({ min: 3 }).optional().escape(),
  body('description').trim().isLength({ min: 10 }).optional().escape(),
  
  asyncHandler(async (req, res) => {
    const site = await CulturalSite.findById(req.params.id);
    
    if (!site) {
      res.status(404);
      throw new Error('Cultural site not found');
    }
    
    // Check ownership or admin
    if (site.createdBy.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      res.status(403);
      throw new Error('Not authorized to update this site');
    }
    
    const updatedSite = await CulturalSite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedSite);
  })
];

// @desc    Search cultural sites
// @route   GET /api/sites/search
// @access  Public
exports.searchCulturalSites = asyncHandler(async (req, res) => {
  const { query, lat, lng, radius = 5000 } = req.query;
  
  let searchQuery = {};
  
  if (query) {
    searchQuery = { $text: { $search: query } };
  }
  
  if (lat && lng) {
    searchQuery.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    };
  }
  
  const sites = await CulturalSite.find(searchQuery)
    .limit(20)
    .populate('createdBy', 'name profilePicture');
  
  res.json(sites);
});