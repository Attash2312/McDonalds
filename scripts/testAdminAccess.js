const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function testAdminAccess() {
    try {
        await connectDB();
        console.log('Database connected successfully');

        // Import all models to ensure they're registered
        const MenuItem = require('../models/Menu');
        const Order = require('../models/Order');
        const Complaint = require('../models/Complaint');
        const User = require('../models/user');

        // Test MenuItem model access
        console.log('\n1. Testing MenuItem model...');
        const menuItems = await MenuItem.find().limit(3);
        console.log(`   Found ${menuItems.length} menu items`);
        console.log(`   Sample: ${menuItems[0] ? menuItems[0].name : 'None'}`);

        // Test Order model access
        console.log('\n2. Testing Order model...');
        const orders = await Order.find().populate('userId', 'name email').limit(3);
        console.log(`   Found ${orders.length} orders`);
        console.log(`   Sample order user: ${orders[0] ? (orders[0].userId ? orders[0].userId.name : orders[0].user.name) : 'None'}`);

        // Test Complaint model access
        console.log('\n3. Testing Complaint model...');
        const complaints = await Complaint.find()
            .populate('userId', 'name email')
            .populate('orderId', 'totalAmount createdAt status')
            .limit(3);
        console.log(`   Found ${complaints.length} complaints`);
        console.log(`   Sample complaint user: ${complaints[0] ? complaints[0].userId.name : 'None'}`);

        // Test User model for admin
        console.log('\n4. Testing User model for admin...');
        const adminUser = await User.findOne({ isAdmin: true });
        console.log(`   Admin user found: ${adminUser ? 'Yes' : 'No'}`);
        if (adminUser) {
            console.log(`   Admin name: ${adminUser.name}`);
            console.log(`   Admin email: ${adminUser.email}`);
        }

        // Test view rendering (simulate what the routes do)
        console.log('\n5. Testing data preparation for views...');
        
        // Products view data
        const productsForView = await MenuItem.find();
        console.log(`   Products for view: ${productsForView.length} items`);
        
        // Orders view data
        const ordersForView = await Order.find().populate('userId', 'name email');
        console.log(`   Orders for view: ${ordersForView.length} orders`);
        
        // Complaints view data
        const complaintsForView = await Complaint.find()
            .populate('userId', 'name email')
            .populate('orderId', 'totalAmount createdAt status');
        console.log(`   Complaints for view: ${complaintsForView.length} complaints`);

        console.log('\n✅ All admin route data tests passed!');
        console.log('The issue might be in the view rendering or route handling.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

testAdminAccess(); 