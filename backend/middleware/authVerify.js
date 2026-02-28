const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authVerify = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed', error: err.message });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

module.exports = { authVerify, adminOnly };
