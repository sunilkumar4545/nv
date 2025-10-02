// Main Express server configuration and startup
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const { isAuthenticated } = require('./middlewares/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers middleware
app.use((req, res, next) => {
  // Prevent admin pages from being cached
  if (req.path.includes('/admin')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// Session configuration for authentication
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent XSS attacks
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict' // CSRF protection
  }
}));

// Comprehensive security middleware to block unauthorized access
app.use('/', (req, res, next) => {
  const requestPath = req.path.toLowerCase();
  
  // Block direct access to admin.html
  if (requestPath.includes('admin.html')) {
    console.log(`Blocked direct access attempt to admin.html from IP: ${req.ip} at ${new Date().toISOString()}`);
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Direct access to admin panel is not allowed. Please use proper authentication.',
      code: 'ADMIN_ACCESS_BLOCKED'
    });
  }
  
  // Block direct access to login.html (force users to use /login route)
  if (requestPath.includes('login.html')) {
    console.log(`Blocked direct access attempt to login.html from IP: ${req.ip} at ${new Date().toISOString()}`);
    return res.status(403).json({
      error: 'Access Denied', 
      message: 'Direct access not allowed. Please use /login route.',
      code: 'LOGIN_ACCESS_BLOCKED'
    });
  }
  
  // Block access to any other sensitive admin files
  const adminPaths = ['/admin', '/login', '/api/auth'];
  const isSensitiveFile = requestPath.includes('.html') && 
    (requestPath.includes('admin') || requestPath.includes('login'));
    
  if (isSensitiveFile) {
    console.log(`Blocked access attempt to sensitive file: ${req.path} from IP: ${req.ip} at ${new Date().toISOString()}`);
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Direct file access not permitted.',
      code: 'FILE_ACCESS_BLOCKED'
    });
  }
  
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Public page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

app.get('/video-gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'video.html'));
});

// Admin authentication routes (keep secure and hidden)
app.get('/admin-login-portal', (req, res) => {
  // Redirect to admin if already authenticated
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Legacy login route (redirect to hidden one)
app.get('/login', (req, res) => {
  res.redirect('/admin-login-portal');
});

// Serve admin panel (protected route with additional security)
app.get('/admin', isAuthenticated, (req, res) => {
  // Double-check authentication before serving admin panel
  if (!req.session || !req.session.isAuthenticated || !req.session.adminId) {
    return res.redirect('/login');
  }
  
  // Log admin access for security monitoring
  console.log(`Admin panel accessed by admin ID: ${req.session.adminId} at ${new Date().toISOString()}`);
  
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin logout route
app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
  res.redirect('/');
});

// Security test route (for demonstration only)
app.get('/test-security', (req, res) => {
  res.json({
    message: 'Security is working!',
    authenticationRequired: 'Users must login through /login to access admin panel',
    directAccessBlocked: 'Direct access to admin.html and login.html is blocked',
    sessionSecurity: 'Sessions are protected with httpOnly and sameSite flags'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Gallery: http://localhost:${PORT}/gallery`);
  console.log(`Admin Login: http://localhost:${PORT}/login`);
});
