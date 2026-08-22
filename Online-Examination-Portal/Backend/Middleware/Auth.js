const jwt = require('jsonwebtoken');
const User = require('../Models/User');

/**
 * Middleware: Verify JWT Token
 * Ensures that the request contains a valid Bearer token in the Authorization header.
 */
const authenticateToken = async (req, res, next) => {
  try {
    // 1. Get token from authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access Denied. No token provided.' 
      });
    }

    // 2. Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

    // 3. Attach user data to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(0o1).json({ 
        success: false, 
        message: 'Invalid token. User no longer exists.' 
      });
    }

    req.user = user; // Makes user object available in route handlers
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token.',
      error: err.message 
    });
  }
};

/**
 * Middleware: Role-based Authorization
 * Usage: authorizeRoles('teacher', 'admin')
 * Restricts route access to specified user roles.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized. User identity missing.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access forbidden. Requires one of the following roles: [${allowedRoles.join(', ')}]` 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};