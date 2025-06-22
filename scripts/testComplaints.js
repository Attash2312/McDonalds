const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
require('dotenv').config();

async function testComplaints() {
    try {
        console.log('Testing complaint functionality...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Test 1: Check if users exist
        const users = await User.find();
        console.log(`\n✅ Found ${users.length} users`);
        
        // Test 2: Check if orders exist
        const orders = await Order.find();
        console.log(`✅ Found ${orders.length} orders`);
        
        // Test 3: Check if complaints exist
        const complaints = await Complaint.find();
        console.log(`✅ Found ${complaints.length} complaints`);
        
        // Test 4: Check user-order relationships
        const regularUsers = users.filter(user => !user.isAdmin);
        console.log(`\n📋 Testing user-order relationships:`);
        
        for (const user of regularUsers) {
            const userOrders = await Order.find({ userId: user._id });
            console.log(`  ${user.name}: ${userOrders.length} orders`);
            
            if (userOrders.length === 0) {
                console.log(`    ⚠️  Warning: ${user.name} has no orders - cannot submit complaints`);
            }
        }
        
        // Test 5: Check complaint data integrity
        console.log(`\n📋 Testing complaint data integrity:`);
        
        for (const complaint of complaints) {
            console.log(`\n  Complaint ID: ${complaint._id}`);
            console.log(`    User ID: ${complaint.userId}`);
            console.log(`    Order ID: ${complaint.orderId}`);
            console.log(`    Message: ${complaint.message ? complaint.message.substring(0, 50) + '...' : 'No message'}`);
            console.log(`    Status: ${complaint.status}`);
            
            // Check if user exists
            const user = await User.findById(complaint.userId);
            if (!user) {
                console.log(`    ❌ Error: User not found for complaint`);
            } else {
                console.log(`    ✅ User: ${user.name} (${user.email})`);
            }
            
            // Check if order exists
            const order = await Order.findById(complaint.orderId);
            if (!order) {
                console.log(`    ❌ Error: Order not found for complaint`);
            } else {
                console.log(`    ✅ Order: $${order.totalAmount} (${order.status})`);
            }
        }
        
        // Test 6: Create a test complaint if needed
        if (complaints.length === 0) {
            console.log(`\n📝 Creating a test complaint...`);
            
            const testUser = regularUsers[0];
            const testOrder = await Order.findOne({ userId: testUser._id });
            
            if (testUser && testOrder) {
                const testComplaint = new Complaint({
                    userId: testUser._id,
                    orderId: testOrder._id,
                    message: 'This is a test complaint to verify the system is working properly.',
                    status: 'pending'
                });
                
                await testComplaint.save();
                console.log(`✅ Created test complaint for ${testUser.name}`);
            } else {
                console.log(`❌ Cannot create test complaint - missing user or order`);
            }
        }
        
        console.log(`\n🎉 Complaint functionality test completed!`);
        console.log(`\n📋 Next steps:`);
        console.log(`1. Start the server: npm start`);
        console.log(`2. Login as a user (e.g., john@example.com / password123)`);
        console.log(`3. Go to Contact Us page and submit a complaint`);
        console.log(`4. Check My Complaints page`);
        console.log(`5. Login as admin (admin@mcdonalds.com / admin123) to manage complaints`);
        
    } catch (error) {
        console.error('❌ Error testing complaints:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

testComplaints(); 