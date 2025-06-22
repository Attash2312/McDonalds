const mongoose = require('mongoose');
const User = require('../models/user');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

// Sample users
const sampleUsers = [
    {
        name: 'Admin User',
        email: 'admin@mcdonalds.com',
        password: 'admin123',
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false
    }
];

// Sample menu items
const sampleMenuItems = [
    {
        name: 'Big Mac',
        price: 5.99,
        description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun',
        image: '/images/item-1.jpg',
        category: 'beef',
        isAvailable: true
    },
    {
        name: 'Quarter Pounder',
        price: 6.49,
        description: 'Quarter pound of 100% fresh beef with cheese, lettuce, tomato, pickles, onions, and mayo',
        image: '/images/item-2.jpg',
        category: 'beef',
        isAvailable: true
    },
    {
        name: 'Chicken McNuggets',
        price: 4.99,
        description: 'Bite-sized pieces of white meat chicken, breaded and fried',
        image: '/images/item-3.jpg',
        category: 'chicken-&-fish',
        isAvailable: true
    }
];

async function setupDatabase() {
    try {
        await connectDB();
        
        console.log('Setting up database...\n');
        
        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Menu.deleteMany({});
        await Order.deleteMany({});
        await Complaint.deleteMany({});
        
        // Create users
        console.log('Creating users...');
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`Created user: ${user.name} (${user.email})`);
        }
        
        // Create menu items
        console.log('\nCreating menu items...');
        const createdMenuItems = [];
        for (const menuData of sampleMenuItems) {
            const menuItem = new Menu(menuData);
            await menuItem.save();
            createdMenuItems.push(menuItem);
            console.log(`Created menu item: ${menuItem.name}`);
        }
        
        // Create sample orders for regular users
        console.log('\nCreating sample orders...');
        const regularUsers = createdUsers.filter(user => !user.isAdmin);
        
        for (const user of regularUsers) {
            // Create 2-3 orders per user
            for (let i = 0; i < 3; i++) {
                const order = new Order({
                    userId: user._id,
                    user: {
                        name: user.name,
                        phone: '555-0123',
                        address: '123 Main St, City, State'
                    },
                    items: [
                        {
                            product: createdMenuItems[0]._id,
                            title: createdMenuItems[0].name,
                            quantity: 1,
                            price: createdMenuItems[0].price
                        },
                        {
                            product: createdMenuItems[1]._id,
                            title: createdMenuItems[1].name,
                            quantity: 1,
                            price: createdMenuItems[1].price
                        }
                    ],
                    totalAmount: createdMenuItems[0].price + createdMenuItems[1].price,
                    status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)]
                });
                await order.save();
                console.log(`Created order for ${user.name}: $${order.totalAmount}`);
            }
        }
        
        // Create sample complaints
        console.log('\nCreating sample complaints...');
        const orders = await Order.find();
        const sampleComplaints = [
            "My order was delivered cold and the fries were soggy. I expected better quality for the price I paid.",
            "The burger was missing the cheese that I ordered. This is the second time this has happened.",
            "The delivery took much longer than expected and the food was not fresh when it arrived.",
            "I received the wrong order completely. I ordered a Big Mac but got a Quarter Pounder instead.",
            "The packaging was damaged and my drink spilled all over the bag. Very disappointing experience."
        ];
        
        for (let i = 0; i < Math.min(orders.length, sampleComplaints.length); i++) {
            const complaint = new Complaint({
                userId: orders[i].userId,
                orderId: orders[i]._id,
                message: sampleComplaints[i],
                status: ['pending', 'in-progress', 'resolved', 'closed'][Math.floor(Math.random() * 4)]
            });
            await complaint.save();
            console.log(`Created complaint ${i + 1}: ${complaint.status}`);
        }
        
        console.log('\n✅ Database setup completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('Admin: admin@mcdonalds.com / admin123');
        console.log('User 1: john@example.com / password123');
        console.log('User 2: jane@example.com / password123');
        console.log('\n🚀 You can now start the server with: npm start');
        
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

setupDatabase(); 