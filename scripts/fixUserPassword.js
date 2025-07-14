const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('../models/user');

const fixUserPassword = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Find the user
    const user = await User.findOne({ email: 'attash1223@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', user.name);
    console.log('Current password (first 20 chars):', user.password.substring(0, 20));
    console.log('Is hashed:', user.password.startsWith('$2a$'));

    // If password is not hashed, hash it
    if (!user.password.startsWith('$2a$')) {
      console.log('Password is not hashed, hashing now...');
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      console.log('Password hashed successfully');
    } else {
      console.log('Password is already hashed');
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserPassword(); 