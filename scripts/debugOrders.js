const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
require('dotenv').config();

async function debugOrders() {
    try {
        console.log('🔍 Debugging orders and complaints...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Check all users
        const users = await User.find();
        console.log(`\n👥 Users in database:`);
        users.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - ID: ${user._id}`);
        });
        
        // Check all orders
        const orders = await Order.find();
        console.log(`\n📦 Orders in database:`);
        orders.forEach(order => {
            console.log(`  - Order ID: ${order._id}`);
            console.log(`    User ID: ${order.userId || 'MISSING USER ID'}`);
            console.log(`    Amount: $${order.totalAmount}`);
            console.log(`    Status: ${order.status}`);
            console.log(`    Date: ${order.createdAt}`);
            console.log('    ---');
        });
        
        // Check orders with missing userId
        const ordersWithoutUserId = orders.filter(order => !order.userId);
        console.log(`\n⚠️  Orders without userId: ${ordersWithoutUserId.length}`);
        
        if (ordersWithoutUserId.length > 0) {
            console.log('Fixing orders without userId...');
            
            // Get the first regular user
            const regularUser = users.find(user => !user.isAdmin);
            
            if (regularUser) {
                for (const order of ordersWithoutUserId) {
                    await Order.findByIdAndUpdate(order._id, { userId: regularUser._id });
                    console.log(`  Fixed order ${order._id} - assigned to ${regularUser.name}`);
                }
            }
        }
        
        // Check complaints
        const complaints = await Complaint.find();
        console.log(`\n⚠️  Complaints in database:`);
        complaints.forEach(complaint => {
            console.log(`  - Complaint ID: ${complaint._id}`);
            console.log(`    User ID: ${complaint.userId || 'MISSING USER ID'}`);
            console.log(`    Order ID: ${complaint.orderId || 'MISSING ORDER ID'}`);
            console.log(`    Status: ${complaint.status}`);
            console.log('    ---');
        });
        
        // Test what a specific user would see
        const testUser = users.find(user => !user.isAdmin);
        if (testUser) {
            console.log(`\n🧪 Testing what ${testUser.name} would see:`);
            
            const userOrders = await Order.find({ userId: testUser._id });
            console.log(`  Orders for ${testUser.name}: ${userOrders.length}`);
            
            const userComplaints = await Complaint.find({ userId: testUser._id });
            console.log(`  Complaints for ${testUser.name}: ${userComplaints.length}`);
        }
        
        console.log(`\n✅ Debug completed!`);
        console.log(`\n📋 To test:`);
        console.log(`1. Login as: ${users.find(u => !u.isAdmin)?.email || 'any user'}`);
        console.log(`2. Check My Orders page`);
        console.log(`3. Check My Complaints page`);
        
    } catch (error) {
        console.error('❌ Error debugging:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

debugOrders(); 