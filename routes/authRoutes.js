const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const mongoose = require('mongoose');
const { isNotAuthenticated } = require('../middleware/auth');

// Test database connection
router.get('/test-connection', (req, res) => {
    const connectionState = mongoose.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.json({
        status: states[connectionState],
        state: connectionState,
        connectionString: mongoose.connection.client ? 'Connected' : 'Not connected',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        port: mongoose.connection.port,
        readyState: mongoose.connection.readyState
    });
});

// Login Page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        messages: req.flash('error'),
        success_msg: req.flash('success_msg'),
        isAuthPage: true,
        email: ''
    });
});

// Register Page
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('auth/register', {
        title: 'Register',
        messages: req.flash('error'),
        success_msg: req.flash('success_msg'),
        isAuthPage: true,
        name: '',
        email: '',
        password: '',
        password2: ''
    });
});

// Register Handle
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Validation
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Name validation
    if (name && name.length < 2) {
        errors.push({ msg: 'Name must be at least 2 characters long' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push({ msg: 'Please enter a valid email address' });
    }

    // Password validation
    if (password) {
        if (password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters long' });
        }
        if (!/[A-Z]/.test(password)) {
            errors.push({ msg: 'Password must contain at least one uppercase letter' });
        }
        if (!/[a-z]/.test(password)) {
            errors.push({ msg: 'Password must contain at least one lowercase letter' });
        }
        if (!/[0-9]/.test(password)) {
            errors.push({ msg: 'Password must contain at least one number' });
        }
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        return res.render('auth/register', {
            title: 'Register',
            messages: errors[0].msg,
            isAuthPage: true,
            name,
            email,
            password,
            password2
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (user) {
            req.flash('error', 'Email is already registered');
            return res.render('auth/register', {
                title: 'Register',
                messages: req.flash('error'),
                isAuthPage: true,
                name,
                email,
                password,
                password2
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        // Save user
        await newUser.save();
        req.flash('success_msg', 'Registration successful! You can now log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.render('auth/register', {
            title: 'Register',
            messages: req.flash('error'),
            isAuthPage: true,
            name,
            email,
            password,
            password2
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    let errors = [];

    // Validation
    if (!email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push({ msg: 'Please enter a valid email address' });
    }

    if (errors.length > 0) {
        return res.render('auth/login', {
            title: 'Login',
            messages: errors[0].msg,
            isAuthPage: true,
            email
        });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            req.flash('error', 'An error occurred during login. Please try again.');
            return res.render('auth/login', {
                title: 'Login',
                messages: req.flash('error'),
                isAuthPage: true,
                email
            });
        }

        if (!user) {
            req.flash('error', info.message || 'Invalid email or password');
            return res.render('auth/login', {
                title: 'Login',
                messages: req.flash('error'),
                isAuthPage: true,
                email
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                req.flash('error', 'An error occurred during login. Please try again.');
                return res.render('auth/login', {
                    title: 'Login',
                    messages: req.flash('error'),
                    isAuthPage: true,
                    email
                });
            }

            req.flash('success_msg', 'Welcome back, ' + user.name + '!');
            return res.redirect('/');
        });
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/');
        }
        req.flash('success_msg', 'You have been logged out successfully');
        res.redirect('/');
    });
});

module.exports = router;
