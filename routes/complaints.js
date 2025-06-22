const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Order = require('../models/Order');
const User = require('../models/user');

// Show complaint form (only for logged-in users)
router.get('/submit', isAuthenticated, async (req, res) => {
    try {
        // Get user's orders for the dropdown
        const userOrders = await Order.find({ userId: req.user._id })
            .select('_id createdAt totalAmount status')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('complaints/submit', {
            title: 'Submit Complaint',
            userOrders: userOrders
        });
    } catch (error) {
        console.error('Error loading complaint form:', error);
        req.flash('error', 'Error loading complaint form');
        res.redirect('/contact-us');
    }
});

// Submit complaint
router.post('/submit', isAuthenticated, async (req, res) => {
    try {
        const { orderId, message } = req.body;

        // Validate input
        if (!orderId || !message) {
            req.flash('error', 'Please provide both Order ID and message');
            return res.redirect('/complaints/submit');
        }

        if (message.length < 10) {
            req.flash('error', 'Message must be at least 10 characters long');
            return res.redirect('/complaints/submit');
        }

        // Verify that the order belongs to the user
        const order = await Order.findOne({ _id: orderId, userId: req.user._id });
        if (!order) {
            req.flash('error', 'Invalid Order ID or order does not belong to you');
            return res.redirect('/complaints/submit');
        }

        // Create complaint
        const complaint = new Complaint({
            userId: req.user._id,
            orderId: orderId,
            message: message
        });

        await complaint.save();

        req.flash('success', 'Complaint submitted successfully');
        res.redirect('/complaints/my-complaints');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        req.flash('error', 'Error submitting complaint');
        res.redirect('/complaints/submit');
    }
});

// User's complaints list
router.get('/my-complaints', isAuthenticated, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id })
            .populate('orderId', 'totalAmount createdAt status')
            .sort({ createdAt: -1 });

        // Helper function for status badge classes
        const getStatusBadgeClass = (status) => {
            if (!status) return 'bg-secondary';
            switch(status) {
                case 'pending': return 'bg-warning';
                case 'in-progress': return 'bg-info';
                case 'resolved': return 'bg-success';
                case 'closed': return 'bg-secondary';
                default: return 'bg-primary';
            }
        };

        res.render('complaints/my-complaints', {
            title: 'My Complaints',
            complaints: complaints,
            getStatusBadgeClass: getStatusBadgeClass
        });
    } catch (error) {
        console.error('Error loading complaints:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading complaints',
            error: error.message
        });
    }
});

// Admin: View all complaints
router.get('/admin/all', isAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('userId', 'name email')
            .populate('orderId', 'totalAmount createdAt status')
            .sort({ createdAt: -1 });

        // Helper function for status badge classes
        const getStatusBadgeClass = (status) => {
            if (!status) return 'bg-secondary';
            switch(status) {
                case 'pending': return 'bg-warning';
                case 'in-progress': return 'bg-info';
                case 'resolved': return 'bg-success';
                case 'closed': return 'bg-secondary';
                default: return 'bg-primary';
            }
        };

        res.render('admin/complaints', {
            title: 'All Complaints',
            complaints: complaints,
            getStatusBadgeClass: getStatusBadgeClass
        });
    } catch (error) {
        console.error('Error loading all complaints:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading complaints',
            error: error.message
        });
    }
});

// Admin: Update complaint status
router.put('/admin/:id/status', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { status: status, updatedAt: Date.now() },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({ success: true, complaint });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ error: 'Error updating complaint status' });
    }
});

module.exports = router; 