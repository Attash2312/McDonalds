const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to ensure they're registered
const User = require('../models/user');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');

async function testAllModels() {
    try {
        console.log('🔍 Testing all models and relationships...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Test 1: Check if all models are registered
        console.log('\n📋 Testing model registration:');
        const modelNames = mongoose.modelNames();
        console.log('Registered models:', modelNames);
        
        // Test 2: Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Collections in database:');
        collections.forEach(col => console.log(`  - ${col.name}`));
        
        // Test 3: Check User model
        console.log('\n👥 Testing User model:');
        const userCount = await User.countDocuments();
        console.log(`  Users: ${userCount}`);
        
        if (userCount > 0) {
            const users = await User.find().limit(3);
            users.forEach(user => {
                console.log(`    - ${user.name} (${user.email}) - ID: ${user._id}`);
            });
        }
        
        // Test 4: Check Menu model
        console.log('\n🍔 Testing Menu model:');
        const menuCount = await Menu.countDocuments();
        console.log(`  Menu items: ${menuCount}`);
        
        if (menuCount > 0) {
            const menuItems = await Menu.find().limit(3);
            menuItems.forEach(item => {
                console.log(`    - ${item.name} - $${item.price} - ID: ${item._id}`);
            });
        }
        
        // Test 5: Check Order model
        console.log('\n📦 Testing Order model:');
        const orderCount = await Order.countDocuments();
        console.log(`  Orders: ${orderCount}`);
        
        if (orderCount > 0) {
            const orders = await Order.find().limit(3);
            orders.forEach(order => {
                console.log(`    - Order ID: ${order._id}`);
                console.log(`      User ID: ${order.userId || 'MISSING'}`);
                console.log(`      Items: ${order.items.length}`);
                console.log(`      Amount: $${order.totalAmount}`);
                console.log(`      Status: ${order.status}`);
            });
        }
        
        // Test 6: Check Complaint model
        console.log('\n⚠️  Testing Complaint model:');
        const complaintCount = await Complaint.countDocuments();
        console.log(`  Complaints: ${complaintCount}`);
        
        if (complaintCount > 0) {
            const complaints = await Complaint.find().limit(3);
            complaints.forEach(complaint => {
                console.log(`    - Complaint ID: ${complaint._id}`);
                console.log(`      User ID: ${complaint.userId}`);
                console.log(`      Order ID: ${complaint.orderId}`);
                console.log(`      Status: ${complaint.status}`);
            });
        }
        
        // Test 7: Test populate functionality
        console.log('\n🔗 Testing populate functionality:');
        
        if (orderCount > 0) {
            const testOrder = await Order.findOne().populate('items.product');
            if (testOrder) {
                console.log(`  Successfully populated order: ${testOrder._id}`);
                console.log(`    Items with product data: ${testOrder.items.length}`);
                testOrder.items.forEach(item => {
                    console.log(`      - ${item.title} (Product: ${item.product ? item.product.name : 'MISSING'})`);
                });
            }
        }
        
        // Test 8: Test complaint populate
        console.log('\n🔗 Testing complaint populate:');
        
        if (complaintCount > 0) {
            const testComplaint = await Complaint.findOne()
                .populate('userId', 'name email')
                .populate('orderId', 'totalAmount status');
            
            if (testComplaint) {
                console.log(`  Successfully populated complaint: ${testComplaint._id}`);
                console.log(`    User: ${testComplaint.userId ? testComplaint.userId.name : 'MISSING'}`);
                console.log(`    Order: $${testComplaint.orderId ? testComplaint.orderId.totalAmount : 'MISSING'}`);
            }
        }
        
        console.log('\n✅ All model tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error testing models:', error);
        console.error('Full error details:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

testAllModels(); 