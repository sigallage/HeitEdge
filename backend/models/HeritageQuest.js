const mongoose = require('mongoose');
const { Schema } = mongoose;

const questStopSchema = new Schema({
  site: {
    type: Schema.Types.ObjectId,
    ref: 'CulturalSite',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  challenge: {
    question: String,
    options: [String],
    correctAnswer: String,
    points: Number
  },
  storyUnlocked: String
});

const heritageQuestSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    enum: ['Ancient Kingdoms', 'Tea & Temples', 'Colonial Heritage', 'Nature & Culture'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  estimatedDuration: {
    type: Number, // in hours
    required: true
  },
  region: {
    type: String,
    required: true
  },
  stops: [questStopSchema],
  coverImage: String,
  totalPoints: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
});

// Calculate total points before save
heritageQuestSchema.pre('save', function(next) {
  this.totalPoints = this.stops.reduce((sum, stop) => sum + (stop.challenge?.points || 0), 0);
  next();
});

module.exports = mongoose.model('HeritageQuest', heritageQuestSchema);