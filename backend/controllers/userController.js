const User = require('../models/User');

exports.getOrCreateUser = async (auth0User) => {
  let user = await User.findOne({ auth0Id: auth0User.sub });
  
  if (!user) {
    user = new User({
      auth0Id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      profilePicture: auth0User.picture,
      lastLogin: new Date()
    });
    await user.save();
  } else {
    user.lastLogin = new Date();
    await user.save();
  }
  
  return user;
};

exports.updateUserProfile = async (userId, updates) => {
  const allowedUpdates = ['name', 'profilePicture', 'preferences'];
  const updateData = {};
  
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updateData[key] = updates[key];
    }
  });
  
  return User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.getUserById = async (userId) => {
  return User.findById(userId);
};