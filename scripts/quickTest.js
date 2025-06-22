const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/user');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');

async function quickTest() {
    try {
        console.log('🚀 Quick test starting...');
        
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds');
        console.log('✅ Connected to database');
        
        // Test 1: Check if models are registered
        console.log('\n📋 Registered models:', mongoose.modelNames());
        
        // Test 2: Try to find a user
        const user = await User.findOne({ email: 'attash@gmail.com' });
        console.log('\n👤 Found user:', user ? user.name : 'NOT FOUND');
        
        if (user) {
            // Test 3: Try to find user's orders
            const orders = await Order.find({ userId: user._id });
            console.log(`📦 Found ${orders.length} orders for user`);
            
            if (orders.length > 0) {
                // Test 4: Try to populate order items
                const orderWithPopulate = await Order.findById(orders[0]._id).populate('items.product');
                console.log('🔗 Populate test:', orderWithPopulate ? 'SUCCESS' : 'FAILED');
                
                if (orderWithPopulate) {
                    console.log(`   Order has ${orderWithPopulate.items.length} items`);
                    orderWithPopulate.items.forEach((item, index) => {
                        console.log(`   Item ${index + 1}: ${item.title} - Product: ${item.product ? item.product.name : 'MISSING'}`);
                    });
                }
            }
            
            // Test 5: Try to find user's complaints
            const complaints = await Complaint.find({ userId: user._id });
            console.log(`⚠️  Found ${complaints.length} complaints for user`);
            
            if (complaints.length > 0) {
                // Test 6: Try to populate complaint
                const complaintWithPopulate = await Complaint.findById(complaints[0]._id)
                    .populate('orderId', 'totalAmount status');
                console.log('🔗 Complaint populate test:', complaintWithPopulate ? 'SUCCESS' : 'FAILED');
            }
        }
        
        console.log('\n✅ Quick test completed!');
        
    } catch (error) {
        console.error('❌ Error in quick test:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected');
    }
}

quickTest(); 