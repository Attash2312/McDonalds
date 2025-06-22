const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
require('dotenv').config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}\n`);
        
        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections in database:');
        collections.forEach(col => console.log(`  - ${col.name}`));
        console.log();
        
        // Check users
        const userCount = await User.countDocuments();
        console.log(`👥 Users: ${userCount}`);
        if (userCount > 0) {
            const users = await User.find().select('name email isAdmin');
            users.forEach(user => {
                console.log(`  - ${user.name} (${user.email}) ${user.isAdmin ? '[ADMIN]' : ''}`);
            });
        }
        console.log();
        
        // Check orders
        const orderCount = await Order.countDocuments();
        console.log(`📦 Orders: ${orderCount}`);
        if (orderCount > 0) {
            const orders = await Order.find().select('userId totalAmount status createdAt').limit(3);
            orders.forEach(order => {
                console.log(`  - Order: $${order.totalAmount} (${order.status}) - ${order.createdAt.toLocaleDateString()}`);
            });
        }
        console.log();
        
        // Check complaints
        const complaintCount = await Complaint.countDocuments();
        console.log(`⚠️  Complaints: ${complaintCount}`);
        if (complaintCount > 0) {
            const complaints = await Complaint.find().select('userId orderId status createdAt').limit(3);
            complaints.forEach(complaint => {
                console.log(`  - Complaint: ${complaint.status} - ${complaint.createdAt.toLocaleDateString()}`);
            });
        }
        
        console.log('\n✅ Database test completed successfully!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

testDatabase(); 