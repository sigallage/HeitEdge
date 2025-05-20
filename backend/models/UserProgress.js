const mongoose = require('mongoose');
const { Schema } = mongoose;

const completedStopSchema = new Schema({
  stopId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  pointsEarned: {
    type: Number,
    required: true
  },
  challengeCompleted: {
    type: Boolean,
    default: false
  }
});

const userProgressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quest: {
    type: Schema.Types.ObjectId,
    ref: 'HeritageQuest',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedStops: [completedStopSchema],
  completedAt: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  totalPointsEarned: {
    type: Number,
    default: 0
  }
});

// Calculate total points whenever stops are updated
userProgressSchema.pre('save', function(next) {
  this.totalPointsEarned = this.completedStops.reduce((sum, stop) => sum + stop.pointsEarned, 0);
  next();
});

// Index for faster queries
userProgressSchema.index({ user: 1, quest: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);