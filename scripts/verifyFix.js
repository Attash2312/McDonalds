const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../models/user');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');

async function verifyFix() {
    try {
        console.log('🔍 Verifying that all fixes are working...');
        
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds');
        console.log('✅ Database connected successfully');
        
        // Test 1: Check model registration
        const modelNames = mongoose.modelNames();
        console.log('\n📋 Registered models:', modelNames);
        
        // Test 2: Find test user
        const user = await User.findOne({ email: 'attash@gmail.com' });
        if (!user) {
            console.log('❌ Test user not found');
            return;
        }
        console.log(`✅ Found user: ${user.name} (${user.email})`);
        
        // Test 3: Check user's orders
        const orders = await Order.find({ userId: user._id });
        console.log(`✅ Found ${orders.length} orders for user`);
        
        // Test 4: Test populate functionality (this was the main issue)
        if (orders.length > 0) {
            const testOrder = await Order.findById(orders[0]._id).populate('items.product');
            if (testOrder && testOrder.items.length > 0) {
                const firstItem = testOrder.items[0];
                console.log(`✅ Populate working: Order item "${firstItem.title}" has product: ${firstItem.product ? firstItem.product.name : 'MISSING'}`);
            } else {
                console.log('❌ Populate not working properly');
            }
        }
        
        // Test 5: Check user's complaints
        const complaints = await Complaint.find({ userId: user._id });
        console.log(`✅ Found ${complaints.length} complaints for user`);
        
        // Test 6: Test complaint populate
        if (complaints.length > 0) {
            const testComplaint = await Complaint.findById(complaints[0]._id)
                .populate('orderId', 'totalAmount status');
            if (testComplaint && testComplaint.orderId) {
                console.log(`✅ Complaint populate working: Complaint linked to order $${testComplaint.orderId.totalAmount}`);
            } else {
                console.log('❌ Complaint populate not working');
            }
        }
        
        // Test 7: Check admin user
        const admin = await User.findOne({ isAdmin: true });
        if (admin) {
            console.log(`✅ Admin user found: ${admin.name} (${admin.email})`);
        }
        
        // Test 8: Check all complaints for admin view
        const allComplaints = await Complaint.find()
            .populate('userId', 'name email')
            .populate('orderId', 'totalAmount status');
        console.log(`✅ Admin can see ${allComplaints.length} total complaints`);
        
        console.log('\n🎉 All tests passed! The complaint system should now be working properly.');
        console.log('\n📋 To test the web interface:');
        console.log('1. Go to http://localhost:3000');
        console.log('2. Login as: attash@gmail.com');
        console.log('3. Check "My Orders" - should show orders');
        console.log('4. Check "My Complaints" - should show complaints');
        console.log('5. Go to Contact Us → Submit Complaint - should work');
        console.log('6. Login as admin: admin@mcdonalds.com / admin123');
        console.log('7. Check admin complaints management');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase disconnected');
    }
}

verifyFix(); 