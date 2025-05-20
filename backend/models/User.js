const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  profilePicture: {
    type: String
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'si', 'ta'],
      default: 'en'
    },
    notificationEnabled: {
      type: Boolean,
      default: true
    }
  },
  roles: {
    type: [String],
    enum: ['user', 'contributor', 'admin'],
    default: ['user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Middleware to update last login
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);