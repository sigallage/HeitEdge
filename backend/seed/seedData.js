const mongoose = require('mongoose');
const CulturalSite = require('../models/CulturalSite');
const HeritageQuest = require('../models/HeritageQuest');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedUsers = [
  {
    auth0Id: 'auth0|123456',
    email: 'admin@heritedge.com',
    name: 'Admin User',
    roles: ['admin']
  },
  {
    auth0Id: 'auth0|654321',
    email: 'contributor@heritedge.com',
    name: 'Contributor User',
    roles: ['contributor']
  }
];

const seedCulturalSites = [
  {
    name: 'Sigiriya Rock Fortress',
    description: 'Ancient rock fortress with frescoes and lion paw entrance',
    location: {
      type: 'Point',
      coordinates: [80.7596, 7.9570]
    },
    historicalPeriod: 'Ancient',
    significance: 'UNESCO',
    categories: ['Fort', 'Monument']
  }
];

const seedQuests = [
  {
    title: 'Ancient Kingdoms Trail',
    description: 'Explore the ancient capitals of Sri Lanka',
    theme: 'Ancient Kingdoms',
    difficulty: 'Medium',
    estimatedDuration: 8,
    region: 'Cultural Triangle'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await CulturalSite.deleteMany();
    await HeritageQuest.deleteMany();
    await User.deleteMany();
    
    // Insert users
    const createdUsers = await User.insertMany(seedUsers);
    const adminUser = createdUsers.find(u => u.roles.includes('admin'));
    
    // Insert cultural sites with creator
    const sitesWithCreator = seedCulturalSites.map(site => ({
      ...site,
      createdBy: adminUser._id,
      isApproved: true
    }));
    await CulturalSite.insertMany(sitesWithCreator);
    
    // Insert quests
    await HeritageQuest.insertMany(seedQuests);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();