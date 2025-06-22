const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/Menu');
const User = require('../models/user');
const { isAuthenticated } = require('../middleware/auth');

// My Orders Page - Protected Route
router.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        // Fetch orders for the logged-in user
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 }); // Most recent first

        res.render('pages/my-orders', {
            title: 'My Orders',
            orders: orders,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', 'Failed to load orders. Please try again.');
        res.redirect('/');
    }
});

module.exports = router; 