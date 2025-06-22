const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@mcdonalds.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        
        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@mcdonalds.com',
            password: 'admin123',
            isAdmin: true
        });
        
        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@mcdonalds.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminUser(); 