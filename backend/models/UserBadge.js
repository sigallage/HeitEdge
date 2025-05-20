const mongoose = require('mongoose');
const { Schema } = mongoose;

const userBadgeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badge: {
    type: Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  isEquipped: {
    type: Boolean,
    default: false
  }
});

// Ensure a user can't earn the same badge multiple times
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model('UserBadge', userBadgeSchema);