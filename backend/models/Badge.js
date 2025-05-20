const mongoose = require('mongoose');
const { Schema } = mongoose;

const badgeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: {
      questsCompleted: Number,
      sitesVisited: Number,
      pointsEarned: Number,
      contributionsMade: Number,
      specificQuest: {
        type: Schema.Types.ObjectId,
        ref: 'HeritageQuest'
      },
      specificSite: {
        type: Schema.Types.ObjectId,
        ref: 'CulturalSite'
      }
    },
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  xpReward: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Badge', badgeSchema);