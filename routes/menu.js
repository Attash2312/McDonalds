const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');

// Get all menu items grouped by category
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        
        // Group items by category
        const menuByCategory = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        res.render('pages/menu', { 
            menuByCategory,
            categories: Object.keys(menuByCategory)
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).render('error', { 
            message: 'Error loading menu items',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// API endpoint to get menu items (for potential future use)
router.get('/api/items', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

module.exports = router; 