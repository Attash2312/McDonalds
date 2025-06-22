const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const MenuItem = require('../models/Menu');
const mongoose = require('mongoose');

// Public routes
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        isAuthPage: false
    });
});

router.get('/menu', async (req, res) => {
    try {
        console.log('Fetching menu items...');
        
        // First, check if we can connect to the database
        const dbState = mongoose.connection.readyState;
        console.log('Database connection state:', dbState);
        
        // Count total documents
        const totalItems = await MenuItem.countDocuments();
        console.log('Total menu items in database:', totalItems);
        
        const menuItems = await MenuItem.find({ isAvailable: true });
        console.log('Found available menu items:', menuItems.length);
        
        if (menuItems.length === 0) {
            console.log('No menu items found. Checking if database is empty...');
            const allItems = await MenuItem.find({});
            console.log('All items in database:', allItems);
        }
        
        // Group items by category
        const menuByCategory = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Create a mapping of category names to their URL-friendly IDs
        const categoryIds = {
            'Beef': 'beef',
            'Chicken & Fish': 'chicken-&-fish',
            'Crispy Chicken': 'crispy-chicken',
            'Breakfast': 'breakfast',
            'Fries & Sides': 'fries-&-sides',
            'Happy Meal': 'happy-meal',
            'Beverages': 'beverages',
            'Desserts': 'desserts',
            'McCafé': 'mccafé',
            'Value Meals': 'value-meals',
            'Extra Value Meals': 'value-meals',
            'Wraps': 'wraps'
        };

        console.log('Categories:', Object.keys(menuByCategory));
        console.log('Menu by category:', JSON.stringify(menuByCategory, null, 2));

        res.render('pages/menu', {
            title: 'Our Menu',
            isAuthPage: false,
            menuByCategory,
            categories: Object.keys(menuByCategory),
            categoryIds
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).render('error', {
            message: 'Error loading menu items',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
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

// Protected routes - require authentication
router.get('/cart', isAuthenticated, (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('pages/cart', {
        title: 'Shopping Cart',
        isAuthPage: false,
        cart,
        total
    });
});

router.get('/trending-now', isAuthenticated, (req, res) => {
    res.render('pages/trending', {
        title: 'Trending Now',
        isAuthPage: false
    });
});

router.get('/contact-us', isAuthenticated, (req, res) => {
    res.render('pages/contact-us', {
        title: 'Contact Us',
        isAuthPage: false
    });
});

router.get('/search', isAuthenticated, (req, res) => {
    res.render('pages/search', {
        title: 'Search',
        isAuthPage: false
    });
});

router.get('/locate-me', isAuthenticated, (req, res) => {
    res.render('pages/locate-me', {
        title: 'Locate Me',
        isAuthPage: false
    });
});

router.get('/checkout', isAuthenticated, (req, res) => {
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
