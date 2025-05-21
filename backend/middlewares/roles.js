const User = require('../models/User');

exports.requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ auth0Id: req.auth.payload.sub });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!user.roles.includes(role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ message: 'Server error during authorization' });
    }
  };
};