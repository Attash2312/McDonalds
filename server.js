require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const flash = require('connect-flash');
const connectDB = require('./config/db');
const methodOverride = require('method-override');

// Import all models to ensure they're registered
require('./models/user');
require('./models/Menu');
require('./models/Order');
require('./models/Complaint');

// Initialize app
const app = express();
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Sessions - Use MongoDB for session storage with fallback
let sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to false for Vercel
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Use MemoryStore for sessions (guaranteed to work)
console.log('Using MemoryStore for sessions');
sessionConfig.store = undefined;

// Connect to Database asynchronously (better for serverless)
const initializeDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log('Database connection established');
        }
    } catch (err) {
        console.error('Failed to connect to database:', err);
        // Don't exit in production/serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

// Initialize database connection (temporarily disabled for stability)
initializeDatabase();

// Handle serverless function cleanup
if (process.env.NODE_ENV === 'production') {
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, closing database connection');
        await mongoose.connection.close();
        process.exit(0);
    });
}

app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.isAuthPage = false;
    next();
});

// Simple test route directly in server.js
app.get('/server-test', (req, res) => {
    res.json({
        message: 'Server.js route working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Session debug route
app.get('/session-debug', (req, res) => {
    res.json({
        sessionID: req.sessionID,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        session: req.session
    });
});

// Health check without database
app.get('/health-simple', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        databaseState: require('mongoose').connection.readyState
    });
});



// Routes
app.use('/', require('./routes/pageRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/admin', require('./routes/admin'));
app.use('/my-orders', require('./routes/my-orders'));
app.use('/complaints', require('./routes/complaints'));

// 404 handler
app.use((req, res, next) => {
    try {
        res.status(404).render('error', {
            title: 'Page Not Found',
            message: 'The page you are looking for does not exist.',
            error: {}
        });
    } catch (renderError) {
        console.error('Failed to render 404 page:', renderError);
        res.status(404).json({
            error: 'Page Not Found',
            message: 'The page you are looking for does not exist.'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    
    // Try to render error view, fallback to JSON if it fails
    try {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    } catch (renderError) {
        console.error('Failed to render error view:', renderError);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Something went wrong!',
            ...(process.env.NODE_ENV === 'development' && { details: err.message })
        });
    }
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;