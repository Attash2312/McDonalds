const mongoose = require('mongoose');
const User = require('../models/user');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
require('dotenv').config();

async function createSampleOrders() {
    try {
        console.log('Connecting to database...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Get all users
        const users = await User.find();
        console.log(`\nFound ${users.length} users`);
        
        // Get menu items
        const menuItems = await Menu.find();
        console.log(`Found ${menuItems.length} menu items`);
        
        if (menuItems.length === 0) {
            console.log('No menu items found. Creating sample menu items...');
            
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
            
            for (const menuData of sampleMenuItems) {
                const menuItem = new Menu(menuData);
                await menuItem.save();
                console.log(`Created menu item: ${menuItem.name}`);
            }
            
            // Refresh menu items
            const newMenuItems = await Menu.find();
            menuItems.push(...newMenuItems);
        }
        
        // Create orders for each user (except admin)
        const regularUsers = users.filter(user => !user.isAdmin);
        
        for (const user of regularUsers) {
            console.log(`\nCreating orders for ${user.name}...`);
            
            // Create 2-3 orders per user
            for (let i = 0; i < 3; i++) {
                const orderItems = [];
                let totalAmount = 0;
                
                // Add 1-2 random menu items
                const numItems = Math.floor(Math.random() * 2) + 1;
                const shuffledItems = menuItems.sort(() => 0.5 - Math.random());
                
                for (let j = 0; j < numItems; j++) {
                    const item = shuffledItems[j];
                    const quantity = Math.floor(Math.random() * 2) + 1;
                    const itemTotal = item.price * quantity;
                    
                    orderItems.push({
                        product: item._id,
                        title: item.name,
                        quantity: quantity,
                        price: item.price
                    });
                    
                    totalAmount += itemTotal;
                }
                
                const order = new Order({
                    userId: user._id,
                    user: {
                        name: user.name,
                        phone: '555-0123',
                        address: '123 Main St, City, State'
                    },
                    items: orderItems,
                    totalAmount: totalAmount,
                    status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)]
                });
                
                await order.save();
                console.log(`  Created order: $${totalAmount.toFixed(2)} (${order.status})`);
            }
        }
        
        console.log('\n✅ Sample orders created successfully!');
        
        // Show summary
        const totalOrders = await Order.countDocuments();
        console.log(`\nTotal orders in database: ${totalOrders}`);
        
        const ordersByUser = await Order.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);
        
        console.log('\nOrders by user:');
        for (const userOrder of ordersByUser) {
            const user = await User.findById(userOrder._id);
            console.log(`  ${user.name}: ${userOrder.count} orders`);
        }
        
    } catch (error) {
        console.error('Error creating sample orders:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

createSampleOrders(); 