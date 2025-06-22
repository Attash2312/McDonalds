const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/Menu');
const User = require('../models/user');
const { isAuthenticated } = require('../middleware/auth');

// GET /my-orders - Display user's order history
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 }) // Most recent first
            .populate('items.product');

        res.render('pages/my-orders', {
            title: 'My Orders',
            orders: orders,
            user: req.user,
            isAuthPage: false
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error_msg', 'Failed to load your orders');
        res.redirect('/');
    }
});

// GET /my-orders/:id - Display specific order details
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        }).populate('items.product');

        if (!order) {
            req.flash('error_msg', 'Order not found');
            return res.redirect('/my-orders');
        }

        res.render('pages/order-details', {
            title: 'Order Details',
            order: order,
            user: req.user,
            isAuthPage: false
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        req.flash('error_msg', 'Failed to load order details');
        res.redirect('/my-orders');
    }
});

module.exports = router; 