const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');
const Order = require('../models/Order');
const User = require('../models/user');

// Initialize cart in session if it doesn't exist
const initializeCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
};

// Add to cart
router.post('/add/:productId', initializeCart, async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity) || 1;
        
        const product = await MenuItem.findById(productId);
        if (!product) {
            return res.status(404).render('error', {
                title: 'Error',
                message: 'Product not found',
                error: {}
            });
        }

        const cartItem = req.session.cart.find(item => item.productId.toString() === productId);
        
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            req.session.cart.push({
                productId: product._id,
                name: product.name,
                title: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error adding to cart',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// View cart
router.get('/', initializeCart, (req, res) => {
    try {
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.render('pages/cart', {
            title: 'Shopping Cart',
            cart,
            total
        });
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading cart',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Update cart item quantity
router.post('/update/:productId', initializeCart, (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        if (isNaN(quantity) || quantity < 0) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'Invalid quantity',
                error: {}
            });
        }

        if (quantity === 0) {
            req.session.cart = req.session.cart.filter(item => item.productId.toString() !== productId);
        } else {
            const cartItem = req.session.cart.find(item => item.productId.toString() === productId);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
        }

        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error updating cart',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Remove item from cart
router.post('/remove/:productId', initializeCart, (req, res) => {
    try {
        const productId = req.params.productId;
        req.session.cart = req.session.cart.filter(item => item.productId.toString() !== productId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error removing from cart',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Checkout page
router.get('/checkout', initializeCart, (req, res) => {
    try {
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'Your cart is empty',
                error: {}
            });
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.render('pages/checkout', {
            title: 'Checkout',
            cart,
            total
        });
    } catch (error) {
        console.error('Error loading checkout:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading checkout page',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Place order
router.post('/place-order', initializeCart, async (req, res) => {
    try {
        const { name, phone, address, notes, paymentMethod, cardNumber, cardName, expiryDate, cvv } = req.body;
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            return res.status(400).render('error', {
                title: 'Error',
                message: 'Your cart is empty',
                error: {}
            });
        }

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderData = {
            user: {
                name,
                phone,
                address
            },
            items: cart.map(item => ({
                product: item.productId,
                title: item.title || item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            notes: notes || '',
            paymentMethod: paymentMethod || 'cash',
            paymentDetails: paymentMethod === 'card' ? {
                cardNumber: cardNumber ? cardNumber.slice(-4) : null, // Only store last 4 digits
                cardName,
                expiryDate
            } : null,
            status: 'pending'
        };

        // Add userId if user is authenticated
        if (req.user && req.user._id) {
            orderData.userId = req.user._id;
        }

        const order = new Order(orderData);
        await order.save();
        
        // Clear the cart
        req.session.cart = [];
        
        res.render('pages/order-success', {
            title: 'Order Placed Successfully',
            orderId: order._id
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error placing order',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

module.exports = router; 