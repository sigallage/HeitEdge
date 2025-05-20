const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityContributionSchema = new Schema({
  type: {
    type: String,
    enum: ['Story', 'Photo', 'Audio', 'Fact', 'Correction'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrl: String,
  language: {
    type: String,
    enum: ['en', 'si', 'ta'],
    required: true
  },
  relatedSite: {
    type: Schema.Types.ObjectId,
    ref: 'CulturalSite'
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  isFeatured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('CommunityContribution', communityContributionSchema);