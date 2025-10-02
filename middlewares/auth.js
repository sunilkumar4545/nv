// Authentication middleware to protect admin routes
const isAuthenticated = (req, res, next) => {
  // Check if user session exists and is authenticated
  if (req.session && req.session.isAuthenticated && req.session.adminId) {
    // Refresh session timeout on admin activity
    req.session.touch();
    return next();
  }
  
  // Clear any invalid session
  if (req.session) {
    req.session.destroy();
  }
  
  // If not authenticated, redirect to login page
  res.redirect('/login');
};

// Additional middleware to check admin session validity
const validateAdminSession = (req, res, next) => {
  if (req.session && req.session.isAuthenticated && req.session.adminId) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Invalid or expired session. Please login again.'
  });
};

module.exports = { isAuthenticated, validateAdminSession };
