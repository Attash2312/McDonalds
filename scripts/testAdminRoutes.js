const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function testAdminRoutes() {
    try {
        await connectDB();
        console.log('Database connected successfully');

        // Test MenuItem model
        const MenuItem = require('../models/Menu');
        const menuItems = await MenuItem.find().limit(5);
        console.log('MenuItems found:', menuItems.length);
        console.log('Sample menu item:', menuItems[0] || 'No items found');

        // Test Order model
        const Order = require('../models/Order');
        const orders = await Order.find().limit(5);
        console.log('Orders found:', orders.length);
        console.log('Sample order:', orders[0] || 'No orders found');

        // Test Complaint model
        const Complaint = require('../models/Complaint');
        const complaints = await Complaint.find().limit(5);
        console.log('Complaints found:', complaints.length);
        console.log('Sample complaint:', complaints[0] || 'No complaints found');

        // Test User model
        const User = require('../models/user');
        const users = await User.find().limit(5);
        console.log('Users found:', users.length);
        console.log('Sample user:', users[0] || 'No users found');

        // Test admin user
        const adminUser = await User.findOne({ isAdmin: true });
        console.log('Admin user found:', adminUser ? 'Yes' : 'No');
        if (adminUser) {
            console.log('Admin user details:', {
                name: adminUser.name,
                email: adminUser.email,
                isAdmin: adminUser.isAdmin
            });
        }

        console.log('\nAll tests completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

testAdminRoutes(); 