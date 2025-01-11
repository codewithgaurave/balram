const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

module.exports = { protectRoute };
