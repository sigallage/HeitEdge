const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const culturalSiteSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: true,
    index: '2dsphere'
  },
  images: [{
    url: String,
    caption: String,
    credit: String
  }],
  historicalPeriod: {
    type: String,
    enum: ['Ancient', 'Medieval', 'Colonial', 'Modern', 'Unknown'],
    default: 'Unknown'
  },
  significance: {
    type: String,
    enum: ['UNESCO', 'National', 'Regional', 'Local'],
    default: 'Local'
  },
  categories: [{
    type: String,
    enum: ['Temple', 'Fort', 'Natural', 'Monument', 'Museum', 'Festival', 'Tradition']
  }],
  accessibility: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult', 'Restricted'],
    default: 'Moderate'
  },
  audioStories: [{
    title: String,
    language: {
      type: String,
      enum: ['en', 'si', 'ta']
    },
    audioUrl: String,
    transcript: String,
    duration: Number
  }],
  arContent: {
    modelUrl: String,
    previewImage: String,
    scale: Number
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

// Update timestamps on save
culturalSiteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Text index for search
culturalSiteSchema.index({
  name: 'text',
  description: 'text',
  'audioStories.title': 'text',
  'audioStories.transcript': 'text'
});

module.exports = mongoose.model('CulturalSite', culturalSiteSchema);