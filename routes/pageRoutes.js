const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const MenuItem = require('../models/Menu');
const mongoose = require('mongoose');

// Super simple test route - no dependencies
router.get('/ping', (req, res) => {
    res.json({ message: 'pong', time: new Date().toISOString() });
});

// Simple debug route - should always work
router.get('/debug', (req, res) => {
    res.json({
        message: 'Debug route working',
        timestamp: new Date().toISOString(),
        routes: 'pageRoutes loaded successfully'
    });
});

// Health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        databaseState: mongoose.connection.readyState,
        databaseConnected: mongoose.connection.readyState === 1,
        mongodbUri: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
    });
});

// Test route for debugging
router.get('/test', (req, res) => {
    res.json({
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        databaseState: mongoose.connection.readyState,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Public routes
router.get('/', (req, res) => {
    try {
        res.render('index', {
            title: 'Home',
            isAuthPage: false
        });
    } catch (error) {
        console.error('Error rendering homepage:', error);
        res.status(500).json({
            error: 'Failed to render homepage',
            message: error.message
        });
    }
});

router.get('/menu', (req, res) => {
    // Static menu data (no database required)
    const menuByCategory = {
        'Breakfast': [
            { name: 'Big Mac', price: 8.99, description: 'Classic burger', image: '/images/mega-menu/beef-img.jpg' },
            { name: 'Quarter Pounder', price: 7.99, description: 'Beef burger', image: '/images/mega-menu/beef-img.jpg' }
        ],
        'Beverages': [
            { name: 'Coca-Cola', price: 1.99, description: 'Refreshing drink', image: '/images/mega-menu/beverages-pk-new.jpg' },
            { name: 'Sprite', price: 1.99, description: 'Lemon-lime drink', image: '/images/mega-menu/beverages-pk-new.jpg' }
        ],
        'Desserts': [
            { name: 'McFlurry', price: 3.99, description: 'Ice cream treat', image: '/images/mega-menu/desserts-pk-new.jpg' },
            { name: 'Apple Pie', price: 1.99, description: 'Warm pie', image: '/images/mega-menu/desserts-pk-new.jpg' }
        ]
    };

    const categoryIds = {
        'Breakfast': 'breakfast',
        'Beverages': 'beverages',
        'Desserts': 'desserts'
    };

    res.render('pages/menu', {
        title: 'Our Menu',
        isAuthPage: false,
        menuByCategory,
        categories: Object.keys(menuByCategory),
        categoryIds
    });
});

router.get('/about-our-food', (req, res) => {
    res.render('pages/about', {
        title: 'About Our Food',
        isAuthPage: false
    });
});

router.get('/your-right-to-know', (req, res) => {
    res.render('pages/your-right-to-know', {
        title: 'Your Right To Know',
        isAuthPage: false
    });
});

router.get('/our-app', (req, res) => {
    res.render('pages/our-app', {
        title: 'Our App',
        isAuthPage: false
    });
});

router.get('/family', (req, res) => {
    res.render('pages/family', {
        title: 'Family',
        isAuthPage: false
    });
});

// Protected routes - require authentication (temporarily disabled)
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('pages/cart', {
        title: 'Shopping Cart',
        isAuthPage: false,
        cart,
        total
    });
});

router.get('/trending-now', (req, res) => {
    res.render('pages/trending', {
        title: 'Trending Now',
        isAuthPage: false
    });
});

router.get('/contact-us', (req, res) => {
    res.render('pages/contact-us', {
        title: 'Contact Us',
        isAuthPage: false
    });
});

router.get('/search', (req, res) => {
    res.render('pages/search', {
        title: 'Search',
        isAuthPage: false
    });
});

router.get('/locate-me', (req, res) => {
    res.render('pages/locate-me', {
        title: 'Locate Me',
        isAuthPage: false
    });
});

router.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('pages/checkout', {
        title: 'Checkout',
        isAuthPage: false,
        cart,
        total
    });
});

module.exports = router;
