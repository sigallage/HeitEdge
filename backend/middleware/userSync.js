const User = require('../models/User');

exports.syncAuth0User = async (req, res, next) => {
  try {
    const auth0User = req.auth.payload;
    let user = await User.findOne({ auth0Id: auth0User.sub });
    
    if (!user) {
      user = await User.create({
        auth0Id: auth0User.sub,
        email: auth0User.email,
        name: auth0User.name || auth0User.email.split('@')[0],
        profilePicture: auth0User.picture,
        lastLogin: new Date()
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ message: 'User synchronization failed' });
  }
};