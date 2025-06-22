const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function fixUsers() {
    try {
        console.log('Connecting to database...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Find the problematic user
        const users = await User.find();
        console.log('\nCurrent users:');
        users.forEach(user => {
            console.log(`- ID: ${user._id}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  isAdmin: ${user.isAdmin}`);
            console.log('---');
        });
        
        // Fix users with missing names
        const usersToFix = users.filter(user => !user.name || user.name === 'undefined');
        
        if (usersToFix.length > 0) {
            console.log(`\nFound ${usersToFix.length} users with missing names. Fixing...`);
            
            for (const user of usersToFix) {
                // Set a default name based on email
                const emailName = user.email.split('@')[0];
                const newName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                
                await User.findByIdAndUpdate(user._id, { name: newName });
                console.log(`Fixed user ${user.email}: name set to "${newName}"`);
            }
        } else {
            console.log('\nAll users have proper names.');
        }
        
        // Create additional test users if needed
        const testUsers = [
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
        
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const newUser = new User(userData);
                await newUser.save();
                console.log(`Created test user: ${userData.name} (${userData.email})`);
            } else {
                console.log(`Test user already exists: ${userData.name} (${userData.email})`);
            }
        }
        
        console.log('\n✅ User fixes completed!');
        
        // Show final user list
        const finalUsers = await User.find();
        console.log('\nFinal user list:');
        finalUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) ${user.isAdmin ? '[ADMIN]' : ''}`);
        });
        
    } catch (error) {
        console.error('Error fixing users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed.');
    }
}

fixUsers(); 