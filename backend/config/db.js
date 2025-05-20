const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    
    // Create indexes in the background
    mongoose.connection.on('connected', () => {
      mongoose.model('CulturalSite').ensureIndexes();
      mongoose.model('UserProgress').ensureIndexes();
      mongoose.model('UserBadge').ensureIndexes();
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;