const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const User = require('../models/user');
const Order = require('../models/Order');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleComplaints = [
    {
        message: "My order was delivered cold and the fries were soggy. I expected better quality for the price I paid.",
        status: "pending"
    },
    {
        message: "The burger was missing the cheese that I ordered. This is the second time this has happened.",
        status: "in-progress"
    },
    {
        message: "The delivery took much longer than expected and the food was not fresh when it arrived.",
        status: "resolved"
    },
    {
        message: "I received the wrong order completely. I ordered a Big Mac but got a Quarter Pounder instead.",
        status: "closed"
    },
    {
        message: "The packaging was damaged and my drink spilled all over the bag. Very disappointing experience.",
        status: "pending"
    }
];

async function createSampleComplaints() {
    try {
        // Get a user and some orders
        const user = await User.findOne();
        const orders = await Order.find({ userId: user._id }).limit(5);

        if (!user) {
            console.log('No user found. Please create a user first.');
            return;
        }

        if (orders.length === 0) {
            console.log('No orders found for the user. Please create some orders first.');
            return;
        }

        console.log(`Creating ${Math.min(sampleComplaints.length, orders.length)} sample complaints...`);

        for (let i = 0; i < Math.min(sampleComplaints.length, orders.length); i++) {
            const complaint = new Complaint({
                userId: user._id,
                orderId: orders[i]._id,
                message: sampleComplaints[i].message,
                status: sampleComplaints[i].status
            });

            await complaint.save();
            console.log(`Created complaint ${i + 1}: ${sampleComplaints[i].status}`);
        }

        console.log('Sample complaints created successfully!');
        console.log(`User: ${user.name} (${user.email})`);
        console.log(`Created ${Math.min(sampleComplaints.length, orders.length)} complaints`);

    } catch (error) {
        console.error('Error creating sample complaints:', error);
    } finally {
        mongoose.connection.close();
    }
}

createSampleComplaints(); 