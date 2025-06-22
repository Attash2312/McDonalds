const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const MenuItem = require('../models/Menu');
const Order = require('../models/Order');
const User = require('../models/user');

// All admin routes protected
router.use(isAuthenticated, isAdmin);

// GET /admin - Admin dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

// GET /admin/products - List all products
router.get('/products', async (req, res) => {
    try {
        const products = await MenuItem.find();
        res.render('admin/products', { products, title: 'Product Management' });
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading products',
            error: error.message
        });
    }
});

// GET /admin/products/add - Show add product form
router.get('/products/add', (req, res) => {
    res.render('admin/add-product');
});

// POST /admin/products/add - Handle add product
router.post('/products/add', async (req, res) => {
    try {
        const { name, price, description, image, category, isAvailable } = req.body;
        await MenuItem.create({ name, price, description, image, category, isAvailable: isAvailable === 'on' });
        req.flash('success', 'Product added successfully');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error adding product:', error);
        req.flash('error', 'Error adding product');
        res.redirect('/admin/products/add');
    }
});

// GET /admin/products/edit/:id - Show edit form
router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await MenuItem.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', { product });
    } catch (error) {
        console.error('Error loading product for edit:', error);
        req.flash('error', 'Error loading product');
        res.redirect('/admin/products');
    }
});

// POST /admin/products/edit/:id - Handle edit
router.post('/products/edit/:id', async (req, res) => {
    try {
        const { name, price, description, image, category, isAvailable } = req.body;
        await MenuItem.findByIdAndUpdate(req.params.id, { name, price, description, image, category, isAvailable: isAvailable === 'on' });
        req.flash('success', 'Product updated successfully');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product:', error);
        req.flash('error', 'Error updating product');
        res.redirect('/admin/products');
    }
});

// POST /admin/products/delete/:id - Handle delete
router.post('/products/delete/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        req.flash('success', 'Product deleted successfully');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash('error', 'Error deleting product');
        res.redirect('/admin/products');
    }
});

// GET /admin/orders - List all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');
        res.render('admin/orders', { orders, title: 'Order Management' });
    } catch (error) {
        console.error('Error loading orders:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading orders',
            error: error.message
        });
    }
});

// GET /admin/complaints - Redirect to complaints management
router.get('/complaints', (req, res) => {
    res.redirect('/complaints/admin/all');
});

// (Optional) POST /admin/orders/:id/status - Update order status
router.post('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        req.flash('success', 'Order status updated successfully');
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error updating order status:', error);
        req.flash('error', 'Error updating order status');
        res.redirect('/admin/orders');
    }
});

module.exports = router; 