const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function checkOrderStatuses() {
    try {
        await connectDB();
        console.log('Database connected successfully');

        const Order = require('../models/Order');
        
        // Get all orders with their statuses
        const orders = await Order.find({}, 'status createdAt totalAmount userId user');
        
        console.log(`\nTotal orders found: ${orders.length}`);
        
        // Group by status
        const statusCounts = {};
        orders.forEach(order => {
            const status = order.status || 'undefined';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        console.log('\nOrder status distribution:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`  ${status}: ${count} orders`);
        });
        
        // Show sample orders for each status
        console.log('\nSample orders by status:');
        Object.keys(statusCounts).forEach(status => {
            const sampleOrder = orders.find(o => (o.status || 'undefined') === status);
            if (sampleOrder) {
                console.log(`\n${status.toUpperCase()} order sample:`);
                console.log(`  ID: ${sampleOrder._id}`);
                console.log(`  Amount: $${sampleOrder.totalAmount}`);
                console.log(`  Date: ${sampleOrder.createdAt}`);
                console.log(`  User ID: ${sampleOrder.userId || 'None'}`);
                console.log(`  User Name: ${sampleOrder.user ? sampleOrder.user.name : 'None'}`);
            }
        });
        
        // Check for any orders without proper user data
        const ordersWithoutUser = orders.filter(o => !o.userId && !o.user);
        if (ordersWithoutUser.length > 0) {
            console.log(`\n⚠️  Found ${ordersWithoutUser.length} orders without user data`);
        }
        
        console.log('\nOrder status check completed!');
        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
}

checkOrderStatuses(); 